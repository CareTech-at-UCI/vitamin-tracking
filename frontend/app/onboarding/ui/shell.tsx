"use client";

import { OnboardingProgress } from "@/app/onboarding/ui/progress";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

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
  const [showScrollShadow, setShowScrollShadow] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrolledToBottom = windowHeight + scrollTop >= documentHeight - 50;

      setShowScrollShadow(!scrolledToBottom);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FDFAE7] text-[#3b6b3c]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-4 py-6 md:px-12 md:py-8 lg:px-16">
        <OnboardingProgress currentStep={currentStep} stepCount={stepCount} />
        <div className="flex flex-1 flex-col pt-8 pb-20 md:pt-10 md:pb-0 lg:pt-12">{children}</div>
      </div>
      <ScrollToTopButton />
      {showScrollShadow ? (
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-24 md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      ) : null}
    </main>
  );
}
