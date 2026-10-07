import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const transparent = isHome && !scrolled && !menuOpen;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${transparent ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${transparent ? 'bg-white/20' : 'bg-primary-600'}`}>
              <span className="text-white font-bold text-sm">TM</span>
            </div>
            <span className={`text-xl font-bold ${transparent ? 'text-white' : 'text-gray-900'}`}>TechMart</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`hover:text-primary-400 transition ${transparent ? 'text-gray-200' : 'text-gray-600 hover:text-primary-600'}`}>Home</Link>
            <Link to="/products" className={`hover:text-primary-400 transition ${transparent ? 'text-gray-200' : 'text-gray-600 hover:text-primary-600'}`}>Products</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setIsOpen(true)} className={`relative p-2 transition ${transparent ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-primary-600'}`}>
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                {isAdmin && (
                  <Link to="/admin" className={`flex items-center space-x-1 transition ${transparent ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-primary-600'}`}>
                    <LayoutDashboard size={18} />
                    <span className="text-sm">Admin</span>
                  </Link>
                )}
                {!isAdmin && (
                  <Link to="/orders" className={`flex items-center space-x-1 transition ${transparent ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-primary-600'}`}>
                    <Package size={18} />
                    <span className="text-sm">Orders</span>
                  </Link>
                )}
                <span className={`text-sm ${transparent ? 'text-gray-300' : 'text-gray-500'}`}>{user.name}</span>
                <button onClick={handleLogout} className={`p-2 transition ${transparent ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-500'}`}>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className={`hidden md:flex items-center space-x-1 px-4 py-2 rounded-full transition text-sm font-medium ${transparent ? 'bg-white/15 text-white hover:bg-white/25 border border-white/20' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                <User size={16} />
                <span>Login</span>
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-2 ${transparent ? 'text-white' : 'text-gray-600'}`}>
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
