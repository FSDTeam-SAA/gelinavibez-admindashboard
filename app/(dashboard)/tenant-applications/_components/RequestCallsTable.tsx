"use client";

import { CustomPagination } from "@/components/Shared/CustomePaginaion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { NoteModal } from "./NoteModal";

/* ---------- Interfaces (unchanged) ---------- */
interface CallRequest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addNode: string;
  visiting: { _id: string; title: string };
  createdAt: string;
  updatedAt: string;
}
interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: { totle: number; page: number; limit: number };
    data: CallRequest[];
  };
}

/* ---------- fetch function (unchanged) ---------- */
const fetchCallRequests = async (page: number, token: string): Promise<ApiResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/callrequest?page=${page}&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch call requests");
  return response.json();
};

/* ---------- Main component ---------- */
export function RequestCallsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const session = useSession();
  const token = session.data?.accessToken || "";

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["callRequests", currentPage],
    queryFn: () => fetchCallRequests(currentPage, token),
  });

  /* ---------- Modal state ---------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const openNoteModal = (note: string) => {
    setSelectedNote(note);
    setModalOpen(true);
  };

  if (error) return <div>Error: {(error as Error).message}</div>;

  const callRequests = data?.data.data || [];
  const totalItems = data?.data.meta.totle || 0;

  /* ---------- Skeleton (unchanged) ---------- */
  const SkeletonRow = () => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </td>
    </tr>
  );

  return (
    <div className="">
      {/* ---------- Table ---------- */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-[#E7ECEF] h-[50px] border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">
                Visiting In
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">
                Note
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))
            ) : (
              callRequests.map((call) => (
                <tr key={call._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src="/placeholder.svg"
                          alt={`${call.firstName} ${call.lastName}`}
                        />
                        <AvatarFallback>{call.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-base font-semibold text-[#0F3D61]">
                          {`${call.firstName} ${call.lastName}`}
                        </div>
                        <div className="text-xs text-[#68706A] font-normal">
                          {call.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-[#68706A]">
                    {call.phone}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-[#68706A]">
                    {call.visiting.title}
                  </td>

                  {/* ---- Eye button opens modal ---- */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openNoteModal(call.addNode)}
                      className="text-[#0F3D61] hover:text-[#0a2e4a] transition-colors"
                      aria-label="View note"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-base text-[#68706A] font-normal">
                    {format(new Date(call.createdAt), "MMM dd, yyyy")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- Pagination ---------- */}
      <div className="mt-6 w-full">
        <CustomPagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ---------- Modal (outside the table) ---------- */}
      <NoteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        note={selectedNote}
      />
    </div>
  );
}