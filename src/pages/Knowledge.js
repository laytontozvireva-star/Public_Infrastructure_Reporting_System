
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Search,
  Droplets,
  Zap,
  Route,
  TrafficCone,
  HelpCircle,
  Loader2,
  AlertCircle,
  ExternalLink,
  Send,
} from "lucide-react";

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

      // Read the API response even when the server returns an error.
      const data = await response.json();

      // Preserve the useful error message returned by the backend.
      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to get an answer from PIRS."
        );
      }

      setAnswer(data.answer);
    } catch (err) {
      console.error("AI Assistant error:", err);

      setAskError(
        err.message ||
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

  const examples = [
    {
      text: "Water problem",
      query:
        "There is a water supply problem in Harare. Who is responsible and how can I report it?",
      icon: Droplets,
    },
    {
      text: "Electricity fault",
      query:
        "There is an electricity fault in Harare. Who should I contact and what safety precautions should I take?",
      icon: Zap,
    },
    {
      text: "Pothole",
      query:
        "There is a pothole on a road in Harare. Who is responsible and how can I report it?",
      icon: Route,
    },
    {
      text: "Traffic light",
      query:
        "There is a damaged traffic light in Harare. Who is responsible and what should I do?",
      icon: TrafficCone,
    },
  ];


  const categoryImages = {
    'Electricity': '/images/knowledge-electricity.jpg',
    'Water': '/images/knowledge-water.jpg',
    'Roads': '/images/knowledge-roads.jpg',
    'Traffic Lights': '/images/knowledge-traffic.jpg',
    'Illegal Dumping': '/images/knowledge-dumping.jpg',
    'Sewer': '/images/water-team.jpg',
    'Fallen Trees': '/images/dumping-market.jpg',
  };

  return (
    <div className="page-wrapper min-h-screen relative overflow-hidden py-10 transition-colors duration-200">
      <div className="absolute inset-0 z-0">
        <img src="/images/traffic-intersection.jpg" alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#F8FAFC]/90 dark:bg-[#181513]/90 backdrop-blur-[8px]"></div>
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* PAGE HEADER */}
        <div className="mb-10 border-b border-stone-200 dark:border-stone-800 pb-8">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-[#F7F5F1] mb-3">
            Infrastructure Knowledge Base
          </h1>

          <p className="text-base text-stone-600 dark:text-stone-400 max-w-3xl">
            Find official information regarding responsible authorities,
            reporting procedures, and safety guidance for public infrastructure
            in Zimbabwe.
          </p>
        </div>

        {/* ASSISTANT CARD */}
        <section className="mb-12 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] shadow-sm">
          <div className="border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 px-6 py-4 flex items-center gap-3">
            <Search
              className="text-stone-500 dark:text-stone-400"
              size={20}
            />

            <h2 className="text-lg font-semibold text-stone-900 dark:text-[#F7F5F1]">
              Search Knowledge Base
            </h2>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={askPIRS}>
              <label
                htmlFor="pirs-question"
                className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
              >
                Describe the infrastructure issue you need help with:
              </label>

              <textarea
                id="pirs-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="e.g., There is a severe pothole on Samora Machel Avenue. Who is responsible?"
                rows="3"
                className="w-full rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-[#181513] px-4 py-3 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none transition-colors focus:border-[#FF6C16] focus:ring-1 focus:ring-[#FF6C16] resize-y mb-4"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={asking || !question.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6C16] px-6 py-2.5 text-sm font-medium text-[#F7F5F1] transition-colors hover:bg-[#EA6A0C] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {asking ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}

                  {asking ? "Sending..." : "Send"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setQuestion("");
                    setAnswer("");
                    setAskError("");
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-stone-300 dark:border-stone-600 px-6 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800"
                >
                  Clear
                </button>
              </div>

              {/* QUICK SUGGESTIONS */}
              <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800">
                <p className="mb-3 text-sm font-medium text-stone-600 dark:text-stone-400">
                  Common inquiries:
                </p>

                <div className="flex flex-wrap gap-2">
                  {examples.map((ex) => (
                    <button
                      key={ex.text}
                      type="button"
                      onClick={() => handleExample(ex.query)}
                      className="inline-flex items-center gap-2 rounded-md border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-1.5 text-sm text-stone-700 dark:text-stone-300 transition-colors hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700"
                    >
                      <ex.icon size={14} className="text-stone-500" />
                      {ex.text}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* ERROR */}
            {askError && (
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{askError}</span>
              </div>
            )}

            {/* ANSWER */}
            {answer && (
              <div className="mt-8 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
                <div className="border-b border-stone-200 dark:border-stone-700 px-5 py-3 flex items-center gap-2">
                  <HelpCircle
                    size={16}
                    className="text-[#FF6C16] dark:text-[#FF6C16]"
                  />

                  <h3 className="font-medium text-stone-900 dark:text-[#F7F5F1] text-sm">
                    Response
                  </h3>
                </div>

                <div className="px-5 py-4 prose prose-slate dark:prose-invert max-w-none text-sm text-stone-700 dark:text-stone-300 prose-headings:text-stone-900 dark:prose-headings:text-[#F7F5F1] prose-a:text-[#FF6C16] dark:prose-a:text-[#FF6C16]">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* DIRECTORY SECTION */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-[#F7F5F1]">
              Information Directory
            </h2>
          </div>

          {loadingKnowledge && (
            <div className="flex items-center gap-3 py-8 text-stone-500 dark:text-stone-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-medium">
                Loading directory...
              </span>
            </div>
          )}

          {knowledgeError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
              {knowledgeError}
            </div>
          )}

          {!loadingKnowledge &&
            !knowledgeError &&
            knowledge.length === 0 && (
              <div className="rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-8 text-center text-sm text-stone-500 dark:text-stone-400">
                No information articles are currently available.
              </div>
            )}

          {!loadingKnowledge &&
            !knowledgeError &&
            knowledge.length > 0 && (
              <div className="space-y-4">
                {knowledge.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] overflow-hidden group shadow-sm"
                  >
                    {categoryImages[item.category] && (
                      <div className="relative h-40 w-full overflow-hidden">
                        <img src={categoryImages[item.category]} alt={item.category} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 backdrop-blur-[3px]"></div>
                        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-wrap items-end justify-between gap-4">
                          <h3 className="text-xl font-bold text-white drop-shadow-lg">
                            {item.title || item.category}
                          </h3>
                          <span className="rounded-md bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      {!categoryImages[item.category] && (
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-lg font-semibold text-stone-900 dark:text-[#F7F5F1]">
                            {item.title || item.category}
                          </h3>
                          <span className="rounded bg-stone-100 dark:bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-600 dark:text-stone-300">
                            {item.category}
                          </span>
                        </div>
                      )}

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        {item.problem && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400 mb-1">
                              Problem Overview
                            </h4>

                            <p className="text-sm text-stone-700 dark:text-stone-300">
                              {item.problem}
                            </p>
                          </div>
                        )}

                        {item.locationContext && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400 mb-1">
                              Context / Regions
                            </h4>

                            <p className="text-sm text-stone-700 dark:text-stone-300">
                              {item.locationContext}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {item.responsibleAuthority && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400 mb-1">
                              Responsible Authority
                            </h4>

                            <p className="text-sm font-medium text-stone-900 dark:text-[#F7F5F1]">
                              {item.responsibleAuthority}
                            </p>
                          </div>
                        )}

                        {item.requiredInformation?.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400 mb-1">
                              Required Details
                            </h4>

                            <ul className="list-disc pl-4 text-sm text-stone-700 dark:text-stone-300 space-y-1">
                              {item.requiredInformation.map(
                                (info, index) => (
                                  <li key={index}>{info}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {item.sourceName && (
                      <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          Source: {item.sourceName}
                        </p>

                        {item.source && (
                          <a
                            href={item.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#FF6C16] dark:text-[#FF6C16] hover:underline"
                          >
                            Official Source
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    )}
                    </div>
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

