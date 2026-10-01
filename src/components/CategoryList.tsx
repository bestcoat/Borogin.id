import React from 'react';
import { 
  Tv, 
  Shirt, 
  Sparkles, 
  Heart, 
  Home, 
  Utensils, 
  Coffee, 
  Activity, 
  Car, 
  Laptop, 
  Smartphone, 
  Briefcase, 
  Compass, 
  Smile, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CategoryList: React.FC = () => {
  const { categories, setCategoryFilter, setCurrentView } = useShop();

  const getIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" };
    switch (iconName) {
      case 'Tv': return <Tv {...props} />;
      case 'Shirt': return <Shirt {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'Home': return <Home {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'Coffee': return <Coffee {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'Car': return <Car {...props} />;
      case 'Laptop': return <Laptop {...props} />;
      case 'Smartphone': return <Smartphone {...props} />;
      case 'Briefcase': return <Briefcase {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Smile': return <Smile {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      default: return <ShoppingBag {...props} />;
    }
  };

  const handleCategoryClick = (slug: string) => {
    setCategoryFilter(slug);
    setCurrentView('shop');
  };

  return (
    <section className="my-8 sm:my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Belanja Berdasarkan Kategori
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pilih kategori barang terlengkap sesuai kebutuhan belanja Anda
          </p>
        </div>

        <button
          onClick={() => {
            setCategoryFilter('all');
            setCurrentView('shop');
          }}
          className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid of 15 Categories */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
            className="group p-3 sm:p-4 rounded-xl border border-slate-200/80 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 transition-all duration-200 flex flex-col items-center text-center cursor-pointer shadow-sm hover:shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2.5 group-hover:bg-emerald-100 transition-colors">
              {getIcon(cat.iconName)}
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {cat.name}
            </h3>

            <p className="text-[10px] text-slate-400 mt-0.5">
              {cat.itemCount} Produk
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
