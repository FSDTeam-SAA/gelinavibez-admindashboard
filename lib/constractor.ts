import { ContractorPayload } from "@/hooks/ApiClling"
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

export async function getConstractorv1(
    token: string,
    currentPage: number,
    itemsPerPage: number
): Promise<ContractorResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contractor?page=${currentPage}&limit=${itemsPerPage}`,
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

export async function deleteContractor(token: string, id: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contractor/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    const resData = await response.json()
    if (!response.ok) {
        throw new Error(resData.message || "Failed to delete contractor")
    }
    return resData
}

export async function addcontractor(token: string, payload: ContractorPayload) {
    const formData = new FormData();
   formData.append("companyName", payload.companyName);
   formData.append("CompanyAddress", payload.companyAddress);
   formData.append("name", payload.name);
   formData.append("email", payload.email);
   formData.append("number", payload.number);
   formData.append("service", payload.serviceId);
   formData.append("serviceAreas", payload.serviceAreas);
   formData.append("scopeWork", payload.scopeofWork);
   formData.append("worlHour", payload.workHours);
   formData.append("superContact", payload.superContact);
   formData.append("superName", payload.superName);
   if (payload.image) formData.append("image", payload.image);

    

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contractor`, {
        method: "POST",
        headers: {

            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || "Failed to update profile");
    return resData;
}
