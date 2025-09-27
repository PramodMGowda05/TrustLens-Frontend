"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { mockClassificationData } from "@/lib/mock-data"

const chartConfig = {
  genuine: {
    label: "Genuine",
    color: "hsl(var(--chart-2))",
  },
  fake: {
    label: "Fake",
    color: "hsl(var(--chart-1))",
  },
}

export function ClassificationChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={mockClassificationData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="genuine" fill="var(--color-genuine)" radius={4} />
        <Bar dataKey="fake" fill="var(--color-fake)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
