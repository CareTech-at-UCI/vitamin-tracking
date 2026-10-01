const DEFAULT_API_BASE = "http://127.0.0.1:8000";

type RoboflowPrediction = {
  class?: string;
  confidence?: number;
};

type RoboflowInferenceResult = {
  predictions?: RoboflowPrediction[];
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? DEFAULT_API_BASE;
}

export async function inferFoodImage(image: Blob): Promise<string[]> {
  const formData = new FormData();
  formData.append("image", image, image instanceof File ? image.name : "capture.jpg");

  const response = await fetch(`${getApiBaseUrl()}/api/v1/scan/infer`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? "Food recognition failed. Please try again.");
  }

  const result = (await response.json()) as RoboflowInferenceResult;
  const labels = result.predictions
    ?.filter((prediction) => prediction.class)
    .sort((left, right) => (right.confidence ?? 0) - (left.confidence ?? 0))
    .map((prediction) => prediction.class as string);

  return [...new Set(labels ?? [])];
}