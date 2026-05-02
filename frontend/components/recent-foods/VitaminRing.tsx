"use client";

type VitaminRingProps = { 
  label?: string; 
  percent?: number; 
  onClick?: () => void; 
};

export default function VitaminRing({
  label = "Vitamin A",
  percent = 0,
  onClick,
}: VitaminRingProps): JSX.Element {
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 ">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-180 text-secondary"
                  >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#A9C9A4" 
            strokeWidth={strokeWidth}
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-md font-secondary font-medium text-secondary">
            {percent}%
          </span>
        </div>
      </div>

      {/* Label + info */}
      <div className="flex items-center gap-1 text-secondary">
        <span className="text-md font-secondary font-medium">{label}</span>
        <button
          onClick={onClick}
          className="text-xl font-secondary text-secondary hover:text-accent transition-colors cursor-pointer"
        >
          &#9432;
        </button>
      </div>
    </div>
  );
}