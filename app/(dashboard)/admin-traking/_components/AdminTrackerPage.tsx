"use client"
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminTrackerDetailModal } from './AdminTrackerDetailModal';
import Image from 'next/image';
import { Header } from '@/components/Shared/Header';
import { CustomPagination } from '@/components/Shared/CustomePaginaion';
const AdminTrackerPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const queryClient = useQueryClient();
  
  // States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedId, setSelectedId] = useState<string | null>(null); // For Delete
  const [viewId, setViewId] = useState<string | null>(null);         // For View

  // --- 1. Fetch Data ---
  const { data, isLoading } = useQuery({
    queryKey: ['admin-tracker', currentPage], 
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-tracker?page=${currentPage}&limit=${itemsPerPage}`, 
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: !!token,
    placeholderData: (previousData) => previousData, 
  });

  // --- 2. Delete Mutation ---
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-tracker/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tracker'] });
      setSelectedId(null);
    },
  });

  // --- Skeleton Component ---
  const TableSkeleton = () => (
    <>
      {[...Array(6)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="p-4"><div className="flex gap-3 items-center"><div className="w-9 h-9 bg-slate-200 rounded-full" /><div className="space-y-2"><div className="h-3 w-24 bg-slate-200 rounded" /><div className="h-2 w-16 bg-slate-100 rounded" /></div></div></td>
          <td className="p-4"><div className="h-5 w-16 bg-slate-200 rounded" /></td>
          <td className="p-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
          <td className="p-4"><div className="h-4 w-48 bg-slate-100 rounded" /></td>
          <td className="p-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
          <td className="p-4 text-right"><div className="flex justify-end gap-2"><div className="h-8 w-14 bg-slate-200 rounded" /><div className="h-8 w-14 bg-slate-100 rounded" /></div></td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="p-8 w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Header tittle="Admin Tracker" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600 text-sm">Admin</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Action</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Model</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Description</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Time</th>
              <th className="p-4 font-semibold text-right text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              //eslint-disable-next-line 
              data?.data?.map((log: any) => (
                <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Image src={log.adminId?.profileImage} width={1000} height={1000} className="w-9 h-9 rounded-full bg-slate-200 object-cover" alt="" />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{log.adminId?.firstName} {log.adminId?.lastName}</p>
                        <p className="text-[11px] text-slate-500 uppercase font-medium">{log.adminId?.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-500">{log.model}</td>
                  <td className="p-4 text-slate-600 text-sm truncate max-w-[220px]">{log.description}</td>
                  <td className="p-4 text-slate-500 text-xs">
                    {new Date(log.createdAt).toLocaleDateString()} <br/>
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setViewId(log._id)}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => setSelectedId(log._id)} 
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* --- Pagination Footer --- */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/30">
          <CustomPagination 
            totalItems={data?.meta?.total || 0} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>

      {/* --- Detail Modal --- */}
      {viewId && (
        <AdminTrackerDetailModal 
          id={viewId} 
          token={token} 
          onClose={() => setViewId(null)} 
        />
      )}

      {/* --- Delete Confirmation Modal --- */}
      {selectedId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[70]">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 text-xl font-bold">!</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Confirm Delete</h2>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to remove this log? This action cannot be reversed.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedId(null)} 
                className="flex-1 px-4 py-2 text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteMutation.mutate(selectedId)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {deleteMutation.isPending ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrackerPage;