"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { mockUsageData } from "@/lib/mock-data"

const chartConfig = {
  'API Calls': {
    label: "API Calls",
    color: "hsl(var(--primary))",
  },
  'Users': {
    label: "Users",
    color: "hsl(var(--accent))",
  },
}

export function UsageChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <AreaChart
        accessibilityLayer
        data={mockUsageData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }}
        />
        <YAxis />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
            <linearGradient id="fillApi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-API Calls)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-API Calls)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-Users)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-Users)" stopOpacity={0.1}/>
            </linearGradient>
        </defs>
        <Area
          dataKey="API Calls"
          type="natural"
          fill="url(#fillApi)"
          stroke="var(--color-API Calls)"
          stackId="a"
        />
        <Area
          dataKey="Users"
          type="natural"
          fill="url(#fillUsers)"
          stroke="var(--color-Users)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}
