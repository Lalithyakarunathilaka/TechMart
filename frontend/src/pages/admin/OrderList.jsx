import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const paymentColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selected, setSelected] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const params = { page };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    adminAPI.getOrders(params).then((res) => {
      setOrders(res.data.data);
      setPagination({ current: res.data.current_page, last: res.data.last_page });
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [search, statusFilter, page]);

  const updateStatus = async (orderId, field, value) => {
    try {
      await adminAPI.updateOrder(orderId, { [field]: value });
      toast.success('Order updated');
      fetchOrders();
      if (selected?.id === orderId) {
        setSelected((prev) => ({ ...prev, [field]: value }));
      }
    } catch { toast.error('Failed to update'); }
  };

  const formatPrice = (price) => 'Rs. ' + Number(price).toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Order</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Payment</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="py-4 px-4"><div className="h-6 bg-gray-100 rounded animate-pulse" /></td></tr>)
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">No orders found</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id} onClick={() => setSelected(order)} className={`border-t cursor-pointer hover:bg-gray-50 ${selected?.id === order.id ? 'bg-primary-50' : ''}`}>
                    <td className="py-3 px-4 font-mono text-xs">{order.order_number}</td>
                    <td className="py-3 px-4">{order.customer_name}</td>
                    <td className="py-3 px-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentColors[order.payment_status]}`}>{order.payment_status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => { e.stopPropagation(); updateStatus(order.id, 'status', e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${statusColors[order.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="hidden xl:block w-80 bg-white rounded-xl border border-gray-200 p-5 h-fit sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Order:</span> <span className="font-mono">{selected.order_number}</span></p>
              <p><span className="text-gray-500">Customer:</span> {selected.customer_name}</p>
              <p><span className="text-gray-500">Email:</span> {selected.customer_email}</p>
              <p><span className="text-gray-500">Phone:</span> {selected.customer_phone}</p>
              <p><span className="text-gray-500">Address:</span> {selected.shipping_address}</p>
              <p><span className="text-gray-500">Method:</span> {selected.payment_method}</p>
              {selected.notes && <p><span className="text-gray-500">Notes:</span> {selected.notes}</p>}
              <div className="border-t pt-2 mt-2">
                <p className="font-medium mb-1">Items:</p>
                {selected.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs py-1">
                    <span>{item.product_name} ×{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(selected.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {pagination.last > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: pagination.last }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm ${p === pagination.current ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
