"use client";

import { useState } from "react";
import { OnboardingStepAvatar } from "@/app/onboarding/ui/avatar";
import { OnboardingStepHeightWeight } from "@/app/onboarding/ui/height-weight";
import { OnboardingNav } from "@/app/onboarding/ui/nav";
import { OnboardingStepNameAge } from "@/app/onboarding/ui/name-age";
import { OnboardingStepRestrictions } from "@/app/onboarding/ui/restrictions";
import { OnboardingShell } from "@/app/onboarding/ui/shell";

const AGE_OPTIONS = Array.from({ length: 83 }, (_, index) => String(index + 18));

const HEIGHT_OPTIONS = [
  `4' 8"`,
  `4' 10"`,
  `5' 0"`,
  `5' 2"`,
  `5' 4"`,
  `5' 6"`,
  `5' 8"`,
  `5' 10"`,
  `6' 0"`,
  `6' 2"`,
  `6' 4"`,
];

const WEIGHT_OPTIONS = [
  "100 lbs",
  "115 lbs",
  "130 lbs",
  "145 lbs",
  "160 lbs",
  "175 lbs",
  "190 lbs",
  "205 lbs",
  "220 lbs",
  "235 lbs",
];

const RESTRICTION_OPTIONS = [
  "Vegetarian",
  "No Peanuts",
  "Vegan",
  "Pescatarian",
  "No Gluten",
  "Dairy Free",
  "Halal",
  "Kosher",
];

const AVATAR_OPTIONS = [
  { id: "tomato", label: "Tomato" },
  { id: "blueberry", label: "Blueberry" },
  { id: "watermelon", label: "Watermelon" },
  { id: "grape", label: "Grape" },
] as const;

type AvatarId = (typeof AVATAR_OPTIONS)[number]["id"];

type OnboardingForm = {
  name: string;
  age: string;
  height: string;
  weight: string;
  activityLevel: number;
  selectedRestrictions: string[];
  selectedAvatar: AvatarId | "";
};

