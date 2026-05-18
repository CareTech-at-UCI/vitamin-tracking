"use client";

import ModalCloseButton from "@/components/ModalCloseButton";

type ModalShellProps = {
  children: React.ReactNode;
  ariaLabel: string;
  onClose?: () => void;
  className?: string;
  panelClassName?: string;
  closeButtonClassName?: string;
  closeLabel?: string;
};

export default function ModalShell({
  children,
  ariaLabel,
  onClose,
  className = "",
  panelClassName = "",
  closeButtonClassName = "",
  closeLabel = "Close modal",
}: ModalShellProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex min-h-svh items-center justify-center bg-scan-backdrop px-4 py-8 ${className}`}
      role="presentation"
    >
      <section
        aria-label={ariaLabel}
        aria-modal="true"
        role="dialog"
        className={`relative w-full shadow-[0_14px_34px_rgb(0_0_0_/_0.22)] ${panelClassName}`}
      >
        {onClose ? (
          <ModalCloseButton
            onClick={onClose}
            className={closeButtonClassName}
            label={closeLabel}
          />
        ) : null}

        {children}
      </section>
    </div>
  );
}
