import { LineChart, Line } from "recharts";

/**
 * Mini 7-day trend sparkline for the coin table row.
 * Colors use Tailwind's emerald/red CSS variables via resolveConfig
 * so they stay in sync with the design system.
 * @param {number[]} prices - raw sparkline_in_7d.price array from CoinGecko
 * @param {boolean}  isUp   - true if 7d change >= 0
 */
const Sparkline = ({ prices = [], isUp }) => {
  if (!prices || prices.length === 0)
    return <span className="text-zinc-700">—</span>;

  const step = Math.max(1, Math.floor(prices.length / 30));
  const data = prices.filter((_, i) => i % step === 0).map((p) => ({ p }));

  // Use Tailwind's emerald-400 / red-400 tokens via CSS var
  // These match exactly what PriceChange.jsx uses for consistency
  const upColor = "#34d399"; // emerald-400
  const downColor = "#f87171"; // red-400
  const color = isUp ? upColor : downColor;

  return (
    <LineChart
      width={80}
      height={32}
      data={data}
      margin={{ top: 4, bottom: 4, left: 0, right: 0 }}
    >
      <Line
        type="monotone"
        dataKey="p"
        stroke={color}
        strokeWidth={1.5}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  );
};

export default Sparkline;
