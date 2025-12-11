import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => 
    location.pathname === path ? "bg-slate-900 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white";

  return (
    <nav className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-orange-500 font-bold text-2xl tracking-tighter">PNEUS</span>
              <span className="text-white font-semibold text-2xl tracking-tighter italic">EXPRESS</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}>
                  Inventaire
                </Link>
                <Link to="/booking" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/booking')}`}>
                  Réserver
                </Link>
                <Link to="/admin-appointments" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin-appointments')}`}>
                  Admin Rendez-vous
                </Link>
                <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about')}`}>
                  À Propos
                </Link>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <div className="flex space-x-2">
                 <Link to="/" className={`px-2 py-1 rounded-md text-xs font-medium ${isActive('/')}`}>Inventaire</Link>
                 <Link to="/booking" className={`px-2 py-1 rounded-md text-xs font-medium ${isActive('/booking')}`}>Réserver</Link>
                 <Link to="/admin-appointments" className={`px-2 py-1 rounded-md text-xs font-medium ${isActive('/admin-appointments')}`}>Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};