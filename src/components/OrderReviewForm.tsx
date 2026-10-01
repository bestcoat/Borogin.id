import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  ThumbsUp, 
  Package, 
  Truck,
  MessageSquare,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { Order, CartItem } from '../types';

interface OrderReviewFormProps {
  order: Order;
  onSuccess?: () => void;
}

export const OrderReviewForm: React.FC<OrderReviewFormProps> = ({ order, onSuccess }) => {
  const { user, addProductReview, showToast } = useShop();

  // Selected product from order items to review
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const selectedItem: CartItem | undefined = order.items[selectedItemIndex] || order.items[0];

  // Review Form States
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [courierRating, setCourierRating] = useState<number>(5);
  const [reviewerName, setReviewerName] = useState<string>(order.customer.fullName || user.name || 'Pembeli Borongin');
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedProducts, setSubmittedProducts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`borongin_reviewed_${order.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const ratingDescriptions: Record<number, string> = {
    1: 'Sangat Kecewa 😞',
    2: 'Kurang Puas 🙁',
    3: 'Cukup Baik 😐',
    4: 'Puas & Sesuai 🙂',
    5: 'Sangat Puas & Luar Biasa! 🤩'
  };

  const quickReviewTags = [
    'Produk 100% Original',
    'Pengiriman Super Cepat',
    'Packing Sangat Tebal & Aman',
    'Respon Seller Sangat Baik',
    'Kualitas Bahan Istimewa',
    'Harga Paling Bersahabat'
  ];

  // ONLY render when order status is 'completed'
  if (order.status !== 'completed') {
    return null;
  }

  if (!selectedItem) {
    return null;
  }

  const isCurrentProductReviewed = submittedProducts.includes(selectedItem.productId);

  const handleAddTag = (tag: string) => {
    if (comment.includes(tag)) return;
    setComment((prev) => (prev ? `${prev} · ${tag}` : tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Harap tuliskan ulasan pengalaman berbelanja Anda.', 'warning');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      // Add review to the product catalog
      addProductReview(selectedItem.productId, {
        userName: reviewerName.trim() || 'Pembeli Terverifikasi',
        rating,
        comment: comment.trim(),
        verifiedPurchase: true
      });

      // Track locally that this product in this order has been reviewed
      const updatedReviewed = [...submittedProducts, selectedItem.productId];
      setSubmittedProducts(updatedReviewed);
      try {
        localStorage.setItem(`borongin_reviewed_${order.id}`, JSON.stringify(updatedReviewed));
      } catch {}

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {}

      setSubmitting(false);
      setComment('');
      showToast('Terima kasih! Ulasan bintang 5 Anda berhasil diterbitkan untuk produk ini.', 'success');

      if (onSuccess) {
        onSuccess();
      }
    }, 600);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50 rounded-3xl border-2 border-emerald-500/40 p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header with Verified Purchase & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Beri Ulasan Pesanan Selesai</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Pesanan Selesai
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Paket Anda telah tiba! Bagikan kepuasan Anda untuk membantu pembeli lain di BORONGIN.COM
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-emerald-100/70 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Purchase (Pembeli Resmi)</span>
        </div>
      </div>

      {/* If Order has multiple items, allow switching which item to review */}
      {order.items.length > 1 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Pilih Produk yang Ingin Diulas:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {order.items.map((it, idx) => {
              const isReviewed = submittedProducts.includes(it.productId);
              const isSelected = selectedItemIndex === idx;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setSelectedItemIndex(idx)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2.5 shrink-0 transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={it.product.images[0]}
                    alt={it.product.title}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="max-w-[140px] truncate text-left">{it.product.title}</span>
                  {isReviewed && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      ✓ Diulas
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Currently Selected Product Details */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={selectedItem.product.images[0]}
            alt={selectedItem.product.title}
            className="w-14 h-14 object-cover rounded-xl border border-slate-100 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
              {selectedItem.product.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{selectedItem.selectedVariation ? `Variasi: ${selectedItem.selectedVariation.name}` : selectedItem.product.brand}</span>
              <span className="text-slate-300">·</span>
              <span>Jumlah: {selectedItem.quantity} unit</span>
            </div>
          </div>
        </div>

        {isCurrentProductReviewed && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sudah Diulas</span>
          </div>
        )}
      </div>

      {/* Review Form or Already Reviewed State */}
      {isCurrentProductReviewed ? (
        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="font-extrabold text-sm text-emerald-900">
            Terima Kasih Atas Ulasan Anda!
          </h4>
          <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
            Ulasan Anda telah diverifikasi dan langsung tampil di halaman detail produk untuk membantu calon pembeli lainnya.
          </p>
          {order.items.length > 1 && submittedProducts.length < order.items.length && (
            <p className="text-xs font-bold text-emerald-800 pt-1">
              Masih ada produk lain dalam pesanan ini yang belum diulas. Pilih produk di atas untuk mengulas!
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Star Rating Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Nilai Kualitas Produk:
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const activeStar = hoverRating !== null ? hoverRating : rating;
                  const isFilled = star <= activeStar;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform focus:outline-none"
                      title={`${star} Bintang`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-slate-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 self-start sm:self-auto">
                {ratingDescriptions[hoverRating !== null ? hoverRating : rating]}
              </span>
            </div>
          </div>

          {/* 2. Courier / Service Rating */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">Kecepatan Pengiriman Kurir ({order.shippingCourier.courier}):</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCourierRating(s)}
                  className="p-0.5 hover:scale-110 transition-transform"
                >
                  <Star className={`w-4 h-4 ${s <= courierRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                </button>
              ))}
              <span className="text-[11px] font-bold text-slate-600 ml-1">({courierRating}/5)</span>
            </div>
          </div>

          {/* 3. Quick Tag Chips */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-slate-500 block">
              Pilih Kelebihan Produk (Klik untuk menambahkan ke ulasan):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickReviewTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
                    comment.includes(tag)
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Review Comment Textarea */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Komentar & Pengalaman Berbelanja:
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tuliskan ulasan jujur Anda mengenai ketepatan deskripsi produk, kerapihan packing, dan pelayanan toko..."
              className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none text-slate-800 placeholder-slate-400 shadow-inner"
              required
            />
          </div>

          {/* 5. Reviewer Name Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Nama yang Ditampilkan di Ulasan:
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
              >
                {submitting ? (
                  <span>Mengirimkan Ulasan...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Ulasan & Rating Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      )}

    </div>
  );
};
