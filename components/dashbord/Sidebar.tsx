"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, LogOut, X, LayoutDashboard, FileText, Home, Award, CreditCard, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tenant Applications Management", href: "/tenant-applications", icon: FileText },
  { name: "Apartment Listings Management", href: "/apartment-listings", icon: Home },
  { name: "Distinguished Experts", href: "/distinguished-experts", icon: Award },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  isMobileMenuOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isMobileMenuOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  React.useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

 const renderLinks = () =>
  navigation.map((item) => {
    const isActive =
      pathname === item.href ||
      (item.href === "/settings" && pathname.startsWith("/settings")); // ✅ change here

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-[18px] font-normal rounded-lg transition-colors w-full text-nowrap",
          isActive
            ? "bg-[#0F3D6133]/20 text-[#0F3D61]"
            : "text-[#0F3D61] hover:bg-[#0F3D6133]/20",
        )}
      >
        <item.icon className="w-5 h-5" />
        <span className="flex-1">{item.name}</span>
      </Link>
    )
  })


  return (
    <>
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-gray-900/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[386px] bg-[#EFEFEF] border-r-[2px] border-[#B3BEC8]">
        <div className="flex items-center justify-center h-[90px] w-[120px] pl-5">
          <Image src="/assets/logo.png" width={1000} height={1000} alt="logo" className="w-full h-full" />
        </div>

        {/* Nav Links + Logout right below Settings */}
        <nav className="flex-1 py-6 space-y-1">
          {renderLinks()}

          {/* Logout button right below other links */}
          <button
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-[18px] font-normal text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-20 border-b border-gray-200 px-6">
          <div className="flex flex-col items-center flex-1">
            <div className="text-2xl font-serif text-amber-700">BPS</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Property</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Management</div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {renderLinks()}

          {/* Logout below other links */}
          <button
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-[18px] font-normal text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </nav>
      </aside>
    </>
  )
}
