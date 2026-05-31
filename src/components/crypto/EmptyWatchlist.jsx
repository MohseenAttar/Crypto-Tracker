import { Star } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Shown on the Watchlist page when no coins have been starred yet.
 * Guides the user back to the market table to start adding coins.
 */
const EmptyWatchlist = () => (
  <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 py-24 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
    {/* Icon */}
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <Star className="h-7 w-7 text-zinc-300 dark:text-zinc-700" />
    </div>

    {/* Text */}
    <div>
      <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
        Your watchlist is empty
      </p>
      <p className="mt-1.5 max-w-xs text-sm text-zinc-400 dark:text-zinc-600">
        Star any coin from the market table or coin detail page to track it
        here.
      </p>
    </div>

    {/* CTA */}
    <Link
      to="/"
      className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
    >
      <Star className="h-4 w-4" />
      Browse Market
    </Link>
  </div>
);

export default EmptyWatchlist;
