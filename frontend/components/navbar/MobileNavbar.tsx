"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiCamera, HiHome, HiClock } from "react-icons/hi";
import { HiArchiveBox } from "react-icons/hi2";

export default function MobileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="relative h-[90px]">
        {/* Background shape — slanted sides rising to center with notch */}
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 390 90"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 90V52C0 48 2 44 6 42L150 10c8-4 16 0 22 10 5 8 12 12 23 12s18-4 23-12c6-10 14-14 22-10L384 42c4 2 6 6 6 10v38H0z"
            className="fill-secondary"
          />
        </svg>

        {/* Elevated scan button */}
        <Link
          href="/scan"
          className="absolute left-1/2 -translate-x-1/2 top-[2px] z-10 flex items-center justify-center"
        >
          {/* Outer ring */}
          <span className="w-[58px] h-[58px] rounded-full bg-cream/30 flex items-center justify-center">
            {/* Inner button */}
            <span className="w-[48px] h-[48px] rounded-full bg-secondary border-[3px] border-cream/50 flex items-center justify-center">
              <HiCamera className="w-6 h-6 text-cream" />
            </span>
          </span>
        </Link>

        {/* Nav items */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] flex items-center justify-between px-5">
          {/* Dash */}
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <HiHome className="w-4 h-4 text-cream" />
            </span>
            <span className="text-[10px] font-body text-accent font-medium">
              Dash
            </span>
          </Link>

          {/* Recent */}
          <Link
            href="/recent-foods"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <span className="w-8 h-8 rounded-full bg-secondary-light flex items-center justify-center">
              <HiArchiveBox className="w-4 h-4 text-cream" />
            </span>
            <span className="text-[10px] font-body text-cream-muted">
              Recent
            </span>
          </Link>

          {/* Spacer for center scan button */}
          <div className="w-[58px]" />

          {/* History — no circle, just the icon */}
          <Link
            href="/history"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <HiClock className="w-7 h-7 text-cream-muted" />
            <span className="text-[10px] font-body text-cream-muted">
              History
            </span>
          </Link>

          {/* Profile — uses mascot logo */}
          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center overflow-hidden">
              <img src="/logo.svg" alt="Profile" className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-body text-cream-muted">
              Profile
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
