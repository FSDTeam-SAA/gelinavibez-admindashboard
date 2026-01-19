"use client"

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

interface Props {
  id: string;
  token: string;
  onClose: () => void;
}

export const AdminTrackerDetailModal = ({ id, token, onClose }: Props) => {
  const { data, isLoading, } = useQuery({
    queryKey: ['admin-tracker-detail', id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-tracker/${id}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch details');
      return res.json();
    },
    enabled: !!id && !!token,
  });

  const log = data?.data;
  const target = log?.targetId;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Activity Details</h2>
            <p className="text-xs text-slate-500 font-mono">Log ID: {id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-24 bg-slate-100 rounded-xl" />
              <div className="h-64 bg-slate-100 rounded-xl" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Top Section: Admin & Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Image src={log?.adminId?.profileImage} width={1000} height={1000} className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md" alt="" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{log?.adminId?.firstName} {log?.adminId?.lastName}</h3>
                    <p className="text-sm text-indigo-600 font-bold uppercase">{log?.adminId?.role}</p>
                    <p className="text-xs text-slate-500">{log?.adminId?.email}</p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Target Model</span>
                    <span className="px-2 py-1 bg-white border border-indigo-200 text-indigo-700 text-[10px] rounded font-bold uppercase">{log?.model}</span>
                  </div>
                  <p className="text-sm text-slate-700"><strong>Action:</strong> {log?.action}</p>
                  <p className="text-sm text-slate-700"><strong>Date:</strong> {new Date(log?.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
                <h4 className="text-xs font-bold text-amber-700 uppercase mb-1">Activity Description</h4>
                <p className="text-slate-700 italic">&ldquo;{log?.description}&rdquo;</p>
              </div>

              {/* Target Media Gallery (Images) */}
              {target?.images && target.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Attached Images ({target.images.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {target.images.map((img: string, index: number) => (
                      <div key={index} className="group relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                        <Image
                          src={img} 
                          alt={`Attachment ${index}`} 
                          width={1000}
                          height={1000}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <a href={img} target="_blank" className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">View Full</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Media (Videos) */}
              {target?.videos && target.videos.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Attached Videos ({target.videos.length})
                  </h4>
                  <div className="space-y-4">
                    {target.videos.map((vid: string, index: number) => (
                      <div key={index} className="rounded-xl overflow-hidden border border-slate-200 bg-black shadow-lg">
                        <video controls className="w-full max-h-[400px]">
                          <source src={vid} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Details of the Target Object */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 mb-4">Target Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Company Name</span>
                    <span className="text-slate-700 font-medium">{target?.companyName || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Contact Email</span>
                    <span className="text-slate-700 font-medium">{target?.email || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Service Area</span>
                    <span className="text-slate-700 font-medium">{target?.serviceAreas || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                    <span className="text-amber-600 font-bold capitalize">{target?.status || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};