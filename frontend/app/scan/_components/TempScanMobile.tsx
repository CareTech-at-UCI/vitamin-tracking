"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import Drawer from "./Drawer"
import FoodServing from "./FoodServing"
import LogCompleted from "./LogCompleted"

export default function Scan() {
    const [step, setStep] = useState<"proceed" | "drawer" | "overlay">("proceed")
    const [isProceedClosing, setIsProceedClosing] = useState(false)

    // servings state
    const [servings, setServings] = useState({
        example: 1,
        exampleWH: 1,
    })

    const totalServings =
        servings.example + servings.exampleWH

    const router = useRouter()

    return (
        <div className="relative block md:hidden min-h-screen overflow-hidden bg-black">
            {step === "proceed" && (
                <>
                    {/* Mock camera background */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid aspect-square w-[200px] grid-cols-2 grid-rows-2 gap-[42%]">
                            <span className="rounded-tl-2xl border-l-[3px] border-t-[3px] border-white" />
                            <span className="rounded-tr-2xl border-r-[3px] border-t-[3px] border-white" />
                            <span className="rounded-bl-2xl border-b-[3px] border-l-[3px] border-white" />
                            <span className="rounded-br-2xl border-b-[3px] border-r-[3px] border-white" />
                        </div>
                    </div>

                    {/* Proceed drawer */}
                    <div
                        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-[40px] bg-[#FFFDEE] transition-transform duration-300 ${
                            isProceedClosing
                                ? "translate-y-full"
                                : "translate-y-0"
                        }`}
                    >
                        <div className="rounded-t-[36px] bg-[linear-gradient(90deg,#1A4D20_0%,#0F2414_100%)] px-6 pb-4 pt-6 text-white">
                            <div className="mx-auto mb-8 h-2 w-24 rounded-full bg-white/80" />

                            <h2 className="text-center text-[20px] font-semibold">
                                Are you sure you wish to proceed?
                            </h2>
                        </div>

                        <div className="px-8 pb-8 pt-6">
                            <p className="text-center font-medium text-black">
                                We’ve paused the camera to prevent accidental scans.
                                Tap “Confirm Scanning” to resume logging.
                            </p>

                            <div className="mt-10 flex justify-center gap-4">
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="rounded-full bg-[#26612F] px-5 py-3 text-white"
                                >
                                    Go to Dashboard
                                </button>

                                <button
                                    onClick={() => {
                                        setIsProceedClosing(true)

                                        setTimeout(() => {
                                            setStep("drawer")
                                            setIsProceedClosing(false)
                                        }, 300)
                                    }}
                                    className="rounded-full bg-[#F16F33] px-5 py-3 text-white"
                                >
                                    Confirm Scanning
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {step === "drawer" && (
                <Drawer
                    totalServings={totalServings}
                    onAction={() => setStep("overlay")}
                >
                    <div className="relative flex flex-col gap-[5rem]">
                        <FoodServing
                            name="Example"
                            servings={servings.example}
                            onServingsChange={(value) =>
                                setServings((prev) => ({
                                    ...prev,
                                    example: value,
                                }))
                            }
                        />

                        <FoodServing
                            name="Example WH"
                            servings={servings.exampleWH}
                            onServingsChange={(value) =>
                                setServings((prev) => ({
                                    ...prev,
                                    exampleWH: value,
                                }))
                            }
                        />

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
                    onContinue={() => {
                        setStep("proceed")
                        setIsProceedClosing(false)
                    }}
                />
            )}
        </div>
    )
}