import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, User, ArrowLeft, Share2, Search, Tag, Settings, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const BlogView: React.FC = () => {
  const { 
    blogPosts, 
    selectedBlogId, 
    setSelectedBlogId, 
    showToast, 
    authRole, 
    setCurrentView 
  } = useShop();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const selectedPost = blogPosts.find(b => b.id === selectedBlogId || b.slug === selectedBlogId);

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan artikel berhasil disalin!', 'success');
    }
  };

  // Distinct categories
  const categories = ['all', ...Array.from(new Set(blogPosts.map(p => p.category)))];

  // Filtered posts
  const filteredPosts = blogPosts.filter(post => {
    if (selectedCategory !== 'all' && post.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchTag = post.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchExcerpt && !matchContent && !matchTag) return false;
    }
    return true;
  });

  // Single Article View
  if (selectedPost) {
    const relatedPosts = blogPosts.filter(p => p.id !== selectedPost.id).slice(0, 3);

    return (
      <div className="my-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedBlogId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Artikel Blog</span>
          </button>

          {authRole === 'ADMIN' && (
            <button
              onClick={() => setCurrentView('admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Kelola Blog di Admin</span>
            </button>
          )}
        </div>

        <article className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              {selectedPost.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {selectedPost.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {selectedPost.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedPost.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedPost.readTime}</span>
            </div>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line space-y-4">
            {selectedPost.content}
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {selectedPost.tags.map((t) => (
                <span key={t} className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5" /> {t}
                </span>
              ))}
            </div>
            <button
              onClick={() => handleShare(selectedPost.title)}
              className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg flex items-center gap-1 text-xs font-semibold"
              title="Bagikan Artikel"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan</span>
            </button>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="pt-6 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Artikel Pilihan Lainnya</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedBlogId(post.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-2xl border border-slate-200/80 p-3 hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {post.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 mt-1.5 hover:text-emerald-700">
                      {post.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Articles List View
  return (
    <div className="my-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kabar, Tips & Wawasan Belanja</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Blog & Artikel Resmi BORONGIN.COM
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Temukan panduan cerdas berhemat, tips memilih produk berkualitas, ulasan review mendalam, serta kisah inspiratif UMKM mitra toko nusantara.
          </p>
        </div>

        {authRole === 'ADMIN' && (
          <div className="mt-4 sm:mt-0 sm:absolute sm:top-6 sm:right-6">
            <button
              onClick={() => setCurrentView('admin')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis / Kelola Blog di Admin</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => {
            const isAll = cat === 'all';
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isAll ? 'Semua Kategori' : cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari topik atau judul artikel..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Tidak ada artikel yang cocok</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba gunakan kata kunci pencarian yang lain atau pilih kategori artikel yang berbeda.
          </p>
          <button
            onClick={() => { setSearchFilter(''); setSelectedCategory('all'); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedBlogId(post.id)}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                  {post.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-2">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold">
                  <span>Baca Selengkapnya</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
