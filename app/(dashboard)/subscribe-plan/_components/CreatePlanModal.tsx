
'use client'
import { useState } from 'react'
import { PlanFormData } from '../page'

interface CreatePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PlanFormData) => Promise<void> // Specific type
  isSubmitting: boolean
}

export default function CreatePlanModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreatePlanModalProps) {
  const [form, setForm] = useState({
    name: '',
    type: 'monthly',
    price: '',
    features: '',
    status: 'active',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit({
        ...form,
        price: parseFloat(form.price),
      })
    } catch (error) {
      console.error("Submission failed", error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl bg-[#0F3D61] p-6 shadow-2xl">
        <h2 className="mb-6 text-2xl font-bold text-white">Create New Subscription Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-5 text-white">
          <div>
            <label className="block text-sm font-medium mb-1.5">Plan Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border bg-white px-4 py-2.5 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Billing Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg border bg-white px-4 py-2.5 text-black"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Price</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-lg border bg-white px-4 py-2.5 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Features</label>
            <textarea
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="w-full rounded-lg border bg-white px-4 py-2.5 min-h-[90px] text-black"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded">Cancel</button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-[#EFDACB] text-[#0F3D61] px-6 py-2.5 rounded font-bold"
            >
              {isSubmitting ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}