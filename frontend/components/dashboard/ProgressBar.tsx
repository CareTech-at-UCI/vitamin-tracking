interface ProgressBarProps {
  percentage: number;
  vitaminName: string;
}

export function ProgressBar({ percentage, vitaminName }: ProgressBarProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      
        <div className="flex items-center gap-1">
            <span className="font-body font-medium text-[1.25rem] leading-none tracking-[-0.05em] text-[#0A3323]">
                {vitaminName}
            </span>
        </div>

        <div className="flex items-center gap-4">
        <div
            className="flex items-start border-2 border-[#26612F] rounded-[16px] overflow-hidden w-full h-7"
        >
            <div
                className="rounded-[16px] bg-[#26612F] h-full"
                style={{
                width: `${percentage}%`,
                maxWidth: "100%",
                }}
            />
        </div>
        <div className="flex items-baseline gap-1 min-w-[70px] justify-end">
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
                fontFamily: "Inter",
                fontSize: "24px",
                fontWeight: 400,
                }}
            >
                %
            </span>
        </div>
        </div>
    </div>
  );
}