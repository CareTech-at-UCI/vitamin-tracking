"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "@/app/recent-foods/_components/DatePicker";
import DaySection from "@/app/recent-foods/_components/DaySection";
import EditMealModal from "@/app/recent-foods/_components/EditMealModal";
import { HiChevronLeft, HiCheck, HiPlus, HiPencil } from "react-icons/hi";
import { createClient } from "@/utils/supabase/client";
import {
  getRecentFoodsDay,
  type RecentFoodsApiItem,
  type RecentFoodsApiMeals,
} from "@/lib/recent-foods/recent-foods-api";

const FOOD_IMAGE =
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80";
const SCAN_IMAGES_BUCKET = "scan-images";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

type FoodItem = {
  id: number;
  mealId: number;
  name: string;
  image: string;
};

type Meals = Record<keyof RecentFoodsApiMeals, FoodItem[]>;

const EMPTY_MEALS: Meals = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
};



function addDays(dateStr: string, delta: number) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + delta);
  return d.toLocaleDateString("en-CA");
}

function todayLocalIsoDate() {
  return new Date().toLocaleDateString("en-CA");
}

export default function RecentFoodsPage() {
  const [selectedDate, setSelectedDate] = useState(todayLocalIsoDate);
  const [isEditing, setIsEditing] = useState(false);
  const [mealsByDate, setMealsByDate] = useState<Record<string, Meals>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [editingMeal, setEditingMeal] = useState<{ mealId: number; image: string } | null>(null);

  const recentDates = useMemo(() => [selectedDate], [selectedDate]);

  const goToPreviousDate = () => setSelectedDate((prev) => addDays(prev, -1));
  const goToNextDate = () => setSelectedDate((prev) => addDays(prev, 1));

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadRecentFoods() {
      setIsLoading(true);
      setLoadError(null);

      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user) {
        if (!isCurrentRequest) return;
        setLoadError(
          authError?.message ?? "Sign in to view your recent foods.",
        );
        setIsLoading(false);
        return;
      }

      try {
        const days = await Promise.all(
          recentDates.map(async (date) => {
            const response = await getRecentFoodsDay(date, user.id);

            const imagePaths = [
              ...new Set(
                Object.values(response.meals)
                  .flat()
                  .map((item) => item.image_path)
                  .filter((path): path is string => Boolean(path)),
              ),
            ];
            const signedUrlByPath = new Map<string, string>();
            if (imagePaths.length > 0) {
              const { data: signedUrls } = await supabase.storage
                .from(SCAN_IMAGES_BUCKET)
                .createSignedUrls(imagePaths, SIGNED_URL_TTL_SECONDS);
              for (const signed of signedUrls ?? []) {
                if (signed.path && signed.signedUrl) {
                  signedUrlByPath.set(signed.path, signed.signedUrl);
                }
              }
            }

            const toFoodItems = (items: RecentFoodsApiItem[]): FoodItem[] =>
              items.map((item) => ({
                id: item.id,
                mealId: item.meal_id,
                name: item.name,
                image: (item.image_path && signedUrlByPath.get(item.image_path)) || FOOD_IMAGE,
              }));

            return [
              date,
              {
                breakfast: toFoodItems(response.meals.breakfast),
                lunch: toFoodItems(response.meals.lunch),
                dinner: toFoodItems(response.meals.dinner),
                snacks: toFoodItems(response.meals.snacks),
              } satisfies Meals,
            ] as const;
          }),
        );

        if (!isCurrentRequest) return;
        setMealsByDate(Object.fromEntries(days));
      } catch (error) {
        if (!isCurrentRequest) return;
        setMealsByDate({});
        setLoadError(error instanceof Error ? error.message : "Failed to load recent foods.");
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    void loadRecentFoods();

    return () => {
      isCurrentRequest = false;
    };
  }, [recentDates, reloadCount]);

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-background">
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        {!isEditing && (
          <>
            <div className="mb-5 flex items-start gap-4 px-6 pt-10 lg:px-12 lg:pt-14">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="font-primary text-4xl sm:text-6xl leading-none text-secondary transition hover:text-accent"
                  aria-label="Go back"
                >
                  <HiChevronLeft />
                </Link>

                <h1 className="font-primary text-4xl font-semibold leading-none text-secondary sm:text-5xl lg:text-[64px] tracking-tight">
                  Recent Foods
                </h1>
              </div>
            </div>

            <div className="mb-8 flex items-center justify-between gap-3 px-6 lg:px-12">
              <div className="w-full md:w-auto">
                <DatePicker value={selectedDate} onChange={setSelectedDate} />
              </div>

              <button
                type="button"
                className="hidden rounded-full bg-accent px-3 py-2 gap-1 font-secondary text-sm font-medium leading-none text-white lg:flex cursor-pointer"
              >
                <HiCheck />
                Categorize by Meal
              </button>
            </div>
          </>
        )}

          <div className="min-w-0 space-y-10 px-6 pb-mobile-content lg:space-y-12 lg:px-12 lg:pb-12">
            {loadError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 font-secondary text-sm text-red-900">
                {loadError}
              </div>
            )}

            {isLoading && (
              <p className="font-secondary text-sm font-medium text-secondary/70">
                Loading recent foods...
              </p>
            )}

            {!isLoading &&
              recentDates.map((date) => {
                const meals = mealsByDate[date] ?? EMPTY_MEALS;

                return (
                  <DaySection
                    key={date}
                    date={date}
                    meals={meals}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onMealEdit={(item) => setEditingMeal({ mealId: item.mealId, image: item.image })}
                    onPreviousDate={goToPreviousDate}
                    onNextDate={goToNextDate}
                  />
                );
              })}
        </div>

      </main>

      {isEditing && (
        <div className="mobile-fab-anchor flex gap-3.5 md:right-18">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-full border border-primary px-6 py-2.5 font-secondary text-[14px] font-medium leading-none text-primary transition hover:bg-primary/5"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-full bg-primary px-7 py-2.5 font-secondary text-[14px] font-medium leading-none text-white transition hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      )}

      {editingMeal && (
        <EditMealModal
          mealId={editingMeal.mealId}
          image={editingMeal.image}
          onClose={() => setEditingMeal(null)}
          onSaved={() => setReloadCount((count) => count + 1)}
        />
      )}

      {!isEditing && (
        <div className="mobile-fab-anchor flex flex-col-reverse gap-3 lg:hidden">
          <button
            type="button"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-4xl text-white shadow-lg"
            aria-label="Add food"
          >
            <HiPlus />
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl text-white shadow-lg"
            aria-label="Edit foods"
          >
            <HiPencil />
          </button>
        </div>
      )}
    </div>
  );
}
