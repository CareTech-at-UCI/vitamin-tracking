"use client"

import Drawer from "./_components/Drawer"
import FoodServing from "./_components/FoodServing"

export default function Scan() {
  return (
    <div className="block md:hidden p-4">
        <Drawer
            trigger={
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Open Drawer
                </button>
            }
        >
            <div className="relative flex flex-col gap-[5rem]">
                <FoodServing name="Example"/>
                <FoodServing name="Example WH"/>

                {/* Floating button */}
                <button className="absolute right-0 -bottom-[60px] flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#F16F33] text-[#000000] text-2xl font-bold font-[Inter]">
                    +
                </button>
            </div>
    </Drawer>
    </div>
  )
}