import { Briefcase } from "lucide-react";

const EmptyPortfolio = ({ onAdd }) => (
  <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 py-24 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <Briefcase className="h-7 w-7 text-zinc-300 dark:text-zinc-700" />
    </div>
    <div>
      <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
        Your portfolio is empty
      </p>
      <p className="mt-1.5 max-w-xs text-sm text-zinc-400 dark:text-zinc-600">
        Add coins and track your investments with live P&L calculations.
      </p>
    </div>
    <button
      onClick={onAdd}
      className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
    >
      <Briefcase className="h-4 w-4" />
      Add your first coin
    </button>
  </div>
);

export default EmptyPortfolio;
