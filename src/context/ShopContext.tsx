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
  Review 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_COUPONS, 
  INITIAL_USER,
  INITIAL_SHIPPING_RATES 
} from '../data/mockData';

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
  | 'admin'
  | 'wordpress-blueprint'
  | 'faq'
  | 'terms'
  | 'privacy'
  | 'refund-policy';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface ShopContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedBlogId: string | null;
  setSelectedBlogId: (id: string | null) => void;
  products: Product[];
  categories: typeof INITIAL_CATEGORIES;
  coupons: Coupon[];
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupon & Discounts
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  calculateDiscount: (subtotal: number) => number;

  // Checkout & Shipping
  selectedShipping: ShippingRate;
  setSelectedShipping: (shipping: ShippingRate) => void;
  shippingRates: ShippingRate[];
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>) => Order;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  simulatePaymentWebhook: (orderId: string) => void;

  // Customer Profile & Points
  user: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  redeemPoints: (pointsCost: number, voucherValue: number) => boolean;

  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (categorySlug: string) => void;

  // Reviews
  addProductReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;

  // Admin stock / Inventory
  updateProductStock: (productId: string, newStock: number) => void;
  addNewProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (productId: string, updatedData: Partial<Product>) => void;

  // Toasts & Modals
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isBlueprintModalOpen: boolean;
  setIsBlueprintModalOpen: (open: boolean) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  whatsAppInitialMessage: string;
  setWhatsAppInitialMessage: (msg: string) => void;
  formatRupiah: (amount: number) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('p-1');
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Products state with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('borongin_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('borongin_products', JSON.stringify(products));
  }, [products]);

  // Cart state with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('borongin_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('borongin_cart', JSON.stringify(cart));
  }, [cart]);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('borongin_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['p-1', 'p-4'];
      }
    }
    return ['p-1', 'p-4'];
  });

  useEffect(() => {
    localStorage.setItem('borongin_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Applied Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // Shipping
  const [shippingRates] = useState<ShippingRate[]>(INITIAL_SHIPPING_RATES);
  const [selectedShipping, setSelectedShipping] = useState<ShippingRate>(INITIAL_SHIPPING_RATES[0]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('borongin_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Initial mock order for realistic experience
    const initialOrder: Order = {
      id: 'ord-initial',
      orderNumber: 'BRG-20260927-00108',
      customer: {
        fullName: 'Budi Santoso',
        phone: '081298765432',
        email: 'budi.santoso@example.com',
        address: 'Jl. Merdeka No. 45, RT 02/RW 04',
        province: 'DKI Jakarta',
        city: 'Jakarta Selatan',
        district: 'Kebayoran Baru',
        subDistrict: 'Senayan',
        postalCode: '12190',
        notes: 'Tolong titip di pos satpam bila tidak ada orang.'
      },
      items: [
        {
          id: 'item-init-1',
          productId: 'p-1',
          product: INITIAL_PRODUCTS[0],
          selectedVariation: INITIAL_PRODUCTS[0].variations?.[0],
          quantity: 1
        }
      ],
      subtotal: 349000,
      discount: 34900,
      shippingCost: 14000,
      shippingCourier: INITIAL_SHIPPING_RATES[0],
      total: 328100,
      paymentMethod: 'bca_va',
      paymentMethodName: 'BCA Virtual Account',
      paymentStatus: 'paid',
      status: 'shipped',
      trackingNumber: 'JT98273641029ID',
      createdAt: '2026-09-26 14:20:00',
      paidAt: '2026-09-26 14:25:12',
      shippedAt: '2026-09-27 09:15:00',
      virtualAccountNumber: '8271081298765432',
      timeline: [
        {
          status: 'pending_payment',
          title: 'Pesanan Dibuat',
          description: 'Menunggu konfirmasi pembayaran via BCA Virtual Account.',
          timestamp: '26 Sep 2026, 14:20'
        },
        {
          status: 'processing',
          title: 'Pembayaran Terverifikasi',
          description: 'Payment gateway Midtrans mendeteksi pembayaran sukses.',
          timestamp: '26 Sep 2026, 14:25'
        },
        {
          status: 'packed',
          title: 'Pesanan Dikemas',
          description: 'Pesanan dipacking dengan bubble wrap tebal di Warehouse Jakarta.',
          timestamp: '26 Sep 2026, 18:30'
        },
        {
          status: 'shipped',
          title: 'Pesanan Dikirim oleh J&T Express',
          description: 'Paket telah diserahkan ke kurir J&T dengan No. Resi JT98273641029ID.',
          timestamp: '27 Sep 2026, 09:15'
        }
      ]
    };
    return [initialOrder];
  });

  useEffect(() => {
    localStorage.setItem('borongin_orders', JSON.stringify(orders));
  }, [orders]);

  const [activeOrder, setActiveOrder] = useState<Order | null>(orders[0] || null);

  // User
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppInitialMessage, setWhatsAppInitialMessage] = useState('Halo Borongin.com, saya ingin bertanya tentang ketersediaan produk.');

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

  // Helper formatting
  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  // Cart operations
  const addToCart = (product: Product, variation?: ProductVariation, quantity: number = 1) => {
    if (product.stock <= 0) {
      showToast(`Maaf, produk ${product.title} sedang habis.`, 'warning');
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

  // Coupon calculations
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

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Order => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BRG-${dateStr}-${randomSeq}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toLocaleString('id-ID'),
      timeline: [
        {
          status: 'pending_payment',
          title: 'Pesanan Menunggu Pembayaran',
          description: `Silakan lakukan pembayaran sesuai instruksi ${orderData.paymentMethodName}.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    // Update inventory stock for purchased products
    setProducts((prev) =>
      prev.map((prod) => {
        const purchasedItem = orderData.items.find((item) => item.productId === prod.id);
        if (purchasedItem) {
          const newStock = Math.max(0, prod.stock - purchasedItem.quantity);
          const newSold = prod.soldCount + purchasedItem.quantity;
          return {
            ...prod,
            stock: newStock,
            soldCount: newSold
          };
        }
        return prod;
      })
    );

    // Award loyalty points (1 point per Rp10.000 spent)
    const earnedPoints = Math.floor(orderData.total / 10000);
    if (earnedPoints > 0) {
      setUser((prev) => ({
        ...prev,
        points: prev.points + earnedPoints
      }));
    }

    clearCart();
    setAppliedCoupon(null);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nowStr = new Date().toLocaleString('id-ID');
          const statusLabels: Record<OrderStatus, { title: string; desc: string }> = {
            pending_payment: { title: 'Menunggu Pembayaran', desc: 'Menunggu konfirmasi payment gateway.' },
            processing: { title: 'Pembayaran Dikonfirmasi', desc: 'Pesanan sedang diproses admin gudang.' },
            packed: { title: 'Pesanan Dikemas', desc: 'Barang telah dipacking rapi siap di-pickup ekspedisi.' },
            shipped: { title: 'Pesanan Dikirim', desc: `Paket diserahkan ke ${ord.shippingCourier.courier} (Resi: ${trackingNumber || ord.trackingNumber || 'JP-TRK-9901'})` },
            completed: { title: 'Pesanan Selesai', desc: 'Paket telah diterima dengan baik oleh pembeli.' },
            cancelled: { title: 'Pesanan Dibatalkan', desc: 'Pesanan dibatalkan sesuai permintaan/kadaluarsa.' },
            refunded: { title: 'Dana Dikembalikan', desc: 'Dana telah direfund ke rekening pelanggan.' }
          };

          const newTimelineItem = {
            status,
            title: statusLabels[status].title,
            description: statusLabels[status].desc,
            timestamp: nowStr
          };

          return {
            ...ord,
            status,
            trackingNumber: trackingNumber || ord.trackingNumber,
            paidAt: status === 'processing' || status === 'completed' ? ord.paidAt || nowStr : ord.paidAt,
            shippedAt: status === 'shipped' ? nowStr : ord.shippedAt,
            completedAt: status === 'completed' ? nowStr : ord.completedAt,
            paymentStatus: status === 'cancelled' || status === 'refunded' ? ord.paymentStatus : 'paid',
            timeline: [...ord.timeline, newTimelineItem]
          };
        }
        return ord;
      })
    );

    showToast(`Status pesanan berhasil diperbarui ke: ${status.toUpperCase()}`, 'success');
  };

  // Simulate payment webhook from Midtrans / Xendit
  const simulatePaymentWebhook = (orderId: string) => {
    updateOrderStatus(orderId, 'processing');
    showToast('Simulasi Webhook Midtrans: Pembayaran Berhasil Diterima!', 'success');
  };

  // User Profile
  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
    showToast('Profil pelanggan berhasil diperbarui!', 'success');
  };

  const redeemPoints = (pointsCost: number, voucherValue: number): boolean => {
    if (user.points < pointsCost) {
      showToast('Poin Anda tidak mencukupi untuk penukaran voucher ini.', 'warning');
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
    setUser((prev) => ({ ...prev, points: prev.points - pointsCost }));
    showToast(`Voucher ${voucherCode} berhasil dibuat dari penukaran poin!`, 'success');
    return true;
  };

  // Reviews
  const addProductReview = (productId: string, review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10)
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const newAvgRating = parseFloat(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            rating: newAvgRating,
            reviewCount: updatedReviews.length,
            reviews: updatedReviews
          };
        }
        return p;
      })
    );
    showToast('Terima kasih! Ulasan produk Anda telah ditambahkan.', 'success');
  };

  // Admin inventory
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, stock: Math.max(0, newStock) };
        }
        return p;
      })
    );
    showToast('Stok produk berhasil diperbarui!', 'success');
  };

  const addNewProduct = (prodData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produk baru "${prodData.title}" berhasil ditambahkan!`, 'success');
  };

  const updateProduct = (productId: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedData } : p))
    );
    showToast('Data produk berhasil diperbarui!', 'success');
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
        products,
        categories: INITIAL_CATEGORIES,
        coupons,
        cart,
        addToCart,
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
        createOrder,
        activeOrder,
        setActiveOrder,
        updateOrderStatus,
        simulatePaymentWebhook,
        user,
        updateUserProfile,
        redeemPoints,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        addProductReview,
        updateProductStock,
        addNewProduct,
        updateProduct,
        toasts,
        showToast,
        removeToast,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isBlueprintModalOpen,
        setIsBlueprintModalOpen,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        whatsAppInitialMessage,
        setWhatsAppInitialMessage,
        formatRupiah
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
