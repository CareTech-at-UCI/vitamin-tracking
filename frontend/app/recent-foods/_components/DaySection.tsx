import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import DayEmptyState from "./DayEmptyState";
import MealRow from "./MealRow";

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

type Props = {
  date: string;
  meals: Meals;
  onEdit: () => void;
  isEditing?: boolean;
  onPreviousDate: () => void;
  onNextDate: () => void;
};

function formatHeading(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

function countDayItems(meals: Meals) {
  return (
    meals.breakfast.length +
    meals.lunch.length +
    meals.dinner.length +
    meals.snacks.length
  );
}

export default function DaySection({
  date,
  meals,
  onEdit,
  isEditing = false,
  onPreviousDate,
  onNextDate,
}: Props) {
  const dayItemCount = countDayItems(meals);
  const isDayEmpty = dayItemCount === 0;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 lg:grid-cols-[1fr_auto]">
        {!isEditing && (
          <button
            type="button"
            onClick={onPreviousDate}
            className="flex h-10 w-10 items-center justify-center text-3xl text-secondary transition hover:text-secondary lg:hidden"
            aria-label="Previous date"
          >
            <HiChevronLeft />
          </button>
        )}

        <h2 className="whitespace-nowrap text-center font-primary text-2xl font-semibold tracking-[-0.08em] leading-none text-secondary sm:text-5xl lg:text-left lg:text-[40px]">
          {formatHeading(date)}
        </h2>

        {!isEditing && (
          <button
            type="button"
            onClick={onNextDate}
            className="flex h-10 w-10 items-center justify-center text-3xl text-secondary transition hover:text-accent lg:hidden"
            aria-label="Next date"
          >
            <HiChevronRight />
          </button>
        )}

        {!isEditing && (
          <button
            type="button"
            onClick={onEdit}
            className="hidden cursor-pointer rounded-full bg-primary px-4 py-1.5 font-secondary text-sm font-medium text-white lg:block"
          >
            Edit
          </button>
        )}
      </div>

      {isDayEmpty ? (
        <DayEmptyState />
      ) : (
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
      )}
    </section>
  );
}