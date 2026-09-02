"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiCamera } from "react-icons/hi";
import { getOnboarding } from "@/lib/onboarding/api";
import { profilePictureToAvatarSrc } from "@/lib/profile/avatars";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Vitamin Breakdown", href: "/vitamin-breakdown" },
  { label: "Recent Foods", href: "/recent-foods" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [avatarSrc, setAvatarSrc] = useState("/assets/avatars/tomato.svg");

  useEffect(() => {
    getOnboarding()
      .then((data) => {
        setAvatarSrc(profilePictureToAvatarSrc(data.profile_picture));
      })
      .catch(() => {
        // keep default avatar when profile is unavailable
      });
  }, []);

  return (
    <nav className="hidden md:grid h-20 grid-cols-3 items-center bg-navbar px-6">
      <Link href="/dashboard" className="justify-self-start">
        <img src="/logo.svg" alt="Vitamind" className="h-9 w-auto" />
      </Link>

      <div className="flex items-center justify-center gap-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-body text-base tracking-tight transition-colors font-semibold rounded-full px-4 py-2 ${
              pathname === link.href
                ? "bg-navbar-active text-cream"
                : "text-cream hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="justify-self-end flex items-center gap-4">
        <Link
          href="/scan"
          className="flex items-center gap-2 rounded-full bg-cream px-5 py-2 font-body text-xl font-medium text-navbar transition-opacity hover:opacity-90"
        >
          Scan
          <HiCamera className="h-6 w-6" />
        </Link>
        <Link href="/profile" className="shrink-0">
          <img
            src={avatarSrc}
            alt="Profile"
            className="h-10 w-10 rounded-full"
          />
        </Link>
      </div>
    </nav>
  );
}
