"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type NavOverlayMode = "none" | "blur";

type ScanChromeContextValue = {
  navOverlay: NavOverlayMode;
  setNavOverlay: (overlay: NavOverlayMode) => void;
  scanStartSignal: number;
  startScanSession: () => void;
};

const ScanChromeContext = createContext<ScanChromeContextValue | null>(null);

export function ScanChromeProvider({ children }: { children: React.ReactNode }) {
  const [navOverlay, setNavOverlay] = useState<NavOverlayMode>("none");
  const [scanStartSignal, setScanStartSignal] = useState(0);

  const startScanSession = useCallback(() => {
    setScanStartSignal((count) => count + 1);
  }, []);

  const value = useMemo(
    () => ({
      navOverlay,
      setNavOverlay,
      scanStartSignal,
      startScanSession,
    }),
    [navOverlay, scanStartSignal, startScanSession],
  );

  return (
    <ScanChromeContext.Provider value={value}>
      {children}
    </ScanChromeContext.Provider>
  );
}

export function useScanChrome() {
  const context = useContext(ScanChromeContext);
  if (!context) {
    return {
      navOverlay: "none" as NavOverlayMode,
      setNavOverlay: () => {},
      scanStartSignal: 0,
      startScanSession: () => {},
    };
  }
  return context;
}
