import { useQuery } from "@tanstack/react-query";
import { fetchCoinChart } from "../api/coinGeckoApi";

export const useCoinChart = (id, currency = "usd", days = 7) =>
  useQuery({
    queryKey: ["coin-chart", id, currency, days],
    queryFn:  () => fetchCoinChart(id, currency, days),
    enabled:  !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });