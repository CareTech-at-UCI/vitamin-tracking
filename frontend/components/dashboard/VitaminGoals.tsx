import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { SearchBar } from "./SearchBar";

export function VitaminGoals({ onToggle }: { onToggle?: () => void }) {
    const [filter, setFilter] = useState<"all" | "low">("all");
    const [search, setSearch] = useState("");

    const vitamins = [
        { name: "Vitamin A", percentage: 30 },
        { name: "Vitamin C", percentage: 65 },
        { name: "Vitamin D", percentage: 90 },
        { name: "Vitamin Scroll", percentage: 10 },
    ];

    const filteredVitamins = vitamins.filter((v) => {
        const matchesSearch = v.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesFilter =
            filter === "all" ? true : v.percentage < 50;

        return matchesSearch && matchesFilter;
    });

    const buttonClass = (active: boolean) =>
        `flex items-center gap-[10px] px-[1.5vw] py-[0.5vh] rounded-[32px] transition
        ${
            active
                ? "bg-[#F16F33] text-white"
                : "border border-[#F16F33] text-[#F16F33] hover:bg-[#F16F33]/10"
        }`;

    return (
        <div className="w-full border-2 border-[#26612F] rounded-2xl py-[1.5vw] px-8">
            <h2
                className="font-semibold leading-none tracking-[-3.2px] text-[#0A3323] mb-4 w-full"
                style={{
                    fontFamily: '"Montserrat Alternates"',
                    fontSize: "40px",
                }}
            >
                Vitamin Goals
            </h2>

            <div className="w-full">
                <SearchBar
                    height="medium"
                    value={search}
                    onChange={setSearch}
                />

                <div className="flex flex-row items-center gap-[1vw] mb-[1vw]">
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
                    {filteredVitamins.map((v) => (
                        <ProgressBar
                            key={v.name}
                            percentage={v.percentage}
                            vitaminName={v.name}
                        />
                    ))}
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