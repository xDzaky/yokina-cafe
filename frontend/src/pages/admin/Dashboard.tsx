import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { adminApi } from '../../api';
import {
  LogOut,
  BarChart3,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // Menggunakan outlet_id default, dalam praktik sebenarnya harus dari user
        const response = await adminApi.getDashboard('default-outlet-id');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const today = dashboardData?.today || {};
  const monthly = dashboardData?.monthly || {};

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } relative bg-amber-900 text-white transition-all duration-300 shadow-lg`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold">Yokina Admin</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-amber-800 rounded">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-2">
          <NavItem
            icon={<BarChart3 className="w-5 h-5" />}
            label="Dashboard"
            sidebarOpen={sidebarOpen}
            active={true}
            onClick={() => navigate('/admin/dashboard')}
          />
          <NavItem
            icon={<ShoppingCart className="w-5 h-5" />}
            label="Pesanan"
            sidebarOpen={sidebarOpen}
            onClick={() => navigate('/admin/orders')}
          />
          <NavItem
            icon={<DollarSign className="w-5 h-5" />}
            label="Keuangan"
            sidebarOpen={sidebarOpen}
            onClick={() => navigate('/admin/financial')}
          />
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Selamat datang kembali, {user?.name}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Pendapatan Hari Ini"
              value={`Rp ${(today?.total_income || 0).toLocaleString('id-ID')}`}
              icon={<TrendingUp className="w-8 h-8 text-green-600" />}
              color="green"
            />
            <StatCard
              title="Pengeluaran Hari Ini"
              value={`Rp ${(today?.total_expense || 0).toLocaleString('id-ID')}`}
              icon={<DollarSign className="w-8 h-8 text-red-600" />}
              color="red"
            />
            <StatCard
              title="Laba Bersih Hari Ini"
              value={`Rp ${(today?.net_profit || 0).toLocaleString('id-ID')}`}
              icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
              color="blue"
            />
            <StatCard
              title="Jumlah Pesanan"
              value={today?.order_count || 0}
              icon={<ShoppingCart className="w-8 h-8 text-orange-600" />}
              color="orange"
            />
          </div>

          {/* Monthly Report */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Laporan Bulanan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-gray-600 text-sm">Total Pendapatan</p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {(monthly?.total_income || 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <p className="text-gray-600 text-sm">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-red-600">
                  Rp {(monthly?.total_expense || 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-600 text-sm">Laba Bersih</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rp {(monthly?.net_profit || 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  sidebarOpen: boolean;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, sidebarOpen, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
        active
          ? 'bg-amber-700 text-white'
          : 'hover:bg-amber-800 text-amber-50'
      }`}
    >
      {icon}
      {sidebarOpen && <span>{label}</span>}
    </button>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const bgColor = {
    green: 'bg-green-50',
    red: 'bg-red-50',
    blue: 'bg-blue-50',
    orange: 'bg-orange-50',
  }[color];

  return (
    <div className={`${bgColor} rounded-lg shadow p-6 border-l-4 border-${color}-500`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}
