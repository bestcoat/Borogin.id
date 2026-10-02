import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { 
  OFFICIAL_ADMIN_USERNAME, 
  isMasterPasswordSet, 
  setInitialMasterPassword, 
  verifyAdminLogin 
} from '../services/adminAuth';

export const AdminLoginView: React.FC = () => {
  const { setCurrentView, showToast, setIsAdminAuthenticated, refreshAuth } = useShop();
  
  const [username, setUsername] = useState(OFFICIAL_ADMIN_USERNAME);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Cek apakah password master admin sudah pernah diatur di browser ini
    const isSet = isMasterPasswordSet();
    setIsSetupMode(!isSet);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSetupMode) {
        if (password.length < 6) {
          setErrorMsg('Password administrator minimal 6 karakter demi keamanan akun toko.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Konfirmasi password tidak cocok.');
          setLoading(false);
          return;
        }

        const serverRes = await fetch('/api/auth/admin/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, confirmPassword })
        });
        const serverData = await serverRes.json();

        if (serverRes.ok && serverData.success) {
          await setInitialMasterPassword(password);
          await refreshAuth();
          setIsAdminAuthenticated(true);
          showToast('Master password administrator berhasil dibuat!', 'success');
          setCurrentView('admin');
        } else {
          setErrorMsg(serverData.message || 'Gagal mengatur password administrator.');
        }
      } else {
        const serverRes = await fetch('/api/auth/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const serverData = await serverRes.json();

        if (serverRes.ok && serverData.success) {
          sessionStorage.setItem('borongin_admin_session_v1', 'active_admin_session');
          await refreshAuth();
          setIsAdminAuthenticated(true);
          showToast('Login berhasil! Selamat datang di Dashboard BORONGIN.COM.', 'success');
          setCurrentView('admin');
        } else {
          setErrorMsg(serverData.message || 'Username atau password salah.');
        }
      }
    } catch (err: any) {
      // Fallback for static hosting / GitHub Pages / offline mode
      try {
        const localCheck = await verifyAdminLogin(username, password);
        if (localCheck.success) {
          sessionStorage.setItem('borongin_admin_session_v1', 'active_admin_session');
          setIsAdminAuthenticated(true);
          showToast('Login berhasil! Selamat datang di Dashboard BORONGIN.COM.', 'success');
          setCurrentView('admin');
          return;
        } else {
          setErrorMsg(localCheck.message);
        }
      } catch (fallbackErr) {
        setErrorMsg('Terjadi kesalahan saat memproses autentikasi ke server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 p-6 text-white text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Portal Administrator BORONGIN.COM
          </h1>
          <p className="text-xs text-emerald-300 mt-1">
            Area Khusus Manajemen Inventaris, Pesanan &amp; Verifikasi Pembayaran
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {isSetupMode ? (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Inisialisasi Keamanan Pertama Kali</span>
              </div>
              <p className="text-amber-800">
                Sesuai standar keamanan, password administrator tidak disimpan secara hardcoded. Silakan buat master password pertama untuk akun <strong>{OFFICIAL_ADMIN_USERNAME}</strong>.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Username Resmi Admin:</span>
              <span className="font-mono font-black text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                {OFFICIAL_ADMIN_USERNAME}
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username Administrator:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="boronginadm"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isSetupMode ? 'Buat Password Master Baru:' : 'Password Administrator:'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={isSetupMode ? 'Minimal 6 karakter' : 'Masukkan password admin...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (only on setup) */}
            {isSetupMode && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ulangi Konfirmasi Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Ketik ulang password..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {loading 
                ? 'Memproses Autentikasi...' 
                : isSetupMode 
                  ? 'Simpan Password & Buka Dashboard Admin' 
                  : 'Masuk ke Dashboard Administrator →'
              }
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentView('home')}
              className="text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda Toko</span>
            </button>

            {!isSetupMode && (
              <button
                onClick={() => {
                  if (confirm('Apakah Anda ingin mereset password administrator pada peramban ini?')) {
                    localStorage.removeItem('borongin_admin_auth_v1');
                    setIsSetupMode(true);
                    showToast('Silakan buat password administrator baru.', 'info');
                  }
                }}
                className="text-slate-400 hover:text-rose-600 transition-colors text-[11px]"
              >
                Reset Password
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
