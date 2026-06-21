import { useState } from 'react';
import { reportAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, BarChart3 } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Reports() {
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await reportAPI.getReport({
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
      });
      setReport(res.data);
    } catch (err) {
      console.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!report) return;
    let csv = 'Factory Name,Total Emissions (kgCO2),Record Count,Period Start,Period End\n';
    report.summaries.forEach((s) => {
      csv += `"${s.factory_name}",${s.total_emissions},${s.record_count},${s.period_start},${s.period_end}\n`;
    });
    csv += `\nOverall Total,,${report.overall_total_emissions}\n`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emissions-report-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Reports</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button onClick={generateReport} disabled={loading}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          {report && (
            <button onClick={exportCSV}
              className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 flex items-center gap-2">
              <Download className="w-5 h-5" /> Export CSV
            </button>
          )}
        </div>
      </div>

      {report && (
        <>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Report Summary</h2>
            <p className="text-3xl font-bold text-emerald-600">{report.overall_total_emissions.toFixed(2)} kgCO2</p>
            <p className="text-sm text-slate-500">Total emissions from {report.summaries.length} factories</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Emissions by Factory</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report.summaries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="factory_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_emissions" fill="#10b981" name="kgCO2" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={report.summaries} dataKey="total_emissions" nameKey="factory_name" cx="50%" cy="50%" outerRadius={100} label>
                    {report.summaries.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Breakdown</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b">
                  <th className="pb-3">Factory</th>
                  <th className="pb-3">Records</th>
                  <th className="pb-3">Total Emissions</th>
                  <th className="pb-3">Period</th>
                </tr>
              </thead>
              <tbody>
                {report.summaries.map((s, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 font-medium text-slate-900">{s.factory_name}</td>
                    <td className="py-3 text-slate-600">{s.record_count}</td>
                    <td className="py-3 text-emerald-600 font-medium">{s.total_emissions.toFixed(2)} kgCO2</td>
                    <td className="py-3 text-sm text-slate-500">
                      {new Date(s.period_start).toLocaleDateString()} - {new Date(s.period_end).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!report && !loading && (
        <div className="text-center py-16 text-slate-400">
          <BarChart3 className="w-20 h-20 mx-auto mb-4" />
          <p className="text-lg">Select a date range and generate a report</p>
        </div>
      )}
    </div>
  );
}