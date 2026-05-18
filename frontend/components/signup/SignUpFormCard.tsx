"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { GoogleOAuth } from "@/components/login/GoogleOAuth";
import Image from "next/image";

export function SignUpFormCard() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

    async function handleSignUp(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
            },
        });

        if (error) {
            setErrorMessage(error.message);
            console.error(error.message);
            return;
        }

        setSuccessMessage("Account created! Check your email to confirm your account.");
        console.log("Signup data:", data);
    }

  return (
    <section className="w-full max-w-4xl py-1">
      <div className="pointer-events-none absolute right-0 -top-[clamp(2rem,5vw,4rem)] z-0 w-[clamp(18rem,38vw,42.182rem)] aspect-[674.92/630.05] hidden lg:block">
        <Image
          src="/home-blob-1.png"
          alt="Green Blob for Decoration"
          fill
          sizes="(min-width: 64rem) 42.182rem, 0vw"
          className="object-contain"
          aria-hidden="true"
        />
      </div>

      <div className="pointer-events-none absolute -bottom-[clamp(1rem,2.5vw,2rem)] left-2/3 z-0 w-[clamp(20rem,42vw,41.9725rem)] aspect-[671.56/684.18] -translate-x-1/2 hidden lg:block">
        <Image
          src="/home-blob-2.png"
          alt="Green Blob for Decoration"
          fill
          sizes="(min-width: 64rem) 41.9725rem, 0vw"
          className="object-contain object-bottom"
          aria-hidden="true"
          quality={100}
        />
      </div>

      <header className="space-y-4">
        <Image src="/logo.png" alt="Nutritional Diet App logo" width={50} height={38} priority />

        <div className="font-display font-semibold" style={{ color: "rgba(38, 97, 47, 1)" }}>
          <p
            className="w-full max-w-84 text-[36px] leading-none tracking-[-0.08em] lg:max-w-none lg:text-[3.35rem] lg:tracking-tight"
          >
            Welcome to
          </p>
          <h1 className="mt-1 w-full max-w-84 text-[48px] font-semibold leading-[0.92] tracking-[-0.06em] md:whitespace-nowrap lg:max-w-none lg:text-[5.1rem] lg:leading-[0.95] lg:tracking-tight">
            VitaMind
          </h1>
        </div>
      </header>

      <form 
        onSubmit={handleSignUp}
        className="font-body text-[2rem] md:text-[1rem] mt-6 max-w-lg space-y-4 sm:mt-8 lg:mt-10" 
        style={{ color: "rgba(38, 97, 47, 1)" }}
      >
        <label className="block font-medium leading-none" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-14 w-full rounded-full border border-accent/65 bg-transparent px-5 text-base outline-none ring-accent/50 transition focus:ring-2"
        />

        <label className="block pt-1 font-medium leading-none" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-14 w-full rounded-full border border-accent/65 bg-transparent px-5 text-base outline-none ring-accent/50 transition focus:ring-2"
        />

        <div className="flex items-center justify-between pt-2">
          <label className="inline-flex items-center gap-2.5 text-[20px] leading-none tracking-[-0.05em] font-medium text-accent">
            <span className="inline-flex h-10 w-14.25 rounded-full border border-accent/65 bg-transparent" />
            Remember me
          </label>
        </div>

        <div className="pt-1 gap-5 lg:flex lg:justify-end items-center">
          {errorMessage && (
            <p className="text-body text-red-600">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-[12px] text-body text-primary font-semibold">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-1 rounded-full border border-accent/65 px-6 text-[1.25rem] font-medium leading-none text-primary transition hover:bg-accent-soft/50 lg:w-auto lg:min-w-32"
          >
            Sign-Up
            <Image src="/login-button.png" alt="Arrow Icon" width={15} height={15} aria-hidden="true" />
          </button>
        </div>
      </form>

      <div className="mt-8 flex max-w-lg items-center gap-4 lg:mt-10 lg:gap-5">
        <span className="h-px flex-1 bg-border-subtle/70" />
        <p className="text-[1rem] text-accent">or continue with</p>
        <span className="h-px flex-1 bg-border-subtle/70" />
      </div>

      <div className="flex max-w-lg lg:justify-center">
        <GoogleOAuth />
      </div>

    </section>
  );
}
