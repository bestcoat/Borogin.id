import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Masukkan alamat email yang valid.', 'warning');
      return;
    }
    setSubscribed(true);
    showToast('Terima kasih! Anda berhasil mendaftar buletin promo Borongin.', 'success');
  };

  return (
    <section className="my-10 p-6 sm:p-10 bg-emerald-700 text-white rounded-2xl sm:rounded-3xl shadow-lg relative overflow-hidden">
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-600/40 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-2xl mx-auto text-center relative z-10 space-y-4">
        <div className="w-12 h-12 bg-white/10 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-sm border border-white/20">
          <Mail className="w-6 h-6 text-amber-300" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Jangan Lewatkan Promo Borongin
        </h3>

        <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
          Dapatkan voucher diskon mingguan, flash sale eksklusif, dan penawaran produk UMKM langsung di kotak masuk email Anda.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/30">
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>Terima kasih! Email Anda telah terdaftar.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Masukkan alamat email Anda..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shrink-0"
            >
              Daftar
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
