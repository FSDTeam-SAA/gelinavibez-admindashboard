
// // app/(your-path)/EditApartment.tsx  (or wherever you keep it)
// "use client";

// import React, { ChangeEvent, useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Upload, Play, X } from "lucide-react";
// import { Header } from "@/components/Shared/Header";
// import Bradecumb from "@/components/Shared/Bradecumb";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import Image from "next/image";
// import { toast } from "sonner";
// import { useSession } from "next-auth/react";
// import type { Session } from "next-auth";

// /**
//  * Types
//  */
// type ApartmentForm = {
//   title: string;
//   description: string;
//   aboutListing: string;
//   price: string;
//   bedrooms: string;
//   bathrooms: string;
//   squareFeet: string;
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   amenities: string[];
//   day: string;
//   month: string;
//   availableTime: string; 
// };

// type MediaFile = {
//   file?: File;
//   url: string;
//   remote?: boolean; 
// };

// type ApartmentResponse = {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: {
//     _id: string;
//     title: string;
//     description: string;
//     aboutListing: string;
//     price: number;
//     bedrooms: number;
//     bathrooms: number;
//     squareFeet: number;
//     amenities: string[];
//     images: string[];
//     videos: string[];
//     address: {
//       street: string;
//       city: string;
//       state: string;
//       zipCode: string;
//     };
//     availableFrom: {
//       month: string;
//       time: string; 
//     };
//     day: string;
//     createdAt?: string;
//     updatedAt?: string;
//   };
// };


// type ExtendedSession = Session & {
//   accessToken?: string;
//   token?: string;
//   user?: Session["user"] & { accessToken?: string; token?: string };
// };

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// /**
//  * Helpers
//  */
// const toDatetimeLocal = (iso?: string): string => {
//   if (!iso) return "";
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return "";
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
//     d.getHours()
//   )}:${pad(d.getMinutes())}`;
// };

// const fetchApartment = async (id: string): Promise<ApartmentResponse> => {
//   if (!API_BASE) throw new Error("API base URL is not defined.");
//   const res = await fetch(`${API_BASE}/apartment/${id}`);
//   if (!res.ok) {
//     const txt = await res.text();
//     throw new Error(txt || "Failed to fetch apartment data");
//   }
//   return res.json();
// };

// const updateApartmentApi = async (id: string, payload: ApartmentForm, images: MediaFile[], videos: MediaFile[], token?: string) => {
//   if (!API_BASE) throw new Error("API base URL is not defined.");
//   const fd = new FormData();

//   fd.append("title", payload.title);
//   fd.append("description", payload.description);
//   fd.append("aboutListing", payload.aboutListing);
//   fd.append("price", payload.price);
//   fd.append("bedrooms", payload.bedrooms);
//   fd.append("bathrooms", payload.bathrooms);
//   fd.append("squareFeet", payload.squareFeet);
//   fd.append("address[street]", payload.street);
//   fd.append("address[city]", payload.city);
//   fd.append("address[state]", payload.state);
//   fd.append("address[zipCode]", payload.zipCode);

//   payload.amenities.forEach((a, i) => fd.append(`amenities[${i}]`, a));
//   fd.append("day", payload.day);
//   fd.append("availableFrom[month]", payload.month);

//   try {
//     const iso = new Date(payload.availableTime).toISOString();
//     fd.append("availableFrom[time]", iso);
//   } catch {
//     fd.append("availableFrom[time]", payload.availableTime);
//   }

//   // Append only new files (media.file exists)
//   images.forEach((m) => {
//     if (m.file) fd.append("images", m.file);
//   });
//   videos.forEach((m) => {
//     if (m.file) fd.append("videos", m.file);
//   });

//   const res = await fetch(`${API_BASE}/apartment/${id}`, {
//     method: "PUT",
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//       // DO NOT set Content-Type for FormData (browser will set the boundary)
//     },
//     body: fd,
//   });

//   if (!res.ok) {
//     const txt = await res.text();
//     throw new Error(txt || "Failed to update apartment");
//   }
//   return res.json();
// };

// /**
//  * Component
//  */
// const EditApartment: React.FC = () => {
//   const router = useRouter();
//   // next/navigation useParams typing is loose — cast safely
//   const params = useParams() as { id?: string } | undefined;
//   const id = params?.id;

