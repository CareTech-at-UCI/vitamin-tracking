"use client";

import { useMemo, useState } from "react";
import ModalShell from "@/components/ModalShell";
import Drawer, {
  type DrawerSnap,
  toggleDrawerCollapse,
} from "@/app/scan/_components/Drawer";
import FoodItemRow, { type FoodItem } from "@/app/scan/_components/FoodItemRow";
import FoodServing from "@/app/scan/_components/FoodServing";

type ConfirmFoodModalProps = {
  onClose: () => void;
  onAddMeal: (items: FoodItem[]) => void;
};

const initialFoodItems: FoodItem[] = [
  { id: 1, name: "Food Name", servings: 2 },
  { id: 2, name: "Food Name", servings: 2 },
];

function ConfirmFoodContent({
  items,
  layout,
  showHandle,
  onToggleDrawer,
  onUpdateItem,
  onDeleteItem,
}: {
  items: FoodItem[];
  layout: "mobile" | "desktop";
  showHandle: boolean;
  onToggleDrawer: () => void;
  onUpdateItem: (item: FoodItem) => void;
  onDeleteItem: (id: number) => void;
}) {
  if (layout === "mobile") {
    return (
      <>
        {showHandle && (
          <div className="flex shrink-0 justify-center pt-2">
            <button
              type="button"
              aria-label="Collapse drawer"
              onClick={onToggleDrawer}
              className="h-1.5 w-12 rounded-full bg-gray-300"
            />
          </div>
        )}

        <div className="flex flex-col gap-12 px-4 py-8">
          {items.map((item) => (
            <FoodServing
              key={item.id}
              name={item.name}
              servings={item.servings}
              canDelete={items.length > 1}
              onDelete={() => onDeleteItem(item.id)}
              onServingsChange={(servings) =>
                onUpdateItem({ ...item, servings })
              }
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="mx-auto flex max-w-[724px] flex-col">
      {items.map((item, index) => (
        <div key={item.id}>
          <FoodItemRow
            item={item}
            canDelete={items.length > 1}
            onChange={onUpdateItem}
            onDelete={() => onDeleteItem(item.id)}
          />
          {index < items.length - 1 && (
            <div className="my-7 h-px w-full bg-black/20" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ConfirmFoodModal({
  onClose,
  onAddMeal,
}: ConfirmFoodModalProps) {
  const [items, setItems] = useState(initialFoodItems);
  const [snap, setSnap] = useState<DrawerSnap>("expanded");

  const totalServings = useMemo(
    () => items.reduce((sum, item) => sum + item.servings, 0),
    [items],
  );

  function updateItem(updatedItem: FoodItem) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
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

  function handleToggleDrawer() {
    toggleDrawerCollapse(snap, setSnap);
  }

  function handleSnapChange(next: DrawerSnap) {
    setSnap(next);
    if (next === "dismissed") {
      onClose();
    }
  }

  const footer = (
    <div className="flex min-h-16 items-center justify-between gap-4 border-t bg-white px-4 py-3 text-black">
      <div className="flex items-center gap-4">
        <p className="font-body text-base font-medium">
          Servings: {totalServings}
        </p>
        <button
          type="button"
          onClick={addFoodItem}
          aria-label="Add food item"
          className="flex size-8 items-center justify-center rounded-full border border-primary text-2xl leading-none text-primary transition hover:bg-primary hover:text-white"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => onAddMeal(items)}
        className="min-h-10 rounded-full bg-primary px-8 font-body text-base font-medium text-white transition hover:brightness-95"
      >
        Add Meal
      </button>
    </div>
  );

  return (
    <>
      <div className="md:hidden">
        <Drawer
          snap={snap}
          onSnapChange={handleSnapChange}
          showDragHandle={false}
          fillHeight
          heightClassName="h-[85vh]"
          collapsedClassName="translate-y-[95%]"
          panelClassName="rounded-t-2xl bg-background"
          contentClassName="px-0"
          overlayClassName="z-[55]"
          footer={footer}
        >
          <ConfirmFoodContent
            items={items}
            layout="mobile"
            showHandle
            onToggleDrawer={handleToggleDrawer}
            onUpdateItem={updateItem}
            onDeleteItem={deleteFoodItem}
          />
        </Drawer>
      </div>

      <div className="hidden md:block">
        <ModalShell
          ariaLabel="Confirm detected food"
          onClose={onClose}
          panelClassName="max-w-[895px] overflow-hidden rounded-2xl bg-background text-secondary"
          closeButtonClassName="text-secondary"
        >
          <div className="flex max-h-[min(760px,calc(100svh-4rem))] min-h-[568px] flex-col">
            <div className="flex-1 overflow-y-auto px-11 pb-10 pt-12 sm:px-18">
              <ConfirmFoodContent
                items={items}
                layout="desktop"
                showHandle={false}
                onToggleDrawer={handleToggleDrawer}
                onUpdateItem={updateItem}
                onDeleteItem={deleteFoodItem}
              />
            </div>
            {footer}
          </div>
        </ModalShell>
      </div>
    </>
  );
}
