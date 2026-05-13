"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OnboardingStepAvatar } from "@/app/onboarding/_components/avatar";
import { OnboardingStepHeightWeight } from "@/app/onboarding/_components/height-weight";
import { OnboardingNav } from "@/app/onboarding/_components/nav";
import { OnboardingStepNameAge } from "@/app/onboarding/_components/name-age";
import { OnboardingStepRestrictions } from "@/app/onboarding/_components/restrictions";
import { OnboardingShell } from "@/app/onboarding/_components/shell";
import { createClient } from "@/utils/supabase/client";

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

// !! TEMP FUNCTION TO MATCH ENUM IN DB, PLEASE FIX WHEN DB IS FIXED !!
const AVATAR_TO_DB: Record<AvatarId, "fox" | "monkey" | "cat"> = {
  tomato: "fox",
  blueberry: "monkey",
  watermelon: "cat",
  grape: "fox",
};

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
  selectedAvatar: AvatarId;
};

const INITIAL_FORM: OnboardingForm = {
  name: "",
  age: "",
  heightFeet: "",
  heightInches: "",
  weight: "",
  sex: "",
  activityLevel: 3,
  selectedRestrictions: [],
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

  async function handleSubmit() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const [firstName, lastName] = form.name.split(" ");

    const feet = Number(form.heightFeet.replace(" ft", ""));
    const inches = Number(form.heightInches.replace(" in", ""));
    const weight = Number(form.weight);

    const safeFeet = Number.isFinite(feet) ? feet : 0;
    const safeInches = Number.isFinite(inches) ? inches : 0;
    const safeWeight = Number.isFinite(weight) ? weight : 0;

    const response = await fetch(
      `http://localhost:8000/api/v1/users/${user.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName || "Unknown",
          last_name: lastName || "User",
          date_of_birth: "2000-01-01",

          sex:
            form.sex === "F - Female"
              ? "female"
              : form.sex === "M - Male"
              ? "male"
              : "other",

          height: safeFeet * 12 + safeInches,
          weight: safeWeight,
          activity_level: form.activityLevel,

          recommendations: form.selectedRestrictions ?? [],

          profile_picture: AVATAR_TO_DB[form.selectedAvatar],
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("FASTAPI ERROR:", errorData);
      throw new Error(JSON.stringify(errorData, null, 2));
    }

    const updatedUser = await response.json();
    console.log(updatedUser);

    return updatedUser;
  }

  async function handleNext() {
  if (currentStep === stepCount - 1) {
    // desktop submit logic
    await handleSubmit();
    return;
  }

  setCurrentStep((previous) => previous + 1);
}

  function handleBack() {
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  }

  // Mobile snap scroll: track which section has been "completed" so we only
  // auto-snap forward (never backwards when the user scrolls up).
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [completedSections, setCompletedSections] = useState<Set<number>>(
    new Set(),
  );

  const ageNum = Number(form.age);
  const isSection0Complete =
    form.name.trim().length > 0 &&
    form.age !== "" &&
    Number.isFinite(ageNum) &&
    ageNum >= 1 &&
    ageNum <= 120;
  const isSection1Complete =
    form.heightFeet !== "" &&
    form.heightInches !== "" &&
    form.weight.trim().length > 0 &&
    form.sex !== "";
  const isSection2Complete = form.selectedRestrictions.length > 0;

  const snapToSection = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-snap forward when a section is newly completed
  useEffect(() => {
    const checks = [isSection0Complete, isSection1Complete, isSection2Complete];

    for (let i = 0; i < checks.length; i++) {
      if (checks[i] && !completedSections.has(i)) {
        setCompletedSections((prev) => new Set(prev).add(i));
        // Small delay so the user sees the last field fill before snapping
        setTimeout(() => snapToSection(i + 1), 400);
        break; // only snap one section at a time
      }
    }
  }, [
    isSection0Complete,
    isSection1Complete,
    isSection2Complete,
    completedSections,
    snapToSection,
  ]);

  // Update step counter based on which mobile section is in view
  useEffect(() => {
    const refs = sectionRefs.current.filter(Boolean) as HTMLDivElement[];
    if (refs.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = refs.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setCurrentStep(index);
            }
          }
        }
      },
      { threshold: 0.5 },
    );

    for (const ref of refs) {
      observer.observe(ref);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <OnboardingShell currentStep={currentStep} stepCount={stepCount}>
      <>
        {/* Mobile: all sections visible with snap scrolling */}
        <div className="flex flex-col md:hidden">
          <div
            ref={(el) => { sectionRefs.current[0] = el; }}
            className="flex min-h-[70svh] scroll-mt-28 snap-start flex-col justify-center py-8"
          >
            <OnboardingStepNameAge
              name={form.name}
              age={form.age}
              onNameChange={(value) => updateForm("name", value)}
              onAgeChange={(value) => updateForm("age", value)}
            />
          </div>
          <div
            ref={(el) => { sectionRefs.current[1] = el; }}
            className="flex min-h-[70svh] scroll-mt-28 snap-start flex-col justify-center py-8"
          >
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
          </div>
          <div
            ref={(el) => { sectionRefs.current[2] = el; }}
            className="flex min-h-[70svh] scroll-mt-28 snap-start flex-col justify-center py-8"
          >
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
          </div>
          <div
            ref={(el) => { sectionRefs.current[3] = el; }}
            className="flex min-h-[70svh] scroll-mt-28 snap-start flex-col justify-center py-8"
          >
            <OnboardingStepAvatar
              selectedAvatar={form.selectedAvatar}
              avatars={AVATAR_OPTIONS}
              onAvatarChange={(value) => updateForm("selectedAvatar", value)}
            />
          </div>
          <button
            type="button"
            className="mb-8 inline-flex min-h-12 snap-start items-center justify-center gap-1.5 self-stretch rounded-lg bg-[#ef7a3f] px-5 text-base font-medium text-[#fdf4df]"
            onClick = {handleSubmit}
          >
            Finish
          </button>
        </div>

        {/* Desktop: step-by-step */}
        <div className="hidden md:flex md:flex-1 md:flex-col">
          {currentStep === 0 ? (
            <OnboardingStepNameAge
              name={form.name}
              age={form.age}
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
