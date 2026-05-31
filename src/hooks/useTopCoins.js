import { useQuery } from "@tanstack/react-query";
import { fetchTopCoins } from "../api/coinGeckoApi";

/**
 * Home page — Gainers/Losers filter mode.
 * Fetches top 250 coins once — client-side filter + pagination applied on top.
 *
 * Separate from useCoinMarkets so:
 * - "All" mode and filter mode have independent caches
 * - Switching between modes never triggers unnecessary refetches
 * - staleTime is longer (5 min) since 250-coin snapshot doesn't need
 *   as frequent updates as the live market table
 */
export const useTopCoins = (currency = "usd") =>
  useQuery({
    queryKey: ["top-coins", currency],
    queryFn:  () => fetchTopCoins(currency),
    staleTime:       1000 * 60 * 5,   // 5 min — filter results less time-sensitive
    refetchInterval: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });