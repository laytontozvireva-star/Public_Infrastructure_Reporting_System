
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function Knowledge() {
  const [knowledge, setKnowledge] = useState([]);
  const [loadingKnowledge, setLoadingKnowledge] = useState(true);
  const [knowledgeError, setKnowledgeError] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState("");

  useEffect(() => {
    async function loadKnowledge() {
      try {
        const response = await fetch("/api/knowledge");

        if (!response.ok) {
          throw new Error("Failed to load infrastructure knowledge.");
        }

        const data = await response.json();
        setKnowledge(data);
      } catch (err) {
        console.error(err);
        setKnowledgeError("Unable to load infrastructure knowledge.");
      } finally {
        setLoadingKnowledge(false);
      }
    }

    loadKnowledge();
  }, []);

  async function askPIRS(event) {
    event.preventDefault();

    if (!question.trim()) {
      setAskError("Please enter an infrastructure question.");
      return;
    }

    setAsking(true);
    setAskError("");
    setAnswer("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to get an answer from PIRS."
        );
      }

      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setAskError(
        "Unable to connect to the PIRS knowledge assistant."
      );
    } finally {
      setAsking(false);
    }
  }

  function handleExample(example) {
    setQuestion(example);
    setAnswer("");
    setAskError("");
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* PAGE HEADER */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            PIRS Knowledge Base
          </p>

          <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
            Infrastructure Knowledge Assistant
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            Ask questions about infrastructure problems in Zimbabwe and get
            practical information about responsible authorities, reporting
            procedures, and safety guidance.
          </p>
        </div>

        {/* AI ASSISTANT */}
        <section className="mb-12 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              🤖
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Ask PIRS
              </h2>

              <p className="text-sm text-gray-500">
                Powered by the PIRS knowledge base
              </p>
            </div>
          </div>

          <form onSubmit={askPIRS}>
            <label
              htmlFor="pirs-question"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              What infrastructure problem are you experiencing?
            </label>

            <textarea
              id="pirs-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Example: There is a pothole on a road in Harare. Who is responsible and how can I report it?"
              rows="4"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={asking}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {asking ? "Thinking..." : "Ask PIRS"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuestion("");
                  setAnswer("");
                  setAskError("");
                }}
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </form>

          {/* EXAMPLE QUESTIONS */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">
              Try an example:
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleExample(
                    "There is a water supply problem in Harare. Who is responsible and how can I report it?"
                  )
                }
                className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                💧 Water problem
              </button>

              <button
                type="button"
                onClick={() =>
                  handleExample(
                    "There is an electricity fault in Harare. Who should I contact and what safety precautions should I take?"
                  )
                }
                className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                ⚡ Electricity fault
              </button>

              <button
                type="button"
                onClick={() =>
                  handleExample(
                    "There is a pothole on a road in Harare. Who is responsible and how can I report it?"
                  )
                }
                className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                🛣️ Pothole
              </button>

              <button
                type="button"
                onClick={() =>
                  handleExample(
                    "There is a damaged traffic light in Harare. Who is responsible and what should I do?"
                  )
                }
                className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                🚦 Traffic light
              </button>
            </div>
          </div>

          {/* ERROR */}
          {askError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-700">
                {askError}
              </p>
            </div>
          )}

          {/* ANSWER */}
          {answer && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-green-200 bg-green-50">

              <div className="border-b border-green-200 bg-white px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>

                  <h3 className="font-bold text-gray-900">
                    PIRS Answer
                  </h3>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Generated using information retrieved from the PIRS
                  infrastructure knowledge base.
                </p>
              </div>

              <div className="px-5 py-6">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="mb-4 text-2xl font-bold text-gray-900">
                        {children}
                      </h1>
                    ),

                    h2: ({ children }) => (
                      <h2 className="mb-3 mt-6 text-xl font-bold text-gray-900">
                        {children}
                      </h2>
                    ),

                    h3: ({ children }) => (
                      <h3 className="mb-2 mt-5 text-lg font-bold text-gray-900">
                        {children}
                      </h3>
                    ),

                    p: ({ children }) => (
                      <p className="mb-4 text-sm leading-7 text-gray-700">
                        {children}
                      </p>
                    ),

                    strong: ({ children }) => (
                      <strong className="font-bold text-gray-900">
                        {children}
                      </strong>
                    ),

                    ul: ({ children }) => (
                      <ul className="mb-4 list-disc space-y-2 pl-6 text-sm leading-7 text-gray-700">
                        {children}
                      </ul>
                    ),

                    ol: ({ children }) => (
                      <ol className="mb-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-gray-700">
                        {children}
                      </ol>
                    ),

                    li: ({ children }) => (
                      <li>{children}</li>
                    ),

                    blockquote: ({ children }) => (
                      <blockquote className="my-4 border-l-4 border-blue-400 bg-blue-50 px-4 py-3 text-sm text-gray-700">
                        {children}
                      </blockquote>
                    ),

                    code: ({ children }) => (
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-gray-800">
                        {children}
                      </code>
                    ),

                    hr: () => (
                      <hr className="my-6 border-gray-200" />
                    ),
                  }}
                >
                  {answer}
                </ReactMarkdown>
              </div>
            </div>
          )}

        </section>

        {/* KNOWLEDGE BASE */}
        <section>
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Knowledge Library
            </p>

            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Infrastructure Information
            </h2>

            <p className="mt-2 max-w-3xl text-gray-600">
              Browse information collected for infrastructure services,
              safety guidance, reporting procedures, and responsible
              authorities in Zimbabwe.
            </p>
          </div>

          {loadingKnowledge && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-600">
                Loading infrastructure knowledge...
              </p>
            </div>
          )}

          {knowledgeError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="font-medium text-red-700">
                {knowledgeError}
              </p>
            </div>
          )}

          {!loadingKnowledge &&
            !knowledgeError &&
            knowledge.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-600">
                  No infrastructure knowledge is currently available.
                </p>
              </div>
            )}

          {!loadingKnowledge &&
            !knowledgeError &&
            knowledge.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {knowledge.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.title || item.category}
                      </h3>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {item.category}
                      </span>
                    </div>

                    {item.problem && (
                      <div className="mb-5">
                        <h4 className="mb-1 font-semibold text-gray-800">
                          Problem
                        </h4>

                        <p className="text-gray-600">
                          {item.problem}
                        </p>
                      </div>
                    )}

                    {item.responsibleAuthority && (
                      <div className="mb-5">
                        <h4 className="mb-1 font-semibold text-gray-800">
                          Responsible Authority
                        </h4>

                        <p className="text-gray-600">
                          {item.responsibleAuthority}
                        </p>
                      </div>
                    )}

                    {item.locationContext && (
                      <div className="mb-5">
                        <h4 className="mb-1 font-semibold text-gray-800">
                          Location
                        </h4>

                        <p className="text-gray-600">
                          {item.locationContext}
                        </p>
                      </div>
                    )}

                    {item.requiredInformation?.length > 0 && (
                      <div className="mb-5">
                        <h4 className="mb-2 font-semibold text-gray-800">
                          Information to Provide
                        </h4>

                        <ul className="list-disc space-y-1 pl-5 text-gray-600">
                          {item.requiredInformation.map(
                            (info, index) => (
                              <li key={index}>{info}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {item.sourceName && (
                      <div className="mt-6 border-t border-gray-100 pt-4">
                        <p className="text-xs text-gray-500">
                          Source: {item.sourceName}
                        </p>

                        {item.source && (
                          <a
                            href={item.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-sm font-medium text-blue-600 hover:underline"
                          >
                            View official source →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </section>
      </div>
    </div>
  );
}

export default Knowledge;