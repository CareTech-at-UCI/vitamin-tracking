"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import { Home2 } from 'iconsax-reactjs';
import { Icon } from "@iconify/react";

export default function MobileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="relative h-24">
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
          className="absolute left-1/2 -translate-x-1/2 -top-[0px] z-10 flex items-center justify-center"
        >
          <span className="w-[52px] h-[52px] rounded-full bg-[#3d6b45] flex items-center justify-center">
            <IoCameraOutline className="w-[24px] h-[24px] text-cream" />
          </span>
        </Link>

        {/* Nav items */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-center justify-between px-5 pb-1">
          {/* Dash */}
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            {/* <HiHome className={`w-5 h-5 ${pathname === "/dashboard" ? "text-accent" : "text-cream-muted"}`} /> */}
            <Home2 color={pathname === "/dashboard" ? "var(--color-accent, #cc6b3a)" : "var(--color-cream-muted, #b8b0a0)"} variant="Bold" size={20} />
            <span className={`text-[10px] font-body font-medium ${pathname === "/dashboard" ? "text-accent" : "text-cream-muted"}`}>
              Dash
            </span>
          </Link>

          {/* Scan */}
          <Link
            href="/scan"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <Icon icon="fluent:food-egg-20-filled" width={24} height={24} color={pathname === "/scan" ? "var(--color-accent, #cc6b3a)" : "var(--color-cream-muted, #b8b0a0)"} />
            <span className={`text-[10px] font-body font-medium ${pathname === "/scan" ? "text-accent" : "text-cream-muted"}`}>
              Scan
            </span>
          </Link>

          {/* Spacer for center scan button */}
          <div className="w-[50px]" />

          {/* History */}
          <Link
            href="/recent-foods"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <Icon icon="ic:round-history" width={25} height={25} color={pathname === "/recent-foods" ? "var(--color-accent, #cc6b3a)" : "var(--color-cream-muted, #b8b0a0)"} />
            <span className={`text-[10px] font-body font-medium ${pathname === "/recent-foods" ? "text-accent" : "text-cream-muted"}`}>
              History
            </span>
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <span className="w-6 h-6 rounded-full overflow-hidden">
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
