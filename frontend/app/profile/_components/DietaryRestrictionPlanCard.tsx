/* Height/Weight card -- Displays dietary restrictions + plans information

The props are defined as follows
    titles: array of titles to be mapped

All styling according to figma

** NOTE: There are no dietary restriction/plan descriptions implemented in the DB to my knowledge, so only titles are rendered
    There are also no accompanying photos, so a placeholder is used here
*/
type DietaryRestrictionPlanCardProps = {
    titles: string[];
    emptyMessage?: string;
};

export default function DietaryRestrictionPlanCard({
    titles,
    emptyMessage,
}: DietaryRestrictionPlanCardProps) {
    if (titles.length === 0 && emptyMessage) {
        return (
            <div className="flex h-[171px] w-[413px] flex-row items-center gap-5 rounded-[20px] border border-dashed border-[#7FA27B] bg-[#FFFDEE] px-5 py-4">
                <div className="flex h-full w-[140px] shrink-0 items-center justify-center rounded-[12px] bg-[#E3EEDC]">
                    <span className="font-[Montserrat_Alternates] text-[40px] font-semibold text-[#5F8A58]">-</span>
                </div>
                <span className="font-[Instrument_Sans] text-[24px] font-medium leading-[100%] text-[#26612F]">
                    {emptyMessage}
                </span>
            </div>
        );
    }

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
