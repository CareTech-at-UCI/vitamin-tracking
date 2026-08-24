/* Height/Weight card -- Displays the height/weight information on the profile page

The props are defined as follows
    title: either "Height" or "Weight"
    imperial: the specific value for that respective field in imperial units (e.g., 5' 11" or 165.4 for height & weight respectively)

As both these fields have consistent styling, their display has been generalized under the same type of card with cusotmizable props to account for the difference
*/
type DietaryRestrictionPlanCardProps = {
    titles: string[];
};

export default function DietaryRestrictionPlanCard({
    titles,
}: DietaryRestrictionPlanCardProps) {
    return (
        <div className="flex w-full flex-row flex-wrap gap-6">
            {titles.map((title, index) => (
                <div
                    key={`${title}-${index}`}
                    className="flex h-[171px] w-[413px] flex-row items-center gap-5 rounded-[20px] border border-[#0A3323] bg-[#FFFDEE] px-5 py-4 shadow-[0_4px_4px_0_#0A3323]"
                >
                    {/* Image placeholder */}
                    <div className="h-full w-[140px] shrink-0 rounded-[12px] bg-[#D9D9D9]" />

                    {/* Title */}
                    <span className="font-[Instrument_Sans] text-[24px] font-medium leading-[100%] text-[#26612F]">
                        {title}
                    </span>
                </div>
            ))}
        </div>
    );
}
