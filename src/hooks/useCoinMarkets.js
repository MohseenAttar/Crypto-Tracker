import { useQuery } from "@tanstack/react-query";
import { fetchCoinMarkets } from "../api/coinGeckoApi";

/**
 * Home page — "All" filter mode.
 * Server-side pagination — each page is a separate API call.
 * Allows browsing all 13,000+ coins on CoinGecko.
 *
 * queryKey includes page so React Query caches each page independently.
 * Navigating back to a previously visited page = instant from cache.
 */
export const useCoinMarkets = (currency = "usd", page = 1) =>
  useQuery({
    queryKey: ["coin-markets", currency, page],
    queryFn:  () => fetchCoinMarkets(currency, page),
    staleTime:       1000 * 60,
    refetchInterval: 1000 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
  });