import {
  formatPrice,
  formatMarketCap,
  formatSupply,
} from "../../utils/formatCurrency";
import { useCurrency } from "../../context/CurrencyContext";

const StatItem = ({ label, value, highlight }) => (
  <div className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800/60 dark:bg-zinc-900/40">
    <span className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
      {label}
    </span>
    <span
      className={`font-mono text-sm font-semibold ${
        highlight === "up"
          ? "text-emerald-500"
          : highlight === "down"
            ? "text-red-400"
            : "text-zinc-900 dark:text-zinc-100"
      }`}
    >
      {value}
    </span>
  </div>
);

const CoinStatsGrid = ({ coin }) => {
  const { currency } = useCurrency();
  const d = coin.market_data;

  if (!d) return null;

  const ath = d.ath?.[currency];
  const atl = d.atl?.[currency];
  const athPct = d.ath_change_percentage?.[currency];
  const atlPct = d.atl_change_percentage?.[currency];

  const stats = [
    {
      label: "Market Cap",
      value: formatMarketCap(d.market_cap?.[currency], currency),
    },
    {
      label: "24h Trading Vol",
      value: formatMarketCap(d.total_volume?.[currency], currency),
    },
    {
      label: "Fully Diluted Val",
      value: formatMarketCap(d.fully_diluted_valuation?.[currency], currency),
    },
    {
      label: "Circulating Supply",
      value: `${formatSupply(d.circulating_supply)} ${coin.symbol?.toUpperCase()}`,
    },
    {
      label: "Max Supply",
      value: d.max_supply
        ? `${formatSupply(d.max_supply)} ${coin.symbol?.toUpperCase()}`
        : "∞  Unlimited",
    },
    {
      label: "24h High",
      value: formatPrice(d.high_24h?.[currency], currency),
      highlight: "up",
    },
    {
      label: "24h Low",
      value: formatPrice(d.low_24h?.[currency], currency),
      highlight: "down",
    },
    {
      label: `All-Time High`,
      value: `${formatPrice(ath, currency)} (${athPct?.toFixed(1)}%)`,
      highlight: "up",
    },
    {
      label: "All-Time Low",
      value: `${formatPrice(atl, currency)} (+${atlPct?.toFixed(1)}%)`,
      highlight: "down",
    },
    {
      label: "Price Change 7d",
      value: `${d.price_change_percentage_7d?.toFixed(2)}%`,
      highlight: (d.price_change_percentage_7d ?? 0) >= 0 ? "up" : "down",
    },
    {
      label: "Price Change 30d",
      value: `${d.price_change_percentage_30d?.toFixed(2)}%`,
      highlight: (d.price_change_percentage_30d ?? 0) >= 0 ? "up" : "down",
    },
    {
      label: "Price Change 1y",
      value:
        d.price_change_percentage_1y != null
          ? `${d.price_change_percentage_1y?.toFixed(2)}%`
          : "—",
      highlight: (d.price_change_percentage_1y ?? 0) >= 0 ? "up" : "down",
    },
  ];

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Key Statistics
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
};

export default CoinStatsGrid;
