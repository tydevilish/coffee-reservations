'use client';
import { useState, useEffect } from 'react';
import { FiCoffee, FiStar, FiFilter } from 'react-icons/fi';

const categoryConfig = {
  coffee: { label: 'กาแฟ', labelEn: 'Coffee', icon: <FiCoffee /> },
  'non-coffee': { label: 'เครื่องดื่มอื่น', labelEn: 'Beverages', icon: <FiCoffee /> },
  bakery: { label: 'เบเกอรี่', labelEn: 'Bakery', icon: <FiStar /> },
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
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[45vh] md:h-[50vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&h=900&fit=crop"
          alt="Menu background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/50 via-coffee-900/60 to-background" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div>
            <span className="heading-en text-accent text-sm tracking-[0.3em] uppercase">
              Our Menu
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-3 mb-3">
              เมนูของเรา
            </h1>
            <p className="font-serif-en text-coffee-200 text-lg">
              Freshly crafted, served with love
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-20 -mt-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === cat
                    ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                    : 'bg-white text-coffee-600 border border-coffee-200 hover:border-accent/40 hover:text-accent shadow-sm'
                }`}
              >
                {cat === 'all' ? (
                  <>
                    <FiFilter className="text-xs" />
                    <span className="heading-en text-xs tracking-wider uppercase">All</span>
                  </>
                ) : (
                  <>
                    {categoryConfig[cat]?.icon}
                    <span className="heading-en text-xs tracking-wider uppercase">{categoryConfig[cat]?.labelEn}</span>
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
              <div key={cat} className="mb-16">
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white">
                    {categoryConfig[cat]?.icon || <FiCoffee />}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-coffee-800">
                      {categoryConfig[cat]?.label || cat}
                    </h2>
                    <span className="heading-en text-coffee-400 text-xs tracking-wider uppercase">
                      {categoryConfig[cat]?.labelEn || cat}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-coffee-200" />
                  <span className="text-coffee-300 text-sm">{catItems.length} items</span>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="card group overflow-hidden hover:shadow-xl p-0"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      {/* Image */}
                      <div className="h-52 bg-gradient-to-br from-coffee-100 to-coffee-200 relative overflow-hidden">
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
                          <div className="absolute top-3 right-3 bg-accent text-white text-[10px] px-3 py-1.5 rounded-full font-medium flex items-center gap-1 shadow-lg heading-en tracking-wider uppercase">
                            <FiStar className="text-[9px]" /> Recommended
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* Price overlay */}
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-accent font-bold px-3 py-1.5 rounded-full text-sm shadow-lg">
                          {item.price} .-
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-semibold text-coffee-800 text-lg group-hover:text-accent transition-colors mb-1">
                          {item.name}
                        </h3>
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
              <h3 className="text-lg font-semibold text-coffee-700 mb-1">
                ยังไม่มีเมนูในหมวดนี้
              </h3>
              <p className="font-serif-en text-coffee-400 text-sm">Please try another category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
