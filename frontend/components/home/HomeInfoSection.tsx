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
    <section className="w-full min-h-screen bg-background">
      <div className="mx-auto h-full w-full min-h-screen">
        <div className="sm:hidden px-6">
          <div className="h-px bg-border-subtle/80" />
          <div className="pt-2">
            {infoCards.map((card) => (
              <div key={card.title} className="border-b border-border-subtle/80 py-2.5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <span className="text-2xl font-medium leading-none text-foreground">
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

        <div className="hidden flex-col items-center sm:grid lg:min-h-screen lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="lg:ml-18 lg:mr-40 lg:space-y-16">
          {infoCards.map((card) => (
            <article
              key={card.title}
              className="border-2 bg-surface p-5 shadow-md sm:p-6"
              style={{ color: "rgba(38, 97, 47, 1)" }}
            >
              <h2 className="[font-family:var(--font-home-title)] text-2xl font-semibold" style={{ color: "rgba(10, 51, 35, 1)" }}>{card.title}</h2>
              <p className="[font-family:var(--font-home-body)] mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {card.body}
              </p>
            </article>
          ))}
          </div>

          <aside className="text-right flex h-full min-h-80 w-full flex-col justify-between bg-[linear-gradient(180deg,#bdd3aa_0%,#26612f_100%)] p-6 shadow-sm sm:min-h-112 sm:p-8">
            <div>
              <p className="[font-family:var(--font-home-body)] text-lg font-semibold tracking-[0.16em] text-accent-warm">
                Nutritional Diet App
              </p>
              <h1 className="[font-family:var(--font-home-title)] mt-3 font-bold leading-tight sm:text-4xl">
                Simple slogan here.
              </h1>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
