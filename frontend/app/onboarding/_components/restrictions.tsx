type OnboardingStepRestrictionsProps = {
  searchValue: string;
  selectedRestrictions: string[];
  suggestedRestrictions: string[];
  canAddCustomRestriction: boolean;
  onSearchChange: (value: string) => void;
  onAddCustomRestriction: () => void;
  onToggleRestriction: (value: string) => void;
  onClearSearch: () => void;
};

export function OnboardingStepRestrictions({
  searchValue,
  selectedRestrictions,
  suggestedRestrictions,
  canAddCustomRestriction,
  onSearchChange,
  onAddCustomRestriction,
  onToggleRestriction,
  onClearSearch,
}: OnboardingStepRestrictionsProps) {
  return (
    <section className="flex max-w-4xl flex-col gap-6 md:gap-8">
      <div className="space-y-4 md:space-y-5">
        <h1 className="font-display text-[2rem] leading-[1.1] font-semibold text-[#3b6b3c] md:text-4xl md:leading-tight lg:text-5xl">
          Do you have any{" "}
          <span className="text-[#ef7a3f]">dietary restrictions</span>?
        </h1>
        <div className="space-y-3">
          <p className="text-base font-medium italic text-[#557b52] md:text-lg">Your Restrictions</p>
          <div className="flex flex-wrap gap-2.5 md:gap-3">
            {selectedRestrictions.length > 0 ? (
              selectedRestrictions.map((restriction) => (
                <button
                  key={restriction}
                  type="button"
                  onClick={() => onToggleRestriction(restriction)}
                  className="cursor-pointer inline-flex min-h-[47.71px] items-center gap-[5.93px] rounded-[30px] border-[1.61px] border-[#557b52] bg-primary px-6 py-[11.85px] text-sm font-body text-[#FDFAE7] md:text-base"
                >
                  <span>{restriction}</span>
                  <span className="text-base leading-none md:text-lg">×</span>
                </button>
              ))
            ) : (
              <p className="text-sm text-[#718568] md:text-base">No restrictions selected yet.</p>
            )}
          </div>
        </div>
        <div className="space-y-3.5 md:space-y-4">
          <label className="relative block max-w-3xl">
            <span className="sr-only">Search restrictions</span>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search Restrictions"
              className="min-h-12 w-full rounded-[30px] border border-[#efe4c8] bg-[#fff6e3] px-4 pr-12 text-base text-[#3b6b3c] outline-none transition placeholder:text-[#61805c] focus:border-[#ef7a3f] md:min-h-14 md:px-5 md:pr-14 md:text-lg"
            />
            <button
              type="button"
              onClick={onClearSearch}
              className="cursor-pointer absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-xl leading-none text-[#557b52] md:right-4 md:h-8 md:w-8 md:text-2xl"
              aria-label="Clear search"
            >
              ×
            </button>
          </label>
          <div className="flex flex-wrap gap-2.5 md:gap-3">
            {suggestedRestrictions.length > 0 ? (
              suggestedRestrictions.map((restriction) => (
                <button
                  key={restriction}
                  type="button"
                  onClick={() => onToggleRestriction(restriction)}
                  className="cursor-pointer inline-flex min-h-[47.71px] items-center gap-[5.93px] rounded-[30px] border-[1.61px] border-[#6b8d61] px-6 py-[11.85px] text-sm font-body font-medium text-[#557b52] transition hover:bg-white/70 md:text-base"
                >
                  {restriction}
                </button>
              ))
            ) : (
              <p className="text-sm text-[#718568] md:text-base">
                No other matches with the current search.
              </p>
            )}
            {canAddCustomRestriction ? (
              <button
                type="button"
                onClick={onAddCustomRestriction}
                className="inline-flex min-h-[47.71px] items-center gap-[5.93px] rounded-[47.41px] border-[1.61px] border-dashed border-[#ef7a3f] bg-[#fff1e6] px-6 py-[11.85px] text-sm font-body font-medium text-[#c85f27] transition hover:bg-[#ffe5d1] md:text-base"
              >
                Add Custom Option
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
