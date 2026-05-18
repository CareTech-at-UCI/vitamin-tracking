"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import VitaminRing from "@/app/recent-foods/_components/VitaminRing";
import DatePicker from "@/app/recent-foods/_components/DatePicker";
import VitaminDropdown from "@/app/recent-foods/_components/VitaminDropdown";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Drawer } from "vaul";
import {
  getDailyVitaminBreakdown,
  getWeeklyVitaminBreakdown,
  type VitaminBreakdownResponse,
  type VitaminDetail,
} from "@/app/vitamin-breakdown/api";

type ViewMode = "daily" | "weekly";

type VitaminRingItem = {
  id: string;
  label: string;
  percent: number;
};

function getToday(): string {
  const today = new Date();
  return today.toLocaleDateString("en-CA");
}

function getLast7Days(selectedDate: string): string[] {
  const dates: string[] = [];
  const [year, month, day] = selectedDate.split("-").map(Number);

  for (let i = 0; i < 7; i++) {
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString("en-CA"));
  }

  return dates;
}

function formatDateHeading(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

function shiftDateStr(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA");
}

function slugifyVitamin(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function vitaminDetailToRing(vitamin: VitaminDetail): VitaminRingItem {
  const ratio =
    vitamin.ratio ??
    (vitamin.goal_quantity > 0
      ? vitamin.total_quantity / vitamin.goal_quantity
      : 0);

  return {
    id: slugifyVitamin(vitamin.nutrient_name),
    label: vitamin.nutrient_name,
    percent: Math.round(Math.min(ratio, 1) * 100),
  };
}

export default function VitaminBreakdownPage() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<string>(getToday());
  const [view, setView] = useState<ViewMode>("daily");
  const [drawerVitaminId, setDrawerVitaminId] = useState<string | null>(null);
  const [vitaminData, setVitaminData] =
    useState<VitaminBreakdownResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dates = view === "daily" ? [selectedDate] : getLast7Days(selectedDate);

  const drawerVitamins = useMemo(() => {
    if (!vitaminData) {
      return [];
    }

    const seen = new Set<string>();
    const items: VitaminRingItem[] = [];

    for (const day of vitaminData.days) {
      for (const vitamin of day.vitamins) {
        const ring = vitaminDetailToRing(vitamin);
        if (seen.has(ring.id)) {
          continue;
        }
        seen.add(ring.id);
        items.push(ring);
      }
    }

    return items;
  }, [vitaminData]);

  const [snap, setSnap] = useState<number | string | null>(0.6);

  useEffect(() => {
    let cancelled = false;

    async function loadVitaminData() {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) {
          setVitaminData(null);
          setError(
            authError?.message ?? "Sign in to view your vitamin breakdown.",
          );
        }
        return;
      }

      try {
        const result =
          view === "daily"
            ? await getDailyVitaminBreakdown(user.id, selectedDate)
            : await getWeeklyVitaminBreakdown(user.id, selectedDate);

        if (!cancelled) {
          setVitaminData(result);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setVitaminData(null);
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Could not load vitamin data.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadVitaminData();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, view]);

  const handleInfoClick = (vitaminId: string) => {
    if (window.innerWidth < 1024) {
      setDrawerVitaminId(vitaminId);
      return;
    }

    router.push(`/vitamin-information?vitamin=${vitaminId}#${vitaminId}`);
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background">
      <div className="flex-1 min-w-0">
        <div className="mb-5 flex items-start gap-4 px-6 pt-10 lg:px-12 lg:pt-14">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="font-primary text-4xl leading-none text-secondary transition hover:text-accent lg:hidden"
              aria-label="Go back"
            >
              <HiChevronLeft />
            </button>
            <h1 className="font-primary text-4xl sm:text-6xl font-semibold text-secondary">
              Vitamin Breakdown
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 px-6 pb-6 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="order-2 w-full md:w-auto lg:order-1">
            <div className="w-full lg:mx-0 lg:w-fit">
              <DatePicker value={selectedDate} onChange={setSelectedDate} />
            </div>
          </div>

          <div className="order-1 flex w-fit overflow-hidden rounded-lg border border-primary lg:order-2">
            {(["daily", "weekly"] as ViewMode[]).map((viewOption) => (
              <button
                key={viewOption}
                type="button"
                onClick={() => setView(viewOption)}
                className={`cursor-pointer px-4 py-2 font-secondary text-lg font-medium lg:flex-none ${
                  view === viewOption
                    ? "bg-primary text-white"
                    : "bg-transparent text-primary"
                }`}
              >
                {viewOption === "daily" ? "Daily" : "Weekly"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 pb-6 lg:hidden">
          <button
            type="button"
            onClick={() =>
              setSelectedDate(
                shiftDateStr(selectedDate, view === "weekly" ? -7 : -1),
              )
            }
            className="flex h-10 w-10 items-center justify-center text-3xl text-accent transition hover:text-secondary"
            aria-label="Previous"
          >
            <HiChevronLeft />
          </button>
          <p className="flex-1 text-center font-primary text-2xl sm:text-[40px] font-semibold text-accent tracking-[-0.08em]">
            {view === "weekly"
              ? (() => {
                  const days = getLast7Days(selectedDate);
                  const first = new Date(`${days[days.length - 1]}T00:00:00`);
                  const last = new Date(`${days[0]}T00:00:00`);
                  const fmt = (d: Date) =>
                    d.toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "2-digit",
                    });
                  return `${fmt(first)}-${fmt(last)}`;
                })()
              : formatDateHeading(selectedDate)}
          </p>
          <button
            type="button"
            onClick={() =>
              setSelectedDate(
                shiftDateStr(selectedDate, view === "weekly" ? 7 : 1),
              )
            }
            className="flex h-10 w-10 items-center justify-center text-3xl text-accent transition hover:text-accent"
            aria-label="Next"
          >
            <HiChevronRight />
          </button>
        </div>

        {isLoading && (
          <p className="px-6 pb-4 font-secondary text-sm text-secondary lg:px-12">
            Loading vitamin data...
          </p>
        )}

        {error && (
          <p className="px-6 pb-4 font-secondary text-sm text-red-600 lg:px-12">
            {error}
          </p>
        )}

        <div className="space-y-16 px-6 pb-16 lg:px-12">
          {dates.map((date) => {
            const apiDay = vitaminData?.days?.find((day) => day.date === date);
            const vitamins =
              apiDay?.vitamins?.map(vitaminDetailToRing) ?? [];

            return (
              <section key={date}>
                <h2 className="hidden lg:block mb-8 font-primary text-4xl font-bold text-accent">
                  {formatDateHeading(date)}
                </h2>

                {!isLoading && !error && vitamins.length === 0 ? (
                  <p className="mb-4 font-secondary text-sm text-secondary">
                    No vitamins logged for this day.
                  </p>
                ) : null}

                <div className="grid grid-cols-3 gap-x-12 gap-y-8 md:grid-cols-5 xl:grid-cols-8">
                  {vitamins.map((vitamin) => (
                    <VitaminRing
                      key={vitamin.id}
                      label={vitamin.label}
                      percent={vitamin.percent}
                      onClick={() => handleInfoClick(vitamin.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <Drawer.Root
          open={!!drawerVitaminId}
          onOpenChange={(open) => !open && setDrawerVitaminId(null)}
          snapPoints={[0.6, 0.95]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
        >
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl bg-background lg:hidden h-full">
              <Drawer.Title className="sr-only">
                Vitamin Information
              </Drawer.Title>

              <div className="mx-auto mb-6 mt-4 h-1 w-10 rounded-full bg-gray-300" />
              <div className="overflow-y-auto px-6 pb-10 max-h-[90vh]">
                <h2 className="font-primary text-2xl font-semibold text-secondary mb-4">
                  What are vitamins and why are they important?
                </h2>
                <p className="font-secondary font-medium text-secondary mb-6 text-sm">
                  Vitamins are micronutrients that we need in small amounts for
                  various metabolic processes and bodily functions.
                </p>
                <div className="space-y-2">
                  {drawerVitamins.map((v) => (
                    <VitaminDropdown
                      key={v.id}
                      id={v.id}
                      title={v.label}
                      isActive={v.id === drawerVitaminId}
                    />
                  ))}
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </div>
  );
}
