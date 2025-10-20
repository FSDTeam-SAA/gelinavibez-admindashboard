"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Settings, LogOut,  LayoutDashboard, FileText, Home, Award, CreditCard, Users, ContactRound, BrickWallShield } from "lucide-react"
import { cn } from "@/lib/utils"
import React, { useState } from "react"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tenant Applications Management", href: "/tenant-applications", icon: FileText },
  { name: "Extermination Applications", href: "/extermination-applications", icon: Award },
  { name: "Apartment Listings Management", href: "/apartment-listings", icon: Home },
  { name: "Contactors", href: "/contactors", icon: ContactRound },
  { name: "Services", href: "/services", icon: BrickWallShield },
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  React.useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const renderLinks = () =>
    navigation.map((item) => {
      const isActive =
        pathname === item.href ||
        (item.href === "/settings" && pathname.startsWith("/settings"))

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

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-[8px] shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-[#0F3D61] mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-[6px] bg-red-600 text-white  hover:bg-red-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[386px] bg-[#EFEFEF] border-r-[2px] border-[#B3BEC8]">
        <div className="flex items-center justify-center h-[90px] w-[120px] pl-5">
          <Image src="/assets/logo.png" width={1000} height={1000} alt="logo" className="w-full h-full" />
        </div>

        {/* Nav Links + Logout right below Settings */}
        <nav className="flex-1 py-6 space-y-1">
          {renderLinks()}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
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