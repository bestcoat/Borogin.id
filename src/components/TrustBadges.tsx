import React from 'react';
import { ShieldCheck, Award, Zap, Headphones, RefreshCw } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Pembayaran Aman',
      desc: 'Enkripsi SSL & Bank Gateway Resmi'
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      title: 'Produk Berkualitas',
      desc: '100% Original & Teruji Kurasi'
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-600" />,
      title: 'Pengiriman Cepat',
      desc: 'Sicepat, JNE, J&T ke Seluruh RI'
    },
    {
      icon: <Headphones className="w-6 h-6 text-emerald-600" />,
      title: 'Customer Support',
      desc: 'Fast Response Setiap Hari via WA'
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-emerald-600" />,
      title: 'Garansi Pengembalian',
      desc: 'Klaim Retur Mudah & Cepat 7 Hari'
    }
  ];

  return (
    <section className="my-8 sm:my-12 py-8 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {badges.map((b, idx) => (
          <div key={idx} className="flex flex-col items-center text-center p-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
              {b.icon}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">{b.title}</h4>
            <p className="text-[11px] text-slate-500 mt-1">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
