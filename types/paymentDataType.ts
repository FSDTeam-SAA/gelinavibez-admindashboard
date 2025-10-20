export interface PaymentListResponse {
  statusCode: number
  success: boolean
  message: string
  meta: {
    total: number
    page: number
    limit: number
  }
  data: PaymentItem[]
}

export interface PaymentItem {
  _id: string
  tenantId: string
  tenantName: string
  tenantEmail: string
  amount: number
  status: "approved" | "pending" | "rejected" | string
  stripeSessionId: string
  stripePaymentIntentId?: string
  contractor?: string
  extermination?: string
  apartmentName?: string
  typeOfProblem?: string
  chargeId?: string
  user: PaymentUser
  createdAt: string // ISO Date string
  updatedAt: string // ISO Date string
  paymentDate?: string // ISO Date string
  __v: number
}

export interface PaymentUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  profileImage: string
}

