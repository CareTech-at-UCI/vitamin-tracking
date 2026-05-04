"use client";
import { createClient } from '@supabase/supabase-js'
import Image from "next/image";

export function GoogleOAuth() {
    const supabase = createClient('https://ehafrfkdbexdycwuvaef.supabase.co', 'sb_publishable_AhpPsVh0V1rYr81LaNX0Hg_qtbhvjGV')

    
    function handleSignInWithGoogle() {
        const { data, error } = supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                access_type: 'offline',
                prompt: 'consent',
                },
            },
        })
    }

    return (
        <button
          type="button"
          onClick={handleSignInWithGoogle}
          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white px-5 text-[1.25rem] font-medium text-zinc-600 shadow-sm transition hover:bg-zinc-50 lg:w-auto lg:min-w-[16rem]"
        >
          <span className="inline-flex size-6 items-center justify-center leading-none">
             <Image src="/google.png" alt="" width={20} height={20} aria-hidden="true" />
          </span>
          Sign in with Google
        </button>
    )
}