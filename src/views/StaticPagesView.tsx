import React, { useState } from 'react';
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Send, 
  CheckCircle2,
  Building2
} from 'lucide-react';
import { useShop, AppView } from '../context/ShopContext';

interface StaticPagesViewProps {
  pageType: 'about' | 'contact' | 'faq' | 'terms' | 'privacy' | 'refund-policy';
}

export const StaticPagesView: React.FC<StaticPagesViewProps> = ({ pageType }) => {
  const { showToast, setCurrentView } = useShop();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // FAQ Accordion State (all 8 items requested in Section 44)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'Bagaimana cara membeli di BORONGIN.COM?',
      a: 'Caranya sangat mudah: 1) Pilih produk dan variasi yang diinginkan, 2) Klik "Tambah ke Keranjang" atau "Beli Sekarang", 3) Buka keranjang lalu masukkan kode kupon promo jika ada, 4) Lanjutkan ke Checkout untuk mengisi alamat pengiriman serta memilih kurir ekspedisi dan metode pembayaran resmi, 5) Selesaikan transaksi dan nomor pesanan unik (BRG-...) akan segera terbit.'
    },
    {
      q: 'Bagaimana cara pembayaran?',
      a: 'BORONGIN.COM terhubung dengan payment gateway resmi (Midtrans/Xendit). Anda dapat membayar melalui Transfer Bank (BCA, Mandiri, BRI, BNI), Virtual Account instan 24 jam tanpa perlu konfirmasi manual, E-Wallet (GoPay, OVO, DANA, ShopeePay), Scan QRIS, serta Kartu Kredit/Debit Visa & Mastercard.'
    },
    {
      q: 'Apakah bisa COD (Cash On Delivery)?',
      a: 'Ya, metode COD (Bayar di Tempat) tersedia untuk wilayah jangkauan kurir partner tertentu di kota-kota besar Indonesia. Anda cukup membayar tunai kepada kurir saat barang tiba di alamat Anda.'
    },
    {
      q: 'Berapa lama estimasi pengiriman?',
      a: 'Pengiriman reguler ke area Jabodetabek berkisar 1-2 hari kerja. Untuk pulau Jawa berkisar 2-3 hari kerja, dan ke luar pulau Jawa berkisar 3-5 hari kerja tergantung pada pilihan layanan kurir (Reguler / Next Day) yang dipilih saat checkout.'
    },
    {
      q: 'Bagaimana cara tracking (melacak) pesanan saya?',
      a: 'Anda dapat masuk ke menu "Lacak Pengiriman" di header atau melalui menu akun Anda. Masukkan nomor pesanan (contoh: BRG-20260927-00108) untuk melihat status pembayaran, pengemasan gudang, serta nomor resi pengiriman kurir.'
    },
    {
      q: 'Bagaimana cara retur (pengembalian barang)?',
      a: 'Kami memberikan jaminan Garansi Retur 7 Hari sejak paket diterima. Jika barang rusak, cacat produksi, atau tidak sesuai pesanan, rekam video unboxing dan hubungi CS WhatsApp kami di +62 812-3456-7890. Tim kami akan memandu proses penukaran barang atau refund 100% tanpa potongan.'
    },
    {
      q: 'Bagaimana cara mendapatkan voucher belanja?',
      a: 'Voucher dapat diklaim di halaman /promo/, melalui popup hadiah pengguna baru (BORONG10), voucher gratis ongkir (GRATISONGKIR min. 100rb), serta menukarkan Poin Belanja di Dashboard Akun pelanggan.'
    },
    {
      q: 'Bagaimana cara menjadi member & mengumpulkan poin?',
      a: 'Setiap pelanggan yang berbelanja otomatis terdaftar sebagai member (dimulai dari level Bronze, Silver, hingga Gold). Setiap transaksi kelipatan Rp10.000 akan otomatis menghasilkan 1 Poin Borongin yang dapat ditukar menjadi voucher potongan harga tunai kapan saja.'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    showToast('Pesan Anda berhasil dikirim ke tim customer service BORONGIN.COM!', 'success');
  };

  return (
    <div className="my-6 max-w-4xl mx-auto space-y-6">
      
      {/* 1. FAQ PAGE */}
      {pageType === 'faq' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pusat Bantuan & FAQ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Pertanyaan yang sering diajukan seputar berbelanja di BORONGIN.COM
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50 hover:bg-emerald-50/50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {idx + 1}. {item.q}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <p className="text-xs font-bold text-emerald-900">Masih membutuhkan bantuan khusus?</p>
            <p className="text-xs text-emerald-700">Hubungi Customer Service resmi via WhatsApp untuk respon instan dalam 2 menit.</p>
            <button
              onClick={() => {
                const text = encodeURIComponent('Halo CS Borongin, saya memiliki pertanyaan khusus yang belum terjawab di FAQ.');
                window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Chat CS WhatsApp Sekarang</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. TENTANG KAMI */}
      {pageType === 'about' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
              Profil Perusahaan
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Tentang BORONGIN.COM
            </h1>
            <p className="text-sm font-semibold text-emerald-700 mt-1">
              "Belanja Mudah, Harga Bersahabat"
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed text-xs sm:text-sm space-y-4">
            <p>
              <strong>BORONGIN.COM</strong> adalah platform marketplace dan toko online modern Indonesia yang dirancang untuk memberikan kemudahan berbelanja berbagai kebutuhan sehari-hari, fashion, gadget, perlengkapan rumah tangga, hingga produk-produk unggulan karya pengrajin UMKM di seluruh nusantara.
            </p>
            <p>
              Didirikan dengan tekad menghubungkan konsumen cerdas dengan produk berkualitas berharga transparan dan terjangkau, Borongin berkomitmen mendukung pemberdayaan ekonomi lokal, mempercepat digitalisasi pedagang tradisional, dan menyuguhkan standar belanja digital yang aman, cepat, dan terpercaya.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 not-prose">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 text-sm">Visi Kami</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menjadi destinasi belanja online nomor satu di Indonesia yang terpercaya, inklusif, dan mengedepankan produk karya anak bangsa dengan harga paling bersahabat.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 text-sm">Misi Kami</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menyediakan ekosistem logistik andal, gateway pembayaran instan terproteksi, serta pelayanan prima bagi pembeli, reseller, dan mitra distributor di seluruh Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. KONTAK */}
      {pageType === 'contact' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hubungi Kami
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tim support BORONGIN.COM siap membantu segala pertanyaan, kerjasama UMKM, maupun kendala transaksi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Contact Details */}
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Kantor Pusat BORONGIN.COM</span>
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Gedung Borongin Tower Lt. 12, Jl. Jend. Sudirman Kav. 52-53, Senayan, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12190
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Layanan Pelanggan WhatsApp</span>
                </h4>
                <p className="text-slate-600">
                  +62 812-3456-7890 (Aktif 24 Jam)
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Email Resmi</span>
                </h4>
                <p className="text-slate-600">
                  halo@borongin.com / cs@borongin.com
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 mb-3">
                Kirim Pesan Langsung
              </h4>

              {contactSent ? (
                <div className="p-4 bg-emerald-100 text-emerald-800 rounded-xl text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Pesan Terkirim!
                  </p>
                  <p>Terima kasih telah menghubungi kami. Tim Borongin akan membalas via email/WhatsApp dalam waktu 1x24 jam.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Nama Anda"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="email@anda.com"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp *</label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subjek Pertanyaan *</label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="Contoh: Kerjasama Reseller / Pertanyaan Produk"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pesan / Kendala Anda *</label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tuliskan pesan detail Anda..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Pesan</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 4. KEBIJAKAN PRIVASI */}
      {pageType === 'privacy' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kebijakan Privasi BORONGIN.COM
          </h1>
          <p className="text-xs text-slate-400">Terakhir diperbarui: 27 September 2026</p>

          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed text-xs sm:text-sm space-y-4">
            <p>
              Privasi Anda adalah prioritas utama di <strong>BORONGIN.COM</strong>. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat menggunakan platform kami.
            </p>
            <h4 className="font-bold text-slate-900">1. Data yang Kami Kumpulkan</h4>
            <p>
              Kami mengumpulkan informasi yang Anda berikan secara sukarela saat mendaftar atau checkout: nama lengkap, alamat pengiriman, nomor telepon, alamat email, serta catatan transaksi. Kami tidak pernah menyimpan data sensitif nomor kartu kredit atau CVV di server kami karena pembayaran diproses langsung oleh payment gateway PCI-DSS resmi.
            </p>
            <h4 className="font-bold text-slate-900">2. Penggunaan Informasi</h4>
            <p>
              Informasi Anda digunakan semata-mata untuk memproses pesanan, meneruskan label pengiriman kepada kurir partner (JNE, J&T, SiCepat), mengirimkan notifikasi resi, dan memberikan layanan purnajual resmi.
            </p>
          </div>
        </div>
      )}

      {/* 5. SYARAT & KETENTUAN */}
      {pageType === 'terms' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Syarat & Ketentuan Penggunaan
          </h1>
          <p className="text-xs text-slate-400">Terakhir diperbarui: 27 September 2026</p>

          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed text-xs sm:text-sm space-y-4">
            <p>
              Dengan mengakses dan melakukan transaksi di situs <strong>BORONGIN.COM</strong>, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan berikut.
            </p>
            <h4 className="font-bold text-slate-900">1. Akun Pelanggan & Keamanan</h4>
            <p>
              Pengguna bertanggung jawab menjaga kerahasiaan kata sandi akun masing-masing. Transaksi yang dilakukan melalui akun terdaftar dianggap sah dilakukan oleh pemilik akun.
            </p>
            <h4 className="font-bold text-slate-900">2. Harga & Ketersediaan Stok</h4>
            <p>
              Semua harga dalam mata uang Rupiah (IDR). BORONGIN.COM berhak memperbarui harga dan ketersediaan stok sewaktu-waktu tanpa pemberitahuan sebelumnya.
            </p>
          </div>
        </div>
      )}

      {/* 6. KEBIJAKAN PENGEMBALIAN (RETUR) */}
      {pageType === 'refund-policy' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kebijakan Pengembalian & Garansi Retur 7 Hari
          </h1>

          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed text-xs sm:text-sm space-y-4">
            <p>
              Kepuasan pelanggan adalah komitmen mutlak kami. Jika barang yang Anda terima dalam kondisi cacat produksi, rusak selama pengiriman, atau salah kirim variasi, Anda berhak mengajukan klaim penggantian atau pengembalian dana 100%.
            </p>
            <h4 className="font-bold text-slate-900">Syarat Klaim Retur:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Maksimal 7 hari kalender sejak status resi kurir menyatakan "Delivered / Diterima".</li>
              <li>Menyertakan video rekaman unboxing pembukaan paket yang tidak terpotong (uncut).</li>
              <li>Produk dan kelengkapan aksesoris, box kardus asli, dan kartu garansi masih utuh.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
