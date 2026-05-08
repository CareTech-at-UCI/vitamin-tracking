"use client";

import Image from "next/image";
import ModalShell from "@/components/ModalShell";

type ScanCameraModalProps = {
  onClose: () => void;
  onScan: () => void;
};

export default function ScanCameraModal({ onClose, onScan }: ScanCameraModalProps) {
  return (
    <ModalShell
      ariaLabel="Scan food camera"
      onClose={onClose}
      panelClassName="max-w-[920px] rounded-[20px] bg-black text-white"
      closeButtonClassName="text-white hover:bg-white/10"
    >
      <div className="flex aspect-[1.58/1] min-h-[430px] flex-col px-8 py-8 sm:px-9 sm:py-9">
        <h2 className="text-3xl font-semibold leading-none text-white md:text-[34px] [font-family:var(--font-montserrat-alternates)]">
          Scan Food
        </h2>

        <div className="flex flex-1 items-center justify-center py-8">
          <div
            className="grid aspect-square w-[min(28vw,220px)] min-w-32 grid-cols-2 grid-rows-2 gap-[42%]"
            aria-hidden="true"
          >
            <span className="rounded-tl-2xl border-l-[3px] border-t-[3px] border-[#FFFFFF]" />
            <span className="rounded-tr-2xl border-r-[3px] border-t-[3px] border-[#FFFFFF]" />
            <span className="rounded-bl-2xl border-b-[3px] border-l-[3px] border-[#FFFFFF]" />
            <span className="rounded-br-2xl border-b-[3px] border-r-[3px] border-[#FFFFFF]" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-7">
          <button
            type="button"
            aria-label="Upload food photo"
            className="flex size-[50px] items-center justify-center rounded-full transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-white/20"
          >
            <Image
              src="/assets/scan/upload.svg"
              alt=""
              width={50}
              height={50}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={onScan}
            aria-label="Scan food"
            className="flex size-[80px] items-center justify-center rounded-full shadow-[0_10px_28px_rgb(38_97_47_/_0.38)] transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-primary/35"
          >
            <Image
              src="/assets/scan/cam.svg"
              alt=""
              width={80}
              height={80}
              aria-hidden="true"
              priority
            />
          </button>

          <button
            type="button"
            aria-label="Toggle flash"
            className="flex size-[50px] items-center justify-center rounded-full transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-white/20"
          >
            <Image
              src="/assets/scan/flash.svg"
              alt=""
              width={50}
              height={50}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
