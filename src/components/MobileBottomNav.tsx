import React from 'react';
import { Home, Grid, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useShop, AppView } from '../context/ShopContext';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartCount, wishlist } = useShop();

  const navItems: { label: string; view: AppView; icon: React.ReactNode; badge?: number }[] = [
    { label: 'Home', view: 'home', icon: <Home className="w-5 h-5" /> },
    { label: 'Kategori', view: 'categories', icon: <Grid className="w-5 h-5" /> },
    { label: 'Shop', view: 'shop', icon: <Search className="w-5 h-5" /> },
    { label: 'Wishlist', view: 'account', icon: <Heart className="w-5 h-5" />, badge: wishlist.length },
    { label: 'Keranjang', view: 'cart', icon: <ShoppingBag className="w-5 h-5" />, badge: cartCount },
    { label: 'Akun', view: 'account', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden py-1 px-2 safe-area-pb shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.label}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center justify-center py-1 px-2 relative transition-all ${
                isActive ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
