"use client";

import { useState } from "react";

export type DrawerSnap = "expanded" | "collapsed" | "dismissed";

type DrawerProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
  snap?: DrawerSnap;
  defaultSnap?: DrawerSnap;
  onSnapChange?: (snap: DrawerSnap) => void;
  panelClassName?: string;
  contentClassName?: string;
  overlayClassName?: string;
  showDragHandle?: boolean;
  heightClassName?: string;
  fillHeight?: boolean;
};

export function toggleDrawerCollapse(
  snap: DrawerSnap,
  onSnapChange: (snap: DrawerSnap) => void,
) {
  if (snap === "dismissed") {
    onSnapChange("expanded");
    return;
  }
  onSnapChange(snap === "expanded" ? "collapsed" : "expanded");
}

export default function Drawer({
  children,
  footer,
  snap: snapProp,
  defaultSnap = "expanded",
  onSnapChange,
  panelClassName = "",
  contentClassName = "",
  overlayClassName = "",
  showDragHandle = true,
  heightClassName = "h-[85vh]",
  fillHeight = true,
}: DrawerProps) {
  const [internalSnap, setInternalSnap] = useState<DrawerSnap>(defaultSnap);
  const isControlled = snapProp !== undefined;
  const snap = isControlled ? snapProp : internalSnap;

  function setSnap(next: DrawerSnap) {
    if (!isControlled) {
      setInternalSnap(next);
    }
    onSnapChange?.(next);
  }

  function handleToggleCollapsed() {
    toggleDrawerCollapse(snap, setSnap);
  }

  if (snap === "dismissed") {
    return null;
  }

  const isExpanded = snap === "expanded";

  return (
    <>
      <button
        type="button"
        aria-label="Close drawer"
        className={`fixed inset-0 z-[55] bg-black/30 backdrop-blur-sm ${overlayClassName}`}
        onClick={() => setSnap("dismissed")}
      />

      <div
        role="dialog"
        aria-modal
        className={`fixed bottom-0 left-0 right-0 z-[60] flex flex-col rounded-t-2xl bg-[#FFFDEE] shadow-2xl transition-transform duration-300 "h-[85vh]" ${
          isExpanded ? "translate-y-0" : "translate-y-[88%]"
        } ${panelClassName}`}
        onClick={!isExpanded ? handleToggleCollapsed : undefined}
      >
        {showDragHandle && (
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse drawer" : "Expand drawer"}
            className="flex w-full shrink-0 cursor-pointer justify-center py-2"
            onClick={(event) => {
              event.stopPropagation();
              handleToggleCollapsed();
            }}
          >
            <span className="h-1.5 w-12 rounded-full bg-gray-300" />
          </button>
        )}

        <div
          className={
            fillHeight
              ? `min-h-0 flex-1 overflow-y-auto ${contentClassName}`
              : contentClassName
          }
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>

        {footer ? (
          <div className="shrink-0" onClick={(event) => event.stopPropagation()}>
            {footer}
          </div>
        ) : null}
      </div>
    </>
  );
}
