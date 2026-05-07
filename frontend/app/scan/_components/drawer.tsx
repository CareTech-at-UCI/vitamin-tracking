"use client"

import { useState } from "react"

interface DrawerProps {
  trigger: React.ReactNode
  children: React.ReactNode
  onAction?: () => void
}

export default function Drawer({ trigger, children, onAction }: DrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
        {/* Trigger */}
        <div onClick={() => setIsOpen(true)}>
            {trigger}
        </div>

        {/* Overlay */}
        {isOpen && (
        <div
            className="fixed inset-0 bg-black/40"
             onClick={() => setIsOpen(false)}
        />
        )}

        {/* Bottom Drawer */}
        <div
            className={`fixed bottom-0 left-0 right-0 bg-[#FFFDEE] shadow-2xl rounded-t-2xl transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-[95%]"} h-[85vh]`}
        >
        {/* Drag / collapse bar */}
        <div
            className="w-full flex justify-center py-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="px-4 py-[4rem] overflow-y-auto h-full">
            {children}
        </div>
            {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-between border-t">
            <div className='text-black font-[Instrument Sans] text-[1rem] font-medium tracking-[-0.8px]'>
                Servings: 20
            </div>
            <button
                onClick={
                    () => {
                        setIsOpen(false)
                        onAction?.()
                    }
                }
                className="w-[6rem] h-[2rem] rounded-[20px] bg-[#26612F] text-white font-[Instrument Sans] text-[1rem] font-bold tracking-[-0.8px]"
            >
                Add Meal
            </button>
        </div>
        </div>
    </>
  )
}