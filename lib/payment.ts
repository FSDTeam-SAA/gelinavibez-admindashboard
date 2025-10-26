import { PaymentListResponse } from "@/types/paymentDataType"

export async function getPayment(
    token: string,
    currentPage: number,
    itemsPerPage: number
): Promise<PaymentListResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment?page=${currentPage}&limit=${itemsPerPage}`,
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

    const resData: PaymentListResponse = await response.json()
    return resData
}

export async function getPrice(
    token: string,
) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tenantfree`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )
    if (!response.ok) {
        let errorMessage = "Failed to get "
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
        } catch {
        }
        throw new Error(errorMessage)
    }

    const resData = await response.json()

    return resData
}

export async function addcPrice(token: string, payload:{price:number}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tenantfree`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({applicationFee:payload.price}),
    });

    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || "Failed to update price");
    return resData;
}
