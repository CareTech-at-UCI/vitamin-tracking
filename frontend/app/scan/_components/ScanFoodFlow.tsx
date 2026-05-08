"use client";

import { useEffect, useState } from "react";
import ConfirmFoodModal from "@/app/scan/_components/ConfirmFoodModal";
import LogCompletedModal from "@/app/scan/_components/LogCompletedModal";
import MobileProceedDrawer from "@/app/scan/_components/MobileProceedDrawer";
import ScanCameraModal from "@/app/scan/_components/ScanCameraModal";

type ScanStep = "proceed" | "scan" | "confirm" | "log-completed" | "closed";

export default function ScanFoodFlow() {
  const [step, setStep] = useState<ScanStep>("closed");
  const [loggedFoodNames, setLoggedFoodNames] = useState<string[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setStep(isMobile ? "proceed" : "scan");
  }, []);

  if (step === "closed") return null;

  if (step === "proceed") {
    return (
      <>
        <ScanCameraModal onClose={() => setStep("closed")} onScan={() => {}} />

        <MobileProceedDrawer
          onHome={() => setStep("closed")}
          onConfirm={() => setStep("scan")}
        />
      </>
    );
  }

  if (step === "scan") {
    return (
      <ScanCameraModal
        onClose={() => setStep("closed")}
        onScan={() => setStep("confirm")}
      />
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

  return null;
}