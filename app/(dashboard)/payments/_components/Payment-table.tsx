"use client"

import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import { Header } from "@/components/Shared/Header"
import Image from "next/image"
import { useState } from "react"

interface Payment {
  id: number
  name: string
  email: string
  amount: string
  date: string
}

const mockPayments: Payment[] = [
  {
    id: 1,
    name: "David Juoal",
    email: "example@example.com",
    amount: "$20",
    date: "06/01/2025",
  },
  {
    id: 2,
    name: "David Juoal",
    email: "example@example.com",
    amount: "$20",
    date: "06/01/2025",
  },
  {
    id: 3,
    name: "David Juoal",
    email: "example@example.com",
    amount: "$20",
    date: "06/01/2025",
  },
  {
    id: 4,
    name: "David Juoal",
    email: "example@example.com",
    amount: "$20",
    date: "06/01/2025",
  },
  {
    id: 5,
    name: "David Juoal",
    email: "example@example.com",
    amount: "$20",
    date: "06/01/2025",
  },
  {
    id: 6,
    name: "David Juoal",
    email: "example@example.com",
    amount: "$20",
    date: "06/01/2025",
  },
  {
    id: 7,
    name: "David Juoal",
    email: "example@example.com",
    amount: "$20",
    date: "06/01/2025",
  },
  {
    id: 8,
    name: "David Juoal",
    email: "example@example.com",
    amount: "$20",
    date: "06/01/2025",
  },
]

export default function PaymentPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const totalItems = mockPayments.length
  return (
    <div className="min-h-screen ">
        {/* Header */}
        <Header tittle="Payments" />
      <div className="pr-5">

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-[#E6E7E6] bg-white mt-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E6E7E6] bg-[#E7ECEF] ">
                <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Tenants</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Amount</th>
                <th className="px-6 py-4 text-center text-base font-semibold text-[#343A40]">Date</th>
              </tr>
            </thead>
            <tbody>
              {mockPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-[#E6E7E6] ">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image src="/diverse-avatars.png" alt={payment.name} width={100} height={100} className="h-8 w-8 rounded-full" />
                      <div>
                        <p className="text-base font-medium text-[#343A40]">{payment.name}</p>
                        <p className="text-xs text-[#68706A]">{payment.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base font-medium text-[#343A40]">{payment.amount}</td>
                  <td className="px-6 py-4 text-base text-[#68706A] text-center">{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
          <div className="w-full ">
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