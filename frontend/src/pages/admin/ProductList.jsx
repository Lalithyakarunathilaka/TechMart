import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchProducts = () => {
    setLoading(true);
    adminAPI.getProducts({ search, page }).then((res) => {
      setProducts(res.data.data);
      setPagination({ current: res.data.current_page, last: res.data.last_page });
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search, page]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const formatPrice = (price) => 'Rs. ' + Number(price).toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/admin/products/new" className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
          <Plus size={18} />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..."
          className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Product</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Price</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Stock</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="py-4 px-4"><div className="h-6 bg-gray-100 rounded animate-pulse" /></td></tr>)
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">No products found</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img src={p.images?.[0] || 'https://placehold.co/40x40/f3f4f6/9ca3af?text=N/A'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-gray-900 truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{p.category?.name}</td>
                    <td className="py-3 px-4 font-medium">{formatPrice(p.sale_price || p.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${p.stock < 5 ? 'text-red-500' : 'text-gray-900'}`}>{p.stock}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/admin/products/${p.id}/edit`} className="p-2 text-gray-500 hover:text-primary-600 transition">
                          <Pencil size={16} />
                        </Link>
                        <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-gray-500 hover:text-red-500 transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.last > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: pagination.last }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm ${p === pagination.current ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
