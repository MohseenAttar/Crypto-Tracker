/**
 * 1D / 7D / 1M / 3M / 1Y range selector buttons for the price chart.
 * Maps each label to the number of days CoinGecko expects.
 */
const RANGES = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
];

const RangeSelector = ({ active, onChange }) => (
  <div className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
    {RANGES.map(({ label, days }) => (
      <button
        key={days}
        onClick={() => onChange(days)}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
          active === days
            ? "bg-brand-600 text-white shadow-sm"
            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default RangeSelector;
