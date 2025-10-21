"use client";

import { X, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { DocumentModal } from "./DocumentModal";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface Uploads {
  idCard?: string;
  ssn?: string;
  voucher?: string;
}

interface PersonalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  applicantEmail: string;
  avater?: string;
  uploads?: Uploads;
  ssn?: string;
}

interface DetailField {
  label: string;
  value: string;
  isSensitive: boolean;
}

export function PersonalDetailsModal({
  isOpen,
  onClose,
  applicantName,
  applicantEmail,
  avater,
  uploads,
  ssn,
}: PersonalDetailsModalProps) {
  const [openDocumentModal, setOpenDocumentModal] = useState<
    keyof Uploads | null
  >(null);

  // ✅ Mask SSN
  const maskSSN = (value?: string) => {
    if (!value) return "";
    return value.replace(/^(\d{3})-(\d{2})-(\d{4})$/, "***-**-$3");
  };

  // ✅ Sensitive details (documents)
  const sensitiveDetails = useMemo(() => {
    const ssnValue = ssn || uploads?.ssn || "123-45-6789";
    return [
      {
        key: "idCard" as const,
        label: "ID Card",
        value: uploads?.idCard || "Not uploaded",
        maskedValue: "•••••••••",
      },
      {
        key: "ssnDoc" as const,
        label: "SSN",
        value: ssnValue,
        maskedValue: maskSSN(ssnValue),
      },
      {
        key: "voucherDoc" as const,
        label: "Voucher",
        value: uploads?.voucher || "Not uploaded",
        maskedValue: "•••••••••",
      },
    ];
  }, [uploads, ssn]);

  if (!isOpen) return null;

  const details: DetailField[] = [
    { label: "Name", value: applicantName, isSensitive: false },
    { label: "Email", value: applicantEmail, isSensitive: false },
    { label: "Phone Number", value: "(555) 123-4567", isSensitive: false },
    {
      label: "Address",
      value: "123 North Street, New York, NY 10001",
      isSensitive: false,
    },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
        <div className="bg-white shadow-lg max-w-[1016px] w-full mx-4 relative rounded-[4px]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={avater || "/placeholder.svg"}
                  alt={applicantName}
                />
                <AvatarFallback>{applicantName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-gray-900">{applicantName}</h2>
                <p className="text-sm text-gray-500">{applicantEmail}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {details.map((detail) => (
              <div key={detail.label}>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {detail.label}
                </p>
                <p className="text-sm text-gray-700">{detail.value}</p>
              </div>
            ))}

            {/* Sensitive Details */}
            <div className="mt-4">
              {sensitiveDetails.map((detail) => (
                <div
                  key={detail.key}
                  className="flex items-center justify-between mb-4 border p-6 rounded-[8px]"
                >
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {detail.label}
                    </p>
                    <p className="text-sm text-gray-700 font-mono">
                      {detail.maskedValue}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setOpenDocumentModal(detail.key as keyof Uploads | null)
                    }
                    className="ml-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label={`View ${detail.label}`}
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Document Modal */}
      {openDocumentModal && (
        <DocumentModal
          isOpen={!!openDocumentModal}
          onClose={() => setOpenDocumentModal(null)}
          applicantName={applicantName}
          applicantEmail={applicantEmail}
          documentType={openDocumentModal}
          uploads={uploads}
        />
      )}
    </>
  );
}
