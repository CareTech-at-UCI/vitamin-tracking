import { useState } from "react";

interface SearchBarProps {
  height?: "small" | "medium" | "large";
}

export function SearchBar({ height = "medium" }: SearchBarProps) {
  const [value, setValue] = useState("");

  const sizeStyles = {
    small: "py-2 px-4 text-sm",
    medium: "py-[10px] px-[16px] text-base",
    large: "py-4 px-5 text-lg",
  };

  return (
    <div
      className={`flex items-center gap-[10px] rounded-[32px] border border-black w-full ${sizeStyles[height]} mb-4`}
    >
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search"
            className="flex-1 outline-none bg-transparent text-black placeholder:text-black"
        />
    </div>
  );
}