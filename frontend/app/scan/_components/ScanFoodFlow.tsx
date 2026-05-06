"use client";

import { useState } from "react";
import ConfirmFoodModal from "@/app/scan/_components/ConfirmFoodModal";
import ScanCameraModal from "@/app/scan/_components/ScanCameraModal";

type ScanStep = "scan" | "confirm" | "closed";

export default function ScanFoodFlow() {
  const [step, setStep] = useState<ScanStep>("scan");

  if (step === "closed") return null;

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
        onAddMeal={() => setStep("closed")}
      />
    );
  }
}
