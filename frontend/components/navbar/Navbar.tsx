"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiCamera } from "react-icons/hi";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Recent", href: "/recent-foods" },
  { label: "History", href: "/history" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center justify-between bg-secondary px-8 py-3">
      {/* Profile avatar / logo */}
      <Link href="/profile" className="flex-shrink-0">
        <img
          src="/logo.svg"
          alt="Profile"
          className="w-10 h-10"
        />
      </Link>

      {/* Center nav links with logo */}
      <div className="flex items-center gap-8">
        {NAV_LINKS.map((link, i) => (
          <div key={link.href} className="flex items-center gap-8">
            <Link
              href={link.href}
              className={`font-body text-sm tracking-tight transition-colors rounded-full px-4 py-1.5 ${
                pathname === link.href
                  ? "text-cream font-semibold shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]"
                  : "text-cream-muted hover:text-cream"
              }`}
            >
              {link.label}
            </Link>
            {/* Logo between Recent and History */}
            {i === 1 && (
              <img
                src="/logo.svg"
                alt=""
                className="w-8 h-8"
              />
            )}
          </div>
        ))}
      </div>

      {/* Scan Now button — white */}
      <Link
        href="/scan"
        className="flex items-center gap-2 bg-cream text-secondary font-body font-medium text-sm px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
      >
        Scan Now
        <HiCamera className="w-4 h-4" />
      </Link>
    </nav>
  );
}