//   const sessionResult = useSession();
//   const session = sessionResult.data as ExtendedSession | null;

//   // token extraction: try a few common places, keep optional
//   const token =
//     session?.accessToken ?? session?.token ?? session?.user?.accessToken ?? session?.user?.token ?? "";

//   const [form, setForm] = useState<ApartmentForm>({
//     title: "",
//     description: "",
//     aboutListing: "",
//     price: "",
//     bedrooms: "",
//     bathrooms: "",
//     squareFeet: "",
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     amenities: [],
//     day: "",
//     month: "",
//     availableTime: "",
//   });

//   const [images, setImages] = useState<MediaFile[]>([]);
//   const [videos, setVideos] = useState<MediaFile[]>([]);
//   const [errors, setErrors] = useState<Partial<ApartmentForm>>({});
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//   const { data, isLoading, error } = useQuery<ApartmentResponse, Error>({
//     queryKey: ["apartment", id ?? "none"],
//     queryFn: () => fetchApartment(id as string),
//     enabled: Boolean(id),
//   });

//   // populate form when data loads
//   useEffect(() => {
//     if (!data?.data) return;
//     const apt = data.data;
//     setForm({
//       title: apt.title ?? "",
//       description: apt.description ?? "",
//       aboutListing: apt.aboutListing ?? "",
//       price: apt.price !== undefined ? String(apt.price) : "",
//       bedrooms: apt.bedrooms !== undefined ? String(apt.bedrooms) : "",
//       bathrooms: apt.bathrooms !== undefined ? String(apt.bathrooms) : "",
//       squareFeet: apt.squareFeet !== undefined ? String(apt.squareFeet) : "",
//       street: apt.address?.street ?? "",
//       city: apt.address?.city ?? "",
//       state: apt.address?.state ?? "",
//       zipCode: apt.address?.zipCode ?? "",
//       amenities: apt.amenities ?? [],
//       day: apt.day ?? "",
//       month: apt.availableFrom?.month ?? "",
//       availableTime: toDatetimeLocal(apt.availableFrom?.time),
//     });

//     setImages((apt.images || []).map((u) => ({ url: u, remote: true })));
//     setVideos((apt.videos || []).map((u) => ({ url: u, remote: true })));
//   }, [data]);

