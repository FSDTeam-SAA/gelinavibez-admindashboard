"use client"

import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/Shared/AuthLayout"
import { toast } from "sonner"
import { useRouter } from "next/navigation" // ✅ Correct import

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  const forgotPassword = async (email: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error("Failed to send OTP")
    }

    return response.json()
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("OTP sent successfully to your email")
      setEmail("")
      router.push("/verify-email")
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    mutate(email)
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-serif text-[#0F3D61]">Forgot Password!</h1>
          <p className="text-base text-[#6C757D]">
            Enter your email to recover your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-base font-medium text-[#0F3D61]"
            >
              Email <span className="text-[#0F3D61]">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-[#484848] rounded-full px-4 h-[56px] placeholder:text-[#787878] text-[#0F3D61] text-base font-normal"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white rounded-full font-bold py-6 text-base disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
