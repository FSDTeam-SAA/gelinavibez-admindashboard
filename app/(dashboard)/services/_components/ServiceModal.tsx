"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ServiceModal({ isOpen, onClose }: ServiceModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("")

 

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[1300px] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Service Categories</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Category</label>
            <Input
              type="text"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#E7ECEF] h-[48px] rounded-[8px] border-none focus:outline-none placeholder:text-[#929292] text-[#000000]"
            />
          </div>

          <div className="flex gap-3 pt-4 justify-end">
         
            <Button
              onClick={() => {
                // Handle submit
                onClose()
              }}
              className="  bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white px-10"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
