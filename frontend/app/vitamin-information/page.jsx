"use client";

import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import VitaminDropdown from "@/components/VitaminDropdown";

export default function VitaminInfoPage() {
  const searchParams = useSearchParams();
  const activeVitamin = searchParams.get("vitamin");
  const vitamins = [
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
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 px-20 pt-14 pb-16">
        {/* Title */}
        <h1 className="text-5xl font-primary text-secondary font-semibold mb-10">
          What are vitamins and why are they important?
        </h1>

        {/* Description */}
        <p className="text-secondary font-secondary mb-10">
          Vitamins are micronutrients that we need in small amounts for various
          metabolic processes and bodily functions.
        </p>

        {/* List */}
        <div className="space-y-2">
          {vitamins.map((v, i) => (
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
