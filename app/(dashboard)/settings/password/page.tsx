"use client"
import { Header } from "@/components/Shared/Header"
import { ChangePassword } from "../_components/ChangePassword"

export default function ChangePasswordPage() {
  return (
    <div>
      <Header tittle="Settings" />
    <div className="min-h-screen pr-2 mt-6">
      <div className="">
        <ChangePassword />
      </div>
    </div>
    </div>
  )
}
