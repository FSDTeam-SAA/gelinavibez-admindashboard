"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContractorsTable } from "./contractors-table";
import { ContractorModal } from "./contractor-modal";
import { Header } from "@/components/Shared/Header";
import Bradecumb from "@/components/Shared/Bradecumb";

export function ContractorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header tittle="Contactors" />
      <div className=" flex justify-between pr-5 mt-6">
        <Bradecumb pageName="Contactors" />
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0F3D61] h-[50px] rounded-[8px] px-6 text-base text-white font-semibold hover:bg-[#0F3D61]/90"
        >
          Add Contractor
        </Button>
      </div>
      {/* Content */}
      <div className="mt-6 pr-5">
        <ContractorsTable />
      </div>

      {/* Modal */}
      <ContractorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
