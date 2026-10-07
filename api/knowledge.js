module.exports = async (req, res) => {
  try {
    const projectId = process.env.SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET || "production";
    const token =process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN;

    console.log("Project ID exists:", !!projectId);
    console.log("Dataset:", dataset);
    console.log("Token exists:", !!token);

    if (!projectId || !token) {
      return res.status(500).json({
        error: "Sanity environment variables are missing.",
        projectIdExists: !!projectId,
        tokenExists: !!token,
      });
    }

    const { category } = req.query;

    let query =
      '*[_type == "infrastructureKnowledge"] | order(lastUpdated desc)';

    if (category) {
      query =
        '*[_type == "infrastructureKnowledge" && category == $category] | order(lastUpdated desc)';
    }

    const response = await fetch(
      `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          params: category ? { category } : {},
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Sanity request failed.",
        details: result,
      });
    }

    return res.status(200).json(result.result || []);
  } catch (error) {
    console.error("Knowledge API error:", error);

    return res.status(500).json({
      error: "Knowledge API failed.",
      message: error.message,
      name: error.name,
    });
  }
};