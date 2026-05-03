import Link from "next/link";

interface CircularProgressBarProps {
    percentage: number;
    vitaminName: string;
}

export function CircularProgressBar({ percentage, vitaminName }: CircularProgressBarProps) {
    const size = 116;
    const strokeWidth = 14;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percentage / 100);

    return (
        <div className="flex flex-col items-center gap-2">
            <svg
                viewBox={`0 0 ${size} ${size}`}
                style={{ width: "min(116px, 28vw)", height: "min(116px, 28vw)" }}
            >
                {/* Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#B5CEB5"
                    strokeWidth={strokeWidth}
                />
                {/* Progress arc — starts at top, goes counter-clockwise */}
                <g style={{ transform: "scaleX(-1)", transformOrigin: "center", transformBox: "fill-box" }}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#0F3D2E"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </g>
                {/* Percentage label */}
                <text
                    x={size / 2}
                    y={size / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={20}
                    fontWeight={500}
                    fill="#0A3323"
                    letterSpacing="-1"
                    fontFamily="var(--font-instrument-sans)"
                >
                    {percentage}%
                </text>
            </svg>

            {/* Vitamin name + info link */}
            <div className="flex items-center gap-1">
                <span className="font-body font-medium text-[1.25rem] leading-none tracking-[-0.05em] text-[#000000]">
                    {vitaminName}
                </span>
                <Link href="/vitamin-info" className="flex items-center">
                    <img src="/info-icon.svg" alt="Vitamin info" width={16} height={16} />
                </Link>
            </div>
        </div>
    );
}
