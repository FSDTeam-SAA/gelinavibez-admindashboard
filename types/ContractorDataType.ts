export interface Service {
  _id: string
  name: string
  createBy: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Contractor {
  _id: string
  companyName: string
  CompanyAddress: string
  name: string
  number: string
  email: string
  service: Service
  serviceAreas: string
  scopeWork: string
  worlHour: number
  superContact: string
  superName: string
  image: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ContractorMeta {
  total: number
  page: number
  limit: number
}

export interface ContractorData {
  meta: ContractorMeta
  data: Contractor[]
}

export interface ContractorResponse {
  statusCode: number
  success: boolean
  message: string
  data: ContractorData
}
