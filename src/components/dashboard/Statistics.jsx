import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import StatCard from './StatCard';
import { FolderKanban, Package2, BarChart2, TrendingUp } from 'lucide-react';

const Statistics = ({ items, categories }) => {
  const itemsByCategory = categories.map(category => ({
    name: category.name,
    count: items.filter(item => item.type === category.name.toLowerCase()).length,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  const totalItems = items.length;
  const totalCategories = categories.length;
  const recentItems = items.filter(item => {
    const itemDate = new Date(item.createdAt);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return itemDate >= oneWeekAgo;
  }).length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Category
              </span>
              <span className="font-bold text-muted-foreground">
                {label}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Items
              </span>
              <span className="font-bold">
                {payload[0].value}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBar = (props) => {
    const { fill, x, y, width, height } = props;
    return (
      <g>
        <defs>
          <linearGradient id={`gradient-${y}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity={0.8} />
            <stop offset="100%" stopColor={fill} stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#gradient-${y})`}
          rx={4}
          ry={4}
        />
      </g>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Items"
          value={totalItems}
          description="Total items in your vault"
          icon={<Package2 className="h-4 w-4 text-blue-500" />}
        />
        <StatCard
          title="Categories"
          value={totalCategories}
          description="Number of categories"
          icon={<FolderKanban className="h-4 w-4 text-green-500" />}
        />
        <StatCard
          title="Recent Items"
          value={recentItems}
          description="Added in the last 7 days"
          icon={<TrendingUp className="h-4 w-4 text-yellow-500" />}
        />
        <StatCard
          title="Usage"
          value="85%"
          description="Storage space used"
          icon={<BarChart2 className="h-4 w-4 text-purple-500" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={itemsByCategory} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                barSize={40}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-muted/20" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  className="text-xs font-medium text-muted-foreground"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  className="text-xs font-medium text-muted-foreground"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                />
                <Bar 
                  dataKey="count" 
                  shape={<CustomBar />}
                  fill="hsl(var(--primary))"
                >
                  {itemsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
