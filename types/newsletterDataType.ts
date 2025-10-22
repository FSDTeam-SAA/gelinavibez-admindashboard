export interface NewsletterResponse {
  statusCode: number
  success: boolean
  message: string
  meta: {
    total: number
    page: number
    limit: number
  }
  data: NewsletterSubscriber[]
}

export interface NewsletterSubscriber {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
  updatedAt: string
  __v: number
}
