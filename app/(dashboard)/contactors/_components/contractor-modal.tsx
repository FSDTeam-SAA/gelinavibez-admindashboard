"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, FileImage, Loader2 } from "lucide-react"
import Image from "next/image"
import { useCreateContractor, useGetService } from "@/hooks/ApiClling"
import { useSession } from "next-auth/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ContractorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContractorModal({ isOpen, onClose }: ContractorModalProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    clientName: "",
    clientNumber: "",
    clientEmail: "",
    serviceId: "",
    serviceAreas: "",
    workHours: "",
    superContact: "",
    scopeofWork: "",
    superName: "",
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { data: session } = useSession()
  const token = session?.accessToken || ""

  const getService = useGetService(token)
  const addContractorMutation = useCreateContractor(token)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      companyName: formData.companyName,
      companyAddress: formData.companyAddress,
      name: formData.clientName,
      number: formData.clientNumber,
      email: formData.clientEmail,
      serviceId: formData.serviceId,
      serviceAreas: formData.serviceAreas,
      workHours: formData.workHours,
      superContact: formData.superContact,
      scopeofWork: formData.scopeofWork,
      superName: formData.superName,
      image: selectedImage,
    }
    addContractorMutation.mutate(payload)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-lg max-w-[1342px] w-full mx-4 max-h-[90vh] overflow-y-auto bg-white">
        {/* Header */}
        <div className="flex items-center justify-end px-6 py-4 sticky top-0 bg-card">
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Company Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-base font-medium text-[#616161] block mb-2">Company Name</label>
                <Input
                  name="companyName"
                  placeholder="Name Here"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="border-[#B6B6B6] h-[50px] rounded-[4px] placeholder:text-[#ACACAC]"
                />
              </div>
              <div>
                <label className="text-base font-medium text-[#616161] block mb-2">Company Address</label>
                <Input
                  name="companyAddress"
                  placeholder="Address Here"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  className="border-[#B6B6B6] h-[50px] rounded-[4px] placeholder:text-[#ACACAC]"
                />
              </div>
            </div>
          </div>

          {/* Client Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Client Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-base font-medium text-[#616161] block mb-2">Client Name</label>
                <Input
                  name="clientName"
                  placeholder="Name Here"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="border-[#B6B6B6] h-[50px] rounded-[4px] placeholder:text-[#ACACAC]"
                />
              </div>
              <div>
                <label className="text-base font-medium text-[#616161] block mb-2">Client Number</label>
                <Input
                  name="clientNumber"
                  placeholder="Phone Number"
                  value={formData.clientNumber}
                  onChange={handleChange}
                  className="border-[#B6B6B6] h-[50px] rounded-[4px] placeholder:text-[#ACACAC]"
                />
              </div>
              <div>
                <label className="text-base font-medium text-[#616161] block mb-2">Client Email</label>
                <Input
                  name="clientEmail"
                  placeholder="Email Address"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="border-[#B6B6B6] h-[50px] rounded-[4px] placeholder:text-[#ACACAC]"
                />
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="bg-white   rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-base font-medium text-[#616161] block mb-2">
                  Select Service
                </label>
                <Select
                  value={formData.serviceId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, serviceId: value }))
                  }
                >
                  <SelectTrigger className="border-[#B6B6B6] h-[50px] rounded-[4px] bg-white">
                    <SelectValue placeholder="Choose a service..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {getService?.data?.data?.map((service) => (
                      <SelectItem key={service._id} value={service._id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-base font-medium text-[#616161] block mb-2">Service Areas</label>
                <Input
                  name="serviceAreas"
                  placeholder="Service Areas"
                  value={formData.serviceAreas}
                  onChange={handleChange}
                  className="border-[#B6B6B6] h-[50px] rounded-[4px] placeholder:text-[#ACACAC]"
                />
              </div>
            </div>

          </div>


          {/* Work Hours & Contact */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-base font-medium text-[#616161] block mb-2">Scope of Work</label>
                <Input
                  name="scopeofWork"
                  placeholder=""
                  value={formData.scopeofWork}
                  onChange={handleChange}
                  className="border-[#B6B6B6] h-[50px] rounded-[4px] placeholder:text-[#ACACAC]"
                />
              </div>
              <div>
                <label className="text-base font-medium text-[#616161] block mb-2">Work Hours</label>
                <Input
                  name="workHours"
                  placeholder="00 hours"
                  value={formData.workHours}
                  onChange={handleChange}
                  className="border-[#B6B6B6] h-[50px] rounded-[4px] placeholder:text-[#ACACAC]"
                />
              </div>
              <div>
                <label className="text-base font-medium text-[#616161] block mb-2">Super Contact</label>
                <Input
                  name="superContact"
                  placeholder="00000000"
                  value={formData.superContact}
                  onChange={handleChange}
                  className="border-[#B6B6B6] h-[50px] rounded-[4px] placeholder:text-[#ACACAC]"
                />
              </div>
              <div>
                <label className="text-base font-medium text-[#616161] block mb-2">Super Name</label>
                <Input
                  name="superName"
                  placeholder=""
                  value={formData.superName}
                  onChange={handleChange}
                  className="border-[#B6B6B6] h-[50px] rounded-[4px] placeholder:text-[#ACACAC]"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="text-xs font-medium text-foreground block">Image</label>
            <div className="relative border-2 border-dashed border-[#ACACAC] h-[243px] rounded-lg p-8 flex flex-col items-center justify-center bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="max-h-[200px] max-w-full object-contain rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <FileImage className="h-[100px] w-[100px] text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end">
            <Button
              type="submit"
              className="bg-[#0F3D61] h-[45px] hover:bg-[#0F3D61]/90 rounded-[8px] px-[68px] text-white"
            >
              Publish {addContractorMutation.isPending && <Loader2 className="animate-spin" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
