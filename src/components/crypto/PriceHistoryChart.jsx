import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { useCoinChart } from "../../hooks/useCoinChart";
import { useCurrency } from "../../context/CurrencyContext";
import { formatPrice } from "../../utils/formatCurrency";
import RangeSelector from "./RangeSelector";
import LoadingSkeleton from "../ui/LoadingSkeleton";

const CustomTooltip = ({ active, payload, currency, days }) => {
  if (!active || !payload?.length) return null;
  const { time, price } = payload[0].payload;

  const dateStr =
    days <= 1
      ? format(new Date(time), "HH:mm")
      : days <= 30
        ? format(new Date(time), "MMM d, HH:mm")
        : format(new Date(time), "MMM d, yyyy");

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
      <p className="mb-1 text-xs text-zinc-400 dark:text-zinc-500">{dateStr}</p>
      <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {formatPrice(price, currency)}
      </p>
    </div>
  );
};

const PriceHistoryChart = ({ coinId }) => {
  const [days, setDays] = useState(7);
  const { currency } = useCurrency();

  const { data, isLoading } = useCoinChart(coinId, currency, days);

  const chartData = useMemo(() => {
    if (!data?.prices) return [];
    return data.prices.map(([time, price]) => ({ time, price }));
  }, [data]);

  const isUp =
    chartData.length >= 2
      ? chartData[chartData.length - 1].price >= chartData[0].price
      : true;
  const strokeColor = isUp ? "#34d399" : "#f87171";
  const fillId = isUp ? "fillUp" : "fillDown";

  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices) * 0.98;
  const maxPrice = Math.max(...prices) * 1.02;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 480;

  const xTickFormat = (ts) => {
    if (days <= 1) return format(new Date(ts), "HH:mm");
    if (days <= 30) return format(new Date(ts), "MMM d");
    return format(new Date(ts), "MMM yy");
  };

  const yTickFormat = (v) => {
    if (isMobile) {
      if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
      if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
      return v.toFixed(0);
    }
    return formatPrice(v, currency);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800/60 dark:bg-zinc-900/60 sm:p-5">
      {/* Header */}
      <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Price History
        </h2>
        <RangeSelector active={days} onChange={setDays} />
      </div>

      {isLoading ? (
        <LoadingSkeleton className="h-44 w-full flex-1 rounded-xl sm:h-auto" />
      ) : chartData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">
          No chart data available.
        </div>
      ) : (
        <div className={isMobile ? "h-[180px]" : "h-[297px]"}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 4,
                right: 4,
                left: isMobile ? 0 : 4,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="fillUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-zinc-100 dark:text-zinc-800"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tickFormatter={xTickFormat}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                className="text-zinc-400 dark:text-zinc-600"
                minTickGap={isMobile ? 40 : 50}
              />

              <YAxis
                domain={[minPrice, maxPrice]}
                tickFormatter={yTickFormat}
                tick={{ fontSize: isMobile ? 9 : 10 }}
                tickLine={false}
                axisLine={false}
                className="text-zinc-400 dark:text-zinc-600"
                width={isMobile ? 42 : 72}
                tickCount={isMobile ? 4 : 6}
              />

              <Tooltip
                content={<CustomTooltip currency={currency} days={days} />}
                cursor={{
                  stroke: strokeColor,
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                fill={`url(#${fillId})`}
                dot={false}
                activeDot={{ r: 4, fill: strokeColor, strokeWidth: 0 }}
                isAnimationActive={true}
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PriceHistoryChart;
