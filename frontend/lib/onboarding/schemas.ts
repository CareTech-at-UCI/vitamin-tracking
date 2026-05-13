import { z } from "zod";

export const nameAgeSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .refine(
      (v) => v.trim().split(/\s+/).length >= 2,
      "Please enter your first and last name",
    ),
  age: z
    .string()
    .min(1, "Age is required")
    .refine((v) => {
      const n = Number(v);
      return Number.isFinite(n) && n >= 1 && n <= 120;
    }, "Age must be between 1 and 120"),
});

export const healthSchema = z.object({
  heightFeet: z.string().min(1, "Height (feet) is required"),
  heightInches: z.string().min(1, "Height (inches) is required"),
  weight: z
    .string()
    .min(1, "Weight is required")
    .refine((v) => Number(v) > 0, "Weight must be greater than 0"),
  sex: z.string().min(1, "Sex is required"),
  activityLevel: z.number().min(1).max(5),
});

export const restrictionsSchema = z.object({
  selectedRestrictions: z
    .array(z.string())
    .min(1, "Please select at least one dietary restriction"),
});

export const avatarSchema = z.object({
  selectedAvatar: z.enum(["tomato", "blueberry", "watermelon", "grape"], {
    error: "Please select an avatar",
  }),
});

export const fullOnboardingSchema = z.object({
  name: nameAgeSchema.shape.name,
  age: nameAgeSchema.shape.age,
  heightFeet: healthSchema.shape.heightFeet,
  heightInches: healthSchema.shape.heightInches,
  weight: healthSchema.shape.weight,
  sex: healthSchema.shape.sex,
  activityLevel: healthSchema.shape.activityLevel,
  selectedRestrictions: restrictionsSchema.shape.selectedRestrictions,
  selectedAvatar: avatarSchema.shape.selectedAvatar,
});

export type OnboardingFormValues = z.infer<typeof fullOnboardingSchema>;
