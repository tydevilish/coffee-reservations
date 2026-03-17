'use client';
import { useState, useEffect } from 'react';
import { FiCoffee, FiStar, FiFilter } from 'react-icons/fi';

const categoryConfig = {
  coffee: { label: 'กาแฟ', icon: <FiCoffee /> },
  'non-coffee': { label: 'เครื่องดื่มอื่น', icon: <FiCoffee /> },
  bakery: { label: 'เบเกอรี่', icon: <FiStar /> },
};

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setItems(Array.isArray(data) ? data.filter((i) => i.is_available) : []);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  }

  const categories = ['all', ...Object.keys(categoryConfig)];
  const filtered =
    activeCategory === 'all'
      ? items
      : items.filter((i) => i.category === activeCategory);

  // Group by category for display
  const grouped = filtered.reduce((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 coffee-pattern">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-accent font-medium text-sm tracking-widest uppercase">
            our menu
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-800 mt-3">
            เมนูของเรา
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeCategory === cat
                  ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                  : 'bg-white text-coffee-600 border border-coffee-200 hover:border-accent/40 hover:text-accent'
              }`}
            >
              {cat === 'all' ? (
                <>
                  <FiFilter className="text-xs" /> ทั้งหมด
                </>
              ) : (
                <>
                  {categoryConfig[cat]?.icon} {categoryConfig[cat]?.label}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <FiCoffee className="text-4xl text-coffee-300 mx-auto mb-4 animate-pulse" />
            <p className="text-coffee-400">กำลังโหลดเมนู...</p>
          </div>
        )}

        {/* Menu Items by Category */}
        {!loading &&
          Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="mb-12">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white">
                  {categoryConfig[cat]?.icon || <FiCoffee />}
                </div>
                <h2 className="text-xl font-semibold text-coffee-800">
                  {categoryConfig[cat]?.label || cat}
                </h2>
                <div className="flex-1 h-px bg-coffee-200" />
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className="card group overflow-hidden hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-coffee-100 to-coffee-200 relative overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiCoffee className="text-coffee-300 text-5xl group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      {item.is_recommended && (
                        <div className="absolute top-3 right-3 bg-accent text-white text-[10px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1 shadow-lg">
                          <FiStar className="text-[10px]" /> แนะนำ
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-coffee-800 text-lg group-hover:text-accent transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-accent font-bold text-lg whitespace-nowrap">
                          {item.price} .-
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-coffee-400 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="card p-16 text-center">
            <FiCoffee className="text-5xl text-coffee-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-coffee-700 mb-2">
              ยังไม่มีเมนูในหมวดนี้
            </h3>
            <p className="text-coffee-400 text-sm">กรุณาเลือกหมวดอื่น</p>
          </div>
        )}
      </div>
    </div>
  );
}
