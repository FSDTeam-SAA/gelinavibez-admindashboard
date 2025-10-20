// "use client"

// import { Pagination } from "@/components/Shared/Pagination"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { useState } from "react"
// import { Check, Delete, Eye, Trash2 } from "lucide-react" 
// import { Button } from "@/components/ui/button"

// const applications = [
//   {
//     id: 1,
//     name: "David Juaal",
//     email: "example@example.com",
//     apartmentStyle: "Apartment",
//     rent: "$2,200",
//     status: "Approved",
//     submitted: "06/01/2025",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 2,
//     name: "David Juaal",
//     email: "example@example.com",
//     apartmentStyle: "Studio",
//     rent: "$2,200",
//     status: "Approved",
//     submitted: "06/01/2025",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 3,
//     name: "David Juaal",
//     email: "example@example.com",
//     apartmentStyle: "2 - Bedroom",
//     rent: "$2,200",
//     status: "Approved",
//     submitted: "06/01/2025",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 4,
//     name: "David Juaal",
//     email: "example@example.com",
//     apartmentStyle: "1 - Bedroom",
//     rent: "$2,200",
//     status: "Denied",
//     submitted: "06/01/2025",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 5,
//     name: "David Juaal",
//     email: "example@example.com",
//     apartmentStyle: "3 - Bedroom",
//     rent: "$2,200",
//     status: "Approved",
//     submitted: "06/01/2025",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 6,
//     name: "David Juaal",
//     email: "example@example.com",
//     apartmentStyle: "Duplex",
//     rent: "$2,200",
//     status: "Denied",
//     submitted: "06/01/2025",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 7,
//     name: "David Juaal",
//     email: "example@example.com",
//     apartmentStyle: "Triplex",
//     rent: "$2,200",
//     status: "Denied",
//     submitted: "06/01/2025",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 8,
//     name: "David Juaal",
//     email: "example@example.com",
//     apartmentStyle: "Apartment",
//     rent: "$2,200",
//     status: "Pending",
//     submitted: "06/01/2025",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 9,
//     name: "David Juaal",
//     email: "example@example.com",
//     apartmentStyle: "Apartment",
//     rent: "$2,200",
//     status: "Pending",
//     submitted: "06/01/2025",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 10,
//     name: "David Juaal",
//     email: "example@example.com",
//     apartmentStyle: "Apartment",
//     rent: "$2,200",
//     status: "Pending",
//     submitted: "06/01/2025",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
// ]

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "Approved":
//       return "bg-[#E7ECEF] text-[#27BE69] hover:bg-[#E7ECEF]/90 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center gap-2 z-50 "
//     case "Denied":
//       return "bg-[#FEECEE] text-[#E5102E] hover:bg-[#FEECEE]/90 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center gap-2 z-50 "
//     case "Pending":
//       return "bg-[#FBF8E8] text-[#816D01] hover:bg-[#FBF8E8]/90 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center gap-2 z-50 "
//     default:
//       return "bg-gray-100 text-gray-700 hover:bg-gray-100 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center gap-2 z-50 "
//   }
// }

// export function TenantApplicationsTable() {
//   const [currentPage, setCurrentPage] = useState(1)
//   const resultsPerPage = 10
//   const totalResults = applications.length
//   const totalPages = Math.ceil(totalResults / resultsPerPage)

//   const startResult = (currentPage - 1) * resultsPerPage + 1
//   const endResult = Math.min(currentPage * resultsPerPage, totalResults)

//   const currentApplications = applications.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)

//   return (
//     <div className="px-5">
//       <div className="overflow-x-auto">
//         <table className="w-full border rounded-[10px]">
//           <thead className="bg-[#E7ECEF] h-[50px] border-b ">
//             <tr>
//               <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Name</th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Apartment Style</th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Rent</th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Submitted</th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Action</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentApplications.map((application) => (
//               <tr key={application.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center gap-3">
//                     <Avatar className="h-10 w-10">
//                       <AvatarImage src={application.avatar || "/placeholder.svg"} alt={application.name} />
//                       <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <div className="text-base font-semibold text-[#0F3D61]">{application.name}</div>
//                       <div className="text-xs text-[#68706A] font-normal">{application.email}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-[#68706A]">
//                   {application.apartmentStyle}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-[#68706A]">
//                   {application.rent}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <Badge className={getStatusColor(application.status)}>
//                     {application.status === "Approved" && (
//                       <Check className="w-4 h-4 stroke-[3]" />
//                     )}
//                     {application.status}
//                   </Badge>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-base text-[#68706A] font-normal">{application.submitted}</td>
//                 <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
//                   <div className="flex items-center gap-3 cursor-pointer">
//                     <Eye className="w-5 h-5" />
//                     <Trash2 className="w-5 h-5" />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setCurrentPage}
//         totalResults={totalResults}
//         resultsPerPage={resultsPerPage}
//         startResult={startResult}
//         endResult={endResult}
//       />
      
