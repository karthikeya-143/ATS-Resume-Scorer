import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Home, LogOut, Upload } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-300 transition duration-200">
              <FileText className="h-8 w-8" />
              <span className="font-bold text-xl">ATS Scorer</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-1 text-white hover:text-blue-300 transition duration-200">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            {user && (
              <Link to="/upload" className="flex items-center space-x-1 text-white hover:text-blue-300 transition duration-200">
                <Upload className="h-5 w-5" />
                <span>Upload Resume</span>
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-white hover:text-red-300 transition duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-blue-300 transition duration-200">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;