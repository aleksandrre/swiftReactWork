import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState([]);
  const [cache, setCache] = useState({});

  const updateGlobalState = (newState) => {
    if (!globalState.includes(newState)) {
      setGlobalState((prev) => [...prev, newState]);
    }
  };

  return (
    <AppContext.Provider
      value={{ globalState, updateGlobalState, cache, setCache }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
