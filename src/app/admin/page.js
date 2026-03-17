'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiGrid, FiCalendar, FiUsers, FiCoffee, FiLogOut, FiClock, FiTrendingUp, FiCheckCircle, FiAlertCircle, FiBook } from 'react-icons/fi';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalTables: 0,
    availableTables: 0,
    todayReservations: 0,
    pendingCount: 0,
    confirmedCount: 0,
  });
  const [recentReservations, setRecentReservations] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('admin');
    if (!stored) {
      router.push('/admin/login');
      return;
    }
    setAdmin(JSON.parse(stored));
    fetchStats();
    fetchRecent();
  }, []);

  async function fetchStats() {
    try {
      const [tablesRes, reservationsRes] = await Promise.all([
        fetch('/api/tables'),
        fetch('/api/reservations'),
      ]);
      const tables = await tablesRes.json();
      const reservations = await reservationsRes.json();

      const today = new Date().toISOString().split('T')[0];
      const todayRes = Array.isArray(reservations)
        ? reservations.filter((r) => r.date === today)
        : [];

      setStats({
        totalTables: Array.isArray(tables) ? tables.length : 0,
        availableTables: Array.isArray(tables) ? tables.filter((t) => t.is_available).length : 0,
        todayReservations: todayRes.length,
        pendingCount: Array.isArray(reservations) ? reservations.filter((r) => r.status === 'pending').length : 0,
        confirmedCount: Array.isArray(reservations) ? reservations.filter((r) => r.status === 'confirmed').length : 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }

  async function fetchRecent() {
    try {
      const res = await fetch('/api/reservations');
      const data = await res.json();
      setRecentReservations(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (err) {
      console.error('Failed to fetch recent:', err);
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin');
    router.push('/admin/login');
  }

  const statusLabels = {
    pending: { label: 'รอยืนยัน', class: 'badge-warning' },
    confirmed: { label: 'ยืนยันแล้ว', class: 'badge-success' },
    cancelled: { label: 'ยกเลิก', class: 'badge-danger' },
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 coffee-pattern">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-coffee-800">
              แดชบอร์ด
            </h1>
            <p className="text-coffee-400 text-sm mt-1">
              สวัสดี, {admin.username}
            </p>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-sm">
            <FiLogOut /> ออกจากระบบ
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <FiGrid />, label: 'โต๊ะทั้งหมด', value: stats.totalTables, color: 'from-coffee-600 to-coffee-700' },
            { icon: <FiCheckCircle />, label: 'โต๊ะว่าง', value: stats.availableTables, color: 'from-success to-green-700' },
            { icon: <FiCalendar />, label: 'จองวันนี้', value: stats.todayReservations, color: 'from-accent to-accent-dark' },
            { icon: <FiAlertCircle />, label: 'รอยืนยัน', value: stats.pendingCount, color: 'from-warning to-amber-600' },
          ].map((stat, i) => (
            <div key={i} className="card p-5 group hover:shadow-xl">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-lg mb-3 group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-coffee-800">{stat.value}</p>
              <p className="text-xs text-coffee-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/tables" className="card p-6 group flex items-center gap-4 hover:border-accent/40">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coffee-600 to-coffee-700 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
              <FiCoffee />
            </div>
            <div>
              <h3 className="font-semibold text-coffee-800">จัดการโต๊ะ</h3>
              <p className="text-sm text-coffee-400">เพิ่ม ลบ แก้ไขโต๊ะ</p>
            </div>
          </Link>

          <Link href="/admin/menu" className="card p-6 group flex items-center gap-4 hover:border-accent/40">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coffee-500 to-coffee-600 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
              <FiBook />
            </div>
            <div>
              <h3 className="font-semibold text-coffee-800">จัดการเมนู</h3>
              <p className="text-sm text-coffee-400">เพิ่ม ลบ แก้ไขเมนู</p>
            </div>
          </Link>

          <Link href="/admin/reservations" className="card p-6 group flex items-center gap-4 hover:border-accent/40">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
              <FiCalendar />
            </div>
            <div>
              <h3 className="font-semibold text-coffee-800">จัดการการจอง</h3>
              <p className="text-sm text-coffee-400">ดู อนุมัติ ยกเลิกการจอง</p>
            </div>
          </Link>
        </div>

        {/* Recent Reservations */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-coffee-800 flex items-center gap-2">
              <FiClock className="text-accent" />
              การจองล่าสุด
            </h2>
            <Link href="/admin/reservations" className="text-accent text-sm hover:underline">
              ดูทั้งหมด →
            </Link>
          </div>

          {recentReservations.length === 0 ? (
            <p className="text-center text-coffee-400 py-8">ยังไม่มีการจอง</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-coffee-400 border-b border-coffee-100">
                    <th className="pb-3 font-medium">ชื่อ</th>
                    <th className="pb-3 font-medium">โต๊ะ</th>
                    <th className="pb-3 font-medium">วันที่</th>
                    <th className="pb-3 font-medium">เวลา</th>
                    <th className="pb-3 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.map((r) => {
                    const status = statusLabels[r.status] || statusLabels.pending;
                    return (
                      <tr
                        key={r.id}
                        className="border-b border-coffee-50 hover:bg-coffee-50/50 transition-colors"
                      >
                        <td className="py-3 font-medium text-coffee-700">
                          {r.customer_name}
                        </td>
                        <td className="py-3 text-coffee-500">
                          {r.tables?.name || '-'}
                        </td>
                        <td className="py-3 text-coffee-500">{r.date}</td>
                        <td className="py-3 text-coffee-500">{r.time_slot}</td>
                        <td className="py-3">
                          <span className={`badge ${status.class}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
