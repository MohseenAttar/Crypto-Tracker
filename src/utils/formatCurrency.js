import numeral from "numeral";

const SYMBOLS = { usd: "$", eur: "€", inr: "₹" };

export const formatPrice = (n, currency = "usd") => {
  const sym = SYMBOLS[currency] ?? "$";
  if (n == null) return "—";
  if (n >= 1e9) return sym + numeral(n).format("0.00a").toUpperCase();
  if (n >= 1e6) return sym + numeral(n).format("0.00a").toUpperCase();
  if (n >= 1000) return sym + numeral(n).format("0,0.00");
  if (n >= 1) return sym + numeral(n).format("0,0.00");
  return sym + numeral(n).format("0.00000000");
};

export const formatMarketCap = (n, currency = "usd") => {
  const sym = SYMBOLS[currency] ?? "$";
  if (n == null) return "—";
  return sym + numeral(n).format("0.00a").toUpperCase();
};

export const formatPct = (n) => {
  if (n == null) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
};

export const formatSupply = (n) => {
  if (n == null) return "—";
  return numeral(n).format("0.00a").toUpperCase();
};
