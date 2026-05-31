import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * Renders the coin description from CoinGecko.
 * Description comes as HTML — we use dangerouslySetInnerHTML safely
 * since the source is CoinGecko's own API, not user input.
 * Shows first 300 chars collapsed, expands on click.
 */
const AboutSection = ({ coin }) => {
  const [expanded, setExpanded] = useState(false);

  const rawHtml = coin.description?.en;
  if (!rawHtml) return null;

  // Strip HTML tags to measure plain text length
  const plainText = rawHtml.replace(/<[^>]+>/g, "");
  const isLong = plainText.length > 300;

  // For collapsed state: truncate the plain text and show it
  const displayHtml =
    expanded || !isLong ? rawHtml : `${plainText.slice(0, 300)}…`;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800/60 dark:bg-zinc-900/60">
      <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        About {coin.name}
      </h2>

      <div
        className="prose prose-sm max-w-none text-zinc-600 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline dark:text-zinc-400 dark:prose-a:text-brand-400"
        dangerouslySetInnerHTML={{ __html: displayHtml }}
      />

      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" /> Show more
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AboutSection;
