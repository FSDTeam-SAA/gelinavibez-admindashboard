/* eslint-disable  */
import { useState } from 'react'

interface CreatePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  isSubmitting: boolean
}

export default function CreatePlanModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: CreatePlanModalProps) {
  const [form, setForm] = useState({
    name: '',
    type: 'monthly', // or 'yearly'
    price: '',
    features: '',
    status: 'active'
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...form,
      price: Number(form.price)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-xl bg-[#0F3D61] p-6 shadow-2xl">
        <h2 className="mb-6 text-2xl font-bold text-white">Create New Subscription Plan</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-white">Plan Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-white">Billing Type</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-white"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-white">Price (USD)</label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-white"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-white">Features (comma separated)</label>
            <textarea
              value={form.features}
              onChange={e => setForm({ ...form, features: e.target.value })}
              className="w-full rounded-lg border bg-background px-4 py-2.5 min-h-[90px] text-white"
              placeholder="Feature 1, Feature 2, Feature 3"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] border px-5 py-2.5 hover:bg-muted text-white"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-[8px] bg-[#EFDACB] px-6 py-2.5 text-[#0F3D61] hover:bg-pri[#EFDACB]/90  disabled:opacity-60"
            >
              {isSubmitting ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}