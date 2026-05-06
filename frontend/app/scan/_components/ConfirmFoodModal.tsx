"use client";

import { useMemo, useState } from "react";
import ModalShell from "@/components/ModalShell";
import FoodItemRow, { type FoodItem } from "@/app/scan/_components/FoodItemRow";

type ConfirmFoodModalProps = {
  onClose: () => void;
  onAddMeal: (foodNames: string[]) => void;
};

const initialFoodItems: FoodItem[] = [
  { id: 1, name: "Food Name", servings: 2 },
  { id: 2, name: "Food Name", servings: 2 },
];

export default function ConfirmFoodModal({
  onClose,
  onAddMeal,
}: ConfirmFoodModalProps) {
  const [items, setItems] = useState(initialFoodItems);

  const totalServings = useMemo(
    () => items.reduce((sum, item) => sum + item.servings, 0),
    [items],
  );

  function updateItem(updatedItem: FoodItem) {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  }

  function addFoodItem() {
    setItems((currentItems) => [
      ...currentItems,
      {
        id: Date.now(),
        name: "Food Name",
        servings: 2,
      },
    ]);
  }

  function deleteFoodItem(id: number) {
    setItems((currentItems) =>
      currentItems.length > 1
        ? currentItems.filter((item) => item.id !== id)
        : currentItems,
    );
  }

  return (
    <ModalShell
      ariaLabel="Confirm detected food"
      onClose={onClose}
      panelClassName="max-w-[895px] overflow-hidden rounded-2xl bg-scan-cream text-scan-green-dark"
      closeButtonClassName="text-scan-green-dark"
    >
      <div className="flex max-h-[min(760px,calc(100svh-4rem))] min-h-[568px] flex-col">
        <div className="flex-1 overflow-y-auto px-11 pb-10 pt-12 sm:px-18">
          <div className="mx-auto flex max-w-[724px] flex-col">
            {items.map((item, index) => (
              <div key={item.id}>
                <FoodItemRow
                  item={item}
                  canDelete={items.length > 1}
                  onChange={updateItem}
                  onDelete={() => deleteFoodItem(item.id)}
                />
                {index < items.length - 1 && (
                  <div className="my-7 h-px w-full bg-black/20" />
                )}
              </div>
            ))}
          </div>
        </div>

        <footer className="flex min-h-16 items-center justify-between gap-4 bg-white px-6 py-3 font-display text-black sm:px-7">
          <div className="flex items-center gap-4">
            <p className="font-body text-base font-medium">Servings: {totalServings}</p>
            <button
              type="button"
              onClick={addFoodItem}
              aria-label="Add food item"
              className="flex size-8 items-center justify-center rounded-full border border-scan-green text-2xl leading-none text-scan-green transition hover:bg-scan-green hover:text-white"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => onAddMeal(items.map((item) => item.name))}
            className="min-h-10 rounded-full bg-primary px-8 font-body text-base font-medium text-white transition hover:brightness-95"
          >
            Add Meal
          </button>
        </footer>
      </div>
    </ModalShell>
  );
}
