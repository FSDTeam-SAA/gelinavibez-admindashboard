// "use client"

// import React, { useState } from "react"
// import { Header } from "@/components/Shared/Header"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { format } from "date-fns"
// import { CustomPagination } from "@/components/Shared/CustomePaginaion"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useGetNewsletter } from "@/hooks/ApiClling"
// import { useSession } from "next-auth/react"
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { toast } from "sonner"

// const NewsletterComponents = () => {
//   const [currentPage, setCurrentPage] = useState(1)
//   const { data: session } = useSession()
//   const token = session?.accessToken || ""

//   // Modal states
//   const [open, setOpen] = useState(false)
//   const [subject, setSubject] = useState("")
//   const [body, setBody] = useState("")

//   const {
//     data: newsletterData,
//     isLoading,
//     isError,
//     error,
//   } = useGetNewsletter(token, currentPage, 10)

//   const subscribers = newsletterData?.data || []
//   const totalItems = newsletterData?.meta?.total || 0
//   const itemsPerPage = newsletterData?.meta?.limit || 5


//   const handleSendMail = async () => {
//     try {
//       if (!subject || !body) {
//         toast.error("Please fill in both subject and body.")
//         return
//       }

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subscribe/broadcast`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           subject,
//           html: body,
//         }),
//       })

//       const result = await res.json()

//       if (!res.ok) throw new Error(result.message || "Failed to send emails")

//       toast.success("Emails sent successfully!")
//       setOpen(false)
//       setSubject("")
//       setBody("")
//     } catch (error) {
//       if (error instanceof Error) {
//         toast.error(error.message || "Error sending emails.")
//       } else {
//         toast.error("Error sending emails.")
//       }
//     }
//   }






//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <Header tittle="News Letter" />

//       {/* Breadcrumb + Action */}
//       <div className="flex justify-between mt-10 pr-5 items-center">
//         <h2 className="text-lg font-semibold text-[#131313]">Subscribers List</h2>
//         {/* Send Mail Modal Trigger */}
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white gap-2">
//               Send Mail
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[500px] bg-white">
//             <DialogHeader>
//               <DialogTitle>Send Email to Subscribers</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 mt-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Subject</label>
//                 <Input
//                   placeholder="Enter email subject"
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Body (HTML Supported)</label>
//                 <Textarea
//                   placeholder="Write your message here..."
//                   value={body}
//                   onChange={(e) => setBody(e.target.value)}
//                   rows={6}
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button
//                 onClick={handleSendMail}
//                 className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white"
//               >
//                 Send
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>


//       {/* Table Section */}
//       <div>
//         <Card className="overflow-hidden mr-5 mt-6">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-100 border-b border-[#E6E7E6]">
//                   <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">#</th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Name</th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Email</th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Phone</th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Subscribed At</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {isLoading ? (
//                   Array.from({ length: 5 }).map((_, index) => (
//                     <tr key={index}>
//                       <td colSpan={5} className="px-6 py-4">
//                         <Skeleton className="h-5 w-full" />
//                       </td>
//                     </tr>
//                   ))
//                 ) : isError ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-4 text-center text-red-500">
//                       Error: {(error as Error).message}
//                     </td>
//                   </tr>
//                 ) : subscribers.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
//                       No subscribers found
//                     </td>
//                   </tr>
//                 ) : (
//                   subscribers.map((subscriber, index: number) => (
//                     <tr key={subscriber._id} className="border-b border-[#E6E7E6]">
//                       <td className="px-6 py-4 text-base text-[#424242]">
//                         {(currentPage - 1) * itemsPerPage + index + 1}
//                       </td>
//                       <td className="px-6 py-4 text-base text-[#424242]">
//                         {subscriber.firstName} {subscriber.lastName}
//                       </td>
//                       <td className="px-6 py-4 text-base text-[#424242]">{subscriber.email}</td>
//                       <td className="px-6 py-4 text-base text-[#424242]">{subscriber.phone}</td>
//                       <td className="px-6 py-4 text-base text-[#424242]">
//                         {format(new Date(subscriber.createdAt), "dd MMM yyyy, hh:mm a")}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </Card>

//         {/* Pagination */}
//         <div className="w-full pr-5 mt-6">
//           <CustomPagination
//             totalItems={totalItems}
//             itemsPerPage={itemsPerPage}
//             currentPage={currentPage}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default NewsletterComponents




"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"
import { Header } from "@/components/Shared/Header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CustomPagination } from "@/components/Shared/CustomePaginaion"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetNewsletter } from "@/hooks/ApiClling"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

const NewsletterComponents = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: session } = useSession()
  const token = session?.accessToken || ""

  // Modal states
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  const {
    data: newsletterData,
    isLoading,
    isError,
    error,
  } = useGetNewsletter(token, currentPage, 10)

  const subscribers = newsletterData?.data || []
  const totalItems = newsletterData?.meta?.total || 0
  const itemsPerPage = newsletterData?.meta?.limit || 5
  const [loading, setLoading] = useState(false)
  // Send email handler
  const handleSendMail = async () => {
    if (!subject || !body) {
      toast.error("Please fill in both subject and body.")
      return
    }

    try {
      setLoading(true) // start loading

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subscribe/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          html: body,
        }),
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message || "Failed to send emails")

      toast.success("Emails sent successfully!")
      setOpen(false)
      setSubject("")
      setBody("")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Error sending emails.")
      } else {
        toast.error("Error sending emails.")
      }
    } finally {
      setLoading(false) // stop loading in all cases
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header tittle="News Letter" />

      {/* Breadcrumb + Action */}
      <div className="flex justify-between mt-10 pr-5 items-center">
        <h2 className="text-lg font-semibold text-[#131313]">Subscribers List</h2>

        {/* Send Mail Modal Trigger */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white gap-2">
              Send Mail
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[650px] bg-white">
            <DialogHeader>
              <DialogTitle>Send Email to Subscribers</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <Input
                  placeholder="Enter email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Body (Rich Text / HTML)
                </label>
                <ReactQuill
                  theme="snow"
                  value={body}
                  onChange={setBody}
                  className="h-[250px] bg-white"
                  placeholder="Write your message here..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link",],
                      ["clean"],
                    ],
                  }}
                />
              </div>
            </div>

            <DialogFooter className="py-10">
              <Button
                onClick={handleSendMail}
                className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white flex items-center gap-2"
                disabled={loading} // prevent multiple clicks while loading
              >
                {loading ? (
                  <>
                    Sending <Loader2 className="animate-spin h-4 w-4" />
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Section */}
      <div>
        <Card className="overflow-hidden mr-5 mt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-[#E6E7E6]">
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">#</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Name</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Email</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Phone</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#131313]">Subscribed At</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b border-[#E6E7E6]">
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-6 rounded-md" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-32 rounded-md" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-48 rounded-md" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-28 rounded-md" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-40 rounded-md" />
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                      Error: {(error as Error).message}
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber, index: number) => (
                    <tr key={subscriber._id} className="border-b border-[#E6E7E6]">
                      <td className="px-6 py-4 text-base text-[#424242]">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 text-base text-[#424242]">
                        {subscriber.firstName} {subscriber.lastName}
                      </td>
                      <td className="px-6 py-4 text-base text-[#424242]">{subscriber.email}</td>
                      <td className="px-6 py-4 text-base text-[#424242]">{subscriber.phone}</td>
                      <td className="px-6 py-4 text-base text-[#424242]">
                        {format(new Date(subscriber.createdAt), "dd MMM yyyy, hh:mm a")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        <div className="w-full pr-5 mt-6">
          <CustomPagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}

export default NewsletterComponents
