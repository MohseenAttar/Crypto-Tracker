import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sun, Moon, TrendingUp, Menu, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useCurrency } from "../../context/CurrencyContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, currencies } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Market", end: true },
    { to: "/watchlist", label: "Watchlist", end: false },
    { to: "/portfolio", label: "Portfolio", end: false },
  ];

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* ── Logo ─────────────────────────────────────────────── */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-semibold text-zinc-900 dark:text-white"
        >
          <TrendingUp className="h-5 w-5 text-brand-500 dark:text-brand-400" />
          <span className="text-sm tracking-tight">CryptoTrack</span>
        </Link>

        {/* ── Desktop nav links — hidden on mobile ─────────────── */}
        <nav className="hidden items-center gap-0.5 sm:flex">
          {navLinks.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Right controls ───────────────────────────────────── */}
        <div className="flex items-center gap-1.5">
          {/* Currency toggle
              Mobile  → shows symbol only (₹ $ €) to save space
              Desktop → shows full label (INR USD EUR) */}
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
            {currencies.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                aria-label={`Switch to ${c.label}`}
                className={`rounded-md py-1 text-xs font-medium transition-all
                  px-1.5 sm:px-2.5 ${
                    currency === c.code
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
              >
                {/* Symbol on mobile, label on sm+ */}
                <span className="sm:hidden">{c.symbol}</span>
                <span className="hidden sm:inline">{c.label}</span>
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Hamburger — mobile only (hidden on sm+) */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100 sm:hidden"
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ──────────────────────────────────────── */}
      {menuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 sm:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
