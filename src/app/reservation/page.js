'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiCalendar, FiClock, FiUsers, FiUser, FiPhone, FiMail,
  FiMessageSquare, FiCheck, FiCoffee, FiStar, FiSun, FiLock,
  FiAlertTriangle, FiArrowLeft, FiMapPin, FiArrowRight
} from 'react-icons/fi';

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

// Visual floor plan zones configuration
const zoneConfig = {
  window: { label: 'ริมหน้าต่าง', labelEn: 'Window', IconComponent: FiSun, color: 'from-amber-50 to-orange-50', borderColor: 'border-amber-200' },
  center: { label: 'กลางร้าน', labelEn: 'Center', IconComponent: FiCoffee, color: 'from-coffee-50 to-coffee-100', borderColor: 'border-coffee-200' },
  garden: { label: 'โซนสวน', labelEn: 'Garden', IconComponent: FiStar, color: 'from-emerald-50 to-teal-50', borderColor: 'border-emerald-200' },
  private: { label: 'ห้องส่วนตัว', labelEn: 'Private', IconComponent: FiLock, color: 'from-indigo-50 to-purple-50', borderColor: 'border-indigo-200' },
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

  useEffect(() => {
    fetchTables();
  }, []);

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

  // ===== SUCCESS STATE =====
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 coffee-pattern relative pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 pointer-events-none" />
        <div className="card max-w-lg w-full text-center p-8 md:p-12 animate-fade-in-up relative z-10 shadow-2xl shadow-coffee-900/10">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-white">
            <FiCheck className="text-emerald-500 text-5xl animate-[scale-in_0.5s_ease-out]" />
          </div>
          <span className="heading-en text-accent text-sm tracking-[0.3em] uppercase">
            Success
          </span>
          <h2 className="text-3xl font-bold text-coffee-800 mt-2 mb-3">จองโต๊ะสำเร็จ!</h2>
          <p className="text-coffee-500 mb-8 leading-relaxed">
            ระบบได้รับข้อมูลการจองของคุณเรียบร้อยแล้ว<br /> กรุณารอรับการยืนยันสถานะจากทางร้าน
          </p>

          <div className="bg-coffee-50/80 rounded-2xl p-6 text-left space-y-4 text-sm mb-10 border border-coffee-100">
            <div className="flex items-center justify-between pb-4 border-b border-coffee-200/50">
              <span className="text-coffee-400 flex items-center gap-2"><FiMapPin className="text-accent" /> โต๊ะ</span>
              <span className="font-bold text-coffee-800 text-base">{selectedTable?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-coffee-400 flex items-center gap-2"><FiCalendar className="text-accent" /> วันที่</span>
              <span className="font-medium text-coffee-700">{form.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-coffee-400 flex items-center gap-2"><FiClock className="text-accent" /> เวลา</span>
              <span className="font-medium text-coffee-700">{form.time_slot} น.</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-coffee-400 flex items-center gap-2"><FiUsers className="text-accent" /> จำนวนคน</span>
              <span className="font-medium text-coffee-700">{form.guests} ท่าน</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/reservation/status" className="btn-primary flex-1 justify-center py-4 rounded-2xl">
              เช็คสถานะการจอง
            </Link>
            <Link href="/" className="btn-secondary flex-1 justify-center py-4 rounded-2xl bg-white hover:bg-coffee-50">
              กลับหน้าแรก
            </Link>
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

  // ===== MAIN RESERVATION WIZARD =====
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 coffee-pattern relative">
      <div className="max-w-5xl mx-auto relative z-10">


        {/* Header */}
        <div className="text-center mb-14 animate-fade-in-up">
          <span className="heading-en text-accent text-sm tracking-[0.3em] uppercase">
            Book a Table
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-800 mt-4 mb-4">
            จอง<span className="text-gradient">โต๊ะ</span>
          </h1>
          <p className="font-serif-en text-coffee-400 text-base md:text-lg max-w-md mx-auto">
            Select your preferred date, time, and the perfect spot.
          </p>
          <div className="divider-accent mx-auto mt-6" />
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          {[
            { num: 1, label: 'วัน-เวลา' },
            { num: 2, label: 'เลือกโต๊ะ' },
            { num: 3, label: 'ข้อมูลผู้จอง' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div
                className={`flex flex-col items-center gap-3 relative z-10 transition-all duration-500 ${step >= s.num ? 'opacity-100' : 'opacity-50 grayscale'}`}
                onClick={() => { if (s.num < step) setStep(s.num); }}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 cursor-pointer 
                    ${step === s.num
                      ? 'bg-accent text-white scale-110 shadow-xl shadow-accent/40 ring-4 ring-accent/20'
                      : step > s.num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white border-2 border-coffee-200 text-coffee-400'
                    }`}
                >
                  {step > s.num ? <FiCheck size={20} /> : s.num}
                </div>
                <span className={`absolute -bottom-7 whitespace-nowrap text-xs md:text-sm font-medium transition-colors duration-300
                  ${step === s.num ? 'text-coffee-800' : 'text-coffee-400'}`}
                >
                  {s.label}
                </span>
              </div>
              {/* Connector Line */}
              {i < 2 && (
                <div className="flex-1 h-1 mx-4 rounded-full bg-coffee-100 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-700 ease-in-out"
                    style={{ width: step > s.num ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ============================== */}
        {/* STEP 1: Date, Time & Guests */}
        {/* ============================== */}
        {step === 1 && (
          <div className="max-w-xl mx-auto card p-6 md:p-10 animate-fade-in-up shadow-xl shadow-coffee-900/5">
            <h2 className="text-2xl font-bold text-coffee-800 mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <FiCalendar />
              </span>
              เลือกวันที่และเวลา
            </h2>

            <div className="space-y-8">
              {/* Date Input */}
              <div>
                <label className="block text-sm font-semibold text-coffee-700 mb-3">วันที่ต้องการจอง</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-coffee-400 pointer-events-none">
                    <FiCalendar size={20} />
                  </div>
                  <input
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-white border border-coffee-200 hover:border-accent focus:border-accent focus:ring-1 focus:ring-accent outline-none rounded-2xl py-4 pl-14 pr-6 text-coffee-800 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-semibold text-coffee-700 mb-3 flex items-center gap-2">
                  เวลา <span className="text-xs font-normal text-coffee-400 ml-auto">(เลือกเวลาที่ต้องการ)</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setForm({ ...form, time_slot: time })}
                      className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-300 border ${form.time_slot === time
                          ? 'bg-accent text-white border-accent shadow-lg shadow-accent/30 scale-105'
                          : 'bg-white border-coffee-100 text-coffee-600 hover:border-accent/50 hover:bg-accent/5'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Counter */}
              <div>
                <label className="block text-sm font-semibold text-coffee-700 mb-3">จำนวนผู้เข้าร่วม</label>
                <div className="flex items-center p-2 bg-coffee-50 border border-coffee-100 rounded-2xl w-fit">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })}
                    className="w-12 h-12 rounded-xl bg-white shadow-sm text-coffee-600 flex items-center justify-center hover:text-accent transition-colors text-xl font-medium"
                  >
                    -
                  </button>
                  <div className="flex flex-col items-center justify-center w-20">
                    <span className="text-2xl font-bold text-coffee-800 leading-none">{form.guests}</span>
                    <span className="text-[10px] text-coffee-400 uppercase tracking-wider mt-1 heading-en">Persons</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, guests: Math.min(20, form.guests + 1) })}
                    className="w-12 h-12 rounded-xl bg-white shadow-sm text-coffee-600 flex items-center justify-center hover:text-accent transition-colors text-xl font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => step === 1 && form.date && form.time_slot && setStep(2)}
                  disabled={!form.date || !form.time_slot}
                  className="btn-primary w-full justify-center py-4 rounded-2xl text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป: เลือกโต๊ะ <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* STEP 2: Floor Plan */}
        {/* ============================== */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            {/* Info Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 mb-10 bg-white border border-coffee-100 py-3 px-6 rounded-full shadow-sm max-w-fit mx-auto text-sm">
              <span className="flex items-center gap-2 text-coffee-700 font-medium">
                <FiCalendar className="text-accent" /> {form.date}
              </span>
              <span className="hidden md:inline text-coffee-200">|</span>
              <span className="flex items-center gap-2 text-coffee-700 font-medium">
                <FiClock className="text-accent" /> {form.time_slot} น.
              </span>
              <span className="hidden md:inline text-coffee-200">|</span>
              <span className="flex items-center gap-2 text-coffee-700 font-medium">
                <FiUser className="text-accent" /> {form.guests} คน
              </span>
              <button onClick={() => setStep(1)} className="ml-2 text-accent text-xs underline hover:text-accent-dark">แก้ไข</button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-full border border-coffee-100 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-coffee-300" />
                <span className="text-coffee-600 font-medium">ว่าง</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-accent/5 px-4 py-2 rounded-full border border-accent/20 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                <span className="text-accent font-medium">โต๊ะที่คุณเลือก</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-gray-50 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <span className="text-gray-500 font-medium">ไม่ว่าง</span>
              </div>
            </div>

            {/* Floor Plan Container */}
            <div className="relative bg-white rounded-3xl border border-coffee-200 p-6 md:p-12 overflow-hidden shadow-2xl shadow-coffee-900/5">

              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-coffee-800 text-white px-8 py-2 rounded-b-2xl text-sm font-medium flex items-center gap-2 tracking-widest heading-en shadow-md">
                ENTRANCE
              </div>

              {/* Decor */}
              <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none">
                <FiCoffee className="text-9xl text-coffee-900" />
              </div>

              <div className="mt-10 space-y-12">
                {Object.entries(zoneConfig).map(([zoneKey, zoneInfo]) => {
                  const zoneTables = tablesByZone[zoneKey] || [];
                  if (zoneTables.length === 0) return null;

                  return (
                    <div key={zoneKey} className="relative z-10">
                      {/* Zone Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${zoneInfo.color} ${zoneInfo.borderColor} border`}>
                          <zoneInfo.IconComponent className="text-xl text-coffee-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-coffee-800 leading-none mb-1">
                            {zoneInfo.label}
                          </h3>
                          <p className="heading-en text-[10px] text-coffee-400 tracking-widest uppercase">{zoneInfo.labelEn} Zone</p>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-coffee-200 to-transparent ml-4" />
                      </div>

                      {/* Tables Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
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
                              className={`relative group rounded-3xl p-5 transition-all duration-300 border-2 ${isSelected
                                  ? 'bg-accent/5 border-accent shadow-xl shadow-accent/10 scale-[1.02]'
                                  : available
                                    ? `bg-white ${zoneInfo.borderColor} hover:border-accent/40 hover:shadow-md hover:-translate-y-1 cursor-pointer`
                                    : 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
                                }`}
                            >
                              <div className="flex flex-col items-center">
                                {/* Table Shape */}
                                <div
                                  className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner ${isSelected
                                      ? 'bg-accent text-white'
                                      : available
                                        ? 'bg-coffee-50 text-coffee-600 group-hover:bg-coffee-100'
                                        : 'bg-gray-200 text-gray-400'
                                    }`}
                                >
                                  {/* Chairs */}
                                  {Array.from({ length: Math.min(table.seats, 8) }).map((_, i) => {
                                    const angle = (360 / Math.min(table.seats, 8)) * i - 90;
                                    const rad = (angle * Math.PI) / 180;
                                    const x = Math.cos(rad) * 36;
                                    const y = Math.sin(rad) * 36;
                                    return (
                                      <div
                                        key={i}
                                        className={`absolute w-3 h-3 rounded-full transition-all duration-300 ${isSelected
                                            ? 'bg-accent/40 border border-accent/60'
                                            : available
                                              ? 'bg-white border border-coffee-200 group-hover:border-coffee-300'
                                              : 'bg-gray-300'
                                          }`}
                                        style={{ transform: `translate(${x}px, ${y}px)` }}
                                      />
                                    );
                                  })}
                                  <span className="text-xl font-bold font-serif-en">{table.seats}</span>
                                </div>

                                <div className="mt-5 text-center">
                                  <p className={`text-sm font-bold ${isSelected ? 'text-accent' : available ? 'text-coffee-800' : 'text-gray-400'}`}>
                                    {table.name}
                                  </p>
                                </div>

                                {/* Status Badges */}
                                {isSelected && (
                                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce-slight">
                                    <FiCheck className="text-white text-sm" />
                                  </div>
                                )}

                                {!available && (
                                  <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/40 backdrop-blur-[1px]">
                                    <div className="bg-gray-800 text-white text-[10px] px-3 py-1.5 rounded-full font-medium tracking-wider shadow-sm">
                                      RESERVED
                                    </div>
                                  </div>
                                )}

                                {available && !suitableForGuests && (
                                  <div className="absolute top-2 left-2">
                                    <div className="bg-amber-100 text-amber-600 border border-amber-200 p-1.5 rounded-full shadow-sm group-hover:bg-amber-200 transition-colors" title="ที่นั่งอาจไม่พอสำหรับจำนวนคน">
                                      <FiAlertTriangle size={12} />
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
                <div className="text-center py-20">
                  <FiCoffee className="text-5xl text-coffee-200 mx-auto mb-4 animate-pulse" />
                  <p className="text-coffee-400 font-medium">กำลังโหลดข้อมูลแผนผังร้าน...</p>
                </div>
              )}
            </div>

            {/* Selected table Action Bar */}
            {selectedTable && (
              <div className="mt-8 bg-white border border-accent/20 rounded-2xl p-4 md:p-6 shadow-xl shadow-accent/5 flex items-center justify-between flex-wrap gap-4 animate-fade-in-up sticky bottom-6 z-20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                    <FiCheck className="text-accent text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs text-coffee-400 mb-0.5">คุณเลือกโต๊ะ</p>
                    <h3 className="text-xl font-bold text-coffee-800 leading-none mb-1">{selectedTable.name}</h3>
                    <p className="text-sm text-coffee-500">
                      {selectedTable.seats} ที่นั่ง • โซน{zoneConfig[selectedTable.zone]?.label}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 sm:flex-none justify-center">
                    ย้อนกลับ
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1 sm:flex-none justify-center px-8">
                    ยืนยันโต๊ะนี้ <FiArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
            )}
            {!selectedTable && (
              <div className="mt-6 flex justify-start">
                <button type="button" onClick={() => setStep(1)} className="text-coffee-500 hover:text-accent font-medium flex items-center gap-2 transition-colors">
                  <FiArrowLeft /> ย้อนกลับไปเลือกเวลา
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================== */}
        {/* STEP 3: Customer Details */}
        {/* ============================== */}
        {step === 3 && (
          <div className="max-w-xl mx-auto card p-6 md:p-10 animate-fade-in-up shadow-xl shadow-coffee-900/5">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-coffee-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-dark text-white flex items-center justify-center shadow-md">
                <FiUser size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-coffee-800 mb-1">ข้อมูลผู้จอง</h2>
                <p className="text-sm text-coffee-500 flex flex-wrap gap-2 items-center">
                  <span className="font-semibold text-accent">{selectedTable?.name}</span> •
                  <span>{form.date}</span> •
                  <span>{form.time_slot} น.</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-coffee-700 mb-2">ชื่อ-นามสกุล <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-coffee-400">
                    <FiUser size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    className="w-full bg-white border border-coffee-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none rounded-2xl py-4 pl-14 pr-6 text-coffee-800 transition-all placeholder:text-coffee-300"
                    placeholder="กรุณากรอกชื่อของคุณ"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-coffee-700 mb-2">เบอร์โทรศัพท์ <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-coffee-400">
                    <FiPhone size={18} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white border border-coffee-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none rounded-2xl py-4 pl-14 pr-6 text-coffee-800 transition-all placeholder:text-coffee-300"
                    placeholder="08X-XXX-XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-coffee-700 mb-2">อีเมล <span className="text-coffee-400 font-normal text-xs">(ไม่บังคับ)</span></label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-coffee-400">
                    <FiMail size={18} />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white border border-coffee-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none rounded-2xl py-4 pl-14 pr-6 text-coffee-800 transition-all placeholder:text-coffee-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-coffee-700 mb-2">หมายเหตุเพิ่มเติม <span className="text-coffee-400 font-normal text-xs">(ไม่บังคับ)</span></label>
                <div className="relative">
                  <div className="absolute left-5 top-5 text-coffee-400">
                    <FiMessageSquare size={18} />
                  </div>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    rows={3}
                    className="w-full bg-white border border-coffee-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none rounded-2xl py-4 pl-14 pr-6 text-coffee-800 transition-all placeholder:text-coffee-300 resize-none"
                    placeholder="เช่น ต้องการเก้าอี้เด็ก, มีผู้ใช้วีลแชร์ ฯลฯ"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6 mt-2 border-t border-coffee-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-secondary py-4 px-6 rounded-2xl justify-center"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  disabled={loading || !form.customer_name || !form.phone}
                  className="btn-primary flex-1 py-4 rounded-2xl justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'กำลังดำเนินการ...'
                  ) : (
                    <>ยืนยันการจอง <FiCheck className="ml-1" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}