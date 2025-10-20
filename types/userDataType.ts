export interface UserProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  profileImage: string
  verified: boolean
  jobTitle: string
  bio: string
  location: string
  phone: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface UserProfileResponse {
  statusCode: number
  success: boolean
  message: string
  data: UserProfile
}

export interface ProfileUpdatePayload {
  firstName: string
  lastName: string
  jobTitle: string
  bio: string
  phoneNumber: string
  location: string
  avatar?: string | File
}