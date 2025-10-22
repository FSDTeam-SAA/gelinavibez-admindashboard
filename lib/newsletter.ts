import { NewsletterResponse } from "@/types/newsletterDataType"

export async function getNewsletter(
    token: string,
    currentPage: number,
    itemsPerPage: number
): Promise<NewsletterResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscribe?page=${currentPage}&limit=${itemsPerPage}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )
    if (!response.ok) {
        let errorMessage = "Failed to get newsletter"
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
        } catch {
        }
        throw new Error(errorMessage)
    }

    const resData: NewsletterResponse = await response.json()

    return resData
}