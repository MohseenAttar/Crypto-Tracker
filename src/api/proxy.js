/**
 * Vercel Serverless Function — CoinGecko API Proxy
 *
 * Routes all CoinGecko API requests through this server-side function.
 * This solves two problems:
 * 1. CORS — browser can't send custom headers to CoinGecko directly
 * 2. API key security — key stays server-side, never exposed to browser
 *
 * Request flow:
 *   Browser → /coingecko/coins/markets → Vercel Function → CoinGecko API
 */
export default async function handler(req, res) {
  // Allow CORS from our own domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { path, ...params } = req.query;

    if (!path) {
      return res.status(400).json({ error: "Missing path parameter" });
    }

    // Rebuild query string from remaining params
    const searchParams = new URLSearchParams(params).toString();
    const url = `https://api.coingecko.com/api/v3/${path}${
      searchParams ? `?${searchParams}` : ""
    }`;

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
    return res.status(500).json({ error: "Proxy request failed" });
  }
}
