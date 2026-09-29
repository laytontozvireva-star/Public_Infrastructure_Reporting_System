const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function normalizeText(value = "") {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getRelevantKnowledge(knowledge, question) {
  const normalizedQuestion = normalizeText(question);
  const questionWords = new Set(
    normalizedQuestion
      .split(" ")
      .filter((word) => word.length >= 4)
  );

  const scored = knowledge.map((item) => {
    const searchableText = normalizeText(
      [
        item.title,
        item.category,
        item.problem,
        item.summary,
        item.responsibleAuthority,
        item.locationContext,
        ...(item.safetyGuidance || []),
        ...(item.reportingProcedure || []),
        ...(item.requiredInformation || []),
      ]
        .filter(Boolean)
        .join(" ")
    );

    const searchableWords = new Set(searchableText.split(" "));

    let score = 0;

    // Match individual question words
    for (const word of questionWords) {
      if (searchableWords.has(word)) {
        score += 1;
      }
    }

    // Give extra weight to category matches
    const categories = [
      "electricity",
      "water",
      "sewer",
      "roads",
      "traffic",
      "dumping",
      "trees",
    ];

    for (const category of categories) {
      if (
        normalizedQuestion.includes(category) &&
        normalizeText(item.category).includes(category)
      ) {
        score += 5;
      }
    }

    // Give extra weight to authority/source/title matches
    if (
      item.title &&
      normalizedQuestion.includes(normalizeText(item.title))
    ) {
      score += 5;
    }

    if (
      item.responsibleAuthority &&
      normalizedQuestion.includes(normalizeText(item.responsibleAuthority))
    ) {
      score += 4;
    }

    return {
      ...item,
      relevanceScore: score,
    };
  });

  const relevant = scored
    .filter((item) => item.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // If nothing matches, provide a small amount of knowledge so Gemini
  // can correctly say that the knowledge base lacks enough information.
  if (relevant.length === 0) {
    return knowledge.slice(0, 3);
  }

  return relevant.slice(0, 6);
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed.",
      });
    }

    const { question } = req.body || {};

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please provide a question.",
      });
    }

    const cleanQuestion = question.trim();

    // Prevent unnecessarily huge requests.
    if (cleanQuestion.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Please keep your question under 1000 characters.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Gemini API key is missing.",
      });
    }

    if (!process.env.SANITY_PROJECT_ID) {
      return res.status(500).json({
        success: false,
        error: "Sanity project ID is missing.",
      });
    }

    if (!process.env.SANITY_TOKEN && !process.env.SANITY_API_TOKEN) {
      return res.status(500).json({
        success: false,
        error: "Sanity API token is missing.",
      });
    }

    const { createClient } = await import("@sanity/client");

    const sanityClient = createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || "production",
      apiVersion: "2026-01-01",
      useCdn: false,
      token: process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN,
    });

    const knowledge = await sanityClient.fetch(`
      *[_type == "infrastructureKnowledge"] | order(_createdAt desc) {
        _id,
        title,
        category,
        problem,
        safetyGuidance,
        reportingProcedure,
        requiredInformation,
        responsibleAuthority,
        locationContext,
        summary,
        sourceName,
        source
      }
    `);

    if (!knowledge || knowledge.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No infrastructure knowledge is available.",
      });
    }

    const relevantKnowledge = getRelevantKnowledge(
      knowledge,
      cleanQuestion
    );

    const knowledgeText = relevantKnowledge
      .map(
        (item) => `
Knowledge ID: ${item._id || ""}
Title: ${item.title || ""}
Category: ${item.category || ""}
Problem: ${item.problem || ""}
Safety Guidance: ${JSON.stringify(item.safetyGuidance || [])}
Reporting Procedure: ${JSON.stringify(item.reportingProcedure || [])}
Required Information: ${JSON.stringify(item.requiredInformation || [])}
Responsible Authority: ${item.responsibleAuthority || ""}
Location Context: ${item.locationContext || ""}
Summary: ${item.summary || ""}
Source Name: ${item.sourceName || ""}
Source URL: ${item.source || ""}
`
      )
      .join("\n---\n");

    const prompt = `
You are the PIRS Infrastructure Knowledge Assistant.

Your job is to help citizens understand public infrastructure problems
and how to report them.

IMPORTANT RULES:

1. Answer using ONLY the provided PIRS knowledge.
2. Do not invent authorities, phone numbers, procedures, addresses,
   safety instructions, or other facts.
3. If the knowledge does not contain enough information, clearly say so.
4. Give practical and easy-to-understand guidance.
5. Prioritize safety when the issue could be dangerous.
6. Do not claim that an authority is responsible unless the provided
   knowledge supports that statement.
7. Do not invent sources.
8. Do not include a separate "Sources" section in your answer.
   The application will display the verified sources separately.

USER QUESTION:
${cleanQuestion}

RELEVANT PIRS KNOWLEDGE:
${knowledgeText}
`;

 const models = [
  "gemini-3.5-flash",
];

    let answer = null;
    let lastError = null;
    let successfulModel = null;

    for (const modelName of models) {
      try {
        console.log(`Trying Gemini model: ${modelName}`);

        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        const result = await model.generateContent(prompt);

        answer = result.response.text();

        if (answer) {
          successfulModel = modelName;
          console.log(`Gemini model succeeded: ${modelName}`);
          break;
        }
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini model ${modelName} failed:`,
          error.message
        );
      }
    }

  if (!answer) {
  console.error("All Gemini models failed:", lastError);

  return res.status(500).json({
    success: false,
    error: "Gemini could not generate an answer.",
    details: lastError?.message || "Unknown Gemini error",
  });
}
    const sources = relevantKnowledge
      .filter((item) => item.sourceName || item.source)
      .map((item) => ({
        id: item._id,
        title: item.title || item.category || "PIRS Knowledge Article",
        category: item.category || null,
        sourceName: item.sourceName || null,
        source: item.source || null,
      }));

    return res.status(200).json({
      success: true,
      question: cleanQuestion,
      answer,
      model: successfulModel,
      sources,
    });
  } catch (error) {
    console.error("Ask API error:", error);

    return res.status(500).json({
      success: false,
      error: "Something went wrong while processing the question.",
      message: error.message,
    });
  }
};