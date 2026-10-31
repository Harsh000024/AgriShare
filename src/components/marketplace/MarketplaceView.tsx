import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  Plus, 
  Check, 
  Leaf, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MarketplaceProduct, MarketplaceCategory } from '../../types';

export const MarketplaceView: React.FC = () => {
  const { products, addToCart, formatPrice } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const categories: (MarketplaceCategory | 'All')[] = [
    'All',
    'Seeds',
    'Fertilizers',
    'Biopesticides',
    'Farm Tools',
    'Irrigation Supplies',
    'Nursery Plants',
    'Crop Storage',
  ];

  const categoryLabels: Record<string, string> = {
    'All': 'All Supplies',
    'Seeds': 'Seeds',
    'Fertilizers': 'Fertilizers',
    'Biopesticides': 'Bug & Disease Spray',
    'Farm Tools': 'Farm Tools',
    'Irrigation Supplies': 'Water & Drip Pipes',
    'Nursery Plants': 'Nursery Plants',
    'Crop Storage': 'Grain Storage Bags',
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (organicOnly && !p.isOrganicCertified) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [products, selectedCategory, organicOnly, searchQuery]);

  const handleAdd = (product: MarketplaceProduct) => {
    addToCart(product, 1);
    setAddedNotice(product.name);
    setTimeout(() => setAddedNotice(null), 1800);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Farm Supplies</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Buy certified seeds, organic fertilizers, tools, and storage bags directly to your farm gate
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Delivered directly to your farm gate</span>
        </div>
      </div>

      {/* Floating notice */}
      {addedNotice && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Added to cart: {addedNotice}</span>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search seeds, fertilizer, spray, pipes, bags..."
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Organic toggle */}
          <button
            onClick={() => setOrganicOnly(!organicOnly)}
            className={`min-h-[48px] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
              organicOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Organic Certified Only</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-stone-100 dark:border-stone-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="text-xs text-stone-500 flex justify-between">
          <span>Found <strong>{filteredProducts.length} items</strong></span>
          <span>Free delivery on orders over $300 (₹24,900)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="relative h-44 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-2">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {p.isOrganicCertified && (
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Leaf className="w-3 h-3" />
                      <span>Organic</span>
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {p.stock} in stock
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {categoryLabels[p.category] || p.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{p.rating}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
                  {p.name}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                  {p.description}
                </p>

                {p.applicationRate && (
                  <div className="mt-2 text-[11px] text-stone-600 dark:text-stone-400 p-2 rounded-xl bg-stone-50 dark:bg-stone-800">
                    <strong>Usage:</strong> {p.applicationRate}
                  </div>
                )}
              </div>

              {/* Price & Add button */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <div className="text-base font-extrabold font-mono text-stone-900 dark:text-stone-100">
                    {formatPrice(p.price)}
                  </div>
                  <span className="text-[11px] text-stone-400 block">per {p.unit}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(p)}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
