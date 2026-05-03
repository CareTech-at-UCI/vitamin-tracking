interface ProgressBarProps {
  percentage: number;
  vitaminName: string;
}

export function ProgressBar({ percentage, vitaminName }: ProgressBarProps) {
  return (
    <div className="flex flex-col gap-2 mb-[1vh]">
      
        <div className="flex items-center gap-1">
            <span className="font-body font-medium text-[13.88px] md:text-[1.25rem] leading-none tracking-[-0.05em] text-[#000000]">
                {vitaminName}
            </span>
        </div>

        <div className="flex items-center gap-4">

        <div
            className="relative flex items-start border-2 border-[#26612F] rounded-[16px] overflow-hidden w-full h-5 md:h-7"
        >
            <div
                className="rounded-[16px] bg-[#26612F] h-full"
                style={{
                width: `${percentage}%`,
                maxWidth: "100%",
                }}
            />

            {/* Mobile: percentage inside bar */}
            <span className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#FFFDEE] text-xs font-normal md:hidden">
                {percentage}%
            </span>
        </div>

        <div className="hidden md:flex items-baseline gap-0.5 min-w-[70px] justify-end">
            <span
                className="text-black"
                style={{
                    fontFamily: '"Instrument Sans"',
                    fontSize: "20px",
                    fontWeight: 500,
                    letterSpacing: "-1px",
                }}
            >
                {percentage}
            </span>
            <span
                className="text-black"
                style={{
                fontFamily: '"Instrument Sans"',
                fontSize: "20px",
                fontWeight: 500,
                }}
            >
                %
            </span>
        </div>

        </div>
    </div>
  );
}