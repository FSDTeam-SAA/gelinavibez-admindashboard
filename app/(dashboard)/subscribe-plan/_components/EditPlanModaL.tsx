// 'use client'

// import { useState } from 'react'
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { SubscriptionPlan } from '../page'

// export default function EditPlanModal({
//   plan,
//   onClose,
//   onSave,
// }: {
//   plan: SubscriptionPlan
//   onClose: () => void
//   onSave: (data: { price: number; features: string }) => void
// }) {
//   const [price, setPrice] = useState(plan.price)
//   const [features, setFeatures] = useState(plan.features)

//   return (
//     <Dialog open onOpenChange={onClose}>
//       <DialogContent className="bg-[#0F3D61] text-white">
//         <DialogHeader>
//           <DialogTitle>Edit {plan.name}</DialogTitle>
//         </DialogHeader>

//         <Input
//           type="number"
//           value={price}
//           onChange={e => setPrice(Number(e.target.value))}
//           className="bg-white text-black"
//         />

//         <Textarea
//           value={features}
//           onChange={e => setFeatures(e.target.value)}
//           className="bg-white text-black"
//         />

//         <Button
//           onClick={() => onSave({ price, features })}
//           className="bg-[#EFDACB] text-[#0F3D61] hover:bg-[#EFDACB]/90 rounded-[8px]"
//         >
//           Save
//         </Button>
//       </DialogContent>
//     </Dialog>
//   )
// }


'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SubscriptionPlan } from '../page'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface EditPlanModalProps {
  plan: SubscriptionPlan
  onClose: () => void
  onSave?: (updatedPlan: SubscriptionPlan) => void // optional now
}

const updatePlan = async (planId: string, data: Partial<SubscriptionPlan>, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscribeplan/${planId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to update subscription plan')
  }

  return response.json()
}

export default function EditPlanModal({
  plan,
  onClose,
  onSave,
}: EditPlanModalProps) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const token = session?.accessToken as string | undefined

  const [name, setName] = useState(plan.name)
  const [type, setType] = useState(plan.type)
  const [price, setPrice] = useState<number>(plan.price)
  const [features, setFeatures] = useState(plan.features) // ← assuming string
  const [status, setStatus] = useState(plan.status)

  const mutation = useMutation({
    mutationFn: () => {
      if (!token) throw new Error('No authentication token available')

      const payload = {
        name,
        type,
        price,
        features,
        status,
      }

      return updatePlan(plan._id, payload, token)
    },

    onSuccess: (responseData) => {
      // You can use the real updated data from server if it returns full object
      const updatedPlan: SubscriptionPlan = {
        ...plan,
        name,
        type,
        price,
        features,
        status,
        updatedAt: new Date().toISOString(),
        ...(responseData?.data || {}), // merge real server data if exists
      }

      // Update cache if you have a plans list query
      queryClient.setQueryData<SubscriptionPlan[]>(
        ['subscription-plans'], // ← adjust query key to your actual key!
        (oldPlans) =>
          oldPlans?.map((p) =>
            p._id === plan._id ? updatedPlan : p
          )
      )

      // Or invalidate if you prefer refetch
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })

      toast.success('Subscription plan updated successfully')
      onSave?.(updatedPlan)
      onClose()
    },

    onError: (error) => {
      console.error('Update failed:', error)
      toast.error(error.message || 'Failed to update subscription plan')
    },
  })

  const handleSave = () => {
    mutation.mutate()
  }

  const isLoading = mutation.isPending
  const hasError = !!mutation.error

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-[#0F3D61] text-white border-none">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Plan — {plan.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {hasError && (
            <p className="text-red-400 text-sm">
              {mutation.error?.message || 'Something went wrong'}
            </p>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Plan Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white text-black border-none focus:ring-2 focus:ring-[#EFDACB]"
              disabled={isLoading}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white text-black rounded-md border-none p-2 focus:ring-2 focus:ring-[#EFDACB]"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              disabled={isLoading}
              className="bg-white text-black border-none focus:ring-2 focus:ring-[#EFDACB]"
            />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Features</label>
            <Textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              disabled={isLoading}
              className="bg-white text-black min-h-[120px] border-none focus:ring-2 focus:ring-[#EFDACB]"
              placeholder="One feature per line..."
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white text-black rounded-md border-none p-2 focus:ring-2 focus:ring-[#EFDACB]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-white/40 text-white hover:bg-white/10"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isLoading || !token}
            className="bg-[#EFDACB] text-[#0F3D61] hover:bg-[#EFDACB]/90 min-w-[120px]"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}