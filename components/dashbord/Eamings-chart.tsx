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

const data = [
  { month: "Jan", earning: 400 },
  { month: "Feb", earning: 500 },
  { month: "Mar", earning: 600 },
  { month: "Apr", earning: 1000 },
  { month: "May", earning: 700 },
  { month: "June", earning: 650 },
  { month: "July", earning: 800 },
  { month: "Aug", earning: 750 },
  { month: "Sep", earning: 900 },
  { month: "Oct", earning: 2000 },
  { month: "Nov", earning: 1200 },
  { month: "Dec", earning: 1500 },
];

export function EarningsChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-medium">Total Earning</CardTitle>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-sm text-muted-foreground">September, 2025</div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
              ticks={[500,1000, 1500, 2000, 2500]} 
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
              dataKey="earning"
              stroke="#0F3D61"
              strokeWidth={3}
              fill="#0F3D6133"
              dot={false} // 🔹 Hide all normal dots
              activeDot={{ r: 6, fill: "#1e40af" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
