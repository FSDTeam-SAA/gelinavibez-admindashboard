"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Edit } from "lucide-react"
import { Header } from "@/components/Shared/Header"
import Bradecumb from "@/components/Shared/Bradecumb"
import { CustomPagination } from "@/components/Shared/CustomePaginaion"

interface Apartment {
  id: string
  dayOrEvent: string
  name: string
  date: string
  status: "Approve" | "Denied" | "Pending"
}

const mockApartments: Apartment[] = [
  {
    id: "1",
    dayOrEvent: "Friday",
    name: "The Harbor Crown",
    date: "04/21/2025 03:18pm",
    status: "Approve",
  },
  {
    id: "2",
    dayOrEvent: "Friday",
    name: "The Harbor Crown",
    date: "04/21/2025 03:18pm",
    status: "Approve",
  },
  {
    id: "3",
    dayOrEvent: "Friday",
    name: "The Harbor Crown",
    date: "04/21/2025 03:18pm",
    status: "Denied",
  },
  {
    id: "4",
    dayOrEvent: "Friday",
    name: "The Harbor Crown",
    date: "04/21/2025 03:18pm",
    status: "Pending",
  },
  {
    id: "5",
    dayOrEvent: "Friday",
    name: "The Harbor Crown",
    date: "04/21/2025 03:18pm",
    status: "Approve",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approve":
      return "text-[#27BE69] bg-[#E7ECEF] "
    case "Denied":
      return "text-[#E5102E] bg-[#FEECEE]"
    case "Pending":
      return "text-[#816D01] bg-[#FBF8E8]"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approve":
      return "✓"
    case "Denied":
      return "✕"
    case "Pending":
      return "◐"
    default:
      return "•"
  }
}

export default function ApartmentPage() {
  const router = useRouter()
 const [currentPage, setCurrentPage] = useState(1)
   const itemsPerPage = 5
   const totalItems = mockApartments.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
        <Header tittle="Apartment Listings Management" />

      {/* Breadcrumb */}
      <div className="flex justify-between mt-10 pr-5 items-center">
      <Bradecumb pageName="Apartment Listings" />
        <Button
            onClick={() => router.push("/add-apartment")}
            className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Apartment Listing
          </Button>
      </div>

      {/* Main Content */}
      <div className="">
        <div className="flex justify-end mb-6">
        
        </div>

        {/* Table */}
        <Card className="overflow-hidden mr-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-[#E6E7E6]">
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Day Or Event</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Apartment Name</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Date</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Status</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockApartments.map((apartment) => (
                  <tr key={apartment.id} className="border-b border-[#E6E7E6] ">
                    <td className="px-6 py-4 text-base text-[#424242]">{apartment.dayOrEvent}</td>
                    <td className="px-6 py-4 text-base text-[#424242]">{apartment.name}</td>
                    <td className="px-6 py-4 text-base text-[#424242]">{apartment.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-10 h-[40px]  rounded-[8px] text-base font-medium ${getStatusColor(apartment.status)}`}
                      >
                        {getStatusIcon(apartment.status)} {apartment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Card>
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
    </div>
  )
}
