import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import StaffLogin from './pages/StaffLogin';
import SuperAdminLogin from './pages/SuperAdminLogin';
import BookingPage from './pages/BookingPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-luxury-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/superadmin-login" element={<SuperAdminLogin />} />
            <Route path="/book" element={<BookingPage />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
