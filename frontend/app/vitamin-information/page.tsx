import { Suspense } from "react";
import VitaminInfoContent from "./VitaminInfoContent";

export default function VitaminInfoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background sm:px-20 px-6 sm:pt-14 pt-10 pb-16" />
      }
    >
      <VitaminInfoContent />
    </Suspense>
  );
}
