import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Package, 
  Layers,
  Boxes,
  ShoppingCart,
  CreditCard,
  Truck,
  Users,
  Ticket,
  Flame,
  Star,
  BarChart3,
  Settings,
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Save, 
  X, 
  Clock, 
  DollarSign, 
  RefreshCw,
  MessageCircle,
  Phone,
  Send,
  ExternalLink,
  ShieldCheck, 
  Check, 
  Copy,
  Upload,
  Eye,
  EyeOff,
  Filter,
  FileText,
  Download,
  KeyRound,
  XCircle,
  CheckCheck,
  ChevronRight,
  LogOut,
  QrCode,
  Tag,
  Building2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, OrderStatus, ProductVariation, PaymentProof } from '../types';
import { OFFICIAL_WA_NUMBER_DISPLAY, OFFICIAL_WA_NUMBER_INTL, generateWhatsAppAdminReportUrl } from '../services/whatsappService';
import { changeMasterPassword, OFFICIAL_ADMIN_USERNAME } from '../services/adminAuth';

type AdminTab = 
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'stock'
  | 'orders'
  | 'payments'
  | 'shipping'
  | 'customers'
  | 'coupons'
  | 'promos'
  | 'reviews'
  | 'reports'
  | 'settings';

export const AdminDashboardView: React.FC = () => {
  const { 
    products, 
    updateProductStock, 
    addNewProduct, 
    updateProduct, 
    orders, 
    updateOrderStatus, 
    confirmPayment,
    rejectPayment,
    formatRupiah, 
    categories, 
    coupons,
    storeSettings,
    updateStoreSettings,
    adminLogout,
    setCurrentView, 
    showToast 
  } = useShop();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchAdmin, setSearchAdmin] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low' | 'out'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Product Modal State (Add or Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.slug || 'produk-umkm');
  const [formBrand, setFormBrand] = useState('Borongin Exclusive');
  const [formPrice, setFormPrice] = useState(99000);
  const [formOriginalPrice, setFormOriginalPrice] = useState(149000);
  const [formStock, setFormStock] = useState(25);
  const [formMinStock, setFormMinStock] = useState(5);
  const [formWeight, setFormWeight] = useState(500);
  const [formDimensions, setFormDimensions] = useState('20 x 15 x 5 cm');
  const [formMainImage, setFormMainImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([]);
  const [formNewGalleryUrl, setFormNewGalleryUrl] = useState('');
  const [formDescription, setFormDescription] = useState('Deskripsi produk berkualitas tinggi dengan garansi resmi dari BORONGIN.COM.');
  const [formStatus, setFormStatus] = useState<'published' | 'draft' | 'out_of_stock' | 'inactive'>('published');
  const [formVariations, setFormVariations] = useState<ProductVariation[]>([]);
  const [newVarName, setNewVarName] = useState('');
  const [newVarPrice, setNewVarPrice] = useState(99000);
  const [newVarStock, setNewVarStock] = useState(10);
  const [newVarSku, setNewVarSku] = useState('');

  // Shipping Tracking Modal
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [inputResi, setInputResi] = useState('');

  // Payment Rejection Modal
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Bukti transfer tidak valid atau dana belum masuk rekening BCA.');

  // Settings State
  const [bcaBank, setBcaBank] = useState(storeSettings.bcaBank);
  const [bcaAccountNum, setBcaAccountNum] = useState(storeSettings.bcaAccountNumber);
  const [bcaAccountName, setBcaAccountName] = useState(storeSettings.bcaAccountHolder);
  const [qrisImageUrl, setQrisImageUrl] = useState(storeSettings.qrisImage);
  const [isCodActive, setIsCodActive] = useState(storeSettings.isCodEnabled);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(storeSettings.freeShippingMin);
  const [taglineText, setTaglineText] = useState(storeSettings.storeTagline);

  // Security / Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Category creation
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  // Coupon creation
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed' | 'free_shipping'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState(100000);

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const pendingPaymentOrders = orders.filter(o => o.status === 'pending_payment').length;
  const verificationNeededOrders = orders.filter(o => o.status === 'payment_verification').length;
  const processingOrdersCount = orders.filter(o => o.status === 'processing' || o.status === 'paid').length;

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setFormTitle('');
    setFormSku(`BRG-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormCategory(categories[0]?.slug || 'produk-umkm');
    setFormBrand('Borongin Exclusive');
    setFormPrice(99000);
    setFormOriginalPrice(149000);
    setFormStock(25);
    setFormMinStock(5);
    setFormWeight(500);
    setFormDimensions('20 x 15 x 5 cm');
    setFormMainImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
    setFormGalleryImages([]);
    setFormDescription('Deskripsi produk berkualitas tinggi dengan garansi resmi dari BORONGIN.COM.');
    setFormStatus('published');
    setFormVariations([]);
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormTitle(prod.title);
    setFormSku(prod.sku);
    setFormCategory(prod.category);
    setFormBrand(prod.brand);
    setFormPrice(prod.price);
    setFormOriginalPrice(prod.originalPrice);
    setFormStock(prod.stock);
    setFormMinStock(prod.minStockAlert);
    setFormWeight(prod.weightGrams);
    setFormDimensions(prod.dimensions || '20 x 15 x 5 cm');
    setFormMainImage(prod.images[0] || '');
    setFormGalleryImages(prod.images.slice(1));
    setFormDescription(prod.description);
    setFormStatus(prod.status || (prod.stock <= 0 ? 'out_of_stock' : 'published'));
    setFormVariations(prod.variations || []);
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSku.trim()) {
      showToast('Harap isi nama produk dan SKU.', 'warning');
      return;
    }

    const discount = formOriginalPrice > formPrice 
      ? Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100) 
      : 0;

    const allImages = [formMainImage, ...formGalleryImages.filter(url => url.trim().length > 0)];

    if (editingProductId) {
      updateProduct(editingProductId, {
        title: formTitle,
        sku: formSku,
        category: formCategory,
        brand: formBrand,
        price: formPrice,
        originalPrice: formOriginalPrice,
        discountPercent: discount,
        stock: formStock,
        minStockAlert: formMinStock,
        weightGrams: formWeight,
        dimensions: formDimensions,
        images: allImages,
        description: formDescription,
        status: formStatus,
        variations: formVariations
      });
      showToast(`Produk "${formTitle}" berhasil diperbarui!`, 'success');
    } else {
      addNewProduct({
        title: formTitle,
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: formSku,
        category: formCategory,
        brand: formBrand,
        price: formPrice,
        originalPrice: formOriginalPrice,
        discountPercent: discount,
        rating: 5.0,
        reviewCount: 0,
        soldCount: 0,
        stock: formStock,
        minStockAlert: formMinStock,
        weightGrams: formWeight,
        dimensions: formDimensions,
        images: allImages,
        description: formDescription,
        specifications: {
          'Merek': formBrand,
          'Kategori': formCategory,
          'Berat': `${formWeight} gram`,
          'Dimensi': formDimensions,
          'Garansi': '1 Tahun Resmi Toko'
        },
        status: formStatus,
        variations: formVariations,
        reviews: []
      });
      showToast(`Produk baru "${formTitle}" berhasil ditambahkan ke katalog!`, 'success');
    }

    setIsProductModalOpen(false);
  };

  // Delete product handler
  const handleDeleteProduct = (prod: Product) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${prod.title}" (SKU: ${prod.sku})?`)) {
      updateProduct(prod.id, { status: 'inactive' });
      showToast(`Produk "${prod.title}" telah dinonaktifkan dari katalog toko.`, 'info');
    }
  };

  // Toggle activate / deactivate product
  const handleToggleProductStatus = (prod: Product) => {
    const newStatus = prod.status === 'inactive' ? 'published' : 'inactive';
    updateProduct(prod.id, { status: newStatus });
    showToast(`Status produk "${prod.title}" diubah menjadi: ${newStatus.toUpperCase()}`, 'success');
  };

  // Add variation to form
  const handleAddVariation = () => {
    if (!newVarName.trim()) return;
    const newVar: ProductVariation = {
      id: `var-${Date.now()}`,
      name: newVarName,
      price: newVarPrice,
      stock: newVarStock,
      sku: newVarSku || `${formSku}-${newVarName.toUpperCase().replace(/\s+/g, '-')}`
    };
    setFormVariations([...formVariations, newVar]);
    setNewVarName('');
    setNewVarSku('');
  };

  // Save Store Settings (QRIS, BCA, Tagline, COD)
  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      bcaBank,
      bcaAccountNumber: bcaAccountNum,
      bcaAccountHolder: bcaAccountName,
      qrisImage: qrisImageUrl,
      isCodEnabled: isCodActive,
      freeShippingMin: freeShippingThreshold,
      storeTagline: taglineText
    });
    showToast('Pengaturan toko (BCA, QRIS, COD) berhasil disimpan!', 'success');
  };

  // Change Admin Master Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast('Konfirmasi password baru tidak cocok.', 'error');
      return;
    }
    const res = await changeMasterPassword(oldPassword, newPassword);
    if (res.success) {
      showToast(res.message, 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Send WhatsApp to Customer
  const handleWhatsAppCustomer = (ord: typeof orders[0], type: 'status' | 'resi') => {
    let cleanPhone = ord.customer.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
    else if (!cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;

    let text = '';
    if (type === 'status') {
      text = `Halo kak ${ord.customer.fullName}! Kami dari tim Admin BORONGIN.COM menginformasikan bahwa pesanan Anda *#${ord.orderNumber}* saat ini berstatus *${ord.status.toUpperCase()}* dengan total tagihan ${formatRupiah(ord.total)}. Terima kasih!`;
    } else {
      text = `Halo kak ${ord.customer.fullName}! Pesanan BORONGIN.COM Anda *#${ord.orderNumber}* telah dikirim via *${ord.shippingCourier.courier}* dengan No. Resi: *${ord.trackingNumber || 'JT123456789ID'}*. Anda dapat melacaknya langsung di web kami. Terima kasih!`;
    }
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
    if (searchAdmin.trim()) {
      const q = searchAdmin.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    }
    if (stockStatusFilter === 'low') return p.stock > 0 && p.stock <= p.minStockAlert;
    if (stockStatusFilter === 'out') return p.stock <= 0;
    return true;
  });

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (searchAdmin.trim()) {
      const q = searchAdmin.toLowerCase();
      if (!o.orderNumber.toLowerCase().includes(q) && !o.customer.fullName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Sidebar navigation menu items
  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Produk', icon: <Package className="w-4 h-4" />, badge: products.length },
    { id: 'categories', label: 'Kategori', icon: <Layers className="w-4 h-4" />, badge: categories.length },
    { id: 'stock', label: 'Stok', icon: <Boxes className="w-4 h-4" />, badge: lowStockCount > 0 ? `${lowStockCount} alert` : undefined, badgeColor: 'bg-amber-500 text-white' },
    { id: 'orders', label: 'Pesanan', icon: <ShoppingCart className="w-4 h-4" />, badge: orders.length },
    { id: 'payments', label: 'Pembayaran', icon: <CreditCard className="w-4 h-4" />, badge: verificationNeededOrders > 0 ? `${verificationNeededOrders} verifikasi` : undefined, badgeColor: 'bg-blue-600 text-white' },
    { id: 'shipping', label: 'Pengiriman', icon: <Truck className="w-4 h-4" /> },
    { id: 'customers', label: 'Customer', icon: <Users className="w-4 h-4" /> },
    { id: 'coupons', label: 'Voucher', icon: <Ticket className="w-4 h-4" />, badge: coupons.length },
    { id: 'promos', label: 'Promo', icon: <Flame className="w-4 h-4" /> },
    { id: 'reviews', label: 'Review', icon: <Star className="w-4 h-4" /> },
    { id: 'reports', label: 'Laporan', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="my-6 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 p-5 sm:p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-800/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-black text-xl shadow-inner">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Admin Dashboard BORONGIN</h1>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                PRODUKSI
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Kelola Inventaris, Verifikasi Pembayaran BCA &amp; QRIS, Resi Kurir, dan Notifikasi WhatsApp Resmi ({OFFICIAL_WA_NUMBER_DISPLAY})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          {/* View Storefront Button for Administrators */}
          <button
            onClick={() => setCurrentView('home')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white rounded-xl text-xs font-bold border border-white/15 flex items-center gap-1.5 transition-colors"
            title="Buka Halaman Depan Toko"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Lihat Toko</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-3.5 py-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Admin Grid Layout: Sidebar Navigation (Left) + Content Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Menu */}
        <aside className="lg:col-span-3 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="px-3 py-2 border-b border-slate-100 mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Menu Navigasi Toko
            </span>
            <span className="text-xs font-extrabold text-slate-800">
              Admin: @{OFFICIAL_ADMIN_USERNAME}
            </span>
          </div>

          <div className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      isActive 
                        ? 'bg-white/25 text-white' 
                        : (item.badgeColor || 'bg-slate-100 text-slate-600')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Main Content View */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* =========================================================
              1. TAB: DASHBOARD (Overview & High-Level Metrics)
             ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 4 Primary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase">Total Omzet</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-lg sm:text-xl font-black text-slate-900">{formatRupiah(totalRevenue)}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">Transaksi Terbayar Lunas</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase">Katalog Aktif</span>
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-lg sm:text-xl font-black text-slate-900">{products.length} SKU</p>
                  <span className="text-[10px] text-slate-500 font-medium">Dalam {categories.length} Kategori</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase">Verifikasi Bukti</span>
                    <CreditCard className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-lg sm:text-xl font-black text-amber-600">{verificationNeededOrders} Order</p>
                  <span className="text-[10px] text-amber-700 font-semibold">Butuh Verifikasi BCA/QRIS</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase">Alert Stok</span>
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-lg sm:text-xl font-black text-rose-600">{lowStockCount + outOfStockCount} SKU</p>
                  <span className="text-[10px] text-rose-700 font-semibold">{outOfStockCount} Habis · {lowStockCount} Menipis</span>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Banner */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    <span>Pesanan Masuk Terbaru</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <span>Lihat Semua Pesanan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                        <th className="py-2.5 px-3">No. Order</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Pembayaran</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{ord.orderNumber}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700">{ord.customer.fullName}</td>
                          <td className="py-2.5 px-3 font-extrabold text-emerald-800">{formatRupiah(ord.total)}</td>
                          <td className="py-2.5 px-3 text-slate-600">{ord.paymentMethodName}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => { setActiveTab('orders'); }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[11px]"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              2. TAB: PRODUK (Katalog & Manajemen Tambah / Edit)
             ========================================================= */}
          {activeTab === 'products' && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Manajemen Katalog Produk</h3>
                  <p className="text-xs text-slate-500">Tambah, ubah harga, foto, deskripsi, SKU, bobot, dan variasi</p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk Baru</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Cari nama produk atau SKU..."
                    value={searchAdmin}
                    onChange={(e) => setSearchAdmin(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option value="all">Semua Kategori ({categories.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                      <th className="py-3 px-3">Produk &amp; Foto</th>
                      <th className="py-3 px-3">SKU</th>
                      <th className="py-3 px-3">Kategori</th>
                      <th className="py-3 px-3">Harga</th>
                      <th className="py-3 px-3">Stok</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const isInactive = p.status === 'inactive';
                      return (
                        <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${isInactive ? 'opacity-60 bg-slate-50/50' : ''}`}>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <img src={p.images[0]} alt={p.title} className="w-11 h-11 object-cover rounded-lg border border-slate-200 shrink-0" />
                              <div className="min-w-0 max-w-xs">
                                <p className="font-bold text-slate-800 truncate">{p.title}</p>
                                <span className="text-[11px] text-slate-400">{p.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-700">{p.sku}</td>
                          <td className="py-3 px-3 text-slate-600 capitalize">{p.category.replace(/-/g, ' ')}</td>
                          <td className="py-3 px-3 font-extrabold text-emerald-800">{formatRupiah(p.price)}</td>
                          <td className="py-3 px-3">
                            <span className={`font-black text-xs ${p.stock <= 0 ? 'text-rose-600' : p.stock <= p.minStockAlert ? 'text-amber-600' : 'text-slate-800'}`}>
                              {p.stock} unit
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              isInactive 
                                ? 'bg-slate-200 text-slate-600'
                                : (p.stock <= 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800')
                            }`}>
                              {isInactive ? 'INACTIVE' : (p.stock <= 0 ? 'OUT OF STOCK' : 'PUBLISHED')}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                title="Edit Data Produk"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleToggleProductStatus(p)}
                                className={`px-2 py-1 rounded text-[10px] font-bold ${
                                  isInactive ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                                title="Aktifkan / Nonaktifkan Produk"
                              >
                                {isInactive ? 'Aktifkan' : 'Nonaktif'}
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                                title="Hapus Produk"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================
              3. TAB: KATEGORI (Kategori Toko & Tambah Kategori)
             ========================================================= */}
          {activeTab === 'categories' && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">Kategori Produk BORONGIN.COM</h3>
                <p className="text-xs text-slate-500">Daftar kategori produk aktif di website</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{cat.name}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">slug: {cat.slug}</span>
                    </div>
                    <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {products.filter(p => p.category === cat.slug).length} Produk
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              4. TAB: STOK (Manajemen Stok & Alert Menipis / Habis)
             ========================================================= */}
          {activeTab === 'stock' && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Manajemen &amp; Peringatan Stok Barang</h3>
                  <p className="text-xs text-slate-500">Pantau stok saat ini, produk terjual, dan status peringatan</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setStockStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold ${stockStatusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    Semua ({products.length})
                  </button>
                  <button
                    onClick={() => setStockStatusFilter('low')}
                    className={`px-3 py-1.5 rounded-lg font-bold ${stockStatusFilter === 'low' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700'}`}
                  >
                    Hampir Habis ({lowStockCount})
                  </button>
                  <button
                    onClick={() => setStockStatusFilter('out')}
                    className={`px-3 py-1.5 rounded-lg font-bold ${stockStatusFilter === 'out' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700'}`}
                  >
                    Stok Habis ({outOfStockCount})
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                      <th className="py-3 px-3">Produk &amp; SKU</th>
                      <th className="py-3 px-3">Stok Saat Ini</th>
                      <th className="py-3 px-3">Produk Terjual</th>
                      <th className="py-3 px-3">Stok Minimum</th>
                      <th className="py-3 px-3">Status Stok</th>
                      <th className="py-3 px-3 text-right">Ubah Stok Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const isLow = p.stock > 0 && p.stock <= p.minStockAlert;
                      const isOut = p.stock <= 0;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-800 block">{p.title}</span>
                            <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                          </td>
                          <td className="py-3 px-3 font-extrabold text-slate-900 text-sm">{p.stock} unit</td>
                          <td className="py-3 px-3 text-slate-600 font-semibold">{p.soldCount} terjual</td>
                          <td className="py-3 px-3 text-slate-500">{p.minStockAlert} unit</td>
                          <td className="py-3 px-3">
                            {isOut ? (
                              <span className="px-2 py-0.5 rounded font-black text-[10px] bg-rose-100 text-rose-700 border border-rose-300">
                                Stok Habis
                              </span>
                            ) : isLow ? (
                              <span className="px-2 py-0.5 rounded font-black text-[10px] bg-amber-100 text-amber-800 border border-amber-300">
                                Stok Hampir Habis
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Stok Aman
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                                className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs"
                              >
                                -
                              </button>
                              <button
                                onClick={() => updateProductStock(p.id, p.stock + 5)}
                                className="px-2 h-7 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px]"
                              >
                                +5
                              </button>
                              <button
                                onClick={() => updateProductStock(p.id, p.stock + 20)}
                                className="px-2 h-7 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                              >
                                +20
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================
              5. TAB: PESANAN (Order Management Lengkap)
             ========================================================= */}
          {activeTab === 'orders' && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Manajemen Transaksi Pesanan</h3>
                  <p className="text-xs text-slate-500">Ubah status pesanan, update nomor resi, dan chat WhatsApp pembeli</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option value="all">Semua Status ({orders.length})</option>
                    <option value="pending_payment">Pending Payment</option>
                    <option value="payment_verification">Payment Verification</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="payment_rejected">Payment Rejected</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                      <th className="py-3 px-3">No. Order</th>
                      <th className="py-3 px-3">Tanggal</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Status Bayar</th>
                      <th className="py-3 px-3">Status Pesanan</th>
                      <th className="py-3 px-3">Kurir &amp; Resi</th>
                      <th className="py-3 px-3 text-right">Aksi Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">{ord.orderNumber}</td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">{ord.createdAt}</td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-800">{ord.customer.fullName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{ord.customer.phone}</span>
                        </td>
                        <td className="py-3 px-3 font-extrabold text-emerald-800">{formatRupiah(ord.total)}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                            ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.paymentStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-slate-100 border border-slate-200 rounded px-2 py-1 text-[11px] font-bold text-slate-800 focus:outline-none"
                          >
                            <option value="pending_payment">Pending Payment</option>
                            <option value="payment_verification">Payment Verification</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                            <option value="payment_rejected">Payment Rejected</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-[11px]">
                          <span className="font-medium text-slate-700 block">{ord.shippingCourier.courier}</span>
                          <span className="font-mono text-emerald-700 font-bold">{ord.trackingNumber || 'Belum ada resi'}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleWhatsAppCustomer(ord, ord.trackingNumber ? 'resi' : 'status')}
                              className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded border border-emerald-300 font-bold text-[10px] flex items-center gap-1"
                              title="Chat WhatsApp Pembeli"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WA</span>
                            </button>

                            {ord.status === 'packed' && (
                              <button
                                onClick={() => {
                                  setShippingOrderId(ord.id);
                                  setInputResi(`JT${Math.floor(1000000000 + Math.random() * 9000000000)}ID`);
                                }}
                                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold"
                              >
                                Input Resi
                              </button>
                            )}

                            {ord.status === 'shipped' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'completed')}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                              >
                                Selesai
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================
              6. TAB: PEMBAYARAN (Verifikasi Bukti Transfer & QRIS)
             ========================================================= */}
          {activeTab === 'payments' && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">Verifikasi Pembayaran &amp; Bukti Transfer</h3>
                <p className="text-xs text-slate-500">
                  Konfirmasi bukti transfer BCA &amp; QRIS dari customer. Saat dikonfirmasi, status menjadi <strong>PAID</strong>, order masuk ke <strong>Processing</strong>, dan stok produk berkurang otomatis.
                </p>
              </div>

              {/* List of orders awaiting verification */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Daftar Bukti Transfer Menunggu Verifikasi ({orders.filter(o => o.status === 'payment_verification' || o.paymentProof).length})</span>
                </h4>

                {orders.filter(o => o.paymentProof || o.status === 'payment_verification').length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                    Tidak ada bukti pembayaran baru yang menunggu verifikasi saat ini.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.filter(o => o.paymentProof || o.status === 'payment_verification').map((ord) => {
                      const proof = ord.paymentProof;
                      const isPendingVerif = ord.status === 'payment_verification';
                      const isAlreadyPaid = ord.status === 'paid' || ord.status === 'processing' || ord.status === 'shipped' || ord.status === 'completed';

                      return (
                        <div key={ord.id} className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-sm text-slate-900">{ord.orderNumber}</span>
                                <span className="text-xs font-semibold text-slate-600">({ord.customer.fullName})</span>
                              </div>
                              <span className="text-[11px] text-slate-500">Metode: <strong>{ord.paymentMethodName}</strong> · Total: <strong className="text-emerald-700 font-bold">{formatRupiah(ord.total)}</strong></span>
                            </div>

                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              isAlreadyPaid 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : ord.status === 'payment_rejected' 
                                  ? 'bg-rose-100 text-rose-800' 
                                  : 'bg-blue-100 text-blue-800 animate-pulse'
                            }`}>
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </div>

                          {/* Proof details and Image Preview */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start text-xs">
                            <div className="sm:col-span-1">
                              <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Foto Bukti Transfer:</span>
                              {proof?.proofImage ? (
                                <a href={proof.proofImage} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-xl border border-slate-300">
                                  <img src={proof.proofImage} alt="Bukti Transfer" className="w-full h-36 object-cover group-hover:scale-105 transition-transform" />
                                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs transition-opacity">
                                    Lihat Ukuran Penuh
                                  </div>
                                </a>
                              ) : (
                                <div className="w-full h-32 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                                  Foto Tidak Tersedia
                                </div>
                              )}
                            </div>

                            <div className="sm:col-span-2 space-y-2">
                              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Nama Pengirim Transfer:</span>
                                  <strong className="text-slate-800">{proof?.senderName || ord.customer.fullName}</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Jumlah Ditransfer:</span>
                                  <strong className="text-emerald-700 font-mono text-sm">{formatRupiah(proof?.transferAmount || ord.total)}</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Tanggal Transfer:</span>
                                  <span className="text-slate-700">{proof?.transferDate || 'Hari ini'}</span>
                                </div>
                              </div>

                              {/* Action Buttons: KONFIRMASI PEMBAYARAN & TOLAK PEMBAYARAN (Bagian 8) */}
                              <div className="flex items-center gap-2 pt-2">
                                {!isAlreadyPaid ? (
                                  <>
                                    <button
                                      onClick={() => confirmPayment(ord.id)}
                                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>KONFIRMASI PEMBAYARAN</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setRejectOrderId(ord.id);
                                        setRejectReason('Bukti transfer tidak valid atau dana belum masuk rekening BCA.');
                                      }}
                                      className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-300 flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      <span>TOLAK PEMBAYARAN</span>
                                    </button>
                                  </>
                                ) : (
                                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2 w-full">
                                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                                    <span>Pembayaran telah dikonfirmasi (PAID) &amp; stok dikurangi.</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              7. TAB: PENGIRIMAN (Manajemen Kurir & Resi)
             ========================================================= */}
          {activeTab === 'shipping' && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">Manajemen Kurir Logistik &amp; Input Resi</h3>
                <p className="text-xs text-slate-500">Daftar ekspedisi mitra resmi BORONGIN.COM dan pelacakan resi pengiriman</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['J&T Express', 'JNE Express', 'SiCepat', 'AnterAja'].map((courier) => (
                  <div key={courier} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                    <Truck className="w-6 h-6 text-emerald-600 mx-auto" />
                    <p className="font-bold text-xs text-slate-800">{courier}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Aktif &amp; Terintegrasi</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pesanan Dalam Pengiriman ({orders.filter(o => o.status === 'shipped').length})
                </h4>
                <div className="space-y-2">
                  {orders.filter(o => o.status === 'shipped').map((ord) => (
                    <div key={ord.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                        <span className="text-slate-500 mx-2">·</span>
                        <span>{ord.customer.fullName} ({ord.customer.city})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          Resi: {ord.trackingNumber || 'JT123456789ID'}
                        </span>
                        <button
                          onClick={() => handleWhatsAppCustomer(ord, 'resi')}
                          className="px-2 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]"
                        >
                          Kirim Resi via WA
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              8. TAB: CUSTOMER (Daftar Pelanggan)
             ========================================================= */}
          {activeTab === 'customers' && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">Database Pelanggan Terdaftar</h3>
                <p className="text-xs text-slate-500">Riwayat transaksi dan loyalitas pembeli</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Nama Pembeli</th>
                      <th className="py-2.5 px-3">Kontak &amp; Email</th>
                      <th className="py-2.5 px-3">Alamat Kota</th>
                      <th className="py-2.5 px-3">Total Pesanan</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-800">Budi Santoso</td>
                      <td className="py-3 px-3 text-slate-600">budi.santoso@example.com · 081298765432</td>
                      <td className="py-3 px-3 text-slate-600">Jakarta Selatan, DKI Jakarta</td>
                      <td className="py-3 px-3 font-extrabold text-emerald-800">{orders.length} Pesanan</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => window.open('https://wa.me/6281298765432', '_blank')}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-300 text-[11px]"
                        >
                          Hubungi WA
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================
              9. TAB: VOUCHER (Kupon Diskon Toko)
             ========================================================= */}
          {activeTab === 'coupons' && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">Manajemen Kupon &amp; Voucher Diskon</h3>
                <p className="text-xs text-slate-500">Atur kode promo diskon persentase, nominal tetap, dan gratis ongkir</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coupons.map((c) => (
                  <div key={c.code} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                        {c.code}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {c.discountType.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{c.description}</p>
                    <span className="text-[11px] text-slate-400 block">Min. Belanja: {formatRupiah(c.minSpend)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              10. TAB: PROMO (Flash Sale & Banner Toko)
             ========================================================= */}
          {activeTab === 'promos' && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">Pengaturan Promo &amp; Flash Sale</h3>
                <p className="text-xs text-slate-500">Konfigurasi hitung mundur Flash Sale dan diskon produk pilihan</p>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-amber-950">Status Flash Sale Beranda:</h4>
                  <p className="text-[11px] text-amber-800">Menampilkan produk dengan diskon hingga 50% dan stok terbatas</p>
                </div>
                <span className="px-3 py-1 bg-amber-500 text-white font-black text-xs rounded-xl">
                  AKTIF LIVE
                </span>
              </div>
            </div>
          )}

          {/* =========================================================
              11. TAB: REVIEW (Moderasi Ulasan Pembeli)
             ========================================================= */}
          {activeTab === 'reviews' && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">Ulasan &amp; Rating Produk Pembeli</h3>
                <p className="text-xs text-slate-500">Semua ulasan dari pembeli terverifikasi setelah order berstatus selesai</p>
              </div>

              <div className="space-y-3">
                {products.flatMap(p => p.reviews.map(r => ({ ...r, productTitle: p.title }))).slice(0, 8).map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{rev.userName}</strong>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200 font-bold">
                          Pembeli Terverifikasi
                        </span>
                      </div>
                      <span className="text-slate-400 text-[10px]">{rev.date}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Produk: <em>{rev.productTitle}</em></p>
                    <p className="text-slate-700 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              12. TAB: LAPORAN (Laporan Omzet & Penjualan)
             ========================================================= */}
          {activeTab === 'reports' && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Laporan Penjualan &amp; Rekap Keuangan</h3>
                  <p className="text-xs text-slate-500">Ringkasan transaksi sukses dan omzet toko BORONGIN.COM</p>
                </div>
                <button
                  onClick={() => {
                    const csvContent = 'data:text/csv;charset=utf-8,No Order,Customer,Total,Status,Metode\n' + orders.map(o => `${o.orderNumber},${o.customer.fullName},${o.total},${o.status},${o.paymentMethodName}`).join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', `rekap-penjualan-borongin-${new Date().toISOString().slice(0, 10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showToast('Laporan penjualan CSV berhasil diunduh!', 'success');
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-emerald-800 font-bold uppercase text-[10px]">Omzet Terkonfirmasi (PAID)</span>
                  <p className="text-xl font-black text-emerald-950">{formatRupiah(totalRevenue)}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
                  <span className="text-blue-800 font-bold uppercase text-[10px]">Total Transaksi Sukses</span>
                  <p className="text-xl font-black text-blue-950">{orders.filter(o => o.paymentStatus === 'paid').length} Pesanan</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                  <span className="text-purple-800 font-bold uppercase text-[10px]">Rata-rata Order (AOV)</span>
                  <p className="text-xl font-black text-purple-950">
                    {formatRupiah(orders.length > 0 ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              13. TAB: PENGATURAN (BCA, QRIS, WhatsApp & Akun Admin)
             ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Form Pengaturan Toko & Pembayaran (Bagian 7, 9, 10, 11) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-base text-slate-900">Pengaturan Toko &amp; Metode Pembayaran</h3>
                  <p className="text-xs text-slate-500">Konfigurasi rekening BCA resmi, gambar QRIS, COD, dan WhatsApp</p>
                </div>

                <form onSubmit={handleSaveStoreSettings} className="space-y-5 text-xs">
                  
                  {/* A. REKENING BANK BCA (Bagian 7) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Rekening Transfer Bank BCA (Bagian 7)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Nama Bank:</label>
                        <input
                          type="text"
                          value={bcaBank}
                          onChange={(e) => setBcaBank(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Nomor Rekening:</label>
                        <input
                          type="text"
                          value={bcaAccountNum}
                          onChange={(e) => setBcaAccountNum(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-emerald-800"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Atas Nama Rekening:</label>
                        <input
                          type="text"
                          value={bcaAccountName}
                          onChange={(e) => setBcaAccountName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* B. PENGATURAN QRIS & UPLOAD GAMBAR QRIS (Bagian 9 & 10) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                        <QrCode className="w-4 h-4 text-emerald-600" />
                        <span>Pengaturan QRIS Toko (Bagian 10)</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                        Dapat Diganti Admin Kapan Saja
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Preview QRIS Saat Ini:</span>
                        <div className="p-2 bg-white rounded-xl border border-slate-300 w-36 h-36 flex items-center justify-center shadow-xs">
                          <img src={qrisImageUrl} alt="Preview QRIS" className="w-full h-full object-contain" />
                        </div>
                      </div>

                      <div className="sm:col-span-2 space-y-2">
                        <label className="block font-semibold text-slate-700">
                          URL / Media Library QRIS Image:
                        </label>
                        <input
                          type="text"
                          value={qrisImageUrl}
                          onChange={(e) => setQrisImageUrl(e.target.value)}
                          placeholder="https://... URL gambar QRIS toko"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                        />
                        <div className="flex items-center gap-2 pt-1">
                          <label className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload dari Perangkat</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  const r = new FileReader();
                                  r.onloadend = () => setQrisImageUrl(r.result as string);
                                  r.readAsDataURL(f);
                                  showToast('Foto QRIS baru dipilih!', 'info');
                                }
                              }}
                            />
                          </label>
                          <span className="text-[11px] text-slate-400">Customer selalu melihat QRIS terbaru yang diatur di sini.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* C. WHATSAPP & FITUR COD */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <label className="block font-bold text-slate-700">Nomor WhatsApp Resmi Toko (Bagian 11):</label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm bg-white px-3 py-2 rounded-xl border border-slate-200 text-slate-900 flex-1">
                          {OFFICIAL_WA_NUMBER_DISPLAY} (Internasional: +{OFFICIAL_WA_NUMBER_INTL})
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">Nomor resmi untuk notifikasi pesanan dan faktur otomatis.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <label className="block font-bold text-slate-700">Metode Bayar di Tempat (COD):</label>
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsCodActive(!isCodActive)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isCodActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isCodActive ? 'COD Diaktifkan' : 'COD Dinonaktifkan'}
                        </button>
                        <span className="text-[11px] text-slate-500">
                          {isCodActive ? 'Pembeli dapat memilih metode COD saat checkout' : 'Metode COD disembunyikan dari checkout'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>SIMPAN PENGATURAN TOKO</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Keamanan Password Administrator (Bagian 2.B) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Ubah Password Master Administrator</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    User: {OFFICIAL_ADMIN_USERNAME}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Password dienkripsi menggunakan Web Crypto API SHA-256 dan tidak disimpan hardcoded di repository/frontend.
                </p>

                <form onSubmit={handleChangePassword} className="space-y-3 text-xs max-w-md">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Password Lama:</label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Password Baru (min. 6 karakter):</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Konfirmasi Password Baru:</label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Perbarui Password Administrator
                  </button>
                </form>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* =========================================================
          MODAL 1: FORM TAMBAH / EDIT PRODUK (Bagian 4)
         ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingProductId ? 'Edit Data Produk' : 'Tambah Produk Baru'}
                </h3>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nama Produk */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama Produk:</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Kopi Arabika Gayo Single Origin 250gr"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Produk:</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Merek / Brand:</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Status Produk */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Produk:</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase"
                  >
                    <option value="published">Published (Tayang)</option>
                    <option value="draft">Draft (Konsep)</option>
                    <option value="out_of_stock">Out of Stock (Habis)</option>
                    <option value="inactive">Inactive (Nonaktif)</option>
                  </select>
                </div>

                {/* Harga Normal */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga Normal (Rp):</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
                  />
                </div>

                {/* Harga Promo */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga Jual / Promo (Rp):</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-emerald-800"
                  />
                </div>

                {/* Stok Saat Ini */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Stok:</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
                  />
                </div>

                {/* Stok Minimum */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batas Stok Minimum (Alert):</label>
                  <input
                    type="number"
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                {/* Berat (Gram) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Berat Produk (Gram):</label>
                  <input
                    type="number"
                    value={formWeight}
                    onChange={(e) => setFormWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                {/* Dimensi */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dimensi (P x L x T cm):</label>
                  <input
                    type="text"
                    value={formDimensions}
                    onChange={(e) => setFormDimensions(e.target.value)}
                    placeholder="Contoh: 20 x 15 x 10 cm"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Foto Utama & Upload */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700">Foto Utama Produk:</label>
                <div className="flex items-center gap-3">
                  {formMainImage && (
                    <img src={formMainImage} alt="Main Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0" />
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={formMainImage}
                      onChange={(e) => setFormMainImage(e.target.value)}
                      placeholder="URL Gambar Produk..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-[11px] font-bold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Foto dari Komputer / HP</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const r = new FileReader();
                            r.onloadend = () => setFormMainImage(r.result as string);
                            r.readAsDataURL(f);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Deskripsi Produk */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Lengkap Produk:</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>

              {/* Variasi Produk */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-800">Variasi Produk (Warna / Ukuran):</label>
                {formVariations.map((v, i) => (
                  <div key={v.id || i} className="flex items-center justify-between text-xs p-2 bg-white rounded-lg border border-slate-200">
                    <span><strong>{v.name}</strong> · {formatRupiah(v.price)} · Stok: {v.stock}</span>
                    <button
                      type="button"
                      onClick={() => setFormVariations(formVariations.filter((_, idx) => idx !== i))}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 items-center pt-1">
                  <input
                    type="text"
                    placeholder="Nama Variasi (cth: Hitam - L)"
                    value={newVarName}
                    onChange={(e) => setNewVarName(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Harga"
                    value={newVarPrice}
                    onChange={(e) => setNewVarPrice(Number(e.target.value))}
                    className="w-24 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Stok"
                    value={newVarStock}
                    onChange={(e) => setNewVarStock(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariation}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-bold text-xs shrink-0"
                  >
                    + Tambah
                  </button>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Produk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: INPUT RESI PENGIRIMAN
         ========================================================= */}
      {shippingOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Input Nomor Resi Ekspedisi</span>
            </h4>
            <p className="text-xs text-slate-500">
              Masukkan nomor resi pengiriman agar pembeli dapat melacak paket secara real-time di website.
            </p>
            <input
              type="text"
              value={inputResi}
              onChange={(e) => setInputResi(e.target.value)}
              placeholder="Contoh: JT98273641029ID"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShippingOrderId(null)}
                className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (shippingOrderId && inputResi.trim()) {
                    updateOrderStatus(shippingOrderId, 'shipped', inputResi.trim());
                    setShippingOrderId(null);
                  }
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Simpan &amp; Tandai Dikirim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: TOLAK PEMBAYARAN (Bagian 8)
         ========================================================= */}
      {rejectOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h4 className="font-extrabold text-sm text-rose-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>Tolak Bukti Pembayaran</span>
            </h4>
            <p className="text-xs text-slate-600">
              Masukkan alasan penolakan pembayaran. Informasi ini akan ditampilkan kepada customer agar mereka dapat mengunggah bukti yang valid.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectOrderId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (rejectOrderId) {
                    rejectPayment(rejectOrderId, rejectReason);
                    setRejectOrderId(null);
                  }
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Tolak Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
