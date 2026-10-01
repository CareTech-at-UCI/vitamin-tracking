/*
Height/Weight card -- Displays the height/weight information
on the profile page.

The props are defined as follows:
    title: either "Height" or "Weight"
    imperial: the specific value for that respective field
              in imperial units
              (e.g., 5' 11" or 165.4)
    metric: the converted imperial value to the metric system

As both these fields have consistent styling, their display
has been generalized under the same type of card with
customizable props to account for the difference.

Metric conversions are implemented in page.tsx, assuming
rounding to 1 decimal place.

All styling according to Figma.
*/

import { HeightIcon } from "@/components/icons/HeightIcon";
import { WeightIcon } from "@/components/icons/WeightIcon";

type HeightWeightCardProps = {
    title: "Height" | "Weight";
    imperial: string | number;
    metric: string | number;
};

export default function HeightWeightCard({
    title,
    imperial,
    metric,
}: HeightWeightCardProps) {
    return (
        <div className="max-lg:w-full max-lg:min-h-28 max-lg:aspect-auto max-lg:rounded-xl max-lg:p-3 flex min-w-0 w-[18vw] lg:w-[12vw] aspect-[334/196] flex-col items-center justify-center rounded-[1.2vw] lg:rounded-[0.6vw] border border-[#0A3323] bg-[#FFFDEE] shadow-[0_0.25vw_0.25vw_0_#0A3323] lg:shadow-[0_0.125vw_0.125vw_0_#0A3323]">
            {/* Icon + text container */}
            <div className="max-lg:h-auto max-lg:w-full max-lg:flex-wrap max-lg:gap-2 flex h-[61%] w-[88%] min-w-0 items-center justify-center gap-[7%]">

                {/* Icon box */}
                <div className="max-lg:h-10 max-lg:w-10 max-lg:rounded-lg max-lg:p-2 flex aspect-square h-full shrink-0 items-start justify-center rounded-[1.2vw] lg:rounded-[0.6vw] bg-[#C2D8B2] p-[9%]">
                    {/* The icon fills the responsive icon box */}
                    {title === "Height" ? <HeightIcon /> :<WeightIcon />}
                </div>

                {/* Text */}
                <div className="max-lg:break-words flex min-w-0 flex-col justify-center">
                    {/* Title */}
                    <span className="whitespace-nowrap font-['Instrument_Sans'] max-lg:text-sm text-[clamp(0.7rem,2.1vw,1.875rem)] lg:text-[clamp(0.35rem,1.05vw,0.9375rem)] font-medium leading-normal text-[#346B3B]">
                        {title}
                    </span>

                    <span className="whitespace-nowrap font-['Instrument_Sans'] max-lg:text-lg text-[clamp(1rem,2.8vw,2.5rem)] lg:text-[clamp(0.5rem,1.4vw,1.25rem)] font-semibold leading-normal text-[#346B3B]">
                        {imperial}
                    </span>

                    <span className="whitespace-nowrap font-['Instrument_Sans'] max-lg:text-sm text-[clamp(0.7rem,2.1vw,1.875rem)] lg:text-[clamp(0.35rem,1.05vw,0.9375rem)] font-medium leading-normal text-[#346B3B]">
                        {metric}
                    </span>
                </div>
            </div>
        </div>
    );
}