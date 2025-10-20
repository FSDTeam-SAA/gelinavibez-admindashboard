"use client"

import { X } from "lucide-react"
import Image from "next/image"

interface DocumentModalProps {
  isOpen: boolean
  onClose: () => void
  applicantName: string
  applicantEmail: string
  documentType: "idCard" | "ssn" | "voucher"
}

const getDocumentContent = (documentType: string) => {
  switch (documentType) {
    case "idCard":
      return {
        title: "ID Card",
        image: "/assets/ssn.jpg",
      }
    case "ssn":
      return {
        title: "Social Security Number",
        image: "/assets/ssn.jpg",
      }
    case "voucher":
      return {
        title: "Voucher",
        image: "/assets/ssn.jpg",
      }
    default:
      return {
        title: "Document",
        image: "/assets/ssn.jpg",
      }
  }
}

export function DocumentModal({ isOpen, onClose, applicantName, documentType }: DocumentModalProps) {
  if (!isOpen) return null

  const content = getDocumentContent(documentType)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
      <div className="bg-white shadow-lg max-w-[1076px] h-[95vh] w-full rounded-[4px] mx-4 relative">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{content.title}</h2>
          <p className="text-sm text-gray-500">{applicantName}</p>
        </div>

        {/* Document content */}
        <div className="p-8">
          <Image src={content.image || "/placeholder.svg"} alt={content.title} width={1000} height={1000} className="w-full h-auto rounded-lg" />
        </div>

        
      </div>
    </div>
  )
}
