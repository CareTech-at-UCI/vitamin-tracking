import { useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import FoodCard, { FoodItem } from "./FoodCard";

type Props = {
  title: string;
  items: FoodItem[];
};

export default function MealRow({ title, items }: Props) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const scrollRow = (direction: "left" | "right") => {
    if (!rowRef.current) return;

    rowRef.current.scrollBy({
      left: direction === "left" ? -180 : 180,
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
              className="text-[32px] leading-none text-[#E5C9B8] transition hover:text-accent cursor-pointer"
            >
              <HiChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollRow("right")}
              className="text-[32px] leading-none text-accent transition hover:opacity-80 cursor-pointer"
            >
              <HiChevronRight />
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