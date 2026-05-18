"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = pathname !== "/" && pathname !== "/login" && pathname !== "/signup" && pathname !== "/onboarding";

  return (
    <div className="flex min-h-dvh flex-col">
      {showNav && <Navbar />}
      <main
        className={
          showNav
            ? "flex min-h-0 flex-1 flex-col overflow-y-auto pb-mobile-nav md:overflow-visible md:pb-0"
            : "flex min-h-0 flex-1 flex-col overflow-y-auto"
        }
      >
        {children}
      </main>
      {showNav && <MobileNavbar />}
    </div>
  );
}
