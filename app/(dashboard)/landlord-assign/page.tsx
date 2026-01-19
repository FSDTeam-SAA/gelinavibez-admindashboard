/*eslint-disable */
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Check, Loader2, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { CustomPagination } from '@/components/Shared/CustomePaginaion'
import Image from 'next/image'

interface Address {
  street?: string
  city?: string
  state?: string
  zipCode?: string
}

interface Apartment {
  _id: string
  title: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  address: Address
  images: string[]
  status: 'approve' | 'pending'
  action: string
  ownerId: string
  assasintLandlordId: string[]
}

interface Landlord {
  _id: string
  firstName: string
  lastName: string
  email: string
  profileImage?: string
}

interface ApartmentsResponse {
  data: {
    meta: {
      page: number
      limit: number
      total: number
    }
    data: Apartment[]
  }
}

interface UsersResponse {
  data: Landlord[]
}

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [landlords, setLandlords] = useState<Landlord[]>([])
  const [selectedApartmentIds, setSelectedApartmentIds] = useState<string[]>([])
  const [selectedLandlordId, setSelectedLandlordId] = useState<string>('')
  const [totalApartments, setTotalApartments] = useState(0)
  const [loadingApartments, setLoadingApartments] = useState(true)
  const [loadingLandlords, setLoadingLandlords] = useState(true)
  const [assigning, setAssigning] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const { data: session, status } = useSession()
  const token = session?.accessToken

  useEffect(() => {
    if (status === 'authenticated' && token) {
      fetchApartments()
      fetchLandlords()
    }
  }, [status, token, currentPage])

  const getLandlordName = (landlordId: string) => {
    const landlord = landlords.find((l) => l._id === landlordId)
    if (!landlord) return 'Unknown'
    return `${landlord.firstName} ${landlord.lastName.charAt(0)}.`
    // Alternative: return full name → `${landlord.firstName} ${landlord.lastName}`
  }

  const fetchApartments = async () => {
    try {
      setLoadingApartments(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment/?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }
      )

      if (!res.ok) throw new Error('Failed to fetch apartments')

      const json: ApartmentsResponse = await res.json()
      setApartments(json.data?.data || [])
      setTotalApartments(json.data?.meta?.total || 0)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load apartments')
    } finally {
      setLoadingApartments(false)
    }
  }

  const fetchLandlords = async () => {
    try {
      setLoadingLandlords(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-user?role=landlord`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!res.ok) throw new Error('Failed to fetch landlords')
      const json: UsersResponse = await res.json()
      setLandlords(json.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load landlords')
    } finally {
      setLoadingLandlords(false)
    }
  }

  const toggleApartmentSelect = (id: string) => {
    setSelectedApartmentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selectAllApartments = () => {
    const assignable = apartments.filter((apt) => apt.assasintLandlordId?.length === 0)
    const allAssignableSelected =
      selectedApartmentIds.length === assignable.length &&
      assignable.every((apt) => selectedApartmentIds.includes(apt._id))

    if (allAssignableSelected) {
      setSelectedApartmentIds([])
    } else {
      setSelectedApartmentIds(assignable.map((a) => a._id))
    }
  }

  const assignApartments = async () => {
    if (selectedApartmentIds.length === 0) {
      toast.warning('Please select at least one apartment')
      return
    }

    if (!selectedLandlordId) {
      toast.warning('Please select a landlord first')
      return
    }

    const alreadyAssigned = apartments.filter(
      (apt) =>
        selectedApartmentIds.includes(apt._id) && apt.assasintLandlordId?.length > 0
    )

    if (alreadyAssigned.length > 0) {
      toast.error(`Cannot assign ${alreadyAssigned.length} already assigned apartment(s)`)
      const stillAssignable = selectedApartmentIds.filter(
        (id) => !alreadyAssigned.some((a) => a._id === id)
      )
      setSelectedApartmentIds(stillAssignable)
      return
    }

    setAssigning(true)

    try {
      const promises = selectedApartmentIds.map(async (aptId) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment/${aptId}/assasint-landlord/${selectedLandlordId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.message || `Failed to assign apartment ${aptId}`)
        }
        return res.json()
      })

      await Promise.all(promises)

      toast.success(`Successfully assigned ${selectedApartmentIds.length} apartment(s)`)
      setSelectedApartmentIds([])
      await fetchApartments()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to assign apartments')
    } finally {
      setAssigning(false)
    }
  }

  const assignableCount = apartments.filter((apt) => apt.assasintLandlordId?.length === 0).length
  const alreadyAssignedCount = apartments.length - assignableCount

  if (status === 'loading') return <div className="p-10 text-center">Loading session...</div>
  if (status !== 'authenticated') return <div className="p-10 text-center">Please sign in</div>

  return (
    <div className="w-full mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">All Apartments</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="min-w-[240px]">
            {loadingLandlords ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            ) : (
              <select
                value={selectedLandlordId}
                onChange={(e) => setSelectedLandlordId(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Landlord to Assign</option>
                {landlords.map((landlord) => (
                  <option key={landlord._id} value={landlord._id}>
                    {landlord.firstName} {landlord.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={assignApartments}
            disabled={assigning || selectedApartmentIds.length === 0 || !selectedLandlordId}
            className={`
              px-6 py-2 rounded-md font-medium flex items-center justify-center gap-2 min-w-[180px]
              transition-colors
              ${
                selectedApartmentIds.length === 0 || !selectedLandlordId || assigning
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            {assigning ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Assigning...
              </>
            ) : (
              `Assign (${selectedApartmentIds.length})`
            )}
          </button>

          <button
            onClick={selectAllApartments}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition-colors"
          >
            {selectedApartmentIds.length === assignableCount && assignableCount > 0
              ? 'Deselect All'
              : 'Select All Available'}
          </button>
        </div>
      </div>

      {alreadyAssignedCount > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          {alreadyAssignedCount} apartment(s) already have an assistant landlord
        </div>
      )}

      {loadingApartments ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow animate-pulse h-72" />
          ))}
        </div>
      ) : apartments.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg">
          No apartments found on this page
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apartments.map((apartment) => {
            const isSelected = selectedApartmentIds.includes(apartment._id)
            const isAlreadyAssigned = apartment.assasintLandlordId?.length > 0
            const mainImage = apartment.images?.[0]
            const assignedName = isAlreadyAssigned
              ? getLandlordName(apartment.assasintLandlordId[0])
              : null

            return (
              <div
                key={apartment._id}
                onClick={() => {
                  if (isAlreadyAssigned) {
                    toast.info(`Assigned to ${assignedName || 'an assistant landlord'}`)
                  } else {
                    toggleApartmentSelect(apartment._id)
                  }
                }}
                className={`
                  relative rounded-lg overflow-hidden shadow-md transition-all duration-200
                  border-2
                  ${
                    isAlreadyAssigned
                      ? 'opacity-70 bg-gray-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50/30 cursor-pointer'
                      : 'border-transparent hover:border-gray-300 cursor-pointer'
                  }
                `}
              >
                {isSelected && !isAlreadyAssigned && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1.5 z-10 shadow">
                    <Check size={18} />
                  </div>
                )}

                {isAlreadyAssigned && (
                  <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs px-3 py-1 rounded-full z-10 shadow flex items-center gap-1 max-w-[180px] truncate">
                    <User size={12} />
                    {assignedName || 'Assigned'}
                  </div>
                )}

                <div className="h-48 bg-gray-200 relative">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={apartment.title}
                      fill
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                    {apartment.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {apartment.address?.city || '—'}, {apartment.address?.state || '—'}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-blue-700">
                      ${apartment.price}
                      <span className="text-sm font-normal text-gray-500">/mo</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {apartment.bedrooms} bd • {apartment.bathrooms} ba
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-10">
        <CustomPagination
          totalItems={totalApartments}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={(page: number) => {
            setCurrentPage(page)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      </div>
    </div>
  )
}