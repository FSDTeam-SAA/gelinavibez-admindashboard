import { getContact, getSingleContact } from "@/lib/contact";
import { getPayment } from "@/lib/payment";
import { changePassword, getProfile, updateProfileInfo } from "@/lib/profileInfo";
import { ProfileUpdatePayload, UserProfileResponse } from "@/types/userDataType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useProfileQuery(token: string | undefined) {
    return useQuery<UserProfileResponse>({
        queryKey: ["me"],
        queryFn: () => {
            if (!token) throw new Error("Token is missing")
            return getProfile(token)
        },
        enabled: !!token,
    })
}

export function useProfileInfoUpdate(token: string, onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ProfileUpdatePayload) => updateProfileInfo(token, payload),
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["me"] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error: unknown) => {
            if (error instanceof Error) toast.error(error.message || "Update failed");
            else toast.error("Update failed");
        },
    });
}

export function useChnagePassword(
    token: string, onSuccessCallback?: () => void) {
    return useMutation({
        mutationFn: (payload: { oldPassword: string; newPassword: string }) =>
            changePassword(token, payload),
        onSuccess: (data) => {
            toast.success(data?.message || "Password updated successfully");
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error: unknown) => {
            if (error instanceof Error) toast.error(error.message || "Update failed");
            else toast.error("Update failed");
        },
    });
}

export function useGetContact(
    token: string | undefined,
    currentPage: number,
    itemsPerPage: number
) {
    return useQuery({
        queryKey: ["contact", currentPage, itemsPerPage],
        queryFn: () => {
            if (!token) throw new Error("Token is missing");
            return getContact(token, currentPage, itemsPerPage);
        },
        enabled: !!token,
    });
}

export function useGetSingelContact(
    token: string | undefined,
    id: string
) {
    return useQuery({
        queryKey: ["singelContact", id],
        queryFn: () => {
            if (!token) throw new Error("Token is missing");
            return getSingleContact(token,id);
        },
        enabled: !!token,
    });
}


export function useGetPayment(
    token: string | undefined,
    currentPage: number,
    itemsPerPage: number
) {
    return useQuery({
        queryKey: ["payment", currentPage, itemsPerPage],
        queryFn: () => {
            if (!token) throw new Error("Token is missing");
            return getPayment(token, currentPage, itemsPerPage);
        },
        enabled: !!token,
    });
}
