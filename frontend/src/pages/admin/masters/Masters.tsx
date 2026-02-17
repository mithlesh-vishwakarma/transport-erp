import { useState, useEffect } from 'react';
import { masterService } from '../../../services/masterService';
import MasterTable from '../../../components/masters/MasterTable';
import MasterForm from '../../../components/masters/MasterForm';
import { MASTER_CONFIG } from './config';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

const Masters = () => {
  const [activeTab, setActiveTab] = useState('countries');
  const [data, setData] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [config, setConfig] = useState(MASTER_CONFIG['countries']);

  // Lookups for selects
  const [lookups, setLookups] = useState<any>({});

  const fetchData = async () => {
    try {
      const result = await masterService.getAll(activeTab);
      setData(result || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchLookups = async () => {
    // Fetch dependencies for dropdowns based on active tab
    try {
      if (activeTab === 'states') {
        const countries = await masterService.getAll('countries');
        setLookups({ ...lookups, countries });
      } else if (activeTab === 'cities') {
        const states = await masterService.getAll('states');
        setLookups({ ...lookups, states });
      } else if (activeTab === 'transporters') {
        const cities = await masterService.getAll('cities');
        setLookups({ ...lookups, cities });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setConfig(MASTER_CONFIG[activeTab]);
    fetchData();
    fetchLookups();
    setView('list');
  }, [activeTab]);

  const handleSave = async (formData: any) => {
    try {
      if (currentEntry) {
        await masterService.update(activeTab, currentEntry.id, formData);
      } else {
        await masterService.create(activeTab, formData);
      }
      fetchData();
      setView('list');
      setCurrentEntry(null);
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save record");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await masterService.delete(activeTab, id);
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    }
  };

  // Prepare fields with options
  const getFieldsWithOptions = () => {
    return config.fields.map(field => {
      if (field.name === 'country_id' && lookups.countries) {
        return { ...field, options: lookups.countries.map((c: any) => ({ value: c.id, label: c.name })) };
      }
      if (field.name === 'state_id' && lookups.states) {
        return { ...field, options: lookups.states.map((s: any) => ({ value: s.id, label: s.name })) };
      }
      if (field.name === 'city_id' && lookups.cities) {
        return { ...field, options: lookups.cities.map((c: any) => ({ value: c.id, label: c.name })) };
      }
      return field;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Masters</h1>
          <p className="text-slate-500">Manage System Master Data</p>
        </div>
        {view === 'list' && (
          <button
            onClick={() => { setCurrentEntry(null); setView('form'); }}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} /> Add New
          </button>
        )}
      </div>

      {/* Tabs */}
      {view === 'list' && (
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-max mb-4">
          {Object.keys(MASTER_CONFIG).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={clsx(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {MASTER_CONFIG[key].label}
            </button>
          ))}
        </div>
      )}

      {view === 'list' ? (
        <MasterTable
          data={data}
          columns={config.columns}
          onEdit={(item) => { setCurrentEntry(item); setView('form'); }}
          onDelete={handleDelete}
        />
      ) : (
        <MasterForm
          title={`${currentEntry ? 'Edit' : 'Add'} ${config.label}`}
          fields={getFieldsWithOptions()}
          initialData={currentEntry}
          onSubmit={handleSave}
          onCancel={() => setView('list')}
        />
      )}
    </div>
  );
};

export default Masters;
