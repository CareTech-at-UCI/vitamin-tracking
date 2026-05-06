"use client"

import { useState } from "react"

interface DrawerProps {
  trigger: React.ReactNode
  children: React.ReactNode
}

export default function Drawer({ trigger, children }: DrawerProps) {
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
        className={`
          fixed bottom-0 left-0 right-0
          bg-[#FFFDEE] shadow-2xl rounded-t-2xl
          transition-transform duration-300
          ${isOpen ? "translate-y-0" : "translate-y-[85%]"}
          h-[70vh]
        `}
      >
        {/* Drag / collapse bar */}
        <div
          className="w-full flex justify-center py-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Close button */}
        <div className="px-4 pb-2 flex justify-end">
          <button onClick={() => setIsOpen(false)}>
            Close
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-6 overflow-y-auto h-full">
          {children}
        </div>
      </div>
    </>
  )
}