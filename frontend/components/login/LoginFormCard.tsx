import Image from "next/image";
import { Montserrat_Alternates } from "next/font/google";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["600"],
});

export function LoginFormCard() {
  return (
    <section className="w-full max-w-4xl py-1">
      <header className="space-y-4">
        <Image src="/logo.png" alt="Nutritional Diet App logo" width={50} height={38} priority />

        <div>
          <p
            className={`${montserratAlternates.className} w-full max-w-84 text-[36px] font-semibold leading-none tracking-[-0.08em] text-accent lg:max-w-none lg:text-[3.35rem] lg:tracking-tight`}
          >
            Welcome back
          </p>
          <h1 className="mt-1 w-full max-w-84 text-[48px] font-semibold leading-[0.92] tracking-[-0.06em] text-accent md:whitespace-nowrap lg:max-w-none lg:text-[5.1rem] lg:leading-[0.95] lg:tracking-tight">
            to Nutritional Diet App
          </h1>
        </div>
      </header>

      <form className="mt-6 max-w-lg space-y-4 sm:mt-8 lg:mt-10">
        <label className="block text-[2rem] font-medium leading-none" htmlFor="email">
          Username
        </label>
        <input
          id="email"
          name="email"
          type="text"
          className="h-14 w-full rounded-full border border-accent/65 bg-transparent px-5 text-base outline-none ring-accent/50 transition focus:ring-2"
        />

        <label className="block pt-1 text-[2rem] font-medium leading-none" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="h-14 w-full rounded-full border border-accent/65 bg-transparent px-5 text-base outline-none ring-accent/50 transition focus:ring-2"
        />

        <div className="flex items-center justify-between pt-2">
          <label className="inline-flex items-center gap-2.5 text-[20px] leading-none tracking-[-0.05em] font-medium text-accent-warm">
            <span className="inline-flex h-10 w-14.25 rounded-full border border-accent/65 bg-transparent" />
            Remember me
          </label>
          <span className="pr-0.5 text-[20px] font-medium leading-none tracking-[-0.05em] text-accent-warm">
            Forgot Password?
          </span>
        </div>

        <div className="pt-1 lg:flex lg:justify-end">
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-1 rounded-full border border-accent/65 px-6 text-[2rem] font-medium leading-none text-accent transition hover:bg-accent-soft/50 lg:w-auto lg:min-w-32"
          >
            Login
            <Image src="/login.png" alt="" width={15} height={15} aria-hidden="true" />
          </button>
        </div>
      </form>

      <div className="mt-8 flex max-w-lg items-center gap-4 lg:mt-10 lg:gap-5">
        <span className="h-px flex-1 bg-border-subtle/70" />
        <p className="text-[2rem] text-accent-warm">or continue with</p>
        <span className="h-px flex-1 bg-border-subtle/70" />
      </div>

      <button
        type="button"
        className="mt-3 inline-flex h-12 w-full max-w-lg items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white px-5 text-[1.8rem] font-medium text-zinc-600 shadow-sm transition hover:bg-zinc-50 lg:w-auto lg:min-w-[16rem]"
      >
        <span className="inline-flex size-6 items-center justify-center text-xl font-bold leading-none">
          <span className="text-[#4285F4]">G</span>
        </span>
        Sign in with Google
      </button>

    </section>
  );
}
