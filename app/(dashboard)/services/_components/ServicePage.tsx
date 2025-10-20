"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ServiceModal } from "./ServiceModal"
import { Header } from "@/components/Shared/Header"
import Bradecumb from "@/components/Shared/Bradecumb"
import { CustomPagination } from "@/components/Shared/CustomePaginaion"

const servicesData = [
  { id: 1, category: "Residential Construction", submitted: "06/01/2025" },
  { id: 2, category: "Renovation", submitted: "06/01/2025" },
  { id: 3, category: "Maintenance", submitted: "06/01/2025" },
  { id: 4, category: "Pest Control", submitted: "06/01/2025" },
  { id: 5, category: "Renovation", submitted: "08/01/2025" },
  { id: 6, category: "Residential Construction", submitted: "06/01/2025" },
  { id: 7, category: "Maintenance", submitted: "08/01/2025" },
  { id: 8, category: "Pest Control", submitted: "08/01/2025" },
  { id: 9, category: "Maintenance", submitted: "08/01/2025" },
  { id: 10, category: "Renovation", submitted: "08/01/2025" },
  { id: 11, category: "Pest Control", submitted: "08/01/2025" },
  { id: 12, category: "Residential Construction", submitted: "08/01/2025" },
]

export function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
   const [currentPage, setCurrentPage] = useState(1)
   const itemsPerPage = 5
   const totalItems = servicesData.length
  

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <Header tittle="Services " />
      <div className="flex items-center justify-between mb-6 mt-6 pr-5">
          <Bradecumb pageName="Services " />
           <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white px-10"
          >
            + Add Service
          </Button>
      </div>

      {/* Table */}
      <div className="pr-5">
        <div className="bg-white rounded-lg border border-[#E6E7E6]overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-2 bg-[#E7ECEF] border-b border-[#E6E7E6]">
            <div className="px-6 py-4 font-semibold text-foreground">Categories</div>
            <div className="px-6 py-4 font-semibold text-foreground">Submitted</div>
          </div>

          {/* Table Body */}
          <div>
            {servicesData.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-2 border-b border-[#E6E7E6]hover:bg-muted/30 transition-colors"
              >
                <div className="px-6 py-4 text-foreground">
                  <a href="#" className="text-primary hover:underline">
                    {service.category}
                  </a>
                </div>
                <div className="px-6 py-4 text-muted-foreground">{service.submitted}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
           <div className="w-full pb-3">
                <CustomPagination
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
      </div>

      {/* Service Modal */}
      <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
