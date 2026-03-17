'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiCheck, FiX, FiCoffee } from 'react-icons/fi';

const zones = [
  { value: 'window', label: 'ริมหน้าต่าง' },
  { value: 'center', label: 'กลางร้าน' },
  { value: 'garden', label: 'สวน' },
  { value: 'private', label: 'ห้องส่วนตัว' },
];

export default function AdminTablesPage() {
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [form, setForm] = useState({ name: '', seats: 2, zone: 'center', is_available: true });

  useEffect(() => {
    const stored = localStorage.getItem('admin');
    if (!stored) {
      router.push('/admin/login');
      return;
    }
    fetchTables();
  }, []);

  async function fetchTables() {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      setTables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch tables:', err);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (editingTable) {
        await fetch('/api/tables', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingTable.id, ...form }),
        });
      } else {
        await fetch('/api/tables', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      resetForm();
      fetchTables();
    } catch (err) {
      console.error('Failed to save table:', err);
    }
  }

  async function handleDelete(id) {
    if (!confirm('ยืนยันการลบโต๊ะนี้?')) return;
    try {
      await fetch(`/api/tables?id=${id}`, { method: 'DELETE' });
      fetchTables();
    } catch (err) {
      console.error('Failed to delete table:', err);
    }
  }

  async function toggleAvailable(table) {
    try {
      await fetch('/api/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: table.id, is_available: !table.is_available }),
      });
      fetchTables();
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  }

  function startEdit(table) {
    setEditingTable(table);
    setForm({ name: table.name, seats: table.seats, zone: table.zone, is_available: table.is_available });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingTable(null);
    setForm({ name: '', seats: 2, zone: 'center', is_available: true });
  }

  const zoneLabels = { window: 'ริมหน้าต่าง', center: 'กลางร้าน', garden: 'สวน', private: 'ห้องส่วนตัว' };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 coffee-pattern">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-coffee-400 hover:text-accent transition-colors">
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-coffee-800">จัดการโต๊ะ</h1>
              <p className="text-coffee-400 text-sm">{tables.length} โต๊ะ</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary text-sm"
          >
            <FiPlus /> เพิ่มโต๊ะ
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee-900/50 backdrop-blur-sm p-6">
            <div className="card max-w-md w-full p-8 animate-fade-in-up">
              <h2 className="text-lg font-semibold text-coffee-800 mb-6">
                {editingTable ? 'แก้ไขโต๊ะ' : 'เพิ่มโต๊ะใหม่'}
              </h2>
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-2">ชื่อโต๊ะ</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="เช่น T1, A-01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-2">จำนวนที่นั่ง</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-2">โซน</label>
                  <select
                    value={form.zone}
                    onChange={(e) => setForm({ ...form, zone: e.target.value })}
                    className="input-field"
                  >
                    {zones.map((z) => (
                      <option key={z.value} value={z.value}>{z.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.is_available}
                    onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                    id="available"
                    className="w-5 h-5 accent-accent"
                  />
                  <label htmlFor="available" className="text-sm text-coffee-600">พร้อมใช้งาน</label>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={resetForm} className="btn-secondary flex-1 justify-center">
                    ยกเลิก
                  </button>
                  <button type="submit" className="btn-primary flex-1 justify-center">
                    {editingTable ? 'อัปเดต' : 'เพิ่มโต๊ะ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tables List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div key={table.id} className="card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                    table.is_available
                      ? 'bg-success/10 text-success'
                      : 'bg-danger/10 text-danger'
                  }`}>
                    {table.seats}
                  </div>
                  <div>
                    <h3 className="font-semibold text-coffee-800">{table.name}</h3>
                    <p className="text-xs text-coffee-400">{zoneLabels[table.zone] || table.zone}</p>
                  </div>
                </div>
                <div className={`badge ${table.is_available ? 'badge-success' : 'badge-danger'}`}>
                  {table.is_available ? 'ว่าง' : 'ปิดใช้'}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-coffee-100">
                <button
                  onClick={() => toggleAvailable(table)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    table.is_available
                      ? 'bg-danger/10 text-danger hover:bg-danger/20'
                      : 'bg-success/10 text-success hover:bg-success/20'
                  }`}
                >
                  {table.is_available ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                </button>
                <button onClick={() => startEdit(table)} className="text-xs px-3 py-1.5 rounded-lg bg-coffee-100 text-coffee-600 hover:bg-coffee-200 transition-colors">
                  <FiEdit2 className="inline mr-1" /> แก้ไข
                </button>
                <button onClick={() => handleDelete(table.id)} className="text-xs px-3 py-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors">
                  <FiTrash2 className="inline mr-1" /> ลบ
                </button>
              </div>
            </div>
          ))}
        </div>

        {tables.length === 0 && (
          <div className="card p-12 text-center">
            <FiCoffee className="text-4xl text-coffee-300 mx-auto mb-4" />
            <p className="text-coffee-400">ยังไม่มีโต๊ะ กดปุ่ม &quot;เพิ่มโต๊ะ&quot; เพื่อเริ่มต้น</p>
          </div>
        )}
      </div>
    </div>
  );
}
