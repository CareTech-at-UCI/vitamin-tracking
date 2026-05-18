"use client";

import { useRef, useState } from "react";
import { CircularProgressBar } from "./CircularProgressBar";
import { useDashboardWeekVitamins } from "@/lib/dashboard-week-vitamins";

export function VitaminVisualization({ onToggle }: { onToggle?: () => void }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const { vitamins, isLoading, error } = useDashboardWeekVitamins();
    const activeIndex = Math.min(index, Math.max(vitamins.length - 1, 0));

    const goTo = (i: number) => {
        const width = scrollRef.current?.offsetWidth ?? 0;
        scrollRef.current?.scrollTo({ left: i * width, behavior: "smooth" });
        setIndex(i);
    };

    const onScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const i = Math.round(el.scrollLeft / el.offsetWidth);
        setIndex(i);
    };

    return (
        <div className="w-full border-2 border-[#26612F] rounded-2xl py-8 px-8 flex flex-col items-center justify-center gap-6">
            <h2 className="font-display text-xl md:text-2xl lg:text-[2.5rem] font-semibold leading-none tracking-[-0.08em] text-[#0A3323] text-center">
                Vitamin Visualization
            </h2>

            <div
                ref={scrollRef}
                onScroll={onScroll}
                className="flex overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory no-scrollbar w-full"
            >
                {isLoading ? (
                    <div className="w-full py-10 text-center text-sm text-[#0A3323]/70">Loading vitamin data...</div>
                ) : error ? (
                    <div className="w-full py-10 text-center text-sm text-[#0A3323]/70">{error}</div>
                ) : vitamins.length > 0 ? (
                    vitamins.map((v) => (
                        <div key={v.id} className="snap-center shrink-0 w-full flex justify-center">
                            <CircularProgressBar
                                percentage={v.percentage}
                                vitaminName={v.name}
                                vitaminId={v.id}
                            />
                        </div>
                    ))
                ) : (
                    <div className="w-full py-10 text-center text-sm text-[#0A3323]/70">No vitamin data available.</div>
                )}
            </div>

            {/* Dot indicators */}
            {!isLoading && !error && vitamins.length > 0 && (
                <div className="flex gap-2">
                    {vitamins.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? "bg-[#26612F]" : "bg-[#B5CEB5]"}`}
                            aria-label={`Go to vitamin ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {onToggle && (
                <div className="w-full flex justify-end md:hidden">
                    <button onClick={onToggle} className="flex items-center gap-1 text-[#0A3323] font-body font-medium text-base tracking-[-0.05em]">
                        View goals
                        <img src="/curly-arrow-icon.svg" alt="" width={20} height={15} />
                    </button>
                </div>
            )}
        </div>
    );
}
