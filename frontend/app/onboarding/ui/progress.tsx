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
    <header className="space-y-7">
      <CarrotMark />
      <div className="space-y-3">
        <p className="text-base font-medium text-[#557b52]">
          Step {currentStep + 1} out of {stepCount}
        </p>
        <div
          className="h-3 w-full overflow-hidden rounded-full bg-[#ece1c6]"
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
