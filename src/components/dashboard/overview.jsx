"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export function Overview({ data }) {
  // Add gradients and format data
  const formattedData = data.map((item, index) => ({
    ...item,
    total: item.total || 0
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={formattedData}
        margin={{ 
          top: 10, 
          right: 10, 
          left: -20, 
          bottom: 0 
        }}
      >
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="name"
          tick={{ 
            fill: 'hsl(var(--foreground))', 
            fontSize: 12 
          }}
          tickLine={{ stroke: 'hsl(var(--foreground))' }}
          interval="preserveStartEnd"
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ 
            fill: 'hsl(var(--foreground))', 
            fontSize: 12 
          }}
          tickLine={{ stroke: 'hsl(var(--foreground))' }}
          width={40}
        />
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false}
          stroke="hsl(var(--muted-foreground))"
          opacity={0.2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            color: "hsl(var(--foreground))"
          }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--primary))"
          fillOpacity={1}
          fill="url(#colorTotal)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
