"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Plus } from "lucide-react"
import AddLocationModal from "./add-location-modal"

export default function AddLocationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
      >
        <Plus size={18} />
        <span>Add New Location</span>
        <MapPin size={18} />
      </Button>

      <AddLocationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
