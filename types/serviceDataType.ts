export interface ServiceResponse {
  statusCode: number
  success: boolean
  message: string
  meta: {
    total: number
    page: number
    limit: number
  }
  data: Service[]
}

export interface Service {
  _id: string
  name: string
  createBy: string
  createdAt: string
  updatedAt: string
  __v: number
}
