import { Product, Category, Coupon, BlogPost, ShippingRate, UserProfile } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'elektronik',
    name: 'Elektronik',
    slug: 'elektronik',
    iconName: 'Tv',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    itemCount: 42,
    description: 'Smart TV, Audio, Kamera, dan perlengkapan elektronik rumah.'
  },
  {
    id: 'fashion-pria',
    name: 'Fashion Pria',
    slug: 'fashion-pria',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
    itemCount: 88,
    description: 'Kemeja, kaos, celana, jaket, dan busana pria trendi.'
  },
  {
    id: 'fashion-wanita',
    name: 'Fashion Wanita',
    slug: 'fashion-wanita',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    itemCount: 120,
    description: 'Dress, blouse, gamis, hijab, dan fashion wanita modern.'
  },
  {
    id: 'kecantikan',
    name: 'Kecantikan',
    slug: 'kecantikan',
    iconName: 'Heart',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    itemCount: 65,
    description: 'Skincare, makeup, parfum, dan perawatan tubuh BPOM.'
  },
  {
    id: 'rumah-tangga',
    name: 'Rumah Tangga',
    slug: 'rumah-tangga',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
    itemCount: 75,
    description: 'Peralatan dapur, dekorasi ruangan, kebersihan, dan perlengkapan rumah.'
  },
  {
    id: 'makanan',
    name: 'Makanan',
    slug: 'makanan',
    iconName: 'Utensils',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    itemCount: 54,
    description: 'Camilan lokal, sembako, makanan instan, dan olahan nusantara.'
  },
  {
    id: 'minuman',
    name: 'Minuman',
    slug: 'minuman',
    iconName: 'Coffee',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    itemCount: 38,
    description: 'Kopi Nusantara, teh herbal, sirup, dan minuman segar.'
  },
  {
    id: 'kesehatan',
    name: 'Kesehatan',
    slug: 'kesehatan',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    itemCount: 45,
    description: 'Vitamin, suplemen daya tahan tubuh, dan alat medis esensial.'
  },
  {
    id: 'otomotif',
    name: 'Otomotif',
    slug: 'otomotif',
    iconName: 'Car',
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=600&q=80',
    itemCount: 30,
    description: 'Aksesoris motor & mobil, helm, oli, dan perawatan kendaraan.'
  },
  {
    id: 'komputer-gadget',
    name: 'Komputer & Gadget',
    slug: 'komputer-gadget',
    iconName: 'Laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
    itemCount: 60,
    description: 'Laptop, tablet, monitor, mouse gaming, dan keyboard mekanikal.'
  },
  {
    id: 'handphone-aksesoris',
    name: 'Handphone & Aksesoris',
    slug: 'handphone-aksesoris',
    iconName: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    itemCount: 95,
    description: 'Smartphone, TWS, casing, kabel data, power bank 20000mAh.'
  },
  {
    id: 'peralatan-kantor',
    name: 'Peralatan Kantor',
    slug: 'peralatan-kantor',
    iconName: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    itemCount: 28,
    description: 'ATK, kertas print, meja ergonomis, dan binder arsip.'
  },
  {
    id: 'hobi',
    name: 'Hobi',
    slug: 'hobi',
    iconName: 'Compass',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    itemCount: 40,
    description: 'Peralatan outdoor, camping, fotografi, dan alat musik.'
  },
  {
    id: 'anak-bayi',
    name: 'Anak & Bayi',
    slug: 'anak-bayi',
    iconName: 'Smile',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    itemCount: 52,
    description: 'Pakaian bayi, popok, mainan edukatif, dan susu formula.'
  },
  {
    id: 'produk-umkm',
    name: 'Produk UMKM',
    slug: 'produk-umkm',
    iconName: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80',
    itemCount: 110,
    description: 'Kerajinan tangan lokal, kain tenun, batik, dan madu hutan murni.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    title: 'Smartwatch Ultra Pro Waterproof Heart-Rate & SpO2 Monitor',
    slug: 'smartwatch-ultra-pro-waterproof',
    sku: 'BRG-ELK-001',
    price: 349000,
    originalPrice: 599000,
    discountPercent: 42,
    rating: 4.9,
    reviewCount: 482,
    soldCount: 2340,
    stock: 24,
    minStockAlert: 5,
    category: 'handphone-aksesoris',
    brand: 'Aegis Tech',
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    isFreeShipping: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Smartwatch modern dengan layar AMOLED 1.85 inci, mendukung panggilan Bluetooth, pelacakan detak jantung, SpO2, 100+ mode olahraga, dan sertifikasi tahan air IP68. Baterai tahan hingga 10 hari dalam sekali pengisian daya.',
    specifications: {
      'Layar': '1.85" HD AMOLED Color Touchscreen',
      'Konektivitas': 'Bluetooth 5.3',
      'Daya Tahan Baterai': 'Hingga 10 Hari (Penggunaan Normal)',
      'Water Resistance': 'IP68 Tahan Air & Debu',
      'Sensor': 'Optical Heart Rate, SpO2, Accelerometer',
      'Garansi': '12 Bulan Resmi Distributor'
    },
    weightGrams: 280,
    variations: [
      { id: 'v1-1', name: 'Hitam Doff', color: 'Hitam', sku: 'BRG-ELK-001-BLK', price: 349000, stock: 14 },
      { id: 'v1-2', name: 'Silver Titanium', color: 'Silver', sku: 'BRG-ELK-001-SLV', price: 369000, stock: 6 },
      { id: 'v1-3', name: 'Midnight Green', color: 'Hijau', sku: 'BRG-ELK-001-GRN', price: 349000, stock: 4 }
    ],
    reviews: [
      {
        id: 'r-1',
        userName: 'Rian Kurniawan',
        rating: 5,
        comment: 'Barang original, baterainya beneran awet semingguan baru charge. Pengiriman cepat banget cuma 1 hari ke Jakarta.',
        date: '2026-09-24',
        verifiedPurchase: true
      },
      {
        id: 'r-2',
        userName: 'Dwi Lestari',
        rating: 5,
        comment: 'Bagus pol, layarnya jernih di bawah matahari. Cocok banget buat nemenin lari pagi.',
        date: '2026-09-21',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-08-15'
  },
  {
    id: 'p-2',
    title: 'Kopi Arabika Gayo Aceh Single Origin Specialty 250gr',
    slug: 'kopi-arabika-gayo-aceh-250gr',
    sku: 'BRG-MNM-002',
    price: 68000,
    originalPrice: 95000,
    discountPercent: 28,
    rating: 4.8,
    reviewCount: 310,
    soldCount: 1890,
    stock: 45,
    minStockAlert: 10,
    category: 'minuman',
    brand: 'Nusantara Roast',
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    isFreeShipping: false,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Biji kopi pilihan dari perkebunan dataran tinggi Gayo Aceh (1.400 mdpl). Diproses secara wet hulled dengan aroma floral semerbak, acidity lembut, dan notes karamel serta dark chocolate.',
    specifications: {
      'Daerah Asal': 'Takengon, Aceh Tengah',
      'Ketinggian': '1.350 - 1.500 mdpl',
      'Proses': 'Full Washed',
      'Roast Level': 'Medium Roast',
      'Berat Bersih': '250 gram'
    },
    weightGrams: 280,
    variations: [
      { id: 'v2-1', name: 'Biji Utuh (Whole Beans)', sku: 'BRG-MNM-002-WB', price: 68000, stock: 20 },
      { id: 'v2-2', name: 'Giling Halus (Espresso)', sku: 'BRG-MNM-002-GF', price: 68000, stock: 15 },
      { id: 'v2-3', name: 'Giling Sedang (V60/Manual)', sku: 'BRG-MNM-002-GM', price: 68000, stock: 10 }
    ],
    reviews: [
      {
        id: 'r-3',
        userName: 'Ahmad Fauzan',
        rating: 5,
        comment: 'Fresh roast! Wangi semerbak pas kemasan dibuka. Crema tebal mantap buat kopi tubruk ataupun pour over.',
        date: '2026-09-22',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-09-01'
  },
  {
    id: 'p-3',
    title: 'Kemeja Linen Pria Premium Lengan Panjang Kerah Shanghai',
    slug: 'kemeja-linen-pria-premium-shanghai',
    sku: 'BRG-FSH-003',
    price: 139000,
    originalPrice: 220000,
    discountPercent: 37,
    rating: 4.8,
    reviewCount: 520,
    soldCount: 3120,
    stock: 58,
    minStockAlert: 8,
    category: 'fashion-pria',
    brand: 'Aruna Atelier',
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: false,
    isFreeShipping: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Kemeja pria bermaterial 100% serat linen katun premium yang sejuk, breathable, dan nyaman dikenakan sepanjang hari di iklim tropis. Desain kerah shanghai modern minimalis yang cocok untuk acara kasual maupun semi-formal.',
    specifications: {
      'Bahan': 'Linen Cotton Slub Grade A',
      'Model Kerah': 'Mandarin / Shanghai Collar',
      'Potongan': 'Regular Comfort Fit',
      'Karakteristik': 'Adem, Lembut, Menyerap Keringat'
    },
    weightGrams: 350,
    variations: [
      { id: 'v3-1', name: 'Putih Bersih - M', color: 'Putih', size: 'M', sku: 'BRG-FSH-003-WHT-M', price: 139000, stock: 15 },
      { id: 'v3-2', name: 'Putih Bersih - L', color: 'Putih', size: 'L', sku: 'BRG-FSH-003-WHT-L', price: 139000, stock: 20 },
      { id: 'v3-3', name: 'Sage Green - L', color: 'Hijau Sage', size: 'L', sku: 'BRG-FSH-003-SAG-L', price: 139000, stock: 12 },
      { id: 'v3-4', name: 'Navy Blue - XL', color: 'Navy', size: 'XL', sku: 'BRG-FSH-003-NVY-XL', price: 145000, stock: 11 }
    ],
    reviews: [
      {
        id: 'r-4',
        userName: 'Bambang Sudibyo',
        rating: 5,
        comment: 'Jahitannya rapi banget, bahannya jatuh dan adem gak gampang kusut parah. Bakal borong warna lain!',
        date: '2026-09-18',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-08-20'
  },
  {
    id: 'p-4',
    title: 'Air Fryer Digital 4.5L Low Watt 650W Touchscreen Hemat Listrik',
    slug: 'air-fryer-digital-4-5l-low-watt',
    sku: 'BRG-RMH-004',
    price: 489000,
    originalPrice: 850000,
    discountPercent: 42,
    rating: 4.9,
    reviewCount: 680,
    soldCount: 4200,
    stock: 18,
    minStockAlert: 5,
    category: 'rumah-tangga',
    brand: 'MasterCook',
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    isFreeShipping: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Goreng renyah tanpa minyak berlebih dengan Air Fryer Digital 4.5L. Dilengkapi teknologi sirkulasi udara 360 derajat cepat dan 8 preset pintar untuk ayam, kentang, kue, dan ikan. Daya hemat cuma 650W aman untuk listrik 900VA.',
    specifications: {
      'Kapasitas': '4.5 Liter (Muat 1 ekor ayam utuh)',
      'Daya Listrik': '650 Watt Low Wattage',
      'Rentang Suhu': '80°C - 200°C',
      'Timer': 'Hingga 60 Menit dengan Auto-Off',
      'Lapisan Keranjang': 'Non-stick Food Grade Teflon Bebas PFOA'
    },
    weightGrams: 3800,
    variations: [
      { id: 'v4-1', name: 'Matte Forest Green', color: 'Hijau Emerald', sku: 'BRG-RMH-004-GRN', price: 489000, stock: 10 },
      { id: 'v4-2', name: 'Ceramic Pearl White', color: 'Putih Mutiara', sku: 'BRG-RMH-004-WHT', price: 489000, stock: 8 }
    ],
    reviews: [
      {
        id: 'r-5',
        userName: 'Siti Rahmawati',
        rating: 5,
        comment: 'Sangat praktis buat bikin sarapan anak! Ayam goreng tetap kriuk juicy tanpa minyak. Listrik rumah 900W aman gak jeglek.',
        date: '2026-09-25',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-07-10'
  },
  {
    id: 'p-5',
    title: 'Wireless Earbuds TWS ANC Active Noise Cancelling Bass Boost',
    slug: 'wireless-earbuds-tws-anc-bass-boost',
    sku: 'BRG-KOM-005',
    price: 219000,
    originalPrice: 399000,
    discountPercent: 45,
    rating: 4.7,
    reviewCount: 290,
    soldCount: 1540,
    stock: 32,
    minStockAlert: 8,
    category: 'komputer-gadget',
    brand: 'SonicWave',
    isFeatured: true,
    isBestSeller: false,
    isFlashSale: true,
    isFreeShipping: true,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'TWS dengan teknologi Active Noise Cancellation (ANC) hingga 32dB yang mampu meredam suara bising lingkungan. Dilengkapi driver komposit 12mm untuk bass mendalam serta baterai 35 jam pemutaran total.',
    specifications: {
      'Bluetooth': 'V5.4 Low Latency 40ms Gaming Mode',
      'Baterai': '6 Jam Earbuds + 29 Jam Charging Case',
      'Fitur': 'ANC Hybrid, Dual Mic ENC Call Noise Reduction',
      'Port Pengisian': 'USB Type-C Fast Charging'
    },
    weightGrams: 160,
    variations: [
      { id: 'v5-1', name: 'Midnight Black', color: 'Hitam', sku: 'BRG-KOM-005-BLK', price: 219000, stock: 20 },
      { id: 'v5-2', name: 'Glacier White', color: 'Putih', sku: 'BRG-KOM-005-WHT', price: 219000, stock: 12 }
    ],
    reviews: [
      {
        id: 'r-6',
        userName: 'Kevin Anggara',
        rating: 5,
        comment: 'Bass mantap, microphone jernih pas buat meeting zoom atau nelpon di motor. Rekomen banget harga segini dapat ANC.',
        date: '2026-09-23',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-09-12'
  },
  {
    id: 'p-6',
    title: 'Madu Hutan Sumbawa Murni 100% Organik Nektar Alami 500gr',
    slug: 'madu-hutan-sumbawa-murni-500gr',
    sku: 'BRG-UMK-006',
    price: 95000,
    originalPrice: 135000,
    discountPercent: 30,
    rating: 4.9,
    reviewCount: 410,
    soldCount: 2980,
    stock: 40,
    minStockAlert: 10,
    category: 'produk-umkm',
    brand: 'Borongin UMKM Juara',
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: false,
    isFreeShipping: false,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Dipanen langsung oleh kelompok tani hutan binaan UMKM di pedalaman Sumbawa dari sarang lebah liar Apis Dorsata. Tanpa proses pemanasan atau campuran gula sintetis (Raw Honey) kaya akan enzim aktif dan antioksidan.',
    specifications: {
      'Sertifikasi': 'P-IRT & Halal MUI',
      'Kemasan': 'Botol Kaca Hexagonal Food Grade Seal 500g',
      'Jenis Lebah': 'Apis Dorsata Liar',
      'Khasiat': 'Meningkatkan imunitas, memulihkan stamina, meredakan batuk'
    },
    weightGrams: 750,
    reviews: [
      {
        id: 'r-7',
        userName: 'Dr. Hendra W.',
        rating: 5,
        comment: 'Kualitas raw honey asli terasa kentalnya dan ada sedikit gas alami khas madu segar. Kemasan pengiriman sangat tebal dan aman bublewrapnya.',
        date: '2026-09-19',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-08-01'
  },
  {
    id: 'p-7',
    title: 'Serum Brightening Niacinamide 10% + Zinc Glowing Flawless 30ml',
    slug: 'serum-brightening-niacinamide-10-zinc-30ml',
    sku: 'BRG-KCK-007',
    price: 89000,
    originalPrice: 149000,
    discountPercent: 40,
    rating: 4.8,
    reviewCount: 650,
    soldCount: 5120,
    stock: 65,
    minStockAlert: 12,
    category: 'kecantikan',
    brand: 'GlowAura Skin',
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    isFreeShipping: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-543b5930b206?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Formula pencerah kulit intensif dengan konsentrasi tinggi Niacinamide murni 10% dan Zinc PCA 1%. Menyamarkan noda hitam bekas jerawat, mengontrol sebum berlebih, dan meratakan warna kulit wajah dalam 14 hari pemakaian rutin.',
    specifications: {
      'No. BPOM': 'NA18231900124',
      'Tekstur': 'Cair ringan, cepat meresap bebas lengket',
      'Kesesuaian Kulit': 'Semua jenis kulit, termasuk kulit sensitif berjerawat',
      'Volume': '30 ml pipet kaca'
    },
    weightGrams: 110,
    reviews: [
      {
        id: 'r-8',
        userName: 'Fitri Handayani',
        rating: 5,
        comment: 'Bekas jerawat pudar dalam 2 minggu. Gak bikin perih dan jerawat baru gak muncul lagi.',
        date: '2026-09-26',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-08-25'
  },
  {
    id: 'p-8',
    title: 'Blender Portable Mini Juicer USB Rechargeable 6 Pisau Baja',
    slug: 'blender-portable-mini-juicer-usb-6-pisau',
    sku: 'BRG-RMH-008',
    price: 79000,
    originalPrice: 129000,
    discountPercent: 39,
    rating: 4.6,
    reviewCount: 220,
    soldCount: 1650,
    stock: 25,
    minStockAlert: 5,
    category: 'rumah-tangga',
    brand: 'MasterCook',
    isFeatured: false,
    isBestSeller: false,
    isFlashSale: true,
    isFreeShipping: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Blender portable ringkas berdaya putar kuat dengan 6 mata pisau baja tahan karat 304. Praktis untuk membuat jus buah segar, smoothie, dan MPASI bayi di mana saja dengan baterai rechargeable Type-C.',
    specifications: {
      'Kapasitas Wadah': '420 ml Tritan BPA-Free',
      'Kapasitas Baterai': '2.000 mAh (15-20 kali blend)',
      'Kecepatan Putaran': '22.000 RPM',
      'Keamanan': 'Magnetic Induction Safety Sensor'
    },
    weightGrams: 420,
    variations: [
      { id: 'v8-1', name: 'Pastel Mint Green', color: 'Hijau Mint', sku: 'BRG-RMH-008-MNT', price: 79000, stock: 15 },
      { id: 'v8-2', name: 'Sakura Pink', color: 'Pink', sku: 'BRG-RMH-008-PNK', price: 79000, stock: 10 }
    ],
    reviews: [
      {
        id: 'r-9',
        userName: 'Nadia Safitri',
        rating: 4,
        comment: 'Cukup kuat buat hancurin es batu kecil dan buah naga. Praktis dibawa ke kantor buat bikin sarapan jus.',
        date: '2026-09-15',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-09-05'
  },
  {
    id: 'p-9',
    title: 'Tas Ransel Laptop Anti Maling Waterproof USB Charging Port 15.6"',
    slug: 'tas-ransel-laptop-anti-maling-waterproof',
    sku: 'BRG-FSH-009',
    price: 185000,
    originalPrice: 320000,
    discountPercent: 42,
    rating: 4.9,
    reviewCount: 540,
    soldCount: 3890,
    stock: 22,
    minStockAlert: 5,
    category: 'fashion-pria',
    brand: 'UrbanShield',
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: false,
    isFreeShipping: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tas ransel kerja dan kuliah berdesain kokoh ergonomis dengan ritsleting tersembunyi anti-pencopet, slot laptop tebal busa peredam benturan hingga 15.6 inci, dan kain oxford tahan percikan hujan lebat.',
    specifications: {
      'Bahan': 'High Density Oxford Fabric Waterproof',
      'Kapasitas': '25 Liter dengan 12 Kompartemen',
      'Fitur Tambahan': 'External USB Port, Luggage Strap, Card Pocket',
      'Dimensi': '44 x 31 x 15 cm'
    },
    weightGrams: 850,
    variations: [
      { id: 'v9-1', name: 'Stealth Black', color: 'Hitam', sku: 'BRG-FSH-009-BLK', price: 185000, stock: 14 },
      { id: 'v9-2', name: 'Charcoal Grey', color: 'Abu-abu', sku: 'BRG-FSH-009-GRY', price: 185000, stock: 8 }
    ],
    reviews: [
      {
        id: 'r-10',
        userName: 'Gerry Wicaksono',
        rating: 5,
        comment: 'Bagus banget ranselnya! Busa punggungnya empuk banget jadi gak pegel pas bawa laptop gaming berat.',
        date: '2026-09-24',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-08-10'
  },
  {
    id: 'p-10',
    title: 'Paket Sambal Bawang & Cumi Asin Khas Nusantara 3 Varian Gurih',
    slug: 'paket-sambal-bawang-cumi-asin-3-varian',
    sku: 'BRG-MKN-010',
    price: 59000,
    originalPrice: 85000,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 390,
    soldCount: 3400,
    stock: 50,
    minStockAlert: 10,
    category: 'makanan',
    brand: 'Dapur Borongin Nusantara',
    isFeatured: false,
    isBestSeller: true,
    isFlashSale: false,
    isFreeShipping: false,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Paket hemat 3 botol sambal nusantara legendaris: Sambal Bawang Spesial, Sambal Cumi Asin Cabe Ijo, dan Sambal Tongkol Suwir Pedas. Dimasak higienis dengan minyak kelapa murni, cabai rawit segar tanpa pengawet kimiawi.',
    specifications: {
      'Isi Paket': '3 Botol x 150 gram',
      'Daya Simpan': '2 Bulan di suhu ruang (segel), 6 Bulan di chiller',
      'Sertifikasi': 'P-IRT Terdaftar & Halal 100%'
    },
    weightGrams: 550,
    reviews: [
      {
        id: 'r-11',
        userName: 'Melati Kusuma',
        rating: 5,
        comment: 'Cuminya banyak gak pelit! Dimakan sama nasi panas dan telur ceplok udah nikmat banget.',
        date: '2026-09-25',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-09-02'
  },
  {
    id: 'p-11',
    title: 'Mechanical Keyboard 75% Wireless Tri-Mode RGB Hotswappable',
    slug: 'mechanical-keyboard-75-wireless-rgb',
    sku: 'BRG-KOM-011',
    price: 499000,
    originalPrice: 799000,
    discountPercent: 38,
    rating: 4.9,
    reviewCount: 340,
    soldCount: 1450,
    stock: 15,
    minStockAlert: 5,
    category: 'komputer-gadget',
    brand: 'MechVibe',
    isFeatured: true,
    isBestSeller: false,
    isFlashSale: false,
    isFreeShipping: true,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Keyboard mekanik layout 75% compact dengan tombol panah dan function keys dedicated. Dilengkapi knob multimedia dari aluminium anodized, gasket mount empuk, dan konektivitas 3 mode (Bluetooth 5.0, 2.4G Dongle, Type-C).',
    specifications: {
      'Layout': '75% Compact (82 Keys + Multi Rotary Knob)',
      'Switch': 'Pre-lubed Factory Yellow Linear Switch',
      'Fitur': 'Universal 5-Pin Hot-swap, EVA Dampener Foam, RGB South-Facing',
      'Baterai': '4.000 mAh Li-ion Rechargeable'
    },
    weightGrams: 980,
    variations: [
      { id: 'v11-1', name: 'Linear Yellow (Halus & Sunyi)', sku: 'BRG-KOM-011-YEL', price: 499000, stock: 9 },
      { id: 'v11-2', name: 'Tactile Brown (Empuk & Bertekstur)', sku: 'BRG-KOM-011-BRN', price: 499000, stock: 6 }
    ],
    reviews: [
      {
        id: 'r-12',
        userName: 'Bayu Prasetyo',
        rating: 5,
        comment: 'Suaranya thock banget! Gasket mount-nya beneran empuk pas ngetik kodingan seharian.',
        date: '2026-09-20',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-09-18'
  },
  {
    id: 'p-12',
    title: 'Kain Tenun Ikat Tradisional Motif Sumba Handmade Asli',
    slug: 'kain-tenun-ikat-tradisional-sumba',
    sku: 'BRG-UMK-012',
    price: 325000,
    originalPrice: 450000,
    discountPercent: 28,
    rating: 5.0,
    reviewCount: 95,
    soldCount: 420,
    stock: 12,
    minStockAlert: 3,
    category: 'produk-umkm',
    brand: 'Borongin UMKM Juara',
    isFeatured: true,
    isBestSeller: false,
    isFlashSale: false,
    isFreeShipping: true,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Kain tenun ikat otentik buah karya pengrajin perempuan nusantara di Nusa Tenggara Timur. Ditenun secara manual menggunakan alat tenun bukan mesin (ATBM) dengan pewarna alami dari akar mengkudu dan daun nila.',
    specifications: {
      'Teknik Pembuatan': 'Tenun Gedogan Tradisional NTT',
      'Pewarnaan': '100% Pewarna Alami Nabati',
      'Ukuran': '200 x 100 cm',
      'Penggunaan': 'Pakaian adat, dress etnik, hiasan dinding, atau selendang'
    },
    weightGrams: 500,
    reviews: [
      {
        id: 'r-13',
        userName: 'Citra Dewi',
        rating: 5,
        comment: 'Kainnya sangat berbobot dan wangi bahan alaminya harum. Bangga sekali bisa koleksi karya UMKM lokal seindah ini.',
        date: '2026-09-17',
        verifiedPurchase: true
      }
    ],
    createdAt: '2026-09-10'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'BORONG10',
    discountType: 'percentage',
    value: 10,
    minSpend: 50000,
    maxDiscount: 35000,
    description: 'Diskon 10% spesial belanja di Borongin.com minimal belanja Rp50.000'
  },
  {
    code: 'GRATISONGKIR',
    discountType: 'free_shipping',
    value: 20000,
    minSpend: 100000,
    maxDiscount: 20000,
    description: 'Gratis ongkos kirim s.d Rp20.000 dengan minimal belanja Rp100.000'
  },
  {
    code: 'NEWUSER50',
    discountType: 'fixed',
    value: 50000,
    minSpend: 150000,
    description: 'Potongan langsung Rp50.000 untuk pengguna baru minimal belanja Rp150.000'
  },
  {
    code: 'DISKONHEMAT',
    discountType: 'percentage',
    value: 15,
    minSpend: 200000,
    maxDiscount: 50000,
    description: 'Diskon ekstra 15% maksimal Rp50.000 untuk transaksi borongan'
  }
];

export const INITIAL_SHIPPING_RATES: ShippingRate[] = [
  { courier: 'J&T Express', service: 'REG (Reguler)', cost: 14000, estimatedDays: '1-3 Hari', logo: 'jnt' },
  { courier: 'SiCepat', service: 'BEST (Next Day)', cost: 22000, estimatedDays: '1 Hari', logo: 'sicepat' },
  { courier: 'SiCepat', service: 'REG (Reguler)', cost: 13000, estimatedDays: '2-3 Hari', logo: 'sicepat' },
  { courier: 'JNE', service: 'REG (Reguler)', cost: 15000, estimatedDays: '2-4 Hari', logo: 'jne' },
  { courier: 'JNE', service: 'YES (Yakin Esok Sampai)', cost: 28000, estimatedDays: '1 Hari', logo: 'jne' },
  { courier: 'AnterAja', service: 'Standard', cost: 12500, estimatedDays: '2-3 Hari', logo: 'anteraja' },
  { courier: 'Ninja Xpress', service: 'Standard', cost: 13500, estimatedDays: '2-4 Hari', logo: 'ninja' },
  { courier: 'POS Indonesia', service: 'Pos Kilat Khusus', cost: 16000, estimatedDays: '3-5 Hari', logo: 'pos' }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b-1',
    title: '7 Tips Cerdas Belanja Online Hemat & Terhindar dari Penipuan',
    slug: 'tips-cerdas-belanja-online-hemat',
    excerpt: 'Simak cara memilih toko tepercaya, memanfaatkan voucher promo bertumpuk, dan menjaga keamanan transaksi online Anda.',
    content: `Belanja online kini sudah menjadi bagian dari gaya hidup modern masyarakat Indonesia. Mulai dari kebutuhan pokok, elektronik, fashion hingga perlengkapan rumah tangga dapat dipesan hanya dengan sentuhan jari di BORONGIN.COM.

Namun, agar pengalaman belanja Anda senantiasa memuaskan dan hemat, ikuti 7 panduan utama berikut:
1. Perhatikan Ulasan Pembeli & Label Verified Purchase: Pastikan membaca ulasan dari pembeli nyata yang telah menerima barang.
2. Manfaatkan Program Gratis Ongkir: Kumpulkan produk dalam satu keranjang hingga mencapai batas minimal gratis ongkir (misalnya Rp100.000).
3. Cek Spesifikasi dan Detail Garansi: Terutama untuk produk elektronik atau gadget, pastikan garansi resmi tertera jelas.
4. Gunakan Metode Pembayaran Resmi: Jangan pernah mentransfer uang ke rekening pribadi yang tidak terdaftar di sistem checkout resmi.
5. Manfaatkan Poin & Program Member: Tingkatkan tier member Anda dari Bronze ke Silver dan Gold untuk mendapatkan cashback poin setiap belanja.
6. Simpan Bukti Nomor Pesanan (Order ID): Nomor seperti BRG-20260928-00001 memudahkan pelacakan resi pengiriman secara real-time.
7. Hubungi Layanan Pelanggan Resmi via WhatsApp: Jika ada pertanyaan seputar produk atau pengiriman, gunakan jalur resmi official BORONGIN.COM.`,
    category: 'Tips Belanja',
    author: 'Tim Editorial Borongin',
    date: '2026-09-25',
    readTime: '4 Menit Baca',
    image: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=800&q=80',
    tags: ['E-Commerce', 'Tips Belanja', 'Hemat', 'Keamanan']
  },
  {
    id: 'b-2',
    title: 'Mendukung UMKM Lokal Go Digital Bersama Borongin.com',
    slug: 'mendukung-umkm-lokal-go-digital',
    excerpt: 'Bagaimana etalase digital Borongin membantu ribuan pengrajin dan produsen makanan lokal menjangkau pasar nasional.',
    content: `Usaha Mikro, Kecil, dan Menengah (UMKM) merupakan tulang punggung perekonomian nasional Indonesia. BORONGIN.COM berkomitmen menyediakan panggung terdepan bagi produk-produk lokal berkualitas tinggi.

Dari kerajinan tenun ikat Sumba, madu murni hutan Sumbawa, hingga olahan sambal dan kopi nusantara, kini produk lokal dapat dinikmati masyarakat di seluruh pelosok nusantara dengan pengiriman kurir terintegrasi dan sistem pembayaran yang aman.

Dukungan Anda dalam membeli produk berlabel "Produk UMKM" turut menggerakkan roda ekonomi ratusan keluarga pengrajin dan petani binaan.`,
    category: 'UMKM',
    author: 'Siti Rahayu',
    date: '2026-09-22',
    readTime: '3 Menit Baca',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
    tags: ['UMKM', 'Produk Lokal', 'Ekonomi Kreatif', 'BanggabuatanIndonesia']
  },
  {
    id: 'b-3',
    title: 'Review Lengkap Air Fryer Rendah Daya: Solusi Masak Sehat & Hemat Listrik',
    slug: 'review-lengkap-air-fryer-rendah-daya',
    excerpt: 'Ulasan mendalam memasak ayam crispy, kentang goreng gurih tanpa minyak dengan konsumsi listrik hanya 650 Watt.',
    content: `Bagi keluarga muda dan penghuni rumah dengan daya listrik 900VA atau 1300VA, air fryer digital low watt merupakan salah satu perabot dapur paling diminati saat ini.

Keunggulan memasak dengan Air Fryer Digital 4.5L:
- Mengurangi penggunaan minyak goreng hingga 85%, menjaga kolesterol tetap seimbang.
- Sirkulasi udara panas 360 derajat menghasilkan tekstur renyah di luar dan juicy di dalam.
- Keranjang anti-lengket yang mudah dibersihkan dan aman dicuci.
- Fitur auto shut-off menjaga makanan tidak gosong saat Anda mengerjakan aktivitas lain.`,
    category: 'Review Produk',
    author: 'Chef Dimas',
    date: '2026-09-18',
    readTime: '5 Menit Baca',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    tags: ['Review', 'Dapur', 'Rumah Tangga', 'Kesehatan']
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-001',
  name: 'Budi Santoso',
  email: 'budi.santoso@example.com',
  phone: '081298765432',
  memberTier: 'Silver',
  points: 1250,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  joinedDate: 'Januari 2026'
};
