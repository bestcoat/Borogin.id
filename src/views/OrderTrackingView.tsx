import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Search, 
  Copy, 
  Check, 
  CreditCard, 
  QrCode, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Star
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderStatus } from '../types';
import { OrderReviewForm } from '../components/OrderReviewForm';

export const OrderTrackingView: React.FC = () => {
  const { 
    orders, 
    activeOrder, 
    setActiveOrder, 
    simulatePaymentWebhook, 
    updateOrderStatus, 
    formatRupiah, 
    setCurrentView,
    showToast 
  } = useShop();

  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [copiedVA, setCopiedVA] = useState(false);

  const order = activeOrder || orders[0];

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.orderNumber.toLowerCase() === searchOrderNumber.trim().toLowerCase());
    if (found) {
      setActiveOrder(found);
      showToast(`Pesanan ${found.orderNumber} ditemukan!`, 'success');
    } else {
      showToast('Nomor pesanan tidak ditemukan. Mohon cek kembali formatnya (contoh: BRG-...)', 'warning');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVA(true);
    showToast('Berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">Menunggu Pembayaran</span>;
      case 'processing':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-300">Diproses Admin</span>;
      case 'packed':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-300">Sedang Dikemas</span>;
      case 'shipped':
        return <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-300">Dalam Pengiriman</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">Pesanan Selesai</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-300">Dibatalkan</span>;
      case 'refunded':
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full border border-slate-300">Dana Dikembalikan</span>;
      default:
        return null;
    }
  };

  if (!order) {
    return (
      <div className="my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-800">Belum ada riwayat pesanan</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">Lakukan transaksi belanja pertama Anda di Borongin.com.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Belanja Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="my-6 space-y-6">
      {/* Header & Quick Lookup */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Status & Pelacakan Pengiriman
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau status verifikasi pembayaran, packing gudang, dan pergerakan resi kurir
          </p>
        </div>

        {/* Search Order Number Input */}
        <form onSubmit={handleSearchOrder} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari No. Order (BRG-...)"
            value={searchOrderNumber}
            onChange={(e) => setSearchOrderNumber(e.target.value)}
            className="p-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Lacak</span>
          </button>
        </form>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-sm space-y-6">
        
        {/* Top Info Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Nomor Pesanan Unik:
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono font-black text-base sm:text-lg text-emerald-800">
                {order.orderNumber}
              </span>
              <button 
                onClick={() => handleCopy(order.orderNumber)}
                className="p-1 text-slate-400 hover:text-slate-700" 
                title="Salin Nomor Pesanan"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Dibuat pada: <strong>{order.createdAt}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <div>{getStatusBadge(order.status)}</div>
            <span className="text-xs text-slate-600">
              Metode: <strong>{order.paymentMethodName}</strong>
            </span>
          </div>
        </div>

        {/* Payment Action Simulation (If Pending Payment) */}
        {order.status === 'pending_payment' && (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-amber-900">
                  Menunggu Pembayaran Sebesar {formatRupiah(order.total)}
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Silakan selesaikan pembayaran sebelum 24 jam agar pesanan tidak dibatalkan otomatis.
                </p>
              </div>
            </div>

            {/* If Virtual Account */}
            {order.virtualAccountNumber && (
              <div className="p-3.5 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500">Nomor Virtual Account ({order.paymentMethodName}):</span>
                  <p className="font-mono font-black text-lg text-slate-900 tracking-wider">
                    {order.virtualAccountNumber}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(order.virtualAccountNumber || '')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  {copiedVA ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedVA ? 'Tersalin' : 'Salin Nomor VA'}</span>
                </button>
              </div>
            )}

            {/* If QRIS */}
            {order.paymentMethod === 'qris' && (
              <div className="p-4 bg-white rounded-xl border border-amber-200 text-center space-y-3 max-w-xs mx-auto">
                <span className="text-xs font-bold text-slate-800">Scan QRIS Nasional</span>
                <div className="w-44 h-44 bg-slate-100 mx-auto rounded-xl border-2 border-slate-800 p-2 flex items-center justify-center">
                  <QrCode className="w-36 h-36 text-slate-900" />
                </div>
                <p className="text-[10px] text-slate-500">Mendukung GoPay, OVO, DANA, BCA, Mandiri, ShopeePay</p>
              </div>
            )}

            {/* Midtrans Webhook Simulation Button */}
            <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-amber-900 font-medium">
                Simulasi Payment Gateway (Midtrans / Xendit Callback Webhook):
              </span>
              <button
                onClick={() => simulatePaymentWebhook(order.id)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulasikan Pembayaran Sukses (Webhook)</span>
              </button>
            </div>
          </div>
        )}

        {/* Courier & Tracking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Shipping & Delivery Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Detail Ekspedisi & Resi</span>
            </h4>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Kurir Pengiriman:</span>
                <span className="font-bold text-slate-800">{order.shippingCourier.courier} ({order.shippingCourier.service})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimasi Tiba:</span>
                <span className="font-semibold text-slate-800">{order.shippingCourier.estimatedDays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Nomor Resi:</span>
                <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {order.trackingNumber || 'Dalam Proses Packing Gudang'}
                </span>
              </div>
            </div>

            {order.trackingNumber && (
              <button 
                onClick={() => showToast(`Melacak resi ${order.trackingNumber} via API ${order.shippingCourier.courier}... Paket on-schedule!`, 'info')}
                className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lacak di Website Ekspedisi ({order.shippingCourier.courier})</span>
              </button>
            )}
          </div>

          {/* Receiver Info */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">
              Tujuan Pengiriman
            </h4>
            <p className="font-bold text-slate-900">{order.customer.fullName} ({order.customer.phone})</p>
            <p className="text-slate-600 leading-relaxed">
              {order.customer.address}, {order.customer.subDistrict}, {order.customer.district}, {order.customer.city}, {order.customer.province} {order.customer.postalCode}
            </p>
            {order.customer.notes && (
              <p className="text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200">
                Catatan: "{order.customer.notes}"
              </p>
            )}
          </div>

        </div>

        {/* Timeline Tracking Stepper */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-sm text-slate-900">
            Riwayat Perjalanan Pesanan
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
            {order.timeline.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-xs text-slate-900">{step.title}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-sm text-slate-900">
            Produk dalam Pesanan Ini
          </h4>
          <div className="divide-y divide-slate-100">
            {order.items.map((item) => {
              const price = item.selectedVariation ? item.selectedVariation.price : item.product.price;
              return (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.product.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.selectedVariation?.name ? `Variasi: ${item.selectedVariation.name} · ` : ''}
                        {item.quantity} unit x {formatRupiah(price)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    {formatRupiah(price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Total Transaksi Keseluruhan:</span>
            <span className="text-base text-emerald-700 font-black">{formatRupiah(order.total)}</span>
          </div>
        </div>

        {/* Prompt to Complete Order & Unlock Review Form if order is Shipped */}
        {order.status === 'shipped' && (
          <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <h5 className="font-bold text-xs sm:text-sm text-emerald-950">
                  Paket Sudah Sampai di Tangan Anda?
                </h5>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                Konfirmasi penerimaan paket untuk menyelesaikan transaksi dan membuka formulir ulasan & rating produk.
              </p>
            </div>
            <button
              onClick={() => {
                updateOrderStatus(order.id, 'completed');
                showToast('Pesanan selesai! Silakan berikan ulasan Anda di bawah.', 'success');
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Konfirmasi Paket Diterima</span>
            </button>
          </div>
        )}

        {/* Interactive Review Submission Form - ONLY appears after order reaches 'Completed' status */}
        {order.status === 'completed' && (
          <div className="pt-2">
            <OrderReviewForm order={order} />
          </div>
        )}

        {/* Action button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setCurrentView('account')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Truck className="w-4 h-4" />
            <span>Buka 'Track My Order' Real-Time di Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('shop')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Belanja Produk Lainnya
          </button>
        </div>

      </div>
    </div>
  );
};
