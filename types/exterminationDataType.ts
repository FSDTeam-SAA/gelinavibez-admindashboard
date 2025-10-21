export interface ExterminationResponse {
  statusCode: number
  success: boolean
  message: string
  meta: {
    total: number
    page: number
    limit: number
  }
  data: ExterminationApplication[]
}

export interface ExterminationApplication {
  status: string
  _id: string
  fullName: string
  email: string
  phoneNumber: string
  propertyAddress: string
  typeOfProperty: string
  preferredContactMethod: string
  typeOfPestProblem: string[]
  locationOfProblem: string[]
  durationOfIssue: string
  previousExterminationService: string
  previousExterminationDate?: string
  preferredServiceDate: string
  preferredTime: string
  buildingAccessRequired: string
  contactInfo: string
  signature: string
  date: string
  user: ExterminationUser
  createdAt: string
  updatedAt: string
  __v: number
  contractor?: ExterminationContractor
}

export interface ExterminationUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  profileImage: string
}

export interface ExterminationContractor {
  _id: string
  companyName: string
  CompanyAddress: string
  name: string
  number: string
  email: string
  service: string
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
