"use client"

import React, { useState, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Upload, Play, X } from "lucide-react"
import { Header } from "@/components/Shared/Header"
import Bradecumb from "@/components/Shared/Bradecumb"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

interface FormData {
  title: string
  address: string
  price: string
  beds: string
  bathrooms: string
  squarefeet: string
  description: string
  aboutListing: string
  day: string
  month?: string
  availableTime?: string
}

interface MediaFile {
  file: File
  url: string
}

const AddApartment: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    title: "",
    address: "",
    price: "",
    beds: "",
    bathrooms: "",
    squarefeet: "",
    description: "",
    aboutListing: "",
    day: "",
    month: "",
    availableTime: "",
  })
  const [images, setImages] = useState<MediaFile[]>([])
  const [videos, setVideos] = useState<MediaFile[]>([])

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newImages: MediaFile[] = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))
      setImages((prev) => [...prev, ...newImages].slice(0, 5)) // Limit to 5 images
    }
  }

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newVideos: MediaFile[] = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))
      setVideos((prev) => [...prev, ...newVideos].slice(0, 5)) // Limit to 5 videos
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePublish = () => {
    console.log("Publishing apartment listing:", { ...formData, images, videos })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header tittle="Add Apartment Listing" />

      {/* Breadcrumb */}
      <Bradecumb pageName="Apartment Listings" subPageName="Add Apartment Listing" />

      {/* Main Content */}
      <div className="pr-5">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="col-span-2">
            <div className="">
              <form className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-base font-medium text-[#000000] mb-2">Add Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Add your title..."
                    className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6]"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-base font-medium text-[#000000] mb-2">Address</label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="888 Harbor Dr, Marina District"
                    className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6]"
                  />
                </div>

                {/* Price, Month, Available Time */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Price</label>
                    <Input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Add price..."
                      className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6]"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Select Month</label>
                    <select
                      name="month"
                      value={formData.month}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6]"
                    >
                      <option value="">Select</option>
                      <option>January</option>
                      <option>February</option>
                      <option>March</option>
                      <option>April</option>
                      <option>May</option>
                      <option>June</option>
                      <option>July</option>
                      <option>August</option>
                      <option>September</option>
                      <option>October</option>
                      <option>November</option>
                      <option>December</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Available Time</label>
                    <Input
                      type="text"
                      name="availableTime"
                      value={formData.availableTime}
                      onChange={handleInputChange}
                      placeholder="Write Here"
                      className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6]"
                    />
                  </div>
                </div>

                {/* Beds, Bathrooms, Squarefeet */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Beds</label>
                    <Input
                      type="text"
                      name="beds"
                      value={formData.beds}
                      onChange={handleInputChange}
                      placeholder="Write here"
                      className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6]"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Bathrooms</label>
                    <Input
                      type="text"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      placeholder="Write here"
                      className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6]"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Squarefeets</label>
                    <Input
                      type="text"
                      name="squarefeet"
                      value={formData.squarefeet}
                      onChange={handleInputChange}
                      placeholder="Write here"
                      className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-base font-medium text-[#000000] mb-2">Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description..."
                    rows={6}
                    className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[341px] placeholder:text-[#B6B6B6]"
                  />
                </div>

                {/* About Listing */}
                <div>
                  <label className="block text-base font-medium text-[#000000] mb-2">About Listing</label>
                  <Textarea
                    name="aboutListing"
                    value={formData.aboutListing}
                    onChange={handleInputChange}
                    placeholder="Description..."
                    rows={6}
                    className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[341px] placeholder:text-[#B6B6B6]"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Media */}
          <div className="col-span-1 space-y-6 border">
            {/* Day Selector */}
            <div className="p-6">
              <label className="block text-base font-medium text-[#000000] mb-3">Day</label>
              <select
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-transparent border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6]"
              >
                <option value="">Select a day</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>
            </div>

            {/* Thumbnail */}
            <div className="p-6">
              <label className="block text-base font-medium text-[#000000] mb-3">Thumbnail</label>
              <div className="border-2 border-dashed border-[#B6B6B6] rounded-[4px] h-[414px] p-8 text-center relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Drag and drop or click to upload images</p>
                <div className="flex flex-wrap gap-2 mt-4 absolute bottom-4 left-4 right-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-12 h-12">
                      <Image
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        width={1000}
                        height={1000}
                        className="w-12 h-12 object-cover rounded-[4px]"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Videos */}
            <div className="p-6">
              <label className="block text-base font-medium text-[#000000] mb-3">Videos</label>
              <div className="border-2 border-dashed border-[#B6B6B6] rounded-[4px] h-[414px] p-8 text-center relative">
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Drag and drop or click to upload videos</p>
                <div className="flex flex-wrap gap-2 mt-4 absolute bottom-4 left-4 right-4">
                  {videos.map((video, index) => (
                    <div key={index} className="relative w-12 h-12">
                      <video
                        src={video.url}
                        className="w-12 h-12 object-cover rounded-[4px]"
                      />
                      <button
                        onClick={() => removeVideo(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Publish Button */}
        <div className="flex justify-end mt-10 pb-2">
          <Button onClick={handlePublish} className="bg-[#0F3D61] hover:bg-[#0F3D61]/10 h-[48px] rounded-[8px] text-white px-8">
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddApartment