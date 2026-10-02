import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Layers, 
  Clock 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setCategoryFilter } = useShop();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Value Badges in Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/60">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pengiriman Cepat</h4>
              <p className="text-xs text-slate-400">J&T, JNE, SiCepat, AnterAja</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/60">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pembayaran Aman</h4>
              <p className="text-xs text-slate-400">Midtrans, VA, E-Wallet & QRIS</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/60">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Garansi Retur 7 Hari</h4>
              <p className="text-xs text-slate-400">Klaim mudah jika produk cacat</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/60">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Customer Support</h4>
              <p className="text-xs text-slate-400">Fast response via WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-600/30">
                B
              </div>
              <div>
                <span className="font-extrabold text-2xl text-white tracking-tight">BORONGIN</span>
                <span className="font-extrabold text-2xl text-emerald-400">.COM</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              <strong className="text-white">Belanja Mudah, Harga Bersahabat.</strong> Platform e-commerce & marketplace modern kebutuhan sehari-hari, fashion, gadget, perlengkapan rumah, hingga produk unggulan UMKM nusantara.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Gedung Borongin Tower Lt. 12, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan 12190</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+62 812-3456-7890 (Official CS WhatsApp)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>halo@borongin.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Senin - Minggu: 08:00 - 22:00 WIB</span>
              </div>
            </div>
          </div>

          {/* Column 2: Panduan Belanja & Bantuan */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Panduan Belanja</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('faq')} className="hover:text-emerald-400 transition-colors">
                  Cara Berbelanja
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('tracking')} className="hover:text-emerald-400 transition-colors">
                  Lacak Pengiriman Pesanan
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('promo')} className="hover:text-emerald-400 transition-colors">
                  Voucher & Promo Mingguan
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('refund-policy')} className="hover:text-emerald-400 transition-colors">
                  Kebijakan Pengembalian (Retur)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('faq')} className="hover:text-emerald-400 transition-colors">
                  FAQ (Tanya Jawab)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Informasi & Kebijakan */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Informasi</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('about')} className="hover:text-emerald-400 transition-colors">
                  Tentang BORONGIN.COM
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('blog')} className="hover:text-emerald-400 transition-colors">
                  Blog & Artikel Edukasi
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('terms')} className="hover:text-emerald-400 transition-colors">
                  Syarat & Ketentuan
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('privacy')} className="hover:text-emerald-400 transition-colors">
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contact')} className="hover:text-emerald-400 transition-colors">
                  Hubungi Kami
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('tracking')} className="text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Konfirmasi Pembayaran</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Kategori Populer */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kategori Populer</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => { setCategoryFilter('produk-umkm'); setCurrentView('shop'); }} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  Produk UMKM Juara
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCategoryFilter('handphone-aksesoris'); setCurrentView('shop'); }} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  Handphone & Aksesoris
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCategoryFilter('rumah-tangga'); setCurrentView('shop'); }} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  Peralatan Rumah Tangga
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCategoryFilter('fashion-pria'); setCurrentView('shop'); }} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  Fashion Pria & Wanita
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCategoryFilter('minuman'); setCurrentView('shop'); }} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  Kopi & Makanan Lokal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Partners & Payment Gateways */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-800 text-xs">
          <div>
            <h5 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">
              Metode Pembayaran Resmi
            </h5>
            <div className="flex flex-wrap gap-2 items-center">
              {['BCA', 'Mandiri', 'BRI', 'BNI', 'GoPay', 'OVO', 'DANA', 'ShopeePay', 'QRIS', 'Visa', 'Mastercard', 'COD'].map((item) => (
                <span 
                  key={item} 
                  className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-[11px] font-bold border border-slate-700 hover:border-slate-500 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">
              Mitra Logistik Terpercaya
            </h5>
            <div className="flex flex-wrap gap-2 items-center">
              {['J&T Express', 'JNE Express', 'SiCepat', 'AnterAja', 'POS Indonesia', 'Ninja Xpress', 'ID Express'].map((item) => (
                <span 
                  key={item} 
                  className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-[11px] font-bold border border-slate-700 hover:border-slate-500 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 BORONGIN.COM. All Rights Reserved. Terdaftar di Kementerian Kominfo RI. ·{' '}
            <button 
              onClick={() => setCurrentView('admin-login')} 
              className="hover:text-emerald-400 transition-colors text-slate-500 hover:underline"
              title="Khusus Staf & Administrator Toko"
            >
              Portal Administrator
            </button>
          </p>
          
          <div className="flex items-center gap-5">
            <span className="text-slate-400 font-medium">Ikuti Kami:</span>
            <span className="hover:text-emerald-400 cursor-pointer font-bold">Instagram</span>
            <span className="hover:text-emerald-400 cursor-pointer font-bold">TikTok</span>
            <span className="hover:text-emerald-400 cursor-pointer font-bold">Facebook</span>
            <span className="hover:text-emerald-400 cursor-pointer font-bold">YouTube</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
