
import { FileBarChart, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const Reports = () => {
  const reports = [
    { title: 'Monthly Profit/Loss', desc: 'Detailed breakdown of income and expenses per month.', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { title: 'Party Ledger', desc: 'Statement of accounts for all parties and clients.', icon: FileBarChart, color: 'bg-blue-100 text-blue-600' },
    { title: 'Outstanding Payments', desc: 'List of pending payments from parties.', icon: DollarSign, color: 'bg-orange-100 text-orange-600' },
    { title: 'Date-wise Register', desc: 'Daily transport register and vehicle movement log.', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Reports Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${report.color}`}>
              <report.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{report.title}</h3>
            <p className="text-slate-500 text-sm mb-4">{report.desc}</p>
            <button className="text-primary-600 font-medium text-sm hover:underline">View Report &rarr;</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
