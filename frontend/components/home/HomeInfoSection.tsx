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
  return (
    <section className="w-full bg-background pb-7 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-7 sm:px-8 lg:h-screen">
        <div className="sm:hidden">
          <div className="h-px bg-border-subtle/80" />
          <div className="pt-2">
            {infoCards.map((card) => (
              <div key={card.title} className="border-b border-border-subtle/80 py-2.5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <span className="text-4xl font-medium leading-none text-foreground">
                    {card.title}
                  </span>
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent-soft text-2xl font-semibold leading-none text-accent">
                    +
                  </span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-7 space-y-3">
            <Link
              href="/login"
              className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-accent px-6 text-[2rem] font-semibold leading-none text-white transition hover:brightness-95"
            >
              Sign-up
              <Image src="/login.png" alt="" width={16} height={16} aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border border-accent bg-transparent px-6 text-[2rem] font-semibold leading-none text-accent transition hover:bg-accent-soft/40"
            >
              Login
              <Image src="/login.png" alt="" width={16} height={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="hidden gap-8 sm:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12">
          <div className="space-y-5">
          {infoCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-6"
            >
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {card.body}
              </p>
            </article>
          ))}
          </div>

          <aside className="flex h-full min-h-80 flex-col justify-between rounded-3xl border border-border-subtle bg-[linear-gradient(180deg,#ebf3e6_0%,#d0e6c8_100%)] p-6 shadow-sm sm:min-h-112 sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-warm">
                Nutritional Diet App
              </p>
              <h3 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                Simple slogan here.
              </h3>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
