import React from 'react';
import { Printer, Download, ArrowLeft, CheckCircle2, ShieldCheck, Building2, QrCode } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

interface InvoiceViewProps {
  order?: Order | null;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ order: propOrder }) => {
  const { activeOrder, orders, formatRupiah, setCurrentView, storeSettings } = useShop();
  const order = propOrder || activeOrder || orders[0];

  if (!order) {
    return (
      <div className="my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <p className="text-sm text-slate-600 mb-4">Invoice tidak ditemukan.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Toko
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.orderNumber.replace('BRG-', '')}`;

  return (
    <div className="my-6 max-w-4xl mx-auto space-y-4">
      {/* Top Action Bar (Hidden on print) */}
      <div className="flex items-center justify-between print:hidden pb-2">
        <button
          onClick={() => setCurrentView('tracking')}
          className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Status Pesanan</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>DOWNLOAD / CETAK INVOICE</span>
          </button>
        </div>
      </div>

      {/* Formal Invoice Sheet */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md text-slate-900 space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Header: Brand & Invoice Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center">
                B
              </div>
              <span className="text-2xl font-black tracking-tight">BORONGIN.COM</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Belanja Mudah, Harga Bersahabat · borongin.id
            </p>
            <p className="text-[11px] text-slate-400">
              WhatsApp CS Resmi: {storeSettings.whatsappNumber}
            </p>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest block">
              FAKTUR PEMBELIAN / INVOICE RESMI
            </span>
            <p className="font-mono font-black text-lg text-slate-900">{invoiceNumber}</p>
            <p className="text-xs text-slate-500">No. Order: <strong className="font-mono text-slate-700">{order.orderNumber}</strong></p>
            <p className="text-xs text-slate-500">Tanggal: <strong className="text-slate-700">{order.createdAt}</strong></p>
          </div>
        </div>

        {/* Customer & Shipping Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-400 uppercase text-[10px] block">Diterbitkan Untuk (Customer):</span>
            <p className="font-bold text-sm text-slate-900">{order.customer.fullName}</p>
            <p className="text-slate-600 font-mono">No. WhatsApp: {order.customer.phone}</p>
            <p className="text-slate-600">Email: {order.customer.email}</p>
            <p className="text-slate-600 leading-relaxed pt-1">
              Alamat: {order.customer.address}, {order.customer.district}, {order.customer.city}, {order.customer.province} {order.customer.postalCode}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-400 uppercase text-[10px] block">Informasi Pembayaran &amp; Kurir:</span>
            <div className="flex justify-between">
              <span className="text-slate-500">Metode Bayar:</span>
              <strong className="text-slate-800">{order.paymentMethodName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status Pembayaran:</span>
              <strong className={order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}>
                {order.paymentStatus === 'paid' ? 'LUNAS (PAID)' : 'MENUNGGU PEMBAYARAN'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kurir Pengiriman:</span>
              <span className="text-slate-800 font-medium">{order.shippingCourier.courier} ({order.shippingCourier.service})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Nomor Resi:</span>
              <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {order.trackingNumber || 'Dalam Proses Packing Gudang'}
              </span>
            </div>
          </div>
        </div>

        {/* Product Items Table */}
        <div className="space-y-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-900 uppercase font-black text-[11px]">
                <th className="py-2.5 px-3">Produk &amp; Variasi</th>
                <th className="py-2.5 px-3 text-center">Jumlah</th>
                <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                <th className="py-2.5 px-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((item, idx) => {
                const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.product.price;
                return (
                  <tr key={idx}>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{item.product.title}</p>
                      {item.selectedVariation && (
                        <span className="text-[11px] text-slate-500">Variasi: {item.selectedVariation.name}</span>
                      )}
                      <span className="text-[10px] text-slate-400 block font-mono">SKU: {item.product.sku}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-medium text-slate-700">{formatRupiah(itemPrice)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{formatRupiah(itemPrice * item.quantity)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cost Breakdown & Total */}
        <div className="flex justify-end pt-2">
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Produk:</span>
              <span className="font-semibold text-slate-800">{formatRupiah(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>Potongan Diskon:</span>
                <span>-{formatRupiah(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Ongkos Kirim:</span>
              <span className="font-semibold text-slate-800">{formatRupiah(order.shippingCost)}</span>
            </div>
            <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline font-black">
              <span className="text-sm text-slate-900">TOTAL AKHIR:</span>
              <span className="text-lg text-emerald-800 font-mono">{formatRupiah(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes & Guarantee */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-700">Terima kasih telah berbelanja di BORONGIN.COM!</p>
            <p className="text-[11px]">Faktur ini sah dan diproses otomatis oleh sistem komputer BORONGIN.COM.</p>
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garansi 100% Produk Original</span>
          </div>
        </div>

      </div>
    </div>
  );
};
