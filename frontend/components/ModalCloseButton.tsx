"use client";

type ModalCloseButtonProps = {
  onClick: () => void;
  className?: string;
  label?: string;
};

export default function ModalCloseButton({
  onClick,
  className = "",
  label = "Close modal",
}: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-full text-2xl leading-none transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-current/25 ${className}`}
    >
      <span className="relative size-5" aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 h-0.5 w-full -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
        <span className="absolute left-1/2 top-1/2 h-0.5 w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
      </span>
    </button>
  );
}
