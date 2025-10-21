"use client"

import { useState } from "react"
import { Header } from "@/components/Shared/Header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { useAssignedConstractor, useGetConstractor, useGetExtermination } from "@/hooks/ApiClling"
import { Skeleton } from "@/components/ui/skeleton"

export function ExterminationPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [assignedExpert, setAssignedExpert] = useState<Record<string, string>>({})
  const itemsPerPage = 10

  const { data: session } = useSession()
  const token = session?.accessToken || ""

  const { data, isLoading } = useGetExtermination(token, currentPage, itemsPerPage)
  const { data: constractorData } = useGetConstractor(token)
  const assaignedContractor = useAssignedConstractor(token)
  const constractors = constractorData?.data.data || []
  const exterminationData = data?.data || []
  const totalItems = data?.meta?.total || 0


  const handleAssignExpert = (exterminationId: string, contractorId: string) => {
    setAssignedExpert((prev) => ({
      ...prev,
      [exterminationId]: contractorId,
    }))

    assaignedContractor.mutate({
      exterminationId,
      constractorId: contractorId,
    })

  }

  const getContractorName = (contractorId: string) => {
    const contractor = constractors.find((c) => c._id === contractorId)
    return contractor ? contractor.name : ""
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header tittle="Extermination Applications" />

      <div className="p-6">
        <div className="bg-white rounded-lg border border-[#E6E7E6] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E7ECEF] hover:bg-[#E7ECEF]">
                <TableHead className="font-semibold text-[#343A40] text-center">Name</TableHead>
                <TableHead className="font-semibold text-[#343A40] text-center">Pest Problem</TableHead>
                <TableHead className="font-semibold text-[#343A40] text-center">Assign Contractor</TableHead>
                <TableHead className="font-semibold text-[#343A40] text-center">Property Address</TableHead>
                <TableHead className="font-semibold text-[#343A40] text-center">Submitted</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28 mx-auto" /></TableCell>
                  </TableRow>
                ))
              ) : exterminationData.length > 0 ? (
                exterminationData.map((item) => (
                  <TableRow key={item._id} className="hover:bg-muted/30">
                    {/* Name */}
                    <TableCell className="font-medium px-5">
                      <p className="text-[#0F3D61] text-[16px] font-semibold hover:underline">
                        {item.fullName}
                      </p>
                      <p className="text-[#68706A] text-[12px] mt-[6px]">{item.email}</p>
                    </TableCell>

                    {/* Pest Problem */}
                    <TableCell className="text-center">
                      {item.typeOfPestProblem?.join(", ")}
                    </TableCell>

                    {
                      item.contractor ? (
                        <TableCell className="text-center">
                          {item.contractor.name}
                        </TableCell>
                      ) : (
                        <TableCell className="text-center">
                          {assignedExpert[item._id] ? (
                            // Case: already assigned
                            <span className="font-medium text-[#0F3D61]">
                              {getContractorName(assignedExpert[item._id])}
                            </span>
                          ) : constractors.length > 0 ? (
                            // Case: not assigned yet, show select
                            <Select
                              value=""
                              onValueChange={(value) => handleAssignExpert(item._id, value)}
                            >
                              <SelectTrigger className="w-[180px] mx-auto">
                                <SelectValue placeholder="Select Contractor" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {constractors.map((expert) => (
                                  <SelectItem key={expert._id} value={expert._id}>
                                    {expert.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (

                            <p className="text-gray-500">No contractors available</p>
                          )}
                        </TableCell>
                      )
                    }



                    {/* Property */}
                    <TableCell className="text-center">{item.propertyAddress}</TableCell>

                    {/* Submitted */}
                    <TableCell className="text-center text-[#68706A]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6">
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
