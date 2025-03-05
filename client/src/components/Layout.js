// client/src/components/Layout.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import logo from '../assets/logo.png';

const Layout = ({ children }) => {
  const { user, logout: doLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await doLogout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white flex justify-between items-center shadow-md">
        <div className='flex items-center'>
            <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
            <Link to="/" className="text-xl font-semibold hover:text-blue-200 transition-colors duration-200">Online Compiler</Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link to="/profile" className="hover:text-blue-200 transition-colors duration-200">Profile</Link>
          <Link to="/history" className="hover:text-blue-200 transition-colors duration-200">History</Link>
          <span onClick={handleLogout} className="cursor-pointer hover:text-red-300 transition-colors duration-200">Logout</span>
        </nav>
      </header>
      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;