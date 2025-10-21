import { ServiceResponse } from "@/types/serviceDataType"


export async function getService(
    token: string,
): Promise<ServiceResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/service`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )
    if (!response.ok) {
        let errorMessage = "Failed to get contractor"
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
        } catch {
        }
        throw new Error(errorMessage)
    }

    const resData: ServiceResponse = await response.json()

    return resData
}