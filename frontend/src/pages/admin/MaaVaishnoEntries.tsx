import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import type { MVEntry } from '../../types';
import { Plus, Search, Filter, Edit, Trash2, Save, Calculator } from 'lucide-react';
import clsx from 'clsx';

const MaaVaishnoEntries = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [entries, setEntries] = useState<MVEntry[]>([]);
  // const [loading, setLoading] = useState(true); // Unused
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const initialFormState = {
    entry_date: new Date().toISOString().split('T')[0],
    from_city: '',
    to_city: '',
    party_name: '',
    transporter_name: '',
    freight: 0,
    advance_paid: 0,
    hamali: 0,
    detention: 0,
    commission: 0,
    party_advance: 0,
    pod_received: false,
    transporter_balance: 0,
    party_balance: 0,
    net_profit: 0
  };

  const [formData, setFormData] = useState<Partial<MVEntry>>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  const fetchEntries = React.useCallback(async () => {
    try {
      // setLoading(true); // Unused
      const { data, error } = await supabase
        .from('mv_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      // setLoading(false); // Unused
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries, view]); // Added fetchEntries dependency

  // ... (Calculation Logic remains same)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        const { error } = await supabase
          .from('mv_entries')
          .update(formData)
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mv_entries')
          .insert([formData]);
        if (error) throw error;
      }

      fetchEntries();
      setView('list');
      setFormData(initialFormState);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Error saving entry');
    }
  };

  const handleEdit = (entry: MVEntry) => {
    setFormData(entry);
    setIsEditing(true);
    setView('form');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const { error } = await supabase.from('mv_entries').delete().eq('id', id);
      if (error) throw error;
      fetchEntries();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maa Vaishno Entries</h1>
          <p className="text-slate-500">Manage Commission & Freight Entries</p>
        </div>
        <button
          onClick={() => {
            setView(view === 'list' ? 'form' : 'list');
            if (view === 'list') {
              setFormData(initialFormState);
              setIsEditing(false);
            }
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          {view === 'list' ? <><Plus size={18} /> New Entry</> : <><Search size={18} /> View List</>}
        </button>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search party, transporter or city..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 text-slate-500 hover:text-primary-600 border border-slate-200 px-4 py-2 rounded-lg">
              <Filter size={18} /> Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Party</th>
                  <th className="px-4 py-3">Transporter</th>
                  <th className="px-4 py-3 text-right">Freight</th>
                  <th className="px-4 py-3 text-right">Commission</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.filter(e =>
                  e.party_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  e.transporter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  e.from_city?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">{entry.entry_date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-700">
                        {entry.from_city} <span className="text-slate-400">→</span> {entry.to_city}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{entry.party_name}</td>
                    <td className="px-4 py-3">{entry.transporter_name}</td>
                    <td className="px-4 py-3 text-right">₹{entry.freight}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">₹{entry.commission}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        entry.pod_received ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {entry.pod_received ? 'POD Recv' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(entry)} className="p-1 hover:bg-white rounded text-blue-600"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(entry.id)} className="p-1 hover:bg-white rounded text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">No entries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Entry Date</label>
              <input
                type="date"
                name="entry_date"
                value={formData.entry_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">From City</label>
              <input
                type="text"
                name="from_city"
                value={formData.from_city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="e.g. Mumbai"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">To City</label>
              <input
                type="text"
                name="to_city"
                value={formData.to_city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="e.g. Delhi"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Party Name</label>
              <input
                type="text"
                name="party_name"
                value={formData.party_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Transporter Name</label>
              <input
                type="text"
                name="transporter_name"
                value={formData.transporter_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div className="h-px bg-slate-100 my-6"></div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calculator size={16} className="text-primary-500" /> Financials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Freight</label>
              <input type="number" name="freight" value={formData.freight} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Advance Paid</label>
              <input type="number" name="advance_paid" value={formData.advance_paid} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Hamali</label>
              <input type="number" name="hamali" value={formData.hamali} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Detention</label>
              <input type="number" name="detention" value={formData.detention} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Commission</label>
              <input type="number" name="commission" value={formData.commission} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Party Advance</label>
              <input type="number" name="party_advance" value={formData.party_advance} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Transporter Balance</p>
                <p className="text-xl font-bold text-slate-800">₹{formData.transporter_balance}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Party Balance</p>
                <p className="text-xl font-bold text-slate-800">₹{formData.party_balance}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Net Profit</p>
                <p className="text-xl font-bold text-green-600">₹{formData.net_profit}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                name="pod_received"
                checked={formData.pod_received}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
              />
              POD Received
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setView('list')}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/30"
            >
              <Save size={18} /> Save Entry
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MaaVaishnoEntries;
