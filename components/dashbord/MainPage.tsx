"use client";
import { EarningsChart } from "@/components/dashbord/Eamings-chart";
import { RecentBookings } from "@/components/dashbord/Recent-bookings";
import { RecentCustomers } from "@/components/dashbord/Recent-customers";
import { StatCard } from "@/components/dashbord/Stat-card";
import { Header } from "@/components/Shared/Header";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const session = useSession();
  const token = session?.data?.accessToken;

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  // Skeleton Loading Component
  const SkeletonStatCard = () => (
    <div className="bg-white p-4 rounded-lg shadow animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="bg-white p-6 rounded-lg shadow animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-white p-6 rounded-lg shadow animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );

  // No Data/Error Component
  const NoDataMessage = ({ message = "No data available" }) => (
    <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );

  if (isLoading) {
    return (
      <section>
        <Header tittle="Dashboard" />
        <div className="min-h-screen bg-gray-50 px-5">
          <div className="w-full space-y-6 mt-6">
            {/* Skeleton Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-0">
              {[...Array(5)].map((_, i) => (
                <SkeletonStatCard key={i} />
              ))}
            </div>

            {/* Skeleton Earnings Chart */}
            <SkeletonChart />

            {/* Skeleton Recent Customers and Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonTable />
              <SkeletonTable />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data?.data) {
    return (
      <section>
        <Header tittle="Dashboard" />
        <div className="min-h-screen bg-gray-50 px-5">
          <div className="w-full space-y-6 mt-6">
            <NoDataMessage message={error ? "Error loading data" : "No data available"} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Header tittle="Dashboard" />
      <div className="min-h-screen bg-gray-50 px-5">
        <div className="w-full space-y-6 mt-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-0">
            <StatCard title="Apartment" value={data?.data.apartment} />
            <StatCard title="Total Services" value={data?.data.service} />
            <StatCard title="Total Customers" value={data?.data.counstomer} />
            <StatCard title="Total Bookings" value={data?.data.booking} />
            <StatCard title="Earnings" value={data?.data.totalEarning} />
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
  );
}