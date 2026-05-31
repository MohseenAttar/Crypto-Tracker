import { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() =>
    JSON.parse(localStorage.getItem("ct-watchlist") || "[]"),
  );

  useEffect(() => {
    localStorage.setItem("ct-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const toggle = (id) =>
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const isWatched = (id) => watchlist.includes(id);

  return (
    <WatchlistContext.Provider value={{ watchlist, toggle, isWatched }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
