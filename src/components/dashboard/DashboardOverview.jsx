import React from 'react';
import { motion } from 'framer-motion';
import { Package, FolderTree, Clock, Star, TrendingUp, Users } from 'lucide-react';
import { formatDistanceToNow, subDays, format } from 'date-fns';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar, CartesianGrid
} from 'recharts';

function DashboardOverview({ items = [], categories = [] }) {
  const recentItems = items.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 5);

  // Prepare data for Activity Chart (last 7 days)
  const activityData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const count = items.filter(item => 
      new Date(item.createdAt).toDateString() === date.toDateString()
    ).length;
    return {
      date: format(date, 'EEE'),
      items: count
    };
  }).reverse();

  // Prepare data for Category Distribution
  const categoryData = categories.map(category => ({
    name: category.name,
    value: items.filter(item => item.categoryId === category.id).length
  })).filter(cat => cat.value > 0);

  const COLORS = ['#7c3aed', '#db2777', '#2563eb', '#059669', '#d97706'];

  const stats = [
    {
      title: "Total Items",
      value: items.length,
      icon: Package,
      color: "from-purple-600 to-blue-600",
      description: "Items in your collection"
    },
    {
      title: "Categories",
      value: categories.length,
      icon: FolderTree,
      color: "from-pink-600 to-purple-600",
      description: "Organized categories"
    },
    {
      title: "Recent Activity",
      value: recentItems.length,
      icon: Clock,
      color: "from-blue-600 to-cyan-600",
      description: "Items added recently"
    },
    {
      title: "Fields Used",
      value: categories.reduce((acc, cat) => acc + cat.fields.length, 0),
      icon: Star,
      color: "from-orange-600 to-pink-600",
      description: "Total custom fields"
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {`${payload[0].value} items`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Stats Grid */}
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative"
        >
          <div className="relative overflow-hidden rounded-xl border bg-card p-6">
            <div className="absolute inset-0 bg-gradient-to-br opacity-[0.08] group-hover:opacity-[0.12] transition-opacity" />
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <stat.icon className={`h-5 w-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                  <h3 className="font-semibold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    {stat.title}
                  </h3>
                </div>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="ml-2 text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="col-span-full lg:col-span-2"
      >
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5" />
            Activity Overview
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="items"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  fill="url(#colorItems)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Category Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="col-span-full lg:col-span-2"
      >
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2 mb-6">
            <Users className="h-5 w-5" />
            Category Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="stroke-background hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Recent Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="col-span-full"
      >
        <div className="rounded-xl border bg-card">
          <div className="p-6 border-b">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </h3>
          </div>
          <div className="divide-y">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/10 to-blue-600/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {categories.find(c => c.id === item.categoryId)?.name || 'Uncategorized'}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </div>
              </div>
            ))}
            {recentItems.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default DashboardOverview;