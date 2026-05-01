"use client";

import { useState } from "react";
import { OnboardingStepAvatar } from "@/app/onboarding/ui/avatar";
import { OnboardingStepHeightWeight } from "@/app/onboarding/ui/height-weight";
import { OnboardingNav } from "@/app/onboarding/ui/nav";
import { OnboardingStepNameAge } from "@/app/onboarding/ui/name-age";
import { OnboardingStepRestrictions } from "@/app/onboarding/ui/restrictions";
import { OnboardingShell } from "@/app/onboarding/ui/shell";

const AGE_OPTIONS = Array.from({ length: 83 }, (_, index) => String(index + 18));

const HEIGHT_FEET_OPTIONS = ["3 ft", "4 ft", "5 ft", "6 ft", "7 ft", "8 ft"];

const HEIGHT_INCH_OPTIONS = Array.from(
  { length: 12 },
  (_, index) => `${index} in`,
);

const SEX_OPTIONS = ["F - Female", "M - Male", "X - Nonbinary/Intersex"];

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
  heightFeet: string;
  heightInches: string;
  weight: string;
  sex: string;
  activityLevel: number;
  selectedRestrictions: string[];
  selectedAvatar: AvatarId | "";
};

const INITIAL_FORM: OnboardingForm = {
  name: "",
  age: "",
  heightFeet: "",
  heightInches: "",
  weight: "",
  sex: "",
  activityLevel: 3,
  selectedRestrictions: ["Vegetarian", "No Peanuts"],
  selectedAvatar: "tomato",
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchValue, setSearchValue] = useState("");
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

  return (
    <OnboardingShell currentStep={currentStep} stepCount={stepCount}>
      <>
        <div className="flex flex-col gap-16 md:hidden">
          <OnboardingStepNameAge
            name={form.name}
            age={form.age}
            ageOptions={AGE_OPTIONS}
            onNameChange={(value) => updateForm("name", value)}
            onAgeChange={(value) => updateForm("age", value)}
          />
          <OnboardingStepHeightWeight
            heightFeet={form.heightFeet}
            heightInches={form.heightInches}
            weight={form.weight}
            sex={form.sex}
            activityLevel={form.activityLevel}
            heightFeetOptions={HEIGHT_FEET_OPTIONS}
            heightInchOptions={HEIGHT_INCH_OPTIONS}
            sexOptions={SEX_OPTIONS}
            onHeightFeetChange={(value) => updateForm("heightFeet", value)}
            onHeightInchesChange={(value) => updateForm("heightInches", value)}
            onWeightChange={(value) => updateForm("weight", value)}
            onSexChange={(value) => updateForm("sex", value)}
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
            className="inline-flex min-h-12 items-center justify-center gap-1.5 self-stretch rounded-lg bg-[#ef7a3f] px-5 text-base font-medium text-[#fdf4df]"
          >
            Finish
          </button>
        </div>

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
              heightFeet={form.heightFeet}
              heightInches={form.heightInches}
              weight={form.weight}
              sex={form.sex}
              activityLevel={form.activityLevel}
              heightFeetOptions={HEIGHT_FEET_OPTIONS}
              heightInchOptions={HEIGHT_INCH_OPTIONS}
              sexOptions={SEX_OPTIONS}
              onHeightFeetChange={(value) => updateForm("heightFeet", value)}
              onHeightInchesChange={(value) => updateForm("heightInches", value)}
              onWeightChange={(value) => updateForm("weight", value)}
              onSexChange={(value) => updateForm("sex", value)}
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
    </OnboardingShell>
  );
}
