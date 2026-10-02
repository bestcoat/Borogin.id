import { Order } from '../types';

export const OFFICIAL_WA_NUMBER_DISPLAY = '087722631751';
export const OFFICIAL_WA_NUMBER_INTL = '6287722631751';

/**
 * Format status pesanan untuk pesan WhatsApp
 */
function getReadableStatus(status: Order['status']): string {
  switch (status) {
    case 'pending_payment':
      return 'Menunggu Pembayaran';
    case 'payment_verification':
      return 'Menunggu Verifikasi Pembayaran';
    case 'paid':
      return 'Sudah Dibayar (Lunas)';
    case 'processing':
      return 'Sedang Diproses Gudang';
    case 'packed':
      return 'Sedang Dikemas';
    case 'shipped':
      return 'Dalam Pengiriman Kurir';
    case 'completed':
      return 'Pesanan Selesai';
    case 'cancelled':
      return 'Dibatalkan';
    case 'refunded':
      return 'Dana Dikembalikan';
    case 'payment_rejected':
      return 'Bukti Pembayaran Perlu Diperiksa';
    default:
      return 'Menunggu Pembayaran';
  }
}

/**
 * Generate formatted WhatsApp Purchase Order (Faktur / Ringkasan Pesanan)
 * Sesuai format Bagian 12 permintaan user
 */
export function generateWhatsAppCustomerOrderUrl(order: Order, formatRupiah: (n: number) => string): string {
  const itemsText = order.items.map((item, index) => {
    const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.product.price;
    const itemSubtotal = itemPrice * item.quantity;
    const variationNote = item.selectedVariation ? ` (${item.selectedVariation.name})` : '';
    return `${index + 1}. ${item.product.title}${variationNote}\n   Jumlah: ${item.quantity}\n   Harga: ${formatRupiah(itemPrice)}\n   Subtotal: ${formatRupiah(itemSubtotal)}`;
  }).join('\n\n');

  const fullAddress = `${order.customer.address}, ${order.customer.district || ''}, ${order.customer.city}, ${order.customer.province} ${order.customer.postalCode}`;

  const message = `BORONGIN.COM
ORDER PEMBELIAN
---------------

Nomor Order:
${order.orderNumber}

Tanggal:
${order.createdAt}

Nama Pembeli:
${order.customer.fullName}

No. HP:
${order.customer.phone}

Alamat:
${fullAddress}

---

DETAIL PRODUK
${itemsText}

---

Subtotal:
${formatRupiah(order.subtotal)}

Ongkos Kirim:
${formatRupiah(order.shippingCost)} (${order.shippingCourier.courier} ${order.shippingCourier.service})

Total:
${formatRupiah(order.total)}

Metode Pembayaran:
${order.paymentMethodName}

---

Status:
${getReadableStatus(order.status)}

---

Pesan:
Terima kasih telah berbelanja di Borongin.com.`;

  return `https://wa.me/${OFFICIAL_WA_NUMBER_INTL}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate formatted WhatsApp Admin Notification Report
 * Sesuai format Bagian 13 permintaan user
 */
export function generateWhatsAppAdminReportUrl(order: Order, formatRupiah: (n: number) => string): string {
  const itemsList = order.items.map((item, idx) => {
    const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.product.price;
    return `   ${idx + 1}. ${item.product.title} (Jumlah: ${item.quantity}, Harga: ${formatRupiah(itemPrice)})`;
  }).join('\n');

  const fullAddress = `${order.customer.address}, ${order.customer.district || ''}, ${order.customer.city}, ${order.customer.province} ${order.customer.postalCode}`;

  const message = `NOTIFIKASI ORDER BARU
BORONGIN.COM

Nomor Order:
${order.orderNumber}

Customer:
${order.customer.fullName}

No. HP:
${order.customer.phone}

Produk:
${itemsList}

Subtotal:
${formatRupiah(order.subtotal)}

Ongkir:
${formatRupiah(order.shippingCost)} (${order.shippingCourier.courier})

TOTAL:
${formatRupiah(order.total)}

Metode Pembayaran:
${order.paymentMethodName}

Status:
${getReadableStatus(order.status)}

Alamat Pengiriman:
${fullAddress}

Tanggal:
${order.createdAt}

---

Tujuan:
Admin Borongin`;

  return `https://wa.me/${OFFICIAL_WA_NUMBER_INTL}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate quick inquiry link for product detail
 */
export function generateProductInquiryUrl(productTitle: string, currentPriceStr: string): string {
  const message = `Halo Admin BORONGIN.COM! Saya ingin menanyakan ketersediaan produk berikut:\n\nProduk: *${productTitle}*\nHarga: *${currentPriceStr}*\n\nApakah stok unit ini siap dikirim hari ini? Terima kasih!`;
  return `https://wa.me/${OFFICIAL_WA_NUMBER_INTL}?text=${encodeURIComponent(message)}`;
}
