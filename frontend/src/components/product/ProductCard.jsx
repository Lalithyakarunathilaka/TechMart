import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  const formatPrice = (price) => {
    return 'Rs. ' + Number(price).toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
      <Link to={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.images?.[0] || 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {Math.round((1 - product.sale_price / product.price) * 100)}% OFF
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium mb-1">{product.category?.name}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-600 transition line-clamp-2">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            {hasDiscount ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary-600">{formatPrice(product.sale_price)}</span>
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