//   // input handlers
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value } as ApartmentForm));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleAmenitiesChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { value, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       amenities: checked ? [...prev.amenities, value] : prev.amenities.filter((a) => a !== value),
//     }));
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const files = Array.from(e.target.files);
//     const newImages: MediaFile[] = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
//     setImages((prev) => [...prev, ...newImages].slice(0, 5));
//   };

//   const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const files = Array.from(e.target.files);
//     const newVideos: MediaFile[] = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
//     setVideos((prev) => [...prev, ...newVideos].slice(0, 5));
//   };

//   const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));
//   const removeVideo = (index: number) => setVideos((prev) => prev.filter((_, i) => i !== index));

//   const validate = (): boolean => {
//     const newErrors: Partial<ApartmentForm> = {};
//     if (!form.title) newErrors.title = "Title is required";
//     if (!form.description) newErrors.description = "Description is required";
//     if (!form.price || Number.isNaN(Number(form.price))) newErrors.price = "Valid price required";
//     if (!form.bedrooms || Number.isNaN(Number(form.bedrooms))) newErrors.bedrooms = "Valid bedrooms";
//     if (!form.bathrooms || Number.isNaN(Number(form.bathrooms))) newErrors.bathrooms = "Valid bathrooms";
//     if (!form.squareFeet || Number.isNaN(Number(form.squareFeet))) newErrors.squareFeet = "Valid squareFeet";
//     if (!form.street) newErrors.street = "Street required";
//     if (!form.city) newErrors.city = "City required";
//     if (!form.state) newErrors.state = "State required";
//     if (!form.zipCode) newErrors.zipCode = "Zip required";
//     if (!form.day) newErrors.day = "Day required";
//     if (!form.month) newErrors.month = "Month required";
//     if (!form.availableTime) newErrors.availableTime = "Available time required";

//     setErrors(newErrors);

//     if (images.length === 0) toast.error("At least one image is required");
//     return Object.keys(newErrors).length === 0 && images.length > 0;
//   };

//   // mutation
//   const mutation = useMutation({
//     mutationFn: async (vars: { id: string; payload: ApartmentForm; images: MediaFile[]; videos: MediaFile[]; token?: string }) =>
//       updateApartmentApi(vars.id, vars.payload, vars.images, vars.videos, vars.token),
//     onSuccess: () => {
//       toast.success("Apartment updated successfully!");
//       router.push("/apartment-listings");
//     },
//     onError: (e) => {
//       const msg = e?.message ?? "Failed to update apartment";
//       toast.error(msg);
//     },
//   });

//   const handlePublish = async () => {
//     if (!id) {
//       toast.error("Missing apartment id");
//       return;
//     }
//     if (!token) {
//       toast.error("Not authenticated. Please login.");
//       return;
//     }
//     if (!validate()) return;

//     try {
//       setIsSubmitting(true);
//       await mutation.mutateAsync({ id, payload: form, images, videos, token });
//     } catch (e) {
//       // onError handles notification
//       console.error(e);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (error) {
//     return <div className="text-red-500 p-4">Error loading apartment: {error.message}</div>;
//   }

//   return (
//     <div className="min-h-screen">
//       <Header tittle="Edit Apartment Listing" />
//       <Bradecumb pageName="Apartment Listings" subPageName="Edit Apartment Listing" />
//       <div className="pr-5">
//         <div className="grid grid-cols-3 gap-6">
//           <div className="col-span-2">
//             <div className="space-y-6">
//               {isLoading ? (
//                 <div className="animate-pulse">
//                   <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
//                 </div>
//               ) : (
//                 <>
//                   <div>
//                     <label className="block text-base font-medium mb-2">Add Title</label>
//                     <Input name="title" value={form.title} onChange={handleInputChange} placeholder="Add your title..." />
//                     {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-base font-medium mb-2">Street</label>
//                       <Input name="street" value={form.street} onChange={handleInputChange} placeholder="House 15, Road 27" />
//                       {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
//                     </div>
//                     <div>
//                       <label className="block text-base font-medium mb-2">City</label>
//                       <Input name="city" value={form.city} onChange={handleInputChange} placeholder="Dhaka" />
//                       {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
//                     </div>
//                     <div>
//                       <label className="block text-base font-medium mb-2">State</label>
//                       <Input name="state" value={form.state} onChange={handleInputChange} placeholder="Dhaka Division" />
//                       {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
//                     </div>
//                     <div>
//                       <label className="block text-base font-medium mb-2">Zip Code</label>
//                       <Input name="zipCode" value={form.zipCode} onChange={handleInputChange} placeholder="1209" />
//                       {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-4 gap-4">
//                     <div>
//                       <label className="block text-base font-medium mb-2">Price</label>
//                       <Input type="number" name="price" value={form.price} onChange={handleInputChange} />
//                       {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
//                     </div>
//                     <div>
//                       <label className="block text-base font-medium mb-2">Bedrooms</label>
//                       <Input type="number" name="bedrooms" value={form.bedrooms} onChange={handleInputChange} />
//                       {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
//                     </div>
//                     <div>
//                       <label className="block text-base font-medium mb-2">Bathrooms</label>
//                       <Input type="number" name="bathrooms" value={form.bathrooms} onChange={handleInputChange} />
//                       {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
//                     </div>
//                     <div>
//                       <label className="block text-base font-medium mb-2">Square Feet</label>
//                       <Input type="number" name="squareFeet" value={form.squareFeet} onChange={handleInputChange} />
//                       {errors.squareFeet && <p className="text-red-500 text-sm mt-1">{errors.squareFeet}</p>}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-base font-medium mb-2">Amenities</label>
//                     <div className="grid grid-cols-3 gap-2">
//                       {["Parking", "Lift", "Security", "Balcony", "Generator", "Air Conditioning"].map((amenity) => (
//                         <label key={amenity} className="flex items-center space-x-2">
//                           <input type="checkbox" value={amenity} checked={form.amenities.includes(amenity)} onChange={handleAmenitiesChange} />
//                           <span>{amenity}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-base font-medium mb-2">Day</label>
//                       <select name="day" value={form.day} onChange={handleInputChange}>
//                         <option value="">Select a day</option>
//                         <option value="monday">Monday</option>
//                         <option value="tuesday">Tuesday</option>
//                         <option value="wednesday">Wednesday</option>
//                         <option value="thursday">Thursday</option>
//                         <option value="friday">Friday</option>
//                         <option value="saturday">Saturday</option>
//                         <option value="sunday">Sunday</option>
//                       </select>
//                       {errors.day && <p className="text-red-500 text-sm mt-1">{errors.day}</p>}
//                     </div>

//                     <div>
//                       <label className="block text-base font-medium mb-2">Select Month</label>
//                       <select name="month" value={form.month} onChange={handleInputChange}>
//                         <option value="">Select</option>
//                         <option>January</option>
//                         <option>February</option>
//                         <option>March</option>
//                         <option>April</option>
//                         <option>May</option>
//                         <option>June</option>
//                         <option>July</option>
//                         <option>August</option>
//                         <option>September</option>
//                         <option>October</option>
//                         <option>November</option>
//                         <option>December</option>
//                       </select>
//                       {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month}</p>}
//                     </div>

//                     <div>
//                       <label className="block text-base font-medium mb-2">Available Time</label>
//                       <Input type="datetime-local" name="availableTime" value={form.availableTime} onChange={handleInputChange} />
//                       {errors.availableTime && <p className="text-red-500 text-sm mt-1">{errors.availableTime}</p>}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-base font-medium mb-2">Description</label>
//                     <Textarea name="description" value={form.description} onChange={handleInputChange} rows={6} />
//                     {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-base font-medium mb-2">About Listing</label>
//                     <Textarea name="aboutListing" value={form.aboutListing} onChange={handleInputChange} rows={6} />
//                     {errors.aboutListing && <p className="text-red-500 text-sm mt-1">{errors.aboutListing}</p>}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="col-span-1 space-y-6 border">
//             {isLoading ? (
//               <div className="p-6 animate-pulse">
//                 <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
//               </div>
//             ) : (
//               <>
//                 <div className="p-6">
//                   <label className="block text-base font-medium mb-3">Thumbnail</label>
//                   <div className="border-2 border-dashed rounded h-[414px] p-8 text-center relative">
//                     <input type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
//                     <Upload className="w-12 h-12 mx-auto mb-2" />
//                     <p className="text-sm">Drag and drop or click to upload images</p>
//                     <div className="flex flex-wrap gap-2 mt-4 absolute bottom-4 left-4 right-4">
//                       {images.map((img, i) => (
//                         <div key={i} className="relative w-12 h-12">
//                           {/* next/image requires domain config for remote images; if not configured, use <img /> */}
//                           <Image src={img.url} alt={`img-${i}`} width={1000} height={1000} className="w-12 h-12 object-cover rounded" />
//                           <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
//                             <X className="w-3 h-3" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <label className="block text-base font-medium mb-3">Videos</label>
//                   <div className="border-2 border-dashed rounded h-[414px] p-8 text-center relative">
//                     <input type="file" accept="video/*" multiple onChange={handleVideoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
//                     <Play className="w-12 h-12 mx-auto mb-2" />
//                     <p className="text-sm">Drag and drop or click to upload videos</p>
//                     <div className="flex flex-wrap gap-2 mt-4 absolute bottom-4 left-4 right-4">
//                       {videos.map((v, i) => (
//                         <div key={i} className="relative w-12 h-12">
//                           <video src={v.url} className="w-12 h-12 object-cover rounded" />
//                           <button type="button" onClick={() => removeVideo(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
//                             <X className="w-3 h-3" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="flex justify-end mt-10 pb-2">
//           <Button className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white px-8" onClick={handlePublish} disabled={isSubmitting || isLoading }>
//             {isSubmitting  ? "Updating..." : "Update"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditApartment;




/*eslint-disable  */
"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

  action: string;
  status: string;
  unitId: string;
  currentStatus: string;
  inspectionStatus: string;
  keyExchangeInfo: string;
  packageTracking: string;
}

