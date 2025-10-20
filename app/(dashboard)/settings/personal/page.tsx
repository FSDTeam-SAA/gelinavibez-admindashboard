"use client"

import { Header } from "@/components/Shared/Header"
import { PersonalInfo } from "../_components/PersonalInfo"




export default function PersonalInfoPage() {
  return (
    <div>
      <Header tittle="Settings" />
    <div className="min-h-screen mt-6 pr-2">
      <div className="">
        <PersonalInfo />
      </div>
    </div>
    </div>
  )
}
