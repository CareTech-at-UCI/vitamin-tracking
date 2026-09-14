# Camera Scan Implementation

## Overview

The scan feature uses the browser's native Media Capture API to display a live camera preview on desktop and mobile devices. The implementation also supports switching between available cameras, choosing an existing image from a device's photo library, pausing and releasing the camera, and moving through the existing food confirmation workflow.

The browser camera integration is implemented primarily in:

- [`app/scan/_components/ScanCameraModal.tsx`](../app/scan/_components/ScanCameraModal.tsx)
- [`app/scan/_components/ScanFoodFlow.tsx`](../app/scan/_components/ScanFoodFlow.tsx)
- [`app/scan/_components/ScanChromeContext.tsx`](../app/scan/_components/ScanChromeContext.tsx)
- [`components/navbar/AppShell.tsx`](../components/navbar/AppShell.tsx)

At a high level, the implementation:

1. Waits for the user to confirm that scanning should begin.
2. Requests camera permission through `navigator.mediaDevices.getUserMedia()`.
3. Displays the resulting `MediaStream` in an HTML `<video>` element.
4. Prefers the rear-facing camera on mobile devices.
5. Enumerates available cameras and allows the user to switch between them.
6. Stops all media tracks when the camera is paused, switched, or closed.
7. Provides readable permission and device errors with a retry action.
8. Allows the user to select an existing image from the device photo library.
9. Presents a full-screen mobile interface and a centered desktop modal.

## User Flow

The scan session is controlled by `ScanFoodFlow`. Its possible states are:

```ts
type ScanStep = "proceed" | "scan" | "confirm" | "log-completed" | "closed";
```

The normal transition sequence is:

```text
Scan instructions
       |
       v
Proceed confirmation
       |
       v
Live camera
       |
       v
Confirm detected food
       |
       v
Log completed
```

When the user begins a scan, `ScanFoodFlow` mounts a new scan session. The proceed drawer initially covers the camera and the camera is paused:

```tsx
<ScanCameraModal
  paused={step === "proceed" && proceedSnap === "expanded"}
  onClose={() => setStep("closed")}
  onScan={() => setStep("confirm")}
  onReadyChange={setCameraReady}
/>
```

After the user selects **Confirm Scanning**, the step changes to `"scan"`. This changes `paused` to `false`, which enables the media stream.

Selecting the shutter or an uploaded image calls `onScan`, moving the workflow to `"confirm"`. Selecting the mobile X calls `onClose`, changes the step to `"closed"`, unmounts the scan session, and reveals the scan instructions underneath.

## Camera State

`ScanCameraModal.tsx` defines four camera states:

```ts
type CameraStatus = "idle" | "requesting" | "ready" | "error";
```

| Status | Meaning |
| --- | --- |
| `idle` | Camera access is disabled or paused. |
| `requesting` | The browser is requesting permission or opening the device. |
| `ready` | A live video track is available. |
| `error` | Permission, hardware, or browser support prevented startup. |

The camera logic is contained in the `useCameraStream(enabled)` hook. Keeping browser media behavior in this hook separates stream lifecycle management from the responsive camera interface.

## Requesting Camera Access

When `enabled` becomes true, the hook calls:

```ts
navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    facingMode: { ideal: "environment" },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
});
```

The constraints have the following effects:

- `audio: false` avoids requesting microphone permission.
- `facingMode: { ideal: "environment" }` asks phones to prefer the rear camera.
- The ideal width and height request a high-resolution stream without requiring every device to support exactly 1920 by 1080 pixels.

The constraints are preferences. A desktop browser can still choose its normal webcam, and a lower-resolution camera can still be used.

Camera access requires a secure browser context. It works on:

- HTTPS deployments.
- `localhost` during local development.

A plain HTTP LAN URL such as `http://192.168.1.10:3000` will generally not receive camera access on a physical phone. Mobile testing should use an HTTPS development URL or a secure tunnel.

## Rendering the Live Preview

The media stream is attached to a `<video>` element through a React ref:

```ts
const videoRef = useRef<HTMLVideoElement>(null);
```

An effect synchronizes the stream with the DOM element:

```ts
videoElement.srcObject = stream;

if (stream) {
  void videoElement.play().catch(() => {});
}
```

The video element uses these attributes:

```tsx
<video
  ref={videoRef}
  autoPlay
  muted
  playsInline
/>
```

- `autoPlay` starts the preview after the stream is attached.
- `muted` helps satisfy browser autoplay requirements.
- `playsInline` keeps the preview inside the application on iOS instead of opening the native fullscreen video player.
- `object-cover` fills the camera surface without changing its layout.

The preview remains hidden until the camera status is `"ready"`, preventing an empty video element from flashing while permission is pending.

## Desktop Mirroring

The desktop preview is horizontally mirrored with Tailwind's `-scale-x-100` class:

```tsx
isMobile ? "" : "-scale-x-100"
```

Only the `<video>` is transformed. The title, scan frame, close button, and controls remain normally oriented.

This makes a front-facing desktop webcam feel like a mirror. The mobile preview remains unmirrored because rear-facing camera output should preserve its natural orientation.

## Switching Cameras

After permission is granted, the browser's available devices are loaded with:

```ts
const devices = await navigator.mediaDevices.enumerateDevices();
const videoInputs = devices.filter(
  (device) => device.kind === "videoinput",
);
```

The switch action:

1. Reads the active video track's device ID.
2. Finds that device in the list of video inputs.
3. Selects the next input, wrapping back to the first device.
4. Updates `selectedDeviceId`.

Changing `selectedDeviceId` reruns the media effect. The next request uses an exact device constraint:

