'use client';
import { useState } from 'react';
import { FiSearch, FiClock, FiCalendar, FiUsers, FiMapPin, FiPhone, FiLoader, FiCheckCircle, FiXCircle, FiFileText, FiCoffee } from 'react-icons/fi';

const statusLabels = {
  pending: { label: 'รอยืนยัน', class: 'badge-warning', Icon: FiLoader },
  confirmed: { label: 'ยืนยันแล้ว', class: 'badge-success', Icon: FiCheckCircle },
  cancelled: { label: 'ยกเลิก', class: 'badge-danger', Icon: FiXCircle },
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
    <div className="min-h-screen pt-24 pb-16 px-6 coffee-pattern">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-accent font-medium text-sm tracking-widest uppercase">
            status
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-800 mt-3">
            เช็คสถานะการจอง
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Search Form */}
        <div className="card p-8 mb-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-300" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="กรอกเบอร์โทรที่ใช้จอง"
                className="input-field pl-11"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !phone}
              className="btn-primary disabled:opacity-50"
            >
              <FiSearch /> ค้นหา
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-4 animate-fade-in-up">
            {reservations.length === 0 ? (
              <div className="card p-12 text-center">
                <FiCoffee className="text-5xl text-coffee-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-coffee-700 mb-2">
                  ไม่พบข้อมูลการจอง
                </h3>
                <p className="text-coffee-400 text-sm">
                  กรุณาตรวจสอบเบอร์โทรศัพท์แล้วลองใหม่อีกครั้ง
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-coffee-500 mb-4">
                  พบ {reservations.length} รายการ
                </p>
                {reservations.map((r) => {
                  const status = statusLabels[r.status] || statusLabels.pending;
                  return (
                    <div key={r.id} className="card p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-coffee-800">
                            {r.customer_name}
                          </h3>
                          <span className={`badge ${status.class} mt-1`}>
                            <status.Icon className="inline mr-1" /> {status.label}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-coffee-500">
                          <FiMapPin className="text-accent flex-shrink-0" />
                          <span>{r.tables?.name || 'โต๊ะ'}</span>
                        </div>
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
                      </div>

                      {r.note && (
                        <div className="mt-3 text-sm text-coffee-400 bg-coffee-50 rounded-lg p-3 flex items-start gap-2">
                          <FiFileText className="text-accent flex-shrink-0 mt-0.5" /> {r.note}
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
