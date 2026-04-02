import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { DollarSign, LogOut, ArrowLeft, TrendingUp } from 'lucide-react';

export default function AdminFinancial() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-700" />
              <h1 className="text-2xl font-bold text-amber-800">Manajemen Keuangan</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm mb-2">Pendapatan Bulan Ini</div>
            <div className="text-3xl font-bold text-green-600">Rp 0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm mb-2">Pengeluaran Bulan Ini</div>
            <div className="text-3xl font-bold text-red-600">Rp 0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm mb-2">Laba Bersih</div>
            <div className="text-3xl font-bold text-blue-600">Rp 0</div>
          </div>
        </div>

        {/* Add Expense Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Tambah Pengeluaran</h2>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Kategori" className="input-field" />
            <input type="number" placeholder="Jumlah" className="input-field" />
            <input type="text" placeholder="Deskripsi" className="input-field" />
            <button type="submit" className="btn-primary">Tambah</button>
          </form>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Riwayat Keuangan</h2>
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Tidak ada riwayat keuangan</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Tanggal</th>
                    <th className="text-left py-2 px-4">Kategori</th>
                    <th className="text-left py-2 px-4">Deskripsi</th>
                    <th className="text-left py-2 px-4">Jumlah</th>
                    <th className="text-left py-2 px-4">Tipe</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state */}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
