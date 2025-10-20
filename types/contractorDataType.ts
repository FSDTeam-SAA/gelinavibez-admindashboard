export interface Contact {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ContactMeta {
  total: number
  page: number
  limit: number
}

export interface ContactResponse {
  statusCode: number
  success: boolean
  message: string
  meta: ContactMeta
  data: Contact[]
}


export interface ContactDetailsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ContactDetails;
}

export interface ContactDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
