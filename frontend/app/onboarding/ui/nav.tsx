import { ButtonArrowIcon } from "@/components/button-arrow-icon";

type OnboardingNavProps = {
  currentStep: number;
  stepCount: number;
  onBack: () => void;
  onNext: () => void;
};

export function OnboardingNav({
  currentStep,
  stepCount,
  onBack,
  onNext,
}: OnboardingNavProps) {
  const isFirstStep = currentStep === 0;
  const isFinalStep = currentStep === stepCount - 1;

  return (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-5 pt-8">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className="inline-flex min-h-14 items-center gap-2 rounded-full border border-[#6b8d61] bg-transparent px-7 text-[1.05rem] font-medium text-[#3b6b3c] transition disabled:pointer-events-none disabled:opacity-40"
      >
        <ButtonArrowIcon
          direction="left"
          className="h-7 w-7 shrink-0 text-[#3b6b3c]"
        />
        <span>Go Back</span>
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`inline-flex min-h-14 items-center gap-2 rounded-full px-7 text-[1.05rem] font-medium text-[#fdf4df] transition-transform hover:-translate-y-0.5 ${
          isFinalStep ? "bg-[#ef7a3f]" : "bg-[#3b6b3c]"
        }`}
      >
        <span>{isFinalStep ? "Finish" : "Next"}</span>
        <ButtonArrowIcon className="h-7 w-7 shrink-0 text-current" />
      </button>
    </div>
  );
}
