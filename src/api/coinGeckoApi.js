import axios from "axios";

// All requests go through the Vite proxy (/api → coingecko.com/api/v3)
// This avoids CORS and attaches the API key via vite.config.js
const client = axios.create({
  baseURL: "/api",
});

/**
 * Home page — "All" filter mode.
 * Server-side pagination — fetches exactly what's visible (20 per page).
 * Allows browsing all 13,000+ CoinGecko coins.
 */
export const fetchCoinMarkets = async (currency = "usd", page = 1) => {
  const res = await client.get("/coins/markets", {
    params: {
      vs_currency: currency,
      order: "market_cap_desc",
      per_page: 20,
      page,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    },
  });
  return res.data;
};

/**
 * Home page — Gainers/Losers filter mode.
 * Fetches top 250 once — enough for meaningful filter results.
 * Client-side filter + pagination applied on top.
 */
export const fetchTopCoins = async (currency = "usd") => {
  const res = await client.get("/coins/markets", {
    params: {
      vs_currency: currency,
      order: "market_cap_desc",
      per_page: 250,
      page: 1,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    },
  });
  return res.data;
};

/**
 * AddCoinModal — live search across all 13,000+ coins.
 * Uses CoinGecko /search endpoint — returns coins matching the query.
 * Then fetches market data (price, image) for matched coin IDs.
 */
export const searchCoins = async (query) => {
  const res = await client.get("/search", {
    params: { query },
  });
  // Returns { coins: [{ id, name, symbol, thumb, market_cap_rank }] }
  return res.data.coins.slice(0, 20); // top 20 search results
};

export const fetchCoinsByIds = async (ids, currency = "usd") => {
  const res = await client.get("/coins/markets", {
    params: {
      vs_currency: currency,
      ids: ids.join(","),
      order: "market_cap_desc",
      per_page: ids.length,
      page: 1,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    },
  });
  return res.data;
};

export const fetchGlobalStats = async () => {
  const res = await client.get("/global");
  return res.data.data;
};

export const fetchCoinChart = async (id, currency = "usd", days = 7) => {
  const res = await client.get(`/coins/${id}/market_chart`, {
    params: { vs_currency: currency, days },
  });
  return res.data;
};

export const fetchCoinDetail = async (id) => {
  const res = await client.get(`/coins/${id}`, {
    params: { localization: false, sparkline: true },
  });
  return res.data;
};

export const fetchPricesByIds = async (ids, currency = "usd") => {
  const res = await client.get("/coins/markets", {
    params: {
      vs_currency: currency,
      ids: ids.join(","),
      order: "market_cap_desc",
      per_page: ids.length,
      page: 1,
      sparkline: false,
      price_change_percentage: "24h",
    },
  });
  return res.data;
};
