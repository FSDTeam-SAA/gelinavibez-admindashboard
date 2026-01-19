"use client";

import Bradecumb from '@/components/Shared/Bradecumb';
import { Header } from '@/components/Shared/Header';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface RequestItem {
  _id: string;
  requester: { firstName: string; lastName: string; email: string };
  target: { firstName: string; lastName: string };
  status: string;
}

const MessagingRequestsPage = () => {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const token = session?.accessToken;

  // 1. Fetch Data
  const fetchRequests = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/messaging-request/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) {
        setRequests(result.data);
      }
    } catch (error) {
      toast.error("Failed to load requests" + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  // 2. Handle Action (Approve/Reject)
  const handleAction = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/messaging-request/action`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, action }),
      });

      const result = await res.json();

      if (result.success || res.ok) {
        toast.success(`Request ${action} successfully!`);
        // Refresh the list to show updated status
        fetchRequests();
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Network error occurred" + error);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading requests...</p>;

  return (
    <div className="p-8">
      <Header tittle="Messaging Requests" />
      <Bradecumb pageName='Messaging Requests' />
      
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4">
                  {item.requester.firstName} {item.requester.lastName}
                  <div className="text-sm text-gray-400">{item.requester.email}</div>
                </td>
                <td className="px-6 py-4">{item.target.firstName}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(item._id, 'approved')}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(item._id, 'rejected')}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessagingRequestsPage;