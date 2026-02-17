import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import type { Expense } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

const Expenses = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const initialFormState = {
    expense_date: new Date().toISOString().split('T')[0],
    expense_type: 'Fuel',
    note: '',
    amount: 0,
  };

  const [formData, setFormData] = useState<Partial<Expense>>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setExpenses(data || []);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        await supabase.from('expenses').update(formData).eq('id', formData.id);
      } else {
        await supabase.from('expenses').insert([formData]);
      }
      fetchExpenses();
      setView('list');
      setFormData(initialFormState);
      setIsEditing(false);
    } catch { alert('Error saving expense'); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete expense?')) {
      await supabase.from('expenses').delete().eq('id', id);
      fetchExpenses();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Expenses</h1>
          <p className="text-slate-500">Track Daily Expenses</p>
        </div>
        <button onClick={() => setView(view === 'list' ? 'form' : 'list')} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          {view === 'list' ? <><Plus size={18} /> New Expense</> : 'View List'}
        </button>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Note</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td className="px-4 py-3">{exp.expense_date}</td>
                  <td className="px-4 py-3"><span className="bg-slate-100 px-2 py-1 rounded text-slate-700">{exp.expense_type}</span></td>
                  <td className="px-4 py-3 text-slate-500">{exp.note}</td>
                  <td className="px-4 py-3 text-right font-medium">₹{exp.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(exp.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input type="date" value={formData.expense_date} onChange={e => setFormData({ ...formData, expense_date: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select value={formData.expense_type} onChange={e => setFormData({ ...formData, expense_type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option>Fuel</option>
                <option>Office</option>
                <option>Salary</option>
                <option>Maintenance</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
              <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Note</label>
              <input type="text" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium">Save Expense</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Expenses;
