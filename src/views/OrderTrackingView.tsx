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
  Star,
  Upload,
  AlertCircle,
  MessageCircle,
  FileCheck2,
  XCircle,
  Send
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderStatus, PaymentProof } from '../types';
import { OrderReviewForm } from '../components/OrderReviewForm';
import { 
  generateWhatsAppCustomerOrderUrl, 
  generateWhatsAppAdminReportUrl,
  OFFICIAL_WA_NUMBER_DISPLAY 
} from '../services/whatsappService';

export const OrderTrackingView: React.FC = () => {
  const { 
    orders, 
    activeOrder, 
    setActiveOrder, 
    updateOrderStatus, 
    submitPaymentProof,
    storeSettings,
    formatRupiah, 
    setCurrentView,
    showToast 
  } = useShop();

  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const order = activeOrder || orders[0];

  // Upload proof form state
  const [proofSenderName, setProofSenderName] = useState(order?.customer?.fullName || '');
  const [proofAmount, setProofAmount] = useState(order?.total?.toString() || '');
  const [proofDate, setProofDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [proofImage, setProofImage] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.orderNumber.toLowerCase() === searchOrderNumber.trim().toLowerCase());
    if (found) {
      setActiveOrder(found);
      setProofSenderName(found.customer.fullName);
      setProofAmount(found.total.toString());
      showToast(`Pesanan ${found.orderNumber} ditemukan!`, 'success');
    } else {
      showToast('Nomor pesanan tidak ditemukan. Mohon cek kembali formatnya (contoh: BRG-...)', 'warning');
    }
  };

  const handleCopy = (text: string, label: string = 'Teks') => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    showToast(`${label} berhasil disalin!`, 'success');
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleProofImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
        showToast('Foto bukti transfer berhasil dipilih!', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (!proofSenderName.trim()) {
      showToast('Harap masukkan nama pengirim transfer.', 'warning');
      return;
    }
    const numericAmount = parseFloat(proofAmount.replace(/[^0-9]/g, ''));
    if (!numericAmount || numericAmount <= 0) {
      showToast('Harap masukkan jumlah transfer yang valid.', 'warning');
      return;
    }

    const proofData: PaymentProof = {
      senderName: proofSenderName,
      orderNumber: order.orderNumber,
      transferAmount: numericAmount,
      transferDate: proofDate,
      proofImage: proofImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      uploadedAt: new Date().toLocaleString('id-ID')
    };

    submitPaymentProof(order.id, proofData);
    setIsUploadingProof(false);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">Menunggu Pembayaran</span>;
      case 'payment_verification':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-300 animate-pulse">Menunggu Verifikasi Pembayaran</span>;
      case 'paid':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">PAID (Lunas)</span>;
      case 'processing':
        return <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-300">Diproses Gudang</span>;
      case 'packed':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-300">Sedang Dikemas</span>;
      case 'shipped':
        return <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-3 py-1 rounded-full border border-cyan-300">Dalam Pengiriman</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">Pesanan Selesai</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-300">Dibatalkan</span>;
      case 'refunded':
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full border border-slate-300">Dana Dikembalikan</span>;
      case 'payment_rejected':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-300">Payment Rejected</span>;
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

  const isBcaPayment = order.paymentMethod === 'bca_transfer' || order.paymentMethod === 'bca_va';
  const isQrisPayment = order.paymentMethod === 'qris';

  return (
    <div className="my-6 space-y-6">
      {/* Header & Quick Lookup */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Status & Pelacakan Pesanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau status verifikasi transfer bank, packing gudang, dan pergerakan resi kurir
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
                onClick={() => handleCopy(order.orderNumber, 'Nomor Order')}
                className="p-1 text-slate-400 hover:text-slate-700" 
                title="Salin Nomor Pesanan"
              >
                {copiedText === order.orderNumber ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
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

        {/* WhatsApp Order Action Banner (Bagian 12 & 13) */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-4 sm:p-5 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              <span className="font-extrabold text-sm sm:text-base">Kirim Faktur & Update ke WhatsApp</span>
            </div>
            <p className="text-xs text-emerald-200 max-w-xl">
              Dapatkan salinan nota pembelian rapi ke WhatsApp Anda atau hubungi admin Borongin langsung di <strong>{OFFICIAL_WA_NUMBER_DISPLAY}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Tombol Bagian 12: PESAN VIA WHATSAPP / KIRIM ORDER KE WHATSAPP */}
            <a
              href={generateWhatsAppCustomerOrderUrl(order, formatRupiah)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>PESAN VIA WHATSAPP</span>
            </a>

            {/* Tombol Bagian 13: Notifikasi WhatsApp ke Admin */}
            <a
              href={generateWhatsAppAdminReportUrl(order, formatRupiah)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
              title="Kirimkan ringkasan faktur ini ke WhatsApp admin toko"
            >
              <Send className="w-3.5 h-3.5 text-emerald-300" />
              <span>Lapor ke Admin</span>
            </a>
          </div>
        </div>

        {/* ========================================================
            BAGIAN 7 & 9: INSTRUKSI PEMBAYARAN BCA / QRIS / VA
           ======================================================== */}
        {order.status === 'pending_payment' && (
          <div className="p-5 sm:p-6 bg-amber-50/70 border border-amber-200 rounded-3xl space-y-5">
            <div className="flex items-start gap-3 pb-3 border-b border-amber-200/70">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-amber-950">
                  Menunggu Pembayaran Sebesar {formatRupiah(order.total)}
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Silakan transfer sesuai total pembayaran ke rekening berikut agar pesanan dapat segera diproses.
                </p>
              </div>
            </div>

            {/* A. INSTRUKSI TRANSFER BANK BCA RESMI (Bagian 7) */}
            {(order.paymentMethod === 'bca_transfer' || order.paymentMethod === 'bca_va') && (
              <div className="bg-white p-5 rounded-2xl border-2 border-emerald-600/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-black text-sm flex items-center justify-center">
                      BCA
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">Rekening Resmi BORONGIN.COM</h5>
                      <p className="text-[11px] text-slate-500">Transfer Antar Bank atau Sesama BCA</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Akun Resmi Terverifikasi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank:</span>
                    <strong className="text-sm text-slate-900">{storeSettings.bcaBank}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">No. Rekening:</span>
                      <strong className="text-base font-mono font-black text-emerald-800">
                        {storeSettings.bcaAccountNumber}
                      </strong>
                    </div>
                    <button
                      onClick={() => handleCopy(storeSettings.bcaAccountNumber, 'Nomor Rekening BCA')}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                    >
                      {copiedText === storeSettings.bcaAccountNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Salin</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Atas Nama:</span>
                    <strong className="text-sm text-slate-900">{storeSettings.bcaAccountHolder}</strong>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span>Total Pembayaran Tepat:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-amber-950 font-mono">
                      {formatRupiah(order.total)}
                    </span>
                    <button
                      onClick={() => handleCopy(order.total.toString(), 'Nominal Total')}
                      className="p-1 text-amber-800 hover:text-amber-950"
                      title="Salin Nominal"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* B. INSTRUKSI PEMBAYARAN QRIS RESMI (Bagian 9 & 10) */}
            {isQrisPayment && (
              <div className="bg-white p-5 rounded-2xl border-2 border-emerald-600/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <h5 className="font-bold text-sm text-slate-900">Pembayaran QRIS Nasional</h5>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Semua Bank &amp; E-Wallet
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center p-4">
                  <div className="p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-md text-center max-w-[220px]">
                    <img 
                      src={storeSettings.qrisImage} 
                      alt="QRIS BORONGIN.COM" 
                      className="w-48 h-48 object-contain rounded-lg mx-auto"
                    />
                    <span className="text-[10px] font-bold text-slate-500 uppercase mt-2 block tracking-wider">
                      BORONGIN.COM OFFICIAL
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 max-w-sm">
                    <p className="font-bold text-slate-900 text-sm">
                      Scan QRIS menggunakan aplikasi pembayaran Anda.
                    </p>
                    <p className="leading-relaxed">
                      Buka aplikasi BCA Mobile, GoPay, OVO, DANA, ShopeePay, Mandiri Livin, BRImo, atau m-Banking Anda, pilih menu <strong>QRIS</strong>, lalu arahkan kamera ke barcode di samping.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
                      Total: <strong className="text-emerald-700 text-sm">{formatRupiah(order.total)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* C. FORMULIR UPLOAD BUKTI PEMBAYARAN (Bagian 8 & 10) */}
            <div className="pt-2">
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-amber-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-emerald-600" />
                    <h5 className="font-extrabold text-sm text-slate-900">
                      Konfirmasi &amp; Upload Bukti Pembayaran
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Langkah Verifikasi
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Setelah melakukan transfer, silakan kirimkan data dan foto bukti transfer di bawah. Status pesanan akan berubah menjadi <strong>Menunggu Verifikasi Pembayaran</strong> dan admin akan segera memproses barang Anda.
                </p>

                <form onSubmit={handleSubmitProof} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Nama Pengirim */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nama Pemilik Rekening / Pengirim:
                      </label>
                      <input
                        type="text"
                        required
                        value={proofSenderName}
                        onChange={(e) => setProofSenderName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
                      />
                    </div>

                    {/* Nomor Order */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nomor Order:
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={order.orderNumber}
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-600 cursor-not-allowed"
                      />
                    </div>

                    {/* Jumlah Transfer */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Jumlah Transfer (Rp):
                      </label>
                      <input
                        type="text"
                        required
                        value={proofAmount}
                        onChange={(e) => setProofAmount(e.target.value)}
                        placeholder="Contoh: 190000"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:bg-white focus:border-emerald-600"
                      />
                    </div>

                    {/* Tanggal Transfer */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Tanggal Transfer:
                      </label>
                      <input
                        type="date"
                        required
                        value={proofDate}
                        onChange={(e) => setProofDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Bukti Transfer Image Upload */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Bukti Transfer (Foto Struk ATM / Screenshot m-Banking):
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      {proofImage && (
                        <img
                          src={proofImage}
                          alt="Preview Bukti Transfer"
                          className="w-24 h-24 object-cover rounded-lg border border-slate-300 shrink-0 shadow-sm"
                        />
                      )}
                      <div className="flex-1 space-y-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProofImageUpload}
                          className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                        />
                        <p className="text-[11px] text-slate-400">
                          Format: JPG, PNG, atau WEBP (maks. 5MB).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Kirim Bukti Transfer */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>KIRIM BUKTI PEMBAYARAN</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* STATUS 1: MENUNGGU VERIFIKASI PEMBAYARAN (Bagian 8) */}
        {order.status === 'payment_verification' && (
          <div className="p-5 sm:p-6 bg-blue-50 border-2 border-blue-300 rounded-3xl space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-blue-950">
                  Menunggu Verifikasi Pembayaran
                </h4>
                <p className="text-xs text-blue-800 mt-0.5">
                  Bukti transfer Anda telah diterima oleh sistem finance BORONGIN.COM. Tim admin kami sedang memeriksa mutasi bank dan akan mengonfirmasi order Anda dalam waktu singkat.
                </p>
              </div>
            </div>

            {order.paymentProof && (
              <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span>Pengirim: <strong>{order.paymentProof.senderName}</strong> · </span>
                  <span>Nominal: <strong>{formatRupiah(order.paymentProof.transferAmount)}</strong> · </span>
                  <span>Tanggal: <strong>{order.paymentProof.transferDate}</strong></span>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Dalam Antrean Verifikasi Admin
                </span>
              </div>
            )}
          </div>
        )}

        {/* STATUS 2: PAYMENT REJECTED (Bagian 8) */}
        {order.status === 'payment_rejected' && (
          <div className="p-5 sm:p-6 bg-rose-50 border-2 border-rose-300 rounded-3xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-sm sm:text-base text-rose-950">
                  Pembayaran Perlu Diperiksa Kembali (Payment Rejected)
                </h4>
                <p className="text-xs text-rose-800 mt-0.5">
                  Alasan: <strong>{order.paymentProof?.rejectionReason || 'Bukti transfer tidak valid atau dana belum masuk ke mutasi rekening bank kami.'}</strong>
                </p>
                <p className="text-xs text-rose-700 mt-1">
                  Jangan khawatir, Anda dapat mengunggah kembali foto struk transfer yang jelas atau menghubungi WhatsApp CS kami untuk bantuan manual.
                </p>
              </div>
            </div>

            {/* Form Upload Ulang */}
            <div className="pt-2">
              <button
                onClick={() => updateOrderStatus(order.id, 'pending_payment')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Upload Ulang Bukti Transfer</span>
              </button>
            </div>
          </div>
        )}

        {/* STATUS 3: PAID / PROCESSING (Bagian 8) */}
        {(order.status === 'paid' || order.status === 'processing') && (
          <div className="p-5 sm:p-6 bg-emerald-50 border border-emerald-300 rounded-3xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-emerald-950">
                  Pembayaran Berhasil Dikonfirmasi (PAID)
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Dana telah diterima dan diverifikasi sukses. Pesanan Anda otomatis masuk ke tahap pemrosesan gudang.
                </p>
              </div>
            </div>
            <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-200/80 px-3 py-1 rounded-full border border-emerald-300 shrink-0">
              LUNAS
            </span>
          </div>
        )}

        {/* Courier & Tracking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Shipping & Delivery Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Detail Ekspedisi &amp; Resi</span>
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

        {/* Interactive Review Submission Form */}
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
