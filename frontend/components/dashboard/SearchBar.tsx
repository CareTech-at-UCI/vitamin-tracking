interface SearchBarProps {
  height?: "medium";
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ height = "medium", value, onChange }: SearchBarProps) {
  const sizeStyles = {
    medium: "py-[1vh] px-[1vw] text-base",
  };

  return (
    <div
      className={`flex items-center rounded-[32px] border border-black w-full ${sizeStyles[height]} mb-[2vh]`}
    >
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search"
            className="flex-1 outline-none bg-transparent text-black placeholder:text-black"
        />
    </div>
  );
}