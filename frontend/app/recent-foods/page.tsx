"use client";

import { useMemo, useRef, useState } from "react";
import Sidebar from "@/components/recent-foods/Sidebar";

// TYPES
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

// DATA
// CHANGE HERE: changed image to closer match the reference food cards
const FOOD_IMAGE =
  "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=600&q=80";

const makeFoods = (startId: number) =>
  Array(4)
    .fill(null)
    .map((_, i) => ({ id: startId + i, name: "Food\nName", image: FOOD_IMAGE }));

// CHANGE HERE: added a second day so the page scrolls/looks like the reference
const RECENT_FOOD_DATA: Record<string, Meals> = {
  "2026-02-07": {
    breakfast: makeFoods(0),
    lunch: makeFoods(10),
    dinner: makeFoods(20),
    snacks: makeFoods(30),
  },
  "2026-02-06": {
    breakfast: makeFoods(40),
    lunch: makeFoods(50),
    dinner: makeFoods(60),
    snacks: makeFoods(70),
  },
};

// HELPERS
function formatHeading(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

// COMPONENTS
function FoodCard({ item }: { item: FoodItem }) {
  return (
    <button
      type="button"
      // CHANGE HERE: fixed card size to match reference instead of stretching full width
      className="relative h-[106px] w-[106px] shrink-0 overflow-hidden rounded-lg shadow-sm transition hover:scale-[1.02] hover:cursor-pointer"
    >
      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      {/* CHANGE HERE: allow Food Name to break into 2 lines like the reference */}
      <p className="absolute bottom-3 left-3 whitespace-pre-line text-left text-[16px] leading-[18px] text-white">
        {item.name}
      </p>
    </button>
  );
}

function MealRow({ title, items }: { title: string; items: FoodItem[] }) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const scrollRow = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    // CHANGE HERE: smaller vertical spacing between meal title and cards
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {/* CHANGE HERE: larger orange meal heading */}
        <h3 className="text-[32px] font-bold leading-none text-accent">{title}</h3>

        {/* CHANGE HERE: arrows use orange colors and sit closer to reference */}
        <div className="hidden items-center gap-8 pr-2 lg:flex">
          <button
            onClick={() => scrollRow("left")}
            className="text-[34px] leading-none text-accent/25 hover:cursor-pointer"
          >
            ‹
          </button>
          <button
            onClick={() => scrollRow("right")}
            className="text-[34px] leading-none text-accent hover:cursor-pointer"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        // CHANGE HERE: reference cards have bigger horizontal gaps and hidden scrollbar
        className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
    // CHANGE HERE: tighter section spacing to match vertical rhythm in reference
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        {/* CHANGE HERE: bigger dark green date heading */}
        <h2 className="text-[40px] font-bold leading-none text-primary">
          {formatHeading(date)}
        </h2>

        {!isEditing && (
          <button
            onClick={onEdit}
            // CHANGE HERE: adjusted edit button size/position style
            className="hidden rounded-full bg-primary px-6 py-2 text-[16px] text-white hover:cursor-pointer lg:block"
          >
            Edit
          </button>
        )}
      </div>

      {/* CHANGE HERE: columns and row gaps adjusted to match reference */}
      <div className="grid gap-x-[70px] gap-y-5 lg:grid-cols-2">
        <MealRow title="Breakfast" items={meals.breakfast} />
        <MealRow title="Dinner" items={meals.dinner} />
        <MealRow title="Lunch" items={meals.lunch} />
        <MealRow title="Snacks" items={meals.snacks} />
      </div>
    </section>
  );
}

// PAGE
export default function RecentFoodsPage() {
  const [selectedDate, setSelectedDate] = useState("2026-02-07");
  const [isEditing, setIsEditing] = useState(false);

  // CHANGE HERE: when editing, only show the selected day like the edit reference
  const dates = useMemo(() => {
    const d = new Date(`${selectedDate}T00:00:00`);
    const prev = new Date(d);
    prev.setDate(d.getDate() - 1);

    const selected = d.toISOString().slice(0, 10);
    const previous = prev.toISOString().slice(0, 10);

    if (isEditing) return [selected]; // CHANGE HERE
    return [selected, previous];
  }, [selectedDate, isEditing]); // CHANGE HERE

  return (
    // CHANGE HERE: exact page background and flex layout for sidebar
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar />

      {/* CHANGE HERE: content width/left padding adjusted to start like reference */}
      <main className="w-full px-14 py-14 lg:px-[56px] lg:py-[58px]">
        {/* CHANGE HERE: hide the normal header/date controls while editing */}
        {!isEditing && (
          <>
            {/* CHANGE HERE: added back arrow and made title larger/dark green */}
            <div className="flex items-center gap-5">
              <button className="text-[54px] leading-none text-primary hover:cursor-pointer">
                ‹
              </button>
              <h1 className="text-[52px] font-bold leading-none tracking-[-0.04em] text-primary">
                Recent Foods
              </h1>
            </div>

            {/* CHANGE HERE: adjusted top controls position */}
            <div className="mt-9 flex items-center justify-between">
              {/* CHANGE HERE: wrapped date input to create Figma-style label border */}
              <label className="relative block w-[285px] rounded border border-primary bg-background px-3 pb-2 pt-4 text-primary">
                <span className="absolute -top-2 left-3 bg-background px-1 text-xs text-primary">
                  Date
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedDate(e.target.value)
                  }
                  className="w-full bg-transparent text-[17px] font-semibold text-primary outline-none"
                />
              </label>

              {/* CHANGE HERE: adjusted button size and added checkmark */}
              <button className="rounded-full bg-accent px-6 py-3 text-[16px] font-medium text-white hover:cursor-pointer">
                ✓ Categorize by Meal
              </button>
            </div>
          </>
        )}

        {/* CHANGE HERE: edit mode starts closer to the top, like the edit reference */}
        <div className={`${isEditing ? "mt-0" : "mt-10"} space-y-9`}>
          {dates.map((d) => (
            <DaySection
              key={d}
              date={d}
              meals={RECENT_FOOD_DATA[d] ?? RECENT_FOOD_DATA["2026-02-07"]}
              onEdit={() => setIsEditing(true)}
              isEditing={isEditing}
            />
          ))}
        </div>

        {isEditing && (
          // CHANGE HERE: bottom action buttons match the edit reference
          <div className="fixed bottom-16 right-16 z-30 flex gap-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-full border border-primary bg-background px-7 py-2.5 text-[14px] font-medium text-primary hover:cursor-pointer hover:bg-primary/5"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-full bg-primary px-7 py-2.5 text-[14px] font-medium text-white hover:cursor-pointer hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        )}
      </main>
    </div>
  );
}