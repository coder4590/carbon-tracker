import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Factory, Zap, BarChart3, LogOut } from 'lucide-react';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/factories', icon: Factory, label: 'Factories' },
  { path: '/emissions', icon: Zap, label: 'Emissions' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-slate-900 text-white flex flex-col">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base">CarbonTracker</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white w-full transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}