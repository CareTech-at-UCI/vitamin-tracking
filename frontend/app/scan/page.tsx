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
        <FoodServing name="Example" servings={4} />
      </Drawer>
    </div>
  )
}