import ScanFoodFlow from "@/app/scan/_components/ScanFoodFlow";

const recentFoods = Array.from({ length: 8 }, (_, index) => ({
  id: index,
  name: "Food Name",
}));

export default function ScanPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background px-6 py-10 text-secondary sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1180px] flex-col">
        <header className="flex items-start justify-between gap-8">
          <div className="w-full max-w-[740px]">
            <h1 className="font-display text-5xl font-bold leading-none tracking-tight text-primary md:text-[64px]">
              Scan Food
            </h1>

            <label className="mt-8 flex min-h-12 items-center gap-3 rounded-[24px] border border-secondary/80 px-4 text-secondary">
              <SearchIcon className="size-6 shrink-0" />
              <span className="sr-only">Search recent foods</span>
              <input
                type="search"
                placeholder="Search"
                className="min-w-0 flex-1 bg-transparent font-display text-base outline-none [background-image:none] placeholder:text-secondary/80"
              />
            </label>
          </div>

          <button
            type="button"
            aria-label="Open scan camera"
            className="mt-[76px] hidden size-[52px] shrink-0 items-center justify-center rounded-full bg-primary text-2xl text-white shadow-sm transition hover:brightness-95 md:flex"
          >
            <CameraIcon className="size-6" />
          </button>
        </header>

        <section className="mt-8">
          <h2 className="font-display text-3xl font-semibold leading-none text-accent md:text-[40px]">
            Recent
          </h2>

          <div className="mt-6 grid max-w-[1070px] grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-6">
            {recentFoods.map((food) => (
              <article
                key={food.id}
                className="relative aspect-[2.25/1] overflow-hidden rounded-lg bg-[linear-gradient(90deg,rgb(0_0_0_/_0.58),rgb(0_0_0_/_0.08)),url('/sample.png')] bg-cover bg-center shadow-sm"
              >
                <p className="absolute bottom-3 left-3 max-w-24 font-display text-base font-medium leading-tight text-white">
                  {food.name}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <ScanFoodFlow />
    </main>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="2.6" />
      <path d="m16 16 5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="2.6" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.2 7.4 8.7 5.2h6.6l1.5 2.2h2.3c1.1 0 1.9.8 1.9 1.9v7.6c0 1.1-.8 1.9-1.9 1.9H4.9c-1.1 0-1.9-.8-1.9-1.9V9.3c0-1.1.8-1.9 1.9-1.9h2.3Z"
        fill="currentColor"
      />
      <circle cx="12" cy="13" r="3.2" fill="var(--background)" />
      <circle cx="18.1" cy="10.1" r="1" fill="var(--background)" />
    </svg>
  );
}
