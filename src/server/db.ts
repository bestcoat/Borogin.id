import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Product, Category, Coupon, StoreSettings, Order, UserProfile, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS } from '../data/mockData';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  salt: string;
  role: 'GUEST' | 'CUSTOMER' | 'ADMIN';
  memberTier: 'Bronze' | 'Silver' | 'Gold';
  points: number;
  avatar: string;
  address?: {
    province: string;
    city: string;
    district: string;
    subDistrict: string;
    address: string;
    postalCode: string;
  };
  resetToken?: string;
  resetExpires?: number;
  createdAt: string;
}

export interface CartRecord {
  userId: string;
  items: {
    productId: string;
    variationId?: string;
    quantity: number;
  }[];
  updatedAt: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  orders: Order[];
  carts: CartRecord[];
  settings: StoreSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing helper
export function hashPasswordWithSalt(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, chosenSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: chosenSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return check === hash;
}

// Default initial database state
function createDefaultDatabase(): DatabaseSchema {
  // Default admin user
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Borongin2026!Admin';
  const { hash: adminHash } = hashPasswordWithSalt(adminPassword, adminSalt);

  const defaultAdmin: UserRecord = {
    id: 'user-admin-1',
    name: 'Administrator BORONGIN',
    email: 'admin@borongin.id',
    phone: '087722631751',
    passwordHash: adminHash,
    salt: adminSalt,
    role: 'ADMIN',
    memberTier: 'Gold',
    points: 10000,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  };

  // Default initial customer (Budi Santoso)
  const custSalt = crypto.randomBytes(16).toString('hex');
  const { hash: custHash } = hashPasswordWithSalt('budi12345', custSalt);
  const defaultCustomer: UserRecord = {
    id: 'user-cust-1',
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    phone: '081298765432',
    passwordHash: custHash,
    salt: custSalt,
    role: 'CUSTOMER',
    memberTier: 'Silver',
    points: 450,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    address: {
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      district: 'Kebayoran Baru',
      subDistrict: 'Senayan',
      address: 'Jl. Merdeka No. 45, RT 02/RW 04',
      postalCode: '12190'
    },
    createdAt: new Date().toISOString()
  };

  const defaultSettings: StoreSettings = {
    bcaBank: 'BCA',
    bcaAccountNumber: '11254666447',
    bcaAccountHolder: 'Borongin',
    qrisImage: 'https://images.unsplash.com/photo-1595079672139-545c02557142?auto=format&fit=crop&w=600&q=80',
    whatsappNumber: '087722631751',
    whatsappInternational: '6287722631751',
    isCodEnabled: true,
    freeShippingMin: 100000,
    storeTagline: 'Belanja Mudah, Harga Bersahabat'
  };

  // Seed sample initial completed order for Budi
  const sampleOrder: Order = {
    id: 'ord-initial-1',
    orderNumber: 'BRG-20261001-00001',
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
      notes: 'Tolong titip di pos satpam bila tidak ada orang di rumah.'
    },
    items: [
      {
        id: 'item-init-1',
        productId: INITIAL_PRODUCTS[0].id,
        product: INITIAL_PRODUCTS[0],
        selectedVariation: INITIAL_PRODUCTS[0].variations?.[0],
        quantity: 1
      }
    ],
    subtotal: 349000,
    discount: 34900,
    shippingCost: 14000,
    shippingCourier: {
      courier: 'J&T Express',
      service: 'EZ',
      cost: 14000,
      estimatedDays: '1-2 Hari'
    },
    total: 328100,
    paymentMethod: 'bca_transfer',
    paymentMethodName: 'Transfer Bank BCA Manual',
    paymentStatus: 'paid',
    status: 'shipped',
    trackingNumber: 'JT98273641029ID',
    createdAt: '2026-10-01 14:20:00',
    paidAt: '2026-10-01 14:35:10',
    shippedAt: '2026-10-01 18:00:00',
    paymentProof: {
      senderName: 'Budi Santoso',
      orderNumber: 'BRG-20261001-00001',
      transferAmount: 328100,
      transferDate: '2026-10-01',
      proofImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      uploadedAt: '2026-10-01 14:30:00'
    },
    timeline: [
      {
        status: 'pending_payment',
        title: 'Pesanan Dibuat',
        description: 'Menunggu transfer BCA Rp328.100 ke rekening 11254666447 a.n. Borongin.',
        timestamp: '01 Okt 2026, 14:20'
      },
      {
        status: 'payment_verification',
        title: 'Bukti Pembayaran Diunggah',
        description: 'Customer telah mengunggah bukti transfer.',
        timestamp: '01 Okt 2026, 14:30'
      },
      {
        status: 'paid',
        title: 'Pembayaran Dikonfirmasi (PAID)',
        description: 'Admin finance telah memverifikasi mutasi rekening BCA.',
        timestamp: '01 Okt 2026, 14:35'
      },
      {
        status: 'shipped',
        title: 'Pesanan Dikirim oleh J&T Express',
        description: 'Resi pengiriman: JT98273641029ID.',
        timestamp: '01 Okt 2026, 18:00'
      }
    ]
  };

