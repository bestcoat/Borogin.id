import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdmin, AuthenticatedRequest } from '../auth';
import { Product } from '../../types';

const router = Router();

// 1. Public Products List (with Search, Category, Sorting, & Pagination)
router.get('/', (req: Request, res: Response): void => {
  try {
    const { category, search, sort, page = '1', limit = '50', status = 'published' } = req.query;

    let list = db.getProducts();

    // Filter by status (guests & customers only see published / in-stock products unless requesting all)
    if (status !== 'all') {
      list = list.filter(p => p.status !== 'inactive');
    }

    // Filter by Category
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }

    // Filter by Search Query
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'terlaris') {
      list.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    const total = list.length;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 50);
    const startIdx = (pageNum - 1) * limitNum;
    const paginatedItems = list.slice(startIdx, startIdx + limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      products: paginatedItems
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memuat katalog produk.' });
  }
});

// 2. Public Product Detail
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const product = db.getProductById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
      return;
    }
    res.json({ success: true, product });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memuat detail produk.' });
  }
});

// ================= ADMIN ENDPOINTS (Role Admin Required) =================

// 3. Admin Add Product
router.post('/admin', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const {
      title,
      sku,
      category,
      brand = 'Borongin Exclusive',
      price,
      originalPrice,
      stock = 0,
      minStockAlert = 5,
      weightGrams = 500,
      dimensions = '20 x 15 x 5 cm',
      images = [],
      description = '',
      status = 'published',
      variations = [],
      specifications = {}
    } = req.body;

    if (!title || !sku || !category || price === undefined) {
      res.status(400).json({ success: false, message: 'Nama produk, SKU, kategori, dan harga jual wajib diisi.' });
      return;
    }

    const discount = originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    const newProd: Product = {
      id: `prod-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: sku.trim().toUpperCase(),
      category: category.trim(),
      brand: brand.trim(),
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      discountPercent: discount,
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0,
      stock: Number(stock),
      minStockAlert: Number(minStockAlert),
      weightGrams: Number(weightGrams),
      dimensions: dimensions.trim(),
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
      description: description.trim(),
      specifications: {
        'Merek': brand,
        'Kategori': category,
        'Berat': `${weightGrams} gram`,
        'Dimensi': dimensions,
        ...specifications
      },
      status: Number(stock) <= 0 ? 'out_of_stock' : status,
      variations,
      reviews: [],
      createdAt: new Date().toISOString().slice(0, 10)
    };

    const saved = db.addProduct(newProd);
    res.status(201).json({
      success: true,
      message: `Produk "${saved.title}" berhasil ditambahkan ke database!`,
      product: saved
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan produk baru ke server.' });
  }
});

// 4. Admin Edit Product
router.put('/admin/:id', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const existing = db.getProductById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
      return;
    }

    const {
      title,
      sku,
      category,
      brand,
      price,
      originalPrice,
      stock,
      minStockAlert,
      weightGrams,
      dimensions,
      images,
      description,
      status,
      variations,
      specifications
    } = req.body;

    const updates: Partial<Product> = {};
    if (title) updates.title = title.trim();
    if (sku) updates.sku = sku.trim().toUpperCase();
    if (category) updates.category = category.trim();
    if (brand) updates.brand = brand.trim();
    if (price !== undefined) updates.price = Number(price);
    if (originalPrice !== undefined) updates.originalPrice = Number(originalPrice);
    if (stock !== undefined) {
      updates.stock = Math.max(0, Number(stock));
      if (updates.stock === 0) updates.status = 'out_of_stock';
    }
    if (minStockAlert !== undefined) updates.minStockAlert = Number(minStockAlert);
    if (weightGrams !== undefined) updates.weightGrams = Number(weightGrams);
    if (dimensions !== undefined) updates.dimensions = dimensions.trim();
    if (images && Array.isArray(images)) updates.images = images;
    if (description !== undefined) updates.description = description;
    if (status) updates.status = status;
    if (variations && Array.isArray(variations)) updates.variations = variations;
    if (specifications) updates.specifications = { ...existing.specifications, ...specifications };

    if (updates.price && (updates.originalPrice || existing.originalPrice)) {
      const orig = updates.originalPrice || existing.originalPrice;
      updates.discountPercent = orig > updates.price ? Math.round(((orig - updates.price) / orig) * 100) : 0;
    }

    const updated = db.updateProduct(id, updates);
    res.json({
      success: true,
      message: `Data produk "${updated?.title}" berhasil diperbarui!`,
      product: updated
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui data produk.' });
  }
});

// 5. Admin Delete Product
router.delete('/admin/:id', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const ok = db.deleteProduct(id);
    if (!ok) {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
      return;
    }
    res.json({ success: true, message: 'Produk berhasil dihapus dari database.' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal menghapus produk.' });
  }
});

// 6. Admin Fast Stock Update
router.patch('/admin/:id/stock', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    if (stock === undefined) {
      res.status(400).json({ success: false, message: 'Nilai stok baru wajib disertakan.' });
      return;
    }

    const newStock = Math.max(0, Number(stock));
    const updated = db.updateProduct(id, {
      stock: newStock,
      status: newStock <= 0 ? 'out_of_stock' : 'published'
    });

    res.json({
      success: true,
      message: `Stok produk "${updated?.title}" berhasil diperbarui menjadi ${newStock} unit.`,
      product: updated
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui stok.' });
  }
});

export default router;
