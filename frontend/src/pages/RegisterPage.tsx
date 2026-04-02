import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api';
import { Coffee, User, Phone, Mail } from 'lucide-react';

export default function RegisterPage() {
  const [role, setRole] = useState<'admin' | 'customer'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      let response;
      if (role === 'admin') {
        response = await authApi.registerAdmin(
          formData.email,
          formData.password,
          formData.name,
          formData.phone
        );
      } else {
        response = await authApi.registerCustomer(
          formData.email,
          formData.password,
          formData.name,
          formData.phone
        );
      }

      setAuth(response.data.user, response.data.token);
      navigate(role === 'admin' ? '/admin/dashboard' : '/customer/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Coffee className="w-10 h-10 text-amber-700" />
              <h1 className="text-2xl font-bold text-amber-800">Yokina Cafe</h1>
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Daftar Akun</h2>

          {/* Role Selection */}
          <div className="mb-6 flex gap-4">
            <label className="flex-1 relative">
              <input
                type="radio"
                name="role"
                value="customer"
                checked={role === 'customer'}
                onChange={(e) => setRole(e.target.value as 'customer')}
                className="hidden"
              />
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer text-center transition ${
                  role === 'customer'
                    ? 'border-amber-700 bg-amber-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="font-semibold text-gray-800">Pelanggan</div>
                <div className="text-sm text-gray-600">Pesan & Loyalitas</div>
              </div>
            </label>
            <label className="flex-1 relative">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={(e) => setRole(e.target.value as 'admin')}
                className="hidden"
              />
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer text-center transition ${
                  role === 'admin'
                    ? 'border-amber-700 bg-amber-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="font-semibold text-gray-800">Admin</div>
                <div className="text-sm text-gray-600">Kelola Cafe</div>
              </div>
            </label>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+62812345678"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Konfirmasi Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Sudah punya akun?{' '}
            <a href="/login" className="text-amber-700 font-semibold hover:underline">
              Login di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
