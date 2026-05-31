import { useState, useMemo, useEffect, useRef } from "react";
import { Star, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import CoinTable from "../components/crypto/CoinTable";
import EmptyWatchlist from "../components/crypto/EmptyWatchlist";
import SearchBar from "../components/ui/SearchBar";
import Pagination from "../components/ui/Pagination";
import PageHeader from "../components/layout/PageHeader";

import { useWatchlistCoins } from "../hooks/useWatchlistCoins";
import { useDebounce } from "../hooks/useDebounce";
import { useWatchlist } from "../context/WatchlistContext";
import { useCurrency } from "../context/CurrencyContext";

const ITEMS_PER_PAGE = 20;

const Watchlist = () => {
  const queryClient = useQueryClient();
  const { currency } = useCurrency();
  const { watchlist } = useWatchlist();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const hasLoadedOnce = useRef(false);

  const {
    data: rawCoins = [],
    isLoading,
    isFetching,
  } = useWatchlistCoins(watchlist, currency);

  if (rawCoins.length > 0) hasLoadedOnce.current = true;
  if (watchlist.length === 0) hasLoadedOnce.current = false;

  const showSkeleton = isLoading && !hasLoadedOnce.current;

  // Derive display list from authoritative WatchlistContext
  const coins = useMemo(
    () => rawCoins.filter((c) => watchlist.includes(c.id)),
    [rawCoins, watchlist],
  );

  const filtered = useMemo(() => {
    if (!debouncedSearch) return coins;
    const q = debouncedSearch.toLowerCase();
    return coins.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q),
    );
  }, [coins, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // Clamp to last valid page when items are removed
  useEffect(() => {
    if (!showSkeleton && page > totalPages) setPage(totalPages);
  }, [totalPages, page, showSkeleton]);

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };
  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleRefresh = () =>
    queryClient.invalidateQueries({ queryKey: ["watchlist-coins"] });

  const rangeStart =
    filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd = Math.min(page * ITEMS_PER_PAGE, filtered.length);

  /* ── Empty state ────────────────────────────────────────────────── */
  if (!showSkeleton && watchlist.length === 0) {
    return (
      <main className="mx-auto w-full max-w-screen-2xl px-3 py-6 sm:px-6 lg:px-8">
        <PageHeader
          icon={<Star className="h-6 w-6 fill-amber-400 text-amber-400" />}
          title="Watchlist"
          subtitle="No coins starred yet"
          isFetching={isFetching}
          onRefresh={handleRefresh}
        />
        <EmptyWatchlist />
      </main>
    );
  }

  /* ── Main view ──────────────────────────────────────────────────── */
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-3 py-6 sm:px-6 lg:px-8">
      <PageHeader
        icon={<Star className="h-6 w-6 fill-amber-400 text-amber-400" />}
        title="Watchlist"
        subtitle={
          coins.length > 0
            ? `${coins.length} coin${coins.length !== 1 ? "s" : ""} tracked · live prices`
            : "No coins starred yet"
        }
        isFetching={isFetching}
        onRefresh={handleRefresh}
      />

      {watchlist.length > 0 && (
        <div className="mb-4">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search your watchlist…"
          />
        </div>
      )}

      {!showSkeleton && filtered.length === 0 && debouncedSearch && (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-16 dark:border-zinc-800">
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            No coins match "{debouncedSearch}"
          </p>
        </div>
      )}

      {(showSkeleton || paginated.length > 0) && (
        <CoinTable data={paginated} isLoading={showSkeleton} />
      )}

      {!showSkeleton && totalPages > 1 && (
        <Pagination
          page={page}
          onPageChange={handlePageChange}
          hasNext={page < totalPages}
        />
      )}

      {!showSkeleton && coins.length > 0 && (
        <p className="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-600">
          Showing {rangeStart}–{rangeEnd} of {filtered.length} coin
          {filtered.length !== 1 ? "s" : ""} · prices update every 60s
        </p>
      )}
    </main>
  );
};

export default Watchlist;
