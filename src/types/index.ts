export interface ProductVariation {
  id: string;
  name: string; // e.g. "Hitam - L", "Putih - M"
  color?: string;
  size?: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  avatar?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  minStockAlert: number;
  category: string;
  brand: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  isFreeShipping?: boolean;
  isNewArrival?: boolean;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  weightGrams: number;
  dimensions?: string; // Dimensi cm (P x L x T)
  status?: 'published' | 'draft' | 'out_of_stock' | 'inactive';
  variations?: ProductVariation[];
  reviews: Review[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  itemCount: number;
  description?: string;
}

export interface CartItem {
  id: string; // unique item id in cart (product.id + variation.id)
  productId: string;
  product: Product;
  selectedVariation?: ProductVariation;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // e.g., 10 for 10%, or 20000 for Rp20.000
  minSpend: number;
  maxDiscount?: number;
  description: string;
  expiresAt?: string;
}

export interface ShippingRate {
  courier: string; // 'J&T Express' | 'JNE' | 'SiCepat' | 'AnterAja' | 'POS Indonesia' | 'Ninja Xpress'
  service: string; // e.g., 'REG', 'BEST', 'YES', 'GOKIL'
  cost: number;
  estimatedDays: string; // e.g. '1-2 Hari', '2-3 Hari'
  logo?: string;
}

export type PaymentMethodType = 
  | 'bca_va'
  | 'bri_va'
  | 'bni_va'
  | 'mandiri_va'
  | 'bca_transfer'
  | 'mandiri_transfer'
  | 'gopay'
  | 'ovo'
  | 'dana'
  | 'shopeepay'
  | 'qris'
  | 'credit_card'
  | 'cod';

export type OrderStatus =
  | 'pending_payment'
  | 'payment_verification'
  | 'paid'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'payment_rejected';

export interface PaymentProof {
  senderName: string;
  orderNumber: string;
  transferAmount: number;
  transferDate: string;
  proofImage: string;
  uploadedAt: string;
  rejectionReason?: string;
}

export interface StoreSettings {
  bcaBank: string;
  bcaAccountNumber: string;
  bcaAccountHolder: string;
  qrisImage: string;
  whatsappNumber: string; // 087722631751
  whatsappInternational: string; // 6287722631751
  isCodEnabled: boolean;
  freeShippingMin: number;
  storeTagline: string;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  city: string;
  district: string; // Kecamatan
  subDistrict: string; // Kelurahan
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "BRG-20260928-00001"
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  shippingCourier: ShippingRate;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentMethodName: string;
  paymentStatus: 'unpaid' | 'paid' | 'failed';
  status: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  completedAt?: string;
  virtualAccountNumber?: string;
  qrisPayload?: string;
  paymentProof?: PaymentProof;
  timeline: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
  }[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'GUEST' | 'CUSTOMER' | 'ADMIN';
  memberTier: 'Bronze' | 'Silver' | 'Gold';
  points: number;
  avatar: string;
  joinedDate: string;
  address?: {
    province: string;
    city: string;
    district: string;
    subDistrict: string;
    address: string;
    postalCode: string;
  };
}
