import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '../auth';
import { Order, OrderStatus, PaymentProof } from '../../types';

const router = Router();

// Helper to generate unique order number BRG-YYYYMMDD-XXXXX
function generateOrderNumber(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;
  const randomSeq = String(Math.floor(10000 + Math.random() * 90000));
  return `BRG-${dateStr}-${randomSeq}`;
}

// 1. Create New Order (Requires Authenticated Customer)
router.post('/', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const {
      customer,
      items,
      subtotal,
      discount = 0,
      shippingCost = 0,
      shippingCourier,
      total,
      paymentMethod,
      paymentMethodName
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Keranjang belanja kosong.' });
      return;
    }

    if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.city) {
      res.status(400).json({ success: false, message: 'Harap lengkapi seluruh data alamat pengiriman customer.' });
      return;
    }

    // Server-Side Stock Verification & Atomic Decrement
    for (const item of items) {
      const prod = db.getProductById(item.productId);
      if (!prod) {
        res.status(400).json({ success: false, message: `Produk ID ${item.productId} tidak ditemukan.` });
        return;
      }

      const availableStock = item.selectedVariation ? item.selectedVariation.stock : prod.stock;
      if (availableStock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Stok produk "${prod.title}" tidak mencukupi (sisa ${availableStock} unit).`
        });
        return;
      }
    }

    // Decrement stock in database
    for (const item of items) {
      db.decrementStock(item.productId, item.quantity, item.selectedVariation?.id);
    }

    const orderNumber = generateOrderNumber();
    const nowStr = new Date().toLocaleString('id-ID');

    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      orderNumber,
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : user.email,
        address: customer.address.trim(),
        province: customer.province || 'DKI Jakarta',
        city: customer.city.trim(),
        district: customer.district || '',
        subDistrict: customer.subDistrict || '',
        postalCode: customer.postalCode || '12345',
        notes: customer.notes || ''
      },
      items,
      subtotal: Number(subtotal),
      discount: Number(discount),
      shippingCost: Number(shippingCost),
      shippingCourier: shippingCourier || {
        courier: 'J&T Express',
        service: 'EZ',
        cost: Number(shippingCost),
        estimatedDays: '1-2 Hari'
      },
      total: Number(total),
      paymentMethod,
      paymentMethodName: paymentMethodName || (paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank BCA'),
      paymentStatus: 'unpaid',
      status: 'pending_payment',
      createdAt: nowStr,
      timeline: [
        {
          status: 'pending_payment',
          title: 'Pesanan Dibuat',
          description: `Pesanan dibuat. Silakan transfer ${paymentMethodName || 'BCA / QRIS'}.`,
          timestamp: nowStr
        }
      ]
    };

    const saved = db.addOrder(newOrder);

    // Clear cart on server for this customer
    db.clearCart(user.id);

    // Award loyalty points to customer (1 point per Rp10.000)
    const pointsAwarded = Math.floor(newOrder.total / 10000);
    if (pointsAwarded > 0) {
      db.updateUser(user.id, { points: (user.points || 0) + pointsAwarded });
    }

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat!',
      order: saved
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal membuat pesanan di server.' });
  }
});

// 2. Customer: Get My Orders
router.get('/my', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const myOrders = db.getOrdersByCustomerEmail(user.email);
    res.json({ success: true, orders: myOrders });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat pesanan.' });
  }
});

// 3. Public Order Lookup / Tracking
router.get('/:orderNumber', (req: Request, res: Response): void => {
  try {
    const { orderNumber } = req.params;
    const order = db.getOrderByOrderNumber(orderNumber);
    if (!order) {
      res.status(404).json({ success: false, message: `Pesanan dengan nomor #${orderNumber} tidak ditemukan.` });
      return;
    }
    res.json({ success: true, order });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal mencari detail pesanan.' });
  }
});

// 4. Customer: Upload Payment Proof (Status becomes 'payment_verification' / MENUNGGU VERIFIKASI)
router.post('/:orderNumber/proof', (req: Request, res: Response): void => {
  try {
    const { orderNumber } = req.params;
    const { senderName, transferAmount, transferDate, proofImage } = req.body;

    const order = db.getOrderByOrderNumber(orderNumber);
    if (!order) {
      res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
      return;
    }

    if (!senderName || !transferAmount || !proofImage) {
      res.status(400).json({ success: false, message: 'Nama pengirim, jumlah transfer, dan foto bukti transfer wajib disertakan.' });
      return;
    }

    const nowStr = new Date().toLocaleString('id-ID');
    const proof: PaymentProof = {
      senderName: senderName.trim(),
      orderNumber: order.orderNumber,
      transferAmount: Number(transferAmount),
      transferDate: transferDate || new Date().toISOString().slice(0, 10),
      proofImage,
      uploadedAt: nowStr
    };

    const newTimeline = [
      ...order.timeline,
      {
        status: 'payment_verification' as OrderStatus,
        title: 'Bukti Pembayaran Diunggah',
        description: `Customer mengunggah bukti transfer a.n. ${proof.senderName} sejumlah Rp${proof.transferAmount.toLocaleString('id-ID')}. Menunggu verifikasi admin finance.`,
        timestamp: nowStr
      }
    ];

    const updated = db.updateOrder(order.id, {
      status: 'payment_verification',
      paymentProof: proof,
      timeline: newTimeline
    });

    res.json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah! Status pesanan kini: Menunggu Verifikasi Pembayaran.',
      order: updated
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal mengunggah bukti pembayaran.' });
  }
});

