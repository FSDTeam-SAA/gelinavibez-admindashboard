"use client"

import { useState, useRef, type KeyboardEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/web/AuthLayout"

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(64) // 1:04 in seconds
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  // Timer effect
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

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call (replace with your actual API call)
      // await verifyOtpAPI(otp.join(""))
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

      // Redirect to reset-password page on success
      router.push("/reset-password")
    } catch (error) {
      console.error("OTP verification error:", error)
      // Handle error (you can add toast notification here)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    // Simulate resend OTP API call
    // await resendOtpAPI()
    setTimer(64) // Reset timer
    setOtp(["", "", "", "", "", ""]) // Reset OTP inputs
    inputRefs.current[0]?.focus()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[624px]">
        <div className="bg-[#FFFFFF1A]/10 border border-white/10 p-8 md:p-10 rounded-[6px]">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#C5A574] mb-2">
              Verify Email
            </h1>
            <h3 className="text-[#F9F6F1] text-base font-normal">
              Enter OTP to verify your email address
            </h3>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-2 md:gap-3">
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
                  className={`w-12 h-12 md:w-14 md:h-14 text-center text-xl font-medium bg-transparent ${
                    digit ? 'border-[#C5A574] text-[#C5A574]' : 'border-white text-[#F9F6F1]'
                  } focus:border-[#C5A574] rounded-[6px] placeholder:text-white/40`}
                />
              ))}
            </div>

            {/* Timer and Resend */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
                <span>{formatTime(timer)}</span>
              </div>
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0}
                className="text-[#D4AF7A] hover:text-[#E5C08B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Didn&apos;t get a code? <span className="underline">Resend</span>
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || otp.some(digit => !digit)}
              className="w-full h-12 bg-[#D4AF7A] hover:bg-[#C5A574] font-medium rounded-full transition-colors text-[18px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}