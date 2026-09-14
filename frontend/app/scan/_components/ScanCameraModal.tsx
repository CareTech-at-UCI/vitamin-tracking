"use client";

import Image from "next/image";
import { SwitchCamera, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ModalShell from "@/components/ModalShell";

type ScanCameraModalProps = {
  onClose: () => void;
  onScan: () => void;
  paused?: boolean;
  hideMobileCaptureButton?: boolean;
  onReadyChange?: (ready: boolean) => void;
};

type CameraStatus = "idle" | "requesting" | "ready" | "error";

function getCameraErrorMessage(error: unknown) {
  if (!(error instanceof DOMException)) {
    return "The camera could not be started. Please try again.";
  }

  switch (error.name) {
    case "NotAllowedError":
      return "Camera access was denied. Allow camera access in your browser settings and try again.";
    case "NotFoundError":
      return "No camera was found on this device.";
    case "NotReadableError":
      return "The camera is being used by another app. Close it there and try again.";
    case "OverconstrainedError":
      return "The selected camera is unavailable. Try another camera.";
    default:
      return "The camera could not be started. Please try again.";
  }
}

function useCameraStream(enabled: boolean) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let cancelled = false;

    if (!enabled) return;

    async function startCamera() {
      setStatus("requesting");
      setErrorMessage(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        setErrorMessage(
          "Camera access requires HTTPS or localhost in a supported browser.",
        );
        return;
      }

      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: selectedDeviceId
            ? {
                deviceId: { exact: selectedDeviceId },
                width: { ideal: 1920 },
                height: { ideal: 1080 },
              }
            : {
                facingMode: { ideal: "environment" },
                width: { ideal: 1920 },
                height: { ideal: 1080 },
              },
        });

        if (cancelled) {
          activeStream.getTracks().forEach((track) => track.stop());
          return;
        }

        setStream(activeStream);
        setStatus("ready");

        const devices = await navigator.mediaDevices.enumerateDevices();
        if (!cancelled) {
          setVideoInputs(devices.filter((device) => device.kind === "videoinput"));
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(getCameraErrorMessage(error));
        }
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      activeStream?.getTracks().forEach((track) => track.stop());
    };
  }, [enabled, retryCount, selectedDeviceId]);

  function switchCamera() {
    if (!stream || videoInputs.length < 2) return;

    const currentDeviceId = stream.getVideoTracks()[0]?.getSettings().deviceId;
    const currentIndex = videoInputs.findIndex(
      (device) => device.deviceId === currentDeviceId,
    );
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % videoInputs.length : 0;
    setSelectedDeviceId(videoInputs[nextIndex].deviceId);
  }

  const hasLiveVideoTrack = stream
    ?.getVideoTracks()
    .some((track) => track.readyState === "live");
  const currentStatus =
    enabled && status === "ready" && !hasLiveVideoTrack ? "requesting" : status;

  return {
    stream: enabled ? stream : null,
    status: enabled ? currentStatus : "idle",
    errorMessage: enabled ? errorMessage : null,
    canSwitchCamera: videoInputs.length > 1,
    switchCamera,
    retry: () => setRetryCount((count) => count + 1),
  };
}

