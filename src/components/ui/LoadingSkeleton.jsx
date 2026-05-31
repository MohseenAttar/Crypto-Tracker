/**
 * Shimmering skeleton block.
 * Uses the .shimmer utility class defined in index.css (Tailwind @layer utilities)
 * because CSS gradients with animation can't be expressed as Tailwind classes alone.
 * Pass className to control size/shape e.g. "h-4 w-32 rounded"
 */
const LoadingSkeleton = ({ className = "" }) => (
  <div className={`shimmer rounded ${className}`} />
);

export default LoadingSkeleton;
