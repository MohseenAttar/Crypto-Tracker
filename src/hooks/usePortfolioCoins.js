import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchPricesByIds } from "../api/coinGeckoApi";

/**
 * Fetches live prices for all coins in the portfolio.
 *
 * Same optimized pattern as useWatchlistCoins:
 * - Stable queryKey — never causes loading flash on add/remove
 * - On ADD  → fetch only new coin, merge into cache via setQueryData
 * - On REMOVE → zero API call, component filters locally
 * - Every 60s → silent background refresh of all prices
 */
export const usePortfolioCoins = (ids = [], currency = "usd") => {
  const queryClient = useQueryClient();
  const prevIdsRef = useRef([]);

  const query = useQuery({
    queryKey: ["portfolio-coins", currency],
    queryFn: () => {
      const currentIds = prevIdsRef.current;
      if (currentIds.length === 0) return [];
      return fetchPricesByIds([...currentIds].sort(), currency);
    },
    enabled: ids.length > 0,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const prev = prevIdsRef.current;
    const curr = ids;
    const addedIds = curr.filter((id) => !prev.includes(id));

    prevIdsRef.current = curr;

    if (addedIds.length > 0 && curr.length > 0) {
      // Fetch only the newly added coins and merge into existing cache
      fetchPricesByIds(addedIds, currency)
        .then((newCoins) => {
          queryClient.setQueryData(
            ["portfolio-coins", currency],
            (existing = []) => {
              const existingIds = new Set(existing.map((c) => c.id));
              return [
                ...existing,
                ...newCoins.filter((c) => !existingIds.has(c.id)),
              ];
            },
          );
        })
        .catch(() => {
          // Silent fail — 60s refetch will recover
        });
    }
  }, [ids.join(","), currency]);

  return query;
};
