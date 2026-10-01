import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Award, 
  Coins, 
  LogOut, 
  Trash2, 
  ShoppingCart, 
  Check, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Edit2,
  Truck,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { TrackMyOrderPanel } from '../components/TrackMyOrderPanel';

export const AccountView: React.FC = () => {
  const { 
    user, 
    updateUserProfile, 
    orders, 
    wishlist, 
    toggleWishlist, 
    products, 
    addToCart, 
    formatRupiah, 
    setActiveOrder, 
    setCurrentView,
    redeemPoints,
    showToast 
  } = useShop();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'tracking' | 'orders' | 'wishlist' | 'points' | 'address' | 'profile'>('dashboard');
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string | undefined>(
    orders.length > 0 ? orders[0].orderNumber : 'BRG-20260927-00108'
  );

  // Edit profile state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const favoritedProducts = products.filter(p => wishlist.includes(p.id));

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
  };

  const handleViewOrderDetail = (order: typeof orders[0]) => {
    setActiveOrder(order);
    setCurrentView('tracking');
  };

  const handleTrackSpecificOrder = (orderNumber: string) => {
    setSelectedTrackingOrderId(orderNumber);
    setActiveTab('tracking');
  };

  const handleMoveToCart = (product: Product) => {
    addToCart(product, product.variations?.[0], 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="my-6 space-y-6">
      {/* Top Banner / Member Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center font-extrabold text-2xl text-white shadow-inner">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{user.name}</h1>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                Member {user.memberTier}
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">{user.email} · {user.phone}</p>
            <p className="text-[11px] text-emerald-300 mt-1">Bergabung sejak: {user.joinedDate}</p>
          </div>
        </div>

        {/* Points & Loyalty Box */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 self-stretch sm:self-auto">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-emerald-100 font-medium block">Poin Borongin Reward:</span>
            <p className="text-xl sm:text-2xl font-black text-amber-300">{user.points.toLocaleString('id-ID')} Poin</p>
            <button
              onClick={() => setActiveTab('points')}
              className="text-[11px] font-bold text-white underline hover:text-amber-200 transition-colors"
            >
              Tukar Poin Jadi Voucher Diskon
            </button>
          </div>
        </div>
      </div>

      {/* Main Account Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Nav Menu */}
        <aside className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard Akun', icon: <User className="w-4 h-4" /> },
            { id: 'tracking', label: 'Track My Order', icon: <Truck className="w-4 h-4" />, isHighlight: true },
            { id: 'orders', label: 'Riwayat Pesanan', icon: <Package className="w-4 h-4" />, badge: orders.length },
            { id: 'wishlist', label: 'Wishlist Favorit', icon: <Heart className="w-4 h-4" />, badge: wishlist.length },
            { id: 'points', label: 'Poin & Member Rewards', icon: <Award className="w-4 h-4" /> },
            { id: 'address', label: 'Daftar Alamat', icon: <MapPin className="w-4 h-4" /> },
            { id: 'profile', label: 'Pengaturan Profil', icon: <Edit2 className="w-4 h-4" /> }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.isHighlight && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">
                    LIVE
                  </span>
                )}
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 mt-2">
            <button
              onClick={() => showToast('Anda telah keluar dari akun.', 'info')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </aside>

        {/* Right Tab Content Panel */}
        <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm min-h-[420px]">
          
          {/* TAB 1: Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Halo, {user.name}!</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dari dashboard akun pelanggan BORONGIN.COM, Anda dapat dengan mudah mengelola pesanan, memeriksa nomor resi, dan menukar poin member.
                </p>
              </div>

              {/* Quick 3 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-800">Total Transaksi</p>
                  <p className="text-2xl font-black text-emerald-900 mt-1">{orders.length} Pesanan</p>
                  <button onClick={() => setActiveTab('orders')} className="text-[11px] text-emerald-700 font-bold underline mt-2 block">
                    Lihat detail & resi
                  </button>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-xs font-semibold text-amber-800">Poin Belanja Anda</p>
                  <p className="text-2xl font-black text-amber-900 mt-1">{user.points}</p>
                  <button onClick={() => setActiveTab('points')} className="text-[11px] text-amber-700 font-bold underline mt-2 block">
                    Tukar voucher diskon
                  </button>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <p className="text-xs font-semibold text-rose-800">Barang Favorit</p>
                  <p className="text-2xl font-black text-rose-900 mt-1">{wishlist.length} Item</p>
                  <button onClick={() => setActiveTab('wishlist')} className="text-[11px] text-rose-700 font-bold underline mt-2 block">
                    Buka wishlist
                  </button>
                </div>
              </div>

              {/* Quick Track My Order Card in Dashboard */}
              <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 rounded-2xl border border-emerald-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-sm text-slate-900">Track My Order (Lacak Pengiriman Cepat)</h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">Live Mock API</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Cek estimasi waktu tiba, posisi kurir, dan histori checkpoint pengiriman pesanan Anda secara real-time.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (orders.length > 0) setSelectedTrackingOrderId(orders[0].orderNumber);
                    setActiveTab('tracking');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors self-start md:self-auto shrink-0 flex items-center gap-1.5"
                >
                  <span>Buka Pelacak Pesanan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Recent Orders Preview */}
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-3">Pesanan Terakhir Anda</h4>
                {orders.length > 0 ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-emerald-800">{orders[0].orderNumber}</span>
                        <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {orders[0].status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {orders[0].items.length} Barang · Total: <strong className="text-slate-800">{formatRupiah(orders[0].total)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => handleTrackSpecificOrder(orders[0].orderNumber)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track My Order</span>
                      </button>
                      <button
                        onClick={() => handleViewOrderDetail(orders[0])}
                        className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Belum ada transaksi.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TRACK MY ORDER (REAL-TIME MOCK API) */}
          {activeTab === 'tracking' && (
            <TrackMyOrderPanel initialOrderId={selectedTrackingOrderId} />
          )}

          {/* TAB 3: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Semua Riwayat Pesanan
              </h3>

              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-white transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div>
                          <span className="font-mono font-bold text-sm text-slate-900">{ord.orderNumber}</span>
                          <span className="text-xs text-slate-400 ml-2">· {ord.createdAt}</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto">
                          Status: {ord.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <p className="text-slate-600 font-medium">
                            {ord.items.map(i => `${i.product.title} (x${i.quantity})`).join(', ')}
                          </p>
                          <p className="text-slate-400">
                            Kurir: <strong>{ord.shippingCourier.courier}</strong> {ord.trackingNumber ? `(Resi: ${ord.trackingNumber})` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Total Tagihan:</span>
                          <span className="font-extrabold text-sm text-slate-900">{formatRupiah(ord.total)}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTrackSpecificOrder(ord.orderNumber)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track My Order</span>
                        </button>
                        <button
                          onClick={() => handleViewOrderDetail(ord)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Lihat Detail Pesanan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Anda belum memiliki riwayat pesanan.</p>
              )}
            </div>
          )}

          {/* TAB 4: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Wishlist Produk Favorit ({favoritedProducts.length})
              </h3>

              {favoritedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoritedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 bg-white"
                    >
                      <img src={p.images[0]} alt={p.title} className="w-16 h-16 object-cover rounded-xl border border-slate-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{p.title}</h4>
                        <p className="text-xs font-black text-emerald-700 mt-0.5">{formatRupiah(p.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleMoveToCart(p)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Pindah ke Cart</span>
                          </button>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Hapus dari Wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Belum ada produk favorit di wishlist Anda.</p>
              )}
            </div>
          )}

          {/* TAB 5: Points & Rewards */}
          {activeTab === 'points' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Program Loyalitas & Poin Belanja</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Setiap belanja kelipatan Rp10.000 di BORONGIN.COM, Anda otomatis mendapatkan 1 Poin Borongin.
                </p>
              </div>

              {/* Redeem Vouchers Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-900">Voucher Diskon Rp25.000</span>
                    <span className="text-xs font-black text-amber-600">250 Poin</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">Min. belanja Rp50.000 berlaku untuk semua kategori produk.</p>
                  <button
                    onClick={() => redeemPoints(250, 25000)}
                    disabled={user.points < 250}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Tukar 250 Poin
                  </button>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-900">Voucher Diskon Rp50.000</span>
                    <span className="text-xs font-black text-amber-600">500 Poin</span>
                  </div>
                  <p className="text-[11px] text-amber-700">Min. belanja Rp100.000 berlaku untuk semua kategori produk.</p>
                  <button
                    onClick={() => redeemPoints(500, 50000)}
                    disabled={user.points < 500}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                  >
                    Tukar 500 Poin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Address */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Daftar Alamat Pengiriman</h3>
                <button 
                  onClick={() => showToast('Form tambah alamat tersimpan!', 'success')}
                  className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                >
                  + Tambah Alamat Baru
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-emerald-500 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Rumah Utama (Default)</span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">UTAMA</span>
                </div>
                <p className="font-bold text-slate-800">{user.name} ({user.phone})</p>
                <p className="text-slate-600">Jl. Merdeka No. 45, RT 02/RW 04, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12190</p>
              </div>
            </div>
          )}

          {/* TAB 7: Profile Form */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                Pengaturan Akun & Kontak
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Simpan Perubahan
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

