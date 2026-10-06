import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, CreditCard } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productAPI.getFeatured(), categoryAPI.getAll()])
      .then(([prodRes, catRes]) => {
        setFeatured(prodRes.data);
        setCategories(catRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              The Latest Tech<br />At Your Fingertips
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              Discover premium electronics, gadgets, and accessories from top brands. Free shipping on orders over Rs. 10,000.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="inline-flex items-center justify-center space-x-2 bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                <span>Shop Now</span>
                <ArrowRight size={20} />
              </Link>
              <Link to="/products?category=smartphones" className="inline-flex items-center justify-center space-x-2 border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                <span>View Smartphones</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-500">Browse our wide selection of tech products</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="bg-white border border-gray-100 rounded-xl p-6 text-center hover:shadow-md hover:border-primary-200 transition group"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition">
                <span className="text-primary-600 text-xl font-bold">{cat.name[0]}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{cat.products_count} products</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-500">Our handpicked selection of top products</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium transition">
              <span>View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="text-center mt-8 sm:hidden">
            <Link to="/products" className="text-primary-600 font-medium">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over Rs. 10,000' },
            { icon: Shield, title: 'Warranty', desc: 'Manufacturer warranty included' },
            { icon: Headphones, title: '24/7 Support', desc: 'Get help anytime you need' },
            { icon: CreditCard, title: 'Secure Payment', desc: 'PayHere secure checkout' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon size={24} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
