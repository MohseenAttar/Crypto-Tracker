import { useState, useRef } from "react";
import { Plus, Briefcase } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import PortfolioSummary from "../components/crypto/PortfolioSummary";
import AllocationChart from "../components/crypto/AllocationChart";
import PortfolioTable from "../components/crypto/PortfolioTable";
import AddCoinModal from "../components/crypto/AddCoinModal";
import EmptyPortfolio from "../components/crypto/EmptyPortfolio";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import PageHeader from "../components/layout/PageHeader";

import { usePortfolioCoins } from "../hooks/usePortfolioCoins";
import { usePortfolioStats } from "../hooks/usePortfolioStats";
import { usePortfolio } from "../context/PortfolioContext";
import { useCurrency } from "../context/CurrencyContext";

const Portfolio = () => {
  const queryClient = useQueryClient();
  const { currency } = useCurrency();
  const { portfolio } = usePortfolio();

  const [modalOpen, setModalOpen] = useState(false);

  const portfolioIds = portfolio.map((p) => p.id);
  const hasLoadedOnce = useRef(false);

  const {
    data: liveCoins = [],
    isLoading,
    isFetching,
  } = usePortfolioCoins(portfolioIds, currency);

  if (liveCoins.length > 0) hasLoadedOnce.current = true;
  if (portfolio.length === 0) hasLoadedOnce.current = false;

  const showSkeleton =
    isLoading && !hasLoadedOnce.current && portfolio.length > 0;

  const {
    enriched,
    totalValue,
    totalPnL,
    totalPnLPct,
    bestPerformer,
    worstPerformer,
    allocationData,
  } = usePortfolioStats(portfolio, liveCoins);

  const handleRefresh = () =>
    queryClient.invalidateQueries({ queryKey: ["portfolio-coins"] });

  // Shared add coin button — passed to PageHeader as action prop
  const AddButton = (
    <button
      onClick={() => setModalOpen(true)}
      className="flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-700"
    >
      <Plus className="h-3.5 w-3.5" />
      Add coin
    </button>
  );

  // Live dot for subtitle
  const LiveDot = () => (
    <span className="relative mr-1 inline-flex h-2 w-2 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
  );

  const subtitle =
    portfolio.length > 0 ? (
      <span className="flex items-center gap-1.5">
        <LiveDot />
        {portfolio.length} coin{portfolio.length !== 1 ? "s" : ""} tracked · P&L
        updates every 60s
      </span>
    ) : null;

  /* ── Empty state ────────────────────────────────────────────────── */
  if (portfolio.length === 0) {
    return (
      <main className="mx-auto w-full max-w-screen-2xl px-3 py-6 sm:px-6 lg:px-8">
        <PageHeader
          icon={
            <Briefcase className="h-6 w-6 text-brand-500 dark:text-brand-400" />
          }
          title="Portfolio"
          isFetching={false}
          onRefresh={handleRefresh}
          action={AddButton}
        />
        <EmptyPortfolio onAdd={() => setModalOpen(true)} />
        <AddCoinModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </main>
    );
  }

  /* ── Skeleton state ─────────────────────────────────────────────── */
  if (showSkeleton) {
    return (
      <main className="mx-auto w-full max-w-screen-2xl px-3 py-6 sm:px-6 lg:px-8">
        <PageHeader
          icon={
            <Briefcase className="h-6 w-6 text-brand-500 dark:text-brand-400" />
          }
          title="Portfolio"
          isFetching={true}
          onRefresh={handleRefresh}
          action={AddButton}
        />
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <LoadingSkeleton className="h-80 rounded-2xl" />
          <LoadingSkeleton className="h-64 rounded-2xl" />
        </div>
        <AddCoinModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </main>
    );
  }

  /* ── Main view ──────────────────────────────────────────────────── */
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-3 py-6 sm:px-6 lg:px-8">
      <PageHeader
        icon={
          <Briefcase className="h-6 w-6 text-brand-500 dark:text-brand-400" />
        }
        title="Portfolio"
        subtitle={subtitle}
        isFetching={isFetching}
        onRefresh={handleRefresh}
        action={AddButton}
      />

      <div className="flex flex-col gap-6">
        <div className="animate-fade-up">
          <PortfolioSummary
            totalValue={totalValue}
            totalPnL={totalPnL}
            totalPnLPct={totalPnLPct}
            bestPerformer={bestPerformer}
            worstPerformer={worstPerformer}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div
            className="animate-fade-up xl:col-span-1"
            style={{ animationDelay: "80ms" }}
          >
            <AllocationChart data={allocationData} />
          </div>
          <div
            className="animate-fade-up xl:col-span-2"
            style={{ animationDelay: "120ms" }}
          >
            <PortfolioTable enriched={enriched} />
          </div>
        </div>
      </div>

      <AddCoinModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
};

export default Portfolio;
