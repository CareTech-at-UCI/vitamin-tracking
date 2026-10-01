"use client";

import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { Info } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useDashboardWeekVitamins } from "@/lib/dashboard-week-vitamins";

const fallbackColors = ["#77A86E", "#D97961", "#58A0A0", "#B88742", "#7B6DA5"];
const sampleVitamins = [
    { id: "vitamin-e", name: "Vitamin E", percentage: 35 },
    { id: "vitamin-b9", name: "Vitamin B9", percentage: 18 },
    { id: "vitamin-d", name: "Vitamin D", percentage: 25 },
    { id: "vitamin-b12", name: "Vitamin B12", percentage: 14 },
    { id: "fatty-acid", name: "Fatty Acid", percentage: 8 },
];

function subscribeToLocation(onChange: () => void) {
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
}

function getSamplePreviewSnapshot(): boolean {
    return process.env.NODE_ENV === "development" &&
        new URLSearchParams(window.location.search).get("sample") === "1";
}

function getServerSamplePreviewSnapshot(): boolean {
    return false;
}

function getNutrientColor(name: string, index: number): string {
    const normalizedName = name.toLowerCase();

    if (/vitamin\s*e\b/.test(normalizedName)) return "#EC945B";
    if (/vitamin\s*b9\b|folate|folic acid/.test(normalizedName)) return "#925CC0";
    if (/vitamin\s*d\b/.test(normalizedName)) return "#4E7FA0";
    if (/vitamin\s*b12\b/.test(normalizedName)) return "#CDA51F";
    if (/fatty acid/.test(normalizedName)) return "#51463E";

    return fallbackColors[index % fallbackColors.length];
}

function getSlicePath(startAngle: number, endAngle: number): string {
    const centerX = 125;
    const centerY = 97;
    const radius = 70;
    const startRadians = (startAngle * Math.PI) / 180;
    const endRadians = (endAngle * Math.PI) / 180;
    const startX = centerX + radius * Math.cos(startRadians);
    const startY = centerY + radius * Math.sin(startRadians);
    const endX = centerX + radius * Math.cos(endRadians);
    const endY = centerY + radius * Math.sin(endRadians);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    if (endAngle - startAngle >= 359.999) {
        return "";
    }

    return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
}

