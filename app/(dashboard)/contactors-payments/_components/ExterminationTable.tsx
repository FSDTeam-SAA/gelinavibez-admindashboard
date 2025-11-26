
/* eslint-disable */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Shared/Header';
import { Edit } from 'lucide-react';

const fetchExterminations = async (token: string) => {
  if (!token) throw new Error('No access token found');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contractor/admin-assign-extermination`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch exterminations');
  }
  return res.json();
};

const updateChargeAmount = async ({ chargeId, amount, token }: { chargeId: string; amount: number; token: string }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/charge/${chargeId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update amount');
  }
  return res.json();
};

export default function ExterminationTable() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [editChargeId, setEditChargeId] = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState('');

  const token = session?.accessToken as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['exterminations', token],
    queryFn: () => fetchExterminations(token),
    enabled: !!token && status === 'authenticated', // Only run when logged in
  });

  const mutation = useMutation({
    mutationFn: ({ chargeId, amount }: { chargeId: string; amount: number }) =>
      updateChargeAmount({ chargeId, amount, token }),
    onSuccess: () => {
      toast.success('Amount updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['exterminations'] });
      setEditChargeId(null);
      setNewAmount('');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update amount');
    },
  });

  if (status === 'loading') return <div>Loading session...</div>;
  if (status === 'unauthenticated') return <div>Please log in to view this page.</div>;
  if (isLoading) return <div>Loading exterminations...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const exterminations = data?.data?.exterminations || [];

  return (
    <div className=" p-6">
         <Header tittle="Contactor Payments Requests" />
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Full Name</th>
              <th className="px-4 py-2 text-left">Property</th>
              <th className="px-4 py-2 text-left">Pest Problem</th>
              <th className="px-4 py-2 text-left">Preferred Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
          
            {exterminations.map((ex: any) => {
              const charge = ex.charges?.[0];
              const amount = charge ? charge.amount : null;
              const chargeId = charge?._id;

              return (
                <tr key={ex._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{ex.fullName}</td>
                  <td className="px-4 py-3">{ex.propertyAddress}</td>
                  <td className="px-4 py-3">{ex.typeOfPestProblem?.join(', ') || '—'}</td>
                  <td className="px-4 py-3">
                    {ex.preferredServiceDate ? new Date(ex.preferredServiceDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        ex.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : ex.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ex.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {editChargeId === chargeId ? (
                      <input
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        className="border rounded px-2 py-1 w-24"
                        autoFocus
                      />
                    ) : amount !== null && amount !== undefined ? (
                      `$${amount}`
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {charge && editChargeId !== chargeId && (
                      <button
                        onClick={() => {
                          setEditChargeId(chargeId);
                          setNewAmount(amount.toString());
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        <Edit/>
                      </button>
                    )}

                    {editChargeId === chargeId && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!newAmount || isNaN(Number(newAmount))) {
                              toast.error('Please enter a valid amount');
                              return;
                            }
                            mutation.mutate({
                              chargeId,
                              amount: parseFloat(newAmount),
                            });
                          }}
                          disabled={mutation.isPending}
                         className="w-full bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white rounded-[4px] font-bold py-1 text-base disabled:opacity-50"
                        >
                          {mutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setEditChargeId(null);
                            setNewAmount('');
                          }}
                          className="w-full border border-[#E6E7E6]  text-red-500 rounded-[4px] font-bold py-1 text-base disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}