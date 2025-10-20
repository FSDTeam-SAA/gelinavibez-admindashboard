// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { X } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { toast } from "sonner"
// import { useSession } from "next-auth/react"

// interface ServiceModalProps {
//   isOpen: boolean
//   onClose: () => void
// }

// export function ServiceModal({ isOpen, onClose }: ServiceModalProps) {
//   const [selectedCategory, setSelectedCategory] = useState("")
//   const session = useSession()
//   const token = session?.data?.accessToken
//   const queryClient = useQueryClient() // ✅ React Query client

//   // --- API Function ---
//   async function postCategory(category: string) {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ name: category }),
//     })

//     if (!response.ok) {
//       throw new Error("Failed to create category")
//     }

//     return response.json()
//   }

//   // --- Mutation setup ---
//   const mutation = useMutation({
//     mutationFn: postCategory,
//     onSuccess: () => {
//       toast.success("Category created successfully!")
//       queryClient.invalidateQueries({ queryKey: ["services"] })

//       setTimeout(() => {
//         onClose()
//         setSelectedCategory("")
//       }, 500)
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || "Failed to create category")
//     },
//   })

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-[1300px] p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-foreground">Service Categories</h2>
//           <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
//             <X className="w-5 h-5 text-foreground" />
//           </button>
//         </div>

//         {/* Input Field */}
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-foreground mb-2">Enter Category Name</label>
//             <Input
//               type="text"
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="w-full bg-[#E7ECEF] h-[48px] rounded-[8px] border-none focus:outline-none placeholder:text-[#929292] text-[#000000]"
//               placeholder="Enter service category"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4 justify-end">
//             <Button
//               onClick={() => {
//                 if (selectedCategory.trim()) {
//                   mutation.mutate(selectedCategory)
//                 } else {
//                   toast.error("Please enter a category name")
//                 }
//               }}
//               disabled={mutation.isPending}
//               className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white px-10"
//             >
//               {mutation.isPending ? "Submitting..." : "Submit"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface Service {
  _id?: string
  name: string
}

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Service | null
  mode?: "add" | "edit"
}

interface error {
  message: string
}

export function ServiceModal({ isOpen, onClose, initialData, mode = "add" }: ServiceModalProps) {
  const [categoryName, setCategoryName] = useState("")
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const token = session?.accessToken
  const isEditMode = mode === "edit"

  useEffect(() => {
    if (initialData) {
      setCategoryName(initialData.name)
    } else {
      setCategoryName("")
    }
  }, [initialData])

  const mutation = useMutation({
    mutationFn: async () => {
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/service/${initialData?._id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/service`

      const method = isEditMode ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName }),
      })

      if (!response.ok) {
        throw new Error(isEditMode ? "Failed to update service" : "Failed to create service")
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Service updated successfully!" : "Service created successfully!")
      queryClient.invalidateQueries({ queryKey: ["services"] })
      onClose()
      setCategoryName("")
    },
    onError: (error: error) => {
      toast.error(error.message || "Something went wrong")
    },
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white !rounded-[8px] shadow-lg w-full max-w-[800px] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {isEditMode ? "Edit Service" : "Add New Service"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Service Name
            </label>
            <Input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full bg-[#E7ECEF] h-[48px] rounded-[8px] border-none focus:outline-none placeholder:text-[#929292] text-[#000000]"
              placeholder="Enter service name"
            />
          </div>

          <div className="flex gap-3 pt-4 justify-end">
            <Button
              onClick={() => {
                if (categoryName.trim()) {
                  mutation.mutate()
                } else {
                  toast.error("Please enter a service name")
                }
              }}
              disabled={mutation.isPending}
              className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white px-10"
            >
              {mutation.isPending
                ? isEditMode
                  ? "Updating..."
                  : "Submitting..."
                : isEditMode
                ? "Update Service"
                : "Add Service"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
