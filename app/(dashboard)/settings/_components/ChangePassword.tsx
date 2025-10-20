"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="w-full mx-auto bg-white rounded-lg p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-[#0F3D61] mb-6">Change Password</h2>

      <div className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-[18px] font-semibold text-[#616161] mb-2">Current Password</label>
          <div className="relative">
            <Input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pr-10 h-[50px] bg-[#E7ECEF] rounded-[8px] border-none placeholder:text-[#616161]"
            />
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
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pr-10 h-[50px] bg-[#E7ECEF] rounded-[8px] border-none placeholder:text-[#616161]"
            />
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
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pr-10 h-[50px] bg-[#E7ECEF] rounded-[8px] border-none placeholder:text-[#616161]"
            />
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
          <Link href="/settings" className="text-[#0F3D61] text-[18px] font-semibold">
          <Button className="bg-white hover:bg-[#0F3D61]/90 h-[50px] rounded-[8px] text-[#0F3D61] text-[18px] font-normal mr-4 border border-[#0F3D61] hover:text-white">Cancel</Button>
          </Link>
          <Button className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[50px] rounded-[8px] text-white text-[18px] font-semibold">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
