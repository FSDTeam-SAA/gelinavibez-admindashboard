"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ContactModal } from "./ContactModal";
import { Header } from "@/components/Shared/Header";
import Image from "next/image";
import { CustomPagination } from "@/components/Shared/CustomePaginaion";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: string;
  image?:string
}

const mockContacts: Contact[] = [
  {
    id: 1,
    name: "David Juoal",
    email: "davidjuoal@example.com",
    phone: "(302) 555-0107",
    image:"/assets/expart4.png",
    message: "I would like to come to see your op...",
    date: "Jun 08, 2025",
    status: "Details",
  },
  {
    id: 2,
    name: "David Juoal",
    email: "davidjuoal@example.com",
    phone: "(302) 555-0107",
    message: "I would like to come to see your op...",
    date: "Jun 08, 2025",
    status: "Details",
  },
  {
    id: 3,
    name: "David Juoal",
    email: "davidjuoal@example.com",
    phone: "(302) 555-0107",
    message: "I would like to come to see your op...",
    date: "Jun 08, 2025",
    status: "Details",
  },
  {
    id: 4,
    name: "David Juoal",
    email: "davidjuoal@example.com",
    phone: "(302) 555-0107",
    message: "I would like to come to see your op...",
    date: "Jun 08, 2025",
    status: "Details",
  },
  {
    id: 5,
    name: "David Juoal",
    email: "davidjuoal@example.com",
    phone: "(302) 555-0107",
    message: "I would like to come to see your op...",
    date: "Jun 08, 2025",
    status: "Details",
  },
  {
    id: 6,
    name: "David Juoal",
    email: "davidjuoal@example.com",
    phone: "(302) 555-0107",
    message: "I would like to come to see your op...",
    date: "Jun 08, 2025",
    status: "Details",
  },
  {
    id: 7,
    name: "David Juoal",
    email: "davidjuoal@example.com",
    phone: "(302) 555-0107",
    message: "I would like to come to see your op...",
    date: "Jun 08, 2025",
    status: "Details",
  },
  {
    id: 8,
    name: "David Juoal",
    email: "davidjuoal@example.com",
    phone: "(302) 555-0107",
    message: "I would like to come to see your op...",
    date: "Jun 08, 2025",
    status: "Details",
  },
];

export default function ContactsPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const totalItems = mockContacts.length

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen ">
      <div className="">
        {/* Header */}
        <Header tittle="Contacts" />

        {/* Table */}
        <div className="pr-5">
          <div className="overflow-x-auto rounded-lg border border-[#E6E7E6]  mt-6 ">
            <table className="w-full ">
              <thead>
                <tr className="border-b border-[#E6E7E6] bg-[#E7ECEF] rounded-[8px]">
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">
                    Messages
                  </th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-[#E6E7E6] hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                      <Image
                        src={contact.image || "/diverse-profile-avatars.png"}
                        alt={contact.image || "Profile"}
                        width={1000}
                        height={1000}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-base font-medium text-[#68706A]">
                          {contact.name}
                        </p>
                        <p className="text-sm text-[#68706A]">
                          {contact.email}
                        </p>
                      </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-base text-[#68706A]">
                      {contact.phone}
                    </td>
                    <td className="px-6 py-4 text-base text-[#68706A]">
                      {contact.message}
                    </td>
                    <td className="px-6 py-4 text-base text-[#68706A]">
                      {contact.date}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(contact)}
                        className="flex bg-[#E7ECEF] border-none text-base text-[#0F3D61] h-[40px] hover:bg-[#E7ECEF] items-center gap-2"
                      >
                        <Eye className="h-4 w-4 text-[#0F3D61]" />
                        {contact.status}
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
      </div>

      {/* Contact Modal */}
      <ContactModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
