import React, { useState, useEffect } from 'react';
import { Gift, X, Copy, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const NewUserModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { applyCoupon, showToast, setCurrentView } = useShop();

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('borongin_popup_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('borongin_popup_seen', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('BORONG10');
    setCopied(true);
    applyCoupon('BORONG10');
    showToast('Kupon BORONG10 berhasil disalin dan diterapkan!', 'success');
    setTimeout(() => {
      setIsOpen(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center relative shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-4 border border-amber-200">
          <Gift className="w-8 h-8 animate-bounce" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Selamat Datang di Borongin!
        </span>

        <h3 className="text-xl font-extrabold text-slate-900 mt-2">
          Dapatkan Voucher Belanja
        </h3>

        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Klaim diskon spesial 10% untuk transaksi pertama Anda di Borongin.com tanpa ribet!
        </p>

        {/* Voucher Box */}
        <div className="my-5 p-3.5 bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-300 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-medium">Kode Kupon:</span>
            <p className="font-mono font-black text-emerald-700 text-lg tracking-wider">BORONG10</p>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin' : 'Klaim'}</span>
          </button>
        </div>

        <button
          onClick={() => {
            setIsOpen(false);
            setCurrentView('shop');
          }}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
        >
          Mulai Belanja Sekarang
        </button>
      </div>
    </div>
  );
};
