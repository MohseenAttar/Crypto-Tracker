import { TrendingUp, TrendingDown, LayoutGrid } from "lucide-react";

const FILTERS = [
  { value: "all", label: "All", icon: LayoutGrid },
  { value: "gainers", label: "Gainers", icon: TrendingUp },
  { value: "losers", label: "Losers", icon: TrendingDown },
];

const FilterDropdown = ({ value, onChange }) => (
  <div className="flex w-full rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-900 sm:w-auto">
    {FILTERS.map(({ value: val, label, icon: Icon }) => (
      <button
        key={val}
        onClick={() => onChange(val)}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:flex-none ${
          value === val
            ? val === "gainers"
              ? "bg-emerald-500 text-white shadow-sm"
              : val === "losers"
                ? "bg-red-500 text-white shadow-sm"
                : "bg-white text-zinc-800 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        }`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {label}
      </button>
    ))}
  </div>
);

export default FilterDropdown;
