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
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
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
                {/* Progress arc */}
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
                {/* Percentage label */}
                <text
                    x={size / 2}
                    y={size / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={22}
                    fontWeight={600}
                    fill="#171717"
                >
                    {percentage}%
                </text>
            </svg>

            {/* Vitamin name + info tooltip link */}
            <div className="flex items-center gap-1">
                <span className="font-semibold text-lg">{vitaminName}</span>
                <Link href="/vitamin-info" className="text-[#171717] leading-none">ⓘ</Link>
            </div>
        </div>
    );
}
