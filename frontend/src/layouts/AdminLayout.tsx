import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  FileText,
  Receipt,
  Wallet,
  BarChart3,
  LogOut,
  User,
  Menu,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'MV Entries', path: '/admin/entries', icon: Truck }, // Maa Vaishno
    { name: 'JP Cargo LR', path: '/admin/lr', icon: FileText },
    { name: 'JP Invoices', path: '/admin/invoices', icon: Receipt },
    { name: 'Expenses', path: '/admin/expenses', icon: Wallet },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Masters', path: '/admin/masters', icon: Database }, // New
  ];

  /* State for mobile vs desktop check could be useful, or just use CSS classes */
  /* We'll use CSS to handle layout changes */

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/50 z-20 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col z-30",
          // Mobile: fixed, full height, slide in/out
          "fixed inset-y-0 left-0 h-full",
          // Desktop: relative, varied width
          "md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <Truck size={20} className="text-white" />
            </div>
            {isSidebarOpen && (
              <span className="text-lg font-bold tracking-tight">Transport<span className="text-primary-400">ERP</span></span>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              title={!isSidebarOpen ? item.name : ''}
              className={clsx(
                "flex items-center px-3 py-3 rounded-lg transition-colors group relative",
                location.pathname === item.path
                  ? "bg-primary-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
              onClick={() => {
                // Close sidebar on mobile when a link is clicked
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
            >
              <item.icon size={20} className={clsx("flex-shrink-0", isSidebarOpen && "mr-3")} />
              {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}

              {!isSidebarOpen && (
                <div className="hidden md:block absolute left-full ml-2 w-max bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.name}
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleSignOut}
            className={clsx(
              "flex items-center w-full px-2 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors",
              !isSidebarOpen && "md:justify-center"
            )}
            title="Sign Out"
          >
            <LogOut size={20} className={clsx(isSidebarOpen && "mr-3")} />
            {isSidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10 w-full">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <User size={18} />
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Scrollable */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
