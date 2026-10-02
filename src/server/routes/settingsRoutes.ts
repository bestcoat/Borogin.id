import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdmin, AuthenticatedRequest } from '../auth';

const router = Router();

// 1. Public Store Settings (BCA, QRIS, WhatsApp)
router.get('/', (req: Request, res: Response): void => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memuat pengaturan toko.' });
  }
});

// 2. Admin Update Store Settings
router.put('/admin', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const {
      bcaBank,
      bcaAccountNumber,
      bcaAccountHolder,
      qrisImage,
      whatsappNumber,
      whatsappInternational,
      isCodEnabled,
      freeShippingMin,
      storeTagline
    } = req.body;

    const updates: any = {};
    if (bcaBank) updates.bcaBank = bcaBank.trim();
    if (bcaAccountNumber) updates.bcaAccountNumber = bcaAccountNumber.trim();
    if (bcaAccountHolder) updates.bcaAccountHolder = bcaAccountHolder.trim();
    if (qrisImage) updates.qrisImage = qrisImage.trim();
    if (whatsappNumber) updates.whatsappNumber = whatsappNumber.trim();
    if (whatsappInternational) updates.whatsappInternational = whatsappInternational.trim();
    if (isCodEnabled !== undefined) updates.isCodEnabled = Boolean(isCodEnabled);
    if (freeShippingMin !== undefined) updates.freeShippingMin = Number(freeShippingMin);
    if (storeTagline) updates.storeTagline = storeTagline.trim();

    const updated = db.updateSettings(updates);
    res.json({
      success: true,
      message: 'Pengaturan toko berhasil diperbarui di server!',
      settings: updated
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui pengaturan toko.' });
  }
});

// 3. Admin Secure Upload (Base64 file with MIME type check and size limits)
router.post('/admin/upload', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { fileData, fileName } = req.body;

    if (!fileData || typeof fileData !== 'string') {
      res.status(400).json({ success: false, message: 'Data file tidak valid.' });
      return;
    }

    // Validate MIME type (Only image/jpeg, image/png, image/webp allowed)
    const mimeMatch = fileData.match(/^data:(image\/(jpeg|png|webp|gif));base64,/);
    if (!mimeMatch) {
      res.status(400).json({
        success: false,
        message: 'Format file tidak diizinkan. Hanya file gambar (JPG, PNG, WEBP) yang diperbolehkan.'
      });
      return;
    }

    // Size limit check (approx 5MB base64 is ~6.8M chars)
    if (fileData.length > 7 * 1024 * 1024) {
      res.status(400).json({ success: false, message: 'Ukuran file melebihi batas maksimal 5MB.' });
      return;
    }

    // Return the safe data URL ready for immediate persistence in database
    res.json({
      success: true,
      message: 'File berhasil divalidasi dan diunggah.',
      url: fileData
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memproses unggahan file.' });
  }
});

// 4. Categories & Coupons
router.get('/categories', (req: Request, res: Response): void => {
  res.json({ success: true, categories: db.getCategories() });
});

router.post('/admin/categories', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) {
      res.status(400).json({ success: false, message: 'Nama dan slug kategori wajib diisi.' });
      return;
    }

    const newCat = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      iconName: 'Package',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
      itemCount: 0
    };

    const saved = db.addCategory(newCat);
    res.status(201).json({ success: true, category: saved });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal menambah kategori.' });
  }
});

router.get('/coupons', (req: Request, res: Response): void => {
  res.json({ success: true, coupons: db.getCoupons() });
});

export default router;
