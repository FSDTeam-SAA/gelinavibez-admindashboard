"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/web/AuthLayout"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call (replace with your actual API call)
      // await forgotPasswordAPI(email)
      
      // For now, just redirect on success
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      
      // Redirect to verify-email page
      router.push("/verify-email")
    } catch (error) {
      console.error("Forgot password error:", error)
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
              Forgot Password!
            </h1>
            <h3 className="text-[#F9F6F1] text-base font-normal">
              Enter your email to recover your password
            </h3>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F5F5F5] text-base font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="bg-transparent border-[#C0C3C1] placeholder:text-white/40 focus:border-white/40 pl-5 h-12 rounded-full placeholder:text-[#F9F6F1] text-[#F9F6F1]"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-12 bg-[#D4AF7A] hover:bg-[#C5A574] font-medium rounded-full transition-colors text-[18px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Submit"}
            </Button>
          </form>

          {/* Back to Login Link */}
          {/* <div className="mt-8 text-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-white/80 hover:text-[#D4AF7A] transition-colors"
            >
              ← Back to Login
            </button>
          </div> */}
        </div>
      </div>
    </AuthLayout>
  )
}