import { memo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import PriceChange from "../ui/PriceChange";
import StarButton from "../ui/StarButton";
import Sparkline from "./Sparkline";
import { formatPrice, formatMarketCap } from "../../utils/formatCurrency";
import { useCurrency } from "../../context/CurrencyContext";

/**
 * Single row in the market table.
 * Wrapped with React.memo + custom comparator for performance.
 */
const CoinRow = ({ coin, rank = null, style = {} }) => {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const pct7d = coin.price_change_percentage_7d_in_currency;
  const isUp = (pct7d ?? 0) >= 0;

  return (
    <tr
      onClick={() => navigate(`/coin/${coin.id}`)}
      className="group cursor-pointer border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/30"
      style={style}
    >
      {/* Rank + star */}
      <td className="w-12 py-3 pl-4 pr-2">
        <div className="flex items-center gap-1.5">
          <StarButton coinId={coin.id} />
          <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
            {rank}
          </span>
        </div>
      </td>

      {/* Coin name + icon */}
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2.5">
          <img
            src={coin.image}
            alt={coin.name}
            className="h-7 w-7 shrink-0 rounded-full"
            loading="lazy"
          />
          <div className="min-w-0">
            <div className="whitespace-nowrap text-sm font-medium text-zinc-800 transition-colors group-hover:text-brand-600 dark:text-zinc-100 dark:group-hover:text-brand-400">
              {coin.name}
            </div>
            <div className="font-mono text-xs uppercase text-zinc-400 dark:text-zinc-600">
              {coin.symbol}
            </div>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-3 pr-4 text-right">
        <span className="whitespace-nowrap font-mono text-sm font-medium text-zinc-800 dark:text-zinc-100">
          {formatPrice(coin.current_price, currency)}
        </span>
      </td>

      {/* 1h % */}
      <td className="py-3 pr-4 text-right">
        <PriceChange
          value={coin.price_change_percentage_1h_in_currency}
          size="sm"
        />
      </td>

      {/* 24h % */}
      <td className="py-3 pr-4 text-right">
        <PriceChange
          value={coin.price_change_percentage_24h_in_currency}
          size="sm"
        />
      </td>

      {/* 7d % */}
      <td className="py-3 pr-4 text-right">
        <PriceChange value={pct7d} size="sm" />
      </td>

      {/* Market cap */}
      <td className="py-3 pr-4 text-right">
        <span className="whitespace-nowrap font-mono text-xs text-zinc-500 dark:text-zinc-400">
          {formatMarketCap(coin.market_cap, currency)}
        </span>
      </td>

      {/* 7d sparkline */}
      <td className="py-3 pr-4">
        <Sparkline prices={coin.sparkline_in_7d?.price} isUp={isUp} />
      </td>
    </tr>
  );
};

CoinRow.propTypes = {
  coin: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    image: PropTypes.string,
    current_price: PropTypes.number,
    market_cap: PropTypes.number,
    market_cap_rank: PropTypes.number,
    price_change_percentage_1h_in_currency: PropTypes.number,
    price_change_percentage_24h_in_currency: PropTypes.number,
    price_change_percentage_7d_in_currency: PropTypes.number,
    sparkline_in_7d: PropTypes.object,
  }).isRequired,
  rank: PropTypes.number,
  style: PropTypes.object,
};

// Custom memo — only re-render when price-relevant data changes
export default memo(
  CoinRow,
  (prev, next) =>
    prev.coin.current_price === next.coin.current_price &&
    prev.coin.price_change_percentage_24h_in_currency ===
      next.coin.price_change_percentage_24h_in_currency &&
    prev.coin.price_change_percentage_7d_in_currency ===
      next.coin.price_change_percentage_7d_in_currency &&
    prev.rank === next.rank,
);
