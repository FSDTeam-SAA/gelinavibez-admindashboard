/*eslint-disable  */
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
  const [selectedAssignment, setSelectedAssignment] = useState<{requestId: string, contractorId: string} | null>(null)
  
  const itemsPerPage = 10
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const token = session?.accessToken 
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  // 1. Fetch Contractor Applications
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["contractors", currentPage, token],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/contractor?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error("Failed to fetch data")
      return res.json()
    },
    enabled: !!token,
  })

  // 2. Fetch All Available Contractors for Dropdown
  const { data: allContractorsRes } = useQuery({
    queryKey: ["all-contractors-list", token],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/user/all-user?role=contractor`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error("Failed to fetch contractors")
      return res.json()
    },
    enabled: !!token,
  })

  // 3. Assignment Mutation
  const assignMutation = useMutation({
    mutationFn: async ({ requestId, contractorId }: { requestId: string; contractorId: string }) => {
      // Updated Endpoint: /contractor/{id}/assign-contractor/{cid}
      const res = await fetch(`${baseUrl}/contractor/${requestId}/assign-contractor/${contractorId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error("Assignment failed")
      return res.json()
    },
    onSuccess: (data) => {
      toast.success(data.message || "Contractor assigned successfully")
      queryClient.invalidateQueries({ queryKey: ["contractors"] })
      setIsModalOpen(false)
      setSelectedAssignment(null)
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong")
    },
  })

  const handleOpenConfirm = (requestId: string, contractorId: string) => {
    setSelectedAssignment({ requestId, contractorId })
    setIsModalOpen(true)
  }

  const handleConfirm = () => {
    if (selectedAssignment) {
      assignMutation.mutate(selectedAssignment)
    }
  }

  // Data mapping based on your JSON structure
  const contractorsDropdown = allContractorsRes?.data || []
  const contractorData = apiResponse?.data?.data || [] // Accessing data.data
  const totalItems = apiResponse?.data?.meta?.total || 0

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
                <TableHead className="font-semibold text-[#343A40] text-center">Assign Contractor</TableHead>
                <TableHead className="font-semibold text-[#343A40] text-center">Company Address</TableHead>
                <TableHead className="font-semibold text-[#343A40] text-center">Submitted</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                ))
              ) : (
                contractorData.map((item: any) => (
                  <TableRow key={item._id} className="hover:bg-muted/30">
                    <TableCell className="font-medium px-5">
                      <p className="text-[#0F3D61] text-[16px] font-semibold">{item.companyName}</p>
                      <p className="text-[#68706A] text-[12px] mt-[6px]">{item.email}</p>
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                            {item.service?.map((s: any) => (
                                <span key={s._id} className="text-xs bg-slate-100 px-2 py-1 rounded">{s.name}</span>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.status === "completed" ? (
                        <span className="text-green-600 font-medium capitalize">Assigned</span>
                      ) : (
                        <Select onValueChange={(val) => handleOpenConfirm(item._id, val)}>
                          <SelectTrigger className="w-[180px] mx-auto">
                            <SelectValue placeholder="Select Contractor" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {contractorsDropdown.map((con: any) => (
                              <SelectItem key={con._id} value={con._id}>
                                {con.firstName} {con.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{item.CompanyAddress}</TableCell>
                    <TableCell className="text-center">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6">
          <CustomPagination totalItems={totalItems} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#0F3D61]">Confirm Assignment</DialogTitle>
            <DialogDescription>
              Are you sure you want to assign this contractor to the company request? 
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white" 
              onClick={handleConfirm}
              disabled={assignMutation.isPending}
            >
              {assignMutation.isPending ? "Assigning..." : "Yes, Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}