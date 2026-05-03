"use client";

import { OnboardingProgress } from "@/app/onboarding/ui/progress";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type OnboardingShellProps = {
  children: ReactNode;
  currentStep: number;
  stepCount: number;
};

export function OnboardingShell({
  children,
  currentStep,
  stepCount,
}: OnboardingShellProps) {
  const mainRef = useRef<HTMLElement>(null);
  const [showScrollShadow, setShowScrollShadow] = useState(false);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    function handleScroll() {
      if (!el) return;
      const scrolledToBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      setShowScrollShadow(!scrolledToBottom);
    }

    handleScroll();
    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      <main ref={mainRef} className="h-screen snap-y snap-proximity overflow-y-auto bg-[#FDFAE7] text-[#3b6b3c] md:min-h-screen md:h-auto md:snap-none md:overflow-visible">
        <div className="mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-4 py-6 md:px-12 md:py-8 lg:px-16">
          <OnboardingProgress currentStep={currentStep} stepCount={stepCount} />
          <div className="flex flex-1 flex-col pt-8 pb-0 md:pt-10 lg:pt-12">{children}</div>
        </div>
      </main>
      {showScrollShadow ? (
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-24 md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      ) : null}
    </>
  );
}
