import Image from "next/image";
import Link from "next/link";
import { HomeAccordion } from "./HomeAccordion";

export function HomeMobile() {
  return (
    <section className="flex min-h-dvh flex-col overflow-y-auto bg-background lg:hidden">
      <header className="px-6 pt-6">
        <Image
          src="/logo.png"
          alt="VitaMind"
          width={44}
          height={40}
          className="h-auto w-11"
          priority
        />
      </header>

      <div className="flex flex-1 flex-col px-6 pb-4">
        <div className="flex justify-center py-2">
          <Image
            src="/assets/home/mobile.png"
            alt="VitaMind app identifying foods on a phone screen"
            width={240}
            height={332}
            sizes="(max-width: 1024px) 40vw, 180px"
            className="h-auto w-[min(40vw,180px)]"
            priority
          />
        </div>

        <h1 className="text-left font-display text-[2.75rem] font-semibold leading-none tracking-[-0.06em] text-secondary">
          VitaMind
        </h1>

        <p className="mt-4 text-left font-secondary text-xl leading-[1.35] tracking-[-0.03em] text-primary">
          Track your nutritional intake and understand vitamin-related health impacts
          through a combination of{" "}
          <span className="text-accent">food logging</span>,{" "}
          <span className="text-accent">visual analytics</span>, and{" "}
          <span className="text-accent">personalized recommendations</span>.
        </p>

        <HomeAccordion />
      </div>

      <footer className="mt-auto shrink-0 space-y-3 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
        <Link
          href="/signup"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#17522A] font-display text-lg font-semibold text-cream transition hover:brightness-95"
        >
          Sign-up
          <Image src="/sign-up-button.png" alt="" width={20} height={20} aria-hidden />
        </Link>
        <Link
          href="/login"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-secondary/30 bg-[#F0E7CF] font-display text-lg font-semibold text-accent transition hover:bg-[#e8dfc0]"
        >
          Login
          <Image src="/login-button.png" alt="" width={18} height={18} aria-hidden />
        </Link>
      </footer>
    </section>
  );
}
