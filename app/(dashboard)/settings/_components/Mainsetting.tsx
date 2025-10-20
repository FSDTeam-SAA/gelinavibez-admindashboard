"use client"
import { Header } from "@/components/Shared/Header"
import MainSettings from "./MainSettings"

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
    <Header tittle="Settings" />
    <div className="w-full mt-6 px-2">
      <div className="p-2 border-[1px] border-[#0F3D61] rounded-[12px]">
        <MainSettings />
      </div>
    </div>
    </div>
        
  )
}
