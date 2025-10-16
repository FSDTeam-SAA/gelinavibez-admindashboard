"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/Shared/AuthLayout"

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(59)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ otp: otp.join("") })
  }

  const handleResend = () => {
    setTimer(59)
    setOtp(["", "", "", "", "", ""])
    // Handle resend logic
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif text-[#0F3D61]">Verify Email</h1>
          <p className="text-base text-[#6C757D]">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center !text-2xl border-2 border-[#484848] rounded-[10px] text-[#0F3D61] focus:ring-2 focus:ring-[#0F3D61] focus:border-[#0F3D61] font-bold"
              />
            ))}
          </div>

            <div className="flex justify-between">
          <div className="flex items-center justify-center gap-2 text-base text-[#6C757D]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
            <span>
              {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </span>
          </div>

          <div className="text-center text-base text-[#6C757D]">
            Didn’t get a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className={`font-medium hover:underline ${
                timer === 0
                  ? "text-[#0F3D61]"
                  : "text-[#0F3D61]/60 cursor-not-allowed"
              }`}
              disabled={timer > 0}
            >
              Resend
            </button>
          </div>
            </div>

          <Button
            type="submit"
            className="w-full bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white rounded-full font-bold py-6 text-base"
          >
            Verify
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
