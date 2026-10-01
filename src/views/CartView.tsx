import React, { useState } from 'react';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Check, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    calculateDiscount, 
    formatRupiah, 
    setCurrentView,
    selectedShipping 
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const discountAmount = calculateDiscount(cartSubtotal);
  const freeShippingThreshold = 100000;
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const estimatedTotal = Math.max(0, cartSubtotal - discountAmount + (progressToFreeShipping >= 100 ? 0 : selectedShipping.cost));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponFeedback({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponFeedback({ text: res.message, isError: true });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="my-12 max-w-lg mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Keranjang Belanja Masih Kosong
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Yuk temukan berbagai produk menarik dengan harga bersahabat sekarang juga!
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shadow-emerald-600/20"
        >
          Mulai Belanja Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="my-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Keranjang Belanja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Periksa pesanan Anda sebelum lanjut ke pembayaran aman
          </p>
        </div>

        <button
          onClick={() => setCurrentView('shop')}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lanjut Belanja (Continue Shopping)</span>
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 mb-1.5">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            {progressToFreeShipping >= 100 ? (
              <span>Selamat! Anda mendapatkan <strong>BEBAS ONGKIR</strong> untuk pesanan ini 🎉</span>
            ) : (
              <span>
                Tambah <strong>{formatRupiah(remainingForFreeShipping)}</strong> lagi untuk klaim Gratis Ongkir!
              </span>
            )}
          </div>
          <span>{progressToFreeShipping}%</span>
        </div>
        <div className="w-full h-2.5 bg-emerald-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
            style={{ width: `${progressToFreeShipping}%` }}
          ></div>
        </div>
      </div>

      {/* Cart Layout: Items List & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-3">
          {cart.map((item) => {
            const price = item.selectedVariation ? item.selectedVariation.price : item.product.price;
            const itemSubtotal = price * item.quantity;
            const maxStock = item.selectedVariation ? item.selectedVariation.stock : item.product.stock;

            return (
              <div 
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Image & Title */}
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                      {item.product.title}
                    </h3>
                    
                    {item.selectedVariation && (
                      <span className="inline-block mt-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Variasi: {item.selectedVariation.name}
                      </span>
                    )}

                    <div className="text-xs font-bold text-emerald-700 mt-1">
                      {formatRupiah(price)}
                    </div>
                  </div>
                </div>

                {/* Qty Controls, Subtotal, Delete */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-slate-600 hover:text-slate-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= maxStock}
                      className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {formatRupiah(itemSubtotal)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Hapus dari Keranjang"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Summary Box */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 sticky top-24">
          <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">
            Ringkasan Belanja
          </h3>

          {/* Coupon Input Form */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Punya Kode Kupon / Voucher?
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-800 block">{appliedCoupon.code}</span>
                  <span className="text-[10px] text-emerald-600">{appliedCoupon.description}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: BORONG10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 uppercase font-mono text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Gunakan
                  </button>
                </div>
                {couponFeedback && (
                  <p className={`text-[11px] ${couponFeedback.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {couponFeedback.text}
                  </p>
                )}
                <p className="text-[10px] text-slate-400">
                  Gunakan <strong className="text-emerald-600">BORONG10</strong> (Diskon 10%) atau <strong className="text-emerald-600">GRATISONGKIR</strong>.
                </p>
              </form>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal Produk</span>
              <span className="font-semibold text-slate-800">{formatRupiah(cartSubtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>Diskon Kupon Promo</span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Perkiraan Ongkos Kirim</span>
              <span>
                {progressToFreeShipping >= 100 ? (
                  <strong className="text-emerald-600 font-bold">GRATIS</strong>
                ) : (
                  formatRupiah(selectedShipping.cost)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-sm text-slate-900">Total Pembayaran</span>
              <span className="text-xl font-black text-emerald-700">
                {formatRupiah(estimatedTotal)}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => setCurrentView('checkout')}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Lanjut ke Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Jaminan Transaksi 100% Aman & Terenkripsi</span>
          </div>

        </div>
      </div>
    </div>
  );
};
