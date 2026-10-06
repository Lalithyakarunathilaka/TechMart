import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TechMart</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-primary-600 transition">Products</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setIsOpen(true)} className="relative p-2 text-gray-600 hover:text-primary-600 transition">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                {isAdmin && (
                  <Link to="/admin" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition">
                    <LayoutDashboard size={18} />
                    <span className="text-sm">Admin</span>
                  </Link>
                )}
                {!isAdmin && (
                  <Link to="/orders" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition">
                    <Package size={18} />
                    <span className="text-sm">Orders</span>
                  </Link>
                )}
                <span className="text-sm text-gray-500">{user.name}</span>
                <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-red-500 transition">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm">
                <User size={16} />
                <span>Login</span>
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-primary-600">Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-primary-600">Products</Link>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-primary-600">Admin Panel</Link>}
              {!isAdmin && <Link to="/orders" onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-primary-600">My Orders</Link>}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block text-red-500">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-primary-600 font-medium">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
