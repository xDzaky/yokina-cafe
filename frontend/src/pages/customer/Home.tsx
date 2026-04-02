import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { ShoppingBag, LogOut, Home, Gift, Coffee } from 'lucide-react';

export default function CustomerHome() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const categories = [
    { id: 'coffee', name: 'Kopi', icon: '☕' },
    { id: 'food', name: 'Makanan', icon: '🍰' },
    { id: 'snacks', name: 'Snack', icon: '🍪' },
    { id: 'drinks', name: 'Minuman', icon: '🥤' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Coffee className="w-6 h-6 text-amber-700" />
              <h1 className="text-2xl font-bold text-amber-800">Yokina Cafe</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-semibold text-gray-800">Poin: 2,500</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/customer/loyalty')}
                  className="btn-secondary text-sm"
                >
                  Loyalitas
                </button>
                <button onClick={handleLogout} className="btn-primary text-sm">
                  Logout
                </button>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Selamat datang kembali, {user?.name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Order Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <OrderMethodCard
            icon="🏪"
            title="Tempat"
            description="Makan di tempat"
            onClick={() => navigate('/customer/orders')}
          />
          <OrderMethodCard
            icon="🛍️"
            title="Takeaway"
            description="Ambil ke outlet"
            onClick={() => navigate('/customer/orders')}
          />
          <OrderMethodCard
            icon="📱"
            title="WhatsApp"
            description="Order via WhatsApp"
            onClick={() => window.open('https://wa.me/62812345678')}
          />
          <OrderMethodCard
            icon="🚚"
            title="Delivery"
            description="Pesan via platform"
            onClick={() => window.open('https://gofood.co.id')}
          />
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu Kami</h2>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition ${
                selectedCategory === null
                  ? 'bg-amber-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sample Products */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition">
                <div className="bg-gradient-to-br from-amber-200 to-orange-200 h-32 flex items-center justify-center text-4xl">
                  ☕
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1">Menu Item {i}</h3>
                  <p className="text-gray-600 text-sm mb-3">Deskripsi produk</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-amber-700">Rp 25.000</span>
                    <button className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded-lg text-sm transition">
                      + Pesan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Card */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5" />
            Lokasi Outlet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">Yokina Cafe - Pusat</h3>
              <p className="text-gray-600 text-sm mb-2">Jl. Main Street No. 123</p>
              <p className="text-gray-600 text-sm mb-2">Buka: 07:00 - 22:00</p>
              <button className="text-blue-600 hover:underline text-sm">Lihat di Maps</button>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">Yokina Cafe - Cabang</h3>
              <p className="text-gray-600 text-sm mb-2">Jl. Secondary Street No. 456</p>
              <p className="text-gray-600 text-sm mb-2">Buka: 08:00 - 21:00</p>
              <button className="text-blue-600 hover:underline text-sm">Lihat di Maps</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrderMethodCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

function OrderMethodCard({ icon, title, description, onClick }: OrderMethodCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center hover:scale-105 transform"
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </button>
  );
}
