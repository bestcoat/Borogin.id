/**
 * Layanan Autentikasi Keamanan Administrator BORONGIN.COM
 * 
 * Sesuai instruksi:
 * - Username administrator: boronginadm
 * - TIDAK ADA password yang di-hardcode di kode sumber / frontend / repository
 * - Menggunakan kriptografi Web Crypto API (SHA-256 + Salt)
 * - Password dapat dibuat saat inisialisasi pertama dan diubah melalui dashboard admin
 */

const STORAGE_KEY_AUTH = 'borongin_admin_auth_v1';
const STORAGE_KEY_SESSION = 'borongin_admin_session_v1';
const ADMIN_USERNAME = 'boronginadm';

// Salt unik per instalasi browser
function getOrGenerateSalt(): string {
  const existing = localStorage.getItem('borongin_admin_salt');
  if (existing) return existing;
  const newSalt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  localStorage.setItem('borongin_admin_salt', newSalt);
  return newSalt;
}

// Hash password dengan SHA-256 + Salt via Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const salt = getOrGenerateSalt();
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt + 'BORONGIN_SECURE_AUTH_SALT');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function isMasterPasswordSet(): boolean {
  return localStorage.getItem(STORAGE_KEY_AUTH) !== null;
}

export function isSessionActive(): boolean {
  return sessionStorage.getItem(STORAGE_KEY_SESSION) === 'active_admin_session';
}

export async function setInitialMasterPassword(password: string): Promise<{ success: boolean; message: string }> {
  if (password.length < 6) {
    return { success: false, message: 'Password minimal 6 karakter demi keamanan akun admin.' };
  }
  const hash = await hashPassword(password);
  localStorage.setItem(STORAGE_KEY_AUTH, hash);
  sessionStorage.setItem(STORAGE_KEY_SESSION, 'active_admin_session');
  return { success: true, message: 'Password administrator berhasil dibuat dan disimpan dengan aman.' };
}

export async function verifyAdminLogin(username: string, password: string): Promise<{ success: boolean; message: string }> {
  if (username.trim().toLowerCase() !== ADMIN_USERNAME) {
    return { success: false, message: 'Username tidak valid. Hanya administrator berwenang yang dapat mengakses area ini.' };
  }

  const storedHash = localStorage.getItem(STORAGE_KEY_AUTH);

  // Jika belum pernah disetup, arahkan untuk buat password pertama kali
  if (!storedHash) {
    return { 
      success: false, 
      message: 'Password administrator belum diatur. Silakan lakukan inisialisasi password master admin Anda.' 
    };
  }

  const inputHash = await hashPassword(password);
  if (inputHash !== storedHash) {
    return { success: false, message: 'Password administrator salah. Akses ditolak.' };
  }

  sessionStorage.setItem(STORAGE_KEY_SESSION, 'active_admin_session');
  return { success: true, message: 'Login administrator berhasil. Mengalihkan ke Dashboard BORONGIN...' };
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(STORAGE_KEY_SESSION);
}

export async function changeMasterPassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const storedHash = localStorage.getItem(STORAGE_KEY_AUTH);
  if (!storedHash) {
    return { success: false, message: 'Belum ada password yang tersimpan.' };
  }

  const oldHash = await hashPassword(oldPassword);
  if (oldHash !== storedHash) {
    return { success: false, message: 'Password lama salah.' };
  }

  if (newPassword.length < 6) {
    return { success: false, message: 'Password baru minimal 6 karakter.' };
  }

  const newHash = await hashPassword(newPassword);
  localStorage.setItem(STORAGE_KEY_AUTH, newHash);
  return { success: true, message: 'Password administrator berhasil diperbarui!' };
}

export const OFFICIAL_ADMIN_USERNAME = ADMIN_USERNAME;
