import { Order, OrderStatus } from '../types';

export interface TrackingCheckpoint {
  timestamp: string;
  status: string;
  location: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface TrackingApiResponse {
  success: boolean;
  orderNumber: string;
  awbNumber: string;
  courier: {
    name: string;
    service: string;
    driverName?: string;
    driverPhone?: string;
    vehicleType?: string;
  };
  currentStatus: OrderStatus | 'out_for_delivery' | 'delivered';
  currentStatusLabel: string;
  origin: string;
  destination: string;
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  estimatedDeliveryDate: string;
  estimatedDeliveryTimeRange: string;
  daysRemainingText: string;
  progressPercent: number;
  currentCheckpointTitle: string;
  currentCheckpointLocation: string;
  lastUpdated: string;
  checkpoints: TrackingCheckpoint[];
  itemsSummary: {
    title: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  totalAmount: number;
  paymentMethod: string;
}

/**
 * Mock API that simulates real-time shipping tracking call with latency.
 */
export async function fetchOrderTracking(
  orderId: string,
  existingOrders: Order[] = []
): Promise<TrackingApiResponse> {
  const cleanId = orderId.trim();

  // Simulate network latency (400-750ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!cleanId) {
    throw new Error('Silakan masukkan nomor pesanan yang valid.');
  }

  // Check if order exists in current store orders
  const matchedOrder = existingOrders.find(
    (o) =>
      o.orderNumber.toLowerCase() === cleanId.toLowerCase() ||
      o.id.toLowerCase() === cleanId.toLowerCase() ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === cleanId.toLowerCase())
  );

