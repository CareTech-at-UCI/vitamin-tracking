"use client";

import { useSearchParams } from "next/navigation";
import VitaminDropdown from "@/app/recent-foods/_components/VitaminDropdown";

const VITAMINS = [
  { id: "vitamin-a", title: "Vitamin A" },
  { id: "vitamin-b1", title: "Vitamin B1" },
  { id: "vitamin-b2", title: "Vitamin B2" },
  { id: "vitamin-b3", title: "Vitamin B3" },
  { id: "vitamin-b6", title: "Vitamin B6" },
  { id: "vitamin-b9", title: "Vitamin B9" },
  { id: "vitamin-b12", title: "Vitamin B12" },
  { id: "vitamin-c", title: "Vitamin C" },
  { id: "vitamin-d", title: "Vitamin D" },
  { id: "vitamin-e", title: "Vitamin E" },
  { id: "vitamin-k", title: "Vitamin K" },
  { id: "calcium", title: "Calcium" },
  { id: "iron", title: "Iron" },
] as const;

export default function VitaminInfoContent() {
  const searchParams = useSearchParams();
  const activeVitamin = searchParams.get("vitamin");

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 sm:px-20 px-6 sm:pt-14 pt-10 pb-16">
        <h1 className="text-4xl sm:text-6xl font-primary text-secondary font-semibold mb-10">
          What are vitamins and why are they important?
        </h1>

        <p className="text-secondary font-medium font-secondary mb-10">
          Vitamins are micronutrients that we need in small amounts for various
          metabolic processes and bodily functions.
        </p>

        <div className="space-y-2">
          {VITAMINS.map((v) => (
            <VitaminDropdown
              key={v.id}
              id={v.id}
              title={v.title}
              isActive={v.id === activeVitamin}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
