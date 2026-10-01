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
        <div className="max-lg:w-full max-lg:min-h-28 max-lg:aspect-auto max-lg:rounded-xl max-lg:p-3 flex min-w-0 w-[23vw] lg:w-[11.5vw] aspect-[334/196] items-center justify-start rounded-[1.2vw] lg:rounded-[0.6vw] border border-[#0A3323] bg-[#FFFDEE] shadow-[0_0.25vw_0.25vw_0_#0A3323] lg:shadow-[0_0.125vw_0.125vw_0_#0A3323]">
            {/* Icon + text container */}
            <div className="max-lg:h-auto max-lg:w-full max-lg:flex-wrap max-lg:gap-2 flex h-[61%] w-full min-w-0 items-center gap-[7%] px-[8%]">

                {/* Icon box */}
                <div className="max-lg:h-10 max-lg:w-10 max-lg:rounded-lg max-lg:p-2 flex aspect-square h-full shrink-0 items-start justify-center rounded-[1.2vw] lg:rounded-[0.6vw] bg-[#FFE0BA] p-[9%]">
                    {/* Icon scales with the icon box */}
                    <Icon className="h-full w-full" color="#0A3323" />
                </div>

                {/* Text */}
                <div className="max-lg:break-words flex min-w-0 flex-col justify-center">
                    {/* Title */}
                    <span className="font-['Instrument_Sans'] max-lg:text-sm text-[clamp(0.7rem,2.1vw,1.85rem)] lg:text-[clamp(0.35rem,1.05vw,0.925rem)] font-medium leading-normal text-[#346B3B]">
                        {title}
                    </span>

                    {/* Content */}
                    <span className="font-['Instrument_Sans'] max-lg:text-lg text-[clamp(0.9rem,2.5vw,2.5rem)] lg:text-[clamp(0.45rem,1.25vw,1.25rem)] font-semibold leading-normal text-[#346B3B]">
                        {content}
                    </span>
                </div>
            </div>
        </div>
    );
}