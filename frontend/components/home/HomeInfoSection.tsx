"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const infoCards = [
  {
    title: "Benefits",
    body: `Using the app helps you make smarter food choices with minimal effort. 
    Instead of analyzing complex nutrition labels, you receive clear insights into the vitamin quality of your meals. 
    Over time, this can help you build healthier habits, improve nutrient intake, and stay more aware of what your body needs to stay energized and balanced.`,
  },
  {
    title: "Vitamin Scores",
    body: `Our Vitamin Score system helps you quickly understand the nutritional value of the foods you eat. 
    Each food item receives a score based on its vitamin content and how well it contributes to your daily recommended nutrient intake. 
    This simple rating makes it easier to compare foods and choose options that support a balanced and healthy diet.`,  
  },
  {
    title: "Food Recommendations",
    body: `Based on your vitamin scores and dietary patterns, the app suggests foods that can help improve your overall nutrition. 
    If a meal is lacking certain vitamins, the app will recommend foods that can help fill those gaps. 
    These personalized suggestions make it easier to build balanced meals and maintain a healthier lifestyle.`,
  },
];

export function HomeInfoSection() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (title: string) => {
    setExpandedCard(expandedCard === title ? null : title);
  };

  return (
    <section className="w-full min-h-screen bg-background">
      <div className="mx-auto h-full w-full min-h-screen">
        <div className="sm:hidden px-6">
          <Image src="/sample.png" alt="Sample photo of scan" width={121} height={121} className="my-4" />
          <div className="h-px border-b" />
          <div className="pt-2">
            {infoCards.map((card) => (
              <div key={card.title} className="border-b">
                <button
                  type="button"
                  onClick={() => toggleCard(card.title)}
                  aria-expanded={expandedCard === card.title}
                  className="flex w-full items-start justify-between gap-3 py-2.5 text-left text-[#0A3323]"
                >
                  <span className="min-w-0 flex-1 font-display text-xl font-medium leading-snug text-foreground">
                    {card.title}
                  </span>
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#B1CC9F] text-2xl font-semibold leading-none text-accent transition-transform duration-300 ease-out"
                    style={{ color: "rgba(10, 51, 35, 1)", transform: expandedCard === card.title ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                    expandedCard === card.title ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="[font-family:var(--font-display)] pb-4 text-sm text-[#26612F] leading-relaxed text-foreground">
                      {card.body}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="[font-family:var(--font-display)] mt-7 space-y-3 text-xl font-semibold">
            <Link
              href="/login"
              className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-[#17522A] px-6 leading-none transition hover:brightness-95"
              style={{ color: "rgba(253, 250, 231, 1)" }}
            >
              Sign-up
              <Image src="/sign-up-button.png" alt="" width={20} height={20} aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-[#F0E7CF] border border-accent px-6 leading-none text-accent transition hover:bg-accent-soft/40"
            >
              Login
              <Image src="/login-button.png" alt="" width={16} height={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="hidden flex-col items-center sm:grid lg:min-h-screen lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="lg:ml-18 lg:mr-40 lg:space-y-16">
          {infoCards.map((card) => (
            <article
              key={card.title}
              className="border-2 bg-surface p-5 shadow-md sm:p-6"
              style={{ color: "rgba(38, 97, 47, 1)" }}
            >
              <h2 className="font-display text-2xl font-semibold" style={{ color: "rgba(10, 51, 35, 1)" }}>{card.title}</h2>
              <p className="font-body mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {card.body}
              </p>
            </article>
          ))}
          </div>

          <aside className="text-right flex h-full min-h-80 w-full flex-col justify-between bg-[linear-gradient(180deg,#bdd3aa_0%,var(--primary)_100%)] p-6 shadow-sm sm:min-h-112 sm:p-8">
            <div>
              <p className="font-display text-lg font-semibold tracking-[0.16em] text-accent">
                VitaMind
              </p>
              <h1 className="font-display mt-3 font-bold leading-tight sm:text-4xl text-secondary">
                Tracking your nutritional intake easily.
              </h1>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
