import { useQuery } from "@tanstack/react-query";
import { fetchGlobalStats } from "../api/coinGeckoApi";

export const useGlobalStats = () =>
  useQuery({
    queryKey: ["global-stats"],
    queryFn: fetchGlobalStats,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 2,
    retry: 2,
  });
