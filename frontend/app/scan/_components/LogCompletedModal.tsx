"use client";

import Link from "next/link";
import ModalShell from "@/components/ModalShell";

type LogCompletedModalProps = {
  foodNames: string[];
  onClose: () => void;
  onContinueScanning: () => void;
};

export default function LogCompletedModal({
  foodNames,
  onClose,
  onContinueScanning,
}: LogCompletedModalProps) {
  const foodNamesString = foodNames.join(", ");

  return (
    <ModalShell
      ariaLabel="Log completed"
      onClose={onClose}
      panelClassName="max-w-[1076px] overflow-hidden rounded-2xl bg-scan-cream text-scan-green-dark"
      closeButtonClassName="text-scan-green-dark"
    >
      <div className="flex aspect-[1076/679]">
        <div className="w-[53%] shrink-0" />

        <div className="flex flex-1 flex-col items-center px-10 py-14 text-center">
          <div className="flex flex-1 flex-col items-center gap-8">
            <div
              className="flex shrink-0 items-center justify-center rounded-full"
              style={{ width: 98, height: 98, backgroundColor: "#6FAF6B" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 70, height: 70 }}
                aria-hidden="true"
              >i 
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 className="font-display text-[40px] font-semibold leading-none tracking-[-0.08em] text-scan-green-dark">
              Log completed
            </h2>

            <p className="w-full font-body text-xl font-medium leading-snug tracking-[-0.05em] text-[#09090B]">
              Your <span className="font-semibold">{foodNamesString}</span> has
              been successfully added to your daily log.
            </p>
          </div>

          <div className="flex w-full items-center gap-4">
            <Link
              href="/dashboard"
              className="flex h-[62px] flex-1 items-center justify-center rounded-[20px] bg-scan-green font-body text-xl font-medium leading-none tracking-[-0.05em] text-[#FDFAE7] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-scan-green/35"
            >
              Go to Home
            </Link>
            <button
              type="button"
              onClick={onContinueScanning}
              className="h-[62px] flex-1 rounded-[20px] bg-scan-orange font-body text-xl font-medium leading-none tracking-[-0.05em] text-[#FDFAE7] transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-scan-orange/35"
            >
              Continue Scanning
            </button>
          </div>
        </div>
      </div>
    </ModalShell>

  );
}
