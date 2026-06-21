import { useState, useEffect } from 'react';
import { emissionFactorAPI, emissionRecordAPI, factoryAPI } from '../services/api';
import { Zap, Plus, Upload, Trash2 } from 'lucide-react';

export default function Emissions() {
  const [factories, setFactories] = useState([]);
  const [factors, setFactors] = useState([]);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [showFactorForm, setShowFactorForm] = useState(false);
  const [message, setMessage] = useState('');
  const [recordForm, setRecordForm] = useState({
    factory_id: '',
    emission_factor_id: '',
    quantity: '',
    record_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [factorForm, setFactorForm] = useState({
    name: '',
    category: '',
    unit: '',
    value: '',
    source: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [fRes, facRes] = await Promise.all([emissionFactorAPI.getAll(), factoryAPI.getAll()]);
      setFactors(fRes.data);
      setFactories(facRes.data);
    } catch (err) { console.error('Failed to load data'); }
  };

  const handleDeleteFactor = async (id) => {
    if (!confirm('Delete this factor?')) return;
    try { await emissionFactorAPI.delete(id); loadData(); setMessage('Factor deleted!'); setTimeout(() => setMessage(''), 3000); }
    catch (err) { setMessage('Error deleting factor'); }
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      await emissionRecordAPI.create({ ...recordForm, factory_id: parseInt(recordForm.factory_id), emission_factor_id: parseInt(recordForm.emission_factor_id), quantity: parseFloat(recordForm.quantity), record_date: new Date(recordForm.record_date).toISOString() });
      setMessage('Record created!'); setShowRecordForm(false);
      setRecordForm({ factory_id: '', emission_factor_id: '', quantity: '', record_date: new Date().toISOString().split('T')[0], notes: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage('Error creating record'); }
  };

  const handleFactorSubmit = async (e) => {
    e.preventDefault();
    try {
      await emissionFactorAPI.create({ ...factorForm, value: parseFloat(factorForm.value) });
      setMessage('Factor created!'); setShowFactorForm(false);
      setFactorForm({ name: '', category: '', unit: '', value: '', source: '' });
      loadData(); setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage('Error creating factor'); }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try { const res = await emissionRecordAPI.uploadCSV(file); setMessage(`${res.data.created} records imported!`); loadData(); setTimeout(() => setMessage(''), 5000); }
    catch (err) { setMessage('Error uploading CSV'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Emissions</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowFactorForm(!showFactorForm)} className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700"><Plus className="w-5 h-5" /> Add Factor</button>
          <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"><Upload className="w-5 h-5" /> Upload CSV<input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" /></label>
          <button onClick={() => setShowRecordForm(!showRecordForm)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"><Zap className="w-5 h-5" /> Record Emission</button>
        </div>
      </div>

      {message && <div className={`p-3 rounded-lg mb-4 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{message}</div>}

      {showFactorForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">New Emission Factor</h2>
          <form onSubmit={handleFactorSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Name *</label><input type="text" value={factorForm.name} onChange={(e) => setFactorForm({ ...factorForm, name: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Category *</label><input type="text" value={factorForm.category} onChange={(e) => setFactorForm({ ...factorForm, category: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="energy, fuel..." required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Unit *</label><input type="text" value={factorForm.unit} onChange={(e) => setFactorForm({ ...factorForm, unit: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="kgCO2/kWh" required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Value *</label><input type="number" step="0.01" value={factorForm.value} onChange={(e) => setFactorForm({ ...factorForm, value: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Source</label><input type="text" value={factorForm.source} onChange={(e) => setFactorForm({ ...factorForm, source: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="EPA, IPCC..." /></div>
            <div className="md:col-span-2 flex gap-3"><button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">Save Factor</button><button type="button" onClick={() => setShowFactorForm(false)} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300">Cancel</button></div>
          </form>
        </div>
      )}

      {showRecordForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Record Emission</h2>
          <form onSubmit={handleRecordSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Factory *</label><select value={recordForm.factory_id} onChange={(e) => setRecordForm({ ...recordForm, factory_id: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" required><option value="">Select factory...</option>{factories.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Emission Factor *</label><select value={recordForm.emission_factor_id} onChange={(e) => setRecordForm({ ...recordForm, emission_factor_id: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" required><option value="">Select factor...</option>{factors.map((f) => <option key={f.id} value={f.id}>{f.name} ({f.value} {f.unit})</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Quantity *</label><input type="number" step="0.01" value={recordForm.quantity} onChange={(e) => setRecordForm({ ...recordForm, quantity: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Date *</label><input type="date" value={recordForm.record_date} onChange={(e) => setRecordForm({ ...recordForm, record_date: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Notes</label><textarea value={recordForm.notes} onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" rows={2} /></div>
            <div className="md:col-span-2 flex gap-3"><button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">Save Record</button><button type="button" onClick={() => setShowRecordForm(false)} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300">Cancel</button></div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Emission Factors ({factors.length})</h3>
          {factors.length === 0 ? <p className="text-slate-400 text-center py-8">No emission factors yet</p> : (
            <div className="space-y-3">
              {factors.map((factor) => (
                <div key={factor.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div><p className="font-medium text-slate-900">{factor.name}</p><p className="text-sm text-slate-500">{factor.category}</p></div>
                  <div className="flex items-center gap-3">
                    <div className="text-right"><p className="font-semibold text-emerald-600">{factor.value}</p><p className="text-xs text-slate-400">{factor.unit}</p></div>
                    <button onClick={() => handleDeleteFactor(factor.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Factories ({factories.length})</h3>
          {factories.length === 0 ? <p className="text-slate-400 text-center py-8">No factories yet</p> : (
            <div className="space-y-3">
              {factories.map((factory) => (
                <div key={factory.id} className="p-3 bg-slate-50 rounded-lg"><p className="font-medium text-slate-900">{factory.name}</p><p className="text-sm text-slate-500">{factory.location || 'No location'}</p></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}