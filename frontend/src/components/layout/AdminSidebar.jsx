import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingBag, ArrowLeft } from 'lucide-react';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-gray-900 min-h-screen text-white p-6 hidden lg:block">
      <div className="mb-8">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <p className="text-gray-400 text-sm">TechMart Management</p>
      </div>
      <nav className="space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              (to === '/admin' ? pathname === '/admin' : pathname.startsWith(to))
                ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <Link to="/" className="flex items-center space-x-2 mt-8 text-gray-400 hover:text-white transition px-4 py-2">
        <ArrowLeft size={18} />
        <span>Back to Store</span>
      </Link>
    </aside>
  );
}
