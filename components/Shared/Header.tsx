"use client"

import { Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  onMenuClick?: () => void
  tittle?: string
}

export function Header({ onMenuClick,tittle }: HeaderProps) {
  return (
    <header className="h-20 bg-white  flex items-center justify-between lg:px-6  sticky  top-0 z-50 w-full">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* <div className="flex-1" /> */}
        <div className="flex justify-between w-full">
        <div>
            <h3 className="text-[24px] text-[#0F3D61] font-bold">{tittle}</h3>
            <p className="text-sm text-[#929292] font-normal">Welcome back! Here&apos;s what&apos;s happening with your app today.</p>
        </div>
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="David Judal" />
          <AvatarFallback>DJ</AvatarFallback>
        </Avatar>
        <div className="hidden sm:block">
          <div className="text-base font-bold text-[#343A40]">David Judal</div>
          <div className="text-xs text-[#8E938F]">davidjudal@bps.com</div>
        </div>
      </div>
        </div>
    </header>
  )
}
