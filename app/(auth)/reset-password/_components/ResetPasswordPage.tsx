"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "@/components/web/AuthLayout"

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // Simulate API call (replace with your actual API call)
      // await resetPasswordAPI(newPassword)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

      // Redirect to login page on success
      router.push("/login")
    } catch (error) {
      console.error("Reset password error:", error)
      // Handle error (you can add toast notification here)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[624px]">
        <div className="bg-[#FFFFFF1A]/10 border border-white/10 p-8 md:p-10 rounded-[6px]">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#C5A574] mb-2">
              Reset Password
            </h1>
            <h3 className="text-[#F9F6F1] text-base font-normal">
              Enter your new password
            </h3>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-[#F5F5F5] text-base font-medium">
                Create New Password *
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter Password..."
                  className="bg-transparent border-[#C0C3C1] placeholder:text-white/40 focus:border-white/40 pl-5 h-12 rounded-full pr-12 placeholder:text-[#F9F6F1] text-[#F9F6F1]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#F5F5F5] text-base font-medium">
                Confirm New Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter Password..."
                  className="bg-transparent border-[#C0C3C1] placeholder:text-white/40 focus:border-white/40 pl-5 h-12 rounded-full pr-12 placeholder:text-[#F9F6F1] text-[#F9F6F1]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full h-12 bg-[#D4AF7A] hover:bg-[#C5A574] font-medium rounded-full transition-colors text-[18px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </form>

          {/* Back to Login Link */}
      
        </div>
      </div>
    </AuthLayout>
  )
}