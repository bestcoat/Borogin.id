import React from 'react';
import { Lock, LogIn, UserPlus, X, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const GuestLoginPromptModal: React.FC = () => {
  const { isGuestPromptOpen, setIsGuestPromptOpen, setCurrentView } = useShop();

  if (!isGuestPromptOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-slate-800 shadow-2xl relative space-y-5 border border-slate-200 text-center">
        <button
          onClick={() => setIsGuestPromptOpen(false)}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded-full"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
            Silakan Login atau Daftar terlebih dahulu untuk melanjutkan pembelian.
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Untuk keamanan transaksi, penghitungan ongkir, dan penerbitan faktur resmi, Anda perlu masuk ke akun BORONGIN.COM.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              setIsGuestPromptOpen(false);
              setCurrentView('login');
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <LogIn className="w-4 h-4" />
            <span>LOGIN</span>
          </button>

          <button
            onClick={() => {
              setIsGuestPromptOpen(false);
              setCurrentView('register');
            }}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>DAFTAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
