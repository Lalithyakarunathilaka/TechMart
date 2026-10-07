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
      <section className="relative bg-black text-white min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1920&h=1080&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-400 mb-4 font-medium">Electronics & Tech Gadgets</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            TechMart
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-2 font-light">
            The Latest Tech. At Your Fingertips.
          </p>
          <p className="text-sm md:text-base text-gray-500 mb-10">
            Premium gadgets &bull; Free shipping over Rs. 10,000
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="inline-flex items-center justify-center space-x-2 bg-white text-black px-8 py-3.5 rounded-full font-semibold hover:bg-gray-200 transition text-sm md:text-base">
              <span>Shop Now</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/products?category=smartphones" className="inline-flex items-center justify-center space-x-2 border border-white/30 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition text-sm md:text-base">
              <span>Explore Smartphones</span>
            </Link>
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
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] block bg-gray-800"
            >
              <img
                src={cat.image || `https://placehold.co/400x500/1a1a2e/eee?text=${encodeURIComponent(cat.name)}`}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => { e.target.src = `https://placehold.co/400x500/1a1a2e/eee?text=${encodeURIComponent(cat.name)}`; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-bold text-white text-sm md:text-base">{cat.name}</h3>
                <p className="text-xs text-gray-300 mt-0.5">{cat.products_count} products</p>
              </div>
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
