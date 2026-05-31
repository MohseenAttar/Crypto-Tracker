import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { ThemeProvider }     from "./context/ThemeContext";
import { CurrencyProvider }  from "./context/CurrencyContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <CurrencyProvider>
            <WatchlistProvider>
              <PortfolioProvider>
                <App />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: "#18181b",
                      color: "#f4f4f5",
                      border: "1px solid #27272a",
                      fontSize: "13px",
                    },
                  }}
                />
              </PortfolioProvider>
            </WatchlistProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
