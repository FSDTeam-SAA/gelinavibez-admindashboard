/*eslint-disable */
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function ContactorsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<{
    requestId: string
    contractorId: string
    contractorName: string
  } | null>(null)

  const itemsPerPage = 10
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const token = session?.accessToken
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  // 1. Fetch Paginated Requests
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["contractor-requests", currentPage, token],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/contractor?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("Failed to fetch requests")
      return res.json()
    },
    enabled: !!token,
  })

  // 2. Fetch All Contractors (for the dropdown)
  const { data: allContractorsRes } = useQuery({
    queryKey: ["all-contractors", token],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/user/all-user?role=contractor`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("Failed to fetch contractors")
      return res.json()
    },
    enabled: !!token,
  })

  // 3. Assign Mutation logic
  const assignMutation = useMutation({
    mutationFn: async ({ requestId, contractorId }: { requestId: string; contractorId: string }) => {
      const res = await fetch(`${baseUrl}/contractor/${requestId}/assign-contractor/${contractorId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Assignment failed")
      }
      return res.json()
    },
    onSuccess: (responseData, variables) => {
      toast.success("Contractor assigned successfully!")

      // Update local cache immediately so the UI changes without a page refresh
      queryClient.setQueryData(["contractor-requests", currentPage, token], (old: any) => {
        if (!old?.data?.data) return old

        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((item: any) =>
              // responseData.data is the updated object from your API
              item._id === variables.requestId ? responseData.data : item
            ),
          },
        }
      })

      // Invalidate to ensure data consistency across other possible views
      queryClient.invalidateQueries({ queryKey: ["contractor-requests"] })
      
      setIsModalOpen(false)
      setSelectedAssignment(null)
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to assign contractor")
    },
  })

  const handleSelect = (requestId: string, contractorId: string) => {
    const contractor = allContractorsRes?.data?.find((c: any) => c._id === contractorId)
    const name = contractor
      ? `${contractor.firstName} ${contractor.lastName || ""}`.trim()
      : "Unknown Contractor"

    setSelectedAssignment({ requestId, contractorId, contractorName: name })
    setIsModalOpen(true)
  }

  const requests = apiResponse?.data?.data || []
  const totalItems = apiResponse?.data?.meta?.total || 0
  const contractors = allContractorsRes?.data || []

  return (
    <div className="min-h-screen bg-muted/30">
      <Header tittle="Contractor Applications" />

      <div className="p-6">
        <div className="bg-white rounded-lg border border-[#E6E7E6] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E7ECEF] hover:bg-[#E7ECEF]">
                <TableHead className="font-semibold text-[#343A40] text-center">Company Name</TableHead>
                <TableHead className="font-semibold text-[#343A40] text-center">Services</TableHead>
                <TableHead className="font-semibold text-[#343A40] text-center">Assigned Contractor</TableHead>
                <TableHead className="font-semibold text-[#343A40] text-center">Company Address</TableHead>
                <TableHead className="font-semibold text-[#343A40] text-center">Submitted</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                requests.map((item: any) => {
                  // Check if a contractor is assigned based on the object structure you provided
                  const assignedCon = item.assigningContractor;
                  const hasContractor = !!assignedCon?.firstName;

                  return (
                    <TableRow key={item._id} className="hover:bg-muted/30">
                      <TableCell className="font-medium px-5">
                        <p className="text-[#0F3D61] text-[16px] font-semibold">{item.companyName}</p>
                        <p className="text-[#68706A] text-[12px] mt-[6px]">{item.email}</p>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {item.service?.map((s: any) => (
                            <span key={typeof s === "string" ? s : s._id} className="text-xs bg-slate-100 px-2 py-1 rounded">
                              {typeof s === "string" ? s : s.name}
                            </span>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        {hasContractor ? (
                          <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="font-medium text-green-900">
                              {assignedCon.firstName} {assignedCon.lastName || ""}
                            </span>
                          </div>
                        ) : (
                          <Select
                            disabled={assignMutation.isPending}
                            onValueChange={(cid) => handleSelect(item._id, cid)}
                          >
                            <SelectTrigger className="w-[220px] mx-auto bg-white border-[#E6E7E6]">
                              <SelectValue placeholder="Assign a Contractor" />
                            </SelectTrigger>
                            <SelectContent className="bg-white max-h-[300px]">
                              {contractors.length > 0 ? (
                                contractors.map((con: any) => (
                                  <SelectItem key={con._id} value={con._id}>
                                    {con.firstName} {con.lastName || ""}
                                  </SelectItem>
                                ))
                              ) : (
                                <p className="p-2 text-xs text-center text-muted-foreground">No contractors found</p>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>

                      <TableCell className="text-center text-[#4B5563]">{item.CompanyAddress || "—"}</TableCell>

                      <TableCell className="text-center text-[#4B5563]">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <CustomPagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[440px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#0F3D61]">Confirm Assignment</DialogTitle>
            <DialogDescription className="pt-2 text-base">
              Are you sure you want to assign 
              <span className="font-bold text-[#0F3D61]"> {selectedAssignment?.contractorName} </span> 
              to this request?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white"
              onClick={() =>
                selectedAssignment &&
                assignMutation.mutate({
                  requestId: selectedAssignment.requestId,
                  contractorId: selectedAssignment.contractorId,
                })
              }
              disabled={assignMutation.isPending}
            >
              {assignMutation.isPending ? "Assigning..." : "Confirm & Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}