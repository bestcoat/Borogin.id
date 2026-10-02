import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, UserRecord } from './db';

const JWT_SECRET = process.env.AUTH_SECRET || 'BORONGIN_PRODUCTION_SECRET_KEY_9847291847192847';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: 'GUEST' | 'CUSTOMER' | 'ADMIN';
  exp: number;
}

export function generateToken(user: UserRecord, expiresInHours: number = 72): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const payloadData: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp
  };
  const payload = Buffer.from(JSON.stringify(payloadData)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const data: AuthTokenPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (data.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return data;
  } catch (e) {
    return null;
  }
}

// Extend Express Request
export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

// Middleware: Extract current user from Cookie or Authorization header
export function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token: string | undefined = req.cookies?.['borongin_token'];

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      const user = db.findUserById(payload.userId);
      if (user) {
        req.user = user;
      }
    }
  }

  next();
}

// Guard: Must be logged in (Customer or Admin)
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Silakan Login atau Daftar terlebih dahulu untuk melanjutkan.'
    });
    return;
  }
  next();
}

// Guard: Strict Admin Only (Role must be ADMIN)
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak: Autentikasi administrator diperlukan.'
    });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      message: 'Akses terlarang: Akun Anda tidak memiliki izin Administrator.'
    });
    return;
  }

  next();
}

// Simple in-memory rate limiter for login
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

export function rateLimitLogin(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10;

  const record = loginAttempts.get(ip);
  if (!record || now - record.firstAttempt > windowMs) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return next();
  }

  if (record.count >= maxAttempts) {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak percobaan login. Silakan coba kembali dalam 15 menit demi keamanan akun.'
    });
    return;
  }

  record.count += 1;
  next();
}
