/* Height/Weight card -- Displays dietary restrictions + plans information

The props are defined as follows
    titles: array of titles to be mapped

All styling according to figma

** NOTE: There are no dietary restriction/plan descriptions implemented in the DB to my knowledge, so only titles are rendered
    There are also no accompanying photos, so a placeholder is used here
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
