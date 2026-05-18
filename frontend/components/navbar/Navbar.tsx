"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiCamera } from "react-icons/hi";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Recent", href: "/recent-foods" },
  { label: "History", href: "/history" },
] as const;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:grid h-20 grid-cols-3 items-center bg-navbar px-6">
      {/* Logo */}
      <Link href="/profile" className="justify-self-start">
        <img
          src="/assets/avatars/tomato.svg"
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
      </Link>

      {/* Center nav — truly centered via grid */}
      <div className="flex items-center justify-center gap-6">
        {NAV_LINKS.map((link, i) => (
          <span key={link.href} className="contents">
            <Link
              href={link.href}
              className={`font-body text-base tracking-tight transition-colors font-semibold rounded-full px-4 py-2 ${
                pathname === link.href
                  ? "bg-navbar-active text-cream"
                  : "text-cream hover:text-white"
              }`}
            >
              {link.label}
            </Link>
            {i === 1 && (
              <img
                src="/logo.svg"
                alt=""
                aria-hidden
                className="h-9 w-auto"
              />
            )}
          </span>
        ))}
      </div>

      {/* Scan Now */}
      <Link
        href="/scan"
        className="justify-self-end flex items-center gap-2 rounded-full bg-cream px-5 py-2 font-body text-xl font-medium text-navbar transition-opacity hover:opacity-90"
      >
        Scan Now
        <HiCamera className="h-6 w-6" />
      </Link>
    </nav>
  );
}
