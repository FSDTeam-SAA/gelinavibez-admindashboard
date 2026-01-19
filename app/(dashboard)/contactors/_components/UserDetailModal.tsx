"use client"
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Mail, Phone, MapPin,  Calendar, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

interface Props {
  id: string;
  token: string;
  onClose: () => void;
}

export const UserDetailModal = ({ id, token, onClose }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['user-detail', id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: !!id,
  });

  const user = data?.data;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="h-24 bg-[#0F3D61] relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="flex justify-center -mt-12 mb-4">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="text-xl bg-slate-100">{user?.firstName?.[0]}</AvatarFallback>
            </Avatar>
          </div>

          {isLoading ? (
            <div className="py-10 text-center animate-pulse text-slate-400">Loading profile...</div>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-800">{user?.firstName} {user?.lastName}</h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-[#0F3D61] border border-blue-100 rounded">
                    {user?.role}
                  </span>
                  {user?.verified && <ShieldCheck className="h-4 w-4 text-green-500" />}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{user?.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{user?.location || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 italic">Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {user?.bio && (
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
                  <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Bio</p>
                  <p className="text-xs text-slate-600 italic">&ldquo;{user.bio}&rdquo;</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t flex justify-end">
          <Button onClick={onClose} className="bg-[#0F3D61] text-white">Close</Button>
        </div>
      </div>
    </div>
  );
};