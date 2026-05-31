import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  const navLinks = [
    { to: "/", label: "Market" },
    { to: "/watchlist", label: "Watchlist" },
    { to: "/portfolio", label: "Portfolio" },
  ];

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800/80 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Top section ───────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand + tagline */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100"
            >
              <TrendingUp className="h-5 w-5 text-brand-500 dark:text-brand-400" />
              <span className="text-sm tracking-tight">CryptoTrack</span>
            </Link>
            <p className="max-w-[240px] text-center text-xs leading-relaxed text-zinc-400 dark:text-zinc-600 sm:max-w-xs sm:text-left">
              Live cryptocurrency prices, portfolio tracking, and market
              insights — powered by CoinGecko API.
            </p>
          </div>

          {/* Page links */}
          <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              Pages
            </p>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────────── */}
        <div className="my-6 border-t border-zinc-100 dark:border-zinc-800/60" />

        {/* ── Bottom row ────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            © {year} CryptoTrack · Developed by{" "}
            <span className="font-medium text-brand-500 dark:text-brand-400">
              Mohseen Attar
            </span>
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            Powered by{" "}
            <a
              href="https://www.coingecko.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              CoinGecko API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
