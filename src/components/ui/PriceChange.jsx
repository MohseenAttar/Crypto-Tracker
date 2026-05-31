import PropTypes from "prop-types";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatPct } from "../../utils/formatCurrency";

/**
 * Coloured percentage change badge.
 * Green with upward arrow for positive, red with downward arrow for negative.
 * Used across CoinRow, CoinDetail, Portfolio, and Watchlist.
 */
const PriceChange = ({ value = null, size = "md" }) => {
  if (value == null) return <span className="text-zinc-500">—</span>;

  const isUp = value >= 0;
  const Icon = isUp ? TrendingUp : TrendingDown;
  const text = formatPct(value);

  const sizeMap = {
    sm: "text-xs px-1.5 py-0.5 gap-0.5",
    md: "text-xs px-2   py-1   gap-1",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-mono font-medium ${sizeMap[size]} ${
        isUp
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {text}
    </span>
  );
};

PriceChange.propTypes = {
  value: PropTypes.number,
  size: PropTypes.oneOf(["sm", "md"]),
};

export default PriceChange;
