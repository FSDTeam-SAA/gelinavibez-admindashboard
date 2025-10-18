"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Upload, Play } from "lucide-react"
import { Header } from "@/components/Shared/Header"
import Bradecumb from "@/components/Shared/Bradecumb"
import { Input } from "@/components/ui/input"

export default function AddApartment() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    price: "",
    beds: "",
    bathrooms: "",
    squarefeet: "",
    description: "",
    aboutListing: "",
    day: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePublish = () => {
    console.log("Publishing apartment listing:", formData)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen ">
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
                  <label className="block text-base font-medium  text-[#000000] mb-2">Add Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Add your title..."
                    className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-[#B6B6B6] "
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-base font-medium  text-[#000000] mb-2">Address</label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="888 Harbor Dr, Marina District"
                    className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-[#B6B6B6] "
                  />
                </div>

                {/* Price, Month, Available Time */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-base font-medium  text-[#000000] mb-2">Price</label>
                    <Input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Add price..."
                      className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-[#B6B6B6] "
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium  text-[#000000] mb-2">Select Month</label>
                    <select className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-[#B6B6B6] ">
                      <option>Select</option>
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
                    <label className="block text-base font-medium  text-[#000000] mb-2">Available Time</label>
                    <Input
                      type="text"
                      placeholder="Write Here"
                      className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-[#B6B6B6] "
                    />
                  </div>
                </div>

                {/* Beds, Bathrooms, Squarefeet */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-base font-medium  text-[#000000] mb-2">Beds</label>
                    <Input
                      type="text"
                      name="beds"
                      value={formData.beds}
                      onChange={handleInputChange}
                      placeholder="Write here"
                      className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-[#B6B6B6]  "
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium  text-[#000000] mb-2">Bathrooms</label>
                    <Input
                      type="text"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      placeholder="Write here"
                      className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-[#B6B6B6] "
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium  text-[#000000] mb-2">Squarefeets</label>
                    <Input
                      type="text"
                      name="squarefeet"
                      value={formData.squarefeet}
                      onChange={handleInputChange}
                      placeholder="Write here"
                      className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-[#B6B6B6] "
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-base font-medium  text-[#000000] mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description..."
                    rows={6}
                    className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[341px]   placeholder:text-[#B6B6B6] "
                  />
                </div>

                {/* About Listing */}
                <div>
                  <label className="block text-base font-medium  text-[#000000] mb-2">About Listing</label>
                  <textarea
                    name="aboutListing"
                    value={formData.aboutListing}
                    onChange={handleInputChange}
                    placeholder="Description..."
                    rows={6}
                    className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[341px]  placeholder:text-[#B6B6B6] "
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Media */}
          <div className="col-span-1 space-y-6 border">
            {/* Day Selector */}
            <div className="p-6">
              <label className="block text-base font-medium  text-[#000000] mb-3">Day</label>
              <select
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#B6B6B6] rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-[#B6B6B6] "
              >
                <option>Select a day</option>
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
              <label className="block text-base font-medium  text-[#000000] mb-3">Thumbnail</label>
              <div className="border-2 border-dashed border-[#B6B6B6] rounded-[4px] h-[48px] p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Drag and drop or click to upload</p>
              </div>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-12 h-12 bg-gray-300 rounded-[4px] h-[48px]" />
                ))}
              </div>
            </div>

            {/* Videos */}
            <div className="p-6">
              <label className="block text-base font-medium  text-[#000000] mb-3">Videos</label>
              <div className="border-2 border-dashed border-[#B6B6B6] rounded-[4px] h-[48px] p-8 text-center">
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Drag and drop or click to upload</p>
              </div>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-12 h-12 bg-gray-300 rounded-[4px] h-[48px]" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Publish Button */}
        <div className="flex justify-end mt-8">
          <Button onClick={handlePublish} className="bg-blue-900 hover:bg-blue-800 text-white px-8">
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}
