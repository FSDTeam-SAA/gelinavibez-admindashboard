"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

export function EarningsChart() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const session = useSession();
  const token = session?.data?.accessToken;

  const { data: earningsData = [], isLoading, isError } = useQuery({
    queryKey: ["monthly-earnings", selectedYear],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/monthly-earnings?year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch earnings data");
      }
      const result = await res.json();
      return Array.isArray(result) ? result : result.data || [];
    },
    enabled: !!token,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching earnings data</div>;
  }

  if (!token) {
    return <div>Please log in to view earnings data</div>;
  }

  const chartData = Array.isArray(earningsData) ? earningsData : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-medium">Total Earning</CardTitle>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F3D61" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0F3D61" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              ticks={[500, 1000, 1500, 2000, 2500, 3000]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border rounded-lg shadow-lg p-3">
                      <div className="text-sm font-semibold">
                        ${payload[0].value}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="totalEarnings" 
              stroke="#0F3D61"
              strokeWidth={3}
              fill="url(#colorEarning)"
              dot={false}
              activeDot={{ r: 6, fill: "#1e40af" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}