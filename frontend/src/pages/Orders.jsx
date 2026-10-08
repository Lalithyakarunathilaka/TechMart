import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { orderAPI } from '../services/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders().then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  const formatPrice = (price) => 'Rs. ' + Number(price).toLocaleString('en-US', { minimumFractionDigits: 2 });

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl" />)}</div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link to="/products" className="text-primary-600 hover:underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                <div>
                  <p className="font-mono font-semibold text-gray-900">{order.order_number}</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
                  <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {order.items?.map((item) => (
                  <span key={item.id} className="mr-3">{item.product_name} ×{item.quantity}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
