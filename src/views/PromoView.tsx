import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent, Truck, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { FlashSaleSection } from '../components/FlashSaleSection';
import { ProductCard } from '../components/ProductCard';

export const PromoView: React.FC = () => {
  const { coupons, applyCoupon, showToast, products, setCurrentView } = useShop();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const discountedProducts = products.filter(p => (p.discountPercent || 0) >= 30);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    showToast(`Kode kupon ${code} berhasil disalin dan siap digunakan di keranjang!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="my-6 space-y-8">
      {/* Top Banner Promo */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-white/20 border border-white/30 tracking-wider">
            Zona Promo Akbar BORONGIN.COM
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Klaim Voucher Diskon & Bebas Ongkir Hari Ini!
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Gunakan voucher resmi di bawah ini saat checkout. Hemat hingga 45% untuk berbagai produk elektronik, fashion, kebutuhan rumah, dan produk UMKM nusantara.
          </p>
        </div>
      </div>

      {/* Available Coupons Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Voucher & Kupon Promo Aktif
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white rounded-2xl border-2 border-dashed border-emerald-300 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-emerald-800 text-base tracking-wider bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {coupon.code}
                  </span>
                  <span className="text-[10px] font-extrabold text-rose-600 uppercase">
                    {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : coupon.discountType === 'free_shipping' ? 'GRATIS ONGKIR' : 'POTONGAN HARGA'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Min. Belanja Rp{coupon.minSpend.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === coupon.code ? 'Tersalin' : 'Klaim'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale Component */}
      <FlashSaleSection />

      {/* Produk Diskon Terbesar (30%+) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Produk Diskon Spesial Mingguan (30% Ke Atas)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar produk dengan potongan harga tertinggi yang siap diborong
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {discountedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
