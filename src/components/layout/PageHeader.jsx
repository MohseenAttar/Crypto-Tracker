import PropTypes from "prop-types";
import { RefreshCw } from "lucide-react";

/**
 * Shared page header component used by Watchlist and Portfolio pages.
 * Renders title, subtitle, optional refresh button, and optional action button.
 */
const PageHeader = ({
  icon = null,
  title,
  subtitle = null,
  isFetching = false,
  onRefresh,
  action = null,
}) => (
  <div className="mb-6 flex animate-fade-up flex-wrap items-start justify-between gap-3">
    <div>
      <h1 className="flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-2xl lg:text-3xl">
        {icon}
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={onRefresh}
        disabled={isFetching}
        className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-700 disabled:opacity-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
        aria-label="Refresh data"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
        />
        Refresh
      </button>
      {action}
    </div>
  </div>
);

PageHeader.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isFetching: PropTypes.bool,
  onRefresh: PropTypes.func.isRequired,
  action: PropTypes.node,
};

export default PageHeader;