```ts
video: {
  deviceId: { exact: selectedDeviceId },
  width: { ideal: 1920 },
  height: { ideal: 1080 },
}
```

The previous stream is stopped before the new stream becomes active. The switch button is disabled when the browser exposes fewer than two cameras. On mobile, the disabled control remains visible so the three-button layout stays balanced and the shutter remains centered.

## Stream Cleanup

A camera stream must be explicitly stopped. Removing the `<video>` element alone does not necessarily release the hardware.

The media effect cleanup stops every track:

```ts
activeStream?.getTracks().forEach((track) => track.stop());
```

Cleanup occurs when:

- The component unmounts.
- The scan becomes paused.
- The user closes the scanner.
- The selected camera changes.
- A retry restarts the effect.

The effect also uses a `cancelled` flag. If permission resolves after the component has already closed, the newly returned stream is immediately stopped rather than stored in React state.

This cleanup turns off the operating system's camera indicator and prevents unnecessary battery and hardware use.

## Error Handling

`getCameraErrorMessage()` translates browser exceptions into user-facing messages:

| Browser error | User-facing meaning |
| --- | --- |
| `NotAllowedError` | Camera permission was denied. |
| `NotFoundError` | No camera was found. |
| `NotReadableError` | Another application may be using the camera. |
| `OverconstrainedError` | The requested camera is unavailable. |

Unsupported browsers or insecure contexts receive a separate HTTPS/localhost message.

The error interface includes a **Try again** button. Retry increments `retryCount`, which is a dependency of the media effect and causes camera initialization to run again.

## Photo Library Upload

A visually hidden file input powers the upload button:

```tsx
<input
  type="file"
  accept="image/*"
  onChange={handlePhotoSelected}
/>
```

The visible upload button programmatically activates this input. The input intentionally does not use the HTML `capture` attribute. On mobile browsers, this allows the operating system to present the photo library instead of forcing the camera interface.

Before opening the picker, its value is cleared:

```ts
photoInputRef.current.value = "";
```

This allows the same file to be selected more than once while still triggering `onChange`.

Currently, selecting a valid image advances to the existing confirmation step. The selected `File` is not yet retained or uploaded for inference.

## Responsive Interface

### Mobile

The mobile scanner is a fixed, full-screen camera surface. It includes:

- A live edge-to-edge camera preview.
- A title and close button in one aligned header row.
- A responsive scan frame centered over the preview.
- Upload, shutter, and camera-switch controls near the bottom.
- A close action that returns to the scan instructions.

While the live scanner is active, `ScanFoodFlow` sets `cameraCaptureMode` through `ScanChromeContext`. `AppShell` uses this value to hide the regular mobile navigation:

```tsx
cameraCaptureMode ? "hidden md:block" : ""
```

This prevents the global navigation's camera button from overlapping the scanner controls.

### Desktop

Desktop uses `ModalShell` to display the camera inside a centered modal. The desktop close action is provided by the modal shell, and the preview is mirrored for a familiar webcam experience.

Both layouts consume the same stream and status from `useCameraStream`. They differ only in presentation.

## Shared Scan Context

`ScanChromeContext` coordinates scan-related UI outside the camera component. Its relevant values are:

- `scanStartSignal`: mounts a fresh scan session when incremented.
- `cameraCaptureMode`: identifies when the live camera step is active.
- `navOverlay`: controls whether the app navigation is visually blocked.
- `registerOpenConfirmStep`: registers the workflow transition used by shared controls.

This avoids passing scan controls through every layout and navigation component while keeping the camera's actual media logic local to `ScanCameraModal`.

## Current Limitation: No Image Capture or Inference Yet

The implementation provides a functional live camera preview, permissions, device switching, photo-library selection, responsive controls, and stream cleanup.

However, pressing the shutter does not currently extract pixels from the video. It calls:

```ts
onScan()
```

This advances the interface to the confirmation step. Likewise, the uploaded `File` is detected but is not yet stored or sent to a backend.

A complete food-recognition integration would add these steps:

1. Draw the current video frame onto an HTML `<canvas>`.
2. Convert the canvas data to a `Blob` or `File`.
3. Store the captured or uploaded image in `ScanFoodFlow` state.
4. Submit the image to a backend inference endpoint.
5. Display loading and inference-error states.
6. Populate `ConfirmFoodModal` with the model's detected foods and confidence values.

The current camera implementation establishes the browser and UI layer needed for that future inference integration.

## Testing Checklist

### Desktop

1. Open the scan instructions and start a scan.
2. Confirm that the browser asks for camera permission.
3. Confirm that the webcam preview appears and is horizontally mirrored.
4. Confirm that the shutter is disabled until the camera is ready.
5. If multiple cameras exist, switch between them.
6. Select an image using the upload control.
7. Close the modal and confirm that the camera indicator turns off.

### Mobile

1. Test from an HTTPS URL or localhost-compatible environment.
2. Confirm that the rear camera is preferred.
3. Confirm that the preview fills the viewport.
4. Confirm that the normal mobile navbar is hidden while scanning.
5. Confirm that upload, shutter, and switch controls remain centered and usable.
6. Confirm that upload opens the device image picker/photo library.
7. Confirm that the top-right X returns to the scan instructions.
8. Confirm that closing or leaving the scan turns off the camera indicator.

### Failure Cases

1. Deny camera permission and verify the permission message.
2. Retry after restoring permission.
3. Test on a device without a camera if available.
4. Open the camera in another application and verify the unavailable-device message.
5. Switch cameras repeatedly and confirm that only one stream remains active.
