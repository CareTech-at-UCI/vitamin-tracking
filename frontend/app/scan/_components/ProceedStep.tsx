"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModalShell from "@/components/ModalShell";

type ProceedStepProps = {
  onConfirm: () => void;
};

function ProceedContent({
  showHandle,
  onDashboard,
  onConfirm,
}: {
  showHandle: boolean;
  onDashboard: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div className="rounded-t-[36px] bg-[linear-gradient(90deg,#1A4D20_0%,#0F2414_100%)] px-6 pb-4 pt-6 text-white md:rounded-t-2xl">
        {showHandle && (
          <div className="mx-auto mb-8 h-2 w-24 rounded-full bg-white/80" />
        )}

        <h2 className="text-center text-[20px] font-semibold md:pt-2">
          Are you sure you wish to proceed?
        </h2>
      </div>

      <div className="px-8 pb-8 pt-6 md:px-10 md:pb-10">
        <p className="text-center font-medium text-black">
          We’ve paused the camera to prevent accidental scans. Tap “Confirm
          Scanning” to resume logging.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onDashboard}
            className="rounded-full bg-[#26612F] px-5 py-3 text-white"
          >
            Go to Dashboard
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#F16F33] px-5 py-3 text-white"
          >
            Confirm Scanning
          </button>
        </div>
      </div>
    </>
  );
}

export default function ProceedStep({ onConfirm }: ProceedStepProps) {
  const router = useRouter();

  function handleDashboard() {
    router.push("/dashboard");
  }

  return (
    <>
      {/* Mobile: bottom drawer */}
      <div
        className={"fixed bottom-0 left-0 right-0 z-100 rounded-t-[40px] bg-[#FFFDEE] transition-transform duration-300 md:hidden translate-y-0"}
      >
        <ProceedContent
          showHandle
          onDashboard={handleDashboard}
          onConfirm={onConfirm}
        />
      </div>

      {/* Tablet / desktop: centered modal */}
      <div className="hidden md:block">
        <ModalShell
          ariaLabel="Confirm scanning"
          className={"z-100 transition-opacity duration-300 opacity-100"}
          panelClassName={"max-w-[480px] overflow-hidden rounded-2xl bg-[#FFFDEE] transition-all duration-300 scale-100 opacity-100"}
        >
          <ProceedContent
            showHandle={false}
            onDashboard={handleDashboard}
            onConfirm={onConfirm}
          />
        </ModalShell>
      </div>
    </>
  );
}
