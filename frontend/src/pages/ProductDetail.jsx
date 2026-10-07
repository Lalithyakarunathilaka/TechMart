import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    productAPI.getOne(slug).then((res) => {
      setProduct(res.data.product);
      setRelated(res.data.related);
    }).finally(() => setLoading(false));
  }, [slug]);

  const formatPrice = (price) => 'Rs. ' + Number(price).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const hasDiscount = product?.sale_price && product.sale_price < product.price;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-16">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center space-x-1 text-gray-500 hover:text-primary-600 mb-6 transition">
        <ArrowLeft size={18} />
        <span>Back to Products</span>
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
          <img
            src={product.images?.[0] || 'https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
              {Math.round((1 - product.sale_price / product.price) * 100)}% OFF
            </span>
          )}
        </div>

        <div>
          <p className="text-primary-600 font-medium mb-2">{product.category?.name}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="mb-6">
            {hasDiscount ? (
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary-600">{formatPrice(product.sale_price)}</span>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center space-x-2 mb-6">
            {product.stock > 0 ? (
              <>
                <Check size={18} className="text-green-500" />
                <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
              </>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50 transition">
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-gray-50 transition">
                  <Plus size={18} />
                </button>
              </div>
              <button
                onClick={() => { addItem(product, quantity); toast.success('Added to cart!'); }}
                className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
            </div>
          )}

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <div key={key} className={`flex px-4 py-3 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <span className="w-1/3 text-sm font-medium text-gray-500">{key}</span>
                    <span className="flex-1 text-sm text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
