"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information and profile details.</p>
      </div>

      {/* Settings Navigation */}
      <div className="flex gap-4 border-b border-gray-200">
        <Link href="/profile" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
          Profile Settings
        </Link>
        <Link
          href="/change-password"
          className="px-4 py-2 text-sm font-medium text-blue-700 border-b-2 border-blue-700"
        >
          Changes Password
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg  p-6 md:p-8 w-full h-full">
        <h2 className="text-xl font-semibold text-[#0F3D61] mb-6">Changes Password</h2>

        <div className="space-y-6 mt-9">
          {/* Current Password */}
          <div>
            <label className="block text-[18px] font-semibold text-[#616161] mb-2">Current Password</label>
            <div className="relative">
              <Input type={showCurrentPassword ? "text" : "password"} placeholder="••••••••" className="w-full pr-10 h-[50px] bg-[#E7ECEF] rounded-[8px] border-none placeholder:text-[#616161]" />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5 text-[#616161]" /> : <Eye className="w-5 h-5 text-[#616161]" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[18px] font-semibold text-[#616161] mb-2">New Password</label>
            <div className="relative">
              <Input type={showNewPassword ? "text" : "password"} placeholder="••••••••" className="w-full pr-10 h-[50px] bg-[#E7ECEF] rounded-[8px] border-none placeholder:text-[#616161]" />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5 text-[#616161]" /> : <Eye className="w-5 h-5 text-[#616161]" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-[18px] font-semibold text-[#616161] mb-2">Confirm New Password</label>
            <div className="relative">
              <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="w-full pr-10 h-[50px] bg-[#E7ECEF] rounded-[8px] border-none placeholder:text-[#616161]" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5 text-[#616161]" /> : <Eye className="w-5 h-5 text-[#616161]" />}
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[50px] rounded-[8px] text-white text-[18px] font-semibold">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
