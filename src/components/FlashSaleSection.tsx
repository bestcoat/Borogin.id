import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight, Zap, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export const FlashSaleSection: React.FC = () => {
  const { products, formatRupiah, setSelectedProductId, setCurrentView, addToCart } = useShop();

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 4);

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, product.variations?.[0], 1);
    setCurrentView('cart');
  };

  if (flashSaleProducts.length === 0) return null;

  return (
    <section className="my-8 sm:my-12 p-4 sm:p-6 bg-gradient-to-r from-rose-50 via-amber-50/50 to-emerald-50 rounded-2xl border border-rose-200/80 shadow-sm">
      {/* Header bar with live countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-200/60 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30 animate-pulse">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight flex items-center gap-1.5">
                FLASH SALE
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white tracking-wider">
                HEMAT S/D 45%
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Promo terbatas borongan termurah hari ini
            </p>
          </div>
        </div>

        {/* Live Countdown Box */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3.5 py-1.5 rounded-xl border border-rose-200 shadow-sm text-xs font-semibold text-slate-700">
          <Clock className="w-4 h-4 text-rose-500 shrink-0" />
          <span>Berakhir dalam:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-white text-xs">
            <span className="bg-slate-900 px-1.5 py-0.5 rounded">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-slate-900">:</span>
            <span className="bg-slate-900 px-1.5 py-0.5 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-slate-900">:</span>
            <span className="bg-rose-600 px-1.5 py-0.5 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Flash Sale Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {flashSaleProducts.map((product) => {
          const percentSold = Math.min(95, Math.round((product.soldCount / (product.soldCount + product.stock)) * 100));

          return (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group bg-white rounded-xl border border-rose-100 p-3 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 mb-2.5">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discountPercent && (
                  <div className="absolute top-2 left-2 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm">
                    -{product.discountPercent}%
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                  {product.title}
                </h3>

                <div className="mt-2">
                  <span className="text-sm sm:text-base font-extrabold text-rose-600 block">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="text-[11px] text-slate-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                </div>

                {/* Terjual Progress bar */}
                <div className="mt-2.5 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Terjual {product.soldCount}</span>
                    <span className="text-rose-600">Sisa {product.stock} stok</span>
                  </div>
                  <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentSold}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Beli Sekarang CTA Button */}
              <button
                onClick={(e) => handleBuyNow(e, product)}
                className="w-full mt-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Beli Sekarang</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
