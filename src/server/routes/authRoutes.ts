import { Router, Response } from 'express';
import crypto from 'crypto';
import { db, hashPasswordWithSalt, verifyPassword, UserRecord } from '../db';
import { generateToken, AuthenticatedRequest, requireAuth, requireAdmin, rateLimitLogin } from '../auth';

const router = Router();

// Sanitizer for customer responses
function sanitizeUser(u: UserRecord) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    memberTier: u.memberTier,
    points: u.points,
    avatar: u.avatar,
    address: u.address,
    createdAt: u.createdAt
  };
}

// 1. Customer Register
router.post('/register', (req, res: Response): void => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ success: false, message: 'Harap lengkapi semua kolom pendaftaran.' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Format alamat email tidak valid.' });
      return;
    }

    // Phone validation
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      res.status(400).json({ success: false, message: 'Nomor WhatsApp tidak valid (minimal 10 digit angka).' });
      return;
    }

    // Password strength
    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Kata sandi minimal 6 karakter demi keamanan akun Anda.' });
      return;
    }

    // Check if email already registered
    const existing = db.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ success: false, message: 'Alamat email ini sudah terdaftar. Silakan login.' });
      return;
    }

    const { hash, salt } = hashPasswordWithSalt(password);
    const newUser: UserRecord = {
      id: `user-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      passwordHash: hash,
      salt,
      role: 'CUSTOMER',
      memberTier: 'Bronze',
      points: 100, // Bonus 100 poin registrasi
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString()
    };

    db.addUser(newUser);
    const token = generateToken(newUser);

    res.cookie('borongin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 72 * 3600 * 1000,
      sameSite: 'lax'
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Selamat datang di BORONGIN.COM.',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server saat registrasi.' });
  }
});

// 2. Customer Login
router.post('/login', rateLimitLogin, (req, res: Response): void => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Masukkan email dan kata sandi Anda.' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user || user.role === 'ADMIN') {
      res.status(401).json({ success: false, message: 'Email atau kata sandi yang Anda masukkan salah.' });
      return;
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Email atau kata sandi yang Anda masukkan salah.' });
      return;
    }

    const token = generateToken(user);

    res.cookie('borongin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 72 * 3600 * 1000,
      sameSite: 'lax'
    });

    res.json({
      success: true,
      message: `Selamat datang kembali, ${user.name}!`,
      token,
      user: sanitizeUser(user)
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memproses autentikasi login.' });
  }
});

// 3a. Administrator Setup / Inisialisasi Master Password
router.post('/admin/setup', (req, res: Response): void => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || password.length < 6) {
      res.status(400).json({ success: false, message: 'Password minimal 6 karakter demi keamanan akun toko.' });
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Konfirmasi password tidak cocok.' });
      return;
    }

    const adminUser = db.findAdminUser('boronginadm');
    if (!adminUser) {
      res.status(404).json({ success: false, message: 'Akun administrator belum terdaftar.' });
      return;
    }

    const { hash, salt } = hashPasswordWithSalt(password);
    db.updateUser(adminUser.id, { passwordHash: hash, salt });

    const token = generateToken(adminUser);
    res.cookie('borongin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 3600 * 1000,
      sameSite: 'lax'
    });

    res.json({
      success: true,
      message: 'Master password administrator berhasil dibuat dan disimpan!',
      token,
      user: sanitizeUser(adminUser)
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal mengatur password administrator.' });
  }
});

// 3b. Administrator Login (Dedicated /admin/login endpoint)
router.post('/admin/login', rateLimitLogin, (req, res: Response): void => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Masukkan username dan password administrator.' });
      return;
    }

    const adminUser = db.findAdminUser(username);
    if (!adminUser) {
      res.status(401).json({ success: false, message: 'Kredensial administrator tidak valid. Akses ditolak.' });
      return;
    }

    const isValid = verifyPassword(password, adminUser.passwordHash, adminUser.salt);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Password administrator salah. Akses ditolak.' });
      return;
    }

    const token = generateToken(adminUser);

    res.cookie('borongin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 3600 * 1000,
      sameSite: 'lax'
    });

    res.json({
      success: true,
      message: 'Login administrator berhasil. Mengalihkan ke Admin Dashboard BORONGIN...',
      token,
      user: sanitizeUser(adminUser)
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memproses login administrator.' });
  }
});

// 4. Current Session Info (GET /api/auth/me)
router.get('/me', (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.json({
      success: true,
      authenticated: false,
      role: 'GUEST',
      user: null
    });
    return;
  }

  res.json({
    success: true,
    authenticated: true,
    role: req.user.role,
    user: sanitizeUser(req.user)
  });
});

// 5. Customer Profile Update
router.put('/profile', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const { name, phone, address } = req.body;

    const updates: Partial<UserRecord> = {};
    if (name) updates.name = name.trim();
    if (phone) updates.phone = phone.trim();
    if (address) updates.address = address;

    const updated = db.updateUser(user.id, updates);
    res.json({
      success: true,
      message: 'Profil Anda berhasil diperbarui!',
      user: updated ? sanitizeUser(updated) : null
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil.' });
  }
});

// 6. Admin Change Master Password
router.post('/admin/change-password', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const admin = req.user!;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Harap isi password lama dan baru.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter.' });
      return;
    }

    const isValid = verifyPassword(oldPassword, admin.passwordHash, admin.salt);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Password lama salah.' });
      return;
    }

    const { hash, salt } = hashPasswordWithSalt(newPassword);
    db.updateUser(admin.id, { passwordHash: hash, salt });

    res.json({
      success: true,
      message: 'Password master administrator berhasil diperbarui dengan aman!'
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal mengubah password administrator.' });
  }
});

// 7. Forgot Password (Customer)
router.post('/forgot-password', (req, res: Response): void => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, message: 'Masukkan alamat email Anda.' });
    return;
  }

  const user = db.findUserByEmail(email);
  if (user) {
    const resetToken = crypto.randomBytes(24).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour
    db.updateUser(user.id, { resetToken, resetExpires });
  }

  // Always return friendly message for security (prevent email enumeration)
  res.json({
    success: true,
    message: 'Jika email terdaftar di BORONGIN.COM, petunjuk reset password telah dikirim ke email atau WhatsApp Anda.'
  });
});

// 8. Logout
router.post('/logout', (req, res: Response): void => {
  res.clearCookie('borongin_token');
  res.json({ success: true, message: 'Anda telah berhasil logout.' });
});

export default router;
