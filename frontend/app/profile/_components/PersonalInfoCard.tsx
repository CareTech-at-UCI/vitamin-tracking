/* Personal Info card -- Displays the information under the "Personal Information" section (age and sex)

The props are defined as follows
    title: either "Sex" or "Age"
    content: the value for the information (e.g., "Male", "24 yrs")

As both these fields have consistent styling, their display has been generalized under the same type of card with cusotmizable props to account for the difference
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
    const Icon = title === "Age" ? FaCalendarDay : IoMdPerson;

    return (
        <div
            className={`flex h-[18vh] shrink-0 items-center justify-start rounded-[20px] border border-[#0A3323] bg-[#FFFDEE] shadow-[0_4px_4px_0_#0A3323] ${
                title === "Sex" ? "w-[23vw]" : "w-[18vw]"
            }`}
        >
            {/* Icon + text */}
            <div className="flex h-[61%] w-full items-center gap-[7%] px-[8%]">

                {/* Icon box */}
                <div
                    className="flex aspect-square h-full shrink-0 items-start justify-center rounded-[20px] bg-[#FFE0BA] p-[9%]"
                >
                    <Icon
                        className="h-full w-full"
                        color="#0A3323"
                    />
                </div>

                {/* Text */}
                <div className="flex min-w-0 flex-col justify-center">
                    <span className="font-['Instrument_Sans'] text-[clamp(1rem,2.1vw,1.875rem)] font-medium leading-normal text-[#346B3B]">
                        {title}
                    </span>

                    <span className="font-['Instrument_Sans'] text-[clamp(1.5rem,2.8vw,2.5rem)] font-semibold leading-normal text-[#346B3B]">
                        {content}
                    </span>
                </div>
            </div>
        </div>
    );
}
