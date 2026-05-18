"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/app/recent-foods/_components/Sidebar";
import DatePicker from "@/app/recent-foods/_components/DatePicker";
import DaySection from "@/app/recent-foods/_components/DaySection";
import { HiChevronLeft, HiCheck, HiPlus, HiPencil } from "react-icons/hi";
import { getRecentFoodsDay, type RecentFoodsApiMeals } from "@/lib/recent-foods/recent-foods-api";

const FOOD_IMAGE =
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80";

type FoodItem = {
  id: number;
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

function getRecentDates(selectedDate: string, count = 2) {
  const dates: string[] = [];
  const [year, month, day] = selectedDate.split("-").map(Number);

  for (let i = 0; i < count; i++) {
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString("en-CA"));
  }

  return dates;
}

export default function RecentFoodsPage() {
  const [selectedDate, setSelectedDate] = useState("2026-05-08");
  const [isEditing, setIsEditing] = useState(false);
  const [mealsByDate, setMealsByDate] = useState<Record<string, Meals>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const recentDates = useMemo(() => {
    if (isEditing) return [selectedDate];
    return getRecentDates(selectedDate, 2);
  }, [selectedDate, isEditing]);

  const goToPreviousDate = () => setSelectedDate((prev) => addDays(prev, -1));
  const goToNextDate = () => setSelectedDate((prev) => addDays(prev, 1));

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadRecentFoods() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const days = await Promise.all(
          recentDates.map(async (date) => {
            const response = await getRecentFoodsDay(date);
            return [
              date,
              {
                breakfast: response.meals.breakfast.map((item) => ({
                  id: item.id,
                  name: item.name,
                  image: FOOD_IMAGE,
                })),
                lunch: response.meals.lunch.map((item) => ({
                  id: item.id,
                  name: item.name,
                  image: FOOD_IMAGE,
                })),
                dinner: response.meals.dinner.map((item) => ({
                  id: item.id,
                  name: item.name,
                  image: FOOD_IMAGE,
                })),
                snacks: response.meals.snacks.map((item) => ({
                  id: item.id,
                  name: item.name,
                  image: FOOD_IMAGE,
                })),
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
  }, [recentDates]);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background">
      <main className="flex-1 min-w-0">
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

          <div className="space-y-10 lg:space-y-12">
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

            {recentDates.map((date) => {
              const meals = mealsByDate[date] ?? EMPTY_MEALS;

            return (
              <DaySection
                key={date}
                date={date}
                meals={meals}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onPreviousDate={goToPreviousDate}
                onNextDate={goToNextDate}
              />
            );
          })}
        </div>

        {isEditing && (
          <div className="fixed bottom-15 right-18 z-30 flex gap-3.5">
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

        {!isEditing && (
          <>
            <div className="fixed bottom-6 right-5 z-20 flex flex-col gap-3 lg:hidden">
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
          </>
        )}
      </main>
    </div>
  );
}
