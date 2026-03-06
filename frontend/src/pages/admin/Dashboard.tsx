// import React, { useState } from 'react';
import { TrendingUp, Users, Truck, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');

  const stats = [
    { title: 'Total Profit', value: '₹ 1,24,500', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Active Lorries', value: '12', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Pending Invoices', value: '5', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Total Expenses', value: '₹ 45,000', icon: Users, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const financialData = {
    Weekly: [
      { name: 'Commission', value: 15000, color: '#3b82f6' },
      { name: 'Profits', value: 25000, color: '#10b981' },
      { name: 'Expenses', value: 10000, color: '#ef4444' },
      { name: 'Maintenance', value: 5000, color: '#f59e0b' },
    ],
    Monthly: [
      { name: 'Commission', value: 65000, color: '#3b82f6' },
      { name: 'Profits', value: 124500, color: '#10b981' },
      { name: 'Expenses', value: 45000, color: '#ef4444' },
      { name: 'Maintenance', value: 18000, color: '#f59e0b' },
    ],
    Yearly: [
      { name: 'Commission', value: 780000, color: '#3b82f6' },
      { name: 'Profits', value: 1450000, color: '#10b981' },
      { name: 'Expenses', value: 520000, color: '#ef4444' },
      { name: 'Maintenance', value: 200000, color: '#f59e0b' },
    ]
  };

  const currentFinancialData = financialData[timeFilter];

  const operationalData = [
    { name: 'Heavy Duty', value: 35, color: '#6366f1' },
    { name: 'Medium Duty', value: 45, color: '#8b5cf6' },
    { name: 'Light Duty', value: 20, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>

        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-slate-200">
          {(['Weekly', 'Monthly', 'Yearly'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${timeFilter === filter
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">{timeFilter} Financial Overview</h2>
          <div className="flex-1 w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentFinancialData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {currentFinancialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `₹ ${Number(value).toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Fleet Distribution</h2>
          <div className="flex-1 w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={operationalData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {operationalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `${value} Vehicles`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
