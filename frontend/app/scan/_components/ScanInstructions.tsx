"use client";

import Image from "next/image";
import { useState } from "react";
import { scanInstructions } from "@/app/scan/_components/scanInstructions";

type ScanInstructionsProps = {
  onStartScan: () => void;
};

export default function ScanInstructions({ onStartScan }: ScanInstructionsProps) {
  const [activeStep, setActiveStep] = useState(0);
  const instruction = scanInstructions[activeStep];
  const lastStep = scanInstructions.length - 1;

  function showPreviousStep() {
    setActiveStep((step) => (step === 0 ? lastStep : step - 1));
  }

  function showNextStep() {
    setActiveStep((step) => (step === lastStep ? 0 : step + 1));
  }

  return (
    <section className="mx-auto mt-7 w-full max-w-[780px] sm:mt-9" aria-labelledby="scan-instructions-heading">
      <div className="mb-4 flex items-end justify-between gap-4 px-1 sm:mb-5">
        <div>
          <p className="font-primary text-xs font-semibold uppercase tracking-[0.16em] text-primary/55">
            Quick guide
          </p>
          <h2
            id="scan-instructions-heading"
            className="mt-1 font-display text-2xl font-semibold text-accent sm:text-3xl"
          >
            How to scan
          </h2>
        </div>
      </div>

      <div
        className="relative isolate flex min-h-[260px] overflow-hidden rounded-[30px] bg-primary px-14 py-8 text-white shadow-[0_22px_60px_rgb(15_61_46_/_0.18)] sm:min-h-[290px] sm:rounded-[36px] sm:px-20 sm:py-10"
        aria-live="polite"
      >
        <div className="absolute -right-16 -top-20 -z-10 size-56 rounded-full bg-white/[0.055]" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-16 -z-10 size-52 rounded-full bg-accent/[0.09]" aria-hidden="true" />

        <InstructionArrow
          direction="previous"
          onClick={showPreviousStep}
          label="Show previous scanning instruction"
        />

        {instruction.imageSrc ? (
          <div className="grid w-full items-stretch gap-5 text-center sm:grid-cols-[minmax(190px,0.85fr)_minmax(0,1.15fr)] sm:gap-7 sm:text-left">
            <div className="relative min-h-[150px] w-full overflow-hidden rounded-2xl ring-1 ring-white/20 sm:min-h-[190px]">
              <Image
                src={instruction.imageSrc}
                alt={instruction.imageAlt ?? ""}
                fill
                sizes="(max-width: 640px) calc(100vw - 7rem), 270px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col items-center justify-center sm:items-start">
              <StepCounter current={activeStep + 1} total={scanInstructions.length} />
              <h3 className="mt-5 font-display text-xl font-semibold leading-tight sm:text-2xl md:text-[26px]">
                {instruction.title}
              </h3>
              <p className="mt-2.5 max-w-md font-body text-sm leading-relaxed text-white/80 sm:text-base">
                {instruction.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center text-center">
            <StepCounter current={activeStep + 1} total={scanInstructions.length} />
            <div className="mt-5 max-w-xl">
              <h3 className="font-display text-xl font-semibold leading-tight sm:text-2xl md:text-[26px]">
                {instruction.title}
              </h3>
              <p className="mt-2.5 font-body text-sm leading-relaxed text-white/80 sm:text-base">
                {instruction.description}
              </p>
            </div>
          </div>
        )}

        <InstructionArrow
          direction="next"
          onClick={showNextStep}
          label="Show next scanning instruction"
        />
      </div>

      <div className="mt-5 flex flex-col items-center justify-between gap-5 sm:flex-row sm:px-1">
        <div className="flex items-center gap-2" aria-label={`Step ${activeStep + 1} of ${scanInstructions.length}`}>
          {scanInstructions.map((step, index) => (
            <button
              key={step.title}
              type="button"
              onClick={() => setActiveStep(index)}
              aria-label={`Go to step ${index + 1}: ${step.title}`}
              aria-current={index === activeStep ? "step" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeStep ? "w-7 bg-accent" : "w-2.5 bg-primary/20 hover:bg-primary/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onStartScan}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-3 font-primary text-sm font-semibold text-white shadow-[0_10px_24px_rgb(38_97_47_/_0.2)] transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 sm:w-auto"
        >
          <CameraIcon className="size-5" />
          Scan Here
        </button>
      </div>
    </section>
  );
}

function InstructionArrow({
  direction,
  onClick,
  label,
}: {
  direction: "previous" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25 sm:size-11 ${
        direction === "previous" ? "left-3 sm:left-5" : "right-3 sm:right-5"
      }`}
    >
      <ChevronIcon className={`size-5 sm:size-6 ${direction === "previous" ? "rotate-180" : ""}`} />
    </button>
  );
}

function StepCounter({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="rounded-full bg-background px-3.5 py-1.5 font-primary text-sm font-semibold text-accent shadow-sm sm:text-base">
        Step {current} of {total}
      </span>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7.2 7.4 8.7 5.2h6.6l1.5 2.2h2.3c1.1 0 1.9.8 1.9 1.9v7.6c0 1.1-.8 1.9-1.9 1.9H4.9c-1.1 0-1.9-.8-1.9-1.9V9.3c0-1.1.8-1.9 1.9-1.9h2.3Z" fill="currentColor" />
      <circle cx="12" cy="13" r="3.2" fill="var(--primary)" />
      <circle cx="18.1" cy="10.1" r="1" fill="var(--primary)" />
    </svg>
  );
}
