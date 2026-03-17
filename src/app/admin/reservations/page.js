'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiCheck, FiX, FiFilter, FiCalendar, FiUser, FiPhone, FiClock, FiUsers, FiLoader, FiCheckCircle, FiXCircle, FiClipboard, FiFileText } from 'react-icons/fi';

const statusConfig = {
  pending: { label: 'รอยืนยัน', class: 'badge-warning', Icon: FiLoader },
  confirmed: { label: 'ยืนยันแล้ว', class: 'badge-success', Icon: FiCheckCircle },
  cancelled: { label: 'ยกเลิก', class: 'badge-danger', Icon: FiXCircle },
};

export default function AdminReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('admin');
    if (!stored) {
      router.push('/admin/login');
      return;
    }
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      const res = await fetch('/api/reservations');
      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
    }
  }

  async function updateStatus(id, status) {
    try {
      await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchReservations();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }

  const filtered = reservations.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterDate && r.date !== filterDate) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 coffee-pattern">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-coffee-400 hover:text-accent transition-colors">
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-coffee-800">จัดการการจอง</h1>
              <p className="text-coffee-400 text-sm">{filtered.length} รายการ</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 flex flex-wrap items-center gap-4">
          <FiFilter className="text-coffee-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="pending">รอยืนยัน</option>
            <option value="confirmed">ยืนยันแล้ว</option>
            <option value="cancelled">ยกเลิก</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="input-field w-auto"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="text-xs text-accent hover:underline"
            >
              ล้างวันที่
            </button>
          )}
        </div>

        {/* Reservations */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <FiClipboard className="text-5xl text-coffee-300 mx-auto mb-4" />
            <p className="text-coffee-400">ไม่พบรายการจอง</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => {
              const status = statusConfig[r.status] || statusConfig.pending;
              return (
                <div key={r.id} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-coffee-800 text-lg">
                          {r.customer_name}
                        </h3>
                        <span className={`badge ${status.class}`}>
                          <status.Icon className="inline mr-1" /> {status.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-coffee-500">
                          <FiCalendar className="text-accent flex-shrink-0" />
                          <span>{r.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-coffee-500">
                          <FiClock className="text-accent flex-shrink-0" />
                          <span>{r.time_slot} น.</span>
                        </div>
                        <div className="flex items-center gap-2 text-coffee-500">
                          <FiUsers className="text-accent flex-shrink-0" />
                          <span>{r.guests} คน</span>
                        </div>
                        <div className="flex items-center gap-2 text-coffee-500">
                          <FiPhone className="text-accent flex-shrink-0" />
                          <span>{r.phone}</span>
                        </div>
                      </div>

                      {r.tables && (
                        <div className="mt-2 text-sm text-coffee-400">
                          โต๊ะ: {r.tables.name} ({r.tables.seats} ที่นั่ง, {r.tables.zone})
                        </div>
                      )}

                      {r.note && (
                        <div className="mt-2 text-sm text-coffee-400 bg-coffee-50 rounded-lg p-2 flex items-start gap-2">
                          <FiFileText className="text-accent flex-shrink-0 mt-0.5" /> {r.note}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {r.status === 'pending' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateStatus(r.id, 'confirmed')}
                          className="btn-primary text-sm py-2"
                        >
                          <FiCheck /> ยืนยัน
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, 'cancelled')}
                          className="bg-danger/10 text-danger px-4 py-2 rounded-full text-sm font-medium hover:bg-danger/20 transition-colors flex items-center gap-1"
                        >
                          <FiX /> ปฏิเสธ
                        </button>
                      </div>
                    )}

                    {r.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(r.id, 'cancelled')}
                        className="bg-danger/10 text-danger px-4 py-2 rounded-full text-sm font-medium hover:bg-danger/20 transition-colors flex items-center gap-1 flex-shrink-0"
                      >
                        <FiX /> ยกเลิก
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
