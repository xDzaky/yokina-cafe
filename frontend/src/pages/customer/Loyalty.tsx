import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Gift, LogOut, ArrowLeft, Sparkles } from 'lucide-react';

export default function CustomerLoyalty() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const loyaltyPoints = 2500;
  const vouchers = [
    {
      id: 1,
      code: 'DISC10K',
      discount: 'Rp 10.000',
      minPoints: 1000,
      redeem: false,
    },
    {
      id: 2,
      code: 'DISC25K',
      discount: 'Rp 25.000',
      minPoints: 2500,
      redeem: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/customer/home')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-yellow-600" />
              <h1 className="text-2xl font-bold text-amber-800">Program Loyalitas</h1>
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
        {/* Points Card */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Poin Loyalitas Anda</h2>
          </div>
          <div className="text-6xl font-bold mb-4">{loyaltyPoints}</div>
          <p className="text-lg opacity-90">
            Setiap pembelian akan mengakumulasi poin yang dapat ditukar dengan voucher diskon
          </p>
        </div>

        {/* Vouchers Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Voucher Tersedia</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vouchers.map((voucher) => {
              const canRedeem = loyaltyPoints >= voucher.minPoints;

              return (
                <div
                  key={voucher.id}
                  className={`border-2 rounded-lg p-6 ${
                    canRedeem
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-3xl font-bold text-amber-700">
                        {voucher.discount}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">Kode: {voucher.code}</p>
                    </div>
                    <Gift className={`w-8 h-8 ${canRedeem ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>

                  <div className="mb-4 p-3 bg-white rounded">
                    <p className="text-gray-600 text-sm mb-1">Poin Minimum</p>
                    <p className="text-lg font-semibold text-gray-800">{voucher.minPoints} Poin</p>
                  </div>

                  {canRedeem ? (
                    <>
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
                        ✓ Tukarkan
                      </button>
                      <p className="text-center text-xs text-gray-600 mt-2">
                        Poin Anda: {loyaltyPoints} poin (Lebih dari cukup)
                      </p>
                    </>
                  ) : (
                    <>
                      <button
                        disabled
                        className="w-full bg-gray-400 text-gray-600 font-semibold py-2 rounded-lg cursor-not-allowed"
                      >
                        Belum Dapat Ditukar
                      </button>
                      <p className="text-center text-xs text-gray-600 mt-2">
                        Butuh {voucher.minPoints - loyaltyPoints} poin lagi
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Bagaimana Cara Kerjanya?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🛍️</div>
              <h3 className="font-bold text-gray-800 mb-2">1. Belanja</h3>
              <p className="text-gray-600 text-sm">
                Setiap pembelian akan menghasilkan poin loyalty
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-bold text-gray-800 mb-2">2. Kumpulkan Poin</h3>
              <p className="text-gray-600 text-sm">
                1 Poin = Rp 100 yang anda keluarkan
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-bold text-gray-800 mb-2">3. Tukar Diskon</h3>
              <p className="text-gray-600 text-sm">
                Tukarkan poin dengan voucher diskon eksklusif
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
