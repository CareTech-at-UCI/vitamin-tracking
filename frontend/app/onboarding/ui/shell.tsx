import { OnboardingProgress } from "@/app/onboarding/ui/progress";
import type { ReactNode } from "react";

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
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fffbed_0%,_#f9f0d7_55%,_#f6ebd2_100%)] text-[#3b6b3c]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-6 py-8 md:px-12 md:py-10 lg:px-16 lg:py-12">
        <OnboardingProgress currentStep={currentStep} stepCount={stepCount} />
        <div className="flex flex-1 flex-col pt-12 md:pt-16">{children}</div>
      </div>
    </main>
  );
}
