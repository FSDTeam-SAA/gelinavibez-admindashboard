/*eslint-disable */
'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Header } from '@/components/Shared/Header';
import Bradecumb from '@/components/Shared/Bradecumb';

// ── Types ───────────────────────────────────────────────
interface Apartment {
  _id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  address: { city: string; state: string; [key: string]: any };
  assasintBrokerId: string[]; 
}

interface Broker {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ── API Helpers ─────────────────────────────────────────
const api = {
  getApartments: async (token: string): Promise<Apartment[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch apartments');
    const json: ApiResponse<{ data: Apartment[] }> = await res.json();
    return json.data?.data || json.data || [];
  },

  getBrokers: async (token: string): Promise<Broker[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-user?role=broker`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch brokers');
    const json: ApiResponse<Broker[]> = await res.json();
    return json.data || [];
  },

  assignBroker: async ({
    token,
    apartmentId,
    brokerId,
  }: {
    token: string;
    apartmentId: string;
    brokerId: string;
  }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment/${apartmentId}/assasint-broker/${brokerId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to assign broker');
    }

    return { apartmentId, brokerId };
  },
};

// ── Main Component ──────────────────────────────────────
export default function ApartmentsPage() {
  const { data: session, status } = useSession();
  const token = session?.accessToken as string | undefined;
  const queryClient = useQueryClient();

  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ── Queries ─────────────────────────────────────────────
  const apartmentsQuery = useQuery({
    queryKey: ['apartments'],
    queryFn: () => api.getApartments(token!),
    enabled: status === 'authenticated' && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const brokersQuery = useQuery({
    queryKey: ['brokers'],
    queryFn: () => api.getBrokers(token!),
    enabled: status === 'authenticated' && !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // ── Mutation ────────────────────────────────────────────
  const assignMutation = useMutation({
    mutationFn: api.assignBroker,
    onMutate: async ({ apartmentId, brokerId }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['apartments'] });

      const previousApartments = queryClient.getQueryData<Apartment[]>(['apartments']);

      queryClient.setQueryData<Apartment[]>(['apartments'], (old = []) =>
        old.map((apt) =>
          apt._id === apartmentId ? { ...apt, assasintBrokerId: [brokerId] } : apt
        )
      );

      return { previousApartments }; // for rollback
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['apartments'], context?.previousApartments);
      toast.error(err instanceof Error ? err.message : 'Failed to assign broker');
    },
    onSuccess: () => {
      toast.success('Broker assigned successfully!');
      setShowConfirmModal(false);
      // Optional: invalidate if you want to refetch from server
      // queryClient.invalidateQueries({ queryKey: ['apartments'] });
    },
  });

  // ── Handlers ────────────────────────────────────────────
  const handleBrokerSelect = (apartment: Apartment, brokerId: string) => {
    if (!brokerId) return;

    const broker = brokersQuery.data?.find((b) => b._id === brokerId);
    if (!broker) return;

    const current = apartment.assasintBrokerId?.[0];
    if (current === brokerId) {
      toast.info('This broker is already assigned');
      return;
    }

    setSelectedApartment(apartment);
    setSelectedBroker(broker);
    setShowConfirmModal(true);
  };

  const confirmAssign = () => {
    if (!selectedApartment || !selectedBroker || !token) return;

    assignMutation.mutate({
      token,
      apartmentId: selectedApartment._id,
      brokerId: selectedBroker._id,
    });
  };

  // ── Render States ───────────────────────────────────────
  if (status === 'loading' || apartmentsQuery.isLoading || brokersQuery.isLoading) {
    return <SkeletonTable />;
  }

  if (apartmentsQuery.isError || brokersQuery.isError) {
    return (
      <div className="p-6 text-red-600">
        Error loading data. Please try again.
        <button
          onClick={() => {
            apartmentsQuery.refetch();
            brokersQuery.refetch();
          }}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const apartments = apartmentsQuery.data ?? [];
  const brokers = brokersQuery.data ?? [];

  return (
    <div className="p-6">
      <Header tittle="Broker Assignment" />
      <Bradecumb pageName="Broker Assignment"  />

      <div className="overflow-x-auto mt-10">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Beds/Baths
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Broker
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {apartments.map((apt) => {
              const currentBrokerId = apt.assasintBrokerId?.[0] || '';
              const assignedBroker = brokers.find((b) => b._id === currentBrokerId);

              return (
                <tr key={apt._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{apt.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${apt.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {apt.bedrooms}b / {apt.bathrooms}b
                  </td>
                  <td className="px-6 py-4">
                    {apt.address.city}, {apt.address.state}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      onChange={(e) => handleBrokerSelect(apt, e.target.value)}
                      value={currentBrokerId}
                      className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1.5"
                    >
                      <option value="">Select broker...</option>
                      {brokers.map((broker) => (
                        <option key={broker._id} value={broker._id}>
                          {broker.firstName} {broker.lastName}
                          {currentBrokerId === broker._id ? ' ✓' : ''}
                        </option>
                      ))}
                    </select>

                    {assignedBroker && (
                      <div className="mt-1 text-xs text-green-700">
                        Current: {assignedBroker.firstName} {assignedBroker.lastName}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedApartment && selectedBroker && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Assignment</h2>

            {selectedApartment.assasintBrokerId?.length > 0 ? (
              <p className="mb-6">
                Replace current broker with{' '}
                <strong>
                  {selectedBroker.firstName} {selectedBroker.lastName}
                </strong>{' '}
                for <strong>&quot;{selectedApartment.title}&quot;</strong>?
              </p>
            ) : (
              <p className="mb-6">
                Assign{' '}
                <strong>
                  {selectedBroker.firstName} {selectedBroker.lastName}
                </strong>{' '}
                to <strong>&quot;{selectedApartment.title}&quot;</strong>?
              </p>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={assignMutation.isPending}
                className="px-5 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssign}
                disabled={assignMutation.isPending}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2 min-w-[120px] justify-center"
              >
                {assignMutation.isPending ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Assigning...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton (unchanged)
function SkeletonTable() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {[...Array(5)].map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, i) => (
              <tr key={i}>
                {[...Array(5)].map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}