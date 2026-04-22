type OnboardingStepNameAgeProps = {
  name: string;
  age: string;
  ageOptions: string[];
  onNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
};

export function OnboardingStepNameAge({
  name,
  age,
  ageOptions,
  onNameChange,
  onAgeChange,
}: OnboardingStepNameAgeProps) {
  return (
    <section className="flex max-w-5xl flex-col gap-8">
      <div className="space-y-5">
        <h1 className="max-w-4xl text-5xl leading-[0.98] font-semibold tracking-[-0.06em] text-[#3b6b3c] md:text-7xl">
          Welcome to Nutritional Diet App.
        </h1>
        <div className="space-y-4">
          <p className="text-xl leading-8 text-[#4f6f49]">
            Let&apos;s get to know you a little.{" "}
            <span className="font-medium text-[#ef7a3f]">
              What&apos;s your name and age?
            </span>
          </p>
          <div className="flex max-w-3xl flex-col gap-3 sm:flex-row">
            <label className="flex-1">
              <span className="sr-only">First and last name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="First and Last Name"
                className="min-h-14 w-full rounded-[20px] border border-[#efe4c8] bg-[#fff6e3] px-5 text-lg text-[#3b6b3c] outline-none transition placeholder:text-[#61805c] focus:border-[#ef7a3f]"
              />
            </label>
            <label className="relative sm:w-[140px]">
              <span className="sr-only">Age</span>
              <select
                value={age}
                onChange={(event) => onAgeChange(event.target.value)}
                className="min-h-14 w-full appearance-none rounded-[20px] border border-[#efe4c8] bg-[#fff6e3] px-5 pr-12 text-lg text-[#3b6b3c] outline-none transition focus:border-[#ef7a3f]"
              >
                <option value="">Age</option>
                {ageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute top-1/2 right-5 h-3 w-3 -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-[#5f7d59]" />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
