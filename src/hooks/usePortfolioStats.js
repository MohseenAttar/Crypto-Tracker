import { useMemo } from "react";

/**
 * Pure computation hook — derives all portfolio statistics
 * from portfolio (local state) + liveCoins (API data).
 *
 * Keeps Portfolio page components clean — they just consume
 * pre-computed values without any calculation logic.
 *
 * Returns:
 *   enriched     — portfolio items with live prices + P&L attached
 *   totalValue   — sum of (qty * currentPrice) for all coins
 *   totalCost    — sum of (qty * buyPrice) for all coins
 *   totalPnL     — totalValue - totalCost
 *   totalPnLPct  — (totalPnL / totalCost) * 100
 *   bestPerformer  — coin with highest P&L %
 *   worstPerformer — coin with lowest P&L %
 *   allocationData — array for Recharts PieChart
 */
export const usePortfolioStats = (portfolio, liveCoins) =>
  useMemo(() => {
    if (!portfolio.length || !liveCoins.length) {
      return {
        enriched: [],
        totalValue: 0,
        totalCost: 0,
        totalPnL: 0,
        totalPnLPct: 0,
        bestPerformer: null,
        worstPerformer: null,
        allocationData: [],
      };
    }

    // Build a fast lookup map: coinId → live market data
    const priceMap = Object.fromEntries(liveCoins.map((c) => [c.id, c]));

    // Enrich each portfolio entry with live prices + computed P&L
    const enriched = portfolio
      .filter((p) => priceMap[p.id]) // only include coins we have prices for
      .map((p) => {
        const live = priceMap[p.id];
        const currentPrice = live.current_price ?? 0;
        const currentValue = p.qty * currentPrice;
        const costBasis = p.qty * (p.buyPrice ?? 0);
        const pnl = currentValue - costBasis;
        const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

        return {
          ...p,
          currentPrice,
          currentValue,
          costBasis,
          pnl,
          pnlPct,
          pct24h:
            live.price_change_percentage_24h_in_currency ??
            live.price_change_percentage_24h ??
            0,
          image: live.image ?? p.image,
        };
      });

    const totalValue = enriched.reduce((s, c) => s + c.currentValue, 0);
    const totalCost = enriched.reduce((s, c) => s + c.costBasis, 0);
    const totalPnL = totalValue - totalCost;
    const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    const sorted = [...enriched].sort((a, b) => b.pnlPct - a.pnlPct);
    const bestPerformer = sorted[0] ?? null;
    const worstPerformer = sorted[sorted.length - 1] ?? null;

    // Allocation data for Recharts PieChart
    const allocationData = enriched
      .map((c) => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol?.toUpperCase(),
        value: c.currentValue,
        pct: totalValue > 0 ? (c.currentValue / totalValue) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      enriched,
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPct,
      bestPerformer,
      worstPerformer,
      allocationData,
    };
  }, [portfolio, liveCoins]);
