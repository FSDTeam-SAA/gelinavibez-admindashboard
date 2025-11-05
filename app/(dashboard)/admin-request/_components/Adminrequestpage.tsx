"use client"

import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { MoreHorizontal } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"

interface AdminRequest {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  profileImage: string
  verified: boolean
  phone: string
  jobTitle: string
  location: string
  bio: string
  requestAdmin: boolean
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: {
    meta: {
      total: number
      page: number
      limit: number
    }
    data: AdminRequest[]
  }
}

// 🔹 Role badge styling
const getRoleBadgeColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-purple-100 text-purple-800"
    case "user":
      return "bg-blue-100 text-blue-800"
    case "moderator":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// 🔹 Verified badge
const getVerifiedBadge = (verified: boolean) => {
  return verified ? (
    <Badge className="bg-green-100 text-green-800">Verified</Badge>
  ) : (
    <Badge className="bg-yellow-100 text-yellow-800">Unverified</Badge>
  )
}

function AdminRequestsTable() {
  const { data: session } = useSession()
  const token = session?.accessToken
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  // 🔹 Fetch Admin Requests
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["adminRequests", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-request-admin?page=${currentPage}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!res.ok) {
        throw new Error(`Failed to fetch admin requests: ${res.statusText}`)
      }
      return res.json()
    },
    enabled: !!token,
  })

  // 🔹 Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/update-admin/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!res.ok) throw new Error("Failed to approve admin request")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Admin approved successfully")
      queryClient.invalidateQueries({ queryKey: ["adminRequests"] })
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong")
    },
  })

  // 🔹 Deactivate mutation
  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/delete-admin/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!res.ok) throw new Error("Failed to deactivate admin")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Admin deactivated successfully")
      queryClient.invalidateQueries({ queryKey: ["adminRequests"] })
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong")
    },
  })

  const requests = data?.data?.data || []
  const totalItems = data?.data?.meta?.total || 0
  const limit = data?.data?.meta?.limit || 10

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {(error as Error).message}</div>
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Job Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Joined</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-slate-500 animate-pulse">
                  Loading requests...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                  No admin requests found.
                </td>
              </tr>
            ) : (
              requests.map((request) => {
                const joinedDate = new Date(request.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })

                return (
                  <tr key={request._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={request.profileImage || "/placeholder.svg"}
                            alt={`${request.firstName} ${request.lastName}`}
                          />
                          <AvatarFallback>
                            {request.firstName.charAt(0)}
                            {request.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900">
                            {request.firstName} {request.lastName}
                          </div>
                          <div className="text-xs text-slate-500">
                            ID: {request._id.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">{request.email}</td>

                    <td className="px-6 py-4">
                      <Badge className={getRoleBadgeColor(request.role)}>
                        {request.role.charAt(0).toUpperCase() + request.role.slice(1)}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">{request.phone || "N/A"}</td>

                    <td className="px-6 py-4 text-sm text-slate-600">{request.jobTitle || "N/A"}</td>

                    <td className="px-6 py-4">{getVerifiedBadge(request.verified)}</td>

                    <td className="px-6 py-4 text-sm text-slate-600">{joinedDate}</td>

                    {/* 🔹 Actions Dropdown */}
                    <td className="px-6 py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white ">
                          <DropdownMenuItem
                            onClick={() => approveMutation.mutate(request._id)}
                            disabled={approveMutation.isPending}
                            className="text-green-600 cursor-pointer"
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deactivateMutation.mutate(request._id)}
                            disabled={deactivateMutation.isPending}
                            className="text-red-600 cursor-pointer"
                          >
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
          itemsPerPage={limit}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

// 🔹 Main Page Component
export default function AdminRequestPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Requests</h1>
      <AdminRequestsTable />
    </div>
  )
}
