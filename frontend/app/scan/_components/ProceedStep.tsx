"use client";

import { useRouter } from "next/navigation";
import ModalShell from "@/components/ModalShell";
import Drawer, {
  type DrawerSnap,
  toggleDrawerCollapse,
} from "@/app/scan/_components/Drawer";

type ProceedStepProps = {
  snap: DrawerSnap;
  onSnapChange: (snap: DrawerSnap) => void;
  onConfirm: () => void;
};

function ProceedContent({
  layout,
  showHandle,
  onToggleDrawer,
  onDashboard,
  onConfirm,
}: {
  layout: "mobile" | "desktop";
  showHandle: boolean;
  onToggleDrawer: () => void;
  onDashboard: () => void;
  onConfirm: () => void;
}) {
  const isMobile = layout === "mobile";
  return (
    <>
      <div className="rounded-t-[36px] bg-[linear-gradient(90deg,#1A4D20_0%,#0F2414_100%)] px-6 pb-4 pt-6 text-white md:rounded-t-2xl">
        {showHandle && (
          <button
            type="button"
            aria-label="Collapse drawer"
            onClick={onToggleDrawer}
            className="mx-auto mb-8 block h-2 w-24 rounded-full bg-white/80"
          />
        )}

        <h2 className="text-center text-[20px] font-semibold md:pt-2">
          Are you sure you wish to proceed?
        </h2>
      </div>

      <div className="px-8 pb-8 pt-6 md:px-10 md:pb-10">
        <p className="text-center font-medium text-black">
          We’ve paused the camera to prevent accidental scans. Tap “Confirm
          Scanning” to resume logging.
        </p>

        <div className="mt-10 flex flex-row flex-nowrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onDashboard}
            className={
              isMobile
                ? "flex h-[50px] w-[118px] max-w-[118px] shrink-0 items-center justify-center rounded-full bg-[#26612F] px-2 text-center text-xs font-medium leading-tight text-white"
                : "rounded-full bg-[#26612F] px-5 py-3 text-white"
            }
          >
            Go to Dashboard
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={
              isMobile
                ? "flex h-[50px] w-[118px] max-w-[118px] shrink-0 items-center justify-center rounded-full bg-[#F16F33] px-2 text-center text-xs font-medium leading-tight text-white"
                : "rounded-full bg-[#F16F33] px-5 py-3 text-white"
            }
          >
            Confirm Scanning
          </button>
        </div>
      </div>
    </>
  );
}

export default function ProceedStep({
  snap,
  onSnapChange,
  onConfirm,
}: ProceedStepProps) {
  const router = useRouter();

  function handleDashboard() {
    router.push("/dashboard");
  }

  function handleToggleDrawer() {
    toggleDrawerCollapse(snap, onSnapChange);
  }

  return (
    <>
      <div className="md:hidden">
        <Drawer
          snap={snap}
          onSnapChange={onSnapChange}
          showDragHandle={false}
          fillHeight={false}
          heightClassName="h-auto"
          panelClassName="rounded-t-[40px]"
          overlayClassName="z-[55]"
        >
          <ProceedContent
            layout="mobile"
            showHandle
            onToggleDrawer={handleToggleDrawer}
            onDashboard={handleDashboard}
            onConfirm={onConfirm}
          />
        </Drawer>
      </div>

      <div className="hidden md:block">
        <ModalShell
          ariaLabel="Confirm scanning"
          className="z-100 opacity-100 transition-opacity duration-300"
          panelClassName="max-w-[480px] scale-100 overflow-hidden rounded-2xl bg-[#FFFDEE] opacity-100 transition-all duration-300"
        >
          <ProceedContent
            layout="desktop"
            showHandle={false}
            onToggleDrawer={handleToggleDrawer}
            onDashboard={handleDashboard}
            onConfirm={onConfirm}
          />
        </ModalShell>
      </div>
    </>
  );
}
