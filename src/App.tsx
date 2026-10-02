import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { WhatsAppFloating } from './components/WhatsAppFloating';
import { AuthModal } from './components/AuthModal';
import { GuestLoginPromptModal } from './components/GuestLoginPromptModal';
import { NewUserModal } from './components/NewUserModal';
import { CookieNotice } from './components/CookieNotice';
import { ToastContainer } from './components/ToastContainer';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { AccountView } from './views/AccountView';
import { PromoView } from './views/PromoView';
import { BlogView } from './views/BlogView';
import { StaticPagesView } from './views/StaticPagesView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminLoginView } from './views/AdminLoginView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { InvoiceView } from './views/InvoiceView';

const AppContent: React.FC = () => {
  const { currentView, authRole } = useShop();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
      case 'categories':
      case 'new-arrivals':
      case 'best-sellers':
        return <ShopView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'tracking':
      case 'order-confirmation':
        return <OrderTrackingView />;
      case 'account':
        return <AccountView />;
      case 'promo':
        return <PromoView />;
      case 'blog':
        return <BlogView />;
      case 'login':
        return <LoginView />;
      case 'register':
        return <RegisterView />;
      case 'invoice':
        return <InvoiceView />;
      case 'admin-login':
        return <AdminLoginView />;
      case 'admin':
        return authRole === 'ADMIN' ? <AdminDashboardView /> : <AdminLoginView />;
      case 'about':
        return <StaticPagesView pageType="about" />;
      case 'contact':
        return <StaticPagesView pageType="contact" />;
      case 'faq':
        return <StaticPagesView pageType="faq" />;
      case 'terms':
        return <StaticPagesView pageType="terms" />;
      case 'privacy':
        return <StaticPagesView pageType="privacy" />;
      case 'refund-policy':
        return <StaticPagesView pageType="refund-policy" />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* Sticky Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-28 md:pb-12">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />

      {/* WhatsApp Floating Chat Widget */}
      <WhatsAppFloating />

      {/* Modals & Overlays */}
      <GuestLoginPromptModal />
      <AuthModal />
      <NewUserModal />
      <CookieNotice />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
