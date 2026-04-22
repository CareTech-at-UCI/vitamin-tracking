import type { CSSProperties } from "react";

type OnboardingStepHeightWeightProps = {
  height: string;
  weight: string;
  activityLevel: number;
  heightOptions: string[];
  weightOptions: string[];
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onActivityLevelChange: (value: number) => void;
};

export function OnboardingStepHeightWeight({
  height,
  weight,
  activityLevel,
  heightOptions,
  weightOptions,
  onHeightChange,
  onWeightChange,
  onActivityLevelChange,
}: OnboardingStepHeightWeightProps) {
  const activityLevels = [1, 2, 3, 4, 5];
  const sliderProgress = ((activityLevel - 1) / (activityLevels.length - 1)) * 100;

  return (
    <section className="flex max-w-4xl flex-col gap-12">
      <div className="space-y-4">
        <h1 className="text-4xl leading-tight font-semibold tracking-[-0.04em] text-[#3b6b3c] md:text-5xl">
          Help us personalize your profile.
        </h1>
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xl leading-8 text-[#4f6f49]">
              What&apos;s your{" "}
              <span className="font-medium text-[#ef7a3f]">height and weight</span>?
            </p>
            <div className="flex flex-wrap gap-3">
              <SelectField
                label="Height"
                value={height}
                options={heightOptions}
                onChange={onHeightChange}
              />
              <SelectField
                label="Weight"
                value={weight}
                options={weightOptions}
                onChange={onWeightChange}
              />
            </div>
          </div>
          <div className="space-y-5">
            <p className="text-xl leading-8 text-[#4f6f49]">
              How{" "}
              <span className="font-medium text-[#ef7a3f]">physically active</span>{" "}
              would you describe yourself as?
            </p>
            <div className="max-w-3xl rounded-[30px] bg-white/45 p-5 shadow-[0_10px_30px_rgba(71,98,48,0.05)]">
              <input
                type="range"
                min={1}
                max={5}
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
              <div className="mt-5 flex items-center justify-between gap-3 px-1">
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
                        className={`h-4 w-4 rounded-full border-2 transition ${
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

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative min-w-[180px]">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-14 w-full appearance-none rounded-[20px] border border-[#efe4c8] bg-[#fff6e3] px-5 pr-12 text-lg text-[#3b6b3c] outline-none transition focus:border-[#ef7a3f]"
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute top-1/2 right-5 h-3 w-3 -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-[#5f7d59]" />
    </label>
  );
}
