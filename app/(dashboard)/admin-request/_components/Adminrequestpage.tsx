/*eslint-disable*/
"use client"

import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronDown } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

/* ───────────── TYPES ───────────── */
interface AdminRequest {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  profileImage: string
  verified: boolean
  phone?: string
  accessRoutes: string[]
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: {
    meta: { total: number; page: number; limit: number }
    data: AdminRequest[]
  }
}

interface RouteOption {
  value: string
  label: string
}

const AVAILABLE_ROUTES: RouteOption[] = [
  { value: "tenant-applications", label: "Tenant Applications Management" },
  { value: "extermination-applications", label: "Extermination Applications" },
  { value: "contactors-applications", label: "Contractor Applications" },
  { value: "landlord-assign", label: "Landlord Apartment Assign" },
  { value: "broker-assign", label: "Broker Apartment Assign" },
  { value: "apartment-listings", label: "Apartment Listings Management" },
  { value: "contactors", label: "All Users" },
  { value: "services", label: "Contractor Services" },
  { value: "bookings", label: "Bookings" },
  { value: "contactors-payments", label: "Contractor Payments Request" },
  { value: "extermination-payments", label: "Extermination Payments Request" },
  { value: "contacts", label: "Contacts" },
  { value: "newsletter", label: "Newsletter" },
  { value: "admin-request", label: "Admin Request" },
  { value: "landlord-applications", label: "Landlord Request" },
  { value: "broker-applications", label: "Broker Request" },
  { value: "message", label: "Message" },
  { value: "message-request", label: "Message Request" },
  { value: "subscribe-plan", label: "Subscribe Plan" },
]

/* ───────────── HELPERS ───────────── */
const getRoleBadgeColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":     return "bg-purple-100 text-purple-800"
    case "user":      return "bg-blue-100 text-blue-800"
    case "moderator": return "bg-green-100 text-green-800"
    default:          return "bg-gray-100 text-gray-800"
  }
}

/* ───────────── PERMISSION ROW ───────────── */
interface PermissionRowProps {
  request: AdminRequest
  joinedDate: string
  updateRoutesMutation: any
  approveMutation: any
  rejectMutation: any
}

function PermissionRow({
  request,
  joinedDate,
  updateRoutesMutation,
  approveMutation,
  rejectMutation,
}: PermissionRowProps) {
  const [open, setOpen] = useState(false)
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>(request.accessRoutes)

  useEffect(() => {
    setSelectedRoutes(request.accessRoutes)
  }, [request.accessRoutes])

  const toggleRoute = (route: string) => {
    setSelectedRoutes(prev =>
      prev.includes(route) ? prev.filter(r => r !== route) : [...prev, route]
    )
  }

  const handleSave = () => {
    updateRoutesMutation.mutate(
      { id: request._id, accessRoutes: selectedRoutes },
      { onSuccess: () => setOpen(false) }
    )
  }

  const hasChanges = selectedRoutes.join(",") !== request.accessRoutes.join(",")

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else      document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <tr className="hover:bg-slate-50 transition-colors">
        {/* Name */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={request.profileImage || "/placeholder.svg"} alt={`${request.firstName} ${request.lastName}`} />
              <AvatarFallback>{request.firstName?.[0]}{request.lastName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-slate-900">{request.firstName} {request.lastName}</div>
              <div className="text-xs text-slate-500">ID: {request._id.slice(0, 8)}</div>
            </div>
          </div>
        </td>

        {/* Email */}
        <td className="px-6 py-4 text-sm text-slate-600">{request.email}</td>

        {/* Role */}
        <td className="px-6 py-4">
          <Badge className={getRoleBadgeColor(request.role)}>
            {request.role.charAt(0).toUpperCase() + request.role.slice(1)}
          </Badge>
        </td>

        {/* Phone */}
        <td className="px-6 py-4 text-sm text-slate-600">{request.phone || "N/A"}</td>

        {/* Permission Routes Button */}
        <td className="px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs border border-slate-200 rounded-[8px] flex items-center gap-1"
            onClick={() => setOpen(true)}
          >
            Assign Routes
            <ChevronDown className="h-3 w-3" />
          </Button>
        </td>

        {/* Joined */}
        <td className="px-6 py-4 text-sm text-slate-600">{joinedDate}</td>

        {/* Actions – Approve / Reject */}
        <td className="px-6 py-4 text-center">
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
              onClick={() => approveMutation.mutate(request._id)}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              Approve
            </Button>

            <Button
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white px-4"
              onClick={() => rejectMutation.mutate(request._id)}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              Reject
            </Button>
          </div>
        </td>
      </tr>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto p-6 relative">
            <h3 className="text-base font-semibold mb-4">Select Access Routes</h3>
            <div className="space-y-2 mb-6">
              {AVAILABLE_ROUTES.map(route => (
                <label key={route.value} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={selectedRoutes.includes(route.value)}
                    onChange={() => toggleRoute(route.value)}
                    className="h-4 w-4 accent-[#0F3D61]"
                  />
                  {route.label}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#0F3D61] hover:bg-[#0d3454] text-white"
                onClick={handleSave}
                disabled={updateRoutesMutation.isPending || !hasChanges}
              >
                {updateRoutesMutation.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ───────────── MAIN TABLE ───────────── */
function AdminRequestsTable() {
  const { data: session, status } = useSession()
  const token = session?.accessToken ?? ""
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  /* FETCH PENDING ADMIN REQUESTS */
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["admin-requests", currentPage, token],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-request-admin?page=${currentPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!res.ok) throw new Error("Failed to fetch admin requests")
      return res.json()
    },
    enabled: status === "authenticated" && !!token,
  })

  /* UPDATE ACCESS ROUTES */
  const updateRoutesMutation = useMutation({
    mutationFn: async ({ id, accessRoutes }: { id: string; accessRoutes: string[] }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/update-access-routes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accessRoutes }),
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Failed to update routes")
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success("Access routes updated")
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] })
    },
    onError: (err: any) => toast.error(err.message || "Update failed"),
  })

  /* APPROVE */
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/approved-user/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Failed to approve")
      }
      return res.json()
    },
    onSuccess: (res) => {
      toast.success(res.message || "Admin approved")
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] })
    },
    onError: (err: any) => toast.error(err.message || "Approval failed"),
  })

  /* REJECT */
  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/rejected-user/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Failed to reject")
      }
      return res.json()
    },
    onSuccess: (res) => {
      toast.success(res.message || "Admin rejected")
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] })
    },
    onError: (err: any) => toast.error(err.message || "Rejection failed"),
  })

  const requests = data?.data?.data || []
  const totalItems = data?.data?.meta?.total || 0
  const limit = data?.data?.meta?.limit || 10

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading requests: {(error as Error).message}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Permission Routes</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-500 animate-pulse">
                  Loading admin requests...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                  No pending admin requests at the moment
                </td>
              </tr>
            ) : (
              requests.map(request => {
                const joinedDate = new Date(request.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                return (
                  <PermissionRow
                    key={request._id}
                    request={request}
                    joinedDate={joinedDate}
                    updateRoutesMutation={updateRoutesMutation}
                    approveMutation={approveMutation}
                    rejectMutation={rejectMutation}
                  />
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 pb-4 ">
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

/* ───────────── PAGE ───────────── */
export default function AdminRequestPage() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold mb-6">Admin Requests</h1>
      <AdminRequestsTable />
    </div>
  )
}