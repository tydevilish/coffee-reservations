'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiUser, FiLock, FiCoffee, FiAlertCircle,
  FiLoader, FiArrowLeft, FiShield
} from 'react-icons/fi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Auto-redirect if already logged in
  useEffect(() => {
    const stored = localStorage.getItem('admin');
    if (stored) {
      router.replace('/admin');
    } else {
      setChecking(false);
    }
  }, [router]);

  // Don't render anything while checking session
  if (checking) return null;

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store admin session in localStorage
        localStorage.setItem('admin', JSON.stringify(data.admin));
        router.replace('/admin');
      } else {
        setError(data.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 coffee-pattern relative">
      {/* Subtle overlay to make it feel more like an admin portal */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-coffee-50/80 pointer-events-none" />

      <div className="card relative z-10 max-w-md w-full p-8 md:p-10 animate-fade-in-up shadow-2xl shadow-coffee-900/10 border border-white/60 backdrop-blur-sm rounded-3xl">

        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="text-coffee-400 hover:text-accent transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-coffee-50"
            title="กลับหน้าหลัก"
          >
            <FiArrowLeft size={20} />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10 mt-2">
          <div className="relative w-20 h-20 bg-gradient-to-br from-accent to-accent-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <FiCoffee className="text-white text-4xl" />
            <div className="absolute -bottom-2 -right-2 bg-coffee-800 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <FiShield className="text-white text-sm" />
            </div>
          </div>
          <span className="heading-en text-accent text-xs tracking-[0.3em] uppercase font-bold mb-2 block">
            Secure Portal
          </span>
          <h1 className="text-3xl font-bold text-coffee-800 mb-2">Admin Login</h1>
          <p className="text-coffee-500 text-sm">ลงชื่อเข้าใช้ระบบจัดการร้าน BeanBliss</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-coffee-700 mb-2">
              ชื่อผู้ใช้
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-coffee-400">
                <FiUser size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white border border-coffee-200 hover:border-accent focus:border-accent focus:ring-1 focus:ring-accent outline-none rounded-2xl py-4 pl-12 pr-6 text-coffee-800 transition-all placeholder:text-coffee-300 shadow-sm"
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-coffee-700 mb-2">
              รหัสผ่าน
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-coffee-400">
                <FiLock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-coffee-200 hover:border-accent focus:border-accent focus:ring-1 focus:ring-accent outline-none rounded-2xl py-4 pl-12 pr-6 text-coffee-800 transition-all placeholder:text-coffee-300 shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm p-4 rounded-2xl animate-fade-in-up">
              <FiAlertCircle className="mt-0.5 flex-shrink-0" size={16} />
              <p className="font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="btn-primary w-full justify-center py-4 rounded-2xl text-lg font-medium shadow-md hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <FiLoader className="animate-spin" size={20} />
                  กำลังตรวจสอบ...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  เข้าสู่ระบบ
                  <FiArrowLeft className="rotate-180 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-coffee-400 heading-en tracking-wider">
            &copy; {new Date().getFullYear()} BEANBLISS CAFE
          </p>
        </div>

      </div>
    </div>
  );
}