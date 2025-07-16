import { useContext } from "react";
import { PocketContext, PocketContextType } from "../contexts/PocketContext";

// Hook per usare il context
export const usePocketContext = (): PocketContextType => {
  const context = useContext(PocketContext);
  if (!context) {
    throw new Error("usePocketContext must be used within PocketProvider");
  }
  return context;
};
