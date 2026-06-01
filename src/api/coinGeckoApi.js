import axios from "axios";

/*
 * Environment-aware base URL:
 *
 * Local dev  → "/api"        routes through Vite proxy → CoinGecko
 *                             (key injected server-side via vite.config.js)
 *
 * Production → "/coingecko"  routes through Vercel serverless function
 *                             (api/proxy.js injects key server-side)
 *
 * Both approaches keep the API key off the browser entirely.
 */
const client = axios.create({
  baseURL: import.meta.env.PROD ? "/coingecko" : "/api",
});

/**
 * Home page — "All" filter mode.
 * Server-side pagination — 20 coins per page.
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
 * Fetches top 250 once, client-side filter + pagination on top.
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
 */
export const searchCoins = async (query) => {
  const res = await client.get("/search", {
    params: { query },
  });
  return res.data.coins.slice(0, 20);
};

/**
 * Fetch specific coins by IDs — used by Watchlist.
 */
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

/**
 * Lightweight price fetch for Portfolio — no sparkline.
 */
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
