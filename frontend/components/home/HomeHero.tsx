import Image from "next/image";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[radial-gradient(58rem_32rem_at_90%_0%,#96c685_6%,#dbe9cf_45%,transparent_58%),radial-gradient(38rem_26rem_at_64%_102%,#72ab5f_18%,#c7dfba_52%,transparent_63%),var(--background)]">
      <div className="pointer-events-none absolute right-0 -top-[clamp(2rem,5vw,4rem)] z-0 hidden w-[clamp(18rem,38vw,42.182rem)] aspect-[674.92/630.05] lg:block">
        <Image
          src="/home-blob-1.png"
          alt=""
          fill
          sizes="(min-width: 64rem) 42.182rem, 0vw"
          className="object-contain"
          aria-hidden="true"
        />
      </div>

      <div className="pointer-events-none absolute -bottom-[clamp(1rem,2.5vw,2rem)] left-1/2 z-0 hidden w-[clamp(20rem,42vw,41.9725rem)] aspect-[671.56/684.18] -translate-x-1/2 lg:block">
        <Image
          src="/home-blob-2.png"
          alt=""
          fill
          sizes="(min-width: 64rem) 41.9725rem, 0vw"
          className="object-contain object-bottom"
          aria-hidden="true"
        />
      </div>

      <div className="absolute left-0 top-0 z-10 p-7 sm:p-8 lg:p-14">
        <Image
          src="/logo.png"
          alt="Nutritional Diet App logo"
          width={160}
          height={150}
          sizes="(min-width: 64rem) 4rem, (min-width: 40rem) 2.75rem, 2.25rem"
          className="h-auto w-[clamp(2.25rem,5vw,4rem)]"
          priority
        />
      </div>
      
      <div className="relative z-10 mx-auto grid w-full gap-8 px-5 py-7 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10 lg:px-14 lg:py-14 lg:h-screen">
        <div className="space-y-6">
          <div className="space-y-5">
            <h1 className="[font-family:var(--font-home-title)] lg:whitespace-nowrap text-[clamp(2.75rem,8vw,5rem)] font-semibold leading-[100%] tracking-[-0.07em] sm:max-w-2xl">
              Nutritional Diet App
            </h1>
            <p className="[font-family:var(--font-home-body)] text-[clamp(1.1rem,3.2vw,2rem)] leading-[100%] tracking-[-0.05em] text-accent">
              Track your nutritional intake and understand vitamin-related health
              impacts through a combination of {" "}
              <span className="text-accent-warm">food logging</span>, {" "}
              <span className="text-accent-warm">visual analytics</span>, and {" "}
              <span className="text-accent-warm">personalized recommendations</span>
              .
            </p>
          </div>

          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-accent px-5 text-[clamp(0.95rem,2vw,1.2rem)] font-medium transition hover:brightness-95"
              style={{ color: "rgba(253, 250, 231, 1)" }}
            >
              Sign up
              <span className="relative block aspect-square w-[clamp(0.75rem,1.3vw,2rem)]" aria-hidden="true">
                <Image src="/sign-up-button.png" alt="" fill sizes="(min-width: 64rem) 2rem, 0.75rem" className="object-contain" />
              </span>
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-accent/70 bg-surface px-5 text-[clamp(0.95rem,2vw,1.2rem)] font-medium text-accent transition hover:bg-surface-strong"
              style={{ color: "rgba(38, 97, 47, 1)" }}
            >
              Login
              <span className="relative block aspect-square w-[clamp(0.75rem,1.3vw,2rem)]" aria-hidden="true">
                <Image src="/login-button.png" alt="" fill sizes="(min-width: 64rem) 2rem, 0.75rem" className="object-contain" />
              </span>
            </Link>
          </div>
        </div>

        <div className="hidden lg:grid lg:place-items-center">
          <div className="grid aspect-4/5 w-full max-w-md place-items-center bg-[#cfcfd1] text-center text-[clamp(1.75rem,4vw,3rem)] font-medium text-black">
            Image
          </div>
        </div>
      </div>
    </section>
  );
}
