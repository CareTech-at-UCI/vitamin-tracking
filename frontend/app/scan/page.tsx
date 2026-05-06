"use client"

import { useState } from "react"
import Drawer from "./_components/Drawer"
import FoodServing from "./_components/FoodServing"

export default function Scan() {
    const [step, setStep] = useState<"drawer" | "overlay">("drawer")

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

                        <button className="absolute right-0 -bottom-[60px] flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#F16F33] text-[#000000] text-2xl font-bold font-[Inter]">
                            +
                        </button>
                    </div>
                </Drawer>
            )}

            {step === "overlay" && (
                <>
                    {/* background overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setStep("drawer")}
                    />

                    {/* bottom page */}
                    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-[#FDFAE7] rounded-t-[1.25rem] overflow-hidden z-50">

                        <div className="flex flex-col items-center pt-4 gap-4">

                            {/* top pill */}
                            <div className="flex w-[8vh] h-[8vh] items-center justify-center rounded-full bg-[#6FAF6B]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="23" viewBox="0 0 27 23" fill="none">
                                    <path d="M1 14.8102L8.20216 20.8535" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M8.59082 21.3002L25.6247 0.999993" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>

                            {/* title */}
                            <div className='text-center text-[#0A3323] font-[Montserrat Alternates] text-[24px] font-semibold leading-[100%] tracking-[-1.92px]'>
                                Log Completed
                            </div>

                            {/* image placeholder */}
                            <div className="w-[12vh] h-[12vh] rounded-lg bg-gray-300" />

                            {/* description */}
                            <div className="w-[320px] text-center text-[#09090B] font-[Instrument Sans] text-[16px] font-medium tracking-[-0.8px]">
                                Your [Food Name] has been successfully added to your daily log.
                            </div>

                            {/* buttons */}
                            <div className="flex w-full justify-between px-6 pt-2">

                                <button className="w-[8rem] h-[3rem] flex items-center justify-center bg-[#26612F] text-[#FDFAE7] font-[Instrument Sans] text-[0.9rem] font-medium tracking-[-0.8px] rounded-[20px]">
                                    Go to Home
                                </button>

                                <button className="w-[8rem] h-[3rem] flex items-center justify-center bg-[#F16F33] text-[#FDFAE7] font-[Instrument Sans] text-[0.9rem] font-medium tracking-[-0.8px] rounded-[20px]">
                                    Continue Scanning
                                </button>

                            </div>

                        </div>
                    </div>
                </>
            )}
        </div>
    )
}