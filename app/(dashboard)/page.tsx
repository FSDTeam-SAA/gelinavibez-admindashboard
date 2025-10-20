
import { EarningsChart } from "@/components/dashbord/Eamings-chart";
import { RecentBookings } from "@/components/dashbord/Recent-bookings";
import { RecentCustomers } from "@/components/dashbord/Recent-customers";
import { StatCard } from "@/components/dashbord/Stat-card";
import { Header } from "@/components/Shared/Header";


export default function DashboardPage() {

  return (
    <section>
      <Header tittle="Dashboard" />
    <div className="min-h-screen bg-gray-50 px-5">
      <div className="w-full space-y-6 mt-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-0">
          <StatCard title="Apartment" value="1,234" />
          <StatCard title="Total Services" value="1,234" />
          <StatCard title="Total Customers" value="1,234" />
          <StatCard title="Total Bookings" value="1,234" />
          <StatCard title="Earnings" value="$1,234" />
        </div>

        {/* Earnings Chart */}
        <EarningsChart />

        {/* Recent Customers and Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentCustomers />
          <RecentBookings />
        </div>
      </div>
    </div>
    </section>
  )
}
