"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Sidebar from "@/app/recent-foods/_components/Sidebar";
import DatePicker from "@/app/recent-foods/_components/DatePicker";
import DaySection from "@/app/recent-foods/_components/DaySection";
import { HiChevronLeft, HiCheck, HiPlus, HiPencil } from "react-icons/hi";

const FOOD_IMAGE =
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80";

const RECENT_FOOD_DATA = {
  "2026-02-07": {
    breakfast: [
      { id: 1, name: "Food Name", image: FOOD_IMAGE },
      { id: 2, name: "Food Name", image: FOOD_IMAGE },
      { id: 3, name: "Food Name", image: FOOD_IMAGE },
      { id: 4, name: "Food Name", image: FOOD_IMAGE },
    ],
    lunch: [
      { id: 5, name: "Food Name", image: FOOD_IMAGE },
      { id: 6, name: "Food Name", image: FOOD_IMAGE },
      { id: 7, name: "Food Name", image: FOOD_IMAGE },
      { id: 8, name: "Food Name", image: FOOD_IMAGE },
    ],
    dinner: [
      { id: 9, name: "Food Name", image: FOOD_IMAGE },
      { id: 10, name: "Food Name", image: FOOD_IMAGE },
      { id: 11, name: "Food Name", image: FOOD_IMAGE },
      { id: 12, name: "Food Name", image: FOOD_IMAGE },
    ],
    snacks: [
      { id: 13, name: "Food Name", image: FOOD_IMAGE },
      { id: 14, name: "Food Name", image: FOOD_IMAGE },
      { id: 15, name: "Food Name", image: FOOD_IMAGE },
      { id: 16, name: "Food Name", image: FOOD_IMAGE },
    ],
  },
  "2026-02-06": {
    breakfast: [
      { id: 17, name: "Food Name", image: FOOD_IMAGE },
      { id: 18, name: "Food Name", image: FOOD_IMAGE },
      { id: 19, name: "Food Name", image: FOOD_IMAGE },
      { id: 20, name: "Food Name", image: FOOD_IMAGE },
    ],
    lunch: [
      { id: 21, name: "Food Name", image: FOOD_IMAGE },
      { id: 22, name: "Food Name", image: FOOD_IMAGE },
      { id: 23, name: "Food Name", image: FOOD_IMAGE },
      { id: 24, name: "Food Name", image: FOOD_IMAGE },
    ],
    dinner: [
      { id: 25, name: "Food Name", image: FOOD_IMAGE },
      { id: 26, name: "Food Name", image: FOOD_IMAGE },
      { id: 27, name: "Food Name", image: FOOD_IMAGE },
      { id: 28, name: "Food Name", image: FOOD_IMAGE },
    ],
    snacks: [
      { id: 29, name: "Food Name", image: FOOD_IMAGE },
      { id: 30, name: "Food Name", image: FOOD_IMAGE },
      { id: 31, name: "Food Name", image: FOOD_IMAGE },
      { id: 32, name: "Food Name", image: FOOD_IMAGE },
    ],
  },
};



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
  const [selectedDate, setSelectedDate] = useState("2026-02-07");
  const [isEditing, setIsEditing] = useState(false);

  const recentDates = useMemo(() => {
    if (isEditing) return [selectedDate];
    return getRecentDates(selectedDate, 2);
  }, [selectedDate, isEditing]);

  const changeDateByDays = (amount: number) => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    const nextDate = new Date(year, month - 1, day);
  
    nextDate.setDate(nextDate.getDate() + amount);
    setSelectedDate(nextDate.toLocaleDateString("en-CA"));
  };
  
  const goToPreviousDate = () => changeDateByDays(-1);
  const goToNextDate = () => changeDateByDays(1);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background lg:flex">
      <div className="hidden lg:flex lg:min-h-screen lg:shrink-0 lg:bg-primary">
        <Sidebar />
      </div>

      <main className="w-full px-6 pb-24 pt-8 sm:px-8 lg:flex-1 lg:px-14 lg:pt-14">
        <div className="mx-auto max-w-295">
          {!isEditing && (
            <>
              <div className="mb-5 flex items-start gap-4">
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="font-primary text-4xl leading-none text-secondary transition hover:text-accent lg:text-[44px]"
                    aria-label="Go back"
                  >
                    <HiChevronLeft />
                  </Link>

                  <h1 className="font-primary text-4xl font-bold leading-none text-secondary sm:text-5xl lg:text-[64px] tracking-tight">
                    Recent Foods
                  </h1>
                </div>
              </div>

              <div className="mb-8 flex items-center justify-between gap-3">
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
            {recentDates.map((date) => {
              const meals =
                RECENT_FOOD_DATA[date] || RECENT_FOOD_DATA["2026-02-07"];

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

            <div className="fixed bottom-0 left-0 right-0 h-10 bg-primary lg:hidden" />
          </>
        )}
      </main>
    </div>
  );
}
