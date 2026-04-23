"use client";

import { useRef, useState } from "react";
import { CircularProgressBar } from "./CircularProgressBar";

const vitamins = [
    { name: "Vitamin A", percentage: 28 },
    { name: "Vitamin B12", percentage: 54 },
    { name: "Vitamin C", percentage: 65 },
    { name: "Vitamin D", percentage: 90 },
    { name: "Vitamin E", percentage: 42 },
];

export function VitaminVisualization() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);

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
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar w-full"
            >
                {vitamins.map((v) => (
                    <div key={v.name} className="snap-center shrink-0 w-full flex justify-center">
                        <CircularProgressBar percentage={v.percentage} vitaminName={v.name} />
                    </div>
                ))}
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2">
                {vitamins.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-[#26612F]" : "bg-[#B5CEB5]"}`}
                        aria-label={`Go to vitamin ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
