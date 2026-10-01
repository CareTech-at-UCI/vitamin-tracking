"use client";

import { useEffect, useState } from "react";
import ConfirmFoodModal from "@/app/scan/_components/ConfirmFoodModal";
import LogCompleted from "@/app/scan/_components/LogCompleted";
import { type FoodItem } from "@/app/scan/_components/FoodItemRow";
import ScanCameraModal from "@/app/scan/_components/ScanCameraModal";
import ProceedStep from "@/app/scan/_components/ProceedStep";
import { type DrawerSnap } from "@/app/scan/_components/Drawer";
import { useScanChrome } from "@/app/scan/_components/ScanChromeContext";
import { inferFoodImage, logScannedMeal } from "@/lib/scan/api";

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
  const [detectedFoodItems, setDetectedFoodItems] = useState<FoodItem[]>([]);
  const [scannedImage, setScannedImage] = useState<Blob | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const {
    setNavOverlay,
    setCameraCaptureMode,
  } = useScanChrome();

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

  async function handleScan(image: Blob) {
    setScanning(true);
    setScanError(null);
    try {
      const detectedFoods = await inferFoodImage(image);
      if (detectedFoods.length === 0) {
        throw new Error("No food was detected. Reframe the food and try again.");
      }
      setDetectedFoodItems(
        detectedFoods.map((food, index) => ({
          id: index + 1,
          name: food.name,
          servings: 1,
          foodItemId: food.foodItemId,
        })),
      );
      setScannedImage(image);
      setStep("confirm");
    } catch (error) {
      setScanError(
        error instanceof Error ? error.message : "Food recognition failed. Please try again.",
      );
    } finally {
      setScanning(false);
    }
  }

  if (step === "closed") return null;

  if (step === "proceed" || step === "scan") {
    return (
      <>
        <ScanCameraModal
          paused={step === "proceed" && proceedSnap === "expanded"}
          onClose={() => setStep("closed")}
          onScan={handleScan}
          scanning={scanning}
          scanError={scanError}
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
          initialItems={detectedFoodItems}
          onClose={() => setStep("scan")}
          onAddMeal={async (items) => {
            const itemsToLog = items.filter((item) => item.servings > 0);
            await logScannedMeal(itemsToLog, scannedImage);
            setLoggedFoodItems(itemsToLog);
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
