/* Height/Weight card -- Displays the height/weight information on the profile page

The props are defined as follows
    title: either "Height" or "Weight"
    imperial: the specific value for that respective field in imperial units (e.g., 5' 11" or 165.4 for height & weight respectively)
    metric: the converted imperial value to the metric system for display

As both these fields have consistent styling, their display has been generalized under the same type of card with cusotmizable props to account for the difference
Metric conversions are implemented in page.tsx, assuming rounding to 1 decimal place

All styling according to figma
*/

import { HeightWeightIcon } from "@/components/icons/HeightWeightIcon";
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
        <div
            className="flex min-w-0 w-[18vw] aspect-[334/196] flex-col items-center justify-center rounded-[20px] border border-[#0A3323] bg-[#FFFDEE] shadow-[0_4px_4px_0_#0A3323]"
        >
            {/* Icon + text */}
            <div className="flex h-[61%] w-[88%] items-center justify-center gap-[7%]">

                {/* Icon box */}
                <div
                    className="flex aspect-square h-full items-start justify-center rounded-[20px] bg-[#C2D8B2] p-[9%]"
                >
                    <HeightWeightIcon/>
                </div>

                {/* Text */}
                <div className="flex min-w-0 flex-col justify-center">
                    <span className="font-['Instrument_Sans'] text-[clamp(1rem,2.1vw,1.875rem)] font-medium leading-normal text-[#346B3B]">
                        {title}
                    </span>

                    <span className="font-['Instrument_Sans'] text-[clamp(1.5rem,2.8vw,2.5rem)] font-semibold leading-normal text-[#346B3B]">
                        {imperial}
                    </span>

                    <span className="font-['Instrument_Sans'] text-[clamp(1rem,2.1vw,1.875rem)] font-medium leading-normal text-[#346B3B]">
                        {metric}
                    </span>
                </div>
            </div>
        </div>
    );
}
