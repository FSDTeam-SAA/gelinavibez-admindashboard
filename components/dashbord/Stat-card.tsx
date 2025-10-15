import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-xl text-[#343A40] font-bold mb-2">{title}</div>
        <div className="text-[32px] text-[#051523] font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}
