import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => 
    location.pathname === path ? "bg-slate-900 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white";

  const handleSignOut = async () => {
    await signOut();
  };

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
                  {user && !isAdmin ? 'Catalogue' : 'Inventaire'}
                </Link>
                <Link to="/booking" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/booking')}`}>
                  {user && !isAdmin ? 'Mes Réservations' : 'Réserver'}
                </Link>
                {user && isAdmin && (
                  <Link to="/admin-appointments" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin-appointments')}`}>
                    Admin Rendez-vous
                  </Link>
                )}
                <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about')}`}>
                  À Propos
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-slate-300 text-sm hidden md:block">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/login')}`}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <div className="flex space-x-2">
                 <Link to="/" className={`px-2 py-1 rounded-md text-xs font-medium ${isActive('/')}`}>
                   {user && !isAdmin ? 'Catalogue' : 'Inventaire'}
                 </Link>
                 {user && isAdmin && (
                   <Link to="/admin-appointments" className={`px-2 py-1 rounded-md text-xs font-medium ${isActive('/admin-appointments')}`}>Admin</Link>
                 )}
                 {user ? (
                   <button
                     onClick={handleSignOut}
                     className="px-2 py-1 rounded-md text-xs font-medium bg-orange-600 text-white"
                   >
                     Sortir
                   </button>
                 ) : (
                   <Link to="/login" className={`px-2 py-1 rounded-md text-xs font-medium bg-orange-600 text-white`}>Connexion</Link>
                 )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};