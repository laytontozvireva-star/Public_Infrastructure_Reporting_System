const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@sanity/client");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2026-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN,
});

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

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Gemini API key is missing.",
      });
    }

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

    const knowledgeText = knowledge
      .map(
        (item) => `
Title: ${item.title || ""}
Category: ${item.category || ""}
Problem: ${item.problem || ""}
Safety Guidance: ${item.safetyGuidance || ""}
Reporting Procedure: ${item.reportingProcedure || ""}
Required Information: ${item.requiredInformation || ""}
Responsible Authority: ${item.responsibleAuthority || ""}
Location Context: ${item.locationContext || ""}
Summary: ${item.summary || ""}
Source: ${item.sourceName || ""}
`
      )
      .join("\n---\n");

    const prompt = `
You are the PIRS Infrastructure Knowledge Assistant.

Answer the user's question using ONLY the infrastructure knowledge provided below.

If the information is not available in the knowledge base, clearly say that the PIRS knowledge base does not contain enough information to answer the question.

Give a clear, helpful answer.
Use Markdown where useful.

USER QUESTION:
${question.trim()}

INFRASTRUCTURE KNOWLEDGE:
${knowledgeText}
`;

    const models = [
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
    ];

    let answer = null;
    let lastError = null;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        const result = await model.generateContent(prompt);

        answer = result.response.text();

        if (answer) {
          break;
        }
      } catch (error) {
        lastError = error;
        console.error(`Gemini model ${modelName} failed:`, error.message);
      }
    }

    if (!answer) {
      console.error("All Gemini models failed:", lastError);

      return res.status(500).json({
        success: false,
        error: "Gemini could not generate an answer.",
      });
    }

    return res.status(200).json({
      success: true,
      question: question.trim(),
      answer,
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