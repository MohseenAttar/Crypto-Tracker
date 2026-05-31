import { createContext, useContext, useReducer, useEffect } from "react";

const PortfolioContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "REMOVE":
      return state.filter((c) => c.id !== action.payload);
    case "UPDATE":
      return state.map((c) =>
        c.id === action.payload.id ? { ...c, ...action.payload } : c,
      );
    default:
      return state;
  }
};

export const PortfolioProvider = ({ children }) => {
  const saved = JSON.parse(localStorage.getItem("ct-portfolio") || "[]");
  const [portfolio, dispatch] = useReducer(reducer, saved);

  useEffect(() => {
    localStorage.setItem("ct-portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  return (
    <PortfolioContext.Provider value={{ portfolio, dispatch }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
