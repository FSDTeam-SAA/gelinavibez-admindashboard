import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

const customers = [
  {
    id: 1,
    name: "David Juaal",
    email: "example@example.com",
    address: "2715 Ash Dr. San Jose, South...",
    amount: "$2,000",
    percentage: "9%",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "David Juaal",
    email: "example@example.com",
    address: "2715 Ash Dr. San Jose, South...",
    amount: "$2,000",
    percentage: "9%",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "David Juaal",
    email: "example@example.com",
    address: "2715 Ash Dr. San Jose, South...",
    amount: "$2,000",
    percentage: "9%",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function RecentCustomers() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle >
          <h3 className="text-[18px] font-semibold text-[#343A40]">Recent Customers</h3>

          </CardTitle>
        <Button variant="link" className="text-base font-bold text-[#0F3D61] p-0 h-auto">
          See all
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {customers.map((customer) => (
          <div key={customer.id} className="flex items-center gap-4 border-b border-[##E6E6E8] pb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
              <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-base text-[#343A40]">{customer.name}</div>
              <div className="text-xs text-[#8E938F] font-normal">{customer.email}</div>
            </div>
            <div className="flex items-center gap-1 text-sm text-[#68706A] font-normal">
              <MapPin className="h-3 w-3 text-[#68706A]" />
              <span className="truncate max-w-[150px] text-[#68706A]">{customer.address}</span>
            </div>
            <div className="text-sm font-medium text-[#68706A]">{customer.amount}</div>
            <div className="text-sm text-[#68706A] font-normal">{customer.percentage}</div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-5 w-5 text-[#68706A]" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
