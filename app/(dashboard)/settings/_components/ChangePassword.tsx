"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useChnagePassword } from "@/hooks/ApiClling"
import { toast } from "sonner"

export function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const { data: session } = useSession()
  const token = session?.accessToken || ''
  const changePasswordMutation = useChnagePassword(token)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match")
      return
    }
    const payload = {
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword
    }
    changePasswordMutation.mutate(payload)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto bg-white rounded-lg p-6 md:p-8"
    >
      <h2 className="text-2xl font-semibold text-[#0F3D61] mb-6">Change Password</h2>

      <div className="space-y-6">
        {/* Current Password */}
        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={formData.currentPassword}
          showPassword={showCurrentPassword}
          setShowPassword={setShowCurrentPassword}
          onChange={handleInputChange}
        />

        {/* New Password */}
        <PasswordField
          label="New Password"
          name="newPassword"
          value={formData.newPassword}
          showPassword={showNewPassword}
          setShowPassword={setShowNewPassword}
          onChange={handleInputChange}
        />

        {/* Confirm Password */}
        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
          onChange={handleInputChange}
        />

        {/* Buttons */}
        <div className="flex justify-end">
          <Link href="/settings" className="text-[#0F3D61] text-[18px] font-semibold">
            <Button
              type="button"
              className="bg-white hover:bg-[#0F3D61]/90 h-[50px] rounded-[8px] text-[#0F3D61] text-[18px] font-normal mr-4 border border-[#0F3D61] hover:text-white"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[50px] rounded-[8px] text-white text-[18px] font-semibold"
          >
            {changePasswordMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  )
}

// ✅ Reusable Password Input Field Component
interface PasswordFieldProps {
  label: string
  name: string
  value: string
  showPassword: boolean
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function PasswordField({
  label,
  name,
  value,
  showPassword,
  setShowPassword,
  onChange,
}: PasswordFieldProps) {
  return (
    <div>
      <label className="block text-[18px] font-semibold text-[#616161] mb-2">
        {label}
      </label>
      <div className="relative">
        <Input
          name={name}
          value={value}
          onChange={onChange}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          className="w-full pr-10 h-[50px] bg-[#E7ECEF] rounded-[8px] border-none placeholder:text-[#616161]"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5 text-[#616161]" />
          ) : (
            <Eye className="w-5 h-5 text-[#616161]" />
          )}
        </button>
      </div>
    </div>
  )
}
