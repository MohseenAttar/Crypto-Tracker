import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search coins…" }) => (
  <div className="relative flex-1">
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-8 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:border-brand-500"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        aria-label="Clear search"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

export default SearchBar;
