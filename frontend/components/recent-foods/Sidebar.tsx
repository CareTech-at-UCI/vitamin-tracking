"use client";

export default function Sidebar(): JSX.Element {
  return (
    <div className="w-32 bg-primary flex items-start justify-center py-6">
    <img
        src="/logo.svg"
        alt="Logo"
        className="w-auto h-20"
      />
    </div>
  );
}