"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TenantApplicationsTable } from "./_components/TenantApplicationsTable";
import { RequestCallsTable } from "./_components/RequestCallsTable";
import { Header } from "@/components/Shared/Header";

export default function TenantApplicationsPage() {
  const [activeTab, setActiveTab] = useState<"applications" | "calls">(
    "applications"
  );

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header tittle="Tenant Applications Management" />
      <div className=" mt-6 pr-5">
        <div className="mb-6 flex justify-end gap-3 pr-5">
          <Button
            variant={activeTab === "applications" ? "default" : "outline"}
            onClick={() => setActiveTab("applications")}
            className={
              activeTab === "applications"
                ? "bg-[#0F3D61] text-white hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] w-[212px]"
                : "bg-white text-slate-900 border-[#0F3D61] hover:bg-[#0F3D61]/90 hover:text-white h-[48px] rounded-[8px] w-[212px]"
            }
          >
            Tenant Applications
          </Button>
          <Button
            variant={activeTab === "calls" ? "default" : "outline"}
            onClick={() => setActiveTab("calls")}
            className={
              activeTab === "calls"
                ? "bg-[#0F3D61] text-white hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] w-[212px]"
                : "bg-white text-slate-900 border-[#0F3D61] hover:bg-[#0F3D61]/90 hover:text-white h-[48px] rounded-[8px] w-[212px]"
            }
          >
            Request Calls
          </Button>
        </div>

        {activeTab === "applications" ? (
          <TenantApplicationsTable />
        ) : (
          <RequestCallsTable />
        )}
      </div>
    </div>
  );
}
