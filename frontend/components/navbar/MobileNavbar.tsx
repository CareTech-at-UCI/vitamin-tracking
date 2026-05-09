"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";

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
            d="M0 90V42L161 24C161 43 177 58 195 58C213 58 229 43 229 24L390 42V90H0z"
            className="fill-secondary"
          />
        </svg>

        {/* Elevated scan button */}
        <Link
          href="/scan"
          className="absolute left-1/2 -translate-x-1/2 -top-[2px] z-10 flex items-center justify-center"
        >
          <span className="w-[52px] h-[52px] rounded-full bg-[#3d6b45] flex items-center justify-center">
            <IoCameraOutline className="w-[24px] h-[24px] text-cream" />
          </span>
        </Link>

        {/* Nav items */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] flex items-end justify-between px-5 pb-1">
          {/* Dash */}
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <HiHome className={`w-5 h-5 ${pathname === "/dashboard" ? "text-accent" : "text-cream-muted"}`} />
            <span className={`text-[10px] font-body font-medium ${pathname === "/dashboard" ? "text-accent" : "text-cream-muted"}`}>
              Dash
            </span>
          </Link>

          {/* Recent */}
          <Link
            href="/recent-foods"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <svg className={`w-5 h-5`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2C10.5 1.5 8 3 7 4.5C5.5 6.5 4 8 3.5 10.5C3 13 3.5 15 5 17C6.5 19 8 20.5 10.5 21.5C13 22.5 15.5 22 17.5 20C19.5 18 21 15.5 21 12.5C21 9.5 20 7 18.5 5C17 3 15.5 2.5 13 2z" fill={pathname === "/recent-foods" ? "var(--color-accent, #cc6b3a)" : "var(--color-cream-muted, #b8b0a0)"}/>
              <circle cx="12" cy="11.5" r="3.5" fill="var(--color-secondary, #1a3a2a)"/>
            </svg>
            <span className={`text-[10px] font-body font-medium ${pathname === "/recent-foods" ? "text-accent" : "text-cream-muted"}`}>
              Recent
            </span>
          </Link>

          {/* Spacer for center scan button */}
          <div className="w-[50px]" />

          {/* History */}
          <Link
            href="/history"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <MdHistory className={`w-5 h-5 ${pathname === "/history" ? "text-accent" : "text-cream-muted"}`} />
            <span className={`text-[10px] font-body font-medium ${pathname === "/history" ? "text-accent" : "text-cream-muted"}`}>
              History
            </span>
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <span className="w-5 h-5 rounded-full overflow-hidden">
              <img src="/assets/avatars/tomato.svg" alt="Profile" className="w-full h-full" />
            </span>
            <span className={`text-[10px] font-body font-medium ${pathname === "/profile" ? "text-accent" : "text-cream-muted"}`}>
              Profile
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
