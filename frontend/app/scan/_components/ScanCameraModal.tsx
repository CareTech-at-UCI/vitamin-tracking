"use client";

import Image from "next/image";
import ModalShell from "@/components/ModalShell";

type ScanCameraModalProps = {
  onClose: () => void;
  onScan: () => void;
  paused?: boolean;
  hideMobileCaptureButton?: boolean;
};

function ScanCameraContent({
  onScan,
  paused,
  layout,
  hideCaptureButton,
}: {
  onScan: () => void;
  paused?: boolean;
  layout: "mobile" | "desktop";
  hideCaptureButton?: boolean;
}) {
  const isMobile = layout === "mobile";

  return (
    <div
      className={
        isMobile
          ? "flex min-h-0 flex-1 flex-col px-6 pb-10 pt-12"
          : "flex aspect-[1.58/1] min-h-[430px] flex-col px-8 py-8 sm:px-9 sm:py-9"
      }
    >
      <h2
        className={`font-semibold leading-none text-white [font-family:var(--font-montserrat-alternates)] ${
          isMobile ? "text-2xl" : "text-3xl md:text-[34px]"
        }`}
      >
        Scan Food
      </h2>

      <div
        className={`flex flex-1 items-center justify-center ${
          isMobile ? "py-10" : "py-8"
        }`}
      >
        <div
          className={`grid aspect-square grid-cols-2 grid-rows-2 gap-[42%] ${
            isMobile ? "w-[200px]" : "w-[min(28vw,220px)] min-w-32"
          }`}
          aria-hidden
        >
          <span className="rounded-tl-2xl border-l-[3px] border-t-[3px] border-[#FFFFFF]" />
          <span className="rounded-tr-2xl border-r-[3px] border-t-[3px] border-[#FFFFFF]" />
          <span className="rounded-bl-2xl border-b-[3px] border-l-[3px] border-[#FFFFFF]" />
          <span className="rounded-br-2xl border-b-[3px] border-r-[3px] border-[#FFFFFF]" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-7">
        {/* <button
          type="button"
          aria-label="Upload food photo"
          disabled={paused}
          className="flex size-[50px] items-center justify-center rounded-full transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-white/20 disabled:opacity-50"
        >
          <Image
            src="/assets/scan/upload.svg"
            alt=""
            width={50}
            height={50}
            aria-hidden="true"
          />
        </button> */}

        {!hideCaptureButton && (
          <button
            type="button"
            onClick={onScan}
            disabled={paused}
            aria-label="Scan food"
            className="flex size-[80px] items-center justify-center rounded-full shadow-[0_10px_28px_rgb(38_97_47_/_0.38)] transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-primary/35 disabled:opacity-50"
          >
            <Image
              src="/assets/scan/cam.svg"
              alt=""
              width={40}
              height={80}
              aria-hidden="true"
              priority
            />
          </button>
        )}

        {/* <button
          type="button"
          aria-label="Toggle flash"
          disabled={paused}
          className="flex size-[50px] items-center justify-center rounded-full transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-white/20 disabled:opacity-50"
        >
          <Image
            src="/assets/scan/flash.svg"
            alt=""
            width={50}
            height={50}
            aria-hidden="true"
          />
        </button> */}
      </div>
    </div>
  );
}

export default function ScanCameraModal({
  onClose,
  onScan,
  paused = false,
  hideMobileCaptureButton = false,
}: ScanCameraModalProps) {
  return (
    <>
      {/* Mobile: full-screen camera behind proceed drawer */}
      <div className="fixed inset-0 z-40 flex min-h-svh flex-col bg-black text-white md:hidden">
        <ScanCameraContent
          onScan={onScan}
          paused={paused}
          layout="mobile"
          hideCaptureButton={hideMobileCaptureButton}
        />
      </div>

      {/* Desktop: centered camera modal */}
      <div className="hidden md:block">
        <ModalShell
          ariaLabel="Scan food camera"
          onClose={paused ? undefined : onClose}
          className="z-50"
          panelClassName="max-w-[920px] rounded-[20px] bg-black text-white"
          closeButtonClassName="text-white hover:bg-white/10"
        >
          <ScanCameraContent onScan={onScan} paused={paused} layout="desktop" />
        </ModalShell>
      </div>
    </>
  );
}
