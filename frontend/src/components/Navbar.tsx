import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, BarChart2 } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">FamilyMoneyTracker</div>
      <div className="nav-links">
        <Link to="/"><Home size={20} /> Dashboard</Link>
        {user.role === 'admin' && (
          <Link to="/admin"><BarChart2 size={20} /> Admin Analytics</Link>
        )}
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} /> Logout ({user.username})
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
