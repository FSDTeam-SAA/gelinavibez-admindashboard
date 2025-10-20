"use client"

import { useGetSingelContact } from "@/hooks/ApiClling"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

interface ContactModalProps {
  contact: string | null
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ contact, isOpen, onClose }: ContactModalProps) {
  const { data: session } = useSession()
  const token = session?.accessToken || ""

  // Fetch single contact only when modal is open & ID exists
  const { data, isLoading } = useGetSingelContact(token, contact as string)

  const contactData = data?.data

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        {/* <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
          <DialogDescription>
            View all information submitted by the contact.
          </DialogDescription>
        </DialogHeader> */}

        {isLoading ? (
          <div className="py-10 text-center text-gray-600">Loading contact...</div>
        ) : contactData ? (
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-[#343A40]">Name</label>
              <p className="mt-1 text-sm text-[#343A40]">
                {contactData.firstName} {contactData.lastName}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-[#343A40]">
                Email Address
              </label>
              <p className="mt-1 text-sm text-[#343A40]">{contactData.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-[#343A40]">
                Phone Number
              </label>
              <p className="mt-1 text-sm text-[#343A40]">{contactData.phone}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-[#343A40]">Message</label>
              <p className="mt-2 text-sm text-[#343A40] leading-relaxed">
                {contactData.message}
              </p>
            </div>

            {/* <div>
              <label className="text-sm font-medium text-[#343A40]">Created At</label>
              <p className="mt-1 text-sm text-[#343A40]">
                {new Date(contactData.createdAt).toLocaleString()}
              </p>
            </div> */}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-600">
            No contact details found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
