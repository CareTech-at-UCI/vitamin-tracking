import Image from "next/image";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="w-full bg-[radial-gradient(58rem_32rem_at_90%_0%,#96c685_6%,#dbe9cf_45%,transparent_58%),radial-gradient(38rem_26rem_at_64%_102%,#72ab5f_18%,#c7dfba_52%,transparent_63%),var(--background)]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-7 py-7 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10 lg:py-14">
        <div className="space-y-6">
          <Image src="/logo.png" alt="Nutritional Diet App logo" width={50} height={38} priority />

          <div className="space-y-5">
            <h1 className="max-w-md text-[3.25rem] font-bold leading-[0.98] tracking-tight sm:max-w-2xl sm:text-5xl lg:text-[4.3rem] lg:leading-[0.98]">
              Nutritional Diet App
            </h1>
            <p className="max-w-xl text-[2rem] leading-[1.18] text-accent sm:text-lg sm:leading-relaxed lg:text-[2rem] lg:leading-[1.3]">
              Track your nutritional intake and understand vitamin-related health
              impacts through a combination of {" "}
              <span className="text-accent-warm">food logging</span>, {" "}
              <span className="text-accent-warm">visual analytics</span>, and {" "}
              <span className="text-accent-warm">personalized recommendations.</span>
            </p>
          </div>

          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-accent px-5 text-[1.2rem] font-medium text-white transition hover:brightness-95"
            >
              Sign up
              <Image src="/login.png" alt="" width={15} height={15} aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-accent/70 bg-surface px-5 text-[1.2rem] font-medium text-accent transition hover:bg-surface-strong"
            >
              Login
              <Image src="/login.png" alt="" width={15} height={15} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="hidden lg:grid lg:place-items-center">
          <div className="grid aspect-4/5 w-full max-w-88 place-items-center border-2 border-[#2992f5] bg-[#cfcfd1] text-center text-[3rem] font-medium text-black">
            Image
          </div>
        </div>
      </div>
    </section>
  );
}
