import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  User, 
  MessageCircle,
  Building,
  ArrowRight,
  Star
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { fetchOrderTracking, TrackingApiResponse } from '../services/trackingApi';
import { OrderReviewForm } from './OrderReviewForm';
import { Order } from '../types';

interface TrackMyOrderPanelProps {
  initialOrderId?: string;
}

export const TrackMyOrderPanel: React.FC<TrackMyOrderPanelProps> = ({ initialOrderId }) => {
  const { orders, updateOrderStatus, formatRupiah, showToast } = useShop();

  const defaultOrderId = initialOrderId || (orders.length > 0 ? orders[0].orderNumber : 'BRG-20260927-00108');
  const [orderInput, setOrderInput] = useState<string>(defaultOrderId);
  const [loading, setLoading] = useState<boolean>(false);
  const [trackingData, setTrackingData] = useState<TrackingApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleTrack = async (targetId?: string) => {
    const idToQuery = (targetId || orderInput).trim();
    if (!idToQuery) {
      setError('Harap masukkan nomor order ID pesanan Anda.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchOrderTracking(idToQuery, orders);
      setTrackingData(data);
      setOrderInput(data.orderNumber);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat status pengiriman. Silakan coba kembali.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleTrack(defaultOrderId);
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast(`${label} berhasil disalin!`, 'success');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleWhatsAppCourier = (driverName?: string, awb?: string) => {
    const msg = encodeURIComponent(
      `Halo mas ${driverName || 'Kurir'}, saya penerima paket BORONGIN.COM dengan No. Resi ${awb}. Boleh info estimasi jam pengantaran ke rumah hari ini? Terima kasih!`
    );
    window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header of Track My Order */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Track My Order (Lacak Pengiriman Real-Time)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cek posisi kurir, nomor resi AWB, dan estimasi waktu tiba pesanan Anda via API logistik resmi
          </p>
        </div>

        <button
          onClick={() => handleTrack()}
          disabled={loading}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Perbarui Data Realtime</span>
        </button>
      </div>

      {/* Search Input Bar with Quick Select Badges */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              placeholder="Masukkan ID Pesanan (contoh: BRG-20260927-00108)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Melacak API...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Lacak Pesanan</span>
              </>
            )}
          </button>
        </form>

        {/* Quick select pills from user's actual orders */}
        {orders.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Pesanan Anda:</span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => {
                  setOrderInput(ord.orderNumber);
                  handleTrack(ord.orderNumber);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all border ${
                  orderInput.toLowerCase() === ord.orderNumber.toLowerCase()
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {ord.orderNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading state skeleton */}
      {loading && (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3 animate-pulse">
          <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto flex items-center justify-center text-emerald-600">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-xs font-bold text-slate-800">Menghubungkan ke Mock API Gateway Logistik...</p>
          <p className="text-[11px] text-slate-400">Sinkronisasi status kurir J&T / SiCepat / JNE real-time</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-700 font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>Pesanan Tidak Ditemukan</span>
          </div>
          <p className="text-rose-600 leading-relaxed">{error}</p>
          <p className="text-[11px] text-slate-500">
            Tips: Pastikan format Order ID sesuai dengan yang tertera di email bukti pembayaran (contoh: <code>BRG-20260927-00108</code>).
          </p>
        </div>
      )}

      {/* Tracking Data Results */}
      {trackingData && !loading && (
        <div className="space-y-6">
          
          {/* Main Delivery Status Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
              <div>
                <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                  Status Pengiriman Saat Ini:
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping"></span>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                    {trackingData.currentStatusLabel}
                  </h3>
                </div>
                <p className="text-xs text-emerald-100 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>Lokasi Terakhir: <strong>{trackingData.currentCheckpointLocation}</strong></span>
                </p>
              </div>

              {/* Estimated Delivery Date Card */}
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 self-start sm:self-auto text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Estimasi Tiba:</span>
                </span>
                <p className="text-base sm:text-lg font-black text-white mt-0.5">
                  {trackingData.estimatedDeliveryDate}
                </p>
                <p className="text-[11px] text-emerald-200">
                  {trackingData.estimatedDeliveryTimeRange} · <strong>{trackingData.daysRemainingText}</strong>
                </p>
              </div>
            </div>

            {/* Delivery Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-100 font-semibold">
                <span>Progress Pengiriman Paket</span>
                <span>{trackingData.progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-300 to-emerald-300 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${trackingData.progressPercent}%` }}
                ></div>
              </div>

              {/* 5 Milestone Steps */}
              <div className="grid grid-cols-5 text-center text-[10px] sm:text-[11px] text-emerald-200 pt-1 font-medium">
                <span className={trackingData.progressPercent >= 20 ? 'text-amber-300 font-bold' : ''}>Dipesan</span>
                <span className={trackingData.progressPercent >= 40 ? 'text-amber-300 font-bold' : ''}>Diproses</span>
                <span className={trackingData.progressPercent >= 60 ? 'text-amber-300 font-bold' : ''}>Dikemas</span>
                <span className={trackingData.progressPercent >= 80 ? 'text-amber-300 font-bold' : ''}>Diantar Kurir</span>
                <span className={trackingData.progressPercent >= 100 ? 'text-amber-300 font-bold' : ''}>Tiba</span>
              </div>
            </div>
          </div>

          {/* Logistics & Courier Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Courier Info */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Jasa Ekspedisi:
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 font-black">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{trackingData.courier.name}</h4>
                  <p className="text-[11px] text-slate-500">{trackingData.courier.service}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">No. Resi (AWB):</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">{trackingData.awbNumber}</span>
                </div>
                <button
                  onClick={() => handleCopy(trackingData.awbNumber, 'Nomor Resi')}
                  className="p-1.5 bg-white hover:bg-slate-100 rounded-lg text-slate-600 border border-slate-200 transition-colors"
                  title="Salin No Resi"
                >
                  {copiedText === 'Nomor Resi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Courier Driver Details */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Kurir Pengantar (Sprinter):
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{trackingData.courier.driverName || 'Kurir Ekspedisi'}</h4>
                  <p className="text-[11px] text-slate-500">{trackingData.courier.vehicleType || 'Motor Pengantar'}</p>
                </div>
              </div>
              <button
                onClick={() => handleWhatsAppCourier(trackingData.courier.driverName, trackingData.awbNumber)}
                className="w-full mt-2 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border border-emerald-300 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat WhatsApp Kurir</span>
              </button>
            </div>

            {/* Destination & Recipient */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Tujuan Pengantaran:
              </span>
              <h4 className="font-bold text-slate-900">{trackingData.recipient.name} ({trackingData.recipient.phone})</h4>
              <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                {trackingData.recipient.address}
              </p>
              <div className="pt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Garansi Pengantaran Aman BORONGIN.COM</span>
              </div>
            </div>
          </div>

          {/* Interactive Checkpoints Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Riwayat Pergerakan Paket (Real-time Log)</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                Sinkronisasi: {trackingData.lastUpdated}
              </span>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {trackingData.checkpoints.map((cp, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white ${
                      cp.isCurrent
                        ? 'bg-emerald-600 text-white ring-emerald-100 animate-pulse'
                        : cp.isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-300 text-white'
                    }`}
                  >
                    {cp.isCompleted ? (
                      <Check className="w-2.5 h-2.5" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <h5 className={`text-xs font-bold ${cp.isCurrent ? 'text-emerald-700' : 'text-slate-800'}`}>
                          {cp.status}
                        </h5>
                        {cp.isCurrent && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase px-2 py-0.2 rounded-full">
                            Aktif
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{cp.timestamp}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{cp.location}</span>
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                      {cp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items in this Order Summary */}
          {trackingData.itemsSummary.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Produk yang Dikirim dalam Paket Ini ({trackingData.itemsSummary.length} Item)
              </h4>
              <div className="divide-y divide-slate-200/60">
                {trackingData.itemsSummary.map((item, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.image && (
                        <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-400">{item.quantity} unit x {formatRupiah(item.price)}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 shrink-0">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logic to determine if order is completed and construct Order object for review */}
          {(() => {
            const matchingOrder = orders.find(
              (o) => o.orderNumber.toLowerCase() === trackingData.orderNumber.toLowerCase()
            );

            const isOrderCompleted = matchingOrder
              ? matchingOrder.status === 'completed'
              : trackingData.currentStatus === 'delivered';

            const effectiveOrderForReview: Order | null = matchingOrder || (isOrderCompleted ? {
              id: `mock-${trackingData.orderNumber}`,
              orderNumber: trackingData.orderNumber,
              customer: {
                fullName: trackingData.recipient.name,
                phone: trackingData.recipient.phone,
                email: 'customer@borongin.com',
                address: trackingData.recipient.address,
                province: 'DKI Jakarta',
                city: 'Jakarta Selatan',
                district: 'Kebayoran Baru',
                subDistrict: 'Senayan',
                postalCode: '12190'
              },
              items: trackingData.itemsSummary.map((it, idx) => ({
                id: `item-${idx}`,
                productId: 'p-1',
                product: {
                  id: 'p-1',
                  title: it.title,
                  slug: 'item-slug',
                  sku: trackingData.orderNumber,
                  price: it.price,
                  originalPrice: it.price * 1.3,
                  rating: 4.9,
                  reviewCount: 120,
                  soldCount: 890,
                  stock: 20,
                  minStockAlert: 5,
                  category: 'elektronik',
                  brand: 'BORONGIN Official',
                  images: [it.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'],
                  description: it.title,
                  specifications: {},
                  weightGrams: 300,
                  reviews: [],
                  createdAt: '2026-09-01'
                },
                quantity: it.quantity
              })),
              subtotal: trackingData.totalAmount,
              discount: 0,
              shippingCost: 14000,
              shippingCourier: {
                courier: trackingData.courier.name,
                service: trackingData.courier.service,
                cost: 14000,
                estimatedDays: '1-2 Hari'
              },
              total: trackingData.totalAmount,
              paymentMethod: 'bca_va',
              paymentMethodName: trackingData.paymentMethod,
              paymentStatus: 'paid',
              status: 'completed',
              trackingNumber: trackingData.awbNumber,
              createdAt: '2026-09-27',
              timeline: []
            } : null);

            return (
              <div className="space-y-4 pt-2">
                {/* Prompt to mark order completed if currently shipped / out for delivery */}
                {matchingOrder && matchingOrder.status === 'shipped' && (
                  <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <h5 className="font-bold text-xs sm:text-sm text-emerald-950">
                          Paket Sudah Tiba di Alamat Anda?
                        </h5>
                      </div>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Konfirmasi paket telah diterima dengan baik untuk menyelesaikan pesanan dan membuka formulir ulasan produk.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        updateOrderStatus(matchingOrder.id, 'completed');
                        handleTrack(matchingOrder.orderNumber);
                        showToast('Pesanan selesai! Formulir ulasan produk kini telah aktif di bawah.', 'success');
                      }}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Konfirmasi Paket Diterima</span>
                    </button>
                  </div>
                )}

                {/* Interactive Review Submission Form - ONLY appears after order reaches 'Completed' status */}
                {isOrderCompleted && effectiveOrderForReview && (
                  <OrderReviewForm
                    order={effectiveOrderForReview}
                    onSuccess={() => handleTrack(trackingData.orderNumber)}
                  />
                )}
              </div>
            );
          })()}

        </div>
      )}
    </div>
  );
};
