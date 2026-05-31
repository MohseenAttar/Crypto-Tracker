import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import Home from "./pages/Home";
import CoinDetail from "./pages/CoinDetail";
import Watchlist from "./pages/Watchlist";
import Portfolio from "./pages/Portfolio";

const App = () => (
  <div className="flex min-h-screen flex-col bg-slate-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
    <Navbar />

    {/*
     * ErrorBoundary wraps all routes — if any page component throws
     * an unhandled error, the app shows ErrorFallback instead of
     * going completely blank. Critical for production resilience.
     */}
    <div className="flex-1">
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin/:id" element={<CoinDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </ErrorBoundary>
    </div>

    <Footer />
  </div>
);

export default App;
