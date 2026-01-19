// 'use client'

// import { useState, useEffect } from 'react'
// import SubscriptionPlansList from './_components/Subscription PlansList'
// import EditPlanModal from './_components/EditPlanModaL'
// import DeleteConfirmationModal from './_components/DeleteConfirmationmodal'
// import { useSession } from 'next-auth/react'
// import { Header } from '@/components/Shared/Header'
// import Bradecumb from '@/components/Shared/Bradecumb'

// export interface SubscriptionPlan {
//   _id: string
//   name: string
//   type: string
//   price: number
//   features: string
//   status: string
//   user: {
//     _id: string
//     firstName: string
//     lastName: string
//     email: string
//     role: string
//     profileImage: string
//   }
//   subscriptionUser: string[]
//   createdAt: string
//   updatedAt: string
// }

// export default function Page() {
//   const [plans, setPlans] = useState<SubscriptionPlan[]>([])
//   const [loading, setLoading] = useState(true)
//   const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
//   const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null)
//   const [deleting, setDeleting] = useState(false)
//   const session=useSession();
//   const token =session?.data?.accessToken 

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscribeplan/`
//         )
//         const result = await res.json()
//         if (result.success) setPlans(result.data.data)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchPlans()
//   }, [])

//   const handleDelete = async () => {
//     if (!planToDelete) return
//     setDeleting(true)

//     await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscribeplan/${planToDelete._id}`,
//       { method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         }
//       }
//     )

//     setPlans(plans.filter(p => p._id !== planToDelete._id))
//     setPlanToDelete(null)
//     setDeleting(false)
//   }

//   return (
//     <div className="min-h-screen bg-background p-8">
//       <div className="w-full ">
//         <div className='mb-10'>
//         <Header tittle="Subscription Plans" />
//         <Bradecumb pageName='Subscription Plans'/>
//         </div>

//         {loading ? (
//           <p className="text-center">Loading...</p>
//         ) : (
//           <SubscriptionPlansList
//             plans={plans}
//             onEdit={setEditingPlan}
//             onDelete={setPlanToDelete}
//           />
//         )}

//         {editingPlan && (
//           <EditPlanModal
//             plan={editingPlan}
//             onClose={() => setEditingPlan(null)}
//             onSave={(data) => {
//               setPlans(plans.map(p => p._id === editingPlan._id ? { ...p, ...data } : p))
//               setEditingPlan(null)
//             }}
//           />
//         )}

//         {planToDelete && (
//           <DeleteConfirmationModal
//             planName={planToDelete.name}
//             isDeleting={deleting}
//             onCancel={() => setPlanToDelete(null)}
//             onConfirm={handleDelete}
//           />
//         )}
//       </div>
//     </div>
//   )
// }




'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import CreatePlanModal from './_components/CreatePlanModal'      // ← new component
import { useSession } from 'next-auth/react'
import { Header } from '@/components/Shared/Header'
import Bradecumb from '@/components/Shared/Bradecumb'
import SubscriptionPlansList from './_components/Subscription PlansList'
import EditPlanModal from './_components/EditPlanModaL'
import DeleteConfirmationModal from './_components/DeleteConfirmationmodal'

export interface SubscriptionPlan {
  _id: string
  name: string
  type: string
  price: number
  features: string
  status: string
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
    profileImage: string
  }
  subscriptionUser: string[]
  createdAt: string
  updatedAt: string
}

// API base URL (you can also put it in env or context)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export default function SubscriptionPlansPage() {
  const { data: session } = useSession()
  const token = session?.accessToken as string | undefined

  const queryClient = useQueryClient()

  // Fetch all plans
  const { 
    data: plans = [], 
    isLoading,
    isError 
  } = useQuery<SubscriptionPlan[]>({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/subscribeplan/`)
      if (!res.ok) throw new Error('Failed to fetch plans')
      const json = await res.json()
      return json.success ? json.data.data : []
    },
    enabled: !!token, // only fetch when we have token
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newPlan: Omit<SubscriptionPlan, '_id' | 'user' | 'subscriptionUser' | 'createdAt' | 'updatedAt'>) => {
      if (!token) throw new Error('No authentication token')

      const res = await fetch(`${API_BASE}/subscribeplan/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPlan),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to create plan')
      }

      const json = await res.json()
      return json.data // assuming your API returns the created plan in data field
    },
    onSuccess: (newPlan) => {
      // Optimistic or just invalidate → here we add directly for better UX
      queryClient.setQueryData<SubscriptionPlan[]>(['subscription-plans'], (old = []) => [
        ...old,
        newPlan
      ])
      // Alternative: queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
    },
  })

  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <Header tittle="Subscription Plans" />
          <Bradecumb pageName="Subscription Plans" />
        </div>

        {/* Create Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!token || createMutation.isPending}
            className="rounded-[8px] bg-[#0F3D61] px-6 py-3 font-medium text-white shadow hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            + Create New Plan
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading plans...</div>
        ) : isError ? (
          <div className="text-center py-12 text-destructive">
            Failed to load subscription plans
          </div>
        ) : (
          <SubscriptionPlansList
            plans={plans}
            onEdit={setEditingPlan}
            onDelete={setPlanToDelete}
          />
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <CreatePlanModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={async (data) => {
              try {
                await createMutation.mutateAsync(data)
                setShowCreateModal(false)
              } catch (err) {
                console.error(err)
                // You can show toast/notification here
                alert('Failed to create plan: ' + (err as Error).message)
              }
            }}
            isSubmitting={createMutation.isPending}
          />
        )}

        {/* Edit Modal */}
        {editingPlan && (
          <EditPlanModal
            plan={editingPlan}
            onClose={() => setEditingPlan(null)}
            onSave={(updatedData) => {
              queryClient.setQueryData<SubscriptionPlan[]>(['subscription-plans'], (old = []) =>
                old.map(p => p._id === editingPlan._id ? { ...p, ...updatedData } : p)
              )
              setEditingPlan(null)
            }}
          />
        )}

        {/* Delete Confirmation */}
        {planToDelete && (
          <DeleteConfirmationModal
            planName={planToDelete.name}
            isDeleting={false /* you can add delete mutation later */}
            onCancel={() => setPlanToDelete(null)}
            onConfirm={() => {
              // TODO: Implement delete mutation similarly
              setPlanToDelete(null)
            }}
          />
        )}
      </div>
    </div>
  )
}