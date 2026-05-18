"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import { useScanChrome } from "@/app/scan/_components/ScanChromeContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { navOverlay } = useScanChrome();
  const showNav =
    pathname !== "/" && pathname !== "/login" && pathname !== "/signup" && pathname !== "/onboarding";
  const navBlocked = navOverlay === "blur";

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
      {showNav && (
        <div
          className={
            navBlocked
              ? "pointer-events-none md:pointer-events-auto"
              : undefined
          }
          aria-hidden={navBlocked}
        >
          <MobileNavbar />
        </div>
      )}
    </div>
  );
}