function ScanCameraContent({
  onClose,
  onScan,
  paused,
  layout,
  hideCaptureButton,
  stream,
  status,
  errorMessage,
  canSwitchCamera,
  onSwitchCamera,
  onRetry,
}: {
  onClose: () => void;
  onScan: () => void;
  paused?: boolean;
  layout: "mobile" | "desktop";
  hideCaptureButton?: boolean;
  stream: MediaStream | null;
  status: CameraStatus;
  errorMessage: string | null;
  canSwitchCamera: boolean;
  onSwitchCamera: () => void;
  onRetry: () => void;
}) {
  const isMobile = layout === "mobile";
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  function openPhotoLibrary() {
    if (!photoInputRef.current) return;

    photoInputRef.current.value = "";
    photoInputRef.current.click();
  }

  function handlePhotoSelected(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.[0]) onScan();
  }

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.srcObject = stream;
    if (stream) {
      void videoElement.play().catch(() => {});
    }

    return () => {
      videoElement.srcObject = null;
    };
  }, [stream]);

  return (
    <div
      className={
        isMobile
          ? "relative flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-10 pt-12"
          : "relative flex aspect-[1.58/1] min-h-107.5 flex-col overflow-hidden px-8 py-8 sm:px-9 sm:py-9"
      }
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        aria-label="Live camera preview"
        className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${
          isMobile ? "" : "-scale-x-100"
        } ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative z-10 flex items-center ${
          isMobile ? "justify-between pt-2" : ""
        }`}
      >
        <h2
          className={`font-semibold leading-none text-white [font-family:var(--font-montserrat-alternates)] ${
            isMobile ? "text-4xl" : "text-3xl md:text-[34px]"
          }`}
        >
          Scan Food
        </h2>

        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close camera and return to scan instructions"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black/35 text-white transition hover:bg-black/55 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        )}
      </div>

      <div
        className={`relative z-10 flex flex-1 items-center justify-center ${
          isMobile ? "py-10" : "py-8"
        }`}
      >
        {status === "error" ? (
          <div className="max-w-sm rounded-lg bg-black/70 px-6 py-5 text-center backdrop-blur-sm">
            <p role="alert" className="text-sm leading-6 text-white">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div
              className={`grid aspect-square grid-cols-2 grid-rows-2 gap-[42%] ${
                isMobile
                  ? "w-[min(58vw,320px)]"
                  : "w-[min(28vw,220px)] min-w-32"
              }`}
              aria-hidden
            >
              <span className="rounded-tl-2xl border-l-[3px] border-t-[3px] border-[#FFFFFF]" />
              <span className="rounded-tr-2xl border-r-[3px] border-t-[3px] border-[#FFFFFF]" />
              <span className="rounded-bl-2xl border-b-[3px] border-l-[3px] border-[#FFFFFF]" />
              <span className="rounded-br-2xl border-b-[3px] border-r-[3px] border-[#FFFFFF]" />
            </div>
            {status === "requesting" && (
              <p className="absolute rounded-full bg-black/65 px-4 py-2 text-sm text-white backdrop-blur-sm" aria-live="polite">
                Starting camera...
              </p>
            )}
          </>
        )}
      </div>

      <div className="relative z-10 flex min-h-20 items-center justify-center gap-7">
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelected}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={openPhotoLibrary}
          aria-label="Upload food photo"
          disabled={paused}
          className="flex size-12.5 items-center justify-center rounded-full transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-white/20 disabled:opacity-50"
        >
          <Image
            src="/assets/scan/upload.svg"
            alt=""
            width={50}
            height={50}
            aria-hidden="true"
          />
        </button>

        {!hideCaptureButton && (
          <button
            type="button"
            onClick={onScan}
            disabled={paused || status !== "ready"}
            aria-label="Scan food"
            className="flex size-20 items-center justify-center rounded-full transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-primary/35 disabled:opacity-50"
          >
            <Image
              src="/assets/scan/cam.svg"
              alt=""
              width={70}
              height={70}
              aria-hidden="true"
              priority
            />
          </button>
        )}

        {(canSwitchCamera || isMobile) && status === "ready" && (
          <button
            type="button"
            onClick={onSwitchCamera}
            disabled={paused || !canSwitchCamera}
            aria-label="Switch camera"
            title="Switch camera"
            className="flex size-12.5 items-center justify-center rounded-full bg-[#D9D9D9] text-black transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-white/20 disabled:opacity-50"
          >
            <SwitchCamera className="size-6" aria-hidden="true" />
          </button>
        )}

        {/* <button
          type="button"
          aria-label="Toggle flash"
          disabled={paused}
          className="flex size-[50px] items-center justify-center rounded-full transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-white/20 disabled:opacity-50"
        >
          <Image
            src="/assets/scan/flash.svg"
            alt=""
            width={50}
            height={50}
            aria-hidden="true"
          />
        </button> */}
      </div>
    </div>
  );
}

export default function ScanCameraModal({
  onClose,
  onScan,
  paused = false,
  hideMobileCaptureButton = false,
  onReadyChange,
}: ScanCameraModalProps) {
  const {
    stream,
    status,
    errorMessage,
    canSwitchCamera,
    switchCamera,
    retry,
  } = useCameraStream(!paused);

  useEffect(() => {
    onReadyChange?.(status === "ready");
  }, [onReadyChange, status]);

  const cameraProps = {
    stream,
    status,
    errorMessage,
    canSwitchCamera,
    onSwitchCamera: switchCamera,
    onRetry: retry,
  };

  return (
    <>
      {/* Mobile: full-screen camera behind proceed drawer */}
      <div className="fixed inset-0 z-40 flex min-h-svh flex-col bg-black text-white md:hidden">
        <ScanCameraContent
          onClose={onClose}
          onScan={onScan}
          paused={paused}
          layout="mobile"
          hideCaptureButton={hideMobileCaptureButton}
          {...cameraProps}
        />
      </div>

      {/* Desktop: centered camera modal */}
      <div className="hidden md:block">
        <ModalShell
          ariaLabel="Scan food camera"
          onClose={paused ? undefined : onClose}
          className="z-50"
          panelClassName="max-w-[920px] rounded-[20px] bg-black text-white"
          closeButtonClassName="text-white hover:bg-white/10"
        >
          <ScanCameraContent
            onClose={onClose}
            onScan={onScan}
            paused={paused}
            layout="desktop"
            {...cameraProps}
          />
        </ModalShell>
      </div>
    </>
  );
}
