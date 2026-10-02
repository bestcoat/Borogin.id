import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Zap, 
  Share2, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  MessageCircle, 
  Minus, 
  Plus, 
  ArrowLeft,
  ThumbsUp,
  UserCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductVariation, Review } from '../types';

export const ProductDetailView: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    setCurrentView, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    formatRupiah,
    addProductReview,
    showToast,
    setIsWhatsAppModalOpen,
    setWhatsAppInitialMessage
  } = useShop();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [activeImage, setActiveImage] = useState<string>(product.images[0]);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations?.[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');

  // Review submission state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const isFavorited = isInWishlist(product.id);
  const currentPrice = selectedVariation ? selectedVariation.price : product.price;
  const currentStock = selectedVariation ? selectedVariation.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    if (newQty > currentStock) {
      showToast(`Stok maksimal yang dapat dibeli adalah ${currentStock} unit.`, 'warning');
      return;
    }
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariation, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariation, quantity);
    setCurrentView('checkout');
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Halo Borongin.com, saya tertarik dengan produk:\n*${product.title}*\nHarga: ${formatRupiah(currentPrice)}\nSKU: ${selectedVariation?.sku || product.sku}\nApakah produk ini masih ready stock?`
    );
    window.open(`https://wa.me/6287722631751?text=${text}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Lihat ${product.title} di BORONGIN.COM seharga ${formatRupiah(currentPrice)}!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan produk berhasil disalin ke clipboard!', 'success');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Silakan lengkapi nama dan ulasan Anda.', 'warning');
      return;
    }
    setSubmittingReview(true);
    addProductReview(product.id, {
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      verifiedPurchase: true
    });
    setReviewComment('');
    setSubmittingReview(false);
  };

  return (
    <div className="my-6 space-y-8">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog Belanja</span>
      </button>

      {/* Main Product Info Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Gallery & Thumbnails */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                  Hemat {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img ? 'border-emerald-600 scale-95 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details, Variations, Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Brand & SKU Header */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium">
                  <span>Merek: <strong className="text-slate-800">{product.brand}</strong></span>
                  <span className="mx-2">·</span>
                  <span>SKU: <strong className="text-slate-800 font-mono">{selectedVariation?.sku || product.sku}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Bagikan Produk"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorited ? 'text-rose-500 bg-rose-50' : 'text-slate-500 hover:text-rose-500 hover:bg-slate-100'
                    }`}
                    title="Simpan Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {product.title}
              </h1>

              {/* Rating & Sold count */}
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 font-bold text-slate-800 text-sm">{product.rating}</span>
                </div>
                <span className="text-slate-300">·</span>
                <span className="font-medium underline cursor-pointer" onClick={() => setActiveTab('reviews')}>
                  {product.reviewCount} Ulasan Pembeli
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-medium">{product.soldCount} Terjual</span>
              </div>

              {/* Price Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {formatRupiah(currentPrice)}
                </span>
                {product.originalPrice > currentPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    Diskon {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Variations (Color / Size) if present */}
              {product.variations && product.variations.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Pilihan Variasi:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variations.map((v) => {
                      const isSelected = selectedVariation?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVariation(v);
                            if (quantity > v.stock) setQuantity(1);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <span>{v.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Ketersediaan Stok:</span>
                {isOutOfStock ? (
                  <span className="font-extrabold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                    Stok Habis
                  </span>
                ) : currentStock <= 5 ? (
                  <span className="font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    ⚠️ Stok Hampir Habis (Sisa {currentStock} unit)
                  </span>
                ) : (
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Stok Tersedia ({currentStock} unit)
                  </span>
                )}
              </div>

              {/* Quantity selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Jumlah:
                  </span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 text-slate-600 hover:bg-slate-50 rounded-l-xl disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-xs font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= currentStock}
                      className="p-2 text-slate-600 hover:bg-slate-50 rounded-r-xl disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Subtotal: <strong className="text-slate-800">{formatRupiah(currentPrice * quantity)}</strong>
                  </span>
                </div>
              )}

              {/* CTA Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-bold text-xs sm:text-sm rounded-xl border border-emerald-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Tambah ke Keranjang</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Beli Sekarang</span>
                </button>
              </div>

              {/* WhatsApp Quick Order Inquiry */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Tanya Stok / Pesan Cepat via WhatsApp</span>
              </button>

            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <span>100% Produk Original</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-emerald-600 mb-1" />
                <span>Bebas Ongkir Min. 100rb</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-emerald-600 mb-1" />
                <span>Garansi Retur 7 Hari</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Tabs: Deskripsi, Spesifikasi, Pengiriman, Ulasan */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-sm">
        <div className="flex border-b border-slate-200 gap-4 sm:gap-8 overflow-x-auto text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Deskripsi Produk
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Spesifikasi & Detail
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Informasi Pengiriman
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Ulasan Pembeli</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full">
              {product.reviews.length}
            </span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-6">
          {activeTab === 'desc' && (
            <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed text-xs sm:text-sm space-y-4">
              <p>{product.description}</p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-2">Keunggulan Belanja di BORONGIN.COM:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Produk 100% original dan melewati proses pengecekan Quality Control (QC) ketat sebelum dipacking.</li>
                  <li>Packing ekstra aman dengan bubble wrap tebal tanpa biaya tambahan.</li>
                  <li>Mendukung berbagai metode pembayaran instan (Virtual Account, QRIS, E-Wallet, Kartu Kredit).</li>
                  <li>Dukungan customer service aktif via WhatsApp untuk kendala pengiriman atau klaim garansi.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 font-bold text-slate-500 w-1/3">Berat Pengiriman</td>
                    <td className="py-2.5 text-slate-800">{product.weightGrams} gram</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 font-bold text-slate-500">Kategori</td>
                    <td className="py-2.5 text-slate-800 capitalize">{product.category.replace(/-/g, ' ')}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 font-bold text-slate-500">Merek Resmi</td>
                    <td className="py-2.5 text-slate-800">{product.brand}</td>
                  </tr>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <tr key={key} className="border-b border-slate-100">
                      <td className="py-2.5 font-bold text-slate-500">{key}</td>
                      <td className="py-2.5 text-slate-800">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <p>
                Semua pesanan di <strong>BORONGIN.COM</strong> dikirim langsung dari Pusat Distribusi Jakarta dan Surabaya melalui ekspedisi logistik terpercaya:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 mb-1">Pilihan Ekspedisi:</h5>
                  <p className="text-slate-600 text-xs">J&T Express, SiCepat (BEST/REG), JNE (YES/REG), AnterAja, Ninja Xpress, POS Indonesia.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 mb-1">Estimasi Pengantaran:</h5>
                  <p className="text-slate-600 text-xs">Jabodetabek 1-2 hari kerja. Pulau Jawa 2-3 hari. Luar Pulau Jawa 3-5 hari kerja.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Existing Reviews */}
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{rev.userName}</span>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>

                      {rev.verifiedPurchase && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified Purchase</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add New Review Form */}
              <div className="p-5 bg-white rounded-2xl border border-emerald-200/80 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-slate-900">
                  Tulis Ulasan untuk Produk Ini
                </h4>

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Anda:</label>
                      <input
                        type="text"
                        placeholder="Contoh: Andi Pratama"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rating Kepuasan:</label>
                      <div className="flex items-center gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-200'}`} />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-600 ml-1">{reviewRating} / 5</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Komentar & Pengalaman:</label>
                    <textarea
                      rows={3}
                      placeholder="Ceritakan kualitas produk, kesesuaian dengan foto, dan kecepatan pengiriman..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                  >
                    Kirim Ulasan
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Action Bar for Smartphones */}
      <div className="fixed bottom-14 left-0 right-0 z-30 p-2.5 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden flex items-center gap-2 shadow-lg safe-area-pb">
        <button
          onClick={handleWhatsAppInquiry}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center shrink-0"
          title="Tanya CS via WhatsApp"
        >
          <MessageCircle className="w-5 h-5 text-emerald-600" />
        </button>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4 shrink-0" />
          <span className="truncate">+ Keranjang</span>
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <Zap className="w-4 h-4 fill-white shrink-0" />
          <span className="truncate">Beli Sekarang</span>
        </button>
      </div>
    </div>
  );
};
