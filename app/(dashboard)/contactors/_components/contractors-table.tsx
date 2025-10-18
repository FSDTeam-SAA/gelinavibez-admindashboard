"use client"

import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"

interface Contractor {
  id: string
  name: string
  department: string
  date: string
  time: string
  avatar: string
}

const contractors: Contractor[] = [
  {
    id: "1",
    name: "Wiliams",
    department: "Contractor",
    date: "04/21/2025",
    time: "03:18pm",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wiliams",
  },
  {
    id: "2",
    name: "David Steward",
    department: "Renovator",
    date: "04/21/2025",
    time: "03:18pm",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: "3",
    name: "Kathryn Murphy",
    department: "Contractor",
    date: "04/21/2025",
    time: "03:18pm",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kathryn",
  },
  {
    id: "4",
    name: "Courtney Henry",
    department: "Renovator",
    date: "04/21/2025",
    time: "03:18pm",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Courtney",
  },
  {
    id: "5",
    name: "Devon Lane",
    department: "Renovator",
    date: "04/21/2025",
    time: "03:18pm",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Devon",
  },
]

export function ContractorsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalItems = contractors.length

  return (
    <div>
    <div className="rounded-lg border border-[#B0B0B0] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#B0B0B0] bg-muted/50">
            <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Name</th>
            <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Department</th>
            <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Date</th>
            <th className="px-6 py-4 text-center text-base font-semibold text-[#131313]">Action</th>
          </tr>
        </thead>
        <tbody>
          {contractors.map((contractor) => (
            <tr key={contractor.id} className="border-b border-[#B0B0B0] transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contractor.avatar || "/placeholder.svg"} alt={contractor.name} />
                    <AvatarFallback>{contractor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-base font-medium">{contractor.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-base">{contractor.department}</td>
              <td className="px-6 py-4 text-base">
                {contractor.date}
                <br />
                <span className="text-xs text-muted-foreground">{contractor.time}</span>
              </td>
              <td className="px-6 py-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
      {/* Pagination */}
      <div className="w-full">
        <CustomPagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
