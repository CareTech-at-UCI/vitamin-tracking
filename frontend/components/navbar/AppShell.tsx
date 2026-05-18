"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = pathname !== "/";

  return (
    <>
      {showNav && <Navbar />}
      <main className={showNav ? "flex-1 pb-20 md:pb-0" : "flex-1"}>{children}</main>
      {showNav && <MobileNavbar />}
    </>
  );
}
