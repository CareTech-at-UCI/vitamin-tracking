"use client";

import ScanFoodFlow from "@/app/scan/_components/ScanFoodFlow";
import ScanInstructions from "@/app/scan/_components/ScanInstructions";
import { useScanChrome } from "@/app/scan/_components/ScanChromeContext";

export default function ScanLanding() {
  const { startScanSession } = useScanChrome();

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-background px-10 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-7 text-secondary sm:px-8 sm:py-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[980px] flex-col">
        <header className="flex flex-col gap-6 border-b border-primary/10 pb-7 sm:pb-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="shrink-0">
            <p className="mb-2 font-primary text-xs font-semibold uppercase tracking-[0.18em] text-accent sm:text-sm">
              Smart meal logging
            </p>
            <h1 className="font-display text-4xl font-bold leading-none tracking-tight text-primary sm:text-5xl md:text-[56px]">
              Scan Food
            </h1>
          </div>

          <label className="flex min-h-12 w-full items-center gap-3 rounded-full border border-primary/20 bg-white/35 px-5 text-secondary shadow-[0_8px_28px_rgb(15_61_46_/_0.05)] transition focus-within:border-primary/55 focus-within:bg-white/55 focus-within:ring-4 focus-within:ring-primary/10 md:max-w-[390px]">
            <SearchIcon className="size-5 shrink-0" />
            <span className="sr-only">Search foods</span>
            <input
              type="search"
              placeholder="Search foods"
              className="min-w-0 flex-1 bg-transparent font-body text-base outline-none [background-image:none] placeholder:text-secondary/55"
            />
          </label>
        </header>

        <ScanInstructions onStartScan={startScanSession} />
      </div>

      <ScanFoodFlow />
    </main>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="2.6" />
      <path d="m16 16 5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="2.6" />
    </svg>
  );
}
