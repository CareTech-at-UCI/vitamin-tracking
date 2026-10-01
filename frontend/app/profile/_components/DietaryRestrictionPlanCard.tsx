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
            <div className="max-lg:w-full max-lg:max-w-sm max-lg:h-auto max-lg:min-h-28 max-lg:gap-3 max-lg:p-3 flex h-[171px] lg:h-[85.5px] w-[413px] lg:w-[206.5px] flex-row items-center gap-5 lg:gap-2.5 rounded-[20px] lg:rounded-[10px] border border-dashed border-[#7FA27B] bg-[#FFFDEE] px-5 lg:px-2.5 py-4 lg:py-2">
                <div className="flex max-lg:h-16 max-lg:w-16 h-full w-[140px] lg:w-[70px] shrink-0 items-center justify-center rounded-[12px] lg:rounded-[6px] bg-[#E3EEDC]">
                    <span className="font-[Montserrat_Alternates] text-[40px] lg:text-[20px] font-semibold text-[#5F8A58]">-</span>
                </div>
                <span className="font-[Instrument_Sans] max-lg:min-w-0 max-lg:break-words max-lg:text-base max-lg:leading-normal text-[24px] lg:text-[12px] font-medium leading-[100%] text-[#26612F]">
                    {emptyMessage}
                </span>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-row flex-wrap gap-6 lg:gap-3">
            {titles.map((title, index) => (
                <div
                    key={`${title}-${index}`}
                    className="max-lg:w-full max-lg:max-w-sm max-lg:h-auto max-lg:min-h-28 max-lg:gap-3 max-lg:p-3 flex h-[171px] lg:h-[85.5px] w-[413px] lg:w-[206.5px] flex-row items-center gap-5 lg:gap-2.5 rounded-[20px] lg:rounded-[10px] border border-[#0A3323] bg-[#FFFDEE] px-5 lg:px-2.5 py-4 lg:py-2 shadow-[0_4px_4px_0_#0A3323] lg:shadow-[0_2px_2px_0_#0A3323]"
                >
                    {/* Image placeholder */}
                    <div className="max-lg:h-16 max-lg:w-16 h-full w-[140px] lg:w-[70px] shrink-0 rounded-[12px] lg:rounded-[6px] bg-[#D9D9D9]" />

                    {/* Title */}
                    <span className="font-[Instrument_Sans] max-lg:min-w-0 max-lg:break-words max-lg:text-base max-lg:leading-normal text-[24px] lg:text-[12px] font-medium leading-[100%] text-[#26612F]">
                        {title}
                    </span>
                </div>
            ))}
        </div>
    );
}
