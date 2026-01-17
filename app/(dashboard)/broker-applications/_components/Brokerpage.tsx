
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/Shared/Header';
import { toast } from 'sonner';
import Image from 'next/image';

// ── Types ───────────────
interface LandlordUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LandlordApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: { total: number; page: number; limit: number };
  data: LandlordUser[];
}

// ── Helper Component for Safe Dates ────────────────────────────────
const FormattedDate = ({ dateString }: { dateString: string }) => {
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    setDate(new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }));
  }, [dateString]);

  return <span>{date || "..."}</span>;
};

const Landlordpage: React.FC = () => {
  // FIX 1: Correctly destructure status
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  
  const token = session?.accessToken;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ── Fetch Data ───────────────────────────────────────────────────
  const { data, isLoading, isError, error } = useQuery<LandlordApiResponse, Error>({
    queryKey: ['unverified-landlords', token],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/user/all-user?role=broker&verified=false`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      return response.json();
    },
    // FIX 2: status is now defined from useSession()
    enabled: !!token && status === "authenticated",
  });

  // ── Mutation ─────────────────────────────────────────────────────
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'approved' | 'rejected' }) => {
      const response = await fetch(`${baseUrl}/user/${action}-user/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || `Failed to ${action} user`);
      }
      return resData;
    },
    onSuccess: (res) => {
      toast.success(res.message || "User status updated successfully");
      queryClient.invalidateQueries({ queryKey: ['unverified-landlords'] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    }
  });

  const landlords: LandlordUser[] = data?.data || [];

  // ── Skeleton Loader ──────────────────────────────────────────────
  const SkeletonRow: React.FC = () => (
    <tr className="animate-pulse border-b bg-white">
      <td className="px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="px-6 py-4 flex justify-center gap-2">
        <div className="h-9 bg-gray-200 rounded w-20"></div>
        <div className="h-9 bg-gray-200 rounded w-20"></div>
      </td>
    </tr>
  );

  return (
    <div className="p-8 w-full mx-auto">
      <Header tittle='Broker Verifications' />

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200 mt-10">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3">Landlord Name</th>
              <th className="px-6 py-3">Email Address</th>
              <th className="px-6 py-3">Join Date</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading || status === "loading" ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-red-500 font-medium">
                  Error: {error.message}
                </td>
              </tr>
            ) : landlords.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  No pending verifications found.
                </td>
              </tr>
            ) : (
              landlords.map((user) => (
                <tr key={user._id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <Image
                      src={user.profileImage || "https://via.placeholder.com/40"} 
                      alt="profile" 
                      // FIX 3: Smaller dimensions for avatars
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <FormattedDate dateString={user.createdAt} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        disabled={isUpdating}
                        onClick={() => updateStatus({ id: user._id, action: 'approved' })}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition min-w-[80px]"
                      >
                        {isUpdating ? '...' : 'Approve'}
                      </button>
                      <button 
                        disabled={isUpdating}
                        onClick={() => updateStatus({ id: user._id, action: 'rejected' })}
                        className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition min-w-[80px]"
                      >
                        {isUpdating ? '...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Landlordpage;