import { useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

import { useCoinDetail } from "../hooks/useCoinDetail";
import CoinDetailHeader from "../components/crypto/CoinDetailHeader";
import PriceHistoryChart from "../components/crypto/PriceHistoryChart";
import CoinStatsGrid from "../components/crypto/CoinStatsGrid";
import AboutSection from "../components/crypto/AboutSection";
import CoinLinks from "../components/crypto/CoinLinks";
import AddToPortfolioButton from "../components/crypto/AddToPortfolioButton";
import CoinDetailSkeleton from "../components/crypto/CoinDetailSkeleton";
import QuickStats from "../components/crypto/QuickStats";
import StarButton from "../components/ui/StarButton";

const CoinDetail = () => {
  const { id } = useParams();
  const { data: coin, isLoading, isError } = useCoinDetail(id);

  /* ── Loading state ──────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-screen-2xl px-3 py-6 sm:px-6 lg:px-8">
        <CoinDetailSkeleton />
      </main>
    );
  }

  /* ── Error state ────────────────────────────────────────────────── */
  if (isError || !coin) {
    return (
      <main className="mx-auto w-full max-w-screen-2xl px-3 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
          <AlertTriangle className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Could not load coin data.
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            This may be a rate limit. Please wait a moment and refresh.
          </p>
        </div>
      </main>
    );
  }

  /* ── Main content ───────────────────────────────────────────────── */
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-3 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        {/* Coin header — logo, name, price, 24h% */}
        <CoinDetailHeader coin={coin} />

        {/* Action bar — portfolio + watchlist
            Mobile: each button full width (flex-col)
            sm+:    inline side by side (flex-row) */}
        <div
          className="flex flex-col gap-2 animate-fade-up sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
          style={{ animationDelay: "60ms" }}
        >
          <div className="w-full sm:w-auto">
            <AddToPortfolioButton coin={coin} />
          </div>
          <div className="flex w-full items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900 sm:w-auto">
            <StarButton coinId={coin.id} />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Add to Watchlist
            </span>
          </div>
        </div>

        {/* Two-column layout — chart + quick stats */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:items-start">
          <div
            className="xl:col-span-2 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            <PriceHistoryChart coinId={id} />
          </div>
          <div
            className="animate-fade-up xl:flex xl:flex-col"
            style={{ animationDelay: "140ms" }}
          >
            <QuickStats coin={coin} />
          </div>
        </div>

        {/* Full stats grid */}
        <div className="animate-fade-up" style={{ animationDelay: "180ms" }}>
          <CoinStatsGrid coin={coin} />
        </div>

        {/* About + links */}
        <div
          className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-fade-up"
          style={{ animationDelay: "220ms" }}
        >
          <div className="lg:col-span-2">
            <AboutSection coin={coin} />
          </div>
          <div>
            <CoinLinks coin={coin} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CoinDetail;
