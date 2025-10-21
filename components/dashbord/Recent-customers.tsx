import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  phone?: string;
  stripeAccountId?: string;
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
  data: User[];
}



export function RecentCustomers() {
 const session=useSession();
 const token=session?.data?.accessToken;
  async function fetchCustomers(): Promise<User[]> {
 
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  const json: ApiResponse = await response.json();
  return json.data;
}
  const { data: customers = [], isLoading } = useQuery<User[]>({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <h3 className="text-[18px] font-semibold text-[#343A40]">Recent Customers</h3>
          </CardTitle>
          <Button variant="link" className="text-base font-bold text-[#0F3D61] p-0 h-auto">
            See all
          </Button>
        </CardHeader>
        <CardContent>
          <div>Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <h3 className="text-[18px] font-semibold text-[#343A40]">Recent Customers</h3>
        </CardTitle>
        <Button variant="link" className="text-base font-bold text-[#0F3D61] p-0 h-auto">
          See all
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {customers.slice(0, 3).map((customer) => (
          <div key={customer._id} className="flex items-center gap-4 border-b border-[#E6E6E8] pb-4 ">
            <Avatar className="h-10 w-10">
              <AvatarImage src={customer.profileImage || "/placeholder.svg"} alt={`${customer.firstName} ${customer.lastName}`} />
              <AvatarFallback>{customer.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-base text-[#343A40]">{`${customer.firstName} ${customer.lastName}`.trim()}</div>
              <div className="text-xs text-[#8E938F] font-normal">{customer.email}</div>
            </div>
            <div className="flex items-center gap-1 text-sm text-[#68706A] font-normal">
              <MapPin className="h-3 w-3 text-[#68706A]" />
              <span className="truncate max-w-[150px] text-[#68706A]">{customer.phone || "N/A"}</span>
            </div>
            <div className="text-sm font-medium text-[#68706A]">N/A</div>
            <div className="text-sm text-[#68706A] font-normal">N/A</div>
            {/* <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-5 w-5 text-[#68706A]" />
            </Button> */}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}