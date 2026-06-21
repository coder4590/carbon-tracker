import { useState, useEffect } from 'react';
import { factoryAPI } from '../services/api';
import { Plus, Building2, Trash2 } from 'lucide-react';

export default function Factories() {
  const [factories, setFactories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', industry_type: '', annual_capacity: '', emission_limit: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadFactories(); }, []);

  const loadFactories = async () => {
    try {
      const res = await factoryAPI.getAll();
      setFactories(res.data);
    } catch (err) { console.error('Failed to load factories'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this factory?')) return;
    try { await factoryAPI.delete(id); loadFactories(); }
    catch (err) { console.error('Failed to delete'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await factoryAPI.create({ ...formData, annual_capacity: parseFloat(formData.annual_capacity) || null, emission_limit: parseFloat(formData.emission_limit) || 0 });
      setShowForm(false);
      setFormData({ name: '', location: '', industry_type: '', annual_capacity: '', emission_limit: '' });
      loadFactories();
    } catch (err) { console.error('Failed to create factory'); }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Factories</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
          <Plus className="w-5 h-5" /> Add Factory
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">New Factory</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Industry Type</label><input type="text" value={formData.industry_type} onChange={(e) => setFormData({ ...formData, industry_type: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="manufacturing, chemical..." /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Annual Capacity</label><input type="number" value={formData.annual_capacity} onChange={(e) => setFormData({ ...formData, annual_capacity: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Emission Limit (kgCO2)</label><input type="number" value={formData.emission_limit} onChange={(e) => setFormData({ ...formData, emission_limit: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="50000" /></div>
            <div className="md:col-span-2 flex gap-3"><button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">Save</button><button type="button" onClick={() => setShowForm(false)} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300">Cancel</button></div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {factories.map((factory) => (
          <div key={factory.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow relative">
            <button onClick={() => handleDelete(factory.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-emerald-100 rounded-lg"><Building2 className="w-5 h-5 text-emerald-600" /></div><h3 className="font-semibold text-slate-900">{factory.name}</h3></div>
            <div className="space-y-2 text-sm text-slate-600">{factory.location && <p>📍 {factory.location}</p>}{factory.industry_type && <p>🏭 {factory.industry_type}</p>}{factory.annual_capacity && <p>📊 Capacity: {factory.annual_capacity}</p>}</div>
          </div>
        ))}
      </div>

      {factories.length === 0 && <div className="text-center py-12 text-slate-400"><Building2 className="w-16 h-16 mx-auto mb-4" /><p className="text-lg">No factories yet. Add your first factory!</p></div>}
    </div>
  );
}