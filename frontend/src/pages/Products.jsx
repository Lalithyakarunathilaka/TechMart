import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'created_at');
  const [direction, setDirection] = useState(searchParams.get('direction') || 'desc');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, sort, direction };
    if (search) params.search = search;
    if (category) params.category = category;

    productAPI.getAll(params).then((res) => {
      setProducts(res.data.data);
      setPagination({ current: res.data.current_page, last: res.data.last_page, total: res.data.total });
    }).finally(() => setLoading(false));

    const sp = new URLSearchParams();
    if (search) sp.set('search', search);
    if (category) sp.set('category', category);
    if (sort !== 'created_at') sp.set('sort', sort);
    if (page > 1) sp.set('page', page);
    setSearchParams(sp, { replace: true });
  }, [search, category, sort, direction, page]);

  const clearFilters = () => { setSearch(''); setCategory(''); setSort('created_at'); setDirection('desc'); setPage(1); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">{pagination.total || 0} products found</p>
        </div>
        <button onClick={() => setFiltersOpen(!filtersOpen)} className="lg:hidden flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className={`${filtersOpen ? 'fixed inset-0 z-40 bg-white p-6 overflow-y-auto' : 'hidden'} lg:block lg:static lg:w-64 lg:flex-shrink-0`}>
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h2 className="text-lg font-bold">Filters</h2>
            <button onClick={() => setFiltersOpen(false)}><X size={24} /></button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="space-y-1">
                <button onClick={() => { setCategory(''); setPage(1); }} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${!category ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'}`}>
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => { setCategory(cat.slug); setPage(1); setFiltersOpen(false); }} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${category === cat.slug ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'}`}>
                    {cat.name} ({cat.products_count})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={`${sort}-${direction}`}
                onChange={(e) => { const [s, d] = e.target.value.split('-'); setSort(s); setDirection(d); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>

            {(search || category) && (
              <button onClick={clearFilters} className="w-full text-sm text-red-500 hover:text-red-700 transition">Clear all filters</button>
            )}
          </div>
        </aside>

        {/* Product grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-2">No products found</p>
              <button onClick={clearFilters} className="text-primary-600 hover:underline">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              {pagination.last > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  {Array.from({ length: pagination.last }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition ${p === pagination.current ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
