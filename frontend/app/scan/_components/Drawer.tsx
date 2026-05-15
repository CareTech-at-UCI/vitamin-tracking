"use client"

import { useState } from "react"

interface DrawerProps {
  children: React.ReactNode
  onAction?: () => void
  totalServings: number
}

export default function Drawer({
  children,
  onAction,
  totalServings,
}: DrawerProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#FFFDEE] shadow-2xl rounded-t-2xl transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-[95%]"
        } h-[85vh] flex flex-col`}
      >
        {/* Drag / collapse bar */}
        <div
          className="w-full flex justify-center py-2 cursor-pointer shrink-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-[4rem]">
          {children}
        </div>

        {/* Bottom bar */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t shrink-0">
          <div className="text-black font-[Instrument Sans] text-[1rem] font-medium tracking-[-0.8px]">
            Servings: {totalServings}
          </div>

          <button
            onClick={() => {
              setIsOpen(false)
              onAction?.()
            }}
            className="w-[6rem] h-[2rem] rounded-[20px] bg-[#26612F] text-white font-[Instrument Sans] text-[1rem] font-bold tracking-[-0.8px]"
          >
            Add Meal
          </button>
        </div>
      </div>
    </>
  )
}