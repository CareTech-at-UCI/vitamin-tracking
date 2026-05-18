"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoCameraOutline } from "react-icons/io5";
import { Home2 } from "iconsax-reactjs";
import { Icon } from "@iconify/react";
import {
  SCAN_CAPTURE_COLOR,
  useScanChrome,
} from "@/app/scan/_components/ScanChromeContext";

const MOBILE_NAV_PATH =
  "M404.31 16.9284C410.393 17.5965 415 22.7367 415 28.8571V74.6032C415 82.3352 408.732 88.6032 401 88.6032H0.999989C-6.732 88.6032 -13 82.3352 -13 74.6032V28.8571C-13 22.7367 -8.39345 17.5965 -2.30957 16.9284L151.341 0.0560958C158.972 -0.781864 165 7.92628 165 15.6032C165 35.4853 181.118 51.6032 201 51.6032C220.882 51.6032 237 35.4853 237 15.6032C237 7.92624 243.027 -0.781845 250.658 0.0561144L404.31 16.9284Z";

export default function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    startScanSession,
    cameraCaptureMode,
    openConfirmStep,
  } = useScanChrome();

  const isCaptureActive = cameraCaptureMode && pathname === "/scan";

  function handleCameraClick() {
    if (isCaptureActive) {
      openConfirmStep();
      return;
    }

    startScanSession();
    router.push("/scan");
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 overflow-visible pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Main navigation"
    >
      <div className="relative h-24 overflow-visible">
        {/* Background — matches public/assets/nav/mobile-nav.svg */}
        <svg
          className="absolute bottom-0 w-full h-full overflow-visible"
          viewBox="0 0 402 89"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <filter
              id="mobile-nav-shadow"
              x="-20"
              y="-28"
              width="442"
              height="130"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feDropShadow
                dx="0"
                dy="-10"
                stdDeviation="10"
                floodColor="#577B52"
                floodOpacity="0.28"
                result="shadow-soft"
              />
              <feDropShadow
                in="SourceAlpha"
                dx="0"
                dy="-4"
                stdDeviation="3"
                floodColor="#0A3323"
                floodOpacity="0.12"
                result="shadow-tight"
              />
              <feMerge>
                <feMergeNode in="shadow-soft" />
                <feMergeNode in="shadow-tight" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={MOBILE_NAV_PATH}
            className="fill-secondary"
            filter="url(#mobile-nav-shadow)"
          />
        </svg>

        {/* Elevated scan button — green: start scan; orange: capture → confirm */}
        <button
          type="button"
          aria-label={
            isCaptureActive ? "Scan food and confirm" : "Open scan camera"
          }
          onClick={handleCameraClick}
          className="absolute left-1/2 -top-2 z-10 flex -translate-x-1/2 items-center justify-center"
        >
          <span
            className="flex size-[52px] items-center justify-center rounded-full text-cream transition-colors duration-300"
            style={{
              backgroundColor: isCaptureActive ? SCAN_CAPTURE_COLOR : "#3d6b45",
              boxShadow: isCaptureActive
                ? "0 0 22px rgba(241, 111, 51, 0.45)"
                : "0 0 22px rgba(168, 148, 210, 0.45)",
            }}
          >
            <IoCameraOutline className="size-6" />
          </span>
        </button>

        {/* Nav items */}
        <div className="absolute bottom-0 left-0 right-0 h-10/12 flex items-center justify-between px-5 pb-1">
          {/* Dash */}
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            {/* <HiHome className={`w-5 h-5 ${pathname === "/dashboard" ? "text-accent" : "text-cream-muted"}`} /> */}
            <Home2 color={pathname === "/dashboard" ? "var(--color-accent, #cc6b3a)" : "var(--color-cream-muted, #b8b0a0)"} variant="Bold" size={25} />
            <span className={`text-[10px] font-body font-medium ${pathname === "/dashboard" ? "text-accent" : "text-cream-muted"}`}>
              Dash
            </span>
          </Link>

          {/* Scan */}
          <Link
            href="/scan"
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <Icon icon="fluent:food-egg-20-filled" width={25} height={25} color={pathname === "/scan" ? "var(--color-accent, #cc6b3a)" : "var(--color-cream-muted, #b8b0a0)"} />
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
            <Icon icon="ic:round-history" width={26} height={26} color={pathname === "/recent-foods" ? "var(--color-accent, #cc6b3a)" : "var(--color-cream-muted, #b8b0a0)"} />
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
