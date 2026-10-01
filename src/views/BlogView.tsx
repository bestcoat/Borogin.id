import React from 'react';
import { BookOpen, Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { INITIAL_BLOG_POSTS } from '../data/mockData';

export const BlogView: React.FC = () => {
  const { selectedBlogId, setSelectedBlogId, showToast } = useShop();

  const selectedPost = INITIAL_BLOG_POSTS.find(b => b.id === selectedBlogId);

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan artikel berhasil disalin!', 'success');
    }
  };

  if (selectedPost) {
    return (
      <div className="my-6 max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedBlogId(null)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Artikel Blog</span>
        </button>

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
                <span key={t} className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
            <button
              onClick={() => handleShare(selectedPost.title)}
              className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg"
              title="Bagikan Artikel"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="my-6 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Blog & Wawasan Belanja BORONGIN.COM
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Panduan hemat, tips memilih produk, inspirasi rumah tangga, dan kabar terbaru UMKM nusantara
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_BLOG_POSTS.map((post) => (
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
    </div>
  );
};
