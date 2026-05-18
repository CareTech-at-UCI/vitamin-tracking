"use client";

import { JSX } from "react";

type DatePickerProps = { 
  label?: string; 
  value: string;
  onChange: (date: string) => void; 
  className?: string; 
  min?: string; 
  max?: string;
  disabled?: boolean; 
};

export default function DatePicker({
  label = "Date",
  value,
  onChange,
  className = "",
  min,
  max,
  disabled = false,
}: DatePickerProps): JSX.Element {
  return (
    <div className={`relative ${className}`}>
      <label className="absolute -top-2 left-3 bg-background px-1 text-xs font-secondary font-medium text-secondary">
        {label}
      </label>

      <input
        type="date"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-secondary rounded-md p-2 bg-transparent font-secondary font-medium text-secondary"
      />
    </div>
  );
}
