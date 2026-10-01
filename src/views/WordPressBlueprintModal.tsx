import React, { useState } from 'react';
import { 
  Layers, 
  X, 
  Code, 
  Database, 
  ShieldCheck, 
  CheckSquare, 
  Cpu, 
  Globe, 
  Download, 
  Copy, 
  Check, 
  CreditCard, 
  Truck, 
  SlidersHorizontal,
  FolderTree,
  Terminal
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WordPressBlueprintModal: React.FC = () => {
  const { isBlueprintModalOpen, setIsBlueprintModalOpen, showToast } = useShop();
  const [activeDocTab, setActiveDocTab] = useState<'overview' | 'plugins' | 'database' | 'payment-code' | 'shipping' | 'roadmap' | 'testing'>('overview');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isBlueprintModalOpen) return null;

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    showToast('Dokumentasi teknis berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const phpMidtransWebhookCode = `<?php
/**
 * Plugin Name: Borongin Midtrans Payment Gateway Webhook Handler
 * Description: Verifikasi aman notifikasi callback pembayaran Midtrans untuk BORONGIN.COM
 * Author: BORONGIN.COM Engineering Team
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

add_action('rest_api_init', function () {
    register_rest_route('borongin/v1', '/payment-callback', array(
        'methods'  => 'POST',
        'callback' => 'borongin_handle_payment_notification',
        'permission_callback' => '__return_true'
    ));
});

function borongin_handle_payment_notification(WP_REST_Request $request) {
    $server_key = defined('BORONGIN_PAYMENT_SERVER_KEY') ? BORONGIN_PAYMENT_SERVER_KEY : '[API_KEY_PAYMENT]';
    $params     = $request->get_json_params();

    if (empty($params)) {
        return new WP_REST_Response(array('message' => 'Empty payload'), 400);
    }

    $order_id_string    = sanitize_text_field($params['order_id'] ?? '');
    $status_code        = sanitize_text_field($params['status_code'] ?? '');
    $gross_amount       = sanitize_text_field($params['gross_amount'] ?? '');
    $signature_key      = sanitize_text_field($params['signature_key'] ?? '');
    $transaction_status = sanitize_text_field($params['transaction_status'] ?? '');
    $fraud_status       = sanitize_text_field($params['fraud_status'] ?? 'accept');

    // 1. Verifikasi Keamanan Hash SHA512 Signature Key
    $expected_hash = hash('sha512', $order_id_string . $status_code . $gross_amount . $server_key);
    if (!hash_equals($expected_hash, $signature_key)) {
        error_log('BORONGIN SECURITY ALERT: Invalid Signature Key for Order ' . $order_id_string);
        return new WP_REST_Response(array('message' => 'Unauthorized signature'), 403);
    }

    // 2. Dapatkan Objek WooCommerce Order dari Order Number (e.g. BRG-20260928-00001)
    $orders = wc_get_orders(array(
        'meta_key'   => '_borongin_order_number',
        'meta_value' => $order_id_string,
        'limit'      => 1
    ));

    if (empty($orders)) {
        return new WP_REST_Response(array('message' => 'Order not found'), 404);
    }

    $order = $orders[0];

    // 3. Update Status Order Sesuai Alur Transaksi
    if ($transaction_status == 'capture' || $transaction_status == 'settlement') {
        if ($fraud_status == 'accept') {
            $order->payment_complete($params['transaction_id'] ?? '');
            $order->update_status('processing', sprintf(__('Pembayaran berhasil diverifikasi via %s.', 'borongin'), $params['payment_type'] ?? 'Gateway'));
            $order->add_order_note(sprintf('Midtrans Settlement: Rp%s diterima.', number_format((float)$gross_amount, 0, ',', '.')));
        }
    } else if ($transaction_status == 'pending') {
        $order->update_status('pending', __('Menunggu pembayaran oleh customer.', 'borongin'));
    } else if (in_array($transaction_status, array('deny', 'expire', 'cancel'))) {
        $order->update_status('cancelled', sprintf(__('Transaksi dibatalkan gateway: %s.', 'borongin'), $transaction_status));
    }

    return new WP_REST_Response(array('status' => 'success'), 200);
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                Arsitektur & Panduan Implementasi WordPress + WooCommerce
              </h2>
              <p className="text-xs text-emerald-400">
                Dokumentasi Komprehensif Platform <strong>BORONGIN.COM</strong> (E-Commerce Modern Indonesia)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBlueprintModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs font-bold shrink-0">
          {[
            { id: 'overview', label: '1. Struktur & Stack', icon: <FolderTree className="w-3.5 h-3.5" /> },
            { id: 'plugins', label: '2. Plugin Terpilih', icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: 'database', label: '3. Skema Database', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'payment-code', label: '4. Midtrans/Xendit API', icon: <CreditCard className="w-3.5 h-3.5" /> },
            { id: 'shipping', label: '5. Ekspedisi RajaOngkir', icon: <Truck className="w-3.5 h-3.5" /> },
            { id: 'roadmap', label: '6. 10-Phase Roadmap', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
            { id: 'testing', label: '7. Checklist Pre-Launch', icon: <CheckSquare className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDocTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeDocTab === tab.id
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body Area */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* TAB 1: OVERVIEW */}
          {activeDocTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">1. Arsitektur Inti & Stack Teknologi</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Blueprint ini memandu proses deployment toko online <strong>BORONGIN.COM</strong> menggunakan Core WordPress LTS + WooCommerce dengan performa tinggi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Server Environment:</h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li>• Web Server: Nginx 1.24+ / LiteSpeed Enterprise</li>
                    <li>• PHP Version: PHP 8.2+ dengan OPcache aktif</li>
                    <li>• Database: MariaDB 10.11 / MySQL 8.0</li>
                    <li>• Memory Limit: min. 512MB (WP_MEMORY_LIMIT 512M)</li>
                    <li>• SSL: TLS 1.3 Let's Encrypt Wildcard</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">WordPress Core:</h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li>• Engine: WordPress Latest + WooCommerce v8.x+</li>
                    <li>• Base Theme: Hello Elementor / Astra Pro (Super Ringan)</li>
                    <li>• Page Builder: Elementor Pro (Theme Builder)</li>
                    <li>• REST API: WP REST API v2 + Webhooks</li>
                    <li>• Role: Super Admin, Store Manager, Customer</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Struktur URL SEO-Friendly:</h4>
                  <ul className="space-y-1 text-xs text-slate-600 font-mono">
                    <li>• /shop/ (Halaman Katalog)</li>
                    <li>• /product/%postname%/ (Detail Produk)</li>
                    <li>• /kategori/%category_name%/</li>
                    <li>• /promo/ & /blog/</li>
                    <li>• /cart/, /checkout/, /my-account/</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-1">Kredensial & Placeholder Setup:</h4>
                <p className="text-xs text-emerald-800">
                  Semua konfigurasi menggunakan placeholder standar: WhatsApp <code>[WHATSAPP_BORONGIN]</code> (+62 812-3456-7890), Email <code>[EMAIL_BORONGIN]</code> (halo@borongin.com), Payment API <code>[API_KEY_PAYMENT]</code>, dan Alamat <code>[ALAMAT_BORONGIN]</code>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PLUGINS */}
          {activeDocTab === 'plugins' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">2. Matriks Plugin Terkurasi (Bebas Konflik)</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Daftar plugin wajib dan opsional yang telah diuji kompatibilitasnya agar tidak menimbulkan konflik skrip atau query lambat.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">WAJIB (CORE STORE)</span>
                  <ul className="mt-2 space-y-2 text-xs">
                    <li><strong>WooCommerce</strong>: Engine utama produk, keranjang, variasi warna/ukuran, kupon, dan order management.</li>
                    <li><strong>Elementor Pro</strong>: Membangun custom template Header sticky, Single Product, Product Archive, dan Custom Footer.</li>
                    <li><strong>WooCommerce Multi-Step Checkout / Fluid Checkout</strong>: Membuat alur form checkout bersih tanpa distraksi.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">PEMBAYARAN & PAYMENT GATEWAY</span>
                  <ul className="mt-2 space-y-2 text-xs">
                    <li><strong>Midtrans Payment Gateway for WooCommerce</strong>: Mendukung Virtual Account BCA, BRI, BNI, Mandiri, Permata, QRIS instan, GoPay, ShopeePay, dan Kartu Kredit dengan webhook settlement instan.</li>
                    <li><strong>Xendit / Tripay (Alternatif)</strong>: Gateway cadangan untuk multi-channel VA & Indomaret/Alfamart.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">PENGIRIMAN & RAJAONGKIR</span>
                  <ul className="mt-2 space-y-2 text-xs">
                    <li><strong>Plugin Ongkos Kirim (Tonjoo) / RajaOngkir Pro</strong>: Menghitung tarif akurat J&T, JNE, SiCepat, AnterAja, Ninja Xpress, POS hingga level kecamatan/kelurahan seluruh Indonesia.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">SEO, SECURITY & PERFORMANCE</span>
                  <ul className="mt-2 space-y-2 text-xs">
                    <li><strong>Rank Math SEO Pro</strong>: Otomasi Schema.org (Product, Offer, AggregateRating, BreadcrumbList, FAQPage) dan XML Sitemap.</li>
                    <li><strong>Wordfence Security</strong>: Web Application Firewall (WAF), brute force protection, dan 2-Factor Authentication admin.</li>
                    <li><strong>LiteSpeed Cache / WP Rocket</strong>: WebP image converter, object caching Redis/Memcached, CSS/JS minification, dan lazy loading.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATABASE */}
          {activeDocTab === 'database' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">3. Struktur Tabel & Database Standar WooCommerce (HPOS)</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Mengikuti arsitektur WooCommerce High-Performance Order Storage (HPOS) untuk kecepatan baca/tulis tanpa beban tabel postmeta lama.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs">
                  <p className="font-bold text-emerald-800 mb-1">Tabel Produk & Katalog:</p>
                  <p className="text-slate-600">• <code>wp_posts</code> (post_type = 'product', 'product_variation')</p>
                  <p className="text-slate-600">• <code>wp_postmeta</code> (_regular_price, _sale_price, _sku, _stock, _weight)</p>
                  <p className="text-slate-600">• <code>wp_term_relationships</code> (Kategori produk & Brand taxonomy)</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs">
                  <p className="font-bold text-emerald-800 mb-1">Tabel Order & Pesanan (HPOS High Performance):</p>
                  <p className="text-slate-600">• <code>wp_wc_orders</code> (id, status, customer_id, billing_email, total_amount)</p>
                  <p className="text-slate-600">• <code>wp_wc_order_addresses</code> (Data alamat lengkap penerima)</p>
                  <p className="text-slate-600">• <code>wp_wc_order_operational_data</code> (shipping_tax, payment_method, date_paid)</p>
                  <p className="text-slate-600">• <code>wp_woocommerce_order_items</code> & <code>order_itemmeta</code> (Rincian barang per transaksi)</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT CODE */}
          {activeDocTab === 'payment-code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">4. Endpoint Webhook Midtrans / Xendit (PHP Snippet)</h3>
                  <p className="text-slate-500 text-xs">
                    File ini ditempatkan pada <code>wp-content/plugins/borongin-payment-webhook/borongin-payment-webhook.php</code>
                  </p>
                </div>
                <button
                  onClick={() => handleCopyCode(phpMidtransWebhookCode, 'midtrans-webhook')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Snippet PHP</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 text-slate-200 rounded-2xl font-mono text-xs overflow-x-auto max-h-[50vh]">
                <pre>{phpMidtransWebhookCode}</pre>
              </div>
            </div>
          )}

          {/* TAB 5: SHIPPING */}
          {activeDocTab === 'shipping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">5. Konfigurasi Ekspedisi Kurir Lokal & RajaOngkir</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Penetapan zona pengiriman Indonesia: JNE, SiCepat, J&T Express, GoSend, dan GrabExpress.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Kurir Reguler & Kargo:</h4>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>• <strong>JNE Express</strong>: REG, OKE, YES (Layanan Yakin Esok Sampai)</li>
                    <li>• <strong>SiCepat</strong>: SIUNTUNG, BEST, GOKIL (Kargo &gt; 10kg)</li>
                    <li>• <strong>J&T Express</strong>: EZ & Super VIP</li>
                    <li>• <strong>AnterAja</strong>: Regular & Next Day</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Instan & Same Day (Radius Jabodetabek):</h4>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>• <strong>GoSend Instant & Sameday</strong>: Titik koordinat GPS gudang BORONGIN.COM</li>
                    <li>• <strong>GrabExpress Instant</strong>: Integrasi API kurir on-demand</li>
                    <li>• Asuransi Kehilangan: Opsional 0.2% dari nilai invoice barang</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ROADMAP */}
          {activeDocTab === 'roadmap' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">6. 10-Phase Roadmap Produksi</h3>
                <p className="text-slate-500 text-xs">
                  Tahapan bertahap implementasi dari instalasi server hingga live deployment.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { phase: 'Fase 1', title: 'Setup Server Nginx & Domain', desc: 'Instalasi PHP 8.2, MariaDB 10.11, konfigurasi SSL Wildcard & CDN Cloudflare.' },
                  { phase: 'Fase 2', title: 'Instalasi WordPress LTS & WooCommerce', desc: 'Aktivasi plugin WooCommerce dan konfigurasi HPOS order storage.' },
                  { phase: 'Fase 3', title: 'Konfigurasi Mata Uang & Pajak', desc: 'Format IDR (Rp), pembulatan 0 desimal, dan setup PPN jika diperlukan.' },
                  { phase: 'Fase 4', title: 'Integrasi RajaOngkir Kurir Indonesia', desc: 'Sinkronisasi API key RajaOngkir dan penetapan titik gudang pengirim.' },
                  { phase: 'Fase 5', title: 'Payment Gateway Midtrans / Xendit', desc: 'Pengujian sandbox VA BCA, Mandiri, BRI, QRIS, dan webhook callback.' },
                  { phase: 'Fase 6', title: 'Katalog Produk & Dummy Data', desc: 'Import massal produk, penetapan SKU, foto HD, dan variasi warna/ukuran.' },
                  { phase: 'Fase 7', title: 'Pembangunan Desain UI/UX Responsif', desc: 'Pembuatan header sticky, mega menu kategori, dan filter harga katalog.' },
                  { phase: 'Fase 8', title: 'Sistem Lacak Pesanan (Track My Order)', desc: 'Fitur lookup AWB kurir dan form ulasan interaktif saat pesanan completed.' },
                  { phase: 'Fase 9', title: 'Optimasi Kecepatan & Keamanan WAF', desc: 'Cache Redis, minifikasi CSS/JS, dan proteksi brute force Wordfence.' },
                  { phase: 'Fase 10', title: 'Go-Live & Integrasi WhatsApp CS', desc: 'Uji transaksi nyata (production keys), verifikasi email notifikasi, & launch.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shrink-0">
                      {item.phase}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: TESTING */}
          {activeDocTab === 'testing' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">7. Checklist Verifikasi & Quality Assurance (QA)</h3>
                <p className="text-slate-500 text-xs">
                  Daftar uji sebelum website dibuka untuk publik pelanggan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Uji checkout tamu (guest checkout) tanpa login paksa',
                  'Verifikasi kalkulasi ongkos kirim JNE & SiCepat ke luar pulau',
                  'Simulasi pembayaran QRIS instan otomatis status "Processing"',
                  'Simulasi pembatalan otomatis order kedaluwarsa setelah 24 jam',
                  'Uji tampilan responsif di layar iPhone, Samsung & Xiaomi',
                  'Uji fungsi Track My Order dan formulir rating ulasan',
                  'Cek email konfirmasi transaksi dan template invoice PDF',
                  'Pengujian kecepatan skor Google PageSpeed Mobile di atas 90'
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-xs">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">
            Arsitektur resmi e-commerce <strong>BORONGIN.COM</strong> • Edisi 2026
          </p>
          <button
            onClick={() => setIsBlueprintModalOpen(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Tutup Dokumentasi
          </button>
        </div>

      </div>
    </div>
  );
};
