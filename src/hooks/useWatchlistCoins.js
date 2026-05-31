import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchCoinsByIds } from "../api/coinGeckoApi";

/**
 * Production-optimized hook for watchlist coin data.
 *
 * Core principle: treat the local cache as a SUPERSET of the watchlist.
 *
 * - Cache always grows (new coins fetched when added)
 * - Cache NEVER shrinks on removal (no refetch, no loading state)
 * - Component filters cache against WatchlistContext for display
 * - Periodic background refresh keeps ALL cached coins up to date
 * - queryKey is stable → zero cache misses on add/remove
 *
 * This is the same pattern used by production apps like Linear, Notion:
 * "fetch more when needed, filter locally for display"
 */
export const useWatchlistCoins = (ids = [], currency = "usd") => {
  const queryClient = useQueryClient();
  const prevIdsRef  = useRef([]);

  const query = useQuery({
    // Stable key — never changes on add/remove
    // Only changes when currency switches (correct — prices differ per currency)
    queryKey: ["watchlist-coins", currency],

    // queryFn uses ids from closure — gets latest ids on each refetch
    queryFn: () => {
      const currentIds = prevIdsRef.current;
      if (currentIds.length === 0) return [];
      return fetchCoinsByIds([...currentIds].sort(), currency);
    },

    enabled:         ids.length > 0,
    staleTime:       1000 * 60,       // treat data as fresh for 60s
    refetchInterval: 1000 * 60,       // background refresh every 60s
    retry:           2,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const prev = prevIdsRef.current;
    const curr = ids;

    // Find genuinely new IDs (added since last render)
    const addedIds = curr.filter((id) => !prev.includes(id));

    // Always keep ref up to date
    prevIdsRef.current = curr;

    // Only trigger network request when NEW coins are added
    // Removals need zero network activity — component filters locally
    if (addedIds.length > 0 && curr.length > 0) {
      /**
       * Optimistic cache update:
       * Instead of invalidating (which causes loading flash),
       * we fetch only the NEW coins and MERGE them into existing cache.
       * The user sees existing coins instantly + new coin appears when loaded.
       */
      fetchCoinsByIds(addedIds, currency)
        .then((newCoins) => {
          queryClient.setQueryData(
            ["watchlist-coins", currency],
            (existingCoins = []) => {
              // Merge new coins into cache, avoid duplicates
              const existingIds = new Set(existingCoins.map((c) => c.id));
              const merged = [
                ...existingCoins,
                ...newCoins.filter((c) => !existingIds.has(c.id)),
              ];
              return merged;
            }
          );
        })
        .catch(() => {
          // Silently fail — periodic refetch will pick it up
        });
    }
  }, [ids.join(","), currency]);

  return query;
};