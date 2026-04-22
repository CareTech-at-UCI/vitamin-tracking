"use client";

import Link from "next/link";
import { VitaminGoals, VitaminVisualization } from "@/components/dashboard";

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-[#FFFDEE] px-16 py-8 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1
                    className="font-semibold leading-none tracking-[-5.12px] text-[#0F3D2E]"
                    style={{
                        fontFamily: '"Montserrat Alternates"',
                        fontSize: "64px",
                    }}
                >
                    Dashboard
                </h1>
                <Link
                    href="/profile"
                    className="flex items-center gap-1 bg-[#26612F] text-[#FDFAE7] font-body font-medium text-[1.25rem] leading-none tracking-[-0.05em] px-6 py-2 rounded-full"
                >
                    Profile Info
                    <img src="/curly-arrow-icon.svg" alt="" width={24} height={18} />
                </Link>
            </div>

            {/* Two-box row */}
            <div className="flex flex-col md:flex-row gap-10 items-stretch">

                <div className="flex-1 flex">
                    <VitaminGoals />
                </div>

                <div className="flex-1 flex">
                    <VitaminVisualization />
                </div>

            </div>

            {/* Food Recommendations label */}
            <h2 className="text-2xl font-bold">Food Recommendations</h2>

            {/* Recent Food button — bottom right */}
            <div className="flex justify-end">
                <Link
                    href="/recent-foods"
                    className="flex items-center gap-1 bg-[#26612F] text-[#FDFAE7] font-body font-medium text-[1.25rem] leading-none tracking-[-0.05em] px-6 py-2 rounded-full"
                >
                    Recent Food
                    <img src="/curly-arrow-icon.svg" alt="" width={24} height={18} />
                </Link>
            </div>

        </main>
    );
}
