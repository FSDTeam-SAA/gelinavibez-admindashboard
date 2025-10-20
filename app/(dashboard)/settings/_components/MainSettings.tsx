"use client"

import {  Key, User } from "lucide-react"
import Link from "next/link"

export default function MainSettings() {
  return (
    <div className="space-y-4">
      <Link
        href="/settings/personal"
        className="p-4 flex items-center gap-2  cursor-pointer bg-[#E7ECEF] hover:bg-[#E7ECEF]/90  transition-colors rounded-[6px]"
      >
        <User className="w-5 h-5 text-[#0F3D61]" />
        <span className="text-[#0F3D61] !front-semibold text-base">Profile</span>
       
      </Link>

      <Link
        href="/settings/password"
        className="p-4 flex items-center gap-2  cursor-pointer bg-[#E7ECEF] hover:bg-[#E7ECEF]/90  transition-colors rounded-[6px]"
      >
        <Key className="w-5 h-5 text-[#0F3D61]" />
        <span className="text-[#0F3D61] !front-semibold text-base">Change Password</span>
        
      </Link>
    </div>
  )
}
