"use client";

import { useState, useEffect, JSX } from "react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";

type VitaminDropdownProps = { 
  id: string; 
  title: string; 
  isActive?: boolean; 
};

export default function VitaminDropdown({ id, title, isActive = false }: VitaminDropdownProps): JSX.Element {
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
        <h3 className={`text-4xl font-primary font-semibold ${
          isActive ? "text-[#F16F33]" : "text-[#000000]"
        }`}>
          {title}
        </h3>

        <span className={`text-4xl ${
          isActive ? "text-[#F16F33]" : "text-secondary group-hover:text-accent"
        }`}>
          {open ? <HiChevronDown /> : <HiChevronRight />}
        </span>
      </div>

      {open && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-secondary font-secondary">
          <div>
            <h1 className="font-bold text-xl">Functions</h1>
            <ul className="font-medium list-disc ml-5 text-md">
              <li>Helps immune system fight disease</li>
              <li>Keeps skin healthy</li>
              <li>Supports growth</li>
              <li>Helps with vision</li>
            </ul>
          </div>

          <div className="sm:block hidden space-y-4">
            <div>
              <h1 className="font-bold text-xl">Plant Sources</h1>
              <ul className="font-medium list-disc ml-5 text-md">
                <li>Orange/yellow vegetables</li>
                <li>Leafy greens</li>
              </ul>
            </div>

            <div>
              <h1 className="font-bold text-xl">Animal Sources</h1>
              <ul className="font-medium list-disc ml-5 text-md">
                <li>Liver</li>
                <li>Eggs</li>
                <li>Milk products</li>
              </ul>
            </div>
          </div>

          <div className="sm:hidden block">
              <h1 className="font-bold text-xl">Plant Sources</h1>
              <ul className="font-medium list-disc ml-5 text-md">
                <li>Orange/yellow vegetables</li>
                <li>Leafy greens</li>
              </ul>
            </div>

            <div className="sm:hidden block">
              <h1 className="font-bold text-xl">Animal Sources</h1>
              <ul className="font-medium list-disc ml-5 text-md">
                <li>Liver</li>
                <li>Eggs</li>
                <li>Milk products</li>
              </ul>
            </div>
        </div>
      )}
    </div>
  );
}
