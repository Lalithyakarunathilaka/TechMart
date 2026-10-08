import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkoutAPI } from '../services/api';
import toast from 'react-hot-toast';

const WHATSAPP_NUMBER = '94788597274';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    shipping_address: '',
    notes: '',
  });

  const formatPrice = (price) => 'Rs. ' + Number(price).toLocaleString('en-US', { minimumFractionDigits: 2 });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.customer_name.trim()) { toast.error('Name is required'); return false; }
    if (!form.customer_email.trim() || !/\S+@\S+\.\S+/.test(form.customer_email)) { toast.error('Valid email is required'); return false; }
    if (!form.customer_phone.trim()) { toast.error('Phone number is required'); return false; }
    if (!form.shipping_address.trim()) { toast.error('Shipping address is required'); return false; }
    return true;
  };

  const handleWhatsApp = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await checkoutAPI.create({
        ...form,
        payment_method: 'whatsapp',
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      });

      const itemsText = items.map((i, idx) =>
        `${idx + 1}. ${i.name} — ×${i.quantity} — ${formatPrice(i.price * i.quantity)}`
      ).join('\n');

      const message = `🛒 *New Order — TechMart*\n\n` +
        `*Order:* ${data.order.order_number}\n` +
        `*Customer:* ${form.customer_name}\n` +
        `*Phone:* ${form.customer_phone}\n` +
        `*Email:* ${form.customer_email}\n` +
        `*Address:* ${form.shipping_address}\n\n` +
        `*Items:*\n${itemsText}\n\n` +
        `*Total: ${formatPrice(totalPrice)}*` +
        (form.notes ? `\n\n*Notes:* ${form.notes}` : '');

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      clearCart();
      navigate(`/order-success?order=${data.order.order_number}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePayHere = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await checkoutAPI.create({
        ...form,
        payment_method: 'payhere',
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      });

      const ph = data.payhere;
      const payForm = document.createElement('form');
      payForm.method = 'POST';
      payForm.action = ph.sandbox
        ? 'https://sandbox.payhere.lk/pay/checkout'
        : 'https://www.payhere.lk/pay/checkout';

      const fields = {
        merchant_id: ph.merchant_id,
        return_url: ph.return_url,
        cancel_url: ph.cancel_url,
        notify_url: ph.notify_url,
        order_id: ph.order_id,
        items: ph.items,
        currency: ph.currency,
        amount: ph.amount,
        first_name: ph.first_name,
        last_name: ph.last_name,
        email: ph.email,
        phone: ph.phone,
        address: ph.address,
        city: ph.city,
        country: ph.country,
        hash: ph.hash,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        payForm.appendChild(input);
      });

      document.body.appendChild(payForm);
      clearCart();
      payForm.submit();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link to="/products" className="text-primary-600 hover:underline">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center space-x-1 text-gray-500 hover:text-primary-600 mb-6 transition">
        <ArrowLeft size={18} />
        <span>Continue Shopping</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Customer info form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" name="customer_name" value={form.customer_name} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" name="customer_email" value={form.customer_email} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input type="tel" name="customer_phone" value={form.customer_phone} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address *</label>
                <textarea name="shipping_address" value={form.shipping_address} onChange={handleChange} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none" placeholder="Any special instructions..." />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={handlePayHere}
                disabled={loading}
                className="flex items-center space-x-3 border-2 border-primary-200 bg-primary-50 rounded-xl p-4 hover:border-primary-400 transition disabled:opacity-50"
              >
                <CreditCard size={24} className="text-primary-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Pay with PayHere</p>
                  <p className="text-sm text-gray-500">Secure online payment</p>
                </div>
              </button>
              <button
                onClick={handleWhatsApp}
                disabled={loading}
                className="flex items-center space-x-3 border-2 border-green-200 bg-green-50 rounded-xl p-4 hover:border-green-400 transition disabled:opacity-50"
              >
                <MessageCircle size={24} className="text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Order via WhatsApp</p>
                  <p className="text-sm text-gray-500">Send order to our WhatsApp</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
