import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Inventory } from './pages/Inventory';
import { About } from './pages/About';
import { Booking } from './pages/Booking';
import { AdminAppointments } from './pages/AdminAppointments';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Inventory />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/admin-appointments" element={
                <AdminRoute>
                  <AdminAppointments />
                </AdminRoute>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        
        <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-slate-400 text-sm">
              © 2025 Pneus Express. Projet académique 420-VA9-LP.
            </p>
          </div>
        </footer>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;