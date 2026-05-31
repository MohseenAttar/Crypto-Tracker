import PropTypes from "prop-types";
import { formatPrice, formatMarketCap } from "../../utils/formatCurrency";
import { useCurrency } from "../../context/CurrencyContext";
import PriceChange from "../ui/PriceChange";

/**
 * Quick overview sidebar card shown on the Coin Detail page.
 * Displays key market metrics in a compact list format.
 */
const QuickStats = ({ coin }) => {
  const { currency } = useCurrency();
  const d = coin.market_data;
  if (!d) return null;

  const rows = [
    { label: "Market Cap Rank", value: `#${coin.market_cap_rank ?? "—"}` },
    {
      label: "Market Cap",
      value: formatMarketCap(d.market_cap?.[currency], currency),
    },
    {
      label: "24h Volume",
      value: formatMarketCap(d.total_volume?.[currency], currency),
    },
    {
      label: "1h Change",
      pct: d.price_change_percentage_1h_in_currency?.[currency],
    },
    {
      label: "24h Change",
      pct: d.price_change_percentage_24h_in_currency?.[currency],
    },
    {
      label: "7d Change",
      pct: d.price_change_percentage_7d_in_currency?.[currency],
    },
    {
      label: "30d Change",
      pct: d.price_change_percentage_30d_in_currency?.[currency],
    },
    {
      label: "Circulating Supply",
      value: `${(d.circulating_supply / 1e6).toFixed(2)}M ${coin.symbol?.toUpperCase()}`,
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800/60 dark:bg-zinc-900/60">
      <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Quick Overview
      </h2>
      <div className="flex flex-1 flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-2.5"
          >
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {row.label}
            </span>
            {row.pct !== undefined ? (
              <PriceChange value={row.pct} size="sm" />
            ) : (
              <span className="font-mono text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {row.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

QuickStats.propTypes = {
  coin: PropTypes.shape({
    market_cap_rank: PropTypes.number,
    symbol: PropTypes.string,
    market_data: PropTypes.object,
  }).isRequired,
};

export default QuickStats;
