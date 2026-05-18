"use client"

interface LogCompletedOverlayProps {
    foodName: string
    imageSrc?: string
    onClose: () => void
    onGoHome?: () => void
    onContinue?: () => void
}

export default function LogCompletedOverlay({
    foodName,
    imageSrc,
    onClose,
    onGoHome,
    onContinue,
}: LogCompletedOverlayProps) {
    return (
        <>
            {/* background overlay */}
            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            />

            {/* bottom page */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-[#FDFAE7] rounded-t-[1.25rem] overflow-hidden z-50">

                <div className="flex flex-col items-center pt-4 gap-4">

                    {/* top pill */}
                    <div className="flex w-[8vh] h-[8vh] items-center justify-center rounded-full bg-[#6FAF6B]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="27"
                            height="23"
                            viewBox="0 0 27 23"
                            fill="none"
                        >
                            <path
                                d="M1 14.8102L8.20216 20.8535"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M8.59082 21.3002L25.6247 0.999993"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* title */}
                    <div className="text-center text-[#0A3323] font-[Montserrat Alternates] text-[1.5rem] font-semibold leading-[100%] tracking-[-1.92px]">
                        Log Completed
                    </div>

                    {/* image */}
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={foodName}
                            className="w-[12vh] h-[12vh] rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-[12vh] h-[12vh] rounded-lg bg-gray-300" />
                    )}

                    {/* description */}
                    <div className="w-[80vw] text-center text-[#09090B] font-[Instrument Sans] text-[1rem] font-medium tracking-[-0.8px]">
                        Your {foodName} has been successfully added to your daily log.
                    </div>

                    {/* buttons */}
                    <div className="flex w-full justify-between px-6 pt-2">

                        <button
                            onClick={onGoHome}
                            className="w-[8rem] h-[3rem] flex items-center justify-center bg-[#26612F] text-[#FDFAE7] font-[Instrument Sans] text-[0.9rem] font-medium tracking-[-0.8px] rounded-[20px]"
                        >
                            Go to Home
                        </button>

                        <button
                            onClick={onContinue}
                            className="w-[8rem] h-[3rem] flex items-center justify-center bg-[#F16F33] text-[#FDFAE7] font-[Instrument Sans] text-[0.9rem] font-medium tracking-[-0.8px] rounded-[20px]"
                        >
                            Continue Scanning
                        </button>

                    </div>

                </div>
            </div>
        </>
    )
}