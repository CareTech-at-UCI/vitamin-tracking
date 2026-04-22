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
    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6 md:gap-5 md:pt-8">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className="inline-flex min-h-12 items-center gap-1.5 rounded-full border border-[#6b8d61] bg-transparent px-5 text-base font-medium text-[#3b6b3c] transition disabled:pointer-events-none disabled:opacity-40 md:min-h-14 md:gap-2 md:px-7 md:text-[1.05rem]"
      >
        <ButtonArrowIcon
          direction="left"
          className="h-6 w-6 shrink-0 text-[#3b6b3c] md:h-7 md:w-7"
        />
        <span className="hidden sm:inline">Go Back</span>
        <span className="sm:hidden">Back</span>
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`inline-flex min-h-12 items-center gap-1.5 rounded-full px-5 text-base font-medium text-[#fdf4df] transition-transform hover:-translate-y-0.5 md:min-h-14 md:gap-2 md:px-7 md:text-[1.05rem] ${
          isFinalStep ? "bg-[#ef7a3f]" : "bg-[#3b6b3c]"
        }`}
      >
        <span>{isFinalStep ? "Done" : "Next"}</span>
        <ButtonArrowIcon className="h-6 w-6 shrink-0 text-current md:h-7 md:w-7" />
      </button>
    </div>
  );
}
