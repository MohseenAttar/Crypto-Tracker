import { useState, useMemo, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import MarketStatsBar from "../components/crypto/MarketStatsBar";
import CoinTable from "../components/crypto/CoinTable";
import SearchBar from "../components/ui/SearchBar";
import FilterDropdown from "../components/ui/FilterDropdown";
import Pagination from "../components/ui/Pagination";

import { useCoinMarkets } from "../hooks/useCoinMarkets";
import { useTopCoins } from "../hooks/useTopCoins";
import { useDebounce } from "../hooks/useDebounce";
import { useCurrency } from "../context/CurrencyContext";

const ITEMS_PER_PAGE = 20;

const LIVE_DOT = (
  <span className="relative flex h-2 w-2 shrink-0">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
  </span>
);

const Home = () => {
  const queryClient = useQueryClient();
  const { currency } = useCurrency();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const debouncedSearch = useDebounce(search, 300);
  const isFilterMode = filter !== "all";

  /*
   * Hybrid pagination strategy:
   *
   * "All" filter → server-side pagination via useCoinMarkets
   *   - 20 coins per page from API
   *   - Each page = separate cached API call
   *   - Unlimited browsing across all 13,000+ coins
   *   - Search works on current page coins only
   *
   * "Gainers" / "Losers" → client-side via useTopCoins
   *   - 250 coins fetched once and cached for 5 min
   *   - Filter + sort + paginate entirely in memory
   *   - Pagination works correctly across all matching coins
   *   - Search works across all 250 coins
   */
  const {
    data: serverCoins = [],
    isLoading: serverLoading,
    isFetching: serverFetching,
    error: serverError,
  } = useCoinMarkets(currency, page);

  const {
    data: topCoins = [],
    isLoading: topLoading,
    isFetching: topFetching,
  } = useTopCoins(currency);

  // Active data source depends on filter mode
  const isLoading = isFilterMode ? topLoading : serverLoading;
  const isFetching = isFilterMode ? topFetching : serverFetching;

  // ── Filter pipeline (only in Gainers/Losers mode) ──────────────
  const afterFilter = useMemo(() => {
    if (!isFilterMode) return topCoins; // unused in "all" mode

    if (filter === "gainers") {
      return [...topCoins]
        .filter((c) => (c.price_change_percentage_24h ?? 0) > 0)
        .sort(
          (a, b) =>
            (b.price_change_percentage_24h ?? 0) -
            (a.price_change_percentage_24h ?? 0),
        );
    }
    // losers
    return [...topCoins]
      .filter((c) => (c.price_change_percentage_24h ?? 0) < 0)
      .sort(
        (a, b) =>
          (a.price_change_percentage_24h ?? 0) -
          (b.price_change_percentage_24h ?? 0),
      );
  }, [topCoins, filter, isFilterMode]);

  // ── Search (applied on top of filter or server coins) ──────────
  const afterSearch = useMemo(() => {
    const source = isFilterMode ? afterFilter : serverCoins;
    if (!debouncedSearch) return source;
    const q = debouncedSearch.toLowerCase();
    return source.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q),
    );
  }, [isFilterMode, afterFilter, serverCoins, debouncedSearch]);

  // ── Client-side pagination (filter mode only) ──────────────────
  const clientTotalPages = Math.max(
    1,
    Math.ceil(afterSearch.length / ITEMS_PER_PAGE),
  );
  const clientPaginated = afterSearch.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // Final data sent to table
  const tableData = isFilterMode ? clientPaginated : afterSearch;
  const totalPages = isFilterMode ? clientTotalPages : null; // null = server handles it

  // Clamp page when filter reduces total pages
  useEffect(() => {
    if (isFilterMode && page > clientTotalPages) {
      setPage(clientTotalPages);
    }
  }, [clientTotalPages, page, isFilterMode]);

  const handleFilterChange = (val) => {
    setFilter(val);
    setPage(1);
    setSearch("");
  };

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["coin-markets"] });
    queryClient.invalidateQueries({ queryKey: ["top-coins"] });
    queryClient.invalidateQueries({ queryKey: ["global-stats"] });
  };

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resultLabel =
    isFilterMode && !isLoading
      ? `${afterSearch.length} ${filter === "gainers" ? "gaining" : "losing"} coin${afterSearch.length !== 1 ? "s" : ""} · page ${page} of ${clientTotalPages}`
      : null;

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-3 py-6 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="animate-fade-up">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-2xl lg:text-3xl">
            Cryptocurrency Prices
          </h1>
          <p className="mt-1.5 flex items-center gap-2 text-sm text-zinc-500">
            {LIVE_DOT}
            Live · updates every 60s via CoinGecko
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-700 disabled:opacity-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Global stats */}
      <div className="mb-6">
        <MarketStatsBar />
      </div>

      {/* Search + filter */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder={
            isFilterMode
              ? `Search ${filter === "gainers" ? "gainers" : "losers"}…`
              : "Search by name or symbol…"
          }
        />
        <FilterDropdown value={filter} onChange={handleFilterChange} />
      </div>

      {/* Result label in filter mode */}
      {resultLabel && (
        <p className="mb-3 text-xs text-zinc-400 dark:text-zinc-600">
          {resultLabel}
        </p>
      )}

      {/* Error state */}
      {serverError && !isFilterMode && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Failed to load coins. Please click Refresh to try again.
        </div>
      )}

      {/* Coin table */}
      <CoinTable data={tableData} isLoading={isLoading} />

      {/*
       * Pagination:
       * - "All" mode    → server-side: hasNext = full page returned (20 coins)
       * - Filter mode   → client-side: hasNext = more pages exist locally
       * - Search active → hide pagination (results may span fewer coins)
       */}
      {!debouncedSearch && (
        <Pagination
          page={page}
          onPageChange={handlePageChange}
          hasNext={
            isFilterMode ? page < clientTotalPages : serverCoins.length === 20
          }
        />
      )}
    </main>
  );
};

export default Home;
