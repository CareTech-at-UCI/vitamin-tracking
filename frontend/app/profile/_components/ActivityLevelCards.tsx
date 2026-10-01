/*
Activity Level Cards -- Displays activity levels in a row,
with the selected card outlined.

The props are defined as follows:
    selected: the selected activity level

Though activity levels are defined numerically in the DB,
they are converted to strings in the page.tsx file.

All styling according to Figma.

NOTE:
Currently there are 5 activity levels defined in the DB but
only 4 on the frontend. There is currently no logic to
account for this.
*/

import {
    FaCouch,
    FaWalking,
    FaRunning,
} from "react-icons/fa";

import { GiWeightLiftingUp } from "react-icons/gi";
import type { IconType } from "react-icons";

type ActivityLevel =
    | "Sedentary"
    | "Light"
    | "Moderate"
    | "Very Active";

type ActivityLevelCardsProps = {
    selected: ActivityLevel;
};

// Activity level information used to generate each card.
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
        /* Cards and spacing scale with the viewport. */
        <div className="grid w-full grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 lg:flex lg:flex-wrap lg:gap-[0.5vw]">
            {activityLevels.map(
                ({ icon: Icon, title, description }) => {
                    const isSelected = selected === title;

                    return (
                        <div key={title} className={`max-lg:w-full max-lg:min-h-32 max-lg:aspect-auto max-lg:rounded-xl max-lg:px-2 max-lg:py-5 relative flex min-w-0 w-[18vw] lg:w-[9vw] aspect-[334/196] flex-col items-center justify-center rounded-[1.2vw] lg:rounded-[0.6vw] bg-[#FFFDEE] ${isSelected ? "border border-[#F16F33] shadow-[0_0.25vw_0.25vw_0_#F16F33] lg:shadow-[0_0.125vw_0.125vw_0_#F16F33]" : "border border-[#0A3323] shadow-[0_0.25vw_0.25vw_0_#0A3323] lg:shadow-[0_0.125vw_0.125vw_0_#0A3323]"}`}>
                            {/* Selected pill */}
                            {isSelected && (
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[#F16F33] bg-[#FFFDEE] px-[1.5vw] lg:px-[0.75vw] py-[0.5vw] lg:py-[0.25vw] text-center font-['Montserrat_Alternates'] max-lg:text-xs max-lg:px-3 max-lg:py-1 text-[clamp(0.6rem,1.5vw,1.5rem)] lg:text-[clamp(0.3rem,0.75vw,0.75rem)] font-semibold leading-none text-[#F16F33]">
                                    Selected
                                </div>
                            )}

                            {/* Icon -- scales with the viewport while maxing out at 60px */}
                            <Icon className="max-lg:mb-3 max-lg:h-8 max-lg:w-8 mb-[1vw] lg:mb-[0.5vw] h-[3.5vw] lg:h-[1.75vw] w-[3.5vw] lg:w-[1.75vw] max-h-[60px] lg:max-h-[30px] max-w-[60px] lg:max-w-[30px] text-[#0A3323]" />

                            {/* Text */}
                            <div className="flex min-w-0 flex-col items-center text-center">
                                {/* Activity level title */}
                                <span className="font-['Instrument_Sans'] max-lg:text-sm text-[clamp(0.7rem,1.6vw,1.5625rem)] lg:text-[clamp(0.35rem,0.8vw,0.78125rem)] font-semibold leading-none text-[#346B3B]">
                                    {title}
                                </span>

                                {/* Activity level description */}
                                <span className="mt-[0.75vw] lg:mt-[0.375vw] pb-[0.25rem] lg:pb-[0.125rem] font-['Instrument_Sans'] max-lg:mt-2 max-lg:text-xs max-lg:leading-normal text-[clamp(0.55rem,1.25vw,1.25rem)] lg:text-[clamp(0.275rem,0.625vw,0.625rem)] font-normal leading-none text-[#346B3B]">
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