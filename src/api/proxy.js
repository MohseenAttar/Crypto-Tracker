/**
 * Vercel Serverless Function — CoinGecko API Proxy
 * Handles all CoinGecko API requests server-side.
 * API key never exposed to browser.
 */
export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { path, ...params } = req.query;

    if (!path) {
      return res.status(400).json({ error: "Missing path parameter" });
    }

    // path may come as array from :path* wildcard — join it
    const pathStr = Array.isArray(path) ? path.join("/") : path;

    const searchParams = new URLSearchParams(params).toString();
    const url = `https://api.coingecko.com/api/v3/${pathStr}${
      searchParams ? `?${searchParams}` : ""
    }`;

    console.log("[proxy] Fetching:", url);

    const response = await fetch(url, {
      headers: {
        "x-cg-demo-api-key": process.env.VITE_COINGECKO_KEY ?? "",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("[proxy] Error:", error.message);
    return res
      .status(500)
      .json({ error: "Proxy request failed", message: error.message });
  }
}
