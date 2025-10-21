import { ContractorResponse } from "@/types/ContractorDataType"

export async function getConstractor(
    token: string,
): Promise<ContractorResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contractor`,
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

    const resData: ContractorResponse = await response.json()

    return resData
}

export async function addAssingnedContractor(token: string, payload: { exterminationId: string; constractorId: string }) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/extermination/add-contractor/${payload.exterminationId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contractor: payload.constractorId }),
    });

    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || "Failed to update contractor");
    return resData;
}
