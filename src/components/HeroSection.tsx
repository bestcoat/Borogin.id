import React from 'react';
import { ArrowRight, Tag, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const HeroSection: React.FC = () => {
  const { setCurrentView } = useShop();

  return (
    <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 text-white overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl my-4 sm:my-6">
      {/* Decorative background grid and lighting */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Marketplace Pilihan Keluarga & UMKM Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-none text-white">
              Belanja Apa Saja, <br className="hidden sm:inline" />
              <span className="text-amber-300">Borong Lebih Mudah</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-emerald-100 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Temukan berbagai produk pilihan dengan harga bersahabat hanya di <strong>Borongin.com</strong>. Mulai dari kebutuhan sehari-hari, fashion, gadget canggih, hingga kerajinan nusantara.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => setCurrentView('shop')}
                className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 group"
              >
                <span>Belanja Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('promo')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold rounded-xl text-sm transition-colors border border-white/25 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Tag className="w-4 h-4 text-amber-300" />
                <span>Lihat Promo & Diskon</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-emerald-600/60 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-lg sm:text-xl font-extrabold text-amber-300">100%</p>
                <p className="text-[11px] sm:text-xs text-emerald-200">Produk Terverifikasi</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-extrabold text-amber-300">20+ Ekspedisi</p>
                <p className="text-[11px] sm:text-xs text-emerald-200">Kirim Seluruh RI</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-extrabold text-amber-300">Garansi</p>
                <p className="text-[11px] sm:text-xs text-emerald-200">Uang Kembali 100%</p>
              </div>
            </div>
          </div>

          {/* Right Product Collage Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Banner Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80"
                  alt="Belanja di Borongin.com"
                  className="w-full h-72 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                {/* Floating Discount Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl text-slate-800 shadow-xl border border-white/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      Promo Hari Ini
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1">Diskon Gajian S/D 45% + Bebas Ongkir</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('promo')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Klaim
                  </button>
                </div>
              </div>

              {/* Little Floating Trust Badge */}
              <div className="absolute -top-3 -left-3 bg-white text-slate-800 px-3 py-2 rounded-xl shadow-lg border border-slate-100 hidden sm:flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-medium">Payment Gateway</p>
                  <p className="text-xs font-bold text-slate-800">100% Aman & Resmi</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
