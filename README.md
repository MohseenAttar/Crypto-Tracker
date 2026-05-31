# 📈 CryptoTrack — Live Cryptocurrency Tracker

A production-grade cryptocurrency tracking application built with **React 18**, **Tailwind CSS v3**, and the **CoinGecko API**. Track live prices across 13,000+ coins, build a personal watchlist, and monitor your portfolio with real-time P&L calculations.

---

## 🚀 Live Demo

> Deploy your own instance — see [Deployment](#deployment) section below.

---

## ✨ Features

### 🏠 Market Page
- Live prices for top coins, updating every **60 seconds**
- Sortable table — rank, price, 1h%, 24h%, 7d%, market cap, sparkline
- **Gainers / Losers** filter across top 250 coins
- Search by coin name or symbol with debounce
- Global market stats — total market cap, 24h volume, BTC dominance, active coins
- Fully responsive with horizontal scroll on mobile

### 🔍 Coin Detail Page
- Interactive price history chart — **1D / 7D / 1M / 3M / 1Y** range selector
- Key statistics — ATH, ATL, circulating supply, fully diluted valuation, 24h high/low
- Quick overview sidebar — rank, volume, percentage changes
- Official links — website, explorer, Reddit, Twitter, GitHub
- Add to portfolio and watchlist directly from the detail page

### ⭐ Watchlist
- Star any coin from the market table or coin detail page
- Live prices update every 60 seconds
- Search and paginate your starred coins
- **Instant remove** — no loading flash, no extra API calls
- Persisted in `localStorage` — survives page refresh and browser close

### 💼 Portfolio
- **Live search** across 13,000+ coins via CoinGecko search API
- Real-time P&L per coin and total portfolio value
- Allocation **donut chart** (Recharts)
- Inline quantity editing — click to edit, Enter to save, Escape to cancel
- Remove with confirmation modal
- Persisted via `useReducer` + `localStorage`

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 |
| Styling | Tailwind CSS v3 |
| Build Tool | Vite |
| Data Fetching | TanStack React Query v5 |
| Table | TanStack React Table v8 |
| Charts | Recharts |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Date Formatting | date-fns |
| Number Formatting | Numeral.js |
| Icons | Lucide React |
| Type Safety | PropTypes |

---

## 🏗️ Architecture Highlights

- **Hybrid pagination** — server-side for the "All" view (unlimited coins), client-side for Gainers/Losers (top 250 fetched once)
- **Optimistic cache merging** — adding a coin to watchlist/portfolio uses `queryClient.setQueryData()` to merge data without triggering a loading state
- **Derived state pattern** — display lists are always derived from local context (WatchlistContext, PortfolioContext), never from stale API cache. Removals are instant
- **Stable query keys** — React Query cache is never invalidated on add/remove, only on explicit refresh
- **React.memo with custom comparator** — `CoinRow` only re-renders when its price-relevant data changes, not on every parent render
- **Error Boundary** — catches runtime errors and shows a fallback UI instead of crashing the whole app
- **Vite proxy** — all API requests route through the Vite dev server, attaching the API key server-side and avoiding CORS issues

---

## 📁 Folder Structure

```
src/
├── api/
│   └── coinGeckoApi.js         # All Axios API calls in one place
├── components/
│   ├── crypto/                 # Domain-specific components
│   │   ├── CoinTable.jsx
│   │   ├── CoinRow.jsx
│   │   ├── PriceHistoryChart.jsx
│   │   ├── PortfolioTable.jsx
│   │   ├── AllocationChart.jsx
│   │   └── ...
│   ├── layout/                 # Navbar, Footer, PageHeader
│   └── ui/                     # Reusable UI — Modal, SearchBar, PriceChange, etc.
├── context/
│   ├── ThemeContext.jsx         # Dark / light mode
│   ├── CurrencyContext.jsx      # USD / EUR / INR toggle
│   ├── WatchlistContext.jsx     # Starred coins (localStorage)
│   └── PortfolioContext.jsx     # Portfolio state (useReducer + localStorage)
├── hooks/
│   ├── useCoinMarkets.js        # Live market table data
│   ├── useTopCoins.js           # Top 250 for Gainers/Losers filter
│   ├── useCoinSearch.js         # Live coin search for portfolio modal
│   ├── useWatchlistCoins.js     # Watchlist prices by coin IDs
│   ├── usePortfolioCoins.js     # Portfolio prices by coin IDs
│   ├── usePortfolioStats.js     # Pure P&L computation hook
│   └── useDebounce.js
├── pages/
│   ├── Home.jsx
│   ├── CoinDetail.jsx
│   ├── Watchlist.jsx
│   └── Portfolio.jsx
└── utils/
    └── formatCurrency.js        # formatPrice, formatMarketCap, formatPct
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A free **CoinGecko API key** — sign up at [developers.coingecko.com](https://developers.coingecko.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/crypto-tracker.git
cd crypto-tracker

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

Open `.env` and add your CoinGecko API key:

```env
VITE_COINGECKO_BASE=https://api.coingecko.com/api/v3
VITE_COINGECKO_KEY=CG-your-api-key-here
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Vercel auto-detects Vite — no build config needed
4. Add environment variables in **Project Settings → Environment Variables**:

```
VITE_COINGECKO_BASE = https://api.coingecko.com/api/v3
VITE_COINGECKO_KEY  = CG-your-api-key-here
```

5. Click **Deploy** ✓

> **Note:** The Vite proxy (`vite.config.js`) only works in development. In production (Vercel), requests go directly from the browser to CoinGecko with the API key attached via the request header. Make sure your CoinGecko key is set in Vercel environment variables.

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_COINGECKO_BASE` | CoinGecko API base URL | ✅ Yes |
| `VITE_COINGECKO_KEY` | Your CoinGecko Demo API key | ✅ Yes |

Get your free API key at [developers.coingecko.com](https://developers.coingecko.com) — the Demo tier gives 10,000 calls/month, more than enough for personal use.

---

## 👨‍💻 Developed By

**Mohseen Attar**
