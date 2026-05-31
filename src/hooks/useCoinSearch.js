import { useQuery } from "@tanstack/react-query";
import { searchCoins, fetchCoinsByIds } from "../api/coinGeckoApi";
import { useDebounce } from "./useDebounce";

/**
 * Live coin search for AddCoinModal.
 * Two-stage process:
 *   1. /search?query=xxx → returns matched coin IDs + basic info
 *   2. /coins/markets?ids=... → fetches live prices for matched coins
 *
 * Why two calls?
 * CoinGecko /search doesn't return prices — only names, symbols, ranks.
 * We need prices to show in the modal and use as default buy price.
 *
 * Debounced at 400ms — avoids API calls on every keystroke.
 * Disabled when query < 2 chars — prevents noise searches.
 */
export const useCoinSearch = (query = "", currency = "usd") => {
  const debouncedQuery = useDebounce(query, 400);

  // Stage 1 — search for matching coin IDs
  const searchQuery = useQuery({
    queryKey: ["coin-search", debouncedQuery],
    queryFn: () => searchCoins(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // Extract IDs from search results
  const coinIds = searchQuery.data?.map((c) => c.id) ?? [];

  // Stage 2 — fetch live market data for matched IDs
  const marketQuery = useQuery({
    queryKey: ["coin-search-prices", coinIds.join(","), currency],
    queryFn: () => fetchCoinsByIds(coinIds, currency),
    enabled: coinIds.length > 0,
    staleTime: 1000 * 60,
    retry: 1,
  });

  return {
    // Merge search metadata (rank, thumb) with live market data (price, image)
    results: marketQuery.data ?? [],
    isLoading:
      searchQuery.isLoading || (coinIds.length > 0 && marketQuery.isLoading),
    isError: searchQuery.isError || marketQuery.isError,
    hasQuery: debouncedQuery.length >= 2,
  };
};
