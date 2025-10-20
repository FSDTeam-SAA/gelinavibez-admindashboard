"use client"

import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import { Header } from "@/components/Shared/Header"
import { useGetPayment } from "@/hooks/ApiClling"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"

export default function PaymentPage() {
  const { data: session } = useSession()
  const token = session?.accessToken || ""
  console.log(token)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const getData = useGetPayment(token, currentPage, itemsPerPage)

  if (getData.isLoading) {
    return <div className="p-10 text-center text-lg">Loading...</div>
  }

  const mockPayments = getData.data?.data || []
  const totalItems = getData.data?.meta?.total || 0

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
                <tr key={payment._id} className="border-b border-[#E6E7E6] ">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image src={payment?.user?.profileImage} alt={payment?.user?.firstName} width={100} height={100} className="h-8 w-8 rounded-full" />
                      <div>
                        <p className="text-base font-medium text-[#343A40]">{payment?.user?.firstName}</p>
                        <p className="text-xs text-[#68706A]">{payment?.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base font-medium text-[#343A40]">{payment.amount}</td>
                  <td className="px-6 py-4 text-base text-[#68706A] text-center">
                    {new Date(payment.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
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