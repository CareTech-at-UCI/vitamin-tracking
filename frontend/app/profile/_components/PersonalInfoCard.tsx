/*
Personal Info card -- Displays the information under the
"Personal Information" section (age and sex)

The props are defined as follows:
    title: either "Sex" or "Age"
    content: the value for the information (e.g., "Male", "24 yrs")

As both these fields have consistent styling, their display has
been generalized under the same type of card with customizable
props to account for the difference.

Metric conversions are implemented in page.tsx, assuming
rounding to 1 decimal place.
*/

import { FaCalendarDay } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";

type PersonalInfoCardProps = {
    title: "Sex" | "Age";
    content: string;
};

export default function PersonalInfoCard({
    title,
    content,
}: PersonalInfoCardProps) {
    // Use a different icon depending on whether the card is displaying age or sex.
    const Icon = title === "Age" ? FaCalendarDay : IoMdPerson;

    return (
        <div className="flex min-w-0 w-[23vw] aspect-[334/196] items-center justify-start rounded-[1.2vw] border border-[#0A3323] bg-[#FFFDEE] shadow-[0_0.25vw_0.25vw_0_#0A3323]">
            {/* Icon + text container */}
            <div className="flex h-[61%] w-full min-w-0 items-center gap-[7%] px-[8%]">

                {/* Icon box */}
                <div className="flex aspect-square h-full shrink-0 items-start justify-center rounded-[1.2vw] bg-[#FFE0BA] p-[9%]">
                    {/* Icon scales with the icon box */}
                    <Icon className="h-full w-full" color="#0A3323" />
                </div>

                {/* Text */}
                <div className="flex min-w-0 flex-col justify-center">
                    {/* Title */}
                    <span className="font-['Instrument_Sans'] text-[clamp(0.7rem,2.1vw,1.85rem)] font-medium leading-normal text-[#346B3B]">
                        {title}
                    </span>

                    {/* Content */}
                    <span className="font-['Instrument_Sans'] text-[clamp(0.9rem,2.5vw,2.5rem)] font-semibold leading-normal text-[#346B3B]">
                        {content}
                    </span>
                </div>
            </div>
        </div>
    );
}