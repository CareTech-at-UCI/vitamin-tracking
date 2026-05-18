"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { OnboardingStepAvatar } from "@/app/onboarding/_components/avatar";
import { OnboardingStepHeightWeight } from "@/app/onboarding/_components/height-weight";
import { OnboardingNav } from "@/app/onboarding/_components/nav";
import { OnboardingStepNameAge } from "@/app/onboarding/_components/name-age";
import { OnboardingStepRestrictions } from "@/app/onboarding/_components/restrictions";
import { OnboardingShell } from "@/app/onboarding/_components/shell";
import {
  fullOnboardingSchema,
  type OnboardingFormValues,
} from "@/lib/onboarding/schemas";
import { getPresetDietRestrictions } from "@/lib/diet-restrictions/api";
import {
  getOnboarding,
  patchOnboardingStep,
  completeOnboarding,
} from "@/lib/onboarding/api";

const HEIGHT_FEET_OPTIONS = ["3 ft", "4 ft", "5 ft", "6 ft", "7 ft", "8 ft"];

const HEIGHT_INCH_OPTIONS = Array.from(
  { length: 12 },
  (_, index) => `${index} in`,
);

const SEX_OPTIONS = ["F - Female", "M - Male", "X - Nonbinary/Intersex"];

type PresetRestriction = { id: number; name: string };

const AVATAR_OPTIONS = [
  { id: "tomato", label: "Tomato" },
  { id: "blueberry", label: "Blueberry" },
  { id: "watermelon", label: "Watermelon" },
  { id: "grape", label: "Grape" },
] as const;

type AvatarId = (typeof AVATAR_OPTIONS)[number]["id"];

// !! TEMP mapping until DB enum is updated — kept from partner's implementation !!
const AVATAR_TO_DB: Record<AvatarId, "fox" | "monkey" | "cat"> = {
  tomato: "fox",
  blueberry: "monkey",
  watermelon: "cat",
  grape: "fox",
};

const SEX_TO_DB: Record<string, "male" | "female" | "other"> = {
  "F - Female": "female",
  "M - Male": "male",
  "X - Nonbinary/Intersex": "other",
};

const SEX_FROM_DB: Record<string, string> = {
  female: "F - Female",
  male: "M - Male",
  other: "X - Nonbinary/Intersex",
};

const AVATAR_FROM_DB: Record<string, AvatarId> = {
  fox: "tomato",
  monkey: "blueberry",
  cat: "watermelon",
};

const STEP_KEYS = ["name_age", "health", "restrictions", "avatar"] as const;

const STEP_NAME_TO_INDEX: Record<string, number> = {
  name_age: 0,
  health: 1,
  restrictions: 2,
  avatar: 3,
};

const STEP_FIELDS: Record<number, (keyof OnboardingFormValues)[]> = {
  0: ["name", "age"],
  1: ["heightFeet", "heightInches", "weight", "sex"],
  2: ["selectedRestrictions"],
  3: ["selectedAvatar"],
};

