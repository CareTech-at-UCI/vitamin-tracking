"use client";

import { useEffect, useState } from "react";
import ConfirmFoodModal from "@/app/scan/_components/ConfirmFoodModal";
import LogCompleted from "@/app/scan/_components/LogCompleted";
import { type FoodItem } from "@/app/scan/_components/FoodItemRow";
import ScanCameraModal from "@/app/scan/_components/ScanCameraModal";
import ProceedStep from "@/app/scan/_components/ProceedStep";
import { type DrawerSnap } from "@/app/scan/_components/Drawer";
import { useScanChrome } from "@/app/scan/_components/ScanChromeContext";

type ScanStep = "proceed" | "scan" | "confirm" | "log-completed" | "closed";

export default function ScanFoodFlow() {
  const { scanStartSignal } = useScanChrome();

  // Keep the camera flow unmounted until the user starts a scan from the
  // instructions, desktop camera button, or mobile navigation.
  if (scanStartSignal === 0) return null;

  return <ScanFoodFlowSession key={scanStartSignal} />;
}

function ScanFoodFlowSession() {
  const [step, setStep] = useState<ScanStep>("proceed");
  const [proceedSnap, setProceedSnap] = useState<DrawerSnap>("expanded");
  const [loggedFoodItems, setLoggedFoodItems] = useState<FoodItem[]>([]);
  const {
    setNavOverlay,
    setCameraCaptureMode,
    registerOpenConfirmStep,
  } = useScanChrome();

  useEffect(() => {
    registerOpenConfirmStep(() => setStep("confirm"));
    return () => registerOpenConfirmStep(null);
  }, [registerOpenConfirmStep]);

  useEffect(() => {
    setCameraCaptureMode(step === "scan");
  }, [step, setCameraCaptureMode]);

  useEffect(() => {
    if (step === "proceed") {
      setNavOverlay(proceedSnap === "dismissed" ? "none" : "blur");
      return;
    }
    if (step === "confirm" || step === "log-completed") {
      setNavOverlay("blur");
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
          hideMobileCaptureButton={step === "scan"}
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
      <>
        <ScanCameraModal
          paused
          hideMobileCaptureButton
          onClose={() => setStep("closed")}
          onScan={() => {}}
        />
        <ConfirmFoodModal
          onClose={() => setStep("scan")}
          onAddMeal={(items) => {
            setLoggedFoodItems(items);
            setStep("log-completed");
          }}
        />
      </>
    );
  }

  if (step === "log-completed") {
    return (
      <>
        <ScanCameraModal
          paused
          hideMobileCaptureButton
          onClose={() => setStep("closed")}
          onScan={() => {}}
        />
        <LogCompleted
          foodNames={loggedFoodItems.map((item) => item.name)}
          onClose={() => setStep("scan")}
          onContinueScanning={() => setStep("proceed")}
        />
      </>
    );
  }
}
