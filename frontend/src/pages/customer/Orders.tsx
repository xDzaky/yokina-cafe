import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { ShoppingCart, LogOut, ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';

export default function CustomerOrders() {
  const [cart, setCart] = useState<any[]>([]);
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100">
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
            <h1 className="text-2xl font-bold text-amber-800">Checkout</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Products */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Tipe Pesanan</h2>
              <div className="flex gap-4">
                {['dine_in', 'takeaway'].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="orderType"
                      value={type}
                      checked={orderType === type}
                      onChange={(e) => setOrderType(e.target.value as any)}
                    />
                    <span className="font-semibold capitalize">
                      {type === 'dine_in' ? 'Makan di Tempat' : 'Takeaway'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Menu</h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <div className="bg-amber-100 h-24 rounded mb-2 flex items-center justify-center text-2xl">
                      ☕
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">Menu {i}</h3>
                    <p className="text-gray-600 text-xs mb-2">Rp 25.000</p>
                    <button
                      onClick={() => {
                        const newCart = [...cart];
                        const existing = newCart.find((item) => item.id === i);
                        if (existing) {
                          existing.quantity += 1;
                        } else {
                          newCart.push({
                            id: i,
                            name: `Menu ${i}`,
                            price: 25000,
                            quantity: 1,
                          });
                        }
                        setCart(newCart);
                      }}
                      className="w-full bg-amber-700 hover:bg-amber-800 text-white px-2 py-1 rounded text-xs font-semibold"
                    >
                      Tambah
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Keranjang</h2>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Keranjang kosong</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center border-b pb-2 last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                          <p className="text-gray-600 text-xs">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                item.quantity -= 1;
                                setCart([...cart]);
                              }
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => {
                              item.quantity += 1;
                              setCart([...cart]);
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setCart(cart.filter((i) => i.id !== item.id));
                            }}
                            className="p-1 hover:bg-red-100 text-red-600 rounded ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-600">PPN 10%</span>
                      <span className="font-semibold">Rp {(totalPrice * 0.1).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mb-4">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-bold text-lg text-amber-700">
                        Rp {(totalPrice * 1.1).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <button className="w-full btn-primary">Lanjut ke Pembayaran</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
