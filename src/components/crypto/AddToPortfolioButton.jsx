import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import toast from "react-hot-toast";

/**
 * Add-to-portfolio button shown on the Coin Detail page.
 * If the coin is already in the portfolio, shows a "Added" state.
 * Uses PortfolioContext (useReducer + localStorage).
 */
const AddToPortfolioButton = ({ coin }) => {
  const { portfolio, dispatch } = usePortfolio();
  const [qty, setQty] = useState("");
  const [open, setOpen] = useState(false);

  const isAdded = portfolio.some((p) => p.id === coin.id);

  const handleAdd = () => {
    const quantity = parseFloat(qty);
    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    dispatch({
      type: "ADD",
      payload: {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image?.small,
        qty: quantity,
        buyPrice: coin.market_data?.current_price?.usd ?? 0,
      },
    });

    toast.success(`${coin.name} added to portfolio!`);
    setOpen(false);
    setQty("");
  };

  const handleRemove = () => {
    dispatch({ type: "REMOVE", payload: coin.id });
    toast.success(`${coin.name} removed from portfolio.`);
  };

  if (isAdded) {
    return (
      <button
        onClick={handleRemove}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-400"
      >
        <Check className="h-4 w-4" />
        In Portfolio · Click to remove
      </button>
    );
  }

  if (open) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder={`Qty (e.g. 0.5 ${coin.symbol?.toUpperCase()})`}
          className="h-10 w-44 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-600"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
            if (e.key === "Escape") setOpen(false);
          }}
        />
        <button
          onClick={handleAdd}
          className="flex h-10 items-center gap-1.5 rounded-xl bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setQty("");
          }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
    >
      <Plus className="h-4 w-4" />
      Add to Portfolio
    </button>
  );
};

export default AddToPortfolioButton;
