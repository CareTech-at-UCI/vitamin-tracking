import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { SearchBar } from "./SearchBar";

export function VitaminGoals() {
    const [filter, setFilter] = useState<"all" | "low">("all");

    const buttonClass = (active: boolean) =>
        `flex items-center gap-[10px] px-6 py-2 rounded-[32px] transition
        ${active
            ? "bg-[#F16F33] text-white"
            : "border border-[#F16F33] text-[#F16F33] hover:bg-[#F16F33]/10"}`;

    return (
        <div className="flex-[832] border-2 border-[#26612F] rounded-2xl py-8 px-8">
            <h2
                className="font-semibold leading-none tracking-[-3.2px] text-[#0A3323] mb-4"
                style={{
                    fontFamily: '"Montserrat Alternates"',
                    fontSize: "40px",
                    width: "748px",
                }}
            >
                Vitamin Goals
            </h2>
            <div className="w-[701px]">
                <SearchBar height="medium" />
                <div className="flex flex-row items-center gap-4 mb-4">
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
                <ProgressBar percentage={30} vitaminName="Vitamin A" />
                <ProgressBar percentage={65} vitaminName="Vitamin C" />
                <ProgressBar percentage={90} vitaminName="Vitamin D" />
            </div>
        </div>
    );
}