"use client"

import { Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface HeaderProps {
  onMenuClick?: () => void
  tittle?: string
}

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  profileImage: string
}


export function Header({ onMenuClick, tittle }: HeaderProps) {
 const session = useSession();
 const token = session?.data?.accessToken;
  async function fetchUserProfile() {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }
  const data = await response.json()
  return data.data
}

  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  })

  // Fallback values while loading
  const displayName = isLoading ? "Loading..." : `${user?.firstName} ${user?.lastName}`
  const initials = isLoading 
    ? "Avter" 
    : `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`
  const email = isLoading ? "loading@bps.com" : user?.email
  const profileImage = user?.profileImage ?? "/placeholder.svg?height=40&width=40"

  return (
    <header className="h-20 bg-white flex items-center justify-between lg:px-6 sticky top-0 z-50 w-full">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex justify-between w-full">
        <div>
          <h3 className="text-[24px] text-[#0F3D61] font-bold">{tittle}</h3>
          <p className="text-sm text-[#929292] font-normal">
            Welcome back! Here&apos;s what&apos;s happening with your app today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profileImage} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <div className="text-base font-bold text-[#343A40]">{displayName}</div>
            <div className="text-xs text-[#8E938F]">{email}</div>
          </div>
        </div>
      </div>
    </header>
  )
}