export function VitaminVisualization({ onToggle }: { onToggle?: () => void }) {
    const { vitamins, isLoading, error } = useDashboardWeekVitamins();
    const isSamplePreview = useSyncExternalStore(
        subscribeToLocation,
        getSamplePreviewSnapshot,
        getServerSamplePreviewSnapshot,
    );
    const chartSource = isSamplePreview ? sampleVitamins : vitamins;
    const chartVitamins = chartSource.filter(
        (vitamin) => Number.isFinite(vitamin.percentage) && vitamin.percentage > 0,
    );
    const totalProgress = chartVitamins.reduce(
        (total, vitamin) => total + vitamin.percentage,
        0,
    );
    const slices = chartVitamins.map((vitamin, index) => {
        const share = (vitamin.percentage / totalProgress) * 100;
        const previousProgress = chartVitamins
            .slice(0, index)
            .reduce((total, previous) => total + previous.percentage, 0);
        const startAngle = -90 + (previousProgress / totalProgress) * 360;
        const endAngle = startAngle + (share / 100) * 360;

        return {
            ...vitamin,
            share,
            startAngle,
            endAngle,
            color: getNutrientColor(vitamin.name, index),
        };
    });

    return (
        <div className="flex min-h-[440px] w-full flex-col items-center gap-4 rounded-2xl border-2 border-[#26612F] bg-[#FFFDEE] px-5 py-7 shadow-[0_6px_0_rgba(38,97,47,0.18)] md:px-7">
            <div className="relative flex items-center justify-center gap-2">
                <h2 className="whitespace-nowrap font-display text-center text-lg font-semibold leading-tight text-[#0A3323] md:text-xl">
                    Vitamin Visualization
                </h2>
                <div className="group relative shrink-0">
                    <button
                        type="button"
                        aria-label="About vitamin proportions"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[#0A3323] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#26612F]"
                    >
                        <Info size={22} strokeWidth={2.2} aria-hidden="true" />
                    </button>
                    <div className="pointer-events-none absolute right-0 top-full z-10 mt-3 hidden w-[min(290px,78vw)] rounded-[24px] bg-[#B5CE9F] p-4 text-left text-sm leading-snug text-[#0A3323] shadow-md group-hover:block group-focus-within:block md:text-base">
                        Shows each nutrient&apos;s share of your combined weekly goal progress, so you can compare which goals received more or less progress.
                        <span className="absolute -top-2 right-2 h-4 w-4 rotate-45 bg-[#B5CE9F]" />
                    </div>
                </div>
            </div>

            {isSamplePreview && (
                <p className="-mt-3 text-xs text-[#0A3323]/70">Sample data preview</p>
            )}

            {!isSamplePreview && isLoading ? (
                <div className="flex min-h-[210px] w-full items-center justify-center text-center text-sm text-[#0A3323]/70">
                    Loading vitamin data...
                </div>
            ) : !isSamplePreview && error ? (
                <div className="flex min-h-[210px] w-full items-center justify-center text-center text-sm text-[#0A3323]/70">
                    {error}
                </div>
            ) : slices.length > 0 ? (
                <>
                    <svg
                        viewBox="0 0 250 205"
                        className="h-[205px] w-full max-w-[270px]"
                        role="img"
                        aria-label={`Relative share of weekly goal progress: ${slices.map((slice) => `${slice.name} ${Math.round(slice.share)}%`).join(", ")}`}
                    >
                        {slices.map((slice) => {
                            const middleAngle = (slice.startAngle + slice.endAngle) / 2;
                            const middleRadians = (middleAngle * Math.PI) / 180;
                            const isSmallSlice = slice.share < 10;
                            const labelRadius = isSmallSlice ? 97 : 45;
                            const labelX = 125 + labelRadius * Math.cos(middleRadians);
                            const labelY = 97 + labelRadius * Math.sin(middleRadians);
                            const lineStartX = 125 + 70 * Math.cos(middleRadians);
                            const lineStartY = 97 + 70 * Math.sin(middleRadians);
                            const lineEndX = 125 + 87 * Math.cos(middleRadians);
                            const lineEndY = 97 + 87 * Math.sin(middleRadians);
                            const textAnchor = Math.cos(middleRadians) < 0 ? "end" : "start";

                            return (
                                <g key={slice.id}>
                                    {slice.share >= 99.999 ? (
                                        <circle cx="125" cy="97" r="70" fill={slice.color} />
                                    ) : (
                                        <path d={getSlicePath(slice.startAngle, slice.endAngle)} fill={slice.color} />
                                    )}
                                    {isSmallSlice && (
                                        <line
                                            x1={lineStartX}
                                            y1={lineStartY}
                                            x2={lineEndX}
                                            y2={lineEndY}
                                            stroke="#77A86E"
                                            strokeWidth="1.5"
                                        />
                                    )}
                                    <text
                                        x={labelX}
                                        y={labelY}
                                        dominantBaseline="middle"
                                        textAnchor={isSmallSlice ? textAnchor : "middle"}
                                        fontSize="14"
                                        fontWeight="600"
                                        fill={isSmallSlice ? "#77A86E" : "#0A3323"}
                                    >
                                        {Math.round(slice.share)}%
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    <div className="h-px w-full max-w-[360px] bg-[#F3E6C8]" />

                    <ul className="grid w-full max-w-[390px] grid-cols-2 gap-x-3 gap-y-2 text-sm text-[#0A3323] md:text-base">
                        {slices.map((slice, index) => (
                            <li
                                key={slice.id}
                                className={`flex min-w-0 items-center justify-center gap-2 ${slices.length % 2 === 1 && index === slices.length - 1 ? "col-span-2" : ""}`}
                            >
                                <span
                                    className="h-3 w-3 shrink-0 rounded-[4px]"
                                    style={{ backgroundColor: slice.color }}
                                    aria-hidden="true"
                                />
                                <span className="truncate">{slice.name}</span>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <div className="flex min-h-[210px] w-full items-center justify-center text-center text-sm text-[#0A3323]/70">
                    No vitamin data available.
                </div>
            )}

            <div className="mt-auto flex w-full items-center justify-between gap-3 pt-1 text-sm text-[#0A3323]">
                {onToggle ? (
                    <button
                        onClick={onToggle}
                        className="flex items-center gap-1 font-medium md:hidden"
                    >
                        View goals
                        <Image src="/curly-arrow-icon.svg" alt="" width={20} height={15} />
                    </button>
                ) : <span className="md:hidden" />}
                <Link href={ROUTES.VITAMIN_BREAKDOWN} className="ml-auto hover:underline">
                    View more details
                </Link>
            </div>
        </div>
    );
}
