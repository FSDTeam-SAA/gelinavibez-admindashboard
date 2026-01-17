


"use client"

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Eye } from 'lucide-react'
import { CustomPagination } from '@/components/Shared/CustomePaginaion'



interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  profileImage: string
  verified: boolean
  location?: string
  phone?: string
  isSubscription: boolean
}

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
  meta?: {
    total: number
    page: number
    limit: number
  }
}

// --- 3. Main Table Component ---

const UserManagementTable: React.FC = () => {
  const [role, setRole] = useState<string>('all')
  const [page, setPage] = useState<number>(1) // Current Page State
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  
  const { data: session } = useSession()
  const token = session?.accessToken || ''
  const ITEMS_PER_PAGE = 10

  // Fetch Users - The 'page' in queryKey ensures refetch on page change
  const { data: usersData, isLoading, isError } = useQuery<ApiResponse<User[]>>({
    queryKey: ['users', role, page], 
    queryFn: async () => {
      const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-user`
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString()
      })
      if (role !== 'all') params.append('role', role)

      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    },
    enabled: !!token, 
  })

  // Fetch Details
  const { data: detailsData, isLoading: detailsLoading } = useQuery<ApiResponse<User>>({
    queryKey: ['user-details', selectedUserId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${selectedUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      return response.json()
    },
    enabled: !!selectedUserId && !!token,
  })

  const handleRoleChange = (newRole: string) => {
    setRole(newRole)
    setPage(1) // Always reset to page 1 when filtering
  }

  if (isError) return <div className="p-6 text-red-500 text-center">Error loading data.</div>

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Filter </label>
          <select 
            value={role} 
            onChange={(e) => handleRoleChange(e.target.value)}
            className="border border-gray-300 p-2 rounded-md shadow-sm outline-none bg-white cursor-pointer"
          >
            <option value="all">All Users</option>
            <option value="landlord">Landlord</option>
            <option value="contractor">Contractor</option>
            <option value="exterminator">Exterminator</option>
            <option value="broker">Broker</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              [...Array(ITEMS_PER_PAGE)].map((_, i) => <SkeletonRow key={i} />)
            ) : (
              usersData?.data.map((user) => (
                <tr key={user._id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={user.profileImage} alt="avatar" className="w-10 h-10 rounded-full object-cover border" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100 capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => setSelectedUserId(user._id)}
                      className="text-gray-600 hover:text-gray-800 inline-flex items-center gap-1 font-bold"
                    >
                      <Eye className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Integration Point: Passing API Meta Data to your component --- */}
      {usersData?.meta && (
      <div className="">
          <CustomPagination
          currentPage={page}
          totalItems={usersData.meta.total}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
      )}

      <DetailsModal 
        isOpen={!!selectedUserId} 
        onClose={() => setSelectedUserId(null)} 
        user={detailsData?.data}
        loading={detailsLoading}
      />
    </div>
  )
}

// --- 4. Helper Components (Skeleton & Modal) ---

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-10 w-10 bg-gray-200 rounded-full"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
  </tr>
)

const DetailsModal: React.FC<{ isOpen: boolean; onClose: () => void; user?: User; loading: boolean }> = ({ isOpen, onClose, user, loading }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl relative border border-gray-100 p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">User Details</h3>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-10 bg-gray-100 rounded w-full"></div>
          </div>
        ) : (
          <div className="text-center">
            <img src={user?.profileImage} className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-blue-100" alt="Profile" />
            <p className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-gray-500 mb-6">{user?.email}</p>
            <div className="text-left space-y-3 bg-gray-50 p-4 rounded-xl">
              <p className="text-sm"><strong>Role:</strong> <span className="capitalize">{user?.role}</span></p>
              <p className="text-sm"><strong>Location:</strong> {user?.location || 'N/A'}</p>
              <p className="text-sm"><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
              <p className="text-sm"><strong>Account:</strong> {user?.verified ? '✅ Verified' : '❌ Unverified'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagementTable