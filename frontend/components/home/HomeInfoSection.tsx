import { homeInfoCards } from "./home-info-cards";

export function HomeInfoSection() {
  return (
    <section className="hidden w-full bg-background lg:block">
      <div className="mx-auto grid min-h-screen w-full lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <div className="space-y-16 py-14 pl-14 pr-10">
          {homeInfoCards.map((card) => (
            <article
              key={card.title}
              className="border-2 bg-surface p-6 shadow-md"
              style={{ color: "rgba(38, 97, 47, 1)" }}
            >
              <h2
                className="font-display text-2xl font-semibold"
                style={{ color: "rgba(10, 51, 35, 1)" }}
              >
                {card.title}
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted sm:text-base">
                {card.body}
              </p>
            </article>
          ))}
        </div>

        <aside className="flex h-full min-h-80 w-full flex-col justify-between bg-[linear-gradient(180deg,#bdd3aa_0%,var(--primary)_100%)] p-8 shadow-sm">
          <div>
            <p className="font-display text-lg font-semibold tracking-[0.16em] text-accent">
              VitaMind
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-secondary">
              Tracking your nutritional intake easily.
            </h1>
          </div>
        </aside>
      </div>
    </section>
  );
}
