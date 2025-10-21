"use client"

import { X } from "lucide-react"
import Image from "next/image"

interface Uploads {
  idCard?: string
  ssn?: string
  voucher?: string
}

interface DocumentModalProps {
  isOpen: boolean
  onClose: () => void
  applicantName: string
  applicantEmail: string
  documentType: keyof Uploads
  uploads?: Uploads
}

// ✅ Helper for title
const getDocumentTitle = (documentType: keyof Uploads): string => {
  switch (documentType) {
    case "idCard":
      return "ID Card"
    case "ssn":
      return "Social Security Number"
    case "voucher":
      return "Voucher"
    default:
      return "Document"
  }
}

export function DocumentModal({
  isOpen,
  onClose,
  applicantName,
  applicantEmail,
  documentType,
  uploads,
}: DocumentModalProps) {
  if (!isOpen) return null

  const title = getDocumentTitle(documentType)

  // ✅ Dynamically show uploaded image or fallback
  const imageUrl =
    uploads?.[documentType]
    console.log(documentType,'aaaaaaaaaaaaaaa')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
      <div className="bg-white shadow-lg max-w-[800px] h-[70vh] w-full rounded-[4px] mx-4 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{applicantName}</p>
          <p className="text-xs text-gray-400">{applicantEmail}</p>
        </div>

        {/* Document content */}
        <div className="p-8 overflow-auto h-full w-full flex items-center justify-center">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={10000}
            height={10000}
            className="w-full h-full rounded-lg object-contain"
          />
        </div>
      </div>
    </div>
  )
}
