import { useQuery } from "@tanstack/react-query";
import { fetchCoinDetail } from "../api/coinGeckoApi";

export const useCoinDetail = (id) =>
  useQuery({
    queryKey: ["coin-detail", id],
    queryFn:  () => fetchCoinDetail(id),
    enabled:  !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });