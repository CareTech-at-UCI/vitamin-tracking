/* Activity Level Cards -- Displays activity levels in a row, with the selected card outlined

The props are defined as follows
    selected: the selected activity level

Though activity levels are defined numerically in the db, they are converted to strings in the page.tsx file

NOTE: currently there are 5 activity levels defined in the db but only 4 on the frontend, currently no logic to account for this
*/

import { FaCouch, FaWalking, FaRunning } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import type { IconType } from "react-icons";

type ActivityLevel = "Sedentary" | "Light" | "Moderate" | "Very Active";

type ActivityLevelCardsProps = {
    selected: ActivityLevel;
};

const activityLevels: {
    icon: IconType;
    title: ActivityLevel;
    description: string;
}[] = [
    {
        icon: FaCouch,
        title: "Sedentary",
        description: "Little to no exercise",
    },
    {
        icon: FaWalking,
        title: "Light",
        description: "1-3 days/week",
    },
    {
        icon: FaRunning,
        title: "Moderate",
        description: "3-5 days/week",
    },
    {
        icon: GiWeightLiftingUp,
        title: "Very Active",
        description: "6-7 days/week",
    },
];

export default function ActivityLevelCards({
    selected,
}: ActivityLevelCardsProps) {
    return (
        <div className="flex w-full flex-row items-center gap-[1vw]">
            {activityLevels.map(
                ({ icon: Icon, title, description }) => {
                    const isSelected = selected === title;

                    return (
                        <div
                            key={title}
                            className={`relative flex h-[18vh] w-[18vw] flex-col items-center justify-center rounded-[20px] bg-[#FFFDEE] ${
                                isSelected
                                    ? "border border-[#F16F33] shadow-[0_4px_4px_0_#F16F33]"
                                    : "border border-[#0A3323] shadow-[0_4px_4px_0_#0A3323]"
                            }`}
                        >
                            {/* Selected pill */}
                            {isSelected && (
                                <div
                                    className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F16F33] bg-[#FFFDEE] px-6 py-2 text-center font-['Montserrat_Alternates'] text-[24px] font-semibold leading-[100%] tracking-[-8%] text-[#F16F33] whitespace-nowrap"
                                >
                                    Selected
                                </div>
                            )}

                            {/* Icon */}
                            <Icon
                                className="mb-5 h-[60px] w-[60px] text-[#0A3323]"
                            />

                            {/* Text */}
                            <div className="flex flex-col items-center text-center">
                                <span
                                    className="font-['Instrument_Sans'] text-[25px] font-semibold leading-[100%] text-[#346B3B]"
                                >
                                    {title}
                                </span>

                                <span
                                    className="mt-3 font-['Instrument_Sans'] text-[20px] font-normal leading-[100%] text-[#346B3B]"
                                >
                                    {description}
                                </span>
                            </div>
                        </div>
                    );
                }
            )}
        </div>
    );
}
