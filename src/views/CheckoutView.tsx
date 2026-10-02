import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Smartphone, 
  Building2, 
  ArrowLeft, 
  CheckCircle2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PaymentMethodType, ShippingRate, OrderCustomerInfo } from '../types';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    calculateDiscount, 
    shippingRates, 
    selectedShipping, 
    setSelectedShipping, 
    createOrder, 
    formatRupiah, 
    setCurrentView,
    user 
  } = useShop();

  // Form State
  const [formData, setFormData] = useState<OrderCustomerInfo>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address?.address || 'Jl. Merdeka No. 45, RT 02/RW 04',
    province: user?.address?.province || 'DKI Jakarta',
    city: user?.address?.city || 'Jakarta Selatan',
    district: user?.address?.district || 'Kebayoran Baru',
    subDistrict: user?.address?.subDistrict || 'Senayan',
    postalCode: user?.address?.postalCode || '12190',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('bca_va');
  const [submitting, setSubmitting] = useState(false);

  const discountAmount = calculateDiscount(cartSubtotal);
  const isFreeShipping = cartSubtotal >= 100000;
  const finalShippingCost = isFreeShipping ? 0 : selectedShipping.cost;
  const orderTotal = Math.max(0, cartSubtotal - discountAmount + finalShippingCost);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getPaymentName = (type: PaymentMethodType): string => {
    switch (type) {
      case 'bca_va': return 'BCA Virtual Account';
      case 'bri_va': return 'BRI Virtual Account';
      case 'bni_va': return 'BNI Virtual Account';
      case 'mandiri_va': return 'Mandiri Virtual Account';
      case 'bca_transfer': return 'Transfer Bank BCA Manual';
      case 'mandiri_transfer': return 'Transfer Bank Mandiri Manual';
      case 'gopay': return 'GoPay Instant E-Wallet';
      case 'ovo': return 'OVO Cash';
      case 'dana': return 'DANA Dompet Digital';
      case 'shopeepay': return 'ShopeePay';
      case 'qris': return 'QRIS (Gopay/OVO/BCA/Dana/Semua Bank)';
      case 'credit_card': return 'Kartu Kredit / Debit (Visa / Mastercard)';
      case 'cod': return 'COD (Bayar di Tempat Saat Kurir Tiba)';
      default: return 'Online Payment';
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      alert('Harap lengkapi semua kolom alamat pengiriman.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const created = createOrder({
        customer: formData,
        items: cart,
        subtotal: cartSubtotal,
        discount: discountAmount,
        shippingCost: finalShippingCost,
        shippingCourier: selectedShipping,
        total: orderTotal,
        paymentMethod,
        paymentMethodName: getPaymentName(paymentMethod),
        paymentStatus: 'unpaid',
        status: 'pending_payment',
        virtualAccountNumber: paymentMethod.includes('va') 
          ? `8809${Math.floor(1000000000 + Math.random() * 9000000000)}` 
          : undefined,
        qrisPayload: paymentMethod === 'qris' 
          ? '00020101021226590014ID.LINKAJA.WWW01189360091430000000005204599953033605802ID5912BORONGIN.COM6007JAKARTA' 
          : undefined
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      setSubmitting(false);
      setCurrentView('tracking');
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <p className="text-sm text-slate-600 mb-4">Keranjang kosong, silakan pilih produk terlebih dahulu.</p>
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
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout Pesanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Lengkapi data pengiriman dan pilih metode pembayaran resmi
          </p>
        </div>

        <button
          onClick={() => setCurrentView('cart')}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Keranjang</span>
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customer Info, Shipping Courier, Payment Gateways */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Alamat Pengiriman */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">1</span>
              <span>Alamat Pengiriman (Data Pelanggan)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Penerima *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nama Lengkap"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP Aktif *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0812xxxxxxxx"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Alamat Email (Untuk Bukti Order) *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@anda.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap (Jalan, No Rumah, RT/RW) *</label>
                <textarea
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nama jalan, gedung, nomor rumah, RT/RW, patokan..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Provinsi *</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                >
                  <option value="DKI Jakarta">DKI Jakarta</option>
                  <option value="Jawa Barat">Jawa Barat</option>
                  <option value="Jawa Tengah">Jawa Tengah</option>
                  <option value="DI Yogyakarta">DI Yogyakarta</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                  <option value="Banten">Banten</option>
                  <option value="Bali">Bali</option>
                  <option value="Sumatera Utara">Sumatera Utara</option>
                  <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Jakarta Selatan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kecamatan *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="Kebayoran Baru"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kelurahan & Kode Pos *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="12190"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan untuk Kurir (Opsional)</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Contoh: Titip di security / jangan dibanting barang pecah belah"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* 2. Pilihan Kurir & Pengiriman */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">2</span>
                <span>Opsi Jasa Pengiriman (Kurir)</span>
              </h3>
              {isFreeShipping && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Program Bebas Ongkir Aktif
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shippingRates.map((rate, idx) => {
                const isSelected = selectedShipping.courier === rate.courier && selectedShipping.service === rate.service;
                const costToDisplay = isFreeShipping ? 0 : rate.cost;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedShipping(rate)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                        <Truck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-800">
                          {rate.courier}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {rate.service} · {rate.estimatedDays}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {isFreeShipping ? (
                        <div>
                          <span className="text-xs font-black text-emerald-700">GRATIS</span>
                          <span className="line-through text-[10px] text-slate-400 block">{formatRupiah(rate.cost)}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-900">{formatRupiah(rate.cost)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Metode Pembayaran Resmi */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">3</span>
              <span>Pilih Metode Pembayaran</span>
            </h3>

            {/* Virtual Account Group */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Virtual Account Otomatis (Verifikasi Realtime)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bca_va', label: 'BCA VA' },
                  { id: 'mandiri_va', label: 'Mandiri VA' },
                  { id: 'bri_va', label: 'BRI VA' },
                  { id: 'bni_va', label: 'BNI VA' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as PaymentMethodType)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === item.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* E-Wallet & QRIS */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                QRIS & E-Wallet Instan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'qris', label: 'QRIS Scan', icon: <QrCode className="w-4 h-4 text-emerald-600" /> },
                  { id: 'gopay', label: 'GoPay', icon: <Smartphone className="w-4 h-4 text-emerald-600" /> },
                  { id: 'shopeepay', label: 'ShopeePay', icon: <Smartphone className="w-4 h-4 text-emerald-600" /> },
                  { id: 'ovo', label: 'OVO', icon: <Smartphone className="w-4 h-4 text-emerald-600" /> },
                  { id: 'dana', label: 'DANA', icon: <Smartphone className="w-4 h-4 text-emerald-600" /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as PaymentMethodType)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === item.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer Manual, Kartu & COD */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Kartu Kredit & COD
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'credit_card', label: 'Kartu Visa / Mastercard', icon: <CreditCard className="w-4 h-4 text-emerald-600" /> },
                  { id: 'cod', label: 'COD (Bayar di Tempat)', icon: <Banknote className="w-4 h-4 text-emerald-600" /> },
                  { id: 'bca_transfer', label: 'Transfer Manual BCA', icon: <Building2 className="w-4 h-4 text-emerald-600" /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as PaymentMethodType)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === item.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right: Order Summary Breakdown & Action */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 sticky top-24">
          <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">
            Ringkasan Pesanan
          </h3>

          {/* Item Mini List */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-slate-50">
            {cart.map((item) => {
              const price = item.selectedVariation ? item.selectedVariation.price : item.product.price;
              return (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.product.title}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity}x @ {formatRupiah(price)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {formatRupiah(price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Cost breakdown */}
          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal Produk ({cart.length} item)</span>
              <span className="font-semibold text-slate-800">{formatRupiah(cartSubtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>Potongan Diskon</span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Ongkos Kirim ({selectedShipping.courier})</span>
              <span>{isFreeShipping ? <strong className="text-emerald-600">GRATIS</strong> : formatRupiah(finalShippingCost)}</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-sm text-slate-900">Total Tagihan</span>
              <span className="text-xl font-black text-emerald-700">
                {formatRupiah(orderTotal)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {submitting ? (
              <span>Memproses Pesanan...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Bayar Sekarang ({formatRupiah(orderTotal)})</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center leading-normal">
            Dengan mengklik "Bayar Sekarang", Anda menyetujui Ketentuan Layanan & Kebijakan Privasi BORONGIN.COM.
          </p>

        </div>

      </form>
    </div>
  );
};