  const now = new Date();
  const formatTime = (d: Date) =>
    d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  const formatDate = (d: Date) =>
    d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  // If found in local store state, craft live real-time response based on that order
  if (matchedOrder) {
    const courierName = matchedOrder.shippingCourier.courier || 'J&T Express';
    const awb = matchedOrder.trackingNumber || `JT${Math.floor(1000000000 + Math.random() * 9000000000)}ID`;
    const destination = `${matchedOrder.customer.district}, ${matchedOrder.customer.city}`;
    
    // Map order status to shipping progress & estimated delivery
    let progress = 25;
    let statusLabel = 'Menunggu Pembayaran';
    let currentStatus: any = matchedOrder.status;
    let daysRemainingText = '2 - 3 Hari Kerja';
    let estDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    if (matchedOrder.status === 'processing') {
      progress = 40;
      statusLabel = 'Pembayaran Terkonfirmasi - Gudang Menyiapkan Paket';
      daysRemainingText = '1 - 2 Hari Kerja';
      estDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    } else if (matchedOrder.status === 'packed') {
      progress = 55;
      statusLabel = 'Paket Selesai Dikemas - Menunggu Pickup Kurir';
      daysRemainingText = '1 - 2 Hari Kerja';
      estDate = new Date(now.getTime() + 1.5 * 24 * 60 * 60 * 1000);
    } else if (matchedOrder.status === 'shipped') {
      progress = 80;
      currentStatus = 'out_for_delivery';
      statusLabel = 'Sedang Dalam Pengantaran Kurir Menuju Alamat';
      daysRemainingText = 'Estimasi Tiba Hari Ini';
      estDate = new Date(now.getTime() + 4 * 60 * 60 * 1000); // Today in 4 hours
    } else if (matchedOrder.status === 'completed') {
      progress = 100;
      currentStatus = 'delivered';
      statusLabel = 'Paket Telah Diterima oleh Pelanggan';
      daysRemainingText = 'Selesai';
      estDate = now;
    }

    const checkpoints: TrackingCheckpoint[] = [
      {
        timestamp: `${formatDate(new Date(now.getTime() - 24 * 3600000))}, 10:15 WIB`,
        status: 'Order Dibuat',
        location: 'BORONGIN.COM System',
        description: 'Pesanan berhasil dibuat di sistem e-commerce.',
        isCompleted: true,
        isCurrent: matchedOrder.status === 'pending_payment'
      },
      {
        timestamp: `${formatDate(new Date(now.getTime() - 22 * 3600000))}, 10:20 WIB`,
        status: 'Pembayaran Terverifikasi',
        location: 'Payment Gateway Midtrans',
        description: 'Pembayaran telah sukses diverifikasi otomatis via Virtual Account / E-Wallet.',
        isCompleted: matchedOrder.status !== 'pending_payment',
        isCurrent: matchedOrder.status === 'processing'
      },
      {
        timestamp: `${formatDate(new Date(now.getTime() - 16 * 3600000))}, 14:40 WIB`,
        status: 'Packing & Quality Check',
        location: 'Warehouse Fulfillment Jakarta Barat',
        description: 'Barang telah dicek dan dikemas aman dengan bubble wrap ekstra.',
        isCompleted: matchedOrder.status === 'packed' || matchedOrder.status === 'shipped' || matchedOrder.status === 'completed',
        isCurrent: matchedOrder.status === 'packed'
      },
      {
        timestamp: `${formatDate(new Date(now.getTime() - 8 * 3600000))}, 21:00 WIB`,
        status: 'Diserahkan ke Kurir',
        location: `Drop Point ${courierName} Jakarta`,
        description: `Paket diterima oleh ${courierName} dengan No. Resi ${awb}.`,
        isCompleted: matchedOrder.status === 'shipped' || matchedOrder.status === 'completed',
        isCurrent: matchedOrder.status === 'shipped' && progress < 80
      },
      {
        timestamp: `${formatDate(now)}, 08:30 WIB`,
        status: 'Sedang Diantar Kurir (Out for Delivery)',
        location: `DC ${matchedOrder.customer.city}`,
        description: `Paket sedang dibawa oleh kurir pengantar (Sprinter) menuju alamat penerima.`,
        isCompleted: matchedOrder.status === 'completed',
        isCurrent: matchedOrder.status === 'shipped'
      },
      {
        timestamp: `${formatDate(estDate)}, ${formatTime(estDate)}`,
        status: 'Tiba di Tujuan',
        location: matchedOrder.customer.address,
        description: matchedOrder.status === 'completed'
          ? `Paket diterima langsung oleh ${matchedOrder.customer.fullName}.`
          : 'Estimasi paket diserah-terimakan ke penerima.',
        isCompleted: matchedOrder.status === 'completed',
        isCurrent: matchedOrder.status === 'completed'
      }
    ];

    return {
      success: true,
      orderNumber: matchedOrder.orderNumber,
      awbNumber: awb,
      courier: {
        name: courierName,
        service: matchedOrder.shippingCourier.service || 'Reguler',
        driverName: 'Surya Pratama (Kurir Resmi)',
        driverPhone: '081288992211',
        vehicleType: 'Sepeda Motor (Delivery Sprinter)'
      },
      currentStatus,
      currentStatusLabel: statusLabel,
      origin: 'Warehouse BORONGIN.COM, Jakarta Barat',
      destination,
      recipient: {
        name: matchedOrder.customer.fullName,
        phone: matchedOrder.customer.phone,
        address: `${matchedOrder.customer.address}, ${matchedOrder.customer.district}, ${matchedOrder.customer.city} ${matchedOrder.customer.postalCode}`
      },
      estimatedDeliveryDate: formatDate(estDate),
      estimatedDeliveryTimeRange: '13:00 - 17:00 WIB',
      daysRemainingText,
      progressPercent: progress,
      currentCheckpointTitle: statusLabel,
      currentCheckpointLocation: `Hub Ekspedisi ${matchedOrder.customer.city}`,
      lastUpdated: `${formatDate(now)} pukul ${formatTime(now)}`,
      checkpoints,
      itemsSummary: matchedOrder.items.map((it) => ({
        title: it.product.title,
        quantity: it.quantity,
        price: it.selectedVariation ? it.selectedVariation.price : it.product.price,
        image: it.product.images[0]
      })),
      totalAmount: matchedOrder.total,
      paymentMethod: matchedOrder.paymentMethodName
    };
  }

