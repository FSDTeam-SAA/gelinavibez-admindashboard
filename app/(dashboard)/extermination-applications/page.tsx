'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Header } from '@/components/Shared/Header';
import Bradecumb from '@/components/Shared/Bradecumb';

// Types
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
  assigningExtermination?: string; // assigned exterminator ID
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
    if (!token) {
      setError('You must be logged in to view this page');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const [exterminationRes, exterminatorsRes] = await Promise.all([
        fetch(`${API_BASE}/extermination/`, { method: 'GET', headers, cache: 'no-store' }),
        fetch(`${API_BASE}/user/all-user?role=exterminator`, { method: 'GET', headers, cache: 'no-store' }),
      ]);

      if (!exterminationRes.ok) throw new Error('Failed to fetch exterminations');
      if (!exterminatorsRes.ok) throw new Error('Failed to fetch exterminators');

      const exterminationData: ApiResponse<Extermination[]> = await exterminationRes.json();
      const exterminatorsData: ApiResponse<User[]> = await exterminatorsRes.json();

      if (exterminationData.success) setExterminations(exterminationData.data || []);
      if (exterminatorsData.success) setExterminators(exterminatorsData.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchData();
    else if (status === 'unauthenticated') {
      setError('Please log in to view this page');
      setLoading(false);
    }
  }, [status]);

  const getExterminatorName = (exterminatorId?: string) => {
    if (!exterminatorId) return null;
    const found = exterminators.find((ex) => ex._id === exterminatorId);
    return found ? `${found.firstName} ${found.lastName}` : null;
  };

  const handleAssignExterminator = (exterminationId: string, exterminatorId: string) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    const exterminator = exterminators.find((ex) => ex._id === exterminatorId);
    if (!exterminator) return;

    const name = `${exterminator.firstName} ${exterminator.lastName}`;

    toast(
      <div className="flex flex-col gap-3 min-w-[320px]">
        <p className="font-semibold">Confirm Assignment</p>
        <p className="text-sm text-muted-foreground">
          Assign <strong>{name}</strong> to this extermination request?
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={async () => {
              toast.dismiss();
              await performAssign(exterminationId, exterminatorId, name);
            }}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium"
          >
            Yes, Assign
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: Infinity,
        position: 'top-center',
      }
    );
  };

  const performAssign = async (exterminationId: string, exterminatorId: string, name: string) => {
    try {
      const response = await fetch(
        `${API_BASE}/extermination/${exterminationId}/assign-extermination/${exterminatorId}`,
        {
          method: 'PUT', // ← you used PUT in your last version
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) throw new Error(`Failed: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        toast.success(`Assigned to ${name}`);
        fetchData(); // refresh everything
      } else {
        throw new Error(data.message || 'Failed to assign');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign exterminator');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;

  if (error) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
        <p className="mb-6">{error}</p>
        <button
          onClick={fetchData}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
     
     <Header tittle="Extermination Applications" />
     <Bradecumb pageName="Extermination Applications" />

      {exterminations.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No requests found at the moment.
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow overflow-hidden mt-10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-6 py-4 text-sm font-medium">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">Property</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">Pest Problem</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-medium">Assigned Exterminator</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {exterminations.map((item) => {
                  const assignedName = getExterminatorName(item.assigningExtermination);
                  const isAssignedOrCompleted =
                    !!assignedName || item.status === 'completed';

                  return (
                    <tr key={item._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium">{item.fullName}</div>
                        <div className="text-sm text-muted-foreground">{item.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{item.propertyAddress}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.typeOfProperty?.join(', ') || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{item.typeOfPestProblem?.join(', ') || '—'}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.locationOfProblem?.join(', ') || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(item.preferredServiceDate).toLocaleDateString() || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                            item.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'assigned'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isAssignedOrCompleted ? (
                          <div className="text-sm font-medium text-muted-foreground">
                            {assignedName || '—'}
                            {item.status === 'completed' && ' (Completed)'}
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
                            className="w-full max-w-[220px] rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                          >
                            <option value="" disabled>
                              Assign Exterminator
                            </option>
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
      )}
    </div>
  );
};

export default ExterminationListPage;