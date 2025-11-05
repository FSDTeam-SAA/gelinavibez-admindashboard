"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner" // or your preferred toast library

export default function NotAccessPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    if (error === "unauthorized") {
      toast.error("You are not allowed to access this page.")
    }
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-semibold">Access Denied</h1>
      <p className="text-gray-500 mt-2">You don&apos;t have permission to view this page.</p>
    </div>
  )
}
