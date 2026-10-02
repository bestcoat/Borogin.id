import React from 'react';
import { Flame, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { HeroSection } from '../components/HeroSection';
import { CategoryList } from '../components/CategoryList';
import { FlashSaleSection } from '../components/FlashSaleSection';
import { ProductCard } from '../components/ProductCard';
import { TrustBadges } from '../components/TrustBadges';
import { NewsletterSection } from '../components/NewsletterSection';

export const HomeView: React.FC = () => {
  const { products, blogPosts, setCurrentView, setSelectedBlogId, setCategoryFilter } = useShop();

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 5);
  const newArrivals = products.filter(p => p.isNewArrival || p.isFeatured).slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Kategori Produk */}
      <CategoryList />

      {/* 3. Flash Sale */}
      <FlashSaleSection />

      {/* 4. Produk Terlaris (Best Seller) */}
      <section className="my-8 sm:my-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Produk Terlaris
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                Paling Banyak Dipesan
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pilihan terfavorit dengan ribuan ulasan bintang 5 dari pembeli di seluruh Indonesia
            </p>
          </div>

          <button
            onClick={() => setCurrentView('best-sellers')}
            className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group shrink-0"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Responsive Grid: 5 desktop, 3 tablet, 2 mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Middle Promotional Banner */}
      <div className="my-8 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Dukung Karya Lokal Indonesia
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Etalase Produk UMKM Juara Nusantara
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Beli madu hutan asli, kain tenun tradisional NTT, olahan sambal nusantara langsung dari pengrajin dan kelompok tani binaan.
          </p>
        </div>
        <button
          onClick={() => {
            setCategoryFilter('produk-umkm');
            setCurrentView('shop');
          }}
          className="px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 active:scale-95"
        >
          Borong Produk UMKM
        </button>
      </div>

      {/* 6. Produk Terbaru */}
      <section className="my-8 sm:my-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Produk Terbaru
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                Koleksi Baru Masuk
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Barang baru rilis kualitas premium siap dikirim hari ini
            </p>
          </div>

          <button
            onClick={() => setCurrentView('new-arrivals')}
            className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group shrink-0"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Trust Badges */}
      <TrustBadges />

      {/* 8. Blog & Panduan Belanja Preview */}
      <section className="my-8 sm:my-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Tips Belanja & Inspirasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Baca ulasan produk, tips hemat, dan wawasan gaya hidup terkini dari Borongin.com
            </p>
          </div>
          <button
            onClick={() => setCurrentView('blog')}
            className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>Buka Blog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              onClick={() => {
                setSelectedBlogId(post.id);
                setCurrentView('blog');
              }}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md">
                  {post.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-2">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};
