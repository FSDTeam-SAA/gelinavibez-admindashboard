import { ExterminationResponse } from "@/types/exterminationDataType"

export async function getExtermination(
    token: string,
    currentPage: number,
    itemsPerPage: number
): Promise<ExterminationResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/extermination?page=${currentPage}&limit=${itemsPerPage}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )
    if (!response.ok) {
        let errorMessage = "Failed to get extermination"
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
        } catch {
        }
        throw new Error(errorMessage)
    }

    const resData: ExterminationResponse = await response.json()

    return resData
}
