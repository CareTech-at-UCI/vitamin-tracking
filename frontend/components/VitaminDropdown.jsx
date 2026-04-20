"use client";

import { useState, useEffect } from "react";

export default function VitaminDropdown({ id, title, isActive = false }) {
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    setOpen(isActive);
  }, [isActive]);

  return (
    <div className="py-4">
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center cursor-pointer group"
      >
        <h3
          className={`text-4xl font-primary font-semibold transition-colors ${
            open ? "text-accent" : "text-secondary group-hover:text-accent"
          }`}
        >
          {title}
        </h3>

        <span className="text-4xl text-secondary group-hover:text-accent">
          {open ? "⌄" : "›"}
        </span>
      </div>

      {open && (
        <div className="mt-6 grid grid-cols-2 gap-12 text-secondary font-secondary">
          <div>
            <h1 className="font-bold text-xl">Functions</h1>
            <ul className="font-semibold list-disc ml-5 text-md">
              <li>Helps immune system fight disease</li>
              <li>Keeps skin healthy</li>
              <li>Supports growth</li>
              <li>Helps with vision</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="font-bold text-xl">Plant Sources</h1>
              <ul className="font-semibold list-disc ml-5 text-md">
                <li>Orange/yellow vegetables</li>
                <li>Leafy greens</li>
              </ul>
            </div>

            <div>
              <h1 className="font-bold text-xl">Animal Sources</h1>
              <ul className="font-semibold list-disc ml-5 text-md">
                <li>Liver</li>
                <li>Eggs</li>
                <li>Milk products</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
