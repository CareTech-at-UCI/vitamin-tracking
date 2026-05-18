"use client";

import { useState } from "react";
import ConfirmFoodModal from "@/app/scan/_components/ConfirmFoodModal";
import LogCompletedModal from "@/app/scan/_components/LogCompletedModal";
import ScanCameraModal from "@/app/scan/_components/ScanCameraModal";
import ProceedStep from "@/app/scan/_components/ProceedStep";

type ScanStep = "proceed" | "scan" | "confirm" | "log-completed" | "closed";

export default function ScanFoodFlow() {
  const [step, setStep] = useState<ScanStep>("proceed");
  const [loggedFoodNames, setLoggedFoodNames] = useState<string[]>([]);

  if (step === "closed") return null;

  if (step === "proceed" || step === "scan") {
    return (
      <>
        <ScanCameraModal
          paused={step === "proceed"}
          onClose={() => setStep("closed")}
          onScan={() => setStep("confirm")}
        />
        {step === "proceed" && (
          <ProceedStep onConfirm={() => setStep("scan")} />
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
