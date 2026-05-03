interface SearchBarProps {
  height?: "medium";
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ height = "medium", value, onChange }: SearchBarProps) {
  const sizeStyles = {
    medium: "py-1.5 px-3 md:py-[1vh] md:px-[1vw] text-xs md:text-base",
  };

  return (
    <div
      className={`flex items-center rounded-[32px] border border-black w-full ${sizeStyles[height]} mb-3 md:mb-[2vh]`}
    >
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search"
            className="flex-1 outline-none bg-transparent text-[#0A3323] placeholder:text-[#0A3323]"
        />
    </div>
  );
}