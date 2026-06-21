import { useState, useEffect, useCallback } from 'react';
import { reportAPI } from '../services/api';
import { Factory, Cloud, Activity, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Dashboard() {
  const [summary, setSummary] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await reportAPI.getSummary();
      setSummary(res.data);
      const trendsRes = await reportAPI.getTrends();
      setTrends(trendsRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => loadData(), 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  const totalFactories = summary.length;
  const totalEmissions = summary.reduce((sum, f) => sum + f.total_emissions, 0);
  const avgEmissions = totalFactories > 0 ? totalEmissions / totalFactories : 0;
  const pieData = summary.map((f) => ({ name: f.name, value: f.total_emissions }));
  const highestEmitter = summary.length > 0 
    ? summary.reduce((max, f) => f.total_emissions > max.total_emissions ? f : max, summary[0])
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time emissions overview</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-slate-400">Updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              autoRefresh ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} style={autoRefresh ? {animationDuration: '3s'} : {}} />
            {autoRefresh ? 'Live' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
              <Factory className="w-6 h-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-slate-500">Factories</p>
              <p className="text-2xl font-bold text-slate-900">{totalFactories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl flex-shrink-0">
              <Cloud className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-slate-500">Total Emissions</p>
              <p className="text-2xl font-bold text-slate-900">{totalEmissions.toFixed(0)}</p>
              <p className="text-xs text-slate-400">kgCO2</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl flex-shrink-0">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-slate-500">Avg per Factory</p>
              <p className="text-2xl font-bold text-slate-900">{avgEmissions.toFixed(0)}</p>
              <p className="text-xs text-slate-400">kgCO2</p>
            </div>
          </div>
        </div>

          <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
  summary.filter(f => f.status === 'exceeded').length > 0 
    ? 'border-red-400' 
    : 'border-emerald-400'
}`}>
  <div className="flex items-center gap-4">
    <div className={`p-3 rounded-xl flex-shrink-0 ${
      summary.filter(f => f.status === 'exceeded').length > 0 
        ? 'bg-red-100' 
        : 'bg-emerald-100'
    }`}>
      <span className="text-xl">
        {summary.filter(f => f.status === 'exceeded').length > 0 ? '🔴' : '🟢'}
      </span>
    </div>
    <div className="min-w-0">
      <p className="text-sm text-slate-500">Alerts</p>
      <p className="text-2xl font-bold text-slate-900">
        {summary.filter(f => f.status === 'exceeded').length}
      </p>
      <p className="text-xs text-slate-400">Over limit</p>
    </div>
  </div>
</div>
      </div>
{/* Alert Banners */}
{summary.filter(f => f.status === 'exceeded').length > 0 && (
  <div className="mb-8 space-y-3">
    {summary.filter(f => f.status === 'exceeded').map((f, i) => (
      <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-red-800">{f.name}</p>
            <p className="text-sm text-red-600">
              Emissions: {f.total_emissions.toFixed(0)} kgCO2 
              (Limit: {f.emission_limit.toFixed(0)} kgCO2)
            </p>
          </div>
        </div>
        <span className="text-red-500 text-sm font-medium">
          {((f.total_emissions / f.emission_limit) * 100 - 100).toFixed(0)}% over limit
        </span>
      </div>
    ))}
  </div>
)}
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Emissions Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-center py-12">No data yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Factory Comparison</h3>
          {summary.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total_emissions" fill="#10b981" name="kgCO2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-center py-12">No data yet</p>
          )}
        </div>
      </div>
      {/* Trend Chart */}
<div className="bg-white rounded-xl shadow-sm p-6 mb-8">
  <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Emission Trends</h3>
  {trends.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={trends}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month_name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="total_emissions" 
          stroke="#10b981" 
          strokeWidth={2}
          name="kgCO2"
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <p className="text-slate-400 text-center py-12">Add more records across different months to see trends</p>
  )}
</div>
      {/* Table */}
      {summary.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">All Factories</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b">
                  <th className="pb-3 font-medium">Factory</th>
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium text-right">Emissions</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((f, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-900">{f.name}</td>
                    <td className="py-3 text-slate-600">{f.location || '—'}</td>
                    <td className="py-3 text-slate-600">{f.industry_type || '—'}</td>
                    <td className="py-3 text-right font-medium text-emerald-600">{f.total_emissions.toFixed(0)} kgCO2</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}