const INITIAL_FORM: OnboardingForm = {
  name: "",
  age: "",
  height: "",
  weight: "",
  activityLevel: 3,
  selectedRestrictions: ["Vegetarian", "No Peanuts"],
  selectedAvatar: "tomato",
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [form, setForm] = useState<OnboardingForm>(INITIAL_FORM);
  const [restrictionOptions, setRestrictionOptions] = useState(RESTRICTION_OPTIONS);

  const stepCount = 4;
  const trimmedSearchValue = searchValue.trim();
  const filteredRestrictions = restrictionOptions.filter((item) =>
    item.toLowerCase().includes(searchValue.toLowerCase().trim()),
  );
  const unselectedRestrictions = filteredRestrictions.filter(
    (item) => !form.selectedRestrictions.includes(item),
  );
  const canAddCustomRestriction =
    trimmedSearchValue.length > 0 &&
    !restrictionOptions.some(
      (item) => item.toLowerCase() === trimmedSearchValue.toLowerCase(),
    );

  function updateForm<K extends keyof OnboardingForm>(
    key: K,
    value: OnboardingForm[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function toggleRestriction(restriction: string) {
    setForm((previous) => {
      const exists = previous.selectedRestrictions.includes(restriction);

      return {
        ...previous,
        selectedRestrictions: exists
          ? previous.selectedRestrictions.filter((item) => item !== restriction)
          : [...previous.selectedRestrictions, restriction],
      };
    });
  }

  function addCustomRestriction() {
    if (!canAddCustomRestriction) return;

    setRestrictionOptions((previous) => [...previous, trimmedSearchValue]);
    setForm((previous) => ({
      ...previous,
      selectedRestrictions: [...previous.selectedRestrictions, trimmedSearchValue],
    }));
    setSearchValue("");
  }

  function handleNext() {
    if (currentStep === stepCount - 1) {
      return;
    }

    setCurrentStep((previous) => previous + 1);
  }

  function handleBack() {
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  }

  function handleReset() {
    setCurrentStep(0);
    setIsComplete(false);
    setSearchValue("");
  }

  return (
    <OnboardingShell currentStep={currentStep} stepCount={stepCount}>
      {isComplete ? (
        <section className="flex max-w-3xl flex-col gap-6 rounded-[36px] border border-[#d8dcc7] bg-white/70 p-8 shadow-[0_18px_60px_rgba(71,98,48,0.08)] backdrop-blur-sm md:p-12">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#ef7a3f]">
              Profile saved locally
            </p>
            <h1 className="max-w-xl text-4xl leading-[1.02] font-semibold tracking-[-0.04em] text-[#3b6b3c] md:text-6xl">
              Your onboarding flow is ready to connect to real data.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#527154]">
              For now this screen just confirms the desktop onboarding state is
              working end to end. The values below are driven by React state and
              can be wired into your backend later.
            </p>
          </div>
          <dl className="grid gap-4 md:grid-cols-2">
            <SummaryCard label="Name" value={form.name || "Not entered yet"} />
            <SummaryCard label="Age" value={form.age || "Not selected yet"} />
            <SummaryCard
              label="Height / Weight"
              value={`${form.height || "Not selected"} / ${form.weight || "Not selected"}`}
            />
            <SummaryCard
              label="Activity level"
              value={`Level ${form.activityLevel}`}
            />
            <SummaryCard
              label="Restrictions"
              value={
                form.selectedRestrictions.length > 0
                  ? form.selectedRestrictions.join(", ")
                  : "None selected"
              }
            />
            <SummaryCard
              label="Avatar"
              value={
                AVATAR_OPTIONS.find((avatar) => avatar.id === form.selectedAvatar)
                  ?.label || "Not selected yet"
              }
            />
          </dl>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#3b6b3c] px-7 text-lg font-semibold text-[#f7f1de] transition-transform hover:-translate-y-0.5"
            >
              Restart onboarding
            </button>
            <p className="text-sm text-[#6a8360]">
              Route: <span className="font-semibold">/onboarding</span>
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Mobile: all steps visible, scrollable */}
          <div className="flex flex-col gap-16 md:hidden">
            <OnboardingStepNameAge
              name={form.name}
              age={form.age}
              ageOptions={AGE_OPTIONS}
              onNameChange={(value) => updateForm("name", value)}
              onAgeChange={(value) => updateForm("age", value)}
            />
            <OnboardingStepHeightWeight
              height={form.height}
              weight={form.weight}
              activityLevel={form.activityLevel}
              heightOptions={HEIGHT_OPTIONS}
              weightOptions={WEIGHT_OPTIONS}
              onHeightChange={(value) => updateForm("height", value)}
              onWeightChange={(value) => updateForm("weight", value)}
              onActivityLevelChange={(value) => updateForm("activityLevel", value)}
            />
            <OnboardingStepRestrictions
              searchValue={searchValue}
              selectedRestrictions={form.selectedRestrictions}
              suggestedRestrictions={unselectedRestrictions}
              canAddCustomRestriction={canAddCustomRestriction}
              onSearchChange={setSearchValue}
              onAddCustomRestriction={addCustomRestriction}
              onToggleRestriction={toggleRestriction}
              onClearSearch={() => setSearchValue("")}
            />
            <OnboardingStepAvatar
              selectedAvatar={form.selectedAvatar}
              avatars={AVATAR_OPTIONS}
              onAvatarChange={(value) => updateForm("selectedAvatar", value)}
            />
            <button
              type="button"
              onClick={() => setIsComplete(true)}
              className="inline-flex min-h-12 items-center justify-center gap-1.5 self-stretch rounded-lg bg-[#ef7a3f] px-5 text-base font-medium text-[#fdf4df]"
            >
              Done
            </button>
          </div>

          {/* Desktop: step-by-step */}
          <div className="hidden md:flex md:flex-1 md:flex-col">
            {currentStep === 0 ? (
              <OnboardingStepNameAge
                name={form.name}
                age={form.age}
                ageOptions={AGE_OPTIONS}
                onNameChange={(value) => updateForm("name", value)}
                onAgeChange={(value) => updateForm("age", value)}
              />
            ) : null}
            {currentStep === 1 ? (
              <OnboardingStepHeightWeight
                height={form.height}
                weight={form.weight}
                activityLevel={form.activityLevel}
                heightOptions={HEIGHT_OPTIONS}
                weightOptions={WEIGHT_OPTIONS}
                onHeightChange={(value) => updateForm("height", value)}
                onWeightChange={(value) => updateForm("weight", value)}
                onActivityLevelChange={(value) => updateForm("activityLevel", value)}
              />
            ) : null}
            {currentStep === 2 ? (
              <OnboardingStepRestrictions
                searchValue={searchValue}
                selectedRestrictions={form.selectedRestrictions}
                suggestedRestrictions={unselectedRestrictions}
                canAddCustomRestriction={canAddCustomRestriction}
                onSearchChange={setSearchValue}
                onAddCustomRestriction={addCustomRestriction}
                onToggleRestriction={toggleRestriction}
                onClearSearch={() => setSearchValue("")}
              />
            ) : null}
            {currentStep === 3 ? (
              <OnboardingStepAvatar
                selectedAvatar={form.selectedAvatar}
                avatars={AVATAR_OPTIONS}
                onAvatarChange={(value) => updateForm("selectedAvatar", value)}
              />
            ) : null}
            <OnboardingNav
              currentStep={currentStep}
              stepCount={stepCount}
              onBack={handleBack}
              onNext={handleNext}
            />
          </div>
        </>
      )}
    </OnboardingShell>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[28px] border border-[#dfe4d0] bg-[#fffaf0] px-5 py-4">
      <dt className="text-sm font-semibold uppercase tracking-[0.22em] text-[#6e8964]">
        {label}
      </dt>
      <dd className="mt-2 text-lg leading-7 text-[#3b6b3c]">{value}</dd>
    </div>
  );
}
