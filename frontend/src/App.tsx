import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IncomeManager from './pages/IncomeManager';
import ExpenseManager from './pages/ExpenseManager';
import Reports from './pages/Reports';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/income" element={user ? <IncomeManager /> : <Navigate to="/login" />} />
        <Route path="/expenses" element={user ? <ExpenseManager /> : <Navigate to="/login" />} />
        <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
