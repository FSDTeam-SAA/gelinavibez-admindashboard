"use client";
// import { ContractorsTable } from "./contractors-table";
import { Header } from "@/components/Shared/Header";
import Bradecumb from "@/components/Shared/Bradecumb";
import UserManagementTable from "./contractors-table";

export function ContractorsPage() {


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header tittle="Contactors" />
      <div className=" flex justify-between pr-5 mt-6">
        <Bradecumb pageName="Contactors" />
        {/* <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0F3D61] h-[50px] rounded-[8px] px-6 text-base text-white font-semibold hover:bg-[#0F3D61]/90"
        >
          Add Contractor
        </Button> */}
      </div>
      {/* Content */}
      <div className="mt-2 ">
        <UserManagementTable />
      </div>

    
    </div>
  );
}
