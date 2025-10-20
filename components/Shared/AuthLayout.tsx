import type React from "react"
import Link from "next/link"
import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image with overlay */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/assets/authbg2.jpg"
          alt="Interior design"
          fill
          className="object-cover"
          priority
        />

        {/* Color overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(52, 58, 64, 0.8) 0%, rgba(52, 58, 64, 0) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
          }}
        />

        {/* Logo overlay */}
        <div className="absolute top-8 left-8 z-10">
          <div className="text-white">
            <div className="flex items-center gap-2"></div>
            <div className="text-xs ml-14 -mt-3">
              <Image src="/assets/logo.png" alt="Logo" width={100} height={100} />
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FFFFFF] relative">
        <Link
          href="/"
          className="absolute top-8 right-8 text-sm text-gray-600 hover:text-gray-900"
        >
          Back to Home
        </Link>
        <div className="w-full max-w-[496px] px-8">{children}</div>
      </div>
    </div>
  )
}