interface MediaFile {
  file?: File;      // only for newly uploaded files
  url: string;
  remote?: boolean; // true for existing server URLs
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const toDatetimeLocal = (iso?: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const EditApartment = () => {
  const router = useRouter();
  const params = useParams() as { id: string };
  const { id } = params;

  const { data: session } = useSession();
  const token = session?.accessToken ?? (session as any)?.token ?? "";

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
    action: "available",
    status: "pending",
    unitId: "",
    currentStatus: "Vacant",
    inspectionStatus: "Not Scheduled",
    keyExchangeInfo: "",
    packageTracking: "",
  });

  const [images, setImages] = useState<MediaFile[]>([]);
  const [videos, setVideos] = useState<MediaFile[]>([]);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error("No apartment ID provided");
      router.push("/apartment-listings");
      return;
    }

    const fetchApartment = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/apartment/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || "Failed to load apartment");
        }

        const json = await res.json();
        const apt = json.data;

        setFormData({
          title: apt.title ?? "",
          description: apt.description ?? "",
          aboutListing: apt.aboutListing ?? "",
          price: apt.price != null ? String(apt.price) : "",
          bedrooms: apt.bedrooms != null ? String(apt.bedrooms) : "",
          bathrooms: apt.bathrooms != null ? String(apt.bathrooms) : "",
          squareFeet: apt.squareFeet != null ? String(apt.squareFeet) : "",
          street: apt.address?.street ?? "",
          city: apt.address?.city ?? "",
          state: apt.address?.state ?? "",
          zipCode: apt.address?.zipCode ?? "",
          amenities: apt.amenities ?? [],
          day: apt.day ?? "",
          month: apt.availableFrom?.month ?? "",
          availableTime: toDatetimeLocal(apt.availableFrom?.time),
          action: apt.action ?? "available",
          status: apt.status ?? "pending",
          unitId: apt.unitId ?? "",
          currentStatus: apt.currentStatus ?? "Vacant",
          inspectionStatus: apt.inspectionStatus?.[0] ?? "Not Scheduled",
          keyExchangeInfo: apt.keyExchangeInfo?.[0] ?? "",
          packageTracking: apt.packageTracking?.[0] ?? "",
        });

        setImages((apt.images || []).map((url: string) => ({ url, remote: true })));
        setVideos((apt.videos || []).map((url: string) => ({ url, remote: true })));
      } catch (err: any) {
        toast.error("Error loading apartment: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApartment();
  }, [id, token, router]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAmenitiesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value),
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
    if (!formData.price || isNaN(Number(formData.price))) newErrors.price = "Valid price required";
    if (!formData.bedrooms || isNaN(Number(formData.bedrooms))) newErrors.bedrooms = "Valid bedrooms required";
    if (!formData.bathrooms || isNaN(Number(formData.bathrooms))) newErrors.bathrooms = "Valid bathrooms required";
    if (!formData.squareFeet || isNaN(Number(formData.squareFeet))) newErrors.squareFeet = "Valid square feet required";
    if (!formData.street) newErrors.street = "Street is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode) newErrors.zipCode = "Zip code is required";
    if (!formData.day) newErrors.day = "Day is required";
    if (!formData.month) newErrors.month = "Month is required";
    if (!formData.availableTime) newErrors.availableTime = "Available time is required";
    if (!formData.unitId) newErrors.unitId = "Unit ID is required";
    if (!formData.currentStatus) newErrors.currentStatus = "Current status is required";
    if (!formData.inspectionStatus) newErrors.inspectionStatus = "Inspection status is required";

    setErrors(newErrors);
    if (images.length === 0) {
      toast.error("At least one image is required");
      return false;
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("aboutListing", formData.aboutListing || "");
      formDataToSend.append("price", formData.price);
      formDataToSend.append("bedrooms", formData.bedrooms);
      formDataToSend.append("bathrooms", formData.bathrooms);
      formDataToSend.append("squareFeet", formData.squareFeet);

      formDataToSend.append("address[street]", formData.street);
      formDataToSend.append("address[city]", formData.city);
      formDataToSend.append("address[state]", formData.state);
      formDataToSend.append("address[zipCode]", formData.zipCode);

      formData.amenities.forEach((amenity) => {
        formDataToSend.append("amenities[]", amenity);
      });

      formDataToSend.append("day", formData.day);
      formDataToSend.append("availableFrom[month]", formData.month);

      if (formData.availableTime) {
        formDataToSend.append("availableFrom[time]", new Date(formData.availableTime).toISOString());
      }

      formDataToSend.append("action", formData.action);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("unitId", formData.unitId);
      formDataToSend.append("currentStatus", formData.currentStatus);
      formDataToSend.append("inspectionStatus[0]", formData.inspectionStatus);

      if (formData.keyExchangeInfo.trim()) {
        formDataToSend.append("keyExchangeInfo[0]", formData.keyExchangeInfo.trim());
      }
      if (formData.packageTracking.trim()) {
        formDataToSend.append("packageTracking[0]", formData.packageTracking.trim());
      }

      // Only append new files (not remote/existing ones)
      images.forEach((img) => {
        if (img.file) formDataToSend.append("images", img.file);
      });

      videos.forEach((vid) => {
        if (vid.file) formDataToSend.append("videos", vid.file);
      });

      const res = await fetch(`${API_BASE}/apartment/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Update failed");
      }

      toast.success("Apartment updated successfully!", { position: "top-right" });
      setTimeout(() => router.push("/apartment-listings"), 1200);
    } catch (err: any) {
      toast.error("Update error: " + (err.message || "Unknown error"), { position: "top-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!id) return <div className="p-8 text-red-600">Invalid apartment ID</div>;

  return (
    <div className="min-h-screen">
      <Header tittle="Edit Apartment Listing" />
      <Bradecumb pageName="Apartment Listings" subPageName="Edit Apartment Listing" />

      <div className="pr-5">
        {isLoading ? (
          <div className="text-center py-20">Loading apartment data...</div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="space-y-6">

                  {/* Title */}
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

                  {/* Address */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-medium text-[#000000] mb-2">Street</label>
                      <Input
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
                    {/* City, State, Zip – same pattern as Add */}
                    <div>
                      <label className="block text-base font-medium text-[#000000] mb-2">City</label>
                      <Input
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

                  {/* Price / Beds / Baths / SqFt */}
                  <div className="grid grid-cols-4 gap-4">
                    {/* same as AddApartment – price, bedrooms, bathrooms, squareFeet */}
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
                    {/* Bedrooms, Bathrooms, Square Feet – copy from Add */}
                    <div>
                      <label className="block text-base font-medium text-[#000000] mb-2">Bedrooms</label>
                      <Input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        placeholder="2"
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
                        placeholder="2"
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
                        placeholder="950"
                        className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                          errors.squareFeet ? "border-red-500" : "border-[#B6B6B6]"
                        }`}
                      />
                      {errors.squareFeet && <p className="text-red-500 text-sm mt-1">{errors.squareFeet}</p>}
                    </div>
                  </div>

                  {/* New fields – same order & style as final AddApartment */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-base font-medium text-[#000000] mb-2">Unit ID</label>
                      <Input
                        type="text"
                        name="unitId"
                        value={formData.unitId}
                        onChange={handleInputChange}
                        placeholder="UNIT-3A"
                        className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#B6B6B6] ${
                          errors.unitId ? "border-red-500" : "border-[#B6B6B6]"
                        }`}
                      />
                      {errors.unitId && <p className="text-red-500 text-sm mt-1">{errors.unitId}</p>}
                    </div>

                    <div>
                      <label className="block text-base font-medium text-[#000000] mb-2">Action</label>
                      <select
                        name="action"
                        value={formData.action}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.action ? "border-red-500" : "border-[#B6B6B6]"
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-base font-medium text-[#000000] mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.status ? "border-red-500" : "border-[#B6B6B6]"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approve">Approve</option>
                        <option value="denied">Denied</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-medium text-[#000000] mb-2">Current Status</label>
                      <select
                        name="currentStatus"
                        value={formData.currentStatus}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.currentStatus ? "border-red-500" : "border-[#B6B6B6]"
                        }`}
                      >
                        <option value="Vacant">Vacant</option>
                        <option value="Occupied">Occupied</option>
                        <option value="In Application">In Application</option>
                        <option value="Inspection Pending">Inspection Pending</option>
                      </select>
                      {errors.currentStatus && <p className="text-red-500 text-sm mt-1">{errors.currentStatus}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Inspection Status</label>
                    <select
                      name="inspectionStatus"
                      value={formData.inspectionStatus}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.inspectionStatus ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    >
                      <option value="Not Scheduled">Not Scheduled</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Passed">Passed</option>
                      <option value="Failed">Failed</option>
                    </select>
                    {errors.inspectionStatus && <p className="text-red-500 text-sm mt-1">{errors.inspectionStatus}</p>}
                  </div>

                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Key Exchange Info</label>
                    <Textarea
                      name="keyExchangeInfo"
                      value={formData.keyExchangeInfo}
                      onChange={handleInputChange}
                      placeholder="Keys available at front desk / Pickup date: ..."
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-[4px] placeholder:text-[#B6B6B6] ${
                        errors.keyExchangeInfo ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Package Tracking</label>
                    <Textarea
                      name="packageTracking"
                      value={formData.packageTracking}
                      onChange={handleInputChange}
                      placeholder="Sent to housing department / Specialist: John Doe ..."
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-[4px] placeholder:text-[#B6B6B6] ${
                        errors.packageTracking ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                  </div>

                  {/* Amenities */}
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

                  {/* Availability */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-base font-medium text-[#000000] mb-2">Day</label>
                      <select
                        name="day"
                        value={formData.day}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.day ? "border-red-500" : "border-[#B6B6B6]"
                        }`}
                      >
                        <option value="">Select day</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                      </select>
                      {errors.day && <p className="text-red-500 text-sm mt-1">{errors.day}</p>}
                    </div>

                    <div>
                      <label className="block text-base font-medium text-[#000000] mb-2">Month</label>
                      <select
                        name="month"
                        value={formData.month}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.month ? "border-red-500" : "border-[#B6B6B6]"
                        }`}
                      >
                        <option value="">Select month</option>
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
                      <label className="block text-base font-medium text-[#000000] mb-2">Available From</label>
                      <Input
                        type="datetime-local"
                        name="availableTime"
                        value={formData.availableTime}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-[4px] h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.availableTime ? "border-red-500" : "border-[#B6B6B6]"
                        }`}
                      />
                      {errors.availableTime && <p className="text-red-500 text-sm mt-1">{errors.availableTime}</p>}
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div>
                    <label className="block text-base font-medium text-[#000000] mb-2">Description</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed description..."
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
                      placeholder="Highlights / key features..."
                      rows={6}
                      className={`w-full px-4 py-2 border rounded-[4px] h-[341px] placeholder:text-[#B6B6B6] ${
                        errors.aboutListing ? "border-red-500" : "border-[#B6B6B6]"
                      }`}
                    />
                    {errors.aboutListing && <p className="text-red-500 text-sm mt-1">{errors.aboutListing}</p>}
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="col-span-1 space-y-6 border">
                <div className="p-6">
                  <label className="block text-base font-medium text-[#000000] mb-3">Images</label>
                  <div className="border-2 border-dashed border-[#B6B6B6] rounded-[4px] h-[414px] p-8 text-center relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Add more images (max 5 total)</p>
                    <div className="flex flex-wrap gap-2 mt-4 absolute bottom-4 left-4 right-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-12 h-12">
                          <Image
                            src={img.url}
                            alt={`Image ${idx + 1}`}
                            width={100}
                            height={100}
                            className="w-12 h-12 object-cover rounded-[4px]"
                          />
                          <button
                            onClick={() => removeImage(idx)}
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
                    <p className="text-sm text-gray-600">Add more videos (max 5 total)</p>
                    <div className="flex flex-wrap gap-2 mt-4 absolute bottom-4 left-4 right-4">
                      {videos.map((vid, idx) => (
                        <div key={idx} className="relative w-12 h-12">
                          <video
                            src={vid.url}
                            className="w-12 h-12 object-cover rounded-[4px]"
                            muted
                          />
                          <button
                            onClick={() => removeVideo(idx)}
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

            <div className="flex justify-end mt-10 pb-10">
              <Button
                onClick={handleUpdate}
                disabled={isSubmitting}
                className={`bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[48px] rounded-[8px] text-white px-10 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Updating..." : "Update Listing"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditApartment;