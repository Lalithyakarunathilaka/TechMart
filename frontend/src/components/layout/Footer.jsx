import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TM</span>
              </div>
              <span className="text-xl font-bold text-white">TechMart</span>
            </div>
            <p className="text-sm">Your one-stop shop for the latest electronics and tech gadgets.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block hover:text-white transition">Home</Link>
              <Link to="/products" className="block hover:text-white transition">Products</Link>
              <Link to="/login" className="block hover:text-white transition">Login</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Categories</h4>
            <div className="space-y-2 text-sm">
              <Link to="/products?category=smartphones" className="block hover:text-white transition">Smartphones</Link>
              <Link to="/products?category=laptops" className="block hover:text-white transition">Laptops</Link>
              <Link to="/products?category=audio" className="block hover:text-white transition">Audio</Link>
              <Link to="/products?category=accessories" className="block hover:text-white transition">Accessories</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm">
              <p>123 Tech Street, Colombo</p>
              <p>info@techmart.lk</p>
              <p>+94 77 123 4567</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} TechMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
