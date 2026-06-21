import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar - fixed width, no shrink */}
      <aside className="w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main content - takes remaining space */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}