  // If order ID not in store, synthesize a realistic simulated response for any query (e.g. BRG-2026-X or test order)
  const isSimulatedValid = cleanId.length >= 4;
  if (!isSimulatedValid) {
    throw new Error('Nomor pesanan tidak ditemukan. Cek kembali format order ID (contoh: BRG-20260927-00108).');
  }

  const estArrival = new Date(now.getTime() + 24 * 3600000);
  const synthAwb = `JT${Math.abs(cleanId.split('').reduce((a, b) => a + b.charCodeAt(0), 100000000))}ID`;

  return {
    success: true,
    orderNumber: cleanId.toUpperCase(),
    awbNumber: synthAwb,
    courier: {
      name: 'J&T Express',
      service: 'EZ Reguler (Next Day Guaranteed)',
      driverName: 'Rendi Wijaya',
      driverPhone: '081399887766',
      vehicleType: 'Van Logistik'
    },
    currentStatus: 'out_for_delivery',
    currentStatusLabel: 'Paket Sedang Diantar ke Alamat Tujuan',
    origin: 'Pusat Distribusi BORONGIN.COM, Tangerang',
    destination: 'Jakarta Selatan, DKI Jakarta',
    recipient: {
      name: 'Pelanggan Terdaftar',
      phone: '0812****5432',
      address: 'Jl. Merdeka No. 45, Kebayoran Baru, Jakarta Selatan 12190'
    },
    estimatedDeliveryDate: formatDate(estArrival),
    estimatedDeliveryTimeRange: '14:00 - 18:00 WIB',
    daysRemainingText: 'Estimasi Tiba Besok Sore',
    progressPercent: 75,
    currentCheckpointTitle: 'Paket Sedang Dibawa Sprinter Menuju Lokasi',
    currentCheckpointLocation: 'Drop Point Kebayoran Baru',
    lastUpdated: `${formatDate(now)} pukul ${formatTime(now)}`,
    checkpoints: [
      {
        timestamp: `${formatDate(new Date(now.getTime() - 20 * 3600000))}, 11:30 WIB`,
        status: 'Pesanan Diproses',
        location: 'Fulfillment Center Borongin',
        description: 'Pesanan telah diverifikasi dan siap diserahkan ke kurir.',
        isCompleted: true,
        isCurrent: false
      },
      {
        timestamp: `${formatDate(new Date(now.getTime() - 14 * 3600000))}, 18:45 WIB`,
        status: 'Manifest Disortir',
        location: 'Jakarta Sorting Hub Gateway',
        description: 'Paket tiba di sorting hub regional dan telah lolos pemindaian resi barcode.',
        isCompleted: true,
        isCurrent: false
      },
      {
        timestamp: `${formatDate(now)}, 09:15 WIB`,
        status: 'Tiba di Drop Point Tujuan',
        location: 'Drop Point Jakarta Selatan',
        description: 'Paket telah tiba di kantor kurir terdekat dari lokasi penerima.',
        isCompleted: true,
        isCurrent: false
      },
      {
        timestamp: `${formatDate(now)}, 11:20 WIB`,
        status: 'Sedang Dalam Pengantaran (Out for Delivery)',
        location: 'Area Pengantaran Kebayoran Baru',
        description: 'Paket sedang dibawa oleh kurir Rendi Wijaya menuju alamat Anda.',
        isCompleted: false,
        isCurrent: true
      },
      {
        timestamp: `${formatDate(estArrival)}, 16:00 WIB`,
        status: 'Paket Tiba & Selesai',
        location: 'Alamat Penerima',
        description: 'Paket akan diserah-terimakan dengan bukti tanda tangan digital / foto.',
        isCompleted: false,
        isCurrent: false
      }
    ],
    itemsSummary: [
      {
        title: 'Smartwatch Ultra Pro Waterproof Heart-Rate Monitor',
        quantity: 1,
        price: 349000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'
      }
    ],
    totalAmount: 349000,
    paymentMethod: 'BCA Virtual Account (Lunas)'
  };
}
