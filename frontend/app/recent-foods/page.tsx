"use client";

import { useMemo, useRef, useState } from "react";
import Sidebar from "@/components/recent-foods/Sidebar";
//TYPES
type FoodItem = {
  id: number;
  name: string;
  image: string;
};

type Meals = {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snacks: FoodItem[];
};

//DATA
const FOOD_IMAGE =
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80";

const RECENT_FOOD_DATA: Record<string, Meals> = {
  "2026-02-07": {
    breakfast: Array(4)
      .fill(null)
      .map((_, i) => ({ id: i, name: "Food Name", image: FOOD_IMAGE })),
    lunch: Array(4)
      .fill(null)
      .map((_, i) => ({ id: i + 10, name: "Food Name", image: FOOD_IMAGE })),
    dinner: Array(4)
      .fill(null)
      .map((_, i) => ({ id: i + 20, name: "Food Name", image: FOOD_IMAGE })),
    snacks: Array(4)
      .fill(null)
      .map((_, i) => ({ id: i + 30, name: "Food Name", image: FOOD_IMAGE })),
  },
};

//HELPERS
function formatHeading(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

//COMPONENTS
function FoodCard({ item }: { item: FoodItem }) {
  return (
    <button
      type="button"
      className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-sm transition hover:scale-[1.02] hover:cursor-pointer lg:w-1/4"
    >
      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <p className="absolute bottom-2 left-2 text-sm text-white">
        {item.name}
      </p>
    </button>
  );
}

function MealRow({
  title,
  items,
}: {
  title: string;
  items: FoodItem[];
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const scrollRow = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-accent">{title}</h3>

        <div className="hidden gap-6 lg:flex">
          <button
            onClick={() => scrollRow("left")}
            className="text-2xl hover:cursor-pointer"
          >
            ‹
          </button>
          <button
            onClick={() => scrollRow("right")}
            className="text-2xl hover:cursor-pointer"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto"
      >
        {items.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function DaySection({
  date,
  meals,
  onEdit,
  isEditing,
}: {
  date: string;
  meals: Meals;
  onEdit: () => void;
  isEditing: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {formatHeading(date)}
        </h2>

        {!isEditing && (
          <button
            onClick={onEdit}
            className="hidden rounded-full bg-primary px-4 py-1 text-sm text-white hover:cursor-pointer lg:block"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <MealRow title="Breakfast" items={meals.breakfast} />
          <MealRow title="Lunch" items={meals.lunch} />
        </div>

        <div className="space-y-4">
          <MealRow title="Dinner" items={meals.dinner} />
          <MealRow title="Snacks" items={meals.snacks} />
        </div>
      </div>
    </div>
  );
}

//PAGE 
export default function RecentFoodsPage() {
  const [selectedDate, setSelectedDate] = useState("2026-02-07");
  const [isEditing, setIsEditing] = useState(false);

  const dates = useMemo(() => [selectedDate], [selectedDate]);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar />

      <main className="w-full px-6 py-10">
        <h1 className="text-4xl font-bold">Recent Foods</h1>

        <div className="mt-6 flex items-center justify-between">
          <input
            type="date"
            value={selectedDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSelectedDate(e.target.value)
            }
            className="border px-3 py-2"
          />

          <button className="rounded-full bg-accent px-4 py-2 text-sm text-white hover:cursor-pointer">
            Categorize by Meal
          </button>
        </div>

        <div className="mt-8 space-y-8">
          {dates.map((d) => (
            <DaySection
              key={d}
              date={d}
              meals={RECENT_FOOD_DATA[d]}
              onEdit={() => setIsEditing(true)}
              isEditing={isEditing}
            />
          ))}
        </div>

        {isEditing && (
          <div className="fixed bottom-16 right-16 flex gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-full border px-6 py-2 text-sm hover:cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="rounded-full bg-primary px-6 py-2 text-sm text-white hover:cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        )}
      </main>
    </div>
  );
}