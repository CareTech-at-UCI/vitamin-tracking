"use client";

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
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className={`absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-full text-2xl leading-none transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-current/25 ${closeButtonClassName}`}
          >
            <span className="relative size-5" aria-hidden="true">
              <span className="absolute left-1/2 top-1/2 h-0.5 w-full -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
              <span className="absolute left-1/2 top-1/2 h-0.5 w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
            </span>
          </button>
        )}

        {children}
      </section>
    </div>
  );
}
