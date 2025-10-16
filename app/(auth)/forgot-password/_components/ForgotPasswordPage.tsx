"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/Shared/AuthLayout"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle send OTP logic
    console.log({ email })
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif text-[#0F3D61]">Forgot Password!</h1>
          <p className="text-base text-[#6C757D]">
            Enter your email to recover your password
          </p>
        </div>

        {/* Form */}
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
            className="w-full bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white rounded-full font-bold py-6 text-base"
          >
            Send OTP
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
