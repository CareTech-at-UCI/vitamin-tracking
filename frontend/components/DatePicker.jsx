"use client";

export default function DatePicker({
  label = "Date",
  value,
  onChange,
  className = "",
  min,
  max,
  disabled = false,
}) {
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
        className="w-64 border border-secondary rounded-md p-2 bg-transparent font-secondary font-medium text-secondary"
      />
    </div>
  );
}
