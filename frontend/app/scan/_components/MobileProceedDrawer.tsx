"use client";

type MobileProceedDrawerProps = {
  onConfirm: () => void;
  onHome: () => void;
};

export default function MobileProceedDrawer({
  onConfirm,
  onHome,
}: MobileProceedDrawerProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-[80px] bg-scan-cream">
      <div className="rounded-t-[36px] bg-[linear-gradient(90deg,#1A4D20_0%,#0F2414_100%)] px-6 pb-4 pt-6 text-white">
        <div className="mx-auto mb-8 h-2 w-27 rounded-full bg-white/80" />

        <h2 className="text-center font-display text-[20.7px] font-semibold leading-tight">
          Are you sure you wish to proceed?
        </h2>
      </div>

         <div className="px-10 pb-6 pt-6">
        <p className="mx-auto max-w-[310px] text-center font-body text-[14px] font-medium leading-[1.35] text-[#111111]">
        We’ve paused the camera to prevent accidental scans. Tap ‘Confirm Scanning’ to resume
        logging.
        </p>

        <div className="mt-13 flex items-center justify-center gap-4">
          <button
            onClick={onHome}
            className="rounded-full bg-primary px-6 py-3 font-body text-[14px] font-medium text-white"
          >
            Go to Dashboard
          </button>

          <button
            onClick={onConfirm}
            className="rounded-full bg-scan-orange px-6 py-3 font-body text-[14px] font-medium text-white"
          >
            Confirm Scanning
          </button>
        </div>
      </div>
    </div>
  );
}