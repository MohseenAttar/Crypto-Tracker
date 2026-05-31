import { Star } from "lucide-react";
import { useWatchlist } from "../../context/WatchlistContext";

const StarButton = ({ coinId }) => {
  const { toggle, isWatched } = useWatchlist();
  const watched = isWatched(coinId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(coinId);
      }}
      aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
      className="rounded p-1 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
    >
      <Star
        className={`h-3.5 w-3.5 transition-colors ${
          watched
            ? "fill-amber-400 text-amber-400"
            : "text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400"
        }`}
      />
    </button>
  );
};

export default StarButton;
