"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Upload, Play, X } from "lucide-react";
import { Header } from "@/components/Shared/Header";
import Bradecumb from "@/components/Shared/Bradecumb";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface FormData {
  title: string;
  description: string;
  aboutListing: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  amenities: string[];
  day: string;
  month: string;
  availableTime: string;
}

interface MediaFile {
  file?: File;
  url: string;
}

interface ApartmentResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    availableFrom: {
      month: string;
      time: string;
    };
    _id: string;
    title: string;
    description: string;
    aboutListing: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    amenities: string[];
    images: string[];
    videos: string[];
    day: string;
    action: string;
    status: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

const fetchApartment = async (id: string): Promise<ApartmentResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch apartment data");
  }
  return response.json();
};

const EditApartment: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const  session  = useSession();
  const token = session?.data?.accessToken;

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
  });
  const [images, setImages] = useState<MediaFile[]>([]);
  const [videos, setVideos] = useState<MediaFile[]>([]);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, error } = useQuery<ApartmentResponse>({
    queryKey: ["apartment", id],
    queryFn: () => fetchApartment(id as string),
    enabled: !!id,
  });

  // Populate form data when API data is available
  React.useEffect(() => {
    if (data?.data) {
      const { data: apartment } = data;
      setFormData({
        title: apartment.title,
        description: apartment.description,
        aboutListing: apartment.aboutListing,
        price: apartment.price.toString(),
        bedrooms: apartment.bedrooms.toString(),
        bathrooms: apartment.bathrooms.toString(),
        squareFeet: apartment.squareFeet.toString(),
        street: apartment.address.street,
        city: apartment.address.city,
        state: apartment.address.state,
        zipCode: apartment.address.zipCode,
        amenities: apartment.amenities,
        day: apartment.day,
        month: apartment.availableFrom.month,
        availableTime: apartment.availableFrom.time.slice(0, 16), // Format for datetime-local
      });
      setImages(apartment.images.map((url) => ({ url })));
      setVideos(apartment.videos.map((url) => ({ url })));
    }
  }, [data]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAmenitiesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((amenity) => amenity !== value),
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages: MediaFile[] = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newVideos: MediaFile[] = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setVideos((prev) => [...prev, ...newVideos].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.price || isNaN(Number(formData.price)))
      newErrors.price = "Valid price is required";
    if (!formData.bedrooms || isNaN(Number(formData.bedrooms)))
      newErrors.bedrooms = "Valid number of bedrooms is required";
    if (!formData.bathrooms || isNaN(Number(formData.bathrooms)))
      newErrors.bathrooms = "Valid number of bathrooms is required";
    if (!formData.squareFeet || isNaN(Number(formData.squareFeet)))
      newErrors.squareFeet = "Valid square footage is required";
    if (!formData.street) newErrors.street = "Street is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode) newErrors.zipCode = "Zip code is required";
    if (!formData.day) newErrors.day = "Day is required";
    if (!formData.month) newErrors.month = "Month is required";
    if (!formData.availableTime) newErrors.availableTime = "Available time is required";
    if (images.length === 0) toast.error("At least one image is required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && images.length > 0;
  };

  const updateApartment = async ({ id, data }: { id: string; data: FormData }) => {
    const formDataToSend = new FormData();

    formDataToSend.append("title", data.title);
    formDataToSend.append("description", data.description);
    formDataToSend.append("aboutListing", data.aboutListing);
    formDataToSend.append("price", data.price);
    formDataToSend.append("bedrooms", data.bedrooms);
    formDataToSend.append("bathrooms", data.bathrooms);
    formDataToSend.append("squareFeet", data.squareFeet);
    formDataToSend.append("address[street]", data.street);
    formDataToSend.append("address[city]", data.city);
    formDataToSend.append("address[state]", data.state);
    formDataToSend.append("address[zipCode]", data.zipCode);
    data.amenities.forEach((amenity, index) => {
      formDataToSend.append(`amenities[${index}]`, amenity);
    });
    formDataToSend.append("day", data.day);
    formDataToSend.append("availableFrom[month]", data.month);
    formDataToSend.append("availableFrom[time]", new Date(data.availableTime).toISOString());

    images.forEach((image) => {
      if (image.file) {
        formDataToSend.append("images", image.file);
      }
    });
    videos.forEach((video) => {
      if (video.file) {
        formDataToSend.append("videos", video.file);
      }
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apartment/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error("Failed to update apartment data");
    }
    return response.json();
  };

  const updateMutation = useMutation({
    mutationFn: updateApartment,
    onSuccess: () => {
      toast.success("Apartment updated successfully!", { position: "top-right" });
      setTimeout(() => router.push("/apartment-listings"), 1000);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update apartment: ${error.message}`, { position: "top-right" });
    },
  });

  const handlePublish = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    updateMutation.mutate({ id: id as string, data: formData });
    setIsSubmitting(false);
  };

  if (error) {
    return <div className="text-red-500 p-4">Error loading apartment data: {error.message}</div>;
  }

  return (
    <div className="min-h-screen">
      <Header tittle="Edit Apartment Listing" />
      <Bradecumb pageName="Apartment Listings" subPageName="Edit Apartment Listing" />
      <div className="pr-5">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="space-y-6">
              {isLoading ? (
                <div className="space-y-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-[341px] bg-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-[341px] bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : (
                <>
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
                        type="number"
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
                        type="number"
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
                     type="number"
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
                       type="number"
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
                </>
              )}
            </div>
          </div>

          <div className="col-span-1 space-y-6 border">
            {isLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="border-2 border-dashed border-[#B6B6B6] rounded-[4px] h-[414px] bg-gray-200"></div>
                </div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="border-2 border-dashed border-[#B6B6B6] rounded-[4px] h-[414px] bg-gray-200"></div>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-10 pb-2">
          <Button
            onClick={handlePublish}
            disabled={isSubmitting || isLoading}
            className={`bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white px-8 ${
              isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditApartment;