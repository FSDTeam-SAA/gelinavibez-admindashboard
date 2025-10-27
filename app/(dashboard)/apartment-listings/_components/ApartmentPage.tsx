"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Edit } from "lucide-react"
import { Header } from "@/components/Shared/Header"
import Bradecumb from "@/components/Shared/Bradecumb"
import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import Link from "next/link"


interface Address {
  street: string
  city: string
  state: string
  zipCode: string
}

interface AvailableFrom {
  month: string
  time: string
}

interface Apartment {
  _id: string
  title: string
  description: string
  aboutListing: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  amenities: string[]
  images: string[]
  videos: string[]
  day: string
  action: string
  status: "pending" | "approve" | "denied"
  ownerId: string
  createdAt: string
  updatedAt: string
  address: Address
  availableFrom: AvailableFrom
}

interface ApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: {
    meta: {
      page: number
      limit: number
      total: number
    }
    data: Apartment[]
  }
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "approve":
      return "text-[#27BE69] bg-[#E7ECEF]"
    case "denied":
      return "text-[#E5102E] bg-[#FEECEE]"
    case "pending":
      return "text-[#816D01] bg-[#FBF8E8]"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

const getStatusIcon = (status: string): string => {
  switch (status) {
    case "approve":
      return "✓"
    case "denied":
      return "✕"
    case "pending":
      return "◐"
    default:
      return "•"
  }
}

const getStatusDisplay = (status: string): string => {
  switch (status) {
    case "approve":
      return "Approve"
    case "denied":
      return "Denied"
    case "pending":
      return "Pending"
    default:
      return status
  }
}

const fetchApartments = async (page: number): Promise<ApiResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment?page=${page}&limit=10`)
  if (!response.ok) {
    throw new Error("Failed to fetch apartments")
  }
  return response.json()
}





export default function ApartmentPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(null)
  const sesseion=useSession();
  const token = sesseion.data?.accessToken
  const queryClient = useQueryClient()
  

  const deleteApartment = async (id: string): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error("Failed to delete apartment")
  }
}

  const updateApartmentStatus = async ({ id, status }: { id: string; status: string }): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    throw new Error("Failed to update apartment status")
  }
}

  const { data, isLoading, error } = useQuery<ApiResponse, Error>({
    queryKey: ["apartments", currentPage],
    queryFn: () => fetchApartments(currentPage),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteApartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] })
      setIsDeleteModalOpen(false)
      setSelectedApartmentId(null)
      toast.success("Apartment deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: updateApartmentStatus,
    onMutate: async ({ id, status }) => {
      const queryKey = ["apartments", currentPage]
      const previousData = queryClient.getQueryData<ApiResponse>(queryKey)

      if (previousData) {
        queryClient.setQueryData<ApiResponse>(queryKey, (old) => {
          if (!old) return old
          const updatedApartments = old.data.data.map((apt) =>
            apt._id === id ? { ...apt, status: status as "pending" | "approve" | "denied" } : apt
          )
          return {
            ...old,
            data: {
              ...old.data,
              data: updatedApartments,
            },
          }
        })
      }

      return { previousData }
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["apartments", currentPage], context.previousData)
      }
      toast.error("Failed to update status")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] })
      toast.success("Status updated successfully")
    },
  })

  const apartments = data?.data.data ?? []
  const totalItems = data?.data.meta.total ?? 0
  const itemsPerPage = data?.data.meta.limit ?? 5

  const SkeletonRow = () => (
    <tr className="border-b border-[#E6E7E6]">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </td>
    </tr>
  )

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
      <div>
        {/* Table */}
        <Card className="overflow-hidden mr-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-[#E6E7E6]">
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Day</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Apartment Name</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Date</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Status</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                      Error: {error.message}
                    </td>
                  </tr>
                ) : apartments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No apartments found
                    </td>
                  </tr>
                ) : (
                  apartments.map((apartment) => (
                    <tr key={apartment._id} className="border-b border-[#E6E7E6]">
                      <td className="px-6 py-4 text-base text-[#424242]">
                        {apartment?.day?.charAt(0)?.toUpperCase() + apartment?.day?.slice(1)}
                      </td>
                      <td className="px-6 py-4 text-base text-[#424242]">{apartment?.title}</td>
                      <td className="px-6 py-4 text-base text-[#424242]">
                        {new Date(apartment?.availableFrom?.time).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 w-[200px]">
                        <Select
                          value={apartment.status}
                          onValueChange={(value) =>
                            updateStatusMutation.mutate({ id: apartment._id, status: value })
                          }
                        >
                          <SelectTrigger
                            className={`inline-flex items-center justify-between gap-1 px-4 h-[40px] rounded-[8px] text-base font-medium ${getStatusColor(
                              apartment.status
                            )} border-none focus:ring-0`}
                          >
                            <SelectValue className="placeholder:text-muted-foreground" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            <SelectItem value="pending">
                              {getStatusIcon("pending")} {getStatusDisplay("pending")}
                            </SelectItem>
                            <SelectItem value="approve">
                              {getStatusIcon("approve")} {getStatusDisplay("approve")}
                            </SelectItem>
                            <SelectItem value="denied">
                              {getStatusIcon("denied")} {getStatusDisplay("denied")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`edit-aparment/${apartment._id}`}>
                         
                          <button
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            aria-label="Edit apartment"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                           </Link>
                          <button
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            aria-label="Delete apartment"
                            onClick={() => {
                              setSelectedApartmentId(apartment._id)
                              setIsDeleteModalOpen(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white !rounded-[8px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this apartment listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="h-[40px] rounded-[8px] px-10">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedApartmentId) {
                  deleteMutation.mutate(selectedApartmentId)
                }
              }}
              disabled={deleteMutation.isPending}
              className="bg-[red] hover:bg-[red]/90 h-[40px] rounded-[8px] text-white px-10"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}