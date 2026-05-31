import { useState, useMemo } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import Modal from "../ui/Modal";
import { useCoinSearch } from "../../hooks/useCoinSearch";
import { usePortfolio } from "../../context/PortfolioContext";
import { useCurrency } from "../../context/CurrencyContext";
import { formatPrice } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

/**
 * Add coin to portfolio modal with live search.
 *
 * Production approach — two-stage flow:
 * Step 1: Live search via CoinGecko /search → fetches from all 13,000+ coins
 *         Results show top 20 matches with live prices
 * Step 2: Enter quantity + buy price → dispatch ADD to PortfolioContext
 *
 * No limit on which coins can be added — any coin on CoinGecko works.
 */
const AddCoinModal = ({ isOpen, onClose }) => {
  const { currency } = useCurrency();
  const { portfolio, dispatch } = usePortfolio();

  const [step, setStep] = useState("search");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  // Live search — debounced 400ms, searches all 13,000+ coins
  const { results, isLoading, hasQuery } = useCoinSearch(query, currency);

  // IDs already in portfolio — shown as disabled in list
  const portfolioIds = useMemo(
    () => new Set(portfolio.map((p) => p.id)),
    [portfolio],
  );

  const handleSelect = (coin) => {
    setSelected(coin);
    setBuyPrice(coin.current_price?.toString() ?? "");
    setStep("form");
  };

  const handleAdd = () => {
    const quantity = parseFloat(qty);
    const buy = parseFloat(buyPrice);

    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }
    if (buyPrice && buy <= 0) {
      toast.error("Buy price must be greater than 0.");
      return;
    }

    dispatch({
      type: "ADD",
      payload: {
        id: selected.id,
        name: selected.name,
        symbol: selected.symbol,
        image: selected.image,
        qty: quantity,
        buyPrice: buyPrice ? buy : (selected.current_price ?? 0),
        addedAt: Date.now(),
      },
    });

    toast.success(`${selected.name} added to portfolio!`);
    handleClose();
  };

  const handleClose = () => {
    setStep("search");
    setQuery("");
    setSelected(null);
    setQty("");
    setBuyPrice("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        step === "search" ? "Add coin to portfolio" : `Add ${selected?.name}`
      }
    >
      {step === "search" ? (
        <div className="flex flex-col gap-3">
          {/* Live search input */}
          <div className="relative">
            {isLoading ? (
              <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-400" />
            ) : (
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any coin — e.g. Bitcoin, ETH, Doge…"
              autoFocus
              className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-600"
            />
          </div>

          {/* Hint text */}
          {!hasQuery && (
            <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
              Type at least 2 characters to search all coins
            </p>
          )}

          {/* Search results */}
          {hasQuery && (
            <div className="max-h-72 overflow-y-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-8">
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                  <span className="text-sm text-zinc-400">Searching…</span>
                </div>
              ) : results.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-400">
                  No coins found for "{query}"
                </p>
              ) : (
                results.map((coin) => {
                  const alreadyAdded = portfolioIds.has(coin.id);
                  return (
                    <button
                      key={coin.id}
                      onClick={() => !alreadyAdded && handleSelect(coin)}
                      disabled={alreadyAdded}
                      className={`flex w-full items-center justify-between px-3 py-2.5 transition-colors ${
                        alreadyAdded
                          ? "cursor-not-allowed opacity-40"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="h-7 w-7 rounded-full"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div className="text-left">
                          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                            {coin.name}
                          </p>
                          <p className="font-mono text-xs uppercase text-zinc-400">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          {coin.current_price
                            ? formatPrice(coin.current_price, currency)
                            : "—"}
                        </p>
                        {alreadyAdded ? (
                          <p className="text-xs text-zinc-400">Already added</p>
                        ) : coin.market_cap_rank ? (
                          <p className="text-xs text-zinc-400">
                            Rank #{coin.market_cap_rank}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Selected coin preview */}
          <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
            <img
              src={selected.image}
              alt={selected.name}
              className="h-9 w-9 rounded-full"
            />
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {selected.name}
              </p>
              <p className="font-mono text-xs text-zinc-400">
                Current: {formatPrice(selected.current_price, currency)}
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Quantity <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder={`e.g. 0.5 ${selected.symbol?.toUpperCase()}`}
              autoFocus
              min="0"
              step="any"
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-600"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
          </div>

          {/* Buy price */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Buy price{" "}
              <span className="text-zinc-400">
                (optional — defaults to current price)
              </span>
            </label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder={formatPrice(selected.current_price, currency)}
              min="0"
              step="any"
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-600"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setStep("search")}
              className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
            >
              Back
            </button>
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" />
              Add to Portfolio
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddCoinModal;
