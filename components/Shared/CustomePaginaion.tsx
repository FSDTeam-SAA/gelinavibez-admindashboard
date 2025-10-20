"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function CustomPagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const maxVisiblePages = 4
  const pageNumbers = Array.from(
    { length: Math.min(maxVisiblePages, totalPages) },
    (_, i) => i + 1
  )

  return (
    <div className="mt-6 flex items-center justify-between">
      <div>
        <p className="text-base text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
        </p>
      </div>

      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="px-3 py-2 rounded border border-border text-foreground hover:bg-gray-50 cursor-pointer"
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationPrevious>
            </PaginationItem>

            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  className={`w-[40px] h-[40px] flex items-center justify-center rounded cursor-pointer transition-colors
                    ${
                      currentPage === page
                        ? "bg-[#0F3D61] text-white"
                        : "border border-border text-foreground hover:bg-[#0F3D61] hover:text-white"
                    }`}
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                className="px-3 py-2 rounded border border-border text-foreground hover:bg-gray-50 cursor-pointer"
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
