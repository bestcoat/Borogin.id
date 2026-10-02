import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  ProductVariation, 
  CartItem, 
  Coupon, 
  Order, 
  ShippingRate, 
  UserProfile, 
  OrderStatus, 
  Review, 
  PaymentProof, 
  StoreSettings,
  BlogPost
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_COUPONS, 
  INITIAL_SHIPPING_RATES,
  INITIAL_BLOG_POSTS
} from '../data/mockData';
import { OFFICIAL_WA_NUMBER_DISPLAY, OFFICIAL_WA_NUMBER_INTL } from '../services/whatsappService';

export type AppView = 
  | 'home'
  | 'shop'
  | 'categories'
  | 'promo'
  | 'new-arrivals'
  | 'best-sellers'
  | 'blog'
  | 'about'
  | 'contact'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'product-detail'
  | 'account'
  | 'tracking'
  | 'invoice'
  | 'login'
  | 'register'
  | 'admin'
  | 'admin-login'
  | 'faq'
  | 'terms'
  | 'privacy'
  | 'refund-policy';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export interface PendingBuyAction {
  productId: string;
  variationId?: string;
  quantity: number;
  action: 'cart' | 'buy';
}

interface ShopContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedBlogId: string | null;
  setSelectedBlogId: (id: string | null) => void;
  
  // Auth State & Role
  authRole: 'GUEST' | 'CUSTOMER' | 'ADMIN';
  isAuthenticated: boolean;
  user: UserProfile | null;
  refreshAuth: () => Promise<void>;
  customerLogout: () => Promise<void>;
  adminLogout: () => Promise<void>;

  // Guest Interceptor Prompt
  isGuestPromptOpen: boolean;
  setIsGuestPromptOpen: (open: boolean) => void;
  pendingBuyAction: PendingBuyAction | null;
  setPendingBuyAction: (action: PendingBuyAction | null) => void;

  // Catalog & Inventory
  products: Product[];
  categories: typeof INITIAL_CATEGORIES;
  coupons: Coupon[];
  fetchProducts: () => Promise<void>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  addNewProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (productId: string, updatedData: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Store Settings (BCA, QRIS, WhatsApp)
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  buyNow: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  calculateDiscount: (subtotal: number) => number;

  // Checkout & Orders
  selectedShipping: ShippingRate;
  setSelectedShipping: (shipping: ShippingRate) => void;
  shippingRates: ShippingRate[];
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>) => Promise<Order | null>;
  submitPaymentProof: (orderNumber: string, proof: PaymentProof) => Promise<boolean>;
  confirmPayment: (orderId: string) => Promise<void>;
  rejectPayment: (orderId: string, reason?: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => Promise<void>;

  // Reviews
  addProductReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;

  // UI Toasts & Helpers
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  formatRupiah: (amount: number) => string;

  // Blog
  blogPosts: BlogPost[];
  addNewBlogPost: (post: Omit<BlogPost, 'id' | 'date'>) => Promise<BlogPost | null>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<boolean>;
  deleteBlogPost: (id: string) => Promise<boolean>;

  // Backward compatibility aliases
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  redeemPoints: (pointsCost: number, voucherValue: number) => boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  whatsAppInitialMessage: string;
  setWhatsAppInitialMessage: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('p-1');
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Auth state
  const [authRole, setAuthRole] = useState<'GUEST' | 'CUSTOMER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // WhatsApp Floating Modal State
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppInitialMessage, setWhatsAppInitialMessage] = useState('Halo Borongin, saya ingin bertanya mengenai produk.');

  // Guest Interceptor state
  const [isGuestPromptOpen, setIsGuestPromptOpen] = useState(false);
  const [pendingBuyAction, setPendingBuyAction] = useState<PendingBuyAction | null>(null);

  // Store Settings
  const DEFAULT_STORE_SETTINGS: StoreSettings = {
    bcaBank: 'BCA',
    bcaAccountNumber: '11254666447',
    bcaAccountHolder: 'Borongin',
    qrisImage: 'https://images.unsplash.com/photo-1595079672139-545c02557142?auto=format&fit=crop&w=600&q=80',
    whatsappNumber: OFFICIAL_WA_NUMBER_DISPLAY,
    whatsappInternational: OFFICIAL_WA_NUMBER_INTL,
    isCodEnabled: true,
    freeShippingMin: 100000,
    storeTagline: 'Belanja Mudah, Harga Bersahabat'
  };
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  // Products
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('borongin_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('borongin_cart', JSON.stringify(cart));
  }, [cart]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('borongin_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch { return ['p-1']; }
    }
    return ['p-1'];
  });

  useEffect(() => {
    localStorage.setItem('borongin_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Shipping
  const [shippingRates] = useState<ShippingRate[]>(INITIAL_SHIPPING_RATES);
  const [selectedShipping, setSelectedShipping] = useState<ShippingRate>(INITIAL_SHIPPING_RATES[0]);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Blog Posts
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('borongin_blog_posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_BLOG_POSTS;
  });

  useEffect(() => {
    localStorage.setItem('borongin_blog_posts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatRupiah = (num: number) => {
    return 'Rp' + Math.max(0, num).toLocaleString('id-ID');
  };

  // Fetch session on load
  const refreshAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAuthRole(data.role);
          setUser({
            ...data.user,
            role: data.role
          });
        } else {
          setAuthRole('GUEST');
          setUser(null);
        }
      }
    } catch (e) {
      // Fallback
    }
  };

  // Load products from server
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?status=all');
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch (e) {}
  };

  // Load store settings from server
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setStoreSettings(data.settings);
        }
      }
    } catch (e) {}
  };

  // Load orders from server
  const fetchOrders = async () => {
    try {
      if (authRole === 'ADMIN') {
        const res = await fetch('/api/orders/admin/all');
        if (res.ok) {
          const data = await res.json();
          if (data.orders) {
            setOrders(data.orders);
            if (!activeOrder && data.orders.length > 0) {
              setActiveOrder(data.orders[0]);
            }
          }
        }
      } else if (authRole === 'CUSTOMER') {
        const res = await fetch('/api/orders/my');
        if (res.ok) {
          const data = await res.json();
          if (data.orders) {
            setOrders(data.orders);
            if (!activeOrder && data.orders.length > 0) {
              setActiveOrder(data.orders[0]);
            }
          }
        }
      }
    } catch (e) {}
  };

  // Load blog posts from server
  const fetchBlogPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          setBlogPosts(data.posts);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    refreshAuth();
    fetchProducts();
    fetchSettings();
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [authRole]);

  // Customer Logout
  const customerLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setAuthRole('GUEST');
    setUser(null);
    showToast('Anda telah berhasil keluar dari akun.', 'info');
    setCurrentView('home');
  };

  // Admin Logout
  const adminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setAuthRole('GUEST');
    setUser(null);
    showToast('Logout dari Portal Administrator berhasil.', 'info');
    setCurrentView('home');
  };

  // Cart operations with Guest Interception
  const addToCart = (product: Product, variation?: ProductVariation, quantity: number = 1) => {
    if (product.stock <= 0) {
      showToast(`Maaf, produk "${product.title}" sedang habis.`, 'warning');
      return;
    }

    // Intercept Guest: Must login / register before adding to cart
    if (authRole === 'GUEST' || !user) {
      setPendingBuyAction({
        productId: product.id,
        variationId: variation?.id,
        quantity,
        action: 'cart'
      });
      setIsGuestPromptOpen(true);
      return;
    }

    const cartItemId = variation ? `${product.id}-${variation.id}` : product.id;
    const existingIndex = cart.findIndex((item) => item.id === cartItemId);

    if (existingIndex > -1) {
      const updated = [...cart];
      const newQty = updated[existingIndex].quantity + quantity;
      const maxAvailable = variation ? variation.stock : product.stock;

      if (newQty > maxAvailable) {
        showToast(`Maksimal stok yang tersedia hanya ${maxAvailable} unit.`, 'warning');
        return;
      }
      updated[existingIndex].quantity = newQty;
      setCart(updated);
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedVariation: variation,
          quantity
        }
      ]);
    }
    showToast(`Berhasil menambahkan "${product.title}" ke keranjang!`, 'success');
  };

  const buyNow = (product: Product, variation?: ProductVariation, quantity: number = 1) => {
    if (product.stock <= 0) {
      showToast(`Maaf, produk "${product.title}" sedang habis.`, 'warning');
      return;
    }

    // Intercept Guest: Must login / register before proceeding to checkout
    if (authRole === 'GUEST' || !user) {
      setPendingBuyAction({
        productId: product.id,
        variationId: variation?.id,
        quantity,
        action: 'buy'
      });
      setIsGuestPromptOpen(true);
      return;
    }

    addToCart(product, variation, quantity);
    setCurrentView('checkout');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Produk dihapus dari keranjang.', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const maxStock = item.selectedVariation ? item.selectedVariation.stock : item.product.stock;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((total, item) => {
    const price = item.selectedVariation ? item.selectedVariation.price : item.product.price;
    return total + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast('Dihapus dari wishlist.', 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast('Ditambahkan ke wishlist favorit Anda!', 'success');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupons
  const calculateDiscount = (subtotal: number): number => {
    if (!appliedCoupon) return 0;
    if (subtotal < appliedCoupon.minSpend) return 0;

    let discount = 0;
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountType === 'fixed') {
      discount = appliedCoupon.value;
    } else if (appliedCoupon.discountType === 'free_shipping') {
      discount = Math.min(selectedShipping.cost, appliedCoupon.value);
    }
    return Math.min(discount, subtotal);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);
    if (!found) {
      return { success: false, message: 'Kode kupon tidak valid atau telah kadaluarsa.' };
    }
    if (cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Minimal belanja untuk kupon ${found.code} adalah ${formatRupiah(found.minSpend)}.`
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Kupon ${found.code} berhasil digunakan!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Kupon promo dibatalkan.', 'info');
  };

  // Orders creation on server
  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Promise<Order | null> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || 'Gagal memproses pesanan.', 'error');
        return null;
      }

      const created: Order = data.order;
      setOrders((prev) => [created, ...prev]);
      setActiveOrder(created);
      clearCart();
      setAppliedCoupon(null);
      fetchProducts(); // Refresh stock counts from server
      return created;
    } catch (e) {
      showToast('Terjadi kendala jaringan saat membuat pesanan.', 'error');
      return null;
    }
  };

  // Submit Payment Proof to server
  const submitPaymentProof = async (orderNumber: string, proof: PaymentProof): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderNumber}/proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proof)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Gagal mengunggah bukti pembayaran.', 'error');
        return false;
      }

      const updated = data.order;
      setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? updated : o)));
      if (activeOrder && activeOrder.orderNumber === orderNumber) {
        setActiveOrder(updated);
      }
      showToast('Bukti transfer berhasil dikirim! Status pesanan kini: Menunggu Verifikasi Pembayaran.', 'success');
      return true;
    } catch (e) {
      showToast('Gagal mengirim bukti pembayaran ke server.', 'error');
      return false;
    }
  };

  // Admin Confirm Payment
  const confirmPayment = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/admin/${orderId}/confirm-payment`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder(data.order);
        }
        showToast(data.message, 'success');
        fetchProducts();
      } else {
        showToast(data.message || 'Gagal mengonfirmasi pembayaran.', 'error');
      }
    } catch (e) {
      showToast('Gagal memproses konfirmasi pembayaran.', 'error');
    }
  };

  // Admin Reject Payment
  const rejectPayment = async (orderId: string, reason?: string) => {
    try {
      const res = await fetch(`/api/orders/admin/${orderId}/reject-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder(data.order);
        }
        showToast(data.message, 'warning');
      } else {
        showToast(data.message || 'Gagal menolak pembayaran.', 'error');
      }
    } catch (e) {
      showToast('Gagal memproses penolakan pembayaran.', 'error');
    }
  };

  // Admin Status Update / Shipping Resi
  const updateOrderStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    try {
      if (trackingNumber) {
        const res = await fetch(`/api/orders/admin/${orderId}/shipping`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackingNumber })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
          showToast(data.message, 'success');
          return;
        }
      }

      const res = await fetch(`/api/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        showToast(data.message, 'success');
      }
    } catch (e) {
      showToast('Gagal memperbarui status order.', 'error');
    }
  };

  // Products CRUD
  const updateProductStock = async (productId: string, newStock: number) => {
    try {
      const res = await fetch(`/api/products/admin/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? data.product : p)));
        showToast(data.message, 'success');
      }
    } catch (e) {
      showToast('Gagal mengubah stok di server.', 'error');
    }
  };

  const addNewProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/products/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => [data.product, ...prev]);
        showToast(data.message, 'success');
      }
    } catch (e) {
      showToast('Gagal menambahkan produk baru ke server.', 'error');
    }
  };

  const updateProduct = async (productId: string, updatedData: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/admin/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? data.product : p)));
        showToast(data.message, 'success');
      }
    } catch (e) {
      showToast('Gagal menyimpan perubahan produk.', 'error');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/admin/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        showToast(data.message, 'info');
      }
    } catch (e) {
      showToast('Gagal menghapus produk.', 'error');
    }
  };

  // Store Settings update
  const updateStoreSettings = async (settingsUpdates: Partial<StoreSettings>) => {
    try {
      const res = await fetch('/api/settings/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsUpdates)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStoreSettings(data.settings);
        showToast(data.message, 'success');
      }
    } catch (e) {
      showToast('Gagal menyimpan pengaturan toko.', 'error');
    }
  };

  // Blog Operations
  const addNewBlogPost = async (postData: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost | null> => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newPost: BlogPost = {
      ...postData,
      id: `blog-${Date.now()}`,
      date: todayStr
    };

    // Client-side optimistic update & persistence
    setBlogPosts((prev) => [newPost, ...prev]);

    // Backend sync
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.post) {
          setBlogPosts((prev) => prev.map((p) => (p.id === newPost.id ? data.post : p)));
          showToast('Artikel blog berhasil diterbitkan!', 'success');
          return data.post;
        }
      }
    } catch (e) {}

    showToast('Artikel blog berhasil diterbitkan!', 'success');
    return newPost;
  };

  const updateBlogPost = async (id: string, updates: Partial<BlogPost>): Promise<boolean> => {
    // Client-side update
    setBlogPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

    // Backend sync
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.post) {
          setBlogPosts((prev) => prev.map((p) => (p.id === id ? data.post : p)));
        }
      }
    } catch (e) {}

    showToast('Artikel blog berhasil diperbarui!', 'success');
    return true;
  };

  const deleteBlogPost = async (id: string): Promise<boolean> => {
    // Client-side delete
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));

    // Backend sync
    try {
      await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    } catch (e) {}

    showToast('Artikel blog berhasil dihapus.', 'info');
    return true;
  };

  // Add Product Review
  const addProductReview = (productId: string, review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10)
    };
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newRev, ...p.reviews];
          const newAvg = parseFloat(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            rating: newAvg,
            reviewCount: updatedReviews.length,
            reviews: updatedReviews
          };
        }
        return p;
      })
    );
    showToast('Terima kasih! Ulasan produk Anda telah ditambahkan.', 'success');
  };

  // Backward-compatibility helpers
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok && resData.user) {
        setUser(resData.user);
        showToast('Profil Anda berhasil diperbarui!', 'success');
      }
    } catch (e) {}
  };

  const redeemPoints = (pointsCost: number, voucherValue: number): boolean => {
    if (!user || user.points < pointsCost) {
      showToast('Poin Anda tidak mencukupi untuk penukaran kupon ini.', 'warning');
      return false;
    }
    const voucherCode = `POIN-${voucherValue / 1000}K-${Math.floor(100 + Math.random() * 900)}`;
    const newCoupon: Coupon = {
      code: voucherCode,
      discountType: 'fixed',
      value: voucherValue,
      minSpend: voucherValue * 2,
      description: `Voucher Poin Rp${voucherValue.toLocaleString('id-ID')} (Tukar ${pointsCost} Poin)`
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    setUser((prev) => (prev ? { ...prev, points: prev.points - pointsCost } : null));
    showToast(`Voucher ${voucherCode} berhasil dibuat dari penukaran poin!`, 'success');
    return true;
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedBlogId,
        setSelectedBlogId,
        authRole,
        isAuthenticated: authRole !== 'GUEST',
        user,
        refreshAuth,
        customerLogout,
        adminLogout,
        isGuestPromptOpen,
        setIsGuestPromptOpen,
        pendingBuyAction,
        setPendingBuyAction,
        products,
        categories,
        coupons,
        fetchProducts,
        updateProductStock,
        addNewProduct,
        updateProduct,
        deleteProduct,
        storeSettings,
        updateStoreSettings,
        cart,
        addToCart,
        buyNow,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        calculateDiscount,
        selectedShipping,
        setSelectedShipping,
        shippingRates,
        orders,
        activeOrder,
        setActiveOrder,
        createOrder,
        submitPaymentProof,
        confirmPayment,
        rejectPayment,
        updateOrderStatus,
        addProductReview,
        toasts,
        showToast,
        removeToast,
        formatRupiah,
        blogPosts,
        addNewBlogPost,
        updateBlogPost,
        deleteBlogPost,
        isAdminAuthenticated: authRole === 'ADMIN',
        setIsAdminAuthenticated: (val: boolean) => setAuthRole(val ? 'ADMIN' : 'GUEST'),
        isAuthModalOpen,
        setIsAuthModalOpen,
        updateUserProfile,
        redeemPoints,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        whatsAppInitialMessage,
        setWhatsAppInitialMessage
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
