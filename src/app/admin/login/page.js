'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiLock, FiCoffee } from 'react-icons/fi';

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
        setError(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 coffee-pattern">
      <div className="card max-w-sm w-full p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCoffee className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-coffee-800">Admin Login</h1>
          <p className="text-coffee-400 text-sm mt-1">เข้าสู่ระบบจัดการร้าน</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-coffee-600 mb-2">
              <FiUser className="inline mr-1" /> ชื่อผู้ใช้
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-coffee-600 mb-2">
              <FiLock className="inline mr-1" /> รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-danger/10 text-danger text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-50"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}
