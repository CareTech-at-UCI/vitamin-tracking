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

export default function DaySection({
  date,
  meals,
  onEdit,
  isEditing = false,
}: Props) {
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
            className="hidden rounded-full bg-primary px-4 py-1.5 font-secondary text-sm font-medium text-white lg:block cursor-pointer"
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
