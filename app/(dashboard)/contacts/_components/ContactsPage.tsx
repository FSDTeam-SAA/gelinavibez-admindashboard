"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { ContactModal } from "./ContactModal"
import { Header } from "@/components/Shared/Header"
import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import { useGetContact } from "@/hooks/ApiClling"
import { useSession } from "next-auth/react"


export default function ContactsPage() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const { data: session } = useSession()
  const token = session?.accessToken || ""

  const itemsPerPage = 10

  const { data, isLoading } = useGetContact(token, currentPage, itemsPerPage)
  const contacts = data?.data || []
  const totalItems = data?.meta?.total || 0

  const handleViewDetails = (contact: string) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return <div className="p-10 text-center text-lg">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <Header tittle="Contacts" />

      {/* Table */}
      <div className="pr-5">
        <div className="overflow-x-auto rounded-lg border border-[#E6E7E6] mt-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6E7E6] bg-[#E7ECEF]">
                <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Name</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Phone Number</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Messages</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Date</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Status</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id} className="border-b border-[#E6E7E6] hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-base font-medium text-[#68706A]">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-sm text-[#68706A]">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base text-[#68706A]">{contact.phone}</td>
                  <td className="px-6 py-4 text-base text-[#68706A]">{contact.message}</td>
                  <td className="px-6 py-4 text-base text-[#68706A]">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(contact._id)}
                      className="flex bg-[#E7ECEF] border-none text-base text-[#0F3D61] h-[40px] hover:bg-[#E7ECEF] items-center gap-2"
                    >
                      <Eye className="h-4 w-4 text-[#0F3D61]" />
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="w-full pr-5">
        <CustomPagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>


      {isModalOpen && selectedContact && (
        <ContactModal
          contact={selectedContact}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  )
}
