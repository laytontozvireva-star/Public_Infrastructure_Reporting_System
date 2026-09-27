import React, { useEffect, useState } from "react";

function Knowledge() {
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Unable to load infrastructure knowledge.");
      } finally {
        setLoading(false);
      }
    }

    loadKnowledge();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            PIRS Knowledge Base
          </p>

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Infrastructure Knowledge
          </h1>

          <p className="mt-3 max-w-3xl text-gray-600">
            Reliable information about infrastructure services, safety
            guidance, reporting procedures, and responsible authorities
            in Zimbabwe.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-600">
              Loading infrastructure knowledge...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="font-medium text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && knowledge.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-600">
              No infrastructure knowledge is currently available.
            </p>
          </div>
        )}

        {!loading && !error && knowledge.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {knowledge.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {item.title || item.category}
                  </h2>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.category}
                  </span>
                </div>

                {item.problem && (
                  <div className="mb-5">
                    <h3 className="mb-1 font-semibold text-gray-800">
                      Problem
                    </h3>
                    <p className="text-gray-600">{item.problem}</p>
                  </div>
                )}

                {item.responsibleAuthority && (
                  <div className="mb-5">
                    <h3 className="mb-1 font-semibold text-gray-800">
                      Responsible Authority
                    </h3>
                    <p className="text-gray-600">
                      {item.responsibleAuthority}
                    </p>
                  </div>
                )}

                {item.locationContext && (
                  <div className="mb-5">
                    <h3 className="mb-1 font-semibold text-gray-800">
                      Location
                    </h3>
                    <p className="text-gray-600">
                      {item.locationContext}
                    </p>
                  </div>
                )}

                {item.requiredInformation?.length > 0 && (
                  <div className="mb-5">
                    <h3 className="mb-2 font-semibold text-gray-800">
                      Information to Provide
                    </h3>

                    <ul className="list-disc space-y-1 pl-5 text-gray-600">
                      {item.requiredInformation.map((info, index) => (
                        <li key={index}>{info}</li>
                      ))}
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
      </div>
    </div>
  );
}

export default Knowledge;