// ================= ADMIN ORDER ENDPOINTS (requireAdmin) =================

// 5. Admin: Get All Orders
router.get('/admin/all', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const allOrders = db.getOrders();
    res.json({ success: true, orders: allOrders });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar pesanan admin.' });
  }
});

// 6. Admin: Confirm Payment (Marks PAID, order moves to PROCESSING)
router.post('/admin/:id/confirm-payment', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const order = db.getOrderById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
      return;
    }

    const nowStr = new Date().toLocaleString('id-ID');
    const newTimeline = [
      ...order.timeline,
      {
        status: 'paid' as OrderStatus,
        title: 'Pembayaran Dikonfirmasi (PAID)',
        description: `Pembayaran ${order.paymentMethodName} Rp${order.total.toLocaleString('id-ID')} telah diverifikasi oleh admin finance.`,
        timestamp: nowStr
      },
      {
        status: 'processing' as OrderStatus,
        title: 'Pesanan Diproses Gudang',
        description: 'Pesanan disiapkan oleh tim logistik BORONGIN.',
        timestamp: nowStr
      }
    ];

    const updated = db.updateOrder(id, {
      status: 'processing',
      paymentStatus: 'paid',
      paidAt: nowStr,
      timeline: newTimeline
    });

    res.json({
      success: true,
      message: `Pembayaran pesanan #${order.orderNumber} berhasil dikonfirmasi (PAID)!`,
      order: updated
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal mengonfirmasi pembayaran.' });
  }
});

// 7. Admin: Reject Payment (Marks REJECTED with reason)
router.post('/admin/:id/reject-payment', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { reason = 'Bukti transfer tidak valid atau dana belum masuk rekening bank.' } = req.body;

    const order = db.getOrderById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
      return;
    }

    const nowStr = new Date().toLocaleString('id-ID');
    const newTimeline = [
      ...order.timeline,
      {
        status: 'payment_rejected' as OrderStatus,
        title: 'Pembayaran Ditolak',
        description: `Alasan penolakan: ${reason}`,
        timestamp: nowStr
      }
    ];

    const updated = db.updateOrder(id, {
      status: 'payment_rejected',
      paymentStatus: 'failed',
      paymentProof: order.paymentProof ? { ...order.paymentProof, rejectionReason: reason } : undefined,
      timeline: newTimeline
    });

    res.json({
      success: true,
      message: `Pembayaran pesanan #${order.orderNumber} ditolak. Customer diminta mengunggah ulang bukti transfer.`,
      order: updated
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal menolak pembayaran.' });
  }
});

// 8. Admin: Input Tracking / Resi and Mark Shipped
router.post('/admin/:id/shipping', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { courier, trackingNumber } = req.body;

    const order = db.getOrderById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
      return;
    }

    if (!trackingNumber || !trackingNumber.trim()) {
      res.status(400).json({ success: false, message: 'Nomor resi pengiriman wajib disertakan.' });
      return;
    }

    const nowStr = new Date().toLocaleString('id-ID');
    const courierName = courier || order.shippingCourier.courier;

    const newTimeline = [
      ...order.timeline,
      {
        status: 'shipped' as OrderStatus,
        title: `Pesanan Dikirim oleh ${courierName}`,
        description: `Paket telah diserahkan ke kurir dengan No. Resi: ${trackingNumber.trim()}.`,
        timestamp: nowStr
      }
    ];

    const updated = db.updateOrder(id, {
      status: 'shipped',
      trackingNumber: trackingNumber.trim(),
      shippedAt: nowStr,
      shippingCourier: {
        ...order.shippingCourier,
        courier: courierName
      },
      timeline: newTimeline
    });

    res.json({
      success: true,
      message: `Nomor resi ${trackingNumber} berhasil disimpan dan status diubah ke SHIPPED!`,
      order: updated
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal menyimpan nomor resi.' });
  }
});

// 9. Admin: General Status Update
router.patch('/admin/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = db.getOrderById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
      return;
    }

    const nowStr = new Date().toLocaleString('id-ID');
    const newTimeline = [
      ...order.timeline,
      {
        status,
        title: `Status Diperbarui ke ${String(status).toUpperCase()}`,
        description: `Status pesanan diubah oleh administrator toko.`,
        timestamp: nowStr
      }
    ];

    const updated = db.updateOrder(id, {
      status,
      trackingNumber: trackingNumber || order.trackingNumber,
      timeline: newTimeline
    });

    res.json({
      success: true,
      message: `Status pesanan #${order.orderNumber} berhasil diperbarui ke ${status}!`,
      order: updated
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui status order.' });
  }
});

export default router;
