import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');

  const [form, setForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    sale_price: '',
    stock: 0,
    images: [],
    specifications: {},
    featured: false,
    status: 'active',
  });

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    adminAPI.getCategories().then((res) => setCategories(res.data));
    if (isEdit) {
      adminAPI.getProduct(id).then((res) => {
        const product = res.data;
        setForm({
          category_id: product.category_id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          sale_price: product.sale_price || '',
          stock: product.stock,
          images: product.images || [],
          specifications: product.specifications || {},
          featured: product.featured,
          status: product.status,
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setForm({ ...form, images: [...form.images, imageUrl.trim()] });
    setImageUrl('');
  };

  const removeImage = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const addSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setForm({ ...form, specifications: { ...form.specifications, [specKey]: specVal } });
    setSpecKey('');
    setSpecVal('');
  };

  const removeSpec = (key) => {
    const specs = { ...form.specifications };
    delete specs[key];
    setForm({ ...form, specifications: specs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        stock: Number(form.stock),
      };
      if (isEdit) {
        await adminAPI.updateProduct(id, data);
        toast.success('Product updated');
      } else {
        await adminAPI.createProduct(data);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach((msg) => toast.error(msg));
      else toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <Link to="/admin/products" className="inline-flex items-center space-x-1 text-gray-500 hover:text-primary-600 mb-6 transition">
        <ArrowLeft size={18} />
        <span>Back to Products</span>
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none">
                <option value="">Select category</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (LKR)</label>
              <input type="number" name="sale_price" value={form.sale_price} onChange={handleChange} min="0" step="0.01" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Product Images (URLs)</h3>
          <div className="flex space-x-2 mb-3">
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            <button type="button" onClick={addImage} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"><Plus size={18} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Specifications</h3>
          <div className="flex space-x-2 mb-3">
            <input type="text" value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Key (e.g. Display)" className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            <input type="text" value={specVal} onChange={(e) => setSpecVal(e.target.value)} placeholder="Value (e.g. 6.7 inch)" className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            <button type="button" onClick={addSpec} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"><Plus size={18} /></button>
          </div>
          {Object.keys(form.specifications).length > 0 && (
            <div className="space-y-1">
              {Object.entries(form.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                  <span><strong>{key}:</strong> {value}</span>
                  <button type="button" onClick={() => removeSpec(key)} className="text-red-500 hover:text-red-700"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={loading} className="bg-primary-600 text-white px-8 py-2.5 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50">
            {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
          <Link to="/admin/products" className="px-8 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
