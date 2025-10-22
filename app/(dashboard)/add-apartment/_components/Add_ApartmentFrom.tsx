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
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface FormData {
  title: string
  description: string
  aboutListing: string
  price: string
  bedrooms: string
  bathrooms: string
  squareFeet: string
  street: string
  city: string
  state: string
  zipCode: string
  amenities: string[]
  day: string
  month: string
  availableTime: string
}

interface MediaFile {
  file: File
  url: string
}

const AddApartment: React.FC = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    aboutListing: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    amenities: [],
    day: "",
    month: "",
    availableTime: "",
  })
  const [images, setImages] = useState<MediaFile[]>([])
  const [videos, setVideos] = useState<MediaFile[]>([])
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleAmenitiesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((amenity) => amenity !== value),
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newImages: MediaFile[] = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))
      setImages((prev) => [...prev, ...newImages].slice(0, 5))
    }
  }

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newVideos: MediaFile[] = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))
      setVideos((prev) => [...prev, ...newVideos].slice(0, 5))
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}
    
    if (!formData.title) newErrors.title = "Title is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!formData.price || isNaN(Number(formData.price))) 
      newErrors.price = "Valid price is required"
    if (!formData.bedrooms || isNaN(Number(formData.bedrooms))) 
      newErrors.bedrooms = "Valid number of bedrooms is required"
    if (!formData.bathrooms || isNaN(Number(formData.bathrooms))) 
      newErrors.bathrooms = "Valid number of bathrooms is required"
    if (!formData.squareFeet || isNaN(Number(formData.squareFeet))) 
      newErrors.squareFeet = "Valid square footage is required"
    if (!formData.street) newErrors.street = "Street is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.zipCode) newErrors.zipCode = "Zip code is required"
    if (!formData.day) newErrors.day = "Day is required"
    if (!formData.month) newErrors.month = "Month is required"
    if (!formData.availableTime) newErrors.availableTime = "Available time is required"
    if (images.length === 0) toast.error("At least one image is required")

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 && images.length > 0
  }

  const handlePublish = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("aboutListing", formData.aboutListing)
      formDataToSend.append("price", formData.price)
      formDataToSend.append("bedrooms", formData.bedrooms)
      formDataToSend.append("bathrooms", formData.bathrooms)
      formDataToSend.append("squareFeet", formData.squareFeet)
      formDataToSend.append("address[street]", formData.street)
      formDataToSend.append("address[city]", formData.city)
      formDataToSend.append("address[state]", formData.state)
      formDataToSend.append("address[zipCode]", formData.zipCode)
      formData.amenities.forEach((amenity, index) => {
        formDataToSend.append(`amenities[${index}]`, amenity)
      })
      formDataToSend.append("day", formData.day)
      formDataToSend.append("availableFrom[month]", formData.month)
      formDataToSend.append("availableFrom[time]", new Date(formData.availableTime).toISOString())

      images.forEach((image) => {
        formDataToSend.append("images", image.file)
      })
      videos.forEach((video) => {
        formDataToSend.append("videos", video.file)
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success("Apartment listing created successfully!", {
          position: "top-right",
        })
        setTimeout(() => router.push(`/apartment-listings`), 1000)
      } else {
        throw new Error("Failed to create apartment listing")
      }
    } catch (error) {
      toast.error("Error creating apartment listing" + error, {
        position: "top-right",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header tittle="Add Apartment Listing" />
      <Bradecumb pageName="Apartment Listings" subPageName="Add Apartment Listing" />
      <div className="pr-5">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="">
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-[#000000] mb-2">Add Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Add your title..."
                    className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                      errors.title ? "border-red-500" : "border-[#B6B6B6]"
                    }`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Street</label>
                    <Input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="House 15, Road 27"
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                        errors.street ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">City</label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Dhaka"
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                        errors.city ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">State</label>
                    <Input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Dhaka Division"
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                        errors.state ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Zip Code</label>
                    <Input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="1209"
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                        errors.zipCode ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Price</label>
                    <Input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Add price..."
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                        errors.price ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Bedrooms</label>
                    <Input
                      type="text"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      placeholder="Write here"
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                        errors.bedrooms ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                    {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Bathrooms</label>
                    <Input
                      type="text"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      placeholder="Write here"
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                        errors.bathrooms ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                    {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Square Feet</label>
                    <Input
                      type="text"
                      name="squareFeet"
                      value={formData.squareFeet}
                      onChange={handleInputChange}
                      placeholder="Write here"
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                        errors.squareFeet ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                    {errors.squareFeet && <p className="text-red-500 text-sm mt-1">{errors.squareFeet}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-[#000000] mb-2">Amenities</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Parking", "Lift", "Security", "Balcony", "Generator", "Air Conditioning"].map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onChange={handleAmenitiesChange}
                          className="h-4 w-4"
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Day</label>
                    <select
                      name="day"
                      value={formData.day}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                        errors.day ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    >
           
                      <option value="">Select a day</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                    {errors.day && <p className="text-red-500 text-sm mt-1">{errors.day}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Select Month</label>
                    <select
                      name="month"
                      value={formData.month}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                        errors.month ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
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
                    {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Available Time</label>
                    <Input
                      type="datetime-local"
                      name="availableTime"
                      value={formData.availableTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                        errors.availableTime ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                    {errors.availableTime && <p className="text-red-500 text-sm mt-1">{errors.availableTime}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-[#000000] mb-2">Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description..."
                    rows={6}
                    className={`w-full px-4 py-2 border rounded-[4px] h-[341px] placeholder:text-[#B6B6B6] ${
                      errors.description ? "border-red-500" : "border-[#B6B6B6]"
                    }`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-base font-medium text-[#000000] mb-2">About Listing</label>
                  <Textarea
                    name="aboutListing"
                    value={formData.aboutListing}
                    onChange={handleInputChange}
                    placeholder="Description..."
                    rows={6}
                    className={`w-full px-4 py-2 border rounded-[4px] h-[341px] placeholder:text-[#B6B6B6] ${
                      errors.aboutListing ? "border-red-500" : "border-[#B6B6B6]"
                    }`}
                  />
                  {errors.aboutListing && <p className="text-red-500 text-sm mt-1">{errors.aboutListing}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 space-y-6 border">
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

        <div className="flex justify-end mt-10 pb-2">
          <Button
            onClick={handlePublish}
            disabled={isSubmitting}
            className={`bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white px-8 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddApartment