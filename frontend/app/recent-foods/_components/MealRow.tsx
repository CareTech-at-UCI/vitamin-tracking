import { useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import FoodCard, { FoodItem } from "./FoodCard";
import MealEmptyPlaceholder from "./MealEmptyPlaceholder";

type Props = {
  title: string;
  items: FoodItem[];
  onMealEdit: (item: FoodItem) => void;
};

export default function MealRow({ title, items, onMealEdit }: Props) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const hasItems = items.length > 0;

  const scrollRow = (direction: "left" | "right") => {
    if (!rowRef.current) return;

    rowRef.current.scrollBy({
      left: direction === "left" ? -170 : 170,
      behavior: "smooth",
    });
  };

  return (
    <section className="min-w-0">
      <div className="mb-2 w-full min-w-0">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-primary text-[20px] sm:text-[40px] font-semibold tracking-[-0.08em] leading-none text-accent">
            {title}
          </h3>

          {hasItems && (
            <div className="hidden items-center gap-6 lg:flex">
              <button
                type="button"
                onClick={() => scrollRow("left")}
                className="cursor-pointer text-[32px] leading-none text-[#E5C9B8] transition hover:text-accent"
              >
                <HiChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => scrollRow("right")}
                className="cursor-pointer text-[32px] leading-none text-accent transition hover:opacity-80"
              >
                <HiChevronRight />
              </button>
            </div>
          )}
        </div>

        {!hasItems ? (
          <MealEmptyPlaceholder label={title} />
        ) : (
          <>
            <div className="-mx-6 min-w-0 px-6 lg:mx-0 lg:px-0">
              <div className="no-scrollbar flex w-full min-w-0 touch-pan-x flex-nowrap gap-3 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch] lg:hidden">
                {items.map((item) => (
                  <FoodCard key={item.id} item={item} onClick={() => onMealEdit(item)} />
                ))}
              </div>
            </div>

            <div
              ref={rowRef}
              className="hidden w-full min-w-0 max-w-full gap-2.5 overflow-x-auto overscroll-x-contain pb-1 lg:flex"
            >
              {items.map((item) => (
                <FoodCard key={item.id} item={item} onClick={() => onMealEdit(item)} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