  return {
    users: [defaultAdmin, defaultCustomer],
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    coupons: INITIAL_COUPONS,
    orders: [sampleOrder],
    carts: [],
    settings: defaultSettings
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return parsed;
      }
    } catch (e) {
      console.error('Failed reading DB file, seeding fresh default store:', e);
    }
    const defaultData = createDefaultDatabase();
    this.saveImmediate(defaultData);
    return defaultData;
  }

  private saveImmediate(d: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed saving to store.json:', e);
    }
  }

  public save() {
    this.saveImmediate(this.data);
  }

  // Users
  public getUsers(): UserRecord[] {
    return this.data.users;
  }

  public findUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public findUserById(id: string): UserRecord | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findAdminUser(usernameOrEmail: string): UserRecord | undefined {
    const clean = usernameOrEmail.trim().toLowerCase();
    return this.data.users.find(
      u => u.role === 'ADMIN' && (clean === 'boronginadm' || u.email.toLowerCase() === clean)
    );
  }

  public addUser(user: UserRecord): UserRecord {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<UserRecord>): UserRecord | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return undefined;
  }

  // Products
  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(product: Product): Product {
    this.data.products.unshift(product);
    this.save();
    return product;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.products[idx] = { ...this.data.products[idx], ...updates };
      this.save();
      return this.data.products[idx];
    }
    return undefined;
  }

  public deleteProduct(id: string): boolean {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.products.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Atomically reduce product stock when an order is created or payment confirmed
   */
  public decrementStock(productId: string, quantity: number, variationId?: string): boolean {
    const product = this.getProductById(productId);
    if (!product) return false;

    if (variationId && product.variations) {
      const v = product.variations.find(item => item.id === variationId);
      if (v) {
        v.stock = Math.max(0, v.stock - quantity);
      }
    }

    product.stock = Math.max(0, product.stock - quantity);
    product.soldCount = (product.soldCount || 0) + quantity;
    if (product.stock <= 0) {
      product.status = 'out_of_stock';
    }
    this.save();
    return true;
  }

  // Categories
  public getCategories(): Category[] {
    return this.data.categories;
  }

  public addCategory(cat: Category): Category {
    this.data.categories.push(cat);
    this.save();
    return cat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | undefined {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
      this.save();
      return this.data.categories[idx];
    }
    return undefined;
  }

  public deleteCategory(id: string): boolean {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.categories.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Orders
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  public getOrderByOrderNumber(orderNumber: string): Order | undefined {
    return this.data.orders.find(o => o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase());
  }

  public getOrdersByCustomerEmail(email: string): Order[] {
    const clean = email.toLowerCase().trim();
    return this.data.orders.filter(o => o.customer.email.toLowerCase().trim() === clean);
  }

  public addOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.save();
    return order;
  }

  public updateOrder(id: string, updates: Partial<Order>): Order | undefined {
    const idx = this.data.orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      this.data.orders[idx] = { ...this.data.orders[idx], ...updates };
      this.save();
      return this.data.orders[idx];
    }
    return undefined;
  }

  // Settings
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // Coupons
  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public addCoupon(c: Coupon): Coupon {
    this.data.coupons.push(c);
    this.save();
    return c;
  }

  // Cart per User
  public getCart(userId: string): CartRecord | undefined {
    return this.data.carts.find(c => c.userId === userId);
  }

  public saveCart(userId: string, items: CartRecord['items']): void {
    const existing = this.data.carts.findIndex(c => c.userId === userId);
    if (existing !== -1) {
      this.data.carts[existing].items = items;
      this.data.carts[existing].updatedAt = new Date().toISOString();
    } else {
      this.data.carts.push({
        userId,
        items,
        updatedAt: new Date().toISOString()
      });
    }
    this.save();
  }

  public clearCart(userId: string): void {
    this.data.carts = this.data.carts.filter(c => c.userId !== userId);
    this.save();
  }
}

export const db = new Database();
