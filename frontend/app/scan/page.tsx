"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import Drawer from "./_components/Drawer"
import FoodServing from "./_components/FoodServing"
import LogCompleted from "./_components/LogCompleted"

export default function Scan() {
    const [step, setStep] = useState<"drawer" | "overlay">("drawer")

    const router = useRouter()

    return (
        <div className="block md:hidden p-4">
            {step === "drawer" && (
                <Drawer
                    trigger={
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">
                            Open Drawer
                        </button>
                    }
                    onAction={() => setStep("overlay")}
                >
                    <div className="relative flex flex-col gap-[5rem]">
                        <FoodServing name="Example" />
                        <FoodServing name="Example WH" />

                        <button className="absolute right-0 -bottom-[5rem] flex items-center justify-center w-[3rem] h-[3rem] rounded-full bg-[#F16F33] text-[#000000] text-2xl font-bold font-[Inter]">
                            +
                        </button>
                    </div>
                </Drawer>
            )}

            {step === "overlay" && (
                <LogCompleted
                    foodName="Pizza"
                    imageSrc="/pizza.png"
                    onClose={() => setStep("drawer")}
                    onGoHome={() => router.push("/dashboard")}
                    onContinue={() => router.push("/scan")}
                />
            )}
        </div>
    )
}