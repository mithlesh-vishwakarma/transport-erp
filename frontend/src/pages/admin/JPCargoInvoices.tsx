import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import type { JPInvoice, JPLR } from '../../types';
import { Plus, Search, Edit, Save, Receipt, Link as LinkIcon } from 'lucide-react';

const JPCargoInvoices = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [invoices, setInvoices] = useState<JPInvoice[]>([]);
  const [lrs, setLrs] = useState<JPLR[]>([]); // For dropdown

  const initialFormState = {
    invoice_date: new Date().toISOString().split('T')[0],
    party_name: '',
    lr_id: '',
    freight: 0,
    hamali: 0,
    detention: 0,
    other: 0,
    total: 0,
  };

  const [formData, setFormData] = useState<Partial<JPInvoice>>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchLRs();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('jp_invoices')
        .select('*, lr:jp_lr(lr_number, consignor, consignee)') // Join to get LR details
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchLRs = async () => {
    try {
      const { data } = await supabase.from('jp_lr').select('*').order('lr_number', { ascending: false });
      setLrs(data || []);
    } catch (error) { console.error(error); }
  };

  const handleLRSelect = (lrId: string) => {
    const lr = lrs.find(l => l.id === lrId);
    if (lr) {
      setFormData(prev => ({
        ...prev,
        lr_id: lrId,
        party_name: lr.consignor, // Defaulting to consignor as party
        // You might want to copy freight/charges if they existed in LR, but LR table didn't have commercial values in the schema provided.
      }));
    } else {
      setFormData(prev => ({ ...prev, lr_id: lrId }));
    }
  };

  // Auto-calculate Total
  useEffect(() => {
    const total = (Number(formData.freight) || 0) +
      (Number(formData.hamali) || 0) +
      (Number(formData.detention) || 0) +
      (Number(formData.other) || 0);
    setFormData(prev => ({ ...prev, total }));
  }, [formData.freight, formData.hamali, formData.detention, formData.other]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'lr_id') {
      handleLRSelect(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        const { error } = await supabase.from('jp_invoices').update(formData).eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('jp_invoices').insert([formData]);
        if (error) throw error;
      }
      fetchInvoices();
      setView('list');
      setFormData(initialFormState);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">JP Cargo Invoices</h1>
          <p className="text-slate-500">Generate & Manage Invoices</p>
        </div>
        <button onClick={() => { setView(view === 'list' ? 'form' : 'list'); if (view === 'list') { setFormData(initialFormState); setIsEditing(false); } }} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          {view === 'list' ? <><Plus size={18} /> New Invoice</> : <><Search size={18} /> View List</>}
        </button>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Inv No</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Party Name</th>
                  <th className="px-4 py-3">LR No</th>
                  <th className="px-4 py-3 text-right">Total Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold">#{inv.invoice_number}</td>
                    <td className="px-4 py-3">{inv.invoice_date}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{inv.party_name}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {inv.lr ? `LR #${inv.lr.lr_number}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">₹{inv.total}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 hover:bg-white rounded text-slate-600" title="Download PDF"><Receipt size={16} /></button>
                        <button onClick={() => { setFormData(inv); setIsEditing(true); setView('form'); }} className="p-1 hover:bg-white rounded text-blue-600"><Edit size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Link LR (Optional)</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select name="lr_id" value={formData.lr_id} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 appearance-none">
                  <option value="">-- Select LR --</option>
                  {lrs.map(lr => (
                    <option key={lr.id} value={lr.id}>#{lr.lr_number} - {lr.consignor} to {lr.consignee}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Invoice Date</label>
              <input type="date" name="invoice_date" value={formData.invoice_date} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Party Name</label>
              <input type="text" name="party_name" value={formData.party_name} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>
          </div>

          <div className="h-px bg-slate-100 my-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Freight</label>
              <input type="number" name="freight" value={formData.freight} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
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
              <label className="text-sm font-medium text-slate-700">Other Charges</label>
              <input type="number" name="other" value={formData.other} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
            <span className="font-semibold text-slate-600">Total Invoice Amount</span>
            <span className="text-2xl font-bold text-primary-600">₹{formData.total}</span>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setView('list')} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/30"><Save size={18} /> Generate Invoice</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default JPCargoInvoices;
