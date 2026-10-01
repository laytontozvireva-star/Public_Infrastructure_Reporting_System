
import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ArrowRight,
  Bot,
  BookOpen,
  ChevronRight,
  ExternalLink,
  FileText,
  Loader2,
  MessageCircleQuestion,
  Search,
  Sparkles,
} from "lucide-react";

const categories = [
  "All",
  "Electricity",
  "Water",
  "Sewer",
  "Roads",
  "Traffic Lights",
  "Illegal Dumping",
  "Fallen Trees",
  "Other",
];

const exampleQuestions = [
  "There is a water supply problem in Harare. Who is responsible?",
  "How can I report a pothole?",
  "What should I do about a broken traffic light?",
  "How can I report an electricity problem?",
];

function Knowledge() {
  const [knowledge, setKnowledge] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loadingKnowledge, setLoadingKnowledge] = useState(true);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadKnowledge() {
      try {
        setLoadingKnowledge(true);
        setError("");

        const response = await fetch("/api/knowledge");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load knowledge.");
        }

        setKnowledge(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load knowledge.");
      } finally {
        setLoadingKnowledge(false);
      }
    }

    loadKnowledge();
  }, []);

  const filteredKnowledge = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return knowledge.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const searchableText = [
        item.title,
        item.category,
        item.problem,
        item.summary,
        item.responsibleAuthority,
        item.locationContext,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [knowledge, selectedCategory, searchTerm]);

  async function askQuestion(event) {
    event.preventDefault();

    if (!question.trim()) return;

    try {
      setAsking(true);
      setAnswer("");
      setSources([]);
      setError("");

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

      if (!response.ok) {
        throw new Error(
          data.error || "The AI assistant could not answer your question."
        );
      }

      setAnswer(data.answer || "");
      setSources(data.sources || []);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while asking the AI assistant."
      );
    } finally {
      setAsking(false);
    }
  }

  function useExample(example) {
    setQuestion(example);
    setAnswer("");
    setSources([]);
    setError("");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white px-4 py-14 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              <BookOpen className="h-4 w-4" />
              PIRS Knowledge Base
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              Infrastructure Knowledge
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Find reliable information about infrastructure services,
              safety guidance, reporting procedures, and responsible
              authorities in Zimbabwe.
            </p>
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl bg-gray-900 p-6 text-white shadow-xl md:p-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-orange-400" />
                  AI Knowledge Assistant
                </div>

                <h2 className="text-3xl font-bold md:text-2xl">
                  Have a question about an infrastructure problem?
                </h2>

                <p className="mt-4 leading-7 text-gray-300">
                  Ask a question and the PIRS assistant will use the
                  verified knowledge stored in the PIRS knowledge base.
                </p>
              </div>

              <form onSubmit={askQuestion}>
                <div className="rounded-2xl bg-white p-3 shadow-lg">
                  <div className="flex items-start gap-3">
                    <MessageCircleQuestion className="mt-3 ml-2 h-5 w-5 shrink-0 text-orange-500" />

                    <textarea
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      placeholder="Ask something like: Who is responsible for a water supply problem?"
                      rows={4}
                      maxLength={1000}
                      className="w-full resize-y border-0 bg-transparent p-2 text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-400">
                      {question.length}/1000
                    </span>

                    <button
                      type="submit"
                      disabled={asking || !question.trim()}
                      className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {asking ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Thinking...
                        </>
                      ) : (
                        <>
                          Ask Assistant
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-gray-400">
                Try an example:
              </p>

              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => useExample(example)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Answer */}
      {(answer || asking) && (
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <Bot className="h-5 w-5 text-orange-600" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    PIRS Assistant
                  </h2>
                  <p className="text-sm text-gray-500">
                    Answer based on the PIRS knowledge base
                  </p>
                </div>
              </div>

              {asking ? (
                <div className="flex items-center gap-3 py-6 text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Finding relevant information...
                </div>
              ) : (
                <>
                  <div className="prose prose-gray max-w-none">
                    <ReactMarkdown>{answer}</ReactMarkdown>
                  </div>

                  {sources.length > 0 && (
                    <div className="mt-8 border-t border-gray-100 pt-6">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Verified Sources
                      </h3>

                      <div className="grid gap-3 md:grid-cols-2">
                        {sources.map((source) => (
                          <div
                            key={source.id}
                            className="rounded-xl border border-gray-200 p-4"
                          >
                            <div className="flex items-start gap-3">
                              <FileText className="mt-1 h-5 w-5 shrink-0 text-orange-500" />

                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900">
                                  {source.title}
                                </p>

                                {source.sourceName && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    {source.sourceName}
                                  </p>
                                )}

                                {source.source && (
                                  <a
                                    href={source.source}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
                                  >
                                    View source
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Error */}
      {error && (
        <section className="px-4 pb-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          </div>
        </section>
      )}

      {/* Knowledge Directory */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-orange-600">
                  Knowledge Directory
                </p>

                <h2 className="text-3xl font-bold text-gray-900">
                  Explore Infrastructure Information
                </h2>

                <p className="mt-2 text-gray-600">
                  Browse verified information collected for PIRS.
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search knowledge..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loadingKnowledge ? (
            <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-10">
              <div className="flex items-center gap-3 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading knowledge...
              </div>
            </div>
          ) : filteredKnowledge.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-10 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-gray-300" />

              <h3 className="mt-4 font-semibold text-gray-900">
                No knowledge found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another category or search term.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredKnowledge.map((item) => (
                <article
                  key={item._id}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      {item.category || "Other"}
                    </span>

                    <ChevronRight className="h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-gray-900">
                    {item.title || "Infrastructure Information"}
                  </h3>

                  {item.summary && (
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">
                      {item.summary}
                    </p>
                  )}

                  {item.responsibleAuthority && (
                    <div className="mt-5 rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Responsible Authority
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {item.responsibleAuthority}
                      </p>
                    </div>
                  )}

                  {item.source && (
                    <a
                      href={item.source}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
                    >
                      View source
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Knowledge;

