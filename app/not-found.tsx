"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <h1 className="text-7xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-gray-600 text-lg max-w-md">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
      </p>
      <Button asChild className="mt-6">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  )
}
