"use client";

import { useMemo, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";

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

function getRecentDates(selectedDate, count = 2) {
  const dates = [];
  const [year, month, day] = selectedDate.split("-").map(Number);

  for (let i = 0; i < count; i++) {
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString("en-CA"));
  }

  return dates;
}

function formatHeading(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

function FoodCard({ item }) {
  return (
    <button
      type="button"
      className="relative aspect-square w-full overflow-hidden rounded-2xl text-left shadow-sm transition hover:scale-[1.02] lg:h-[104px] lg:w-[104px] lg:shrink-0"
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2">
        <p className="font-secondary text-[13px] leading-[1.05] text-white">
          {item.name}
        </p>
      </div>
    </button>
  );
}

function MealRow({ title, items }) {
  const rowRef = useRef(null);

  const scrollRow = (direction) => {
    if (!rowRef.current) return;
    const amount = 180;
    rowRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div className="mb-2 lg:w-fit">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-primary text-[28px] font-semibold leading-none text-accent">
            {title}
          </h3>

          <div className="hidden items-center gap-6 lg:flex">
            <button
              type="button"
              onClick={() => scrollRow("left")}
              className="text-[32px] leading-none text-[#E5C9B8] transition hover:text-accent"
              aria-label={`Scroll ${title} left`}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollRow("right")}
              className="text-[32px] leading-none text-accent transition hover:opacity-80"
              aria-label={`Scroll ${title} right`}
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 lg:hidden">
          {items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>

        <div
          ref={rowRef}
          className="hidden gap-2.5 overflow-x-auto pb-1 lg:flex lg:w-fit"
        >
          {items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DaySection({ date, meals, onEdit, isEditing = false }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-primary text-[34px] font-semibold leading-none text-secondary sm:text-[38px] lg:text-[40px]">
          {formatHeading(date)}
        </h2>

        {!isEditing && (
          <button
            type="button"
            onClick={onEdit}
            className="hidden rounded-full bg-primary px-4 py-1.5 font-secondary text-sm font-medium leading-none text-white lg:block"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-16">
        <div className="space-y-5">
          <MealRow title="Breakfast" items={meals.breakfast} />
          <MealRow title="Lunch" items={meals.lunch} />
        </div>

        <div className="space-y-5">
          <MealRow title="Dinner" items={meals.dinner} />
          <MealRow title="Snacks" items={meals.snacks} />
        </div>
      </div>
    </section>
  );
}

export default function RecentFoodsPage() {
  const [selectedDate, setSelectedDate] = useState("2026-02-07");
  const [isEditing, setIsEditing] = useState(false);

  const recentDates = useMemo(() => {
    if (isEditing) return [selectedDate];
    return getRecentDates(selectedDate, 2);
  }, [selectedDate, isEditing]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background lg:flex">
      <div className="hidden lg:flex lg:min-h-screen lg:shrink-0 lg:bg-primary">
        <Sidebar />
      </div>

      <main className="w-full px-6 pb-24 pt-8 sm:px-8 lg:flex-1 lg:px-14 lg:pt-14">
        <div className="mx-auto max-w-[1180px]">
          {!isEditing && (
            <>
              <div className="mb-5 flex items-start gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="font-primary text-4xl leading-none text-secondary transition hover:text-accent lg:text-[44px]"
                    aria-label="Go back"
                  >
                    ‹
                  </button>

                  <h1 className="font-primary text-4xl font-semibold leading-none text-secondary sm:text-5xl lg:text-[64px]">
                    Recent Foods
                  </h1>
                </div>
              </div>

              <div className="mb-8 flex items-start justify-between gap-6">
                <div className="w-full max-w-[286px]">
                  <label className="absolute ml-3 -mt-2 bg-background px-1 font-secondary text-xs text-secondary">
                    Date
                  </label>

                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full rounded-md border border-secondary bg-transparent px-4 py-2.5 pr-10 font-secondary text-[18px] font-medium text-secondary outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="hidden rounded-full bg-accent px-5 py-2 font-secondary text-sm font-medium leading-none text-white lg:block"
                >
                  ✓ Categorize by Meal
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
                />
              );
            })}
          </div>
        </div>

        {isEditing && (
          <div className="fixed bottom-[60px] right-[72px] z-30 flex gap-[14px]">
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
                +
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl text-white shadow-lg"
                aria-label="Edit foods"
              >
                ✎
              </button>
            </div>

            <div className="fixed bottom-0 left-0 right-0 h-10 bg-primary lg:hidden" />
          </>
        )}
      </main>
    </div>
  );
}