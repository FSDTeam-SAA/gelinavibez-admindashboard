'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import { SubscriptionPlan } from '../page'

interface Props {
  plans: SubscriptionPlan[]
  onEdit: (plan: SubscriptionPlan) => void
  onDelete: (plan: SubscriptionPlan) => void
}

export default function SubscriptionPlansList({ plans, onEdit, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map(plan => (
        <Card
          key={plan._id}
          className="p-6 bg-[#0F3D61] text-white border-none flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="text-white/70 capitalize">{plan.type}</p>

            <p className="text-4xl font-bold mt-4">${plan.price}</p>

            <p className="mt-4 text-sm font-semibold">Features</p>
            <p className="text-white/70 text-sm">{plan.features}</p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => onEdit(plan)}
              className="flex-1 bg-[#EFDACB] text-[#0F3D61] hover:bg-[#EFDACB]/90 rounded-[8px]"
            >
              <Edit2 size={18} /> Edit
            </Button>

            <Button
              onClick={() => onDelete(plan)}
              variant="destructive"
              className="flex-1 bg-red-500 hover:bg-red-600 rounded-[8px]"
            >
              <Trash2 size={18} /> Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
