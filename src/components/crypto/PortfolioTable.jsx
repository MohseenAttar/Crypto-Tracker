import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Check, X, AlertTriangle } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { useCurrency } from "../../context/CurrencyContext";
import { formatPrice } from "../../utils/formatCurrency";
import PriceChange from "../ui/PriceChange";
import Modal from "../ui/Modal";
import toast from "react-hot-toast";

/* ── Remove confirmation modal ────────────────────────────────────── */
const RemoveModal = ({ isOpen, onClose, onConfirm, coin }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Remove from portfolio">
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
        {coin?.image && (
          <img
            src={coin.image}
            alt={coin.name}
            className="h-9 w-9 rounded-full"
          />
        )}
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {coin?.name}
          </p>
          <p className="font-mono text-xs uppercase text-zinc-400">
            {coin?.symbol}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Are you sure you want to remove{" "}
          <span className="font-semibold">{coin?.name}</span> from your
          portfolio? This action cannot be undone.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Yes, Remove
        </button>
      </div>
    </div>
  </Modal>
);

/* ── Portfolio row ────────────────────────────────────────────────── */
const PortfolioRow = ({ item }) => {
  const navigate = useNavigate();
  const { dispatch } = usePortfolio();
  const { currency } = useCurrency();

  const [editing, setEditing] = useState(false);
  const [qtyInput, setQtyInput] = useState(item.qty.toString());
  const [removeModal, setRemoveModal] = useState(false);

  const isPnLUp = item.pnl >= 0;

  const handleSave = () => {
    const newQty = parseFloat(qtyInput);
    if (!newQty || newQty <= 0) {
      toast.error("Quantity must be greater than 0.");
      return;
    }
    dispatch({ type: "UPDATE", payload: { id: item.id, qty: newQty } });
    setEditing(false);
    toast.success("Quantity updated.");
  };

  const handleRemove = () => {
    dispatch({ type: "REMOVE", payload: item.id });
    setRemoveModal(false);
    toast.success(`${item.name} removed from portfolio.`);
  };

  return (
    <>
      <tr className="group border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/20">
        {/* Coin */}
        <td className="py-3 pl-4 pr-4">
          <button
            onClick={() => navigate(`/coin/${item.id}`)}
            className="flex items-center gap-2.5 text-left"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-7 w-7 shrink-0 rounded-full"
              loading="lazy"
            />
            <div>
              <p className="whitespace-nowrap text-sm font-medium text-zinc-800 transition-colors group-hover:text-brand-600 dark:text-zinc-100 dark:group-hover:text-brand-400">
                {item.name}
              </p>
              <p className="font-mono text-xs uppercase text-zinc-400 dark:text-zinc-600">
                {item.symbol}
              </p>
            </div>
          </button>
        </td>

        {/* Quantity — inline editable */}
        <td className="py-3 pr-4">
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={qtyInput}
                onChange={(e) => setQtyInput(e.target.value)}
                autoFocus
                min="0"
                step="any"
                className="h-8 w-20 rounded-lg border border-brand-500 bg-white px-2 font-mono text-xs text-zinc-800 outline-none focus:ring-1 focus:ring-brand-500/30 dark:bg-zinc-800 dark:text-zinc-100"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") {
                    setEditing(false);
                    setQtyInput(item.qty.toString());
                  }
                }}
              />
              <button
                onClick={handleSave}
                className="rounded p-1 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                aria-label="Save"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setQtyInput(item.qty.toString());
                }}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                aria-label="Cancel"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              title="Click to edit"
            >
              <span className="whitespace-nowrap">{item.qty}</span>
              <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50" />
            </button>
          )}
        </td>

        {/* Avg buy price */}
        <td className="py-3 pr-4">
          <span className="whitespace-nowrap font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {formatPrice(item.buyPrice, currency)}
          </span>
        </td>

        {/* Current price */}
        <td className="py-3 pr-4">
          <span className="whitespace-nowrap font-mono text-sm font-medium text-zinc-800 dark:text-zinc-100">
            {formatPrice(item.currentPrice, currency)}
          </span>
        </td>

        {/* 24h % */}
        <td className="py-3 pr-4">
          <PriceChange value={item.pct24h} size="sm" />
        </td>

        {/* Current value */}
        <td className="py-3 pr-4 text-right">
          <span className="whitespace-nowrap font-mono text-sm font-medium text-zinc-800 dark:text-zinc-100">
            {formatPrice(item.currentValue, currency)}
          </span>
        </td>

        {/* P&L */}
        <td className="py-3 pr-4 text-right">
          <div className="flex flex-col items-end gap-0.5">
            <span
              className={`whitespace-nowrap font-mono text-xs font-medium ${
                isPnLUp
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {isPnLUp ? "+" : ""}
              {formatPrice(item.pnl, currency)}
            </span>
            <span
              className={`font-mono text-xs ${
                isPnLUp
                  ? "text-emerald-500/70 dark:text-emerald-400/70"
                  : "text-red-500/70 dark:text-red-400/70"
              }`}
            >
              {isPnLUp ? "+" : ""}
              {item.pnlPct.toFixed(2)}%
            </span>
          </div>
        </td>

        {/* Actions */}
        <td className="py-3 pr-4 text-right">
          <button
            onClick={() => setRemoveModal(true)}
            className="rounded p-1.5 text-zinc-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-zinc-700 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            aria-label={`Remove ${item.name} from portfolio`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </td>
      </tr>

      <RemoveModal
        isOpen={removeModal}
        onClose={() => setRemoveModal(false)}
        onConfirm={handleRemove}
        coin={item}
      />
    </>
  );
};

/* ── Full portfolio table ─────────────────────────────────────────── */
const PortfolioTable = ({ enriched }) => {
  const [sortKey, setSortKey] = useState("currentValue");
  const [sortDesc, setSortDesc] = useState(true);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const sorted = [...enriched].sort((a, b) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    return sortDesc ? bv - av : av - bv;
  });

  const ColHeader = ({ label, sortId, className = "" }) => (
    <th
      onClick={() => handleSort(sortId)}
      className={`cursor-pointer whitespace-nowrap py-3 pr-4 first:pl-4 text-xs font-medium uppercase tracking-wider transition-colors hover:text-zinc-800 dark:hover:text-zinc-300 ${
        sortKey === sortId
          ? "text-brand-600 dark:text-brand-400"
          : "text-zinc-400 dark:text-zinc-600"
      } ${className}`}
    >
      {label} {sortKey === sortId ? (sortDesc ? "↓" : "↑") : ""}
    </th>
  );

  return (
    /*
     * Horizontal scroll — same pattern as market CoinTable.
     * min-w-[640px] ensures all 8 columns always visible.
     * On small screens users scroll left/right to see all data.
     */
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800/60 dark:bg-transparent">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
            <th className="whitespace-nowrap py-3 pl-4 pr-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              Coin
            </th>
            <ColHeader label="Qty" sortId="qty" />
            <th className="whitespace-nowrap py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              Avg Buy
            </th>
            <ColHeader label="Price" sortId="currentPrice" />
            <th className="whitespace-nowrap py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              24h %
            </th>
            <ColHeader
              label="Value"
              sortId="currentValue"
              className="text-right"
            />
            <ColHeader label="P&L" sortId="pnl" className="text-right" />
            <th className="whitespace-nowrap py-3 pr-4 text-right text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
          {sorted.map((item) => (
            <PortfolioRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;
