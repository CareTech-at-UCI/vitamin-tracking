import type { CSSProperties } from "react";

type OnboardingStepHeightWeightProps = {
  heightFeet: string;
  heightInches: string;
  weight: string;
  sex: string;
  activityLevel: number;
  heightFeetOptions: string[];
  heightInchOptions: string[];
  sexOptions: string[];
  onHeightFeetChange: (value: string) => void;
  onHeightInchesChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onSexChange: (value: string) => void;
  onActivityLevelChange: (value: number) => void;
  heightFeetError?: string;
  heightInchesError?: string;
  weightError?: string;
  sexError?: string;
};

export function OnboardingStepHeightWeight({
  heightFeet,
  heightInches,
  weight,
  sex,
  activityLevel,
  heightFeetOptions,
  heightInchOptions,
  sexOptions,
  onHeightFeetChange,
  onHeightInchesChange,
  onWeightChange,
  onSexChange,
  onActivityLevelChange,
  heightFeetError,
  heightInchesError,
  weightError,
  sexError,
}: OnboardingStepHeightWeightProps) {
  const activityLevels = [1, 2, 3, 4];
  const sliderProgress = ((activityLevel - 1) / (activityLevels.length - 1)) * 100;

  return (
    <section className="flex max-w-4xl flex-col">
      <div className="space-y-4 md:space-y-5">
        <h1 className="font-display text-[2rem] leading-[1.1] font-semibold text-[#3b6b3c] md:text-[2.65rem] md:leading-tight lg:text-[3rem]">
          Help us personalize your profile.
        </h1>
        <div className="space-y-8 md:space-y-5 lg:space-y-6">
          <div className="space-y-3">
            <p className="text-base leading-7 text-[#4f6f49] md:text-lg md:leading-7">
              What&apos;s your{" "}
              <span className="font-medium text-[#ef7a3f]">height</span>{" "}
              and <span className="font-medium text-[#ef7a3f]">weight</span>?
            </p>
            <div className="flex flex-wrap gap-3">
              <SelectField
                label="Feet"
                value={heightFeet}
                options={heightFeetOptions}
                onChange={onHeightFeetChange}
                error={heightFeetError}
              />
              <SelectField
                label="Inches"
                value={heightInches}
                options={heightInchOptions}
                onChange={onHeightInchesChange}
                error={heightInchesError}
              />
              <NumberField
                label="Weight"
                value={weight}
                onChange={onWeightChange}
                error={weightError}
              />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-base leading-7 text-[#4f6f49] md:text-lg md:leading-7">
              What&apos;s your <span className="font-medium text-[#ef7a3f]">sex</span>?
            </p>
            <div className="flex flex-wrap gap-3">
              <SelectField
                label="Sex"
                value={sex}
                options={sexOptions}
                onChange={onSexChange}
                error={sexError}
              />
            </div>
          </div>
          <div className="space-y-3 md:space-y-4">
            <p className="text-base leading-7 text-[#4f6f49] md:text-lg md:leading-7">
              How{" "}
              <span className="font-medium text-[#ef7a3f]">physically active</span>{" "}
              would you describe yourself as?
            </p>
            <div className="max-w-3xl rounded-[30px] p-2 md:p-3">
              <input
                type="range"
                min={1}
                max={4}
                step={1}
                value={activityLevel}
                onChange={(event) => onActivityLevelChange(Number(event.target.value))}
                className="onboarding-range h-3 w-full cursor-pointer appearance-none rounded-full bg-transparent"
                aria-label="Activity level"
                style={
                  {
                    "--range-progress": `${sliderProgress}%`,
                    "--range-active": "#ef7a3f",
                    "--range-inactive": "#e8dec7",
                  } as CSSProperties
                }
              />
              <div className="mt-3 flex items-center justify-between gap-2 px-1 md:mt-4 md:gap-3">
                {activityLevels.map((value) => {
                  const isHighlighted = value <= activityLevel;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onActivityLevelChange(value)}
                      className="flex items-center justify-center"
                      aria-label={`Set activity level to ${value}`}
                    >
                      <span
                        className={`h-3.5 w-3.5 rounded-full border-2 transition md:h-4 md:w-4 ${
                          isHighlighted
                            ? "border-[#ef7a3f] bg-[#ef7a3f]"
                            : "border-[#d9ceb3] bg-[#f7f1df]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="min-w-[140px] flex-1 sm:flex-initial">
      <label className="relative block">
        <span className="sr-only">{label}</span>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`${label} (lbs)`}
          className={`min-h-12 w-full rounded-[20px] border bg-[#fff6e3] px-4 text-base text-[#3b6b3c] outline-none transition placeholder:text-[#61805c] focus:border-[#ef7a3f] md:min-h-14 md:px-5 md:text-lg ${error ? "border-red-400" : "border-[#efe4c8]"}`}
        />
      </label>
      {error ? <p className="mt-1 px-4 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="min-w-[140px] flex-1 sm:flex-initial">
      <label className="relative block">
        <span className="sr-only">{label}</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`min-h-12 w-full appearance-none rounded-[20px] border bg-[#fff6e3] px-4 pr-11 text-base text-[#3b6b3c] outline-none transition focus:border-[#ef7a3f] md:min-h-14 md:px-5 md:pr-12 md:text-lg ${error ? "border-red-400" : "border-[#efe4c8]"}`}
        >
          <option value="">{label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-4 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-[#5f7d59] md:right-5 md:h-3 md:w-3" />
      </label>
      {error ? <p className="mt-1 px-4 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
