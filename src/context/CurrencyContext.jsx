import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

export const currencies = [
  { code: "usd", symbol: "$", label: "USD" },
  { code: "eur", symbol: "€", label: "EUR" },
  { code: "inr", symbol: "₹", label: "INR" },
];

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("usd");

  const currentCurrency = currencies.find((c) => c.code === currency);

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, currentCurrency, currencies }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
