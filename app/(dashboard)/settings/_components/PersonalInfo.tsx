"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useProfileInfoUpdate, useProfileQuery } from "@/hooks/ApiClling";
import { ProfileUpdatePayload } from "@/types/userDataType";

interface ProfileData {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export function PersonalInfo() {
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const getProfile = useProfileQuery(token);
  const profile = getProfile.data?.data;
  const useProfileMutation = useProfileInfoUpdate(token);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    bio: "",
    phoneNumber: "",
    location: "",
  });

  // Load profile info into form when available
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        jobTitle: profile.jobTitle || "",
        bio: profile.bio || "",
        phoneNumber: profile.phone || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ProfileUpdatePayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      jobTitle: formData.jobTitle,
      bio: formData.bio,
      phoneNumber: formData.phoneNumber,
      location: formData.location,
    };
    if (profileImage) {
      payload.avatar = profileImage;
    }

    useProfileMutation.mutate(payload);

  };


  const imageSrc = profileImage
    ? URL.createObjectURL(profileImage)
    : profile?.profileImage
      ? profile.profileImage.startsWith("http")
        ? profile.profileImage
        : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ""}${profile.profileImage}`
      : "/placeholder.svg";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full mx-auto p-6 md:p-8 bg-white rounded-lg"
    >
      <h2 className="text-2xl font-bold text-[#0F3D61] mb-6">
        Profile Information
      </h2>

      <div className="flex gap-10 items-start">
        {/* Profile Picture */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar className="w-[110px] h-[110px]">
              <AvatarImage
                src={imageSrc}
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback>
                {formData.firstName?.[0]?.toUpperCase() ||
                  profile?.firstName?.[0]?.toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 p-1.5 bg-blue-900 text-white rounded-full hover:bg-blue-800"
            >
              <Camera className="w-3 h-3" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Info Fields */}
        <div className="w-full space-y-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>

          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <InputField
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
          />
          <TextareaField
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-t pt-6">
        <h3 className="text-xl text-[#0F3D61] font-bold">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <InputField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          <InputField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Save / Cancel */}
      <div className="flex justify-end mt-6">
        <Link
          href="/settings"
          className="text-[#0F3D61] text-[18px] font-semibold"
        >
          <Button className="bg-white hover:bg-[#0F3D61]/90 h-[50px] rounded-[8px] text-[#0F3D61] text-[18px] font-normal mr-4 border border-[#0F3D61] hover:text-white">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          className="bg-[#0F3D61] hover:bg-[#0F3D61]/90 h-[50px] text-white rounded-[8px] text-base"
        >
          Save Changes {useProfileMutation.isPending && <Loader2 className="w-4 h-4 animate-spin"/>}
        </Button>
      </div>
    </form>
  );
}

// Reusable Input Component
function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}: ProfileData) {
  return (
    <div>
      <label className="block text-[16px] font-normal text-[#616161] mb-2">
        {label}
      </label>
      <Input
        name={name}
        type={type}
        value={value}
        disabled={name === "email"}
        onChange={onChange}
        placeholder={label}
        className="w-full bg-[#E7ECEF] h-[48px] rounded-[8px] border-none focus:outline-none placeholder:text-[#929292] text-[#000000]"
      />
    </div>
  );
}

// Reusable Textarea Component
interface TextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
function TextareaField({ label, name, value, onChange }: TextareaProps) {
  return (
    <div>
      <label className="block text-[16px] font-normal text-[#616161] mb-2">
        {label}
      </label>
      <Textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full min-h-[118px] bg-[#E7ECEF] rounded-[8px] border-none focus:outline-none placeholder:text-[#929292] text-[#000000]"
      />
    </div>
  );
}
