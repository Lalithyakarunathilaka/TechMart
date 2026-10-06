import { useState, useEffect } from 'react';
import { Package, ShoppingBag, DollarSign, Users, Clock } from 'lucide-react';
import { adminAPI } from '../../services/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then((res) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  const formatPrice = (price) => 'Rs. ' + Number(price).toLocaleString('en-US', { minimumFractionDigits: 2 });

  if (loading) return <div className="p-6 animate-pulse space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl" />)}</div>;

  const stats = [
    { icon: Package, label: 'Total Products', value: data.total_products, color: 'bg-blue-50 text-blue-600' },
    { icon: ShoppingBag, label: 'Total Orders', value: data.total_orders, color: 'bg-green-50 text-green-600' },
    { icon: DollarSign, label: 'Total Revenue', value: formatPrice(data.total_revenue), color: 'bg-purple-50 text-purple-600' },
    { icon: Users, label: 'Customers', value: data.total_customers, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Clock size={20} className="text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        {data.recent_orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Order</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Customer</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Total</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 px-2 font-mono text-xs">{order.order_number}</td>
                    <td className="py-3 px-2">{order.customer_name}</td>
                    <td className="py-3 px-2 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span></td>
                    <td className="py-3 px-2 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
