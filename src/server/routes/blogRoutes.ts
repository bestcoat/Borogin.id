import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdmin, AuthenticatedRequest } from '../auth';
import { BlogPost } from '../../types';

const router = Router();

// Helper to create URL friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 1. Get All Blog Posts (Public with search & filter)
router.get('/', (req: Request, res: Response): void => {
  try {
    const { category, search, tag, limit } = req.query;
    let posts = db.getBlogPosts();

    // Filter by category
    if (category && typeof category === 'string' && category !== 'all') {
      posts = posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by tag
    if (tag && typeof tag === 'string') {
      const qTag = tag.toLowerCase().trim();
      posts = posts.filter(p => p.tags.some(t => t.toLowerCase() === qTag));
    }

    // Filter by search
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.toLowerCase().trim();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (limit && typeof limit === 'string') {
      const max = parseInt(limit, 10);
      if (!isNaN(max) && max > 0) {
        posts = posts.slice(0, max);
      }
    }

    res.json({
      success: true,
      total: posts.length,
      posts
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data artikel blog: ' + (error?.message || 'Server error')
    });
  }
});

// 2. Get Single Blog Post by ID or Slug
router.get('/:idOrSlug', (req: Request, res: Response): void => {
  try {
    const { idOrSlug } = req.params;
    const post = db.getBlogPostById(idOrSlug);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Artikel blog tidak ditemukan.'
      });
      return;
    }

    res.json({
      success: true,
      post
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal memuat artikel blog.'
    });
  }
});

// 3. Create New Blog Post (Admin Only)
router.post('/', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { title, excerpt, content, category, author, readTime, image, tags, slug } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({
        success: false,
        message: 'Judul artikel wajib diisi.'
      });
      return;
    }

    if (!content || !content.trim()) {
      res.status(400).json({
        success: false,
        message: 'Konten artikel wajib diisi.'
      });
      return;
    }

    const newId = `blog-${Date.now()}`;
    const finalSlug = slug && slug.trim() ? generateSlug(slug) : generateSlug(title);
    
    // Parse tags if string
    let parsedTags: string[] = [];
    if (Array.isArray(tags)) {
      parsedTags = tags.map(t => String(t).trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const newPost: BlogPost = {
      id: newId,
      title: title.trim(),
      slug: finalSlug || `artikel-${Date.now()}`,
      excerpt: (excerpt || content.substring(0, 150) + '...').trim(),
      content: content.trim(),
      category: category?.trim() || 'Tips Belanja',
      author: author?.trim() || req.user?.name || 'Administrator BORONGIN',
      date: todayStr,
      readTime: readTime?.trim() || '3 Menit Baca',
      image: image?.trim() || 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=800&q=80',
      tags: parsedTags.length > 0 ? parsedTags : ['Borongin', 'Tips']
    };

    const saved = db.addBlogPost(newPost);

    res.status(201).json({
      success: true,
      message: 'Artikel blog baru berhasil diterbitkan!',
      post: saved
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat artikel blog: ' + (error?.message || 'Server error')
    });
  }
});

// 4. Update Blog Post (Admin Only)
router.put('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const existing = db.getBlogPostById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Artikel blog yang ingin diubah tidak ditemukan.'
      });
      return;
    }

    const { title, excerpt, content, category, author, readTime, image, tags, slug } = req.body;

    const updates: Partial<BlogPost> = {};
    if (title !== undefined) updates.title = title.trim();
    if (slug !== undefined) updates.slug = generateSlug(slug || title || existing.title);
    if (excerpt !== undefined) updates.excerpt = excerpt.trim();
    if (content !== undefined) updates.content = content.trim();
    if (category !== undefined) updates.category = category.trim();
    if (author !== undefined) updates.author = author.trim();
    if (readTime !== undefined) updates.readTime = readTime.trim();
    if (image !== undefined) updates.image = image.trim();
    
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        updates.tags = tags.map(t => String(t).trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        updates.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    const updated = db.updateBlogPost(existing.id, updates);

    res.json({
      success: true,
      message: 'Artikel blog berhasil diperbarui!',
      post: updated
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui artikel blog: ' + (error?.message || 'Server error')
    });
  }
});

// 5. Delete Blog Post (Admin Only)
router.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const existing = db.getBlogPostById(id);

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan.'
      });
      return;
    }

    const deleted = db.deleteBlogPost(existing.id);

    if (!deleted) {
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus artikel dari database.'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Artikel blog berhasil dihapus.'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus artikel blog.'
    });
  }
});

export default router;
