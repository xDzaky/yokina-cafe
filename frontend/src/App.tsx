import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminFinancial from './pages/admin/Financial';
import CustomerHome from './pages/customer/Home';
import CustomerOrders from './pages/customer/Orders';
import CustomerLoyalty from './pages/customer/Loyalty';

import './index.css';

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{element}</>;
};

function App() {
  const loadAuthFromStorage = useAuthStore((state) => state.loadAuthFromStorage);

  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
        />
        <Route
          path="/admin/orders"
          element={<ProtectedRoute element={<AdminOrders />} requiredRole="admin" />}
        />
        <Route
          path="/admin/financial"
          element={<ProtectedRoute element={<AdminFinancial />} requiredRole="admin" />}
        />

        {/* Customer Routes */}
        <Route
          path="/customer/home"
          element={<ProtectedRoute element={<CustomerHome />} requiredRole="customer" />}
        />
        <Route
          path="/customer/orders"
          element={<ProtectedRoute element={<CustomerOrders />} requiredRole="customer" />}
        />
        <Route
          path="/customer/loyalty"
          element={<ProtectedRoute element={<CustomerLoyalty />} requiredRole="customer" />}
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
