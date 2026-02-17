import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import type { JPLR } from '../../types';
import { Plus, Search, Edit, Trash2, Save, Printer } from 'lucide-react';

const JPCargoLR = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [lrs, setLrs] = useState<JPLR[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const initialFormState = {
    lr_date: new Date().toISOString().split('T')[0],
    from_city: '',
    to_city: '',
    vehicle_no: '',
    consignor: '',
    consignee: '',
    material: '',
    weight: 0,
    eway_bill: '',
    payment_type: 'To Pay', // Default
  };

  const [formData, setFormData] = useState<Partial<JPLR>>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchLRs();
  }, []);

  const fetchLRs = async () => {
    try {
      // setLoading(true);
      const { data, error } = await supabase
        .from('jp_lr')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLrs(data || []);
    } catch (error) {
      console.error('Error fetching LRs:', error);
    } finally {
      // setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        const { error } = await supabase.from('jp_lr').update(formData).eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('jp_lr').insert([formData]);
        if (error) throw error;
      }
      fetchLRs();
      setView('list');
      setFormData(initialFormState);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving LR:', error);
      alert('Error saving LR');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this LR?')) return;
    try {
      const { error } = await supabase.from('jp_lr').delete().eq('id', id);
      if (error) throw error;
      fetchLRs();
    } catch (error) {
      console.error('Error deleting LR:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">JP Cargo LR</h1>
          <p className="text-slate-500">Lorry Receipt Management</p>
        </div>
        <button
          onClick={() => {
            setView(view === 'list' ? 'form' : 'list');
            if (view === 'list') { setFormData(initialFormState); setIsEditing(false); }
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          {view === 'list' ? <><Plus size={18} /> New LR</> : <><Search size={18} /> View List</>}
        </button>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search LR No, Consignor/Consignee..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">LR No</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Consignor → Consignee</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lrs.filter(l =>
                  l.lr_number?.toString().includes(searchTerm) ||
                  l.consignor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  l.consignee?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((lr) => (
                  <tr key={lr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-primary-700">#{lr.lr_number}</td>
                    <td className="px-4 py-3">{lr.lr_date}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{lr.vehicle_no}</td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700">{lr.consignor}</div>
                      <div className="text-slate-400 text-xs">to {lr.consignee}</div>
                    </td>
                    <td className="px-4 py-3">{lr.material} ({lr.weight}kg)</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 hover:bg-white rounded text-slate-600" title="Print"><Printer size={16} /></button>
                        <button onClick={() => { setFormData(lr); setIsEditing(true); setView('form'); }} className="p-1 hover:bg-white rounded text-blue-600"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(lr.id)} className="p-1 hover:bg-white rounded text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {lrs.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No LRs found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">LR Date</label>
              <input type="date" name="lr_date" value={formData.lr_date} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Vehicle No</label>
              <input type="text" name="vehicle_no" value={formData.vehicle_no} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100" placeholder="MH-XX-XX-XXXX" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Payment Type</label>
              <select name="payment_type" value={formData.payment_type} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100">
                <option>To Pay</option>
                <option>Paid</option>
                <option>TBB</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Consignor (Sender)</label>
              <input type="text" name="consignor" value={formData.consignor} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Consignee (Receiver)</label>
              <input type="text" name="consignee" value={formData.consignee} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">E-Way Bill No</label>
              <input type="text" name="eway_bill" value={formData.eway_bill} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">From City</label>
              <input type="text" name="from_city" value={formData.from_city} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">To City</label>
              <input type="text" name="to_city" value={formData.to_city} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Material Description</label>
              <input type="text" name="material" value={formData.material} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Weight (Kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setView('list')} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/30"><Save size={18} /> Save LR</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default JPCargoLR;
