"use client"

import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin } from "lucide-react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/Shared/Header"
import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Interfaces
interface Apartment {
    _id: string
    title: string
    description: string
    aboutListing: string
    price: number
    bedrooms: number
    bathrooms: number
    squareFeet: number
}

interface CreateBy {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
    profileImage: string
}

interface AppliedAddress {
    address: string
    city: string
    state: string
    zip: string
}

interface Tenant {
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
    status: string
    createBy: CreateBy
    apartmentId: Apartment
    appliedAddress: AppliedAddress
    createdAt: string
    updatedAt: string
    paymentId: string
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
    data: Tenant[]
}

const BookingTable = () => {
    const { data: session, status } = useSession()
    const token = session?.accessToken

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const fetchTenants = async (): Promise<ApiResponse> => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tenant?page=${currentPage}&limit=${itemsPerPage}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        if (!res.ok) throw new Error("Failed to fetch tenant data")
        return res.json()
    }

    const { data, isLoading, isError, error } = useQuery<ApiResponse>({
        queryKey: ["tenants", currentPage],
        queryFn: fetchTenants,
        enabled: status === "authenticated",
    })

    const bookings = data?.data || []
    const totalItems = data?.meta?.total || 0

    return (
        <div className="min-h-screen bg-gray-50 p-5">
            <Header tittle="Bookings" />

            <Card className="overflow-x-auto mt-6">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100 border-b border-[#E6E7E6]">
                            <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Tenant</th>
                            <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Email</th>
                            <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Address</th>
                            <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Apartment Price</th>
                            <th className="px-6 py-4 text-left text-base font-semibold text-[#343A40]">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading
                            ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                                <tr key={idx} className="border-b border-[#E6E7E6]">
                                    <td className="px-6 py-4"><Skeleton className="h-5 w-32 rounded-md" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-5 w-40 rounded-md" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-5 w-48 rounded-md" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-md" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-md" /></td>
                                </tr>
                            ))
                            : isError
                                ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                                            {(error as Error)?.message || "Error loading bookings"}
                                        </td>
                                    </tr>
                                )
                                : bookings.map((booking) => (
                                    <tr key={booking._id} className="border-b border-[#E6E7E6]">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={booking.createBy.profileImage || "/placeholder.svg"} />
                                                <AvatarFallback>{booking.createBy.firstName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-[#343A40] font-medium">
                                                {booking.createBy.firstName} {booking.createBy.lastName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#68706A] text-sm">{booking.createBy.email}</td>
                                        <td className="px-6 py-4 flex items-center gap-1 text-[#68706A] text-sm">
                                            <MapPin className="h-3 w-3" />
                                            <span className="truncate max-w-[200px]">{booking.appliedAddress.address}</span>
                                        </td>
                                        <td className="px-6 py-4 text-[#68706A] text-sm">${booking.apartmentId.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-[#68706A] text-sm">{booking.status}</td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </Card>

            {/* Pagination */}
            {totalItems > itemsPerPage && (
                <div className="mt-6">
                    <CustomPagination
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    )
}

export default BookingTable
