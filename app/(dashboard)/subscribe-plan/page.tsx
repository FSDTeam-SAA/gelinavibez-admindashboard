'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

// Components
import { Header } from '@/components/Shared/Header'
import Bradecumb from '@/components/Shared/Bradecumb'
import SubscriptionPlansList from './_components/Subscription PlansList'
import CreatePlanModal from './_components/CreatePlanModal'      
import EditPlanModal from './_components/EditPlanModaL'
import DeleteConfirmationModal from './_components/DeleteConfirmationmodal'

// Types
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

export type PlanFormData = Omit<SubscriptionPlan, '_id' | 'user' | 'subscriptionUser' | 'createdAt' | 'updatedAt'>

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export default function SubscriptionPlansPage() {
  const { data: session } = useSession()
  const token = session?.accessToken as string | undefined
  const queryClient = useQueryClient()

  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // 1. FETCH
  const { data: plans = [], isLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/subscribeplan/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch plans')
      const json = await res.json()
      return json.success ? json.data.data : []
    },
    enabled: !!token, 
  })

  // 2. CREATE
  const createMutation = useMutation({
    mutationFn: async (newPlan: PlanFormData) => {
      const res = await fetch(`${API_BASE}/subscribeplan/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPlan),
      })
      if (!res.ok) throw new Error('Failed to create plan')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
      setShowCreateModal(false)
    },
  })

  // 3. UPDATE
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PlanFormData> }) => {
      const res = await fetch(`${API_BASE}/subscribeplan/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update plan')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
      setEditingPlan(null)
    },
  })

  // 4. DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/subscribeplan/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete plan')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
      setPlanToDelete(null)
    },
  })

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <Header tittle="Subscription Plans" />
          <Bradecumb pageName="Subscription Plans" />
        </div>

        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!token || createMutation.isPending}
            className="rounded-[8px] bg-[#0F3D61] hover:bg-[#0F3D61]/90 px-6 py-3 font-medium text-white shadow disabled:opacity-60 transition-colors"
          >
            {createMutation.isPending ? 'Creating...' : '+ Create New Plan'}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading plans...</div>
        ) : (
          <SubscriptionPlansList
            plans={plans}
            onEdit={setEditingPlan}
            onDelete={setPlanToDelete}
          />
        )}

        {showCreateModal && (
          <CreatePlanModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            // Changed to mutateAsync to satisfy the Promise return type
            onSubmit={async (data: PlanFormData) => { await createMutation.mutateAsync(data) }}
            isSubmitting={createMutation.isPending}
          />
        )}

        {editingPlan && (
          <EditPlanModal
            plan={editingPlan}
            onClose={() => setEditingPlan(null)}
            onSave={async (updatedData: Partial<PlanFormData>) => {
              await updateMutation.mutateAsync({ id: editingPlan._id, data: updatedData })
            }}
          />
        )}

        {planToDelete && (
          <DeleteConfirmationModal
            planName={planToDelete.name}
            isDeleting={deleteMutation.isPending}
            onCancel={() => setPlanToDelete(null)}
            onConfirm={() => deleteMutation.mutate(planToDelete._id)}
          />
        )}
      </div>
    </div>
  )
}