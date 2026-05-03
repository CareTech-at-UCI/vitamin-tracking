type OnboardingStepNameAgeProps = {
  name: string;
  age: string;
  onNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
};

export function OnboardingStepNameAge({
  name,
  age,
  onNameChange,
  onAgeChange,
}: OnboardingStepNameAgeProps) {
  return (
    <section className="flex max-w-5xl flex-col gap-6 md:gap-8">
      <div className="space-y-4 md:space-y-5">
        <h1 className="max-w-4xl font-display text-[2rem] leading-[1.1] font-semibold text-[#3b6b3c] md:text-5xl md:leading-[0.98] lg:text-7xl">
          Welcome to VitaMind!
        </h1>
        <div className="space-y-4 md:space-y-5">
          <p className="text-base leading-7 text-[#4f6f49] md:text-xl md:leading-8">
            Let&apos;s get to know you a little—{" "}
            <span className="font-medium text-[#ef7a3f]">
              What&apos;s your name and age?
            </span>
          </p>
          <div className="flex max-w-3xl flex-row gap-3">
            <label className="flex-1">
              <span className="sr-only">First and last name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="First and Last Name"
                className="min-h-12 w-full rounded-[20px] border border-[#efe4c8] bg-[#fff6e3] px-4 text-base text-[#3b6b3c] outline-none transition placeholder:text-[#61805c] focus:border-[#ef7a3f] md:min-h-14 md:px-5 md:text-lg"
              />
            </label>
            <label className="w-[110px] shrink-0 sm:w-[140px]">
              <span className="sr-only">Age</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={age}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
                  onAgeChange(digits);
                }}
                placeholder="Age"
                className="min-h-12 w-full rounded-[20px] border border-[#efe4c8] bg-[#fff6e3] px-4 text-base text-[#3b6b3c] outline-none transition placeholder:text-[#61805c] focus:border-[#ef7a3f] md:min-h-14 md:px-5 md:text-lg"
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
