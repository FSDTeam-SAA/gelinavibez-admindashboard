"use client"

import type React from "react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "@/components/Shared/AuthLayout"

async function resetPassword(data: { email: string; newPassword: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error("Failed to reset password")
  }
  
  return response.json()
}

export default function ChangePasswordPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully!")
      setNewPassword("")
      setConfirmPassword("")
      router.push("/login")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reset password")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (!email) {
      toast.error("Email is required")
      return
    }
    mutation.mutate({ email, newPassword })
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif text-[#0F3D61]">Reset Password</h1>
          <p className="text-base text-[#6C757D]">
            Enter and confirm your new password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="text-base font-medium text-[#0F3D61]"
            >
              New Password <span className="text-[#0F3D61]">*</span>
            </label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter Password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-white border-[#484848] rounded-full px-4 h-[56px] pr-12 placeholder:text-[#787878] text-[#0F3D61] text-base font-normal"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="text-base font-medium text-[#0F3D61]"
            >
              Confirm New Password <span className="text-[#0F3D61]">*</span>
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter Password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white border-[#484848] rounded-full px-4 h-[56px] pr-12 placeholder:text-[#787878] text-[#0F3D61] text-base font-normal"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white rounded-full font-bold py-6 text-base"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}