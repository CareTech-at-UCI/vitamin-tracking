"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ModalShell from "@/components/ModalShell";
import Drawer, {
  type DrawerSnap,
  toggleDrawerCollapse,
} from "@/app/scan/_components/Drawer";

const PLACEHOLDER_FOOD_IMAGE = "/sample.png";

type LogCompletedProps = {
  foodNames: string[];
  imageSrc?: string;
  onClose: () => void;
  onContinueScanning: () => void;
};

function CheckmarkIcon({ size = "md" }: { size?: "sm" | "md" }) {
  if (size === "sm") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 27 23"
        fill="none"
        className="h-[23px] w-[27px]"
        aria-hidden
      >
        <path
          d="M1 14.8102L8.20216 20.8535"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8.59082 21.3002L25.6247 0.999993"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[70px]"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function formatFoodLabel(foodNames: string[]) {
  if (foodNames.length === 0) return "Food Name";
  if (foodNames.length === 1) return foodNames[0];
  if (foodNames.length === 2) return `${foodNames[0]} and ${foodNames[1]}`;
  return `${foodNames.slice(0, -1).join(", ")}, and ${foodNames.at(-1)}`;
}

function LogCompletedContent({
  foodNames,
  imageSrc = PLACEHOLDER_FOOD_IMAGE,
  layout,
  showHandle,
  onToggleDrawer,
  onGoHome,
  onContinueScanning,
}: {
  foodNames: string[];
  imageSrc?: string;
  layout: "mobile" | "desktop";
  showHandle: boolean;
  onToggleDrawer: () => void;
  onGoHome: () => void;
  onContinueScanning: () => void;
}) {
  const foodLabel = formatFoodLabel(foodNames);

  if (layout === "mobile") {
    return (
      <div className="flex flex-col items-center gap-4 px-4 pb-6 pt-4">
        {showHandle && (
          <button
            type="button"
            aria-label="Collapse drawer"
            onClick={onToggleDrawer}
            className="h-1.5 w-12 rounded-full bg-gray-300"
          />
        )}

        <div className="flex size-[8vh] items-center justify-center rounded-full bg-[#6FAF6B]">
          <CheckmarkIcon size="sm" />
        </div>

        <h2 className="text-center font-display text-[1.5rem] font-semibold leading-none tracking-[-1.92px] text-[#0A3323]">
          Log Completed
        </h2>

        <Image
          src={imageSrc}
          alt={foodLabel}
          width={96}
          height={96}
          className="size-[12vh] rounded-lg object-cover"
        />

        <p className="w-[80vw] text-center font-body text-[1rem] font-medium tracking-[-0.8px] text-[#09090B]">
          Your {foodLabel} has been successfully added to your daily log.
        </p>

        <div className="flex w-full justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onGoHome}
            className="flex h-12 w-32 items-center justify-center rounded-[20px] bg-[#26612F] font-body text-[0.9rem] font-medium tracking-[-0.8px] text-[#FDFAE7]"
          >
            Go to Home
          </button>
          <button
            type="button"
            onClick={onContinueScanning}
            className="flex h-12 w-32 items-center justify-center rounded-[20px] bg-[#F16F33] font-body text-[0.9rem] font-medium tracking-[-0.8px] text-[#FDFAE7]"
          >
            Continue Scanning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex aspect-[1076/679]">
      <div className="flex w-[53%] shrink-0 items-center justify-center p-10">
        <Image
          src={imageSrc}
          alt={foodLabel}
          width={280}
          height={280}
          className="max-h-full w-auto rounded-2xl object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col items-center px-10 pb-[92px] pt-[102px] text-center">
        <div className="flex flex-col items-center gap-[59px]">
          <div className="flex size-[98px] shrink-0 items-center justify-center rounded-full bg-[#6FAF6B]">
            <CheckmarkIcon />
          </div>

          <h2 className="font-display text-[40px] font-semibold leading-none tracking-[-0.08em] text-scan-green-dark">
            Log completed
          </h2>

          <p className="max-w-[360px] font-body text-xl font-medium leading-snug tracking-[-0.05em] text-[#09090B]">
            Your {foodLabel} has been successfully added to your daily log.
          </p>
        </div>

        <div className="mt-[118px] flex w-[92%] items-center gap-6">
          <Link
            href="/dashboard"
            className="flex h-[62px] flex-[145] items-center justify-center rounded-[20px] bg-scan-green font-body text-xl font-medium leading-none tracking-[-0.05em] text-[#FDFAE7] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-scan-green/35"
          >
            Go to Home
          </Link>
          <button
            type="button"
            onClick={onContinueScanning}
            className="h-[62px] flex-[199] rounded-[20px] bg-scan-orange font-body text-xl font-medium leading-none tracking-[-0.05em] text-[#FDFAE7] transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-scan-orange/35"
          >
            Continue Scanning
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LogCompleted({
  foodNames,
  imageSrc = PLACEHOLDER_FOOD_IMAGE,
  onClose,
  onContinueScanning,
}: LogCompletedProps) {
  const router = useRouter();
  const [snap, setSnap] = useState<DrawerSnap>("expanded");

  function handleToggleDrawer() {
    toggleDrawerCollapse(snap, setSnap);
  }

  function handleSnapChange(next: DrawerSnap) {
    setSnap(next);
    if (next === "dismissed") {
      onClose();
    }
  }

  function handleGoHome() {
    router.push("/dashboard");
  }

  return (
    <>
      <div className="md:hidden">
        <Drawer
          snap={snap}
          onSnapChange={handleSnapChange}
          showDragHandle={false}
          fillHeight={false}
          heightClassName="h-auto"
          collapsedClassName="translate-y-[95%]"
          panelClassName="rounded-t-[40px]"
          overlayClassName="z-[55]"
        >
          <LogCompletedContent
            foodNames={foodNames}
            imageSrc={imageSrc}
            layout="mobile"
            showHandle
            onToggleDrawer={handleToggleDrawer}
            onGoHome={handleGoHome}
            onContinueScanning={onContinueScanning}
          />
        </Drawer>
      </div>

      <div className="hidden md:block">
        <ModalShell
          ariaLabel="Log completed"
          onClose={onClose}
          className="z-100"
          panelClassName="max-w-[1076px] overflow-hidden rounded-2xl bg-[#FDFAE7] text-scan-green-dark"
          closeButtonClassName="text-scan-green-dark"
        >
          <LogCompletedContent
            foodNames={foodNames}
            imageSrc={imageSrc}
            layout="desktop"
            showHandle={false}
            onToggleDrawer={handleToggleDrawer}
            onGoHome={handleGoHome}
            onContinueScanning={onContinueScanning}
          />
        </ModalShell>
      </div>
    </>
  );
}
