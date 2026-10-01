import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CookieNotice: React.FC = () => {
  const [show, setShow] = useState(false);
  const { setCurrentView } = useShop();

  useEffect(() => {
    const accepted = localStorage.getItem('borongin_cookies_accepted');
    if (!accepted) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('borongin_cookies_accepted', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-14 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-24 z-30 max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Kami menggunakan cookie untuk mengoptimalkan pengalaman berbelanja Anda. Dengan melanjutkan, Anda menyetujui{' '}
          <button 
            onClick={() => setCurrentView('privacy')} 
            className="text-emerald-700 underline font-semibold"
          >
            Kebijakan Privasi
          </button>{' '}
          dan{' '}
          <button 
            onClick={() => setCurrentView('terms')} 
            className="text-emerald-700 underline font-semibold"
          >
            Syarat & Ketentuan
          </button>.
        </p>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          onClick={handleAccept}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-[11px]"
        >
          Setujui
        </button>
        <button
          onClick={() => setShow(false)}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
