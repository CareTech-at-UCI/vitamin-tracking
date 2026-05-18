"use client";

import { useEffect, useState } from "react";
import ConfirmFoodModal from "@/app/scan/_components/ConfirmFoodModal";
import LogCompletedModal from "@/app/scan/_components/LogCompletedModal";
import ScanCameraModal from "@/app/scan/_components/ScanCameraModal";
import ProceedStep from "@/app/scan/_components/ProceedStep";
import { type DrawerSnap } from "@/app/scan/_components/Drawer";
import { useScanChrome } from "@/app/scan/_components/ScanChromeContext";

type ScanStep = "proceed" | "scan" | "confirm" | "log-completed" | "closed";

export default function ScanFoodFlow() {
  const { scanStartSignal } = useScanChrome();
  return <ScanFoodFlowSession key={scanStartSignal} />;
}

function ScanFoodFlowSession() {
  const [step, setStep] = useState<ScanStep>("proceed");
  const [proceedSnap, setProceedSnap] = useState<DrawerSnap>("expanded");
  const [loggedFoodNames, setLoggedFoodNames] = useState<string[]>([]);
  const { setNavOverlay } = useScanChrome();

  useEffect(() => {
    if (step === "proceed") {
      setNavOverlay(proceedSnap === "dismissed" ? "none" : "blur");
      return;
    }
    setNavOverlay("none");
  }, [step, proceedSnap, setNavOverlay]);

  function handleConfirmScanning() {
    setProceedSnap("expanded");
    setStep("scan");
  }

  if (step === "closed") return null;

  if (step === "proceed" || step === "scan") {
    return (
      <>
        <ScanCameraModal
          paused={step === "proceed" && proceedSnap === "expanded"}
          onClose={() => setStep("closed")}
          onScan={() => setStep("confirm")}
        />
        {step === "proceed" && (
          <ProceedStep
            snap={proceedSnap}
            onSnapChange={setProceedSnap}
            onConfirm={handleConfirmScanning}
          />
        )}
      </>
    );
  }

  if (step === "confirm") {
    return (
      <ConfirmFoodModal
        onClose={() => setStep("closed")}
        onAddMeal={(foodNames) => {
          setLoggedFoodNames(foodNames);
          setStep("log-completed");
        }}
      />
    );
  }

  if (step === "log-completed") {
    return (
      <LogCompletedModal
        foodNames={loggedFoodNames}
        onClose={() => setStep("closed")}
        onContinueScanning={() => setStep("scan")}
      />
    );
  }
}
