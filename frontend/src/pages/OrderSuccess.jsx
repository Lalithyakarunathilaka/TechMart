import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderNumber = params.get('order');

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
      {orderNumber && (
        <p className="text-gray-500 mb-2">Order Number: <span className="font-mono font-semibold text-gray-900">{orderNumber}</span></p>
      )}
      <p className="text-gray-500 mb-8">Thank you for your order. We'll process it shortly.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/products" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-medium">
          Continue Shopping
        </Link>
        <Link to="/orders" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
          View Orders
        </Link>
      </div>
    </div>
  );
}
