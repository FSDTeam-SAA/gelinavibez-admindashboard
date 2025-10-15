"use client"

import { Pagination } from "@/components/Shared/Pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

const requestCalls = [
  {
    id: 1,
    name: "David Juaal",
    email: "example@example.com",
    phone: "(302) 555-0107",
    visitingIn: "The Harbor Crown",
    date: "Jan 05, 2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "David Juaal",
    email: "example@example.com",
    phone: "(302) 555-0107",
    visitingIn: "The Harbor Crown",
    date: "Jan 05, 2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "David Juaal",
    email: "example@example.com",
    phone: "(302) 555-0107",
    visitingIn: "The Harbor Crown",
    date: "Jan 05, 2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "David Juaal",
    email: "example@example.com",
    phone: "(302) 555-0107",
    visitingIn: "The Harbor Crown",
    date: "Jan 05, 2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "David Juaal",
    email: "example@example.com",
    phone: "(302) 555-0107",
    visitingIn: "The Harbor Crown",
    date: "Jan 05, 2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "David Juaal",
    email: "example@example.com",
    phone: "(302) 555-0107",
    visitingIn: "The Harbor Crown",
    date: "Jan 05, 2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "David Juaal",
    email: "example@example.com",
    phone: "(302) 555-0107",
    visitingIn: "The Harbor Crown",
    date: "Jan 05, 2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "David Juaal",
    email: "example@example.com",
    phone: "(302) 555-0107",
    visitingIn: "The Harbor Crown",
    date: "Jan 05, 2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
   {
    id: 9,
    name: "David Juaal",
    email: "example@example.com",
    phone: "(302) 555-0107",
    visitingIn: "The Harbor Crown",
    date: "Jan 05, 2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
   {
    id: 10,
    name: "David Juaal",
    email: "example@example.com",
    phone: "(302) 555-0107",
    visitingIn: "The Harbor Crown",
    date: "Jan 05, 2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function RequestCallsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 10
  const totalResults = 12 // Simulating 12 total results
  const totalPages = Math.ceil(totalResults / resultsPerPage)

  const startResult = (currentPage - 1) * resultsPerPage + 1
  const endResult = Math.min(currentPage * resultsPerPage, totalResults)

  const currentCalls = requestCalls.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)

  return (
    <div className="px-5">
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-[#E7ECEF] h-[50px] border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Visiting In</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCalls.map((call) => (
              <tr key={call.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={call.avatar || "/placeholder.svg"} alt={call.name} />
                      <AvatarFallback>{call.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-base font-semibold text-[#0F3D61]">{call.name}</div>
                      <div className="text-xs text-[#68706A] font-normal">{call.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-[#68706A]">
                  {call.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-[#68706A]">
                  {call.visitingIn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-[#68706A] font-normal">
                  {call.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        startResult={startResult}
        endResult={endResult}
      />
    </div>
  )
}
