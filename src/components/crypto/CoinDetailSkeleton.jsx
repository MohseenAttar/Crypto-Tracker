import LoadingSkeleton from "../ui/LoadingSkeleton";

/**
 * Full-page skeleton shown while the coin detail API call is in flight.
 * Mirrors the layout of the actual CoinDetail page.
 */
const CoinDetailSkeleton = () => (
  <div className="flex flex-col gap-6">
    {/* Header skeleton */}
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800/60 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LoadingSkeleton className="h-14 w-14 rounded-full" />
          <div className="flex flex-col gap-2">
            <LoadingSkeleton className="h-6 w-36 rounded-lg" />
            <LoadingSkeleton className="h-4 w-20 rounded-md" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <LoadingSkeleton className="h-8 w-32 rounded-lg" />
          <LoadingSkeleton className="h-5 w-20 rounded-md" />
        </div>
      </div>
    </div>

    {/* Chart skeleton */}
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800/60 dark:bg-zinc-900/60">
      <div className="mb-5 flex items-center justify-between">
        <LoadingSkeleton className="h-4 w-28 rounded" />
        <LoadingSkeleton className="h-8 w-44 rounded-lg" />
      </div>
      <LoadingSkeleton className="h-64 w-full rounded-xl" />
    </div>

    {/* Stats grid skeleton */}
    <div>
      <LoadingSkeleton className="mb-3 h-4 w-32 rounded" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {[...Array(12)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>

    {/* About + links skeleton */}
    <LoadingSkeleton className="h-40 rounded-2xl" />
    <LoadingSkeleton className="h-20 rounded-2xl" />
  </div>
);

export default CoinDetailSkeleton;
