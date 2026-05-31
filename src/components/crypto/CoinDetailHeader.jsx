import PropTypes from "prop-types";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PriceChange from "../ui/PriceChange";
import { formatPrice } from "../../utils/formatCurrency";
import { useCurrency } from "../../context/CurrencyContext";

const CoinDetailHeader = ({ coin }) => {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const price = coin.market_data?.current_price?.[currency];
  const pct24h =
    coin.market_data?.price_change_percentage_24h_in_currency?.[currency];
  const rank = coin.market_cap_rank;

  return (
    <div className="animate-fade-up">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Market
      </button>

      {/* Header card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800/60 dark:bg-zinc-900/60 sm:p-6">
        {/* Mobile: full stack. sm+: side by side */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          {/* ── Left — coin identity ───────────────────────── */}
          <div className="flex items-start gap-3">
            <img
              src={coin.image?.large}
              alt={coin.name}
              className="h-10 w-10 shrink-0 rounded-full shadow-md sm:h-12 sm:w-12"
            />
            <div className="min-w-0">
              {/* Name + symbol */}
              <div className="flex flex-wrap items-center gap-1.5">
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                  {coin.name}
                </h1>
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs font-medium uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {coin.symbol}
                </span>
              </div>

              {/* Rank + category badges */}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {rank && (
                  <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                    Rank #{rank}
                  </span>
                )}
                {coin.categories?.[0] && (
                  <span className="max-w-[160px] truncate rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {coin.categories[0]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Right — price block ────────────────────────── */}
          {/* Mobile: left-aligned below identity. sm+: right-aligned */}
          <div className="sm:text-right">
            <div className="font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
              {formatPrice(price, currency)}
            </div>
            <div className="mt-1 flex items-center gap-2 sm:justify-end">
              <PriceChange value={pct24h} size="md" />
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                24h
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CoinDetailHeader.propTypes = {
  coin: PropTypes.shape({
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string,
    image: PropTypes.object,
    market_cap_rank: PropTypes.number,
    categories: PropTypes.array,
    market_data: PropTypes.object,
  }).isRequired,
};

export default CoinDetailHeader;
