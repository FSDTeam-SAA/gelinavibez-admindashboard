"use client"

import { X } from "lucide-react"

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  message: string
  date: string
  status: string
}

interface ContactModalProps {
  contact: Contact | null
  isOpen: boolean
  onClose: () => void
}


export function ContactModal({ contact, isOpen, onClose }: ContactModalProps) {
  if (!isOpen || !contact) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md bg-white rounded-lg bg-card p-6 shadow-lg">
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-[#343A40]">
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#343A40]">Name</label>
            <p className="mt-1 text-sm text-[#343A40]">{contact.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[#343A40]">Email Address</label>
            <p className="mt-1 text-sm text-[#343A40]">{contact.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[#343A40]">Phone Number</label>
            <p className="mt-1 text-sm text-[#343A40]">{contact.phone}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[#343A40]">Message</label>
            <p className="mt-2 text-sm text-[#343A40] leading-relaxed">{contact.message}</p>
          </div>
        </div>

    
      </div>
    </div>
  )
}
