import React from "react";

function Knowledge() {
return ( <div className="min-h-screen bg-gray-50 px-4 py-10"> <div className="mx-auto max-w-6xl"> <div className="mb-10"> <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
PIRS Knowledge Base </p>


      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
        Infrastructure Knowledge
      </h1>

      <p className="mt-3 max-w-3xl text-gray-600">
        Find reliable information about infrastructure services,
        safety guidance, reporting procedures, and responsible
        authorities in Zimbabwe.
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[
        "Electricity",
        "Water",
        "Sewer",
        "Roads",
        "Traffic Lights",
        "Illegal Dumping",
        "Fallen Trees",
        "Other",
      ].map((category) => (
        <div
          key={category}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            {category}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            View information and guidance.
          </p>
        </div>
      ))}
    </div>
  </div>
</div>


);
}

export default Knowledge;