//     </div>
//   )
// }




"use client"

import { Pagination } from "@/components/Shared/Pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Check, Eye, Trash2 } from "lucide-react"
import { PersonalDetailsModal } from "./PersonalDetailsModal"

const applications = [
  {
    id: 1,
    name: "David Juaal",
    email: "example@example.com",
    apartmentStyle: "Apartment",
    rent: "$2,200",
    status: "Approved",
    submitted: "06/01/2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "David Juaal",
    email: "example@example.com",
    apartmentStyle: "Studio",
    rent: "$2,200",
    status: "Approved",
    submitted: "06/01/2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "David Juaal",
    email: "example@example.com",
    apartmentStyle: "2 - Bedroom",
    rent: "$2,200",
    status: "Approved",
    submitted: "06/01/2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "David Juaal",
    email: "example@example.com",
    apartmentStyle: "1 - Bedroom",
    rent: "$2,200",
    status: "Denied",
    submitted: "06/01/2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "David Juaal",
    email: "example@example.com",
    apartmentStyle: "3 - Bedroom",
    rent: "$2,200",
    status: "Approved",
    submitted: "06/01/2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "David Juaal",
    email: "example@example.com",
    apartmentStyle: "Duplex",
    rent: "$2,200",
    status: "Denied",
    submitted: "06/01/2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "David Juaal",
    email: "example@example.com",
    apartmentStyle: "Triplex",
    rent: "$2,200",
    status: "Denied",
    submitted: "06/01/2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "David Juaal",
    email: "example@example.com",
    apartmentStyle: "Apartment",
    rent: "$2,200",
    status: "Pending",
    submitted: "06/01/2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 9,
    name: "David Juaal",
    email: "example@example.com",
    apartmentStyle: "Apartment",
    rent: "$2,200",
    status: "Pending",
    submitted: "06/01/2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 10,
    name: "David Juaal",
    email: "example@example.com",
    apartmentStyle: "Apartment",
    rent: "$2,200",
    status: "Pending",
    submitted: "06/01/2025",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-[#E7ECEF] text-[#27BE69] hover:bg-[#E7ECEF]/90 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center gap-2 z-50 "
    case "Denied":
      return "bg-[#FEECEE] text-[#E5102E] hover:bg-[#FEECEE]/90 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center gap-2 z-50 "
    case "Pending":
      return "bg-[#FBF8E8] text-[#816D01] hover:bg-[#FBF8E8]/90 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center gap-2 z-50 "
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100 w-[131px] h-[40px] rounded-[4px] text-base flex items-center justify-center gap-2 z-50 "
  }
}

export function TenantApplicationsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedApplication, setSelectedApplication] = useState<(typeof applications)[0] | null>(null)
  const [isPersonalDetailsModalOpen, setIsPersonalDetailsModalOpen] = useState(false)

  const resultsPerPage = 10
  const totalResults = applications.length
  const totalPages = Math.ceil(totalResults / resultsPerPage)

  const startResult = (currentPage - 1) * resultsPerPage + 1
  const endResult = Math.min(currentPage * resultsPerPage, totalResults)

  const currentApplications = applications.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)

  const handleViewDocument = (application: (typeof applications)[0]) => {
    setSelectedApplication(application)
    setIsPersonalDetailsModalOpen(true)
  }

  return (
    <div className="px-5">
      <div className="overflow-x-auto">
        <table className="w-full border rounded-[10px]">
          <thead className="bg-[#E7ECEF] h-[50px] border-b ">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Apartment Style</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Rent</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Submitted</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-[#343A40] tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentApplications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={application.avatar || "/placeholder.svg"} alt={application.name} />
                      <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-base font-semibold text-[#0F3D61]">{application.name}</div>
                      <div className="text-xs text-[#68706A] font-normal">{application.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-[#68706A]">
                  {application.apartmentStyle}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-[#68706A]">{application.rent}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status === "Approved" && <Check className="w-4 h-4 stroke-[3]" />}
                    {application.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-[#68706A] font-normal">
                  {application.submitted}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewDocument(application)}
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="cursor-pointer hover:text-red-600 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        startResult={startResult}
        endResult={endResult}
      />

      {selectedApplication && (
        <PersonalDetailsModal
          isOpen={isPersonalDetailsModalOpen}
          onClose={() => {
            setIsPersonalDetailsModalOpen(false)
            setSelectedApplication(null)
          }}
          applicantName={selectedApplication.name}
          applicantEmail={selectedApplication.email}
        />
      )}
    </div>
  )
}
