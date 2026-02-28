import React, {
  createContext,
  useCallback,
  useRef,
  useState,
} from "react";

export type PendingDeepLinkAction = "addHit" | null;

type PendingDeepLinkContextType = {
  pendingAction: PendingDeepLinkAction;
  setPendingAction: (action: PendingDeepLinkAction) => void;
  consumePendingAction: () => PendingDeepLinkAction;
};

export const PendingDeepLinkContext =
  createContext<PendingDeepLinkContextType | undefined>(undefined);

export const usePendingDeepLink = () => {
  const context = React.use(PendingDeepLinkContext);
  if (!context) {
    throw new Error(
      "usePendingDeepLink must be used within PendingDeepLinkProvider"
    );
  }
  return context;
};

interface PendingDeepLinkProviderProps {
  children: React.ReactNode;
}

export default function PendingDeepLinkProvider({
  children,
}: PendingDeepLinkProviderProps) {
  const [pendingAction, setPendingAction] =
    useState<PendingDeepLinkAction>(null);
  const pendingRef = useRef<PendingDeepLinkAction>(null);

  const setPending = useCallback((action: PendingDeepLinkAction) => {
    pendingRef.current = action;
    setPendingAction(action);
  }, []);

  const consumePendingAction = useCallback((): PendingDeepLinkAction => {
    const current = pendingRef.current;
    pendingRef.current = null;
    setPendingAction(null);
    return current;
  }, []);

  const contextValue: PendingDeepLinkContextType = {
    pendingAction,
    setPendingAction: setPending,
    consumePendingAction,
  };

  return (
    <PendingDeepLinkContext.Provider value={contextValue}>
      {children}
    </PendingDeepLinkContext.Provider>
  );
}
