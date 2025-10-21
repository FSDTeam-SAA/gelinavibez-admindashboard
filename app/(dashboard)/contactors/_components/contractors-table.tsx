"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import { useDeleteConstractor, useGetConstractorv1 } from "@/hooks/ApiClling"


interface Contractor {
  _id: string
  name: string
  companyName: string
  service: {
    name: string
  }
  createdAt: string
  image: string
}

export function ContractorsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const { data: session } = useSession()
  const token = session?.accessToken || ''

  // Fetch contractors
  const { data, isLoading } = useGetConstractorv1(token, currentPage, itemsPerPage)
  const contractors: Contractor[] = data?.data.data || []
  const totalItems = data?.data.meta.total || 0

  // Delete contractor mutation
  const deleteMutation = useDeleteConstractor(token)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)

  }

  if (isLoading) {
    return <p>Loading contractors...</p>
  }

  return (
    <div>
      <div className="rounded-lg border border-[#B0B0B0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#B0B0B0] bg-muted/50">
              <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Name</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Company / Service</th>
              <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Date</th>
              <th className="px-6 py-4 text-center text-base font-semibold text-[#131313]">Action</th>
            </tr>
          </thead>
          <tbody>
            {contractors.map((contractor) => (
              <tr key={contractor?._id} className="border-b border-[#B0B0B0] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contractor?.image || "/placeholder.svg"} alt={contractor?.name} />
                      <AvatarFallback>{contractor?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-base font-medium">{contractor?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-base">
                  {contractor?.companyName} <br />
                  <span className="text-xs text-muted-foreground">{contractor?.service?.name}</span>
                </td>
                <td className="px-6 py-4 text-base">{formatDate(contractor?.createdAt)}</td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(contractor?._id)}
                    disabled={deleteMutation.isPending}
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
      <div className="w-full mt-4">
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
