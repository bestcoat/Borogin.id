import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { verifyAdminLogin, setInitialMasterPassword } from '../services/adminAuth';

export const LoginView: React.FC = () => {
  const { 
    setCurrentView, 
    showToast, 
    refreshAuth, 
    setIsAdminAuthenticated,
    pendingBuyAction, 
    setPendingBuyAction, 
    addToCart, 
    products,
    updateUserProfile 
  } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const cleanInput = email.trim().toLowerCase();
    const isAdminTarget = cleanInput === 'admin@borongin.id' || cleanInput === 'boronginadm';

    // 1. Jalur Login Administrator (jika akun admin yang diinput)
    if (isAdminTarget) {
      try {
        const res = await fetch('/api/auth/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanInput, password })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          sessionStorage.setItem('borongin_admin_session_v1', 'active_admin_session');
          await setInitialMasterPassword(password);
          await refreshAuth();
          setIsAdminAuthenticated(true);
          showToast('Login administrator berhasil! Selamat datang di Dashboard.', 'success');
          setCurrentView('admin');
          return;
        } else {
          const localCheck = await verifyAdminLogin(cleanInput, password);
          if (localCheck.success) {
            setIsAdminAuthenticated(true);
            showToast('Login administrator berhasil!', 'success');
            setCurrentView('admin');
            return;
          }
          setErrorMessage('Username/email atau password administrator salah.');
          setLoading(false);
          return;
        }
      } catch (err) {
        const localCheck = await verifyAdminLogin(cleanInput, password);
        if (localCheck.success) {
          setIsAdminAuthenticated(true);
          showToast('Login administrator berhasil!', 'success');
          setCurrentView('admin');
          return;
        } else {
          setErrorMessage('Username/email atau password administrator salah.');
          setLoading(false);
          return;
        }
      }
    }

    // 2. Jalur Login Customer
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanInput, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Email atau kata sandi salah.');
        setLoading(false);
        return;
      }

      await refreshAuth();
      showToast(`Login berhasil! Selamat datang kembali, ${data.user.name}.`, 'success');

      if (pendingBuyAction) {
        const prod = products.find(p => p.id === pendingBuyAction.productId);
        if (prod) {
          addToCart(prod, prod.variations?.find(v => v.id === pendingBuyAction.variationId), pendingBuyAction.quantity);
          if (pendingBuyAction.action === 'buy') {
            setPendingBuyAction(null);
            setCurrentView('checkout');
            return;
          }
        }
        setPendingBuyAction(null);
      }

      setCurrentView('shop');
    } catch (err) {
      // Fallback untuk static hosting
      if (cleanInput === 'budi.santoso@example.com' && password === 'budi12345') {
        updateUserProfile({
          id: 'user-cust-1',
          name: 'Budi Santoso',
          email: 'budi.santoso@example.com',
          phone: '081298765432',
          role: 'CUSTOMER',
          memberTier: 'Silver',
          points: 450,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          joinedDate: '2026-01-15'
        });
        showToast('Login berhasil! Selamat datang kembali, Budi Santoso.', 'success');
        setCurrentView('shop');
        return;
      }
      setErrorMessage('Terjadi kendala jaringan saat menghubungi server. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
        
        {/* Brand Kicker */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
            B
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Masuk ke BORONGIN.COM
          </h1>
          <p className="text-xs text-slate-500">
            Belanja Mudah, Harga Bersahabat · Masuk ke akun Anda
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Alamat Email:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">
                Kata Sandi:
              </label>
              <button
                type="button"
                onClick={() => setCurrentView('faq')}
                className="text-emerald-600 hover:underline font-semibold"
              >
                Lupa Kata Sandi?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{loading ? 'Memverifikasi Akun...' : 'Masuk ke Akun'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center space-y-3">
          <p className="text-xs text-slate-600">
            Belum punya akun?{' '}
            <button
              onClick={() => setCurrentView('register')}
              className="text-emerald-600 hover:underline font-extrabold"
            >
              Daftar Sekarang
            </button>
          </p>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Keamanan data transaksi terenkripsi SSL 256-bit</span>
          </div>
        </div>

      </div>
    </div>
  );
};
