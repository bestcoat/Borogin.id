import React from 'react';
import { Star, Heart, ShoppingCart, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  showBadge?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge }) => {
  const { 
    setSelectedProductId, 
    setCurrentView, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    formatRupiah 
  } = useShop();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleClick = () => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, product.variations?.[0], 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-xl border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Product Image & Badges Container */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Floating Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
              -{product.discountPercent}%
            </span>
          )}

          {product.isBestSeller && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
              BEST SELLER
            </span>
          )}

          {product.isFreeShipping && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              BEBAS ONGKIR
            </span>
          )}

          {showBadge && (
            <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              {showBadge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorited 
              ? 'bg-rose-50 text-rose-500 shadow-sm' 
              : 'bg-white/80 backdrop-blur-sm text-slate-500 hover:text-rose-500 hover:bg-white shadow-sm'
          }`}
          title="Simpan ke Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              STOK HABIS
            </span>
          </div>
        )}
      </div>

      {/* Product Details Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Brand quiet kicker */}
          <div className="text-[11px] text-slate-400 font-medium truncate mb-1">
            <span>{product.brand}</span>
            <span className="mx-1">·</span>
            <span className="capitalize">{product.category.replace(/-/g, ' ')}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Rating & Sold count */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="ml-1 font-bold text-slate-700 text-xs">{product.rating}</span>
            </div>
            <span className="text-slate-300">·</span>
            <span className="text-[11px]">{product.soldCount} terjual</span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900">
              {formatRupiah(product.price)}
            </div>
            {product.originalPrice > product.price && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 line-through">
                {formatRupiah(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white active:scale-95'
            }`}
            title={isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
