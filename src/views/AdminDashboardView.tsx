import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Save, 
  X, 
  Truck, 
  Clock, 
  ArrowLeft, 
  DollarSign, 
  Layers, 
  SlidersHorizontal, 
  RefreshCw,
  MessageCircle,
  Phone,
  Send,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, OrderStatus } from '../types';

export const AdminDashboardView: React.FC = () => {
  const { 
    products, 
    updateProductStock, 
    addNewProduct, 
    updateProduct, 
    orders, 
    updateOrderStatus, 
    formatRupiah, 
    categories, 
    setCurrentView, 
    setIsBlueprintModalOpen, 
    showToast 
  } = useShop();

  const [activeAdminTab, setActiveAdminTab] = useState<'inventory' | 'orders' | 'whatsapp'>('inventory');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [searchAdmin, setSearchAdmin] = useState('');
  
  // WhatsApp Integration State in Admin
  const [waAdminNumber, setWaAdminNumber] = useState('6281234567890');
  const [waBusinessName, setWaBusinessName] = useState('BORONGIN.COM Official CS');
  const [waWorkingHours, setWaWorkingHours] = useState('Senin - Minggu: 08:00 - 22:00 WIB');
  const [waAutoGreeting, setWaAutoGreeting] = useState('Halo! Selamat datang di Customer Care BORONGIN.COM. Ada yang bisa kami bantu seputar pesanan atau produk Anda?');
  const [customWaTarget, setCustomWaTarget] = useState('');
  const [customWaMessage, setCustomWaMessage] = useState('Halo kak, kami dari tim BORONGIN.COM ingin mengonfirmasi pesanan Anda.');

  // Add product modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0].slug);
  const [newBrand, setNewBrand] = useState('Borongin Exclusive');
  const [newPrice, setNewPrice] = useState(99000);
  const [newOriginalPrice, setNewOriginalPrice] = useState(149000);
  const [newStock, setNewStock] = useState(25);
  const [newWeight, setNewWeight] = useState(500);
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
  const [newDescription, setNewDescription] = useState('Deskripsi produk berkualitas tinggi dengan garansi resmi.');

  // Shipped Tracking number modal state
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [inputResi, setInputResi] = useState('');

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'processing' || o.status === 'pending_payment').length;

  const handleSendWhatsAppOrder = (ord: typeof orders[0], type: 'status' | 'resi' | 'confirmation') => {
    let cleanPhone = ord.customer.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }

    let text = '';
    if (type === 'status' || type === 'confirmation') {
      text = `Halo kak ${ord.customer.fullName}! Terima kasih telah berbelanja di BORONGIN.COM.\n\nPesanan Anda *#${ord.orderNumber}* saat ini berstatus *${ord.status.toUpperCase()}* dengan total ${formatRupiah(ord.total)}.\n\nDetail pengiriman: ${ord.customer.address}, ${ord.customer.city}.\n\nJika butuh bantuan lebih lanjut, silakan balas chat ini ya kak!`;
    } else if (type === 'resi') {
      text = `Halo kak ${ord.customer.fullName}! Pesanan BORONGIN.COM Anda *#${ord.orderNumber}* telah dikirim melalui kurir *${ord.shippingCourier.courier}* dengan No. Resi: *${ord.trackingNumber || 'JT123456789ID'}*.\n\nAnda dapat melacak posisi kurir real-time di halaman Track My Order BORONGIN.COM. Terima kasih!`;
    }

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTestWhatsAppDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWaTarget.trim()) {
      showToast('Masukkan nomor WhatsApp tujuan.', 'warning');
      return;
    }
    let cleanPhone = customWaTarget.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(customWaMessage)}`, '_blank');
    showToast('Membuka chat WhatsApp...', 'success');
  };

  // Filter products for inventory table
  const filteredProducts = products.filter(p => {
    if (searchAdmin.trim()) {
      const q = searchAdmin.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    }
    if (stockFilter === 'low') return p.stock > 0 && p.stock <= p.minStockAlert;
    if (stockFilter === 'out') return p.stock <= 0;
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSku.trim()) {
      showToast('Harap isi judul dan SKU produk.', 'warning');
      return;
    }

    const discount = newOriginalPrice > newPrice ? Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100) : 0;

    addNewProduct({
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: newSku,
      category: newCategory,
      brand: newBrand,
      price: newPrice,
      originalPrice: newOriginalPrice,
      discountPercent: discount,
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0,
      stock: newStock,
      minStockAlert: 5,
      weightGrams: newWeight,
      images: [newImageUrl],
      description: newDescription,
      specifications: { 'Garansi': '12 Bulan Resmi', 'Kondisi': 'Baru 100%' },
      reviews: []
    });

    setIsAddProductOpen(false);
    setNewTitle('');
    setNewSku('');
  };

  const handleConfirmShipped = (orderId: string) => {
    const resi = inputResi.trim() || `JT${Math.floor(1000000000 + Math.random() * 9000000000)}ID`;
    updateOrderStatus(orderId, 'shipped', resi);
    setShippingOrderId(null);
    setInputResi('');
  };

  return (
    <div className="my-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Admin & Inventaris Stok
            </h1>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
              RESPONSIF
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manajemen inventaris WooCommerce, kontrol stok realtime, dan proses status order
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBlueprintModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Dokumentasi WP & WooCommerce</span>
          </button>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Total Omzet Pesanan:</span>
            <p className="text-lg sm:text-xl font-black text-slate-900">{formatRupiah(totalRevenue)}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Katalog Aktif:</span>
            <p className="text-lg sm:text-xl font-black text-slate-900">{products.length} SKU Produk</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Peringatan Stok Menipis:</span>
            <p className="text-lg sm:text-xl font-black text-amber-600">{lowStockCount} Produk</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Pesanan Perlu Diproses:</span>
            <p className="text-lg sm:text-xl font-black text-rose-600">{pendingOrdersCount} Pesanan</p>
          </div>
        </div>
      </div>

      {/* Tab Switcher: Manajemen Stok vs Kelola Pesanan vs WhatsApp CS */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('inventory')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeAdminTab === 'inventory' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Manajemen Inventaris & Stok Barang</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">{products.length}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeAdminTab === 'orders' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Kelola Transaksi Pesanan</span>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">{orders.length}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('whatsapp')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeAdminTab === 'whatsapp' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Integrasi Chat WhatsApp CS</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">ONLINE</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT TABLE & MOBILE CARDS */}
      {activeAdminTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm space-y-4">
          
          {/* Controls: Search & Stock Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Cari nama produk atau SKU..."
                value={searchAdmin}
                onChange={(e) => setSearchAdmin(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 sm:pb-0">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                  stockFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Semua ({products.length})
              </button>
              <button
                onClick={() => setStockFilter('low')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                  stockFilter === 'low' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700'
                }`}
              >
                Menipis (≤5)
              </button>
              <button
                onClick={() => setStockFilter('out')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                  stockFilter === 'out' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700'
                }`}
              >
                Habis (0)
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Produk & SKU</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Harga Jual</th>
                  <th className="py-3 px-3">Terjual</th>
                  <th className="py-3 px-3">Stok Tersedia</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= p.minStockAlert;
                  const isOut = p.stock <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Product & SKU */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-slate-800 truncate">{p.title}</p>
                            <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-slate-600 capitalize">
                        {p.category.replace(/-/g, ' ')}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {formatRupiah(p.price)}
                      </td>

                      {/* Terjual */}
                      <td className="py-3 px-3 text-slate-600">
                        {p.soldCount} unit
                      </td>

                      {/* Stock Adjustment Inline */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateProductStock(p.id, p.stock - 1)}
                            disabled={p.stock <= 0}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className={`w-8 text-center font-bold text-xs ${
                            isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-800'
                          }`}>
                            {p.stock}
                          </span>
                          <button
                            onClick={() => updateProductStock(p.id, p.stock + 1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Status Badges */}
                      <td className="py-3 px-3 text-center">
                        {isOut ? (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-300">
                            HABIS
                          </span>
                        ) : isLow ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300 animate-pulse">
                            MENIPIS
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                            AMAN
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateProductStock(p.id, p.stock + 20)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-semibold border border-emerald-200"
                            title="Restock +20 unit"
                          >
                            +20 Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards for Smartphone / Small Screens */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((p) => {
              const isLow = p.stock > 0 && p.stock <= p.minStockAlert;
              const isOut = p.stock <= 0;

              return (
                <div key={p.id} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                        {isOut ? (
                          <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-2 py-0.2 rounded-full border border-rose-300">
                            HABIS
                          </span>
                        ) : isLow ? (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.2 rounded-full border border-amber-300 animate-pulse">
                            MENIPIS
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.2 rounded-full border border-emerald-300">
                            AMAN
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-1 mt-0.5">{p.title}</h4>
                      <p className="text-xs font-extrabold text-emerald-800 mt-1">{formatRupiah(p.price)}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">Stok:</span>
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-2xs">
                        <button
                          onClick={() => updateProductStock(p.id, p.stock - 1)}
                          disabled={p.stock <= 0}
                          className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className={`w-8 text-center font-bold text-xs ${
                          isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900'
                        }`}>
                          {p.stock}
                        </span>
                        <button
                          onClick={() => updateProductStock(p.id, p.stock + 1)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-slate-600"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => updateProductStock(p.id, p.stock + 20)}
                      className="px-3 py-1.5 bg-emerald-600 active:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                    >
                      +20 Restock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 pb-2 border-b border-slate-100">
            Daftar Pesanan Toko Online
          </h3>

          {/* Desktop Orders Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">No. Order & Pelanggan</th>
                  <th className="py-3 px-3">Kurir & Ongkir</th>
                  <th className="py-3 px-3">Total Transaksi</th>
                  <th className="py-3 px-3">Metode Bayar</th>
                  <th className="py-3 px-3">Status Saat Ini</th>
                  <th className="py-3 px-3 text-right">Ubah Status & Chat WA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-mono font-bold text-slate-900">{ord.orderNumber}</p>
                      <p className="text-slate-500 text-[11px]">{ord.customer.fullName} ({ord.customer.phone})</p>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{ord.shippingCourier.courier}</p>
                      <p className="text-[10px] text-slate-400">Resi: {ord.trackingNumber || 'Belum di-pickup'}</p>
                    </td>

                    <td className="py-3 px-3 font-extrabold text-emerald-800">
                      {formatRupiah(ord.total)}
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      <span className="block font-medium">{ord.paymentMethodName}</span>
                      <span className={`text-[10px] font-bold ${ord.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {ord.paymentStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {ord.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* WhatsApp Customer Button */}
                        <button
                          onClick={() => handleSendWhatsAppOrder(ord, ord.trackingNumber ? 'resi' : 'status')}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 font-bold text-[11px]"
                          title="Kirim Notifikasi WhatsApp ke Pembeli"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat WA</span>
                        </button>

                        {ord.status === 'pending_payment' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'processing')}
                            className="px-2.5 py-1 bg-blue-600 text-white rounded text-[11px] font-bold"
                          >
                            Verifikasi Bayar
                          </button>
                        )}
                        {ord.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'packed')}
                            className="px-2.5 py-1 bg-purple-600 text-white rounded text-[11px] font-bold"
                          >
                            Kemas (Packed)
                          </button>
                        )}
                        {ord.status === 'packed' && (
                          <button
                            onClick={() => {
                              setShippingOrderId(ord.id);
                              setInputResi(`JT${Math.floor(1000000000 + Math.random() * 9000000000)}ID`);
                            }}
                            className="px-2.5 py-1 bg-indigo-600 text-white rounded text-[11px] font-bold"
                          >
                            Kirim & Input Resi
                          </button>
                        )}
                        {ord.status === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'completed')}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                          >
                            Tandai Selesai
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Orders Responsive Cards */}
          <div className="md:hidden space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200/80">
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-900">{ord.orderNumber}</span>
                    <p className="text-[11px] text-slate-500">{ord.customer.fullName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{ord.customer.phone}</p>
                  </div>
                  <span className="font-bold text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                    {ord.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Kurir:</span>
                    <span className="font-medium text-slate-700">{ord.shippingCourier.courier}</span>
                    {ord.trackingNumber && (
                      <span className="block font-mono text-[9px] text-slate-400 truncate">Resi: {ord.trackingNumber}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Tagihan:</span>
                    <span className="font-extrabold text-emerald-800">{formatRupiah(ord.total)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleSendWhatsAppOrder(ord, ord.trackingNumber ? 'resi' : 'status')}
                    className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-300 flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {ord.status === 'pending_payment' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'processing')}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                      >
                        Verifikasi Bayar
                      </button>
                    )}
                    {ord.status === 'processing' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'packed')}
                        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold"
                      >
                        Kemas
                      </button>
                    )}
                    {ord.status === 'packed' && (
                      <button
                        onClick={() => {
                          setShippingOrderId(ord.id);
                          setInputResi(`JT${Math.floor(1000000000 + Math.random() * 9000000000)}ID`);
                        }}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                      >
                        Input Resi
                      </button>
                    )}
                    {ord.status === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'completed')}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                      >
                        Selesai
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: WHATSAPP INTEGRATION & NOTIFICATIONS */}
      {activeAdminTab === 'whatsapp' && (
        <div className="space-y-6">
          
          {/* Top Banner WhatsApp Integration */}
          <div className="p-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                <MessageCircle className="w-8 h-8 text-white fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold tracking-tight">Integrasi WhatsApp Customer Care & Notifikasi</h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-400 text-slate-950">
                    AKTIF
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mt-1 max-w-xl">
                  Sistem otomatisasi komunikasi pelanggan BORONGIN.COM. Terhubung dengan floating widget pembeli, notifikasi resi, dan follow-up pesanan WooCommerce secara responsif.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto">
              <button
                onClick={() => window.open(`https://wa.me/${waAdminNumber}`, '_blank')}
                className="px-4 py-2.5 bg-white text-emerald-900 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors shadow-sm shrink-0"
              >
                <span>Uji Nomor Resmi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid 2 Columns: Configuration & Direct Messaging Tool */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 6 cols: Configuration settings */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Pengaturan Akun WhatsApp Official Toko</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Admin / CS Toko (Format Internasional):
                  </label>
                  <input
                    type="text"
                    value={waAdminNumber}
                    onChange={(e) => setWaAdminNumber(e.target.value)}
                    placeholder="Contoh: 6281234567890"
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Gunakan awalan 62 tanpa spasi atau tanda hubung (-).</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Bisnis WhatsApp:
                  </label>
                  <input
                    type="text"
                    value={waBusinessName}
                    onChange={(e) => setWaBusinessName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jam Operasional Layanan CS:
                  </label>
                  <input
                    type="text"
                    value={waWorkingHours}
                    onChange={(e) => setWaWorkingHours(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Template Salam Pembuka Otomatis:
                  </label>
                  <textarea
                    rows={3}
                    value={waAutoGreeting}
                    onChange={(e) => setWaAutoGreeting(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => showToast('Pengaturan WhatsApp toko berhasil disimpan!', 'success')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Simpan Pengaturan CS</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 6 cols: Direct WhatsApp Sender Simulator */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Kirim Pesan WhatsApp Langsung ke Pelanggan</span>
              </h4>

              <form onSubmit={handleTestWhatsAppDirect} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Penerima / Pelanggan:
                  </label>
                  <input
                    type="text"
                    value={customWaTarget}
                    onChange={(e) => setCustomWaTarget(e.target.value)}
                    placeholder="Contoh: 081288992211"
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    required
                  />
                  {orders.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="text-[10px] text-slate-400">Pilih dari pembeli:</span>
                      {orders.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setCustomWaTarget(o.customer.phone)}
                          className="text-[10px] font-mono text-emerald-700 hover:underline bg-emerald-50 px-1.5 py-0.5 rounded"
                        >
                          {o.customer.fullName.split(' ')[0]} ({o.customer.phone})
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Isi Pesan:
                  </label>
                  <textarea
                    rows={4}
                    value={customWaMessage}
                    onChange={(e) => setCustomWaMessage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 resize-none font-mono text-xs"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">
                    Akan membuka WhatsApp Web / Mobile app resmi
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Buka Chat WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Quick Notification Templates Library */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Daftar Template Otomatis Notifikasi Pesanan BORONGIN</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                  1. Konfirmasi Pembayaran
                </span>
                <p className="font-mono text-[11px] text-slate-600 line-clamp-4 leading-relaxed">
                  Halo kak [NAMA]! Pembayaran pesanan [ORDER_ID] senilai [TOTAL] telah berhasil kami terima. Pesanan sedang disiapkan tim gudang.
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('Halo kak! Pembayaran pesanan Anda telah berhasil diterima di BORONGIN.COM. Pesanan sedang disiapkan tim warehouse.');
                    showToast('Template disalin ke clipboard!', 'success');
                  }}
                  className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin Template</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded uppercase">
                  2. Info Resi & Pelacakan
                </span>
                <p className="font-mono text-[11px] text-slate-600 line-clamp-4 leading-relaxed">
                  Halo kak [NAMA]! Paket Anda telah diserahkan ke [KURIR] dengan No. Resi [AWB]. Lacak status real-time di Track My Order BORONGIN.COM.
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('Halo kak! Paket Anda telah diserahkan ke kurir dengan No. Resi. Anda dapat melacak real-time di BORONGIN.COM.');
                    showToast('Template disalin ke clipboard!', 'success');
                  }}
                  className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin Template</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase">
                  3. Undangan Review Produk
                </span>
                <p className="font-mono text-[11px] text-slate-600 line-clamp-4 leading-relaxed">
                  Paket Anda telah tiba! Puas dengan produk kami? Berikan ulasan bintang 5 di halaman Track My Order untuk mendapatkan +200 Poin Member.
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('Paket Anda telah tiba! Berikan ulasan bintang 5 di BORONGIN.COM untuk dapat bonus poin reward belanja!');
                    showToast('Template disalin ke clipboard!', 'success');
                  }}
                  className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin Template</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Input Resi Modal */}
      {shippingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <h4 className="font-bold text-sm text-slate-900">
              Input Nomor Resi Kurir
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor Resi / AWB:</label>
              <input
                type="text"
                value={inputResi}
                onChange={(e) => setInputResi(e.target.value)}
                className="w-full font-mono text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShippingOrderId(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={() => handleConfirmShipped(shippingOrderId)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Simpan & Ubah ke Dikirim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Tambah Produk Baru ke WooCommerce
              </h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Produk *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Kipas Angin Portable USB Mini Low Watt"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU Produk *</label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="BRG-ELK-999"
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Promo (Rp)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Normal (Rp)</label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Foto Produk</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Simpan Produk Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
