import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Define interfaces for the API response
interface Apartment {
  _id: string;
  title: string;
  description: string;
  aboutListing: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
}

interface CreateBy {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage: string;
}

interface AppliedAddress {
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface Tenant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ssn: string;
  hasVoucher: boolean;
  livesInShelter: boolean;
  affiliatedWithHomebase: boolean;
  applicantSignature: string;
  acceptedTerms: boolean;
  status: string;
  createBy: CreateBy;
  apartmentId: Apartment;
  appliedAddress: AppliedAddress;
  createdAt: string;
  updatedAt: string;
  paymentId: string;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: Tenant[];
}

// Fetch function for TanStack Query

export function RecentBookings() {
  const session = useSession();
  const token = session?.data?.accessToken;

  const fetchTenants = async (): Promise<ApiResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tenant`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tenant data");
    }

    return response.json();
  };

  const { data,  error } = useQuery<ApiResponse>({
    queryKey: ["tenants"],
    queryFn: fetchTenants,
    enabled: session.status === "authenticated",
  });

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const bookings = data?.data || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <h3 className="text-[18px] font-semibold text-[#343A40]">
            Recent Bookings
          </h3>
        </CardTitle>
        <Link href="/bookings" >
        <Button
          variant="link"
          className="text-base font-bold text-[#0F3D61] p-0 h-auto"
        >
          See all
        </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.slice(0, 3).map((booking) => (
          <div
            key={booking._id}
            className="flex items-center gap-4 border-b border-[#E6E6E8] pb-4"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={booking.createBy.profileImage || "/placeholder.svg"}
                alt={`${booking.firstName} ${booking.lastName}`}
              />
              <AvatarFallback>
                {booking.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-base text-[#343A40]">
                {booking.firstName} {booking.lastName}
              </div>
              <div className="text-xs text-[#8E938F] font-normal">
                {booking.email}
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-[#68706A] font-normal">
              <MapPin className="h-3 w-3 text-[#68706A]" />
              <span className="truncate max-w-[150px] text-[#68706A]">
                {booking.appliedAddress.address}
              </span>
            </div>
            <div className="text-sm font-medium text-[#68706A]">
              ${booking.apartmentId.price.toLocaleString()}
            </div>
            <div className="text-sm text-[#68706A] font-normal">
              {booking.status}
            </div>
            {/* <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-5 w-5 text-[#68706A]" />
            </Button> */}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}