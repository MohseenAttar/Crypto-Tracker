import PropTypes from "prop-types";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Fallback UI shown by ErrorBoundary when a component crashes.
 * Shows the error message in development, a generic message in production.
 */
const ErrorFallback = ({ error = null, onReset }) => {
  const isDev = import.meta.env.DEV;

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10">
        <AlertTriangle className="h-7 w-7 text-red-500 dark:text-red-400" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Something went wrong
        </h2>
        <p className="mt-1.5 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          An unexpected error occurred. Try refreshing the page.
        </p>

        {/* Show error details in development only */}
        {isDev && error?.message && (
          <pre className="mt-3 max-w-md overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-left font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            {error.message}
          </pre>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Reload page
        </button>
      </div>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.instanceOf(Error),
  onReset: PropTypes.func.isRequired,
};

export default ErrorFallback;
