
import { TrendingUp, Users, Truck, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Profit', value: '₹ 1,24,500', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Active Lorries', value: '12', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Pending Invoices', value: '5', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Total Expenses', value: '₹ 45,000', icon: Users, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>

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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-400">
          Chart Placeholder 1
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-400">
          Chart Placeholder 2
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
