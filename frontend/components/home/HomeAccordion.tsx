"use client";

import { useState } from "react";
import { homeInfoCards } from "./home-info-cards";

export function HomeAccordion() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (title: string) => {
    setExpandedCard((current) => (current === title ? null : title));
  };

  return (
    <div className="mt-6 border-t border-secondary">
      {homeInfoCards.map((card) => {
        const isExpanded = expandedCard === card.title;

        return (
          <div key={card.title} className="border-b border-secondary">
            <button
              type="button"
              onClick={() => toggleCard(card.title)}
              aria-expanded={isExpanded}
              className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
            >
              <span className="font-display text-xl font-medium leading-tight text-secondary">
                {card.title}
              </span>
              <span
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#B1CC9F] text-2xl font-semibold leading-none text-secondary transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{ transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)" }}
                aria-hidden
              >
                +
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="pb-4 font-body text-sm leading-relaxed text-secondary/90">
                  {card.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
