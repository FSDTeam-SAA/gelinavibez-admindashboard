/*eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Header } from '@/components/Shared/Header';
import Bradecumb from '@/components/Shared/Bradecumb';

// --- Types ---
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface Extermination {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  propertyAddress: string;
  typeOfProperty: string[];
  typeOfPestProblem: string[];
  locationOfProblem: string[];
  preferredServiceDate: string;
  status: 'pending' | 'assigned' | 'completed';
  // Note: The API returns the full object here
  assigningExtermination?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }; 
  charges?: number;
}

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: { total: number; page: number; limit: number };
  data: T;
}

const ExterminationListPage = () => {
  const { data: session, status } = useSession();
  const [exterminations, setExterminations] = useState<Extermination[]>([]);
  const [exterminators, setExterminators] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = session?.accessToken as string | undefined;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const fetchData = async () => {
    if (!token) return;

    setLoading(true);
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const [exterminationRes, exterminatorsRes] = await Promise.all([
        fetch(`${API_BASE}/extermination/`, { method: 'GET', headers, cache: 'no-store' }),
        fetch(`${API_BASE}/user/all-user?role=exterminator`, { method: 'GET', headers, cache: 'no-store' }),
      ]);

      if (!exterminationRes.ok || !exterminatorsRes.ok) throw new Error('Failed to fetch data');

      const exterminationData: ApiResponse<Extermination[]> = await exterminationRes.json();
      const exterminatorsData: ApiResponse<User[]> = await exterminatorsRes.json();

      if (exterminationData.success) setExterminations(exterminationData.data || []);
      if (exterminatorsData.success) setExterminators(exterminatorsData.data || []);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchData();
  }, [status]);

  const handleAssignExterminator = (exterminationId: string, exterminatorId: string) => {
    const exterminator = exterminators.find((ex) => ex._id === exterminatorId);
    if (!exterminator) return;

    const name = `${exterminator.firstName} ${exterminator.lastName}`;

    toast(
      <div className="flex flex-col gap-3 min-w-[300px] p-2">
        <p className="font-semibold text-lg">Confirm Assignment</p>
        <p className="text-sm text-muted-foreground">
          Assign <span className="text-primary font-bold">{name}</span> to this request?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              toast.dismiss();
              await performAssign(exterminationId, exterminatorId, name);
            }}
            className="flex-1 px-4 py-2 bg-[#0F3D61] text-white rounded-md text-sm font-medium"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>,
      { position: 'top-center', duration: Infinity }
    );
  };

  const performAssign = async (exterminationId: string, exterminatorId: string, name: string) => {
    try {
      const response = await fetch(
        `${API_BASE}/extermination/${exterminationId}/assign-extermination/${exterminatorId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success(`Successfully assigned to ${name}`);
        fetchData(); 
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Assignment failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;

  return (
    <div className="w-full mx-auto p-6 bg-muted/20 min-h-screen">
      <Header tittle="Extermination Applications" />
      <Bradecumb pageName="Extermination Applications" />

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden mt-10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <thead>
              <tr className="bg-[#E7ECEF] text-[#343A40]">
                <th className="text-left px-6 py-4 text-sm font-semibold">Client</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Property</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Pest Problem</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                <th className="text-center px-6 py-4 text-sm font-semibold">Assign Exterminator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exterminations.map((item) => {
                // Determine if already assigned from the nested object
                const assignedObj = item.assigningExtermination;
                const isAssigned = !!assignedObj?.firstName || item.status === 'assigned' || item.status === 'completed';

                return (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0F3D61]">{item.fullName}</div>
                      <div className="text-xs text-gray-500">{item.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{item.propertyAddress}</div>
                      <div className="text-xs text-gray-400">{item.typeOfProperty?.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{item.typeOfPestProblem?.join(', ')}</div>
                      <div className="text-xs text-gray-400">{item.locationOfProblem?.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(item.preferredServiceDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'completed' ? 'bg-green-100 text-green-700' :
                        item.status === 'assigned' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isAssigned ? (
                        <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm font-semibold text-green-800">
                            {assignedObj 
                              ? `${assignedObj.firstName} ${assignedObj.lastName || ''}`.trim() 
                              : 'Assigned'}
                          </span>
                        </div>
                      ) : (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignExterminator(item._id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                          className="mx-auto block w-full max-w-[200px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0F3D61] focus:ring-1 focus:ring-[#0F3D61] outline-none cursor-pointer"
                        >
                          <option value="" disabled>Select Exterminator</option>
                          {exterminators.map((ex) => (
                            <option key={ex._id} value={ex._id}>
                              {ex.firstName} {ex.lastName}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExterminationListPage;