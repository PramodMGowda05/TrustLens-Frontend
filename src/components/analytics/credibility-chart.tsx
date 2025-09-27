"use client"

import * as React from "react"
import { Pie, PieChart, Cell, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { mockCredibilityData } from "@/lib/mock-data"

const chartConfig = {
  value: {
    label: "Reviewers",
  },
  ...mockCredibilityData.reduce((acc, cur) => {
    acc[cur.bucket] = { label: cur.bucket, color: cur.fill };
    return acc;
  }, {})
}

export function CredibilityChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <Pie
          data={mockCredibilityData}
          dataKey="value"
          nameKey="bucket"
          innerRadius={60}
          strokeWidth={5}
        >
          {mockCredibilityData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent nameKey="bucket" />} />
      </PieChart>
    </ChartContainer>
  )
}
