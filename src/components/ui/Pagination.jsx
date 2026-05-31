import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, onPageChange, hasNext }) => (
  <div className="flex items-center justify-center gap-3 py-6">
    <button
      onClick={() => onPageChange(page - 1)}
      disabled={page === 1}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-800 disabled:pointer-events-none disabled:opacity-30 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
      aria-label="Previous page"
    >
      <ChevronLeft className="h-4 w-4" />
    </button>

    <span className="min-w-[5rem] text-center text-sm text-zinc-500 dark:text-zinc-400">
      Page{" "}
      <span className="font-medium text-zinc-800 dark:text-zinc-100">
        {page}
      </span>
    </span>

    <button
      onClick={() => onPageChange(page + 1)}
      disabled={!hasNext}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-800 disabled:pointer-events-none disabled:opacity-30 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
      aria-label="Next page"
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>
);

export default Pagination;
