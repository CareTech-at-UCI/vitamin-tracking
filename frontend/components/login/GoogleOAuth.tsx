"use client";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export function GoogleOAuth() {
    const supabase = createClient();

    
    async function handleSignInWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                redirectTo: `${window.location.origin}/onboarding`,
            },
        });

        if (error) {
            console.error("Google OAuth sign-in failed:", error.message);
        }
    }

    return (
        <button
          type="button"
          onClick={handleSignInWithGoogle}
          className="cursor-pointer mt-3 inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white px-5 text-[1.25rem] font-medium text-zinc-600 shadow-sm transition hover:bg-zinc-50 lg:w-auto lg:min-w-[16rem]"
        >
          <span className="inline-flex size-6 items-center justify-center leading-none">
             <Image src="/google.png" alt="" width={20} height={20} aria-hidden="true" />
          </span>
          Sign in with Google
        </button>
    )
}