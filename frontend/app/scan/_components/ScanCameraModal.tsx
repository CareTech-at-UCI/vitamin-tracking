"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ModalShell from "@/components/ModalShell";

type ScanCameraModalProps = {
  onClose: () => void;
  onScan: () => void;
};

export default function ScanCameraModal({
  onClose,
  onScan,
}: ScanCameraModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const scanContent = (
    <div className="flex h-full flex-col px-[72px] pb-[100px] pt-[60px] md:aspect-[1.58/1] md:min-h-[430px] md:px-8 md:py-8 sm:md:px-9 sm:md:py-9">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold leading-none text-white md:text-[34px] [font-family:var(--font-montserrat-alternates)]">
          Scan Food
        </h2>

        {isMobile && (
        <button
          type="button"
          aria-label="Search food"
          className="flex size-[32px] items-center justify-center rounded-full bg-[#F9732E] text-white transition hover:brightness-110"
        >
          <span className="rotate-270 text-[30px] leading-none">⌕</span>
        </button>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center py-8">
        <div
          className="grid aspect-square w-[200px] max-w-full grid-cols-2 grid-rows-2 gap-[42%] md:w-[min(28vw,220px)] md:min-w-32"
          aria-hidden="true"
        >
          <span className="rounded-tl-2xl border-l-[3px] border-t-[3px] border-white" />
          <span className="rounded-tr-2xl border-r-[3px] border-t-[3px] border-white" />
          <span className="rounded-bl-2xl border-b-[3px] border-l-[3px] border-white" />
          <span className="rounded-br-2xl border-b-[3px] border-r-[3px] border-white" />
        </div>
      </div>

      <div className="flex items-end justify-center gap-10">
        <button
          type="button"
          aria-label="Upload food photo"
          className="flex size-[44px] items-center justify-center rounded-full transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-white/20 md:size-[50px]"
        >
          <Image
            src="/assets/scan/upload.svg"
            alt=""
            width={50}
            height={50}
            aria-hidden="true"
          />
        </button>

        <div className="-translate-y-2">
          <button
            type="button"
            onClick={onScan}
            aria-label="Scan food"
            className="flex size-[70px] items-center justify-center rounded-full shadow-[0_10px_28px_rgb(38_97_47_/_0.38)] transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-primary/35 md:size-[80px]"
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
        </div>

        <button
          type="button"
          aria-label="Toggle flash"
          className="flex size-[44px] items-center justify-center rounded-full transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-white/20 md:size-[50px]"
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
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white">
        {scanContent}
      </div>
    );
  }

  return (
    <ModalShell
      ariaLabel="Scan food camera"
      onClose={onClose}
      panelClassName="max-w-[920px] rounded-[20px] bg-black text-white"
      closeButtonClassName="text-white hover:bg-white/10"
    >
      {scanContent}
    </ModalShell>
  );
}