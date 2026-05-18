"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import { useScanChrome } from "@/app/scan/_components/ScanChromeContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { navOverlay } = useScanChrome();
  const showNav =
    pathname !== "/" && pathname !== "/login" && pathname !== "/signup";
  const navBlocked = navOverlay === "blur";

  return (
    <>
      {showNav && <Navbar />}
      <main className={showNav ? "flex-1 pb-20 md:pb-0" : "flex-1"}>
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
    </>
  );
}
