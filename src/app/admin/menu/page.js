'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiCoffee, FiStar, FiDollarSign, FiImage } from 'react-icons/fi';

const categories = [
  { value: 'coffee', label: 'กาแฟ' },
  { value: 'non-coffee', label: 'เครื่องดื่มอื่น' },
  { value: 'bakery', label: 'เบเกอรี่' },
];

export default function AdminMenuPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    image_url: '',
    is_available: true,
    is_recommended: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem('admin');
    if (!stored) {
      router.push('/admin/login');
      return;
    }
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch menu items:', err);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (editingItem) {
        await fetch('/api/menu', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        });
      } else {
        await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      fetchItems();
    } catch (err) {
      console.error('Failed to save item:', err);
    }
  }

  async function handleDelete(id) {
    if (!confirm('ยืนยันการลบเมนูนี้?')) return;
    try {
      await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  }

  async function toggleAvailable(item) {
    try {
      await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_available: !item.is_available }),
      });
      fetchItems();
    } catch (err) {
      console.error('Failed to toggle:', err);
    }
  }

  async function toggleRecommended(item) {
    try {
      await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_recommended: !item.is_recommended }),
      });
      fetchItems();
    } catch (err) {
      console.error('Failed to toggle:', err);
    }
  }

  function startEdit(item) {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url || '',
      is_available: item.is_available,
      is_recommended: item.is_recommended,
    });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingItem(null);
    setForm({ name: '', description: '', price: '', category: 'coffee', image_url: '', is_available: true, is_recommended: false });
  }

  const filtered = filterCategory === 'all' ? items : items.filter((i) => i.category === filterCategory);
  const categoryLabels = { coffee: 'กาแฟ', 'non-coffee': 'เครื่องดื่มอื่น', bakery: 'เบเกอรี่' };

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
              <h1 className="text-2xl font-bold text-coffee-800">จัดการเมนู</h1>
              <p className="text-coffee-400 text-sm">{items.length} รายการ</p>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="btn-primary text-sm"
          >
            <FiPlus /> เพิ่มเมนู
          </button>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', ...categories.map((c) => c.value)].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-accent text-white'
                  : 'bg-white text-coffee-600 border border-coffee-200 hover:border-accent/40'
              }`}
            >
              {cat === 'all' ? 'ทั้งหมด' : categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee-900/50 backdrop-blur-sm p-6">
            <div className="card max-w-md w-full p-8 animate-fade-in-up max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold text-coffee-800 mb-6">
                {editingItem ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-2">ชื่อเมนู</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="เช่น Espresso, Latte"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-2">คำอธิบาย</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="รายละเอียดเมนู"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-2">ราคา (บาท)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-2">หมวดหมู่</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-600 mb-2"><FiImage className="inline mr-1" /> URL รูปภาพ</label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="input-field"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {form.image_url && (
                    <div className="mt-2 rounded-xl overflow-hidden h-32">
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-coffee-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_available}
                      onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                      className="w-5 h-5 accent-accent"
                    />
                    พร้อมจำหน่าย
                  </label>
                  <label className="flex items-center gap-2 text-sm text-coffee-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_recommended}
                      onChange={(e) => setForm({ ...form, is_recommended: e.target.checked })}
                      className="w-5 h-5 accent-accent"
                    />
                    แนะนำ
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={resetForm} className="btn-secondary flex-1 justify-center">
                    ยกเลิก
                  </button>
                  <button type="submit" className="btn-primary flex-1 justify-center">
                    {editingItem ? 'อัปเดต' : 'เพิ่มเมนู'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden ${!item.image_url ? (item.is_available ? 'bg-accent/10' : 'bg-coffee-100') : ''}`}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-lg ${item.is_available ? 'text-accent' : 'text-coffee-300'}`}>
                        <FiCoffee />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-coffee-800 truncate">{item.name}</h3>
                    <p className="text-xs text-coffee-400">{categoryLabels[item.category]}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="font-bold text-accent">{item.price} .-</p>
                  <div className="flex gap-1 mt-1">
                    {item.is_recommended && (
                      <span className="badge badge-warning text-[10px] px-1.5">
                        <FiStar className="inline text-[8px]" /> แนะนำ
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {item.description && (
                <p className="text-xs text-coffee-400 mb-3 line-clamp-2">{item.description}</p>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-coffee-100 flex-wrap">
                <button
                  onClick={() => toggleAvailable(item)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    item.is_available
                      ? 'bg-danger/10 text-danger hover:bg-danger/20'
                      : 'bg-success/10 text-success hover:bg-success/20'
                  }`}
                >
                  {item.is_available ? 'ปิดจำหน่าย' : 'เปิดจำหน่าย'}
                </button>
                <button
                  onClick={() => toggleRecommended(item)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    item.is_recommended
                      ? 'bg-warning/20 text-warning hover:bg-warning/30'
                      : 'bg-coffee-100 text-coffee-500 hover:bg-coffee-200'
                  }`}
                >
                  <FiStar className="inline mr-1" />
                  {item.is_recommended ? 'ยกเลิกแนะนำ' : 'ตั้งเป็นแนะนำ'}
                </button>
                <button onClick={() => startEdit(item)} className="text-xs px-3 py-1.5 rounded-lg bg-coffee-100 text-coffee-600 hover:bg-coffee-200 transition-colors">
                  <FiEdit2 className="inline mr-1" /> แก้ไข
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors">
                  <FiTrash2 className="inline mr-1" /> ลบ
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <FiCoffee className="text-4xl text-coffee-300 mx-auto mb-4" />
            <p className="text-coffee-400">ยังไม่มีเมนู กดปุ่ม &quot;เพิ่มเมนู&quot; เพื่อเริ่มต้น</p>
          </div>
        )}
      </div>
    </div>
  );
}
