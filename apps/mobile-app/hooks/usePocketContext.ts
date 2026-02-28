import React from "react";
import { PocketContext, PocketContextType } from "@/contexts/PocketContext";

const usePocketContext = (): PocketContextType => {
  const context = React.use(PocketContext);
  if (!context) {
    throw new Error("usePocketContext must be used within PocketProvider");
  }
  return context;
};

export default usePocketContext;
