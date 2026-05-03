import { FC } from "react";

export type FoodItem = {
  id: number;
  name: string;
  image: string;
};

type Props = {
  item: FoodItem;
};

const FoodCard: FC<Props> = ({ item }) => {
  return (
    <button
      type="button"
      className="relative aspect-square w-full overflow-hidden rounded-2xl text-left shadow-sm transition hover:scale-[1.02] lg:h-26 lg:w-26 lg:shrink-0"
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2">
        <p className="font-secondary text-[13px] leading-[1.05] text-white">
          {item.name}
        </p>
      </div>
    </button>
  );
};

export default FoodCard;
