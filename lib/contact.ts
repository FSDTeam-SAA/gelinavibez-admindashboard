import {  ContactDetailsResponse, ContactResponse } from "@/types/contactrDataType"

export async function getContact(
    token: string,
    currentPage: number,
    itemsPerPage: number
): Promise<ContactResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact?page=${currentPage}&limit=${itemsPerPage}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )
    if (!response.ok) {
        let errorMessage = "Failed to get contact"
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
        } catch {
        }
        throw new Error(errorMessage)
    }

    const resData: ContactResponse = await response.json()
    return resData
}

export async function getSingleContact(
    token: string,
    id: string
): Promise<ContactDetailsResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )
    if (!response.ok) {
        let errorMessage = "Failed to get contact"
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
        } catch {
        }
        throw new Error(errorMessage)
    }

    const resData: ContactDetailsResponse = await response.json()
    return resData
}
