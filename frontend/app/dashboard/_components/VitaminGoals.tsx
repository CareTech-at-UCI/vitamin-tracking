"use client";

import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { SearchBar } from "./SearchBar";
import { useDashboardWeekVitamins } from "@/lib/dashboard-week-vitamins";

export function VitaminGoals({ onToggle }: { onToggle?: () => void }) {
    const [filter, setFilter] = useState<"all" | "low">("all");
    const [search, setSearch] = useState("");
    const { vitamins, isLoading, error } = useDashboardWeekVitamins();

    const filteredVitamins = vitamins.filter((v) => {
        const matchesSearch = v.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesFilter =
            filter === "all" ? true : v.percentage < 30;

        return matchesSearch && matchesFilter;
    });

    const buttonClass = (active: boolean) =>
        `flex items-center gap-[10px] text-sm md:text-base px-3 md:px-[1.5vw] py-1.5 md:py-[0.5vh] rounded-[32px] transition
        ${
            active
                ? "bg-[#F16F33] text-white"
                : "border border-[#F16F33] text-[#F16F33] hover:bg-[#F16F33]/10"
        }`;

    return (
        <div className="w-full border-2 border-[#26612F] rounded-2xl py-4 md:py-[1.5vw] px-6 md:px-8">
            <h2
                className="font-display text-2xl md:text-2xl lg:text-[40px] font-semibold leading-none tracking-[-0.08em] text-[#0A3323] mb-4 w-full"
            >
                Weekly Vitamin Goals
            </h2>

            <div className="w-full">
                <SearchBar
                    height="medium"
                    value={search}
                    onChange={setSearch}
                />

                <div className="flex flex-row items-center gap-2 md:gap-[1vw] mb-3 md:mb-[1vw]">
                    <button
                        onClick={() => setFilter("all")}
                        className={buttonClass(filter === "all")}
                    >
                        All Vitamins
                    </button>

                    <button
                        onClick={() => setFilter("low")}
                        className={buttonClass(filter === "low")}
                    >
                        Low Level
                    </button>
                </div>
                <div className="max-h-[27vh] overflow-y-auto pr-2">
                    {isLoading ? (
                        <p className="text-sm text-[#0A3323]/70">Loading vitamin data...</p>
                    ) : error ? (
                        <p className="text-sm text-[#0A3323]/70">{error}</p>
                    ) : filteredVitamins.length > 0 ? (
                        filteredVitamins.map((v) => (
                            <ProgressBar
                                key={v.id}
                                percentage={v.percentage}
                                vitaminName={v.name}
                                vitaminId={v.id}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-[#0A3323]/70">No vitamins match the current filters.</p>
                    )}
                </div>

                {onToggle && (
                    <div className="flex justify-end md:hidden mt-2">
                        <button onClick={onToggle} className="flex items-center gap-1 text-[#0A3323] font-body font-medium text-base tracking-[-0.05em]">
                            View more details
                            <img src="/curly-arrow-icon.svg" alt="" width={20} height={15} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}