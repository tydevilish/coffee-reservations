'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  FiSearch, FiClock, FiCalendar, FiUsers, FiMapPin, FiPhone,
  FiLoader, FiCheckCircle, FiXCircle, FiFileText, FiCoffee, FiArrowLeft
} from 'react-icons/fi';

// ปรับปรุง Status Labels ให้ดูพรีเมียมและเข้ากับโทนสี
const statusLabels = {
  pending: {
    label: 'รอยืนยัน',
    class: 'bg-amber-50 text-amber-600 border border-amber-200',
    Icon: FiLoader,
    iconClass: 'animate-spin'
  },
  confirmed: {
    label: 'ยืนยันแล้ว',
    class: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    Icon: FiCheckCircle,
    iconClass: ''
  },
  cancelled: {
    label: 'ยกเลิก',
    class: 'bg-rose-50 text-rose-600 border border-rose-200',
    Icon: FiXCircle,
    iconClass: ''
  },
};

export default function ReservationStatusPage() {
  const [phone, setPhone] = useState('');
  const [reservations, setReservations] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/reservations?phone=${phone}`);
      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to search reservations:', err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 coffee-pattern relative">
      <div className="max-w-3xl mx-auto relative z-10">

        {/* ===== Header ===== */}
        <div className="text-center mb-14 animate-fade-in-up">
          <span className="heading-en text-accent text-sm tracking-[0.3em] uppercase">
            Track Your Spot
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-coffee-800 mt-4 mb-4">
            เช็คสถานะ<span className="text-gradient">การจอง</span>
          </h1>
          <p className="font-serif-en text-coffee-400 text-base md:text-lg max-w-md mx-auto">
            Enter your phone number to track your reservation details
          </p>
          <div className="divider-accent mx-auto mt-6" />
        </div>

        {/* ===== Search Form ===== */}
        <div
          className="card p-4 md:p-6 mb-12 shadow-xl shadow-coffee-900/5 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-coffee-400">
                <FiPhone size={20} />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="กรอกเบอร์โทรศัพท์ที่ใช้จอง (เช่น 0812345678)"
                className="w-full bg-coffee-50 border border-coffee-100 hover:border-coffee-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none rounded-2xl py-4 pl-14 pr-6 text-coffee-800 transition-all placeholder:text-coffee-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !phone}
              className="btn-primary sm:w-auto w-full px-8 py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              {loading ? (
                <FiLoader className="animate-spin" size={20} />
              ) : (
                <FiSearch size={20} />
              )}
              <span className="heading-en tracking-wider text-sm">
                {loading ? 'Searching...' : 'Search'}
              </span>
            </button>
          </form>
        </div>

        {/* ===== Results Area ===== */}
        {searched && (
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

            {/* Empty State */}
            {reservations.length === 0 ? (
              <div className="card p-16 text-center border border-dashed border-coffee-200 bg-white/50 backdrop-blur-sm">
                <div className="w-20 h-20 mx-auto bg-coffee-50 rounded-full flex items-center justify-center mb-6">
                  <FiCoffee className="text-4xl text-coffee-300" />
                </div>
                <h3 className="text-xl font-bold text-coffee-800 mb-2">
                  ไม่พบข้อมูลการจอง
                </h3>
                <p className="text-coffee-500">
                  กรุณาตรวจสอบเบอร์โทรศัพท์อีกครั้ง หรืออาจยังไม่มีการทำรายการ
                </p>
                <Link href="/reservation" className="inline-block mt-6 text-accent hover:text-accent-dark font-medium underline-offset-4 hover:underline transition-all">
                  ไปที่หน้าจองโต๊ะ →
                </Link>
              </div>
            ) : (

              /* Result List */
              <>
                <div className="flex items-center justify-between px-2 mb-2">
                  <h3 className="text-lg font-semibold text-coffee-800">
                    รายการจองของคุณ
                  </h3>
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold heading-en tracking-wider">
                    {reservations.length} FOUND
                  </span>
                </div>

                {reservations.map((r) => {
                  const status = statusLabels[r.status] || statusLabels.pending;
                  return (
                    <div
                      key={r.id}
                      className="card p-6 md:p-8 hover:shadow-xl hover:shadow-coffee-900/5 transition-all duration-300 border border-transparent hover:border-coffee-100 group"
                    >
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-coffee-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-coffee-50 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                            <FiUsers size={20} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-coffee-800">
                              {r.customer_name}
                            </h3>
                            <p className="text-sm text-coffee-400 mt-0.5 heading-en tracking-wider">
                              ID: #{r.id?.toString().padStart(4, '0') || 'XXXX'}
                            </p>
                          </div>
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${status.class}`}>
                          <status.Icon className={status.iconClass} size={16} />
                          {status.label}
                        </div>
                      </div>

                      {/* Card Details (Grid) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-coffee-50/50 border border-coffee-50 transition-colors hover:border-coffee-100">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-accent">
                            <FiMapPin size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-coffee-400 mb-0.5">โซน/โต๊ะ</p>
                            <p className="font-semibold text-coffee-700">{r.tables?.name || 'รอจัดสรรโต๊ะ'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-coffee-50/50 border border-coffee-50 transition-colors hover:border-coffee-100">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-accent">
                            <FiCalendar size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-coffee-400 mb-0.5">วันที่</p>
                            <p className="font-semibold text-coffee-700">{r.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-coffee-50/50 border border-coffee-50 transition-colors hover:border-coffee-100">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-accent">
                            <FiClock size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-coffee-400 mb-0.5">เวลา</p>
                            <p className="font-semibold text-coffee-700">{r.time_slot} น.</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-coffee-50/50 border border-coffee-50 transition-colors hover:border-coffee-100">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-accent">
                            <FiUsers size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-coffee-400 mb-0.5">จำนวนลูกค้า</p>
                            <p className="font-semibold text-coffee-700">{r.guests} ท่าน</p>
                          </div>
                        </div>
                      </div>

                      {/* Note Section */}
                      {r.note && (
                        <div className="mt-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
                          <FiFileText className="text-amber-500 mt-1 flex-shrink-0" size={18} />
                          <div>
                            <p className="text-xs font-semibold text-amber-600 mb-1">หมายเหตุเพิ่มเติม:</p>
                            <p className="text-sm text-amber-800 leading-relaxed">{r.note}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}