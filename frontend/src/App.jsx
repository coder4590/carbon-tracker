import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Factories from './pages/Factories';
import Emissions from './pages/Emissions';
import Reports from './pages/Reports';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="factories" element={<Factories />} />
        <Route path="emissions" element={<Emissions />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}