import { ProfileUpdatePayload } from "@/types/userDataType";


export async function getProfile(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  const resData = await response.json()
  if (!response.ok) {
    throw new Error(resData.message || "Failed to get profile")
  }
  return resData
}


export async function updateProfileInfo(token: string, payload: ProfileUpdatePayload) {
  const formData = new FormData();
  formData.append("firstName", payload.firstName);
  formData.append("lastName", payload.lastName);
  formData.append("jobTitle", payload.jobTitle);
  formData.append("bio", payload.bio);
  formData.append("phone", payload.phoneNumber);
  formData.append("location", payload.location);
  if (payload.avatar) formData.append("profileImage", payload.avatar);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, {
    method: "PUT",
    headers: {

      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Failed to update profile");
  return resData;
}


export async function changePassword(token: string, payload: { oldPassword: string; newPassword: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Failed to update password");
  return resData;
}
