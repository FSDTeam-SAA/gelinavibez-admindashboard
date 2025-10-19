"use client"

import { Header } from "@/components/Shared/Header"
import { useState } from "react"

const exterminationData = [
  {
    id: 1,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Bedbugs",
    company: "Pest Guard Pro",
    submitted: "06/01/2025",
  },
  {
    id: 2,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Roaches",
    company: "Extremify",
    submitted: "06/01/2025",
  },
  {
    id: 3,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Rodents",
    company: "Extermio",
    submitted: "08/01/2025",
  },
  {
    id: 4,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Ants",
    company: "PestPilot",
    submitted: "06/01/2025",
  },
  {
    id: 5,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Termites",
    company: "EcoExterm",
    submitted: "06/01/2025",
  },
  {
    id: 6,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Fleas",
    company: "BugSense",
    submitted: "06/01/2025",
  },
  {
    id: 7,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Spiders",
    company: "PestPilot",
    submitted: "06/01/2025",
  },
  {
    id: 8,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Termites",
    company: "Extremify",
    submitted: "08/01/2025",
  },
  {
    id: 9,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Fleas",
    company: "PestPilot",
    submitted: "08/01/2025",
  },
  {
    id: 10,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Spiders",
    company: "EcoExterm",
    submitted: "08/01/2025",
  },
  {
    id: 11,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Bedbugs",
    company: "Extremify",
    submitted: "08/01/2025",
  },
  {
    id: 12,
    name: "David Juaal",
    email: "example@example.com",
    pestProblem: "Roaches",
    company: "PestPilot",
    submitted: "08/01/2025",
  },
]

export function ExterminationPage() {
  const [currentPage, setCurrentPage] = useState(1)
  console.log(setCurrentPage)
  const itemsPerPage = 5

  const startIndex = (currentPage - 1) * itemsPerPage
  const displayedData = exterminationData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
     
      <Header tittle="Extermination Applications" />

      {/* Table */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-[#E6E7E6] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 bg-[#E7ECEF] border-b border-border">
            <div className="px-6 py-4 flex justify-between font-semibold text-foreground">
              Name
            </div>
            <div className="px-6 py-4 flex justify-between font-semibold text-foreground">
              Pest Problem
            </div>
            <div className="px-6 py-4 flex justify-between font-semibold text-foreground">
              Companies
            </div>
            <div className="px-6 py-4 flex justify-between font-semibold text-foreground">
              Submitted
            </div>
          </div>

          {/* Table Body */}
          <div>
            {displayedData.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-5 border-b border-[#E6E7E6] hover:bg-muted/30 transition-colors"
              >
                <div className="px-6 py-4 flex justify-between flex-col">
                  <p className="text-primary hover:underline font-medium">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.email}</p>
                </div>
                <div className="px-6 py-4 flex justify-between text-foreground">
                  {item.pestProblem}
                </div>
                <div className="px-6 py-4 flex justify-between text-foreground">
                  {item.company}
                </div>
                <div className="px-6 py-4 flex justify-between text-muted-foreground">
                  {item.submitted}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, exterminationData.length)} of{" "}
            {exterminationData.length} results
          </p>
          {/* <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> */}
        </div>
      </div>
    </div>
  )
}