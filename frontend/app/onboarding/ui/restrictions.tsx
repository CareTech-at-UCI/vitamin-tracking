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
    <section className="flex max-w-4xl flex-col gap-8">
      <div className="space-y-5">
        <h1 className="text-4xl leading-tight font-semibold tracking-[-0.04em] text-[#3b6b3c] md:text-5xl">
          Do you have any{" "}
          <span className="text-[#ef7a3f]">dietary restrictions</span>?
        </h1>
        <div className="space-y-3">
          <p className="text-lg font-medium italic text-[#557b52]">Your Restrictions</p>
          <div className="flex flex-wrap gap-3">
            {selectedRestrictions.length > 0 ? (
              selectedRestrictions.map((restriction) => (
                <button
                  key={restriction}
                  type="button"
                  onClick={() => onToggleRestriction(restriction)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#557b52] px-5 text-base font-medium text-[#fdf4df]"
                >
                  <span>{restriction}</span>
                  <span className="text-lg leading-none">×</span>
                </button>
              ))
            ) : (
              <p className="text-[#718568]">No restrictions selected yet.</p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <label className="relative block max-w-3xl">
            <span className="sr-only">Search restrictions</span>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search Restrictions"
              className="min-h-14 w-full rounded-[20px] border border-[#efe4c8] bg-[#fff6e3] px-5 pr-14 text-lg text-[#3b6b3c] outline-none transition placeholder:text-[#61805c] focus:border-[#ef7a3f]"
            />
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute top-1/2 right-4 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-2xl leading-none text-[#557b52]"
              aria-label="Clear search"
            >
              ×
            </button>
          </label>
          <div className="flex flex-wrap gap-3">
            {suggestedRestrictions.length > 0 ? (
              suggestedRestrictions.map((restriction) => (
                <button
                  key={restriction}
                  type="button"
                  onClick={() => onToggleRestriction(restriction)}
                  className="inline-flex min-h-11 items-center rounded-full border border-[#6b8d61] px-5 text-base font-medium text-[#557b52] transition hover:bg-white/70"
                >
                  {restriction}
                </button>
              ))
            ) : (
              <p className="text-[#718568]">
                No other matches with the current search.
              </p>
            )}
            {canAddCustomRestriction ? (
              <button
                type="button"
                onClick={onAddCustomRestriction}
                className="inline-flex min-h-11 items-center rounded-full border border-dashed border-[#ef7a3f] bg-[#fff1e6] px-5 text-base font-medium text-[#c85f27] transition hover:bg-[#ffe5d1]"
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