const DEFAULT_VALUES: OnboardingFormValues = {
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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [presetRestrictions, setPresetRestrictions] = useState<PresetRestriction[]>(
    [],
  );
  const [presetsLoaded, setPresetsLoaded] = useState(false);

  const {
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(fullOnboardingSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  const presetNameSet = new Set(
    presetRestrictions.map((restriction) => restriction.name.toLowerCase()),
  );

  useEffect(() => {
    getPresetDietRestrictions()
      .then((items) => {
        setPresetRestrictions(
          items.map((item) => ({ id: item.id, name: item.name })),
        );
        setPresetsLoaded(true);
      })
      .catch(console.error);
  }, []);

  // Prefill from GET /onboarding on mount and resume saved step
  useEffect(() => {
    getOnboarding()
      .then((data) => {
        if (data.is_completed) {
          router.replace("/dashboard");
          return;
        }

        const updates: Partial<OnboardingFormValues> = {};

        if (data.first_name && data.last_name) {
          updates.name = `${data.first_name} ${data.last_name}`;
        }
        if (data.date_of_birth) {
          const year = new Date(data.date_of_birth).getUTCFullYear();
          updates.age = String(new Date().getFullYear() - year);
        }
        if (data.height) {
          const total = Number(data.height);
          updates.heightFeet = `${Math.floor(total / 12)} ft`;
          updates.heightInches = `${total % 12} in`;
        }
        if (data.weight) updates.weight = String(data.weight);
        if (data.sex) updates.sex = SEX_FROM_DB[data.sex] ?? "";
        if (data.activity_level) updates.activityLevel = data.activity_level;
        if (data.diet_restrictions?.length) {
          updates.selectedRestrictions = data.diet_restrictions.map(
            (restriction) => restriction.name,
          );
        }
        if (data.profile_picture) {
          const avatar = AVATAR_FROM_DB[data.profile_picture];
          if (avatar) updates.selectedAvatar = avatar;
        }

        reset({ ...DEFAULT_VALUES, ...updates });

        if (data.current_step && data.current_step in STEP_NAME_TO_INDEX) {
          setCurrentStep(STEP_NAME_TO_INDEX[data.current_step]);
        }
      })
      .catch(console.error);
  }, [reset, router]);

  const name = watch("name");
  const age = watch("age");
  const heightFeet = watch("heightFeet");
  const heightInches = watch("heightInches");
  const weight = watch("weight");
  const sex = watch("sex");
  const activityLevel = watch("activityLevel");
  const selectedRestrictions = watch("selectedRestrictions");
  const selectedAvatar = watch("selectedAvatar");

  const stepCount = 4;

  const trimmedSearchValue = searchValue.trim();
  const unselectedRestrictions = presetRestrictions
    .map((restriction) => restriction.name)
    .filter((name) => !selectedRestrictions.includes(name))
    .filter((name) =>
      name.toLowerCase().includes(searchValue.toLowerCase().trim()),
    );
  const canAddCustomRestriction =
    trimmedSearchValue.length > 0 &&
    !presetRestrictions.some(
      (restriction) =>
        restriction.name.toLowerCase() === trimmedSearchValue.toLowerCase(),
    ) &&
    !selectedRestrictions.some(
      (name) => name.toLowerCase() === trimmedSearchValue.toLowerCase(),
    );

  function toggleRestriction(restriction: string) {
    const exists = selectedRestrictions.includes(restriction);
    setValue(
      "selectedRestrictions",
      exists
        ? selectedRestrictions.filter((item) => item !== restriction)
        : [...selectedRestrictions, restriction],
      { shouldValidate: true },
    );
  }

  function addCustomRestriction() {
    if (!canAddCustomRestriction) return;
    setValue(
      "selectedRestrictions",
      [...selectedRestrictions, trimmedSearchValue],
      { shouldValidate: true },
    );
    setSearchValue("");
  }

  function buildStepPayload(stepIndex: number): Record<string, unknown> {
    if (stepIndex === 0) {
      const parts = name.trim().split(/\s+/);
      const birthYear = new Date().getFullYear() - Number(age);
      return {
        first_name: parts[0],
        last_name: parts.slice(1).join(" "),
        date_of_birth: `${birthYear}-01-01`,
      };
    }
    if (stepIndex === 1) {
      const feet = Number(heightFeet.replace(" ft", ""));
      const inches = Number(heightInches.replace(" in", ""));
      return {
        height: feet * 12 + inches,
        weight: Number(weight),
        sex: SEX_TO_DB[sex] ?? "other",
        activity_level: activityLevel,
      };
    }
    if (stepIndex === 2) {
      const presetIds = presetRestrictions
        .filter((restriction) => selectedRestrictions.includes(restriction.name))
        .map((restriction) => restriction.id);
      const customNames = selectedRestrictions.filter(
        (name) => !presetNameSet.has(name.toLowerCase()),
      );
      return { diet_restriction_ids: presetIds, custom_names: customNames };
    }
    return { profile_picture: AVATAR_TO_DB[selectedAvatar] };
  }

  async function handleNext() {
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (!valid) return;
    if (currentStep === 2 && !presetsLoaded) return;

    setIsLoading(true);
    try {
      await patchOnboardingStep(STEP_KEYS[currentStep], buildStepPayload(currentStep));
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return;
    }

    if (currentStep < stepCount - 1) {
      setCurrentStep((prev) => prev + 1);
      setIsLoading(false);
    } else {
      try {
        await completeOnboarding();
        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }
  }

  // Mobile submits all steps at once then completes
  async function handleMobileFinish() {
    const valid = await trigger();
    if (!valid) return;
    if (!presetsLoaded) return;

    setIsLoading(true);
    try {
      for (let i = 0; i < stepCount; i++) {
        await patchOnboardingStep(STEP_KEYS[i], buildStepPayload(i));
      }
      await completeOnboarding();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  function handleBack() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  // Mobile snap scroll — auto-advance when a section is newly completed
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [completedSections, setCompletedSections] = useState<Set<number>>(
    new Set(),
  );

  const ageNum = Number(age);
  const isSection0Complete =
    name.trim().split(/\s+/).length >= 2 &&
    age !== "" &&
    Number.isFinite(ageNum) &&
    ageNum >= 1 &&
    ageNum <= 120;
  const isSection1Complete =
    heightFeet !== "" &&
    heightInches !== "" &&
    weight.trim().length > 0 &&
    Number(weight) > 0 &&
    sex !== "";
  const isSection2Complete = selectedRestrictions.length > 0;

  const snapToSection = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const checks = [isSection0Complete, isSection1Complete, isSection2Complete];
    for (let i = 0; i < checks.length; i++) {
      if (checks[i] && !completedSections.has(i)) {
        setCompletedSections((prev) => new Set(prev).add(i));
        setTimeout(() => snapToSection(i + 1), 400);
        break;
      }
    }
  }, [
    isSection0Complete,
    isSection1Complete,
    isSection2Complete,
    completedSections,
    snapToSection,
  ]);

  useEffect(() => {
    const refs = sectionRefs.current.filter(Boolean) as HTMLDivElement[];
    if (refs.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = refs.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) setCurrentStep(index);
          }
        }
      },
      { threshold: 0.5 },
    );

    for (const ref of refs) observer.observe(ref);
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
              name={name}
              age={age}
              onNameChange={(value) => setValue("name", value, { shouldValidate: true })}
              onAgeChange={(value) => setValue("age", value, { shouldValidate: true })}
              nameError={errors.name?.message}
              ageError={errors.age?.message}
            />
          </div>
          <div
            ref={(el) => { sectionRefs.current[1] = el; }}
            className="flex min-h-[70svh] scroll-mt-28 snap-start flex-col justify-center py-8"
          >
            <OnboardingStepHeightWeight
              heightFeet={heightFeet}
              heightInches={heightInches}
              weight={weight}
              sex={sex}
              activityLevel={activityLevel}
              heightFeetOptions={HEIGHT_FEET_OPTIONS}
              heightInchOptions={HEIGHT_INCH_OPTIONS}
              sexOptions={SEX_OPTIONS}
              onHeightFeetChange={(value) => setValue("heightFeet", value, { shouldValidate: true })}
              onHeightInchesChange={(value) => setValue("heightInches", value, { shouldValidate: true })}
              onWeightChange={(value) => setValue("weight", value, { shouldValidate: true })}
              onSexChange={(value) => setValue("sex", value, { shouldValidate: true })}
              onActivityLevelChange={(value) => setValue("activityLevel", value)}
              heightFeetError={errors.heightFeet?.message}
              heightInchesError={errors.heightInches?.message}
              weightError={errors.weight?.message}
              sexError={errors.sex?.message}
            />
          </div>
          <div
            ref={(el) => { sectionRefs.current[2] = el; }}
            className="flex min-h-[70svh] scroll-mt-28 snap-start flex-col justify-center py-8"
          >
            <OnboardingStepRestrictions
              searchValue={searchValue}
              selectedRestrictions={selectedRestrictions}
              suggestedRestrictions={unselectedRestrictions}
              canAddCustomRestriction={canAddCustomRestriction}
              onSearchChange={setSearchValue}
              onAddCustomRestriction={addCustomRestriction}
              onToggleRestriction={toggleRestriction}
              onClearSearch={() => setSearchValue("")}
              restrictionsError={errors.selectedRestrictions?.message}
            />
          </div>
          <div
            ref={(el) => { sectionRefs.current[3] = el; }}
            className="flex min-h-[70svh] scroll-mt-28 snap-start flex-col justify-center py-8"
          >
            <OnboardingStepAvatar
              selectedAvatar={selectedAvatar}
              avatars={AVATAR_OPTIONS}
              onAvatarChange={(value) => setValue("selectedAvatar", value, { shouldValidate: true })}
              avatarError={errors.selectedAvatar?.message}
            />
          </div>
          <button
            type="button"
            onClick={handleMobileFinish}
            disabled={isLoading}
            className="mb-8 inline-flex min-h-12 snap-start items-center justify-center gap-1.5 self-stretch rounded-lg bg-[#ef7a3f] px-5 text-base font-medium text-[#fdf4df] transition disabled:pointer-events-none disabled:opacity-60"
          >
            {isLoading ? "Saving…" : "Finish"}
          </button>
        </div>

        {/* Desktop: step-by-step */}
        <div className="hidden md:flex md:flex-1 md:flex-col">
          {currentStep === 0 ? (
            <OnboardingStepNameAge
              name={name}
              age={age}
              onNameChange={(value) => setValue("name", value, { shouldValidate: true })}
              onAgeChange={(value) => setValue("age", value, { shouldValidate: true })}
              nameError={errors.name?.message}
              ageError={errors.age?.message}
            />
          ) : null}
          {currentStep === 1 ? (
            <OnboardingStepHeightWeight
              heightFeet={heightFeet}
              heightInches={heightInches}
              weight={weight}
              sex={sex}
              activityLevel={activityLevel}
              heightFeetOptions={HEIGHT_FEET_OPTIONS}
              heightInchOptions={HEIGHT_INCH_OPTIONS}
              sexOptions={SEX_OPTIONS}
              onHeightFeetChange={(value) => setValue("heightFeet", value, { shouldValidate: true })}
              onHeightInchesChange={(value) => setValue("heightInches", value, { shouldValidate: true })}
              onWeightChange={(value) => setValue("weight", value, { shouldValidate: true })}
              onSexChange={(value) => setValue("sex", value, { shouldValidate: true })}
              onActivityLevelChange={(value) => setValue("activityLevel", value)}
              heightFeetError={errors.heightFeet?.message}
              heightInchesError={errors.heightInches?.message}
              weightError={errors.weight?.message}
              sexError={errors.sex?.message}
            />
          ) : null}
          {currentStep === 2 ? (
            <OnboardingStepRestrictions
              searchValue={searchValue}
              selectedRestrictions={selectedRestrictions}
              suggestedRestrictions={unselectedRestrictions}
              canAddCustomRestriction={canAddCustomRestriction}
              onSearchChange={setSearchValue}
              onAddCustomRestriction={addCustomRestriction}
              onToggleRestriction={toggleRestriction}
              onClearSearch={() => setSearchValue("")}
              restrictionsError={errors.selectedRestrictions?.message}
            />
          ) : null}
          {currentStep === 3 ? (
            <OnboardingStepAvatar
              selectedAvatar={selectedAvatar}
              avatars={AVATAR_OPTIONS}
              onAvatarChange={(value) => setValue("selectedAvatar", value, { shouldValidate: true })}
              avatarError={errors.selectedAvatar?.message}
            />
          ) : null}
          <OnboardingNav
            currentStep={currentStep}
            stepCount={stepCount}
            onBack={handleBack}
            onNext={handleNext}
            isLoading={isLoading}
          />
        </div>
      </>
    </OnboardingShell>
  );
}
