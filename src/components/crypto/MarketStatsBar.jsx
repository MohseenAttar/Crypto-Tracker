import { Globe, BarChart2, Bitcoin, Layers } from "lucide-react";
import { useGlobalStats } from "../../hooks/useGlobalStats";
import { formatMarketCap } from "../../utils/formatCurrency";
import LoadingSkeleton from "../ui/LoadingSkeleton";

const StatCard = ({ icon: Icon, label, value, sub, delay = 0 }) => (
  <div
    className="animate-fade-up rounded-xl border border-zinc-200 bg-white px-4 py-4 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:shadow-none"
    style={{ animationDelay: `${delay}ms` }}
    /* animationDelay is a dynamic value — cannot be expressed as a static
       Tailwind class. All other styling uses Tailwind utilities. */
  >
    <div className="mb-2 flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate text-xs font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
      {value}
    </div>
    {sub && (
      <div className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-500">
        {sub}
      </div>
    )}
  </div>
);

const MarketStatsBar = () => {
  const { data, isLoading } = useGlobalStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const mcap = data?.total_market_cap?.usd;
  const vol = data?.total_volume?.usd;
  const btcDom = data?.market_cap_percentage?.btc;
  const coins = data?.active_cryptocurrencies;
  const mcapChg = data?.market_cap_change_percentage_24h_usd ?? 0;
  const isUp = mcapChg >= 0;

  const stats = [
    {
      icon: Globe,
      label: "Market Cap",
      value: formatMarketCap(mcap),
      sub: `${isUp ? "▲" : "▼"} ${Math.abs(mcapChg).toFixed(2)}% today`,
    },
    {
      icon: BarChart2,
      label: "24h Volume",
      value: formatMarketCap(vol),
      sub: "Total traded",
    },
    {
      icon: Bitcoin,
      label: "BTC Dominance",
      value: `${btcDom?.toFixed(1) ?? "—"}%`,
      sub: "of total market cap",
    },
    {
      icon: Layers,
      label: "Active Coins",
      value: coins?.toLocaleString() ?? "—",
      sub: "tracked by CoinGecko",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s, i) => (
        <StatCard key={s.label} {...s} delay={i * 80} />
      ))}
    </div>
  );
};

export default MarketStatsBar;
