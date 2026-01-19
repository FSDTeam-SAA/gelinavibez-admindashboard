'use client'
import Bradecumb from '@/components/Shared/Bradecumb'
import { Header } from '@/components/Shared/Header'
import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface ExterminationRequest {
  _id: string
  fullName: string
  email: string
  phoneNumber: string
  propertyAddress: string
  typeOfProperty: string[]
  typeOfPestProblem: string[]
  status: 'pending' | 'assigned' | 'rejected' | 'completed'
  charges: number
  // you can add more fields if you want to show them later
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
  data: ExterminationRequest[]
}

export default function ExterminationRequestsPage() {
  const { data: session, status } = useSession()
  const [requests, setRequests] = useState<ExterminationRequest[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [chargeValue, setChargeValue] = useState<string>('')

  const token = session?.accessToken

  useEffect(() => {
    if (status === 'authenticated' && token) {
      fetchRequests()
    }
  }, [status, token])

  const fetchRequests = async () => {
    if (!token) return

    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/extermination/request-charge`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

      const result: ApiResponse = await res.json()

      if (result.success) {
        setRequests(result.data || [])
      } else {
        toast.error(result.message || 'Failed to fetch extermination requests')
      }
    } catch (error) {
      console.error('Error fetching extermination requests:', error)
      toast.error('Failed to load extermination requests')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!token) return toast.error('Please sign in to perform this action')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/extermination/status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        toast.success(`Request ${newStatus} successfully`)
        fetchRequests()
      } else {
        const errorData = await res.json().catch(() => ({}))
        toast.error(errorData.message || `Failed to ${newStatus} request`)
      }
    } catch (error) {
      console.error('Status update failed:', error)
      toast.error('Something went wrong while updating status')
    }
  }

  const handleEditCharge = async (id: string) => {
    if (!token) return toast.error('Please sign in to update charges')

    const chargeNum = Number(chargeValue)
    if (!chargeValue || isNaN(chargeNum) || chargeNum < 0) {
      return toast.error('Please enter a valid positive amount')
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/extermination/charges/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ charges: chargeNum }),
      })

      if (res.ok) {
        toast.success('Charges updated successfully')
        setEditingId(null)
        setChargeValue('')
        fetchRequests()
      } else {
        const errorData = await res.json().catch(() => ({}))
        toast.error(errorData.message || 'Failed to update charges')
      }
    } catch (error) {
      console.error('Charge update failed:', error)
      toast.error('Failed to update charges')
    }
  }

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return <TableSkeleton />
  }

  if (status === 'unauthenticated') {
    return (
      <div className="py-16 px-8 text-center text-slate-500">
        <h2 className="text-2xl font-semibold mb-3">Please sign in</h2>
        <p>You need to be authenticated to view this page.</p>
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <Header tittle="Extermination Payment Requests" />
      <Bradecumb pageName="Extermination" subPageName="Payment Requests" />

      <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm mt-10">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Full Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Property Address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Charge</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {requests.length > 0 ? (
              requests.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.fullName}</td>
                  <td className="px-6 py-4 text-gray-700">{item.email}</td>
                  <td className="px-6 py-4 text-gray-600">{item.phoneNumber}</td>
                  <td className="px-6 py-4 text-gray-700">{item.propertyAddress}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    ${item.charges?.toLocaleString() ?? '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'assigned'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        onClick={() => handleStatusUpdate(item._id, 'assigned')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Approve
                      </button>

                      {/* Uncomment if you want Reject button */}
                      {/* <button
                        onClick={() => handleStatusUpdate(item._id, 'rejected')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Reject
                      </button> */}

                      {editingId === item._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={chargeValue}
                            onChange={(e) => setChargeValue(e.target.value)}
                            className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Amount"
                            autoFocus
                            min="0"
                          />
                          <button
                            onClick={() => handleEditCharge(item._id)}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null)
                              setChargeValue('')
                            }}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(item._id)
                            setChargeValue(item.charges?.toString() ?? '')
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Edit Charge
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-500 text-lg">
                  No extermination payment requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Keep your existing TableSkeleton component
function TableSkeleton() {
  return (
    <div className="p-8 w-full">
      <div className="h-10 w-80 bg-gray-200 rounded-lg animate-pulse mb-8" />

      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <th key={i} className="px-6 py-5">
                    <div className="h-5 w-4/5 bg-gray-200 rounded animate-pulse" />
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <tr key={i}>
                  {Array(7)
                    .fill(0)
                    .map((_, j) => (
                      <td key={j} className="px-6 py-5">
                        <div
                          className={`h-8 bg-gray-200 rounded animate-pulse ${
                            j === 6 ? 'w-44' : 'w-5/6'
                          }`}
                        />
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}