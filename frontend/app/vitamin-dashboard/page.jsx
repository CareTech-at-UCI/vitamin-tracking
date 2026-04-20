"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VitaminRing from "@/components/VitaminRing";
import Sidebar from "@/components/Sidebar";

// ---------------------------------------------------------------------------
// Dummy vitamin data
// ---------------------------------------------------------------------------
const VITAMINS = [
  { id: "vitamin-a", label: "Vitamin A", percent: 28 },
  { id: "vitamin-b1", label: "Vitamin B1", percent: 55 },
  { id: "vitamin-b2", label: "Vitamin B2", percent: 72 },
  { id: "vitamin-b3", label: "Vitamin B3", percent: 40 },
  { id: "vitamin-b6", label: "Vitamin B6", percent: 15 },
  { id: "vitamin-b9", label: "Vitamin B9", percent: 90 },
  { id: "vitamin-b12", label: "Vitamin B12", percent: 63 },
  { id: "vitamin-c", label: "Vitamin C", percent: 48 },
  { id: "vitamin-d", label: "Vitamin D", percent: 22 },
  { id: "vitamin-e", label: "Vitamin E", percent: 37 },
  { id: "vitamin-k", label: "Vitamin K", percent: 81 },
  { id: "calcium", label: "Calcium", percent: 53 },
  { id: "iron", label: "Iron", percent: 44 },
];

const DATA_BY_DATE = {
  "2026-02-07": VITAMINS,
  "2026-02-06": VITAMINS.map((v) => ({
    ...v,
    percent: Math.max(5, v.percent - 10),
  })),
};

const getLast7Days = (selected) => {
  const dates = [];

  const [year, month, day] = selected.split("-").map(Number);

  for (let i = 0; i < 7; i++) {
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() - i);

    const formatted = d.toLocaleDateString("en-CA");
    dates.push(formatted);
  }

  return dates;
};

function formatDateHeading(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

export default function VitaminDashboardPage() {
  const router = useRouter();
  const getToday = () => {
    const today = new Date();
    return today.toLocaleDateString("en-CA");
  };

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [view, setView] = useState("daily");

  const dates = view === "daily" ? [selectedDate] : getLast7Days(selectedDate);

  const handleInfoClick = (vitaminId) => {
    router.push(`/vitamin-information?vitamin=${vitaminId}`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 px-8">
        {/* Header */}
        <div className="px-12 pt-14 pb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <h1 className="text-5xl font-primary font-semibold text-primary">
            Vitamin Breakdown
          </h1>
        </div>

        <div className="px-12 pb-6 flex items-center justify-between">
          {/* Date Picker */}
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-background px-1 text-xs font-secondary font-medium text-secondary">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-64 border border-secondary rounded-md p-2 bg-transparent font-secondary font-medium text-secondary"
            />
          </div>

          {/* Toggle */}
          <div className="flex border border-primary rounded-lg overflow-hidden">
            {["daily", "weekly"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-lg font-secondary font-medium cursor-pointer ${
                  view === v
                    ? "bg-primary text-white"
                    : "bg-transparent text-primary"
                }`}
              >
                {v === "daily" ? "Daily" : "Weekly"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-12 pb-16 space-y-16">
          {dates.map((date) => {
            const vitamins = DATA_BY_DATE[date] || VITAMINS;

            return (
              <section key={date}>
                <h2 className="text-4xl font-bold font-primary text-accent mb-8">
                  {formatDateHeading(date)}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-8 gap-x-6 gap-y-10">
                  {vitamins.map((v) => (
                    <VitaminRing
                      key={v.id}
                      label={v.label}
                      percent={v.percent}
                      onClick={() => handleInfoClick(v.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
