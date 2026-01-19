
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { Header } from "@/components/Shared/Header";

// ── Client-side safe date formatter ────────────────────────────────
function ClientDate({ dateString }: { dateString: string }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    try {
      const date = new Date(dateString);
      setFormatted(date.toLocaleDateString("en-GB"));
    } catch {
      setFormatted("Invalid date");
    }
  }, [dateString]);

  return <span>{formatted || "—"}</span>;
}

// ── Types / Interfaces ─────────────────────────────────────────────
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

// ── Main Component ─────────────────────────────────────────────────
export default function LandlordPage() {
  // FIX 1: Properly destructure 'status' from useSession
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  // FIX 2: Use the session object directly since we destructured it
  const token = session?.accessToken || "";

  // Fetch unverified landlords
  const { data, isLoading } = useQuery<LandlordApiResponse, Error>({
    queryKey: ["unverified-landlords", token],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-user?role=landlord&verified=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch unverified landlords");
      return res.json();
    },
    // FIX 3: Query now waits for status to be "authenticated"
    enabled: status === "authenticated" && !!token,
  });

  // Approve / Reject mutation
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "approved" | "rejected" }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${action}-user/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${action} user`);
      }

      return res.json();
    },

    onSuccess: (response) => {
      toast.success(response.message || "Operation successful");
      queryClient.invalidateQueries({ queryKey: ["unverified-landlords"] });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const landlords = data?.data || [];

  return (
    <div className="p-8 w-full mx-auto">
      <Header tittle="Landlord Verifications" />

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
            {/* FIX 4: Use the destructured status for the loading state */}
            {isLoading || status === "loading" ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <span className="animate-pulse">Loading landlords...</span>
                  </div>
                </td>
              </tr>
            ) : landlords.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-gray-500">
                  No pending landlord verifications at the moment
                </td>
              </tr>
            ) : (
              landlords.map((user) => (
                <tr
                  key={user._id}
                  className="bg-white border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <Image
                      src={user.profileImage || "https://via.placeholder.com/40"}
                      alt={`${user.firstName} ${user.lastName}`}
                      // FIX 5: Use appropriate width/height for avatars
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    {user.firstName} {user.lastName}
                  </td>

                  <td className="px-6 py-4">{user.email}</td>

                  <td className="px-6 py-4">
                    <ClientDate dateString={user.createdAt} />
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        disabled={isUpdating}
                        onClick={() => updateStatus({ id: user._id, action: "approved" })}
                        className="disabled:opacity-50 bg-emerald-600 hover:bg-emerald-700 
                                   text-white px-5 py-1.5 rounded-md text-sm font-medium transition"
                      >
                        Approve
                      </button>

                      <button
                        disabled={isUpdating}
                        onClick={() => updateStatus({ id: user._id, action: "rejected" })}
                        className="disabled:opacity-50 bg-rose-600 hover:bg-rose-700 
                                   text-white px-5 py-1.5 rounded-md text-sm font-medium transition"
                      >
                        Reject
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
}