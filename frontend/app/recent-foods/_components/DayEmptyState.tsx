import Link from "next/link";

export default function DayEmptyState() {
  return (
    <div
      className="rounded-2xl border border-dashed border-secondary/20 bg-secondary/6 px-6 py-12 text-center sm:py-14"
      role="status"
    >
      <p className="font-primary text-lg font-semibold tracking-tight text-secondary sm:text-xl">
        No foods logged for this day
      </p>
      <p className="mx-auto mt-2 max-w-md font-secondary text-sm leading-relaxed text-secondary/70 sm:text-[15px]">
        Try another date or scan a meal to build your history here.
      </p>
      <Link
        href="/scan"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 font-secondary text-sm font-medium text-white transition hover:opacity-90"
      >
        Scan a meal
      </Link>
    </div>
  );
}
