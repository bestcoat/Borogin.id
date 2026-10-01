import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Layers, 
  ShieldCheck, 
  Package, 
  Sparkles, 
  Percent, 
  Phone,
  Flame,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useShop, AppView } from '../context/ShopContext';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    wishlist, 
    searchQuery, 
    setSearchQuery, 
    products, 
    categories, 
    categoryFilter,
    setCategoryFilter,
    setSelectedProductId,
    setIsAuthModalOpen,
    setIsBlueprintModalOpen,
    user
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll for sticky shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    setCurrentView('shop');
  };

  const matchingProducts = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    setShowSearchDropdown(false);
  };

  const navLinks: { label: string; view: AppView; badge?: string; icon?: React.ReactNode }[] = [
    { label: 'HOME', view: 'home' },
    { label: 'SHOP', view: 'shop' },
    { label: 'KATEGORI', view: 'categories' },
    { label: 'PROMO', view: 'promo', badge: 'Diskon 45%', icon: <Percent className="w-3.5 h-3.5 text-amber-500 inline mr-1" /> },
    { label: 'PRODUK TERBARU', view: 'new-arrivals', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500 inline mr-1" /> },
    { label: 'BEST SELLER', view: 'best-sellers', badge: 'HOT', icon: <Flame className="w-3.5 h-3.5 text-rose-500 inline mr-1" /> },
    { label: 'BLOG', view: 'blog' },
    { label: 'TENTANG KAMI', view: 'about' },
    { label: 'KONTAK', view: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 transition-all duration-200">
      {/* Top Banner / Microbar */}
      <div className="bg-emerald-800 text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Gratis Ongkir ke Seluruh Indonesia min. Rp100.000 (Gunakan kode: <strong className="text-amber-300">GRATISONGKIR</strong>)
            </span>
            <span className="text-emerald-300">·</span>
            <button 
              onClick={() => setCurrentView('faq')}
              className="text-emerald-100 hover:text-white transition-colors"
            >
              Bantuan & FAQ
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsBlueprintModalOpen(true)}
              className="bg-emerald-700/80 hover:bg-emerald-600 text-emerald-50 px-2.5 py-0.5 rounded text-xs flex items-center gap-1.5 transition-colors border border-emerald-600"
            >
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span>WP & WooCommerce Blueprint</span>
            </button>

            <button 
              onClick={() => setCurrentView('admin')}
              className="text-emerald-100 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Admin & Stok</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className={`transition-all duration-200 ${isScrolled ? 'py-2.5 shadow-sm' : 'py-3.5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => { setCurrentView('home'); setCategoryFilter('all'); }} 
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-2xl tracking-tighter">B</span>
              </div>
              <div>
                <div className="flex items-baseline">
                  <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">BORONGIN</span>
                  <span className="font-extrabold text-xl sm:text-2xl text-emerald-600">.COM</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block tracking-wide">
                  Belanja Mudah, Harga Bersahabat
                </p>
              </div>
            </button>
          </div>

          {/* Search Bar (Center, Large) */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Cari produk, kategori, atau kebutuhan Anda..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="w-full pl-11 pr-24 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-emerald-600 rounded-xl outline-none transition-all shadow-inner"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Cari
                </button>
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {showSearchDropdown && searchQuery.trim().length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                  <span>Hasil Pencarian Cepat</span>
                  <span className="text-[11px] text-emerald-600 cursor-pointer" onClick={handleSearchSubmit}>
                    Lihat Semua
                  </span>
                </div>

                {matchingProducts.length > 0 ? (
                  <div className="divide-y divide-slate-50 mt-1">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p.id)}
                        className="flex items-center gap-3 p-2 hover:bg-emerald-50/60 rounded-lg cursor-pointer transition-colors group"
                      >
                        <img 
                          src={p.images[0]} 
                          alt={p.title} 
                          className="w-10 h-10 object-cover rounded-md border border-slate-100 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate group-hover:text-emerald-700">
                            {p.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="text-emerald-600 font-bold">
                              Rp{p.price.toLocaleString('id-ID')}
                            </span>
                            {p.originalPrice > p.price && (
                              <span className="line-through text-slate-400 text-[11px]">
                                Rp{p.originalPrice.toLocaleString('id-ID')}
                              </span>
                            )}
                            <span className="text-slate-300">·</span>
                            <span>{p.soldCount} terjual</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">
                    Tidak ada produk ditemukan untuk kata kunci "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header: Wishlist, Account, Cart, Mobile Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Wishlist */}
            <button
              onClick={() => setCurrentView('account')}
              className="relative p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors hidden sm:flex items-center justify-center"
              title="Wishlist Favorit"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon with badge */}
            <button
              onClick={() => setCurrentView('cart')}
              className="relative p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Customer Account Button / Menu */}
            <div className="relative">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <span className="text-slate-400 block text-[10px]">Halo,</span>
                  <span className="font-semibold text-slate-800 line-clamp-1">{user.name.split(' ')[0]}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </button>

              {/* Account Dropdown */}
              {isAccountDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                  onMouseLeave={() => setIsAccountDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Masuk sebagai</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Member {user.memberTier}
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold">{user.points} Poin</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setCurrentView('account'); setIsAccountDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Dashboard Akun & Pesanan</span>
                  </button>

                  <button
                    onClick={() => { setCurrentView('tracking'); setIsAccountDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>Lacak Pengiriman</span>
                  </button>

                  <button
                    onClick={() => { setCurrentView('admin'); setIsAccountDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                    <span>Kelola Stok & Admin</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => { setIsAuthModalOpen(true); setIsAccountDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <span>Ganti Akun / Keluar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-600 md:hidden rounded-lg hover:bg-slate-100"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input & Quick Pill Scroller */}
        <div className="px-4 mt-2 md:hidden space-y-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Cari produk di BORONGIN.COM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-16 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:bg-white outline-none shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg shadow-xs"
            >
              Cari
            </button>
          </form>

          {/* Horizontal Quick Category & Promo Scrollbar (App-Like UX) */}
          <div className="no-scrollbar overflow-x-auto flex items-center gap-1.5 pb-1 -mx-4 px-4 text-[11px] font-semibold whitespace-nowrap">
            <button
              onClick={() => { setCategoryFilter('all'); setCurrentView('shop'); }}
              className={`px-3 py-1 rounded-full border transition-all shrink-0 ${
                categoryFilter === 'all' && currentView === 'shop'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setCurrentView('promo')}
              className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all shrink-0 font-bold"
            >
              ⚡ Flash Sale
            </button>
            <button
              onClick={() => setCurrentView('best-sellers')}
              className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all shrink-0 font-bold"
            >
              🔥 Terlaris
            </button>
            <button
              onClick={() => { setCategoryFilter('produk-umkm'); setCurrentView('shop'); }}
              className={`px-3 py-1 rounded-full border transition-all shrink-0 ${
                categoryFilter === 'produk-umkm'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              🏆 Produk UMKM
            </button>
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setCategoryFilter(cat.slug); setCurrentView('shop'); }}
                className={`px-3 py-1 rounded-full border transition-all shrink-0 ${
                  categoryFilter === cat.slug
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Desktop) */}
      <nav className="bg-slate-50 border-t border-slate-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wide py-2">
            <div className="flex items-center space-x-1 lg:space-x-4">
              {navLinks.map((link) => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.label}
                    onClick={() => {
                      if (link.view === 'categories') {
                        setCategoryFilter('all');
                      }
                      setCurrentView(link.view);
                    }}
                    className={`relative py-1.5 px-2.5 rounded-lg transition-all flex items-center gap-1 ${
                      isActive
                        ? 'text-emerald-700 font-bold bg-emerald-100/60'
                        : 'text-slate-600 hover:text-emerald-600 hover:bg-white'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-rose-500 text-white ml-0.5 tracking-tighter">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-slate-400 font-normal">
                Buka 24 Jam Nonstop
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation (Polished Full Height Slide-in) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
          <div className="bg-white h-full max-w-[310px] w-full p-4 overflow-y-auto flex flex-col justify-between shadow-2xl safe-area-pb">
            <div className="space-y-4">
              
              {/* Drawer Top Header with User info & Close */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {user.memberTier}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-bold">
                        {user.points} Poin
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Nav Links */}
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                  Menu Utama
                </p>
                <div className="space-y-0.5">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => {
                        setCurrentView(link.view);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between min-h-[44px] transition-colors ${
                        currentView === link.view
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {link.icon}
                        <span>{link.label}</span>
                      </span>
                      {link.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold">
                          {link.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 15 Indonesian Categories in Drawer */}
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-1">
                  Semua Kategori Produk
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoryFilter(cat.slug);
                        setCurrentView('shop');
                        setMobileMenuOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 text-left font-medium truncate border border-slate-100/80 active:scale-98 transition-all min-h-[42px] flex items-center justify-between"
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({cat.itemCount})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="pt-4 border-t border-slate-100 space-y-2 mt-4">
              <button
                onClick={() => {
                  setCurrentView('account');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span>Buka Dashboard Akun</span>
              </button>

              <button
                onClick={() => {
                  setIsBlueprintModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>WooCommerce Architecture</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors min-h-[44px] shadow-sm"
              >
                <Package className="w-4 h-4" />
                <span>Kelola Stok & Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
