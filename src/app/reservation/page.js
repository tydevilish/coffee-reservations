'use client';
import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUsers, FiUser, FiPhone, FiMail, FiMessageSquare, FiCheck, FiCoffee, FiStar, FiSun, FiLock, FiAlertTriangle } from 'react-icons/fi';

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

// Visual floor plan zones configuration
const zoneConfig = {
  window: { label: 'ริมหน้าต่าง', IconComponent: FiSun, color: 'from-amber-100 to-orange-100', borderColor: 'border-amber-300' },
  center: { label: 'กลางร้าน', IconComponent: FiCoffee, color: 'from-coffee-100 to-coffee-200', borderColor: 'border-coffee-300' },
  garden: { label: 'สวน', IconComponent: FiStar, color: 'from-green-100 to-emerald-100', borderColor: 'border-green-300' },
  private: { label: 'ห้องส่วนตัว', IconComponent: FiLock, color: 'from-purple-100 to-indigo-100', borderColor: 'border-purple-300' },
};

export default function ReservationPage() {
  const [step, setStep] = useState(1);
  const [tables, setTables] = useState([]);
  const [reservedTableIds, setReservedTableIds] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    date: '',
    time_slot: '',
    customer_name: '',
    phone: '',
    email: '',
    guests: 1,
    note: '',
  });

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  // Fetch tables
  useEffect(() => {
    fetchTables();
  }, []);

  // Fetch reserved tables when date/time changes
  useEffect(() => {
    if (form.date && form.time_slot) {
      fetchReservedTables();
    }
  }, [form.date, form.time_slot]);

  async function fetchTables() {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      setTables(data);
    } catch (err) {
      console.error('Failed to fetch tables:', err);
    }
  }

  async function fetchReservedTables() {
    try {
      const res = await fetch(`/api/reservations?date=${form.date}&time_slot=${form.time_slot}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const reserved = data
          .filter(r => r.status !== 'cancelled')
          .map(r => r.table_id);
        setReservedTableIds(reserved);
      }
    } catch (err) {
      console.error('Failed to fetch reserved tables:', err);
    }
  }

  function isTableAvailable(table) {
    return table.is_available && !reservedTableIds.includes(table.id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedTable) return;

    setLoading(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          table_id: selectedTable.id,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Failed to create reservation:', err);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 coffee-pattern pt-24">
        <div className="card max-w-md w-full text-center p-8 animate-fade-in-up">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-success text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-coffee-800 mb-3">จองสำเร็จ!</h2>
          <p className="text-coffee-500 mb-6">
            การจองของคุณอยู่ระหว่างรอการยืนยันจากร้าน
          </p>
          <div className="bg-coffee-50 rounded-xl p-4 text-left space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-coffee-400">โต๊ะ:</span>
              <span className="font-medium text-coffee-700">{selectedTable?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-coffee-400">วันที่:</span>
              <span className="font-medium text-coffee-700">{form.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-coffee-400">เวลา:</span>
              <span className="font-medium text-coffee-700">{form.time_slot} น.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-coffee-400">จำนวนคน:</span>
              <span className="font-medium text-coffee-700">{form.guests} คน</span>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="/reservation/status" className="btn-secondary flex-1 justify-center">
              เช็คสถานะ
            </a>
            <a href="/" className="btn-primary flex-1 justify-center">
              กลับหน้าแรก
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Group tables by zone
  const tablesByZone = tables.reduce((acc, table) => {
    const zone = table.zone || 'center';
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(table);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 coffee-pattern">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-accent font-medium text-sm tracking-widest uppercase">
            reservation
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-800 mt-3">
            จองโต๊ะ
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { num: 1, label: 'เลือกวัน-เวลา' },
            { num: 2, label: 'เลือกโต๊ะ' },
            { num: 3, label: 'กรอกข้อมูล' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                  step >= s.num ? 'opacity-100' : 'opacity-40'
                }`}
                onClick={() => {
                  if (s.num < step) setStep(s.num);
                }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step === s.num
                      ? 'bg-accent text-white scale-110 shadow-lg shadow-accent/30'
                      : step > s.num
                      ? 'bg-success text-white'
                      : 'bg-coffee-200 text-coffee-500'
                  }`}
                >
                  {step > s.num ? <FiCheck /> : s.num}
                </div>
                <span
                  className={`hidden sm:block text-sm font-medium ${
                    step === s.num ? 'text-coffee-800' : 'text-coffee-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={`w-12 h-0.5 rounded-full transition-all duration-300 ${
                    step > s.num ? 'bg-success' : 'bg-coffee-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="max-w-xl mx-auto card p-8 animate-fade-in-up">
            <h2 className="text-xl font-semibold text-coffee-800 mb-6 flex items-center gap-2">
              <FiCalendar className="text-accent" />
              เลือกวันที่และเวลา
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-2">
                  วันที่
                </label>
                <input
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-2">
                  เวลา
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setForm({ ...form, time_slot: time })}
                      className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        form.time_slot === time
                          ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                          : 'bg-coffee-50 text-coffee-600 hover:bg-coffee-100 hover:scale-102'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-2">
                  จำนวนผู้เข้าร่วม
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })}
                    className="w-10 h-10 rounded-full bg-coffee-100 text-coffee-600 flex items-center justify-center hover:bg-coffee-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-coffee-800 w-12 text-center">
                    {form.guests}
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, guests: Math.min(20, form.guests + 1) })}
                    className="w-10 h-10 rounded-full bg-coffee-100 text-coffee-600 flex items-center justify-center hover:bg-coffee-200 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-coffee-400 text-sm">คน</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => step === 1 && form.date && form.time_slot && setStep(2)}
                disabled={!form.date || !form.time_slot}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                เลือกโต๊ะ →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Table Selection - Visual Floor Plan */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <p className="text-coffee-500 flex items-center justify-center gap-3">
                <FiCalendar className="text-accent" /> {form.date}
                <span className="text-coffee-300">|</span>
                <FiClock className="text-accent" /> {form.time_slot} น.
                <span className="text-coffee-300">|</span>
                <FiUser className="text-accent" /> {form.guests} คน
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-success/80 to-success" />
                <span className="text-coffee-500">ว่าง</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-accent animate-pulse-glow" />
                <span className="text-coffee-500">เลือกอยู่</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-coffee-300 opacity-50" />
                <span className="text-coffee-500">ไม่ว่าง</span>
              </div>
            </div>

            {/* Floor Plan */}
            <div className="relative bg-white rounded-3xl border-2 border-coffee-200 p-6 md:p-10 overflow-hidden shadow-lg">
              {/* Floor plan header - shop entrance */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-coffee-700 text-white px-8 py-2 rounded-b-xl text-sm font-medium flex items-center gap-2">
                <FiCoffee /> ทางเข้าร้าน
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-10">
                <FiCoffee className="text-4xl text-coffee-600" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-10">
                <FiStar className="text-4xl text-coffee-600" />
              </div>

              <div className="mt-8 space-y-8">
                {Object.entries(zoneConfig).map(([zoneKey, zoneInfo]) => {
                  const zoneTables = tablesByZone[zoneKey] || [];
                  if (zoneTables.length === 0) return null;

                  return (
                    <div key={zoneKey} className="relative">
                      {/* Zone label */}
                      <div className="flex items-center gap-2 mb-4">
                        <zoneInfo.IconComponent className="text-xl text-coffee-500" />
                        <h3 className="text-sm font-semibold text-coffee-600 uppercase tracking-wider">
                          {zoneInfo.label}
                        </h3>
                        <div className="flex-1 h-px bg-coffee-200" />
                      </div>

                      {/* Tables grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {zoneTables.map((table) => {
                          const available = isTableAvailable(table);
                          const isSelected = selectedTable?.id === table.id;
                          const suitableForGuests = table.seats >= form.guests;

                          return (
                            <button
                              key={table.id}
                              type="button"
                              disabled={!available}
                              onClick={() => {
                                if (available) {
                                  setSelectedTable(isSelected ? null : table);
                                }
                              }}
                              className={`relative group rounded-2xl p-4 transition-all duration-300 border-2 ${
                                isSelected
                                  ? 'bg-gradient-to-br from-accent/10 to-accent/20 border-accent shadow-lg shadow-accent/20 scale-105'
                                  : available
                                  ? `bg-gradient-to-br ${zoneInfo.color} ${zoneInfo.borderColor} hover:scale-105 hover:shadow-md cursor-pointer`
                                  : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              {/* Table visual - top view */}
                              <div className="flex flex-col items-center">
                                {/* Table shape */}
                                <div
                                  className={`relative w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    isSelected
                                      ? 'bg-accent text-white animate-pulse-glow'
                                      : available
                                      ? 'bg-white/80 text-coffee-600 group-hover:bg-white'
                                      : 'bg-gray-200 text-gray-400'
                                  }`}
                                >
                                  {/* Chair indicators */}
                                  {Array.from({ length: Math.min(table.seats, 6) }).map((_, i) => {
                                    const angle = (360 / Math.min(table.seats, 6)) * i - 90;
                                    const rad = (angle * Math.PI) / 180;
                                    const x = Math.cos(rad) * 32;
                                    const y = Math.sin(rad) * 32;
                                    return (
                                      <div
                                        key={i}
                                        className={`absolute w-3 h-3 rounded-full transition-all duration-300 ${
                                          isSelected
                                            ? 'bg-accent/60'
                                            : available
                                            ? 'bg-coffee-300/60 group-hover:bg-coffee-400/60'
                                            : 'bg-gray-300'
                                        }`}
                                        style={{
                                          transform: `translate(${x}px, ${y}px)`,
                                        }}
                                      />
                                    );
                                  })}

                                  {/* Table icon/seats number */}
                                  <span className="text-lg font-bold">{table.seats}</span>
                                </div>

                                {/* Table name */}
                                <div className="mt-3 text-center">
                                  <p
                                    className={`text-xs font-semibold ${
                                      isSelected ? 'text-accent' : available ? 'text-coffee-700' : 'text-gray-400'
                                    }`}
                                  >
                                    {table.name}
                                  </p>
                                  <p
                                    className={`text-[10px] mt-0.5 ${
                                      isSelected ? 'text-accent/70' : available ? 'text-coffee-400' : 'text-gray-300'
                                    }`}
                                  >
                                    {table.seats} ที่นั่ง
                                  </p>
                                </div>

                                {/* Status indicator */}
                                {isSelected && (
                                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-lg">
                                    <FiCheck className="text-white text-xs" />
                                  </div>
                                )}

                                {!available && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-danger/80 text-white text-[10px] px-2 py-1 rounded-full font-medium">
                                      จองแล้ว
                                    </div>
                                  </div>
                                )}

                                {available && !suitableForGuests && (
                                  <div className="absolute -top-2 -left-2">
                                    <div className="bg-warning text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium flex items-center">
                                      <FiAlertTriangle className="text-[8px]" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {tables.length === 0 && (
                <div className="text-center py-16 text-coffee-400">
                  <FiCoffee className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>กำลังโหลดข้อมูลโต๊ะ...</p>
                </div>
              )}
            </div>

            {/* Selected table info */}
            {selectedTable && (
              <div className="mt-6 card p-6 bg-accent/5 border-accent/20 animate-fade-in-up">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                      <FiStar className="text-accent text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-coffee-800">{selectedTable.name}</h3>
                      <p className="text-sm text-coffee-500">
                        {selectedTable.seats} ที่นั่ง • โซน{zoneConfig[selectedTable.zone]?.label || selectedTable.zone}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-primary"
                  >
                    ยืนยันเลือกโต๊ะนี้ →
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                ← ย้อนกลับ
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Customer Info Form */}
        {step === 3 && (
          <div className="max-w-xl mx-auto card p-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <FiUser className="text-accent text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-coffee-800">กรอกข้อมูลผู้จอง</h2>
                <p className="text-sm text-coffee-400">
                  {selectedTable?.name} • {form.date} • {form.time_slot} น.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-2">
                  <FiUser className="inline mr-1" /> ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="input-field"
                  placeholder="ชื่อ-นามสกุลของคุณ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-2">
                  <FiPhone className="inline mr-1" /> เบอร์โทรศัพท์ *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                  placeholder="08X-XXX-XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-2">
                  <FiMail className="inline mr-1" /> อีเมล
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-600 mb-2">
                  <FiMessageSquare className="inline mr-1" /> หมายเหตุ
                </label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                  className="input-field"
                  placeholder="เช่น ต้องการเก้าอี้เด็ก, มีแพ้อาหาร ฯลฯ"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-secondary flex-1 justify-center"
                >
                  ← ย้อนกลับ
                </button>
                <button
                  type="submit"
                  disabled={loading || !form.customer_name || !form.phone}
                  className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'กำลังจอง...' : <><FiCheck className="inline mr-1" /> ยืนยันการจอง</>}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
