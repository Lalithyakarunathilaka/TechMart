import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchCategories = () => {
    adminAPI.getCategories().then((res) => setCategories(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminAPI.updateCategory(editing, form);
        toast.success('Category updated');
      } else {
        await adminAPI.createCategory(form);
        toast.success('Category created');
      }
      setForm({ name: '', description: '' });
      setShowForm(false);
      setEditing(null);
      fetchCategories();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach((msg) => toast.error(msg));
      else toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const startEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '' });
    setEditing(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await adminAPI.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '' }); }} className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
          {showForm ? <X size={18} /> : <Plus size={18} />}
          <span>{showForm ? 'Cancel' : 'Add Category'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          </div>
          <button type="submit" className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
            <Check size={18} />
            <span>{editing ? 'Update' : 'Create'}</span>
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Slug</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Products</th>
              <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => <tr key={i}><td colSpan={4} className="py-4 px-4"><div className="h-6 bg-gray-100 rounded animate-pulse" /></td></tr>)
            ) : categories.map((cat) => (
              <tr key={cat.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{cat.name}</td>
                <td className="py-3 px-4 text-gray-500">{cat.slug}</td>
                <td className="py-3 px-4">{cat.products_count}</td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => startEdit(cat)} className="p-2 text-gray-500 hover:text-primary-600 transition"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 text-gray-500 hover:text-red-500 transition"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
