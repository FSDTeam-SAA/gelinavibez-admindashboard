"use client"

import { X, Eye } from "lucide-react"
import { useState } from "react"
import { DocumentModal } from "./DocumentModal"

interface PersonalDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  applicantName: string
  applicantEmail: string
}

interface DetailField {
  label: string
  value: string
  isSensitive: boolean
}

export function PersonalDetailsModal({ isOpen, onClose, applicantName, applicantEmail }: PersonalDetailsModalProps) {
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({
    idCard: false,
    ssn: false,
    voucher: false,
  })
  const [openDocumentModal, setOpenDocumentModal] = useState<string | null>(null)
  console.log(setVisibleFields)
  // const toggleFieldVisibility = (fieldName: string) => {
  //   setVisibleFields((prev) => ({
  //     ...prev,
  //     [fieldName]: !prev[fieldName],
  //   }))
  // }

  const details: DetailField[] = [
    { label: "Name", value: applicantName, isSensitive: false },
    { label: "Email", value: applicantEmail, isSensitive: false },
    { label: "Phone Number", value: "(555) 123-4567", isSensitive: false },
    { label: "Address", value: "123 North Street, New York, NY 10001", isSensitive: false },
  ]

  const sensitiveDetails = [
    { key: "idCard", label: "ID Card", value: "DL-1234567", maskedValue: "DL-****67" },
    { key: "ssn", label: "SSN", value: "123-45-6789", maskedValue: "***-**-6789" },
    { key: "voucher", label: "Voucher", value: "VCH-9876543", maskedValue: "VCH-****543" },
  ]

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
        <div className="bg-white  shadow-lg max-w-[1016px] w-full mx-4 relative rounded-[4px]">
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full z-10">
            <X className="w-5 h-5" />
          </button>

          {/* Header with avatar */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                {applicantName.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{applicantName}</h2>
                <p className="text-sm text-gray-500">{applicantEmail}</p>
              </div>
            </div>
          </div>

          {/* Details content */}
          <div className="p-6 space-y-4">
            {/* Non-sensitive details */}
            {details.map((detail) => (
              <div key={detail.label}>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{detail.label}</p>
                <p className="text-sm text-gray-700">{detail.value}</p>
              </div>
            ))}

            {/* Sensitive details with eye toggle */}
            <div className="mt-4">
              {sensitiveDetails.map((detail) => (
                <div key={detail.key} className="flex items-center justify-between mb-4 border p-6 rounded-[8px]">
                  <div className="flex-1 ">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{detail.label}</p>
                    <p className="text-sm text-gray-700 font-mono">
                      {visibleFields[detail.key] ? detail.value : detail.maskedValue}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpenDocumentModal(detail.key)}
                    className="ml-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label={`View ${detail.label}`}
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
         
        </div>
      </div>

      <DocumentModal
        isOpen={openDocumentModal === "idCard"}
        onClose={() => setOpenDocumentModal(null)}
        applicantName={applicantName}
        applicantEmail={applicantEmail}
        documentType="idCard"
      />
      <DocumentModal
        isOpen={openDocumentModal === "ssn"}
        onClose={() => setOpenDocumentModal(null)}
        applicantName={applicantName}
        applicantEmail={applicantEmail}
        documentType="ssn"
      />
      <DocumentModal
        isOpen={openDocumentModal === "voucher"}
        onClose={() => setOpenDocumentModal(null)}
        applicantName={applicantName}
        applicantEmail={applicantEmail}
        documentType="voucher"
      />
    </>
  )
}
