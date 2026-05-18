"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export type NavOverlayMode = "none" | "blur";

export const SCAN_CAPTURE_COLOR = "#F16F33";

type ScanChromeContextValue = {
  navOverlay: NavOverlayMode;
  setNavOverlay: (overlay: NavOverlayMode) => void;
  scanStartSignal: number;
  startScanSession: () => void;
  cameraCaptureMode: boolean;
  setCameraCaptureMode: (enabled: boolean) => void;
  registerOpenConfirmStep: (handler: (() => void) | null) => void;
  openConfirmStep: () => void;
};

const ScanChromeContext = createContext<ScanChromeContextValue | null>(null);

export function ScanChromeProvider({ children }: { children: React.ReactNode }) {
  const [navOverlay, setNavOverlay] = useState<NavOverlayMode>("none");
  const [scanStartSignal, setScanStartSignal] = useState(0);
  const [cameraCaptureMode, setCameraCaptureMode] = useState(false);
  const openConfirmRef = useRef<(() => void) | null>(null);

  const startScanSession = useCallback(() => {
    setScanStartSignal((count) => count + 1);
  }, []);

  const registerOpenConfirmStep = useCallback((handler: (() => void) | null) => {
    openConfirmRef.current = handler;
  }, []);

  const openConfirmStep = useCallback(() => {
    openConfirmRef.current?.();
  }, []);

  const value = useMemo(
    () => ({
      navOverlay,
      setNavOverlay,
      scanStartSignal,
      startScanSession,
      cameraCaptureMode,
      setCameraCaptureMode,
      registerOpenConfirmStep,
      openConfirmStep,
    }),
    [
      navOverlay,
      scanStartSignal,
      startScanSession,
      cameraCaptureMode,
      registerOpenConfirmStep,
      openConfirmStep,
    ],
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
      cameraCaptureMode: false,
      setCameraCaptureMode: () => {},
      registerOpenConfirmStep: () => {},
      openConfirmStep: () => {},
    };
  }
  return context;
}
