"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "@/components/web/AuthLayout"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  return (
    <AuthLayout>
      <div className="w-full max-w-[624px]">
        <div className="bg-[#FFFFFF1A]/10 border border-white/10 p-8 md:p-10 rounded-[6px]">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#C5A574] mb-2">
              Create Your Account
            </h1>
            <h3 className="text-[#F9F6F1] text-base font-normal">
              Connect families with trusted care today.
            </h3>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[#F5F5F5] text-base font-medium">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  className="bg-transparent border-[#C0C3C1] placeholder:text-white/40 focus:border-white/40 pl-5 h-12 rounded-full placeholder:text-[#F9F6F1] text-[#F9F6F1]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[#F5F5F5] text-base font-medium">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="bg-transparent border-[#C0C3C1] placeholder:text-white/40 focus:border-white/40 pl-5 h-12 rounded-full placeholder:text-[#F9F6F1] text-[#F9F6F1]"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F5F5F5] text-base font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email..."
                className="bg-transparent border-[#C0C3C1] placeholder:text-white/40 focus:border-white/40 pl-5 h-12 rounded-full placeholder:text-[#F9F6F1] text-[#F9F6F1]"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#F5F5F5] text-base font-medium">
                Create New Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password..."
                  className="bg-transparent border-[#C0C3C1] placeholder:text-white/40 focus:border-white/40 pl-5 h-12 rounded-full pr-12 placeholder:text-[#F9F6F1] text-[#F9F6F1]"
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
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter Password..."
                  className="bg-transparent border-[#C0C3C1] placeholder:text-white/40 focus:border-white/40 pl-5 h-12 rounded-full pr-12 placeholder:text-[#F9F6F1] text-[#F9F6F1]"
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

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-0.5 border-white/40 data-[state=checked]:bg-[#D4AF7A] data-[state=checked]:border-[#D4AF7A]"
              />
              <label htmlFor="terms" className="text-sm text-white/80 cursor-pointer leading-tight">
                I Agree to{" "}
                <Link href="/terms" className="text-[#D4AF7A] hover:text-[#E5C08B] transition-colors">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#D4AF7A] hover:text-[#E5C08B] transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Continue Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#D4AF7A] hover:bg-[#C5A574] font-medium rounded-full transition-colors text-[18px] text-white"
            >
              Continue
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center text-sm text-white/80">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-medium hover:text-[#D4AF7A] transition-colors">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}