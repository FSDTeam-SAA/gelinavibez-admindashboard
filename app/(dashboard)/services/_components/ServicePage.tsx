

"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ServiceModal } from "./ServiceModal"
import Bradecumb from "@/components/Shared/Bradecumb"
import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import { Header } from "@/components/Shared/Header"
import { Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface Service {
  _id: string
  name: string
  createBy: string
  createdAt: string
  updatedAt: string
  __v: number
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
  data: Service[]
}

interface error {
  message: string
}

// Fetch all services
const fetchServices = async (page: number): Promise<ApiResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/?page=${page}&limit=10`)
  if (!response.ok) {
    throw new Error("Failed to fetch services")
  }
  return response.json()
}

export function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [currentPage, setCurrentPage] = useState(1)

  const queryClient = useQueryClient()
  const session = useSession()
  const token = session?.data?.accessToken

  const deleteService = async (id: string): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error("Failed to delete service")
    } else {
      toast.success("Service deleted successfully!")
    }
  }

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["services", currentPage],
    queryFn: () => fetchServices(currentPage),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", currentPage] })
      setIsDeleteModalOpen(false)
      setServiceToDelete(null)
    },
    onError: (error:error) => {
      console.error("Delete error:", error.message)
      toast.error("Failed to delete service")
    },
  })

  const totalItems = data?.meta.total ?? 0
  const itemsPerPage = data?.meta.limit ?? 5

  const SkeletonRow = () => (
    <div className="grid grid-cols-3 border-b border-[#E6E7E6]">
      <div className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>
      <div className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
      <div className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
    </div>
  )

  const handleDeleteClick = (id: string) => {
    setServiceToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      deleteMutation.mutate(serviceToDelete)
    }
  }

  const handleEditClick = (service: Service) => {
    setSelectedService(service)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  if (error) {
    return <div className="min-h-screen bg-muted/30">Error: {error.message}</div>
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header tittle="Services" />
      <div className="flex items-center justify-between mb-6 mt-6 pr-5">
        <Bradecumb pageName="Services" />
        <Button
          onClick={() => {
            setSelectedService(null)
            setModalMode("add")
            setIsModalOpen(true)
          }}
          className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white px-10"
        >
          + Add Service
        </Button>
      </div>

      <div className="pr-5">
        <div className="bg-white rounded-lg border border-[#E6E7E6] overflow-hidden">
          <div className="grid grid-cols-3 bg-[#E7ECEF] border-b border-[#E6E7E6]">
            <div className="px-6 py-4 font-semibold text-foreground">Categories</div>
            <div className="px-6 py-4 text-center font-semibold text-foreground">Submitted</div>
            <div className="px-6 text-right py-4 font-semibold text-foreground">Actions</div>
          </div>

          <div>
            {isLoading
              ? Array(5)
                  .fill(0)
                  .map((_, index) => <SkeletonRow key={index} />)
              : data?.data.map((service) => (
                  <div
                    key={service._id}
                    className="grid grid-cols-3 border-b border-[#E6E7E6] hover:bg-muted/30 transition-colors"
                  >
                    <div className="px-6 py-4 text-foreground">{service.name}</div>
                    <div className="px-6 py-4 text-foreground flex justify-center">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex justify-end gap-2 px-6 py-4 items-center">
                      <button onClick={() => handleEditClick(service)}>
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteClick(service._id)}>
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {!isLoading && (
          <div className="w-full pb-3">
            <CustomPagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedService}
        mode={modalMode}
      />

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white !rounded-[4px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="h-[40px] !rounded-[4px]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 h-[40px] rounded-[4px] text-white hover:bg-red-600/90 "
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
