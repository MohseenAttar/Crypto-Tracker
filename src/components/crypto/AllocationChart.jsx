import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/**
 * Allocation pie chart — shows each coin's % of total portfolio value.
 * Uses Recharts PieChart with custom tooltip and legend.
 */

// Color palette — distinct enough to differentiate up to 10 coins
const COLORS = [
  "#7c5af6",
  "#34d399",
  "#f87171",
  "#60a5fa",
  "#fbbf24",
  "#a78bfa",
  "#34d399",
  "#f472b6",
  "#94a3b8",
  "#fb923c",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, pct } = payload[0].payload;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
      <p className="mb-1 text-xs font-medium text-zinc-900 dark:text-zinc-100">
        {name}
      </p>
      <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
        ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </p>
      <p className="font-mono text-xs font-semibold text-brand-500 dark:text-brand-400">
        {pct.toFixed(2)}%
      </p>
    </div>
  );
};

const CustomLegend = ({ data }) => (
  <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
    {data.map((entry, i) => (
      <div key={entry.id} className="flex items-center gap-1.5">
        <div
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: COLORS[i % COLORS.length] }}
        />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {entry.symbol}{" "}
          <span className="text-zinc-400 dark:text-zinc-600">
            {entry.pct.toFixed(1)}%
          </span>
        </span>
      </div>
    ))}
  </div>
);

const AllocationChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800/60 dark:bg-zinc-900/60">
      <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Allocation
      </h2>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={true}
            animationDuration={600}
          >
            {data.map((_, i) => (
              <Cell
                key={`cell-${i}`}
                fill={COLORS[i % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <CustomLegend data={data} />
    </div>
  );
};

export default AllocationChart;
