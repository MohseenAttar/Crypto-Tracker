import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from "lucide-react";
import { formatPrice, formatPct } from "../../utils/formatCurrency";
import { useCurrency } from "../../context/CurrencyContext";

/**
 * Portfolio summary — 4 metric cards.
 */
const MetricCard = ({
  icon: Icon,
  iconColor,
  label,
  shortLabel,
  value,
  sub,
  subColor,
}) => (
  <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800/60 dark:bg-zinc-900/60 sm:p-4">
    {/* Icon + label */}
    <div className="mb-2.5 flex items-center gap-2">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${iconColor}`}
      >
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {/* Shorter label on mobile to avoid wrapping */}
        <span className="sm:hidden">{shortLabel ?? label}</span>
        <span className="hidden sm:inline">{label}</span>
      </span>
    </div>

    {/*
     * Value — scales down on mobile instead of truncating.
     * break-all ensures very long numbers wrap inside the card
     * rather than overflowing the box.
     */}
    <div className="break-all text-base font-bold leading-tight text-zinc-900 dark:text-zinc-100 sm:text-lg lg:text-xl">
      {value}
    </div>

    {/* Sub text */}
    {sub && <div className={`mt-1 text-xs font-medium ${subColor}`}>{sub}</div>}
  </div>
);

const PortfolioSummary = ({
  totalValue,
  totalPnL,
  totalPnLPct,
  bestPerformer,
  worstPerformer,
}) => {
  const { currency } = useCurrency();
  const isPnLUp = totalPnL >= 0;

  const metrics = [
    {
      icon: DollarSign,
      iconColor:
        "bg-brand-500/10 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400",
      label: "Total Value",
      shortLabel: "Value",
      value: formatPrice(totalValue, currency),
      sub: null,
    },
    {
      icon: isPnLUp ? TrendingUp : TrendingDown,
      iconColor: isPnLUp
        ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
        : "bg-red-500/10 text-red-500 dark:text-red-400",
      label: "Total P&L",
      shortLabel: "P&L",
      value: `${isPnLUp ? "+" : ""}${formatPrice(totalPnL, currency)}`,
      sub: `${isPnLUp ? "+" : ""}${formatPct(totalPnLPct)} all time`,
      subColor: isPnLUp
        ? "text-emerald-500 dark:text-emerald-400"
        : "text-red-500 dark:text-red-400",
    },
    {
      icon: TrendingUp,
      iconColor: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
      label: "Best Performer",
      shortLabel: "Best",
      value: bestPerformer?.name ?? "—",
      sub: bestPerformer ? `+${bestPerformer.pnlPct.toFixed(2)}%` : null,
      subColor: "text-emerald-500 dark:text-emerald-400",
    },
    {
      icon: TrendingDown,
      iconColor: "bg-red-500/10 text-red-500 dark:text-red-400",
      label: "Worst Performer",
      shortLabel: "Worst",
      value: worstPerformer?.name ?? "—",
      sub: worstPerformer ? `${worstPerformer.pnlPct.toFixed(2)}%` : null,
      subColor: "text-red-500 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
};

export default PortfolioSummary;
