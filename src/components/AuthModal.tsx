import React, { useState } from 'react';
import { User, Lock, Mail, Phone, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, updateUserProfile, showToast } = useShop();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
    setIsAuthModalOpen(false);
    showToast(isRegister ? 'Registrasi akun baru berhasil! Selamat datang di Borongin.' : 'Login berhasil! Selamat datang kembali.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-slate-800 shadow-2xl relative space-y-4">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-extrabold text-xl">
            B
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {isRegister ? 'Daftar Akun Baru' : 'Masuk ke BORONGIN.COM'}
          </h3>
          <p className="text-xs text-slate-500">
            {isRegister ? 'Bergabung & dapatkan voucher diskon member' : 'Kelola pesanan dan nikmati promo eksklusif'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegister && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alamat Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812xxxxxxxx"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kata Sandi (Password)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            {isRegister ? 'Daftar Sekarang' : 'Masuk Akun'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          {isRegister ? (
            <p>
              Sudah punya akun?{' '}
              <button onClick={() => setIsRegister(false)} className="text-emerald-700 font-bold hover:underline">
                Masuk di sini
              </button>
            </p>
          ) : (
            <p>
              Belum punya akun?{' '}
              <button onClick={() => setIsRegister(true)} className="text-emerald-700 font-bold hover:underline">
                Daftar sekarang
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
