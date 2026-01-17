'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

// Types (you can move to separate file)
interface Apartment {
  _id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  images: string[];
  assasintBrokerId: string[];
}

interface Broker {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

export default function ApartmentsPage() {
  const { data: session, status } = useSession();
  const token = session?.accessToken as string | undefined;

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // Fetch data
  useEffect(() => {
    if (status !== 'authenticated' || !token) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch apartments
        const aptRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (!aptRes.ok) throw new Error('Failed to fetch apartments');

        const aptData: ApiResponse<{ data: Apartment[] }> = await aptRes.json();
        setApartments(aptData.data?.data || []);

        // Fetch brokers
        const brokerRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-user?role=broker`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (!brokerRes.ok) throw new Error('Failed to fetch brokers');

        const brokerData: ApiResponse<Broker[]> = await brokerRes.json();
        setBrokers(brokerData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, token]);

  // Handle broker selection
  const handleBrokerClick = (apartment: Apartment, broker: Broker) => {
    setSelectedApartment(apartment);
    setSelectedBroker(broker);
    setShowConfirmModal(true);
  };

  // Confirm assignment
  const confirmAssign = async () => {
    if (!selectedApartment || !selectedBroker || !token) return;

    setAssigning(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment/${selectedApartment._id}/assasint-broker/${selectedBroker._id}`,
        {
          method: 'PUT', 
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to assign broker');
      }

      // Update local state (optimistic update)
      setApartments((prev) =>
        prev.map((apt) =>
          apt._id === selectedApartment._id
            ? { ...apt, assasintBrokerId: [...apt.assasintBrokerId, selectedBroker._id] }
            : apt
        )
      );

      alert('Broker assigned successfully!');
      setShowConfirmModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to assign broker');
    } finally {
      setAssigning(false);
    }
  };

  if (status === 'loading' || loading) {
    return <SkeletonTable />;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error: {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Apartments</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
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
                Assign Broker
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {apartments.map((apt) => (
              <tr key={apt._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{apt.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${apt.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {apt.bedrooms}b / {apt.bathrooms}b
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {apt.address.city}, {apt.address.state}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {brokers.map((broker) => (
                      <button
                        key={broker._id}
                        onClick={() => handleBrokerClick(apt, broker)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          apt.assasintBrokerId?.includes(broker._id)
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800'
                        }`}
                        title={broker.email}
                      >
                        {broker.firstName} {broker.lastName.charAt(0)}.
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedApartment && selectedBroker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Confirm Assignment</h2>
            <p className="mb-6">
              Are you sure you want to assign{' '}
              <strong>
                {selectedBroker.firstName} {selectedBroker.lastName}
              </strong>{' '}
              to apartment{' '}
              <strong>"{selectedApartment.title}"</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={assigning}
              >
                Cancel
              </button>
              <button
                onClick={confirmAssign}
                disabled={assigning}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
              >
                {assigning ? 'Assigning...' : 'Confirm Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple skeleton loader
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
            {[...Array(8)].map((_, i) => (
              <tr key={i}>
                {[...Array(5)].map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
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