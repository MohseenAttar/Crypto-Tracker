import {
  Globe,
  Github,
  MessageCircle,
  Twitter,
  ExternalLink,
} from "lucide-react";

/**
 * Renders official coin links fetched from CoinGecko:
 * homepage, blockchain explorers, subreddit, Twitter handle, GitHub.
 */
const LinkButton = ({ href, icon: Icon, label }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-white hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
      <ExternalLink className="h-3 w-3 shrink-0 opacity-40" />
    </a>
  );
};

const CoinLinks = ({ coin }) => {
  const links = coin.links;
  if (!links) return null;

  const homepage = links.homepage?.find(Boolean);
  const explorer = links.blockchain_site?.find(Boolean);
  const subreddit = links.subreddit_url;
  const twitterHandle = links.twitter_screen_name;
  const githubRepo = links.repos_url?.github?.find(Boolean);

  const hasAny =
    homepage || explorer || subreddit || twitterHandle || githubRepo;
  if (!hasAny) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800/60 dark:bg-zinc-900/60">
      <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Official Links
      </h2>
      <div className="flex flex-wrap gap-2">
        <LinkButton href={homepage} icon={Globe} label="Website" />
        <LinkButton href={explorer} icon={ExternalLink} label="Explorer" />
        <LinkButton href={subreddit} icon={MessageCircle} label="Reddit" />
        <LinkButton
          href={twitterHandle ? `https://twitter.com/${twitterHandle}` : null}
          icon={Twitter}
          label={twitterHandle ? `@${twitterHandle}` : null}
        />
        <LinkButton href={githubRepo} icon={Github} label="GitHub" />
      </div>
    </div>
  );
};

export default CoinLinks;
