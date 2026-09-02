export type ScanInstruction = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
};

export const scanInstructions: ScanInstruction[] = [
  {
    title: "Open your camera",
    description: 'Tap the “Scan Here” button to open the camera.',
  },
  {
    title: "Review the popup",
    description: "A quick popup will appear before you can start scanning.",
  },
  {
    title: "Position your food",
    description:
      "Hold your camera slightly back and center the food. The food and its plate or container should stay fully in view.",
    imageSrc: "/sandwhich-example-v1.jpg",
    imageAlt: "Sandwhich centered inside the camera view",
  },
  {
    title: "Line up the grid",
    description:
      "Align the corners around your food to confirm that the camera is positioned correctly.",
  },
  {
    title: "Confirm scanning",
    description:
      'Tap “Confirm Scanning” to let the model detect your food and estimate its serving size.',
  },
  {
    title: "Check the detected food",
    description:
      "Review everything that was detected, then adjust serving sizes or food items if needed.",
  },
  {
    title: "Food logged",
    description: "Your food is successfully logged and ready to be analyzed.",
  },
];
