"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Eye } from "lucide-react"
import { PersonalDetailsModal } from "./PersonalDetailsModal"
import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface TenantApplication {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  ssn: string
  hasVoucher: boolean
  livesInShelter: boolean
  affiliatedWithHomebase: boolean
  applicantSignature: string
  acceptedTerms: boolean
  status: "approved" | "denied" | "pending"
  createBy: {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
    profileImage: string
  }
  apartmentId: {
    _id: string
    title: string
    description: string
    aboutListing: string
    price: number
    bedrooms: number
    bathrooms: number
    squareFeet: number
  }
 
  
  rentalHistory: {
    currentAddress: string
    city: string
    state: string
    zip: string
    landlordName: string
    landlordNumber: string
  }
  employmentInfo: {
    employerName: string
    jobTitle: string
    employerAddress: string
    monthlyIncome: number
    sourceOfIncome: string
  }
  
  appliedAddress: {
    address: string
    city: string
    state: string
    zip: string
  }
  voucherInfo?: {
    programType: string
    caseworkerName: string
    caseworkerEmail: string
    caseworkerNumber: string
  }
  uploads?: {
    idCard?: string
    ssnDoc?: string
    voucherDoc?: string
    incomeDoc?: string
  }
  createdAt: string
  updatedAt: string
  // paymentId?: string
paymentId?:{
  _id: string
  amount: number
  status: string
}

}

interface ApiResponse {
  statusCode: number
  success: boolean
  message: string
  meta: {
    total: number
    page: number
    limit: number
  }
  data: TenantApplication[]
}

// Badge style function
const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-[#E7ECEF] text-[#27BE69] hover:bg-[#E7ECEF]/90 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center"
    case "Denied":
      return "bg-[#FEECEE] text-[#E5102E] hover:bg-[#FEECEE]/90 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center"
    case "Pending":
      return "bg-[#FBF8E8] text-[#816D01] hover:bg-[#FBF8E8]/90 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center"
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center"
  }
}

export function TenantApplicationsTable() {
  const [selectedApplication, setSelectedApplication] = useState<TenantApplication | null>(null)
  const [isPersonalDetailsModalOpen, setIsPersonalDetailsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { data: session, status } = useSession()
  const queryClient = useQueryClient()

  // Fetch tenant applications
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["tenantApplications", currentPage],
    queryFn: async () => {
      if (status === "loading" || !session?.accessToken) {
        throw new Error("Session not ready or token missing")
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tenant?page=${currentPage}&limit=10`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error(`Failed to fetch tenant applications: ${res.statusText}`)
      return res.json()
    },
    enabled: status === "authenticated" && !!session?.accessToken,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.accessToken) throw new Error("Token missing")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tenant/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      if (!res.ok) throw new Error(`Failed to delete tenant application: ${res.statusText}`)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenantApplications"] })
      toast.success("Application deleted successfully")
      setIsDeleteModalOpen(false)
      setSelectedId(null)
    },
    onError: (err) => toast.error((err as Error).message || "Failed to delete application"),
  })

  // Approve / Pending mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "pending" }) => {
      if (!session?.accessToken) throw new Error("Token missing")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tenant/${id}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error(`Failed to update status: ${await res.text()}`)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenantApplications"] })
      toast.success("Status updated successfully")
    },
    onError: (err) => toast.error((err as Error).message || "Failed to update status"),
  })

  // Deny mutation
  const denyMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.accessToken) throw new Error("Token missing")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tenant/${id}/deny`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error(`Failed to deny application: ${await res.text()}`)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenantApplications"] })
      toast.success("Application denied")
    },
    onError: (err) => toast.error((err as Error).message || "Failed to deny application"),
  })

  const applications = data?.data || []
  const totalItems = data?.meta.total || 0
  const itemsPerPage = data?.meta.limit || 10

  const handleViewDocument = (application: TenantApplication) => {
    setSelectedApplication(application)
    setIsPersonalDetailsModalOpen(true)
  }

  // const handleOpenDeleteModal = (id: string) => {
  //   setSelectedId(id)
  //   setIsDeleteModalOpen(true)
  // }

  // Status change logic
  const handleStatusChange = (newStatus: "approved" | "denied" | "pending", id: string, currentStatus: string) => {
    // Prevent switching back to pending
    if (newStatus === "pending" && currentStatus !== "pending") {
      toast.error("You cannot revert back to Pending.")
      return
    }

    // Prevent modifying a denied application
    if (currentStatus === "denied") {
      toast.error("Denied applications cannot be modified.")
      return
    }

    // Allow pending → approved/denied, approved → denied
    if (newStatus === "denied") {
      denyMutation.mutate(id)
    } else {
      updateStatusMutation.mutate({ id, status: newStatus })
    }
  }

  if (status === "unauthenticated") return <div>Please log in to view tenant applications.</div>
  if (error) return <div>Error: {(error as Error).message}</div>

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-[10px]">
          <thead className="bg-[#E7ECEF] h-[50px] border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40]">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40]">Apartment Style</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40]">Rent</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40]">Charge</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40]">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40]">Submitted</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40]">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-400 animate-pulse">
                  Loading...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((application) => {
                const displayStatus = application.status.charAt(0).toUpperCase() + application.status.slice(1)
                const submittedDate = new Date(application.createdAt).toLocaleDateString("en-US")
                const isPending = updateStatusMutation.isPending || denyMutation.isPending

                return (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={application.createBy.profileImage || "/placeholder.svg"} />
                          <AvatarFallback>{application.firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-base font-semibold text-[#0F3D61]">
                            {application.firstName} {application.lastName}
                          </div>
                          <div className="text-xs text-[#68706A]">{application.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">{application.apartmentId.title}</td>
                    <td className="px-6 py-4">${application.apartmentId.price.toLocaleString()}</td>
                    <td className="px-6 py-4">${application ?.paymentId?.amount.toLocaleString()}</td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        value={application.status}
                        onValueChange={(newStatus) =>
                          // eslint-disable-next-line 
                          handleStatusChange(newStatus as any, application._id, application.status)
                        }
                        disabled={isPending || application.status === "denied" || application.status === "approved"}
                      >
                        <SelectTrigger className={getStatusColor(displayStatus)}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {/* Show 'Pending' if current status is pending */}
                          {application.status === "pending" && (
                            <SelectItem value="pending">Pending</SelectItem>
                          )}
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="denied">Denied</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    <td className="px-6 py-4">{submittedDate}</td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleViewDocument(application)}
                          disabled={isPending}
                          className="hover:text-blue-600 transition"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {/* <button
                          onClick={() => handleOpenDeleteModal(application._id)}
                          disabled={isPending}
                          className="hover:text-red-600 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="w-full pb-3 mt-4">
        <CustomPagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Personal Details Modal */}
      {selectedApplication && (
        <PersonalDetailsModal
          isOpen={isPersonalDetailsModalOpen}
          onClose={() => {
            setIsPersonalDetailsModalOpen(false)
            setSelectedApplication(null)
          }}
          applicantName={`${selectedApplication.firstName} ${selectedApplication.lastName}`}
          applicantEmail={selectedApplication.email}
          avater={selectedApplication.createBy.profileImage || "/placeholder.svg"}
          uploads={selectedApplication.uploads}
          ssn={selectedApplication.ssn}
        />
      )}

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white rounded-[8px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tenant application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedId && deleteMutation.mutate(selectedId)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
