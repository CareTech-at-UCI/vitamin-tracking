import { CarrotMark } from "@/app/onboarding/ui/art";

type OnboardingProgressProps = {
  currentStep: number;
  stepCount: number;
};

export function OnboardingProgress({
  currentStep,
  stepCount,
}: OnboardingProgressProps) {
  const percent = ((currentStep + 1) / stepCount) * 100;

  return (
    <header className="space-y-5 md:space-y-7">
      <CarrotMark />
      <div className="hidden space-y-2.5 md:block md:space-y-3">
        <p className="text-sm font-medium text-[#557b52] md:text-base">
          Step {currentStep + 1} out of {stepCount}
        </p>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-[#ece1c6] md:h-3"
          aria-label={`Onboarding progress ${Math.round(percent)} percent`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div
            className="h-full rounded-full bg-[#3b6b3c] transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </header>
  );
}
