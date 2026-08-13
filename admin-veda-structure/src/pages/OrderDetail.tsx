import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, CreditCard, Package, CheckCircle } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { orders } from '@/data/mockData';

export default function OrderDetail() {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return <EmptyState title="Order not found" message="This order doesn't exist." action={<Link to="/admin/orders" className="btn-primary">Back to Orders</Link>} />;
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-saffron-600 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-charcoal-800">#{order.id}</h1>
            <StatusBadge status={order.orderStatus} />
          </div>
          <p className="text-sm text-charcoal-400 mt-1">Placed on {order.date} by {order.customerName}</p>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="card p-5 mb-6">
        <h3 className="text-base font-semibold text-charcoal-800 mb-4">Order Timeline</h3>
        <div className="flex items-center overflow-x-auto pb-2">
          {order.timeline.map((step, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${step.done ? 'bg-saffron-500 text-white' : 'bg-cream-100 text-charcoal-300'}`}>
                  {step.done ? <CheckCircle className="w-5 h-5" /> : <Package className="w-4 h-4" />}
                </div>
                <p className={`text-xs mt-2 text-center max-w-[80px] ${step.done ? 'text-charcoal-700 font-medium' : 'text-charcoal-300'}`}>{step.status}</p>
                {step.date && <p className="text-[10px] text-charcoal-300 mt-0.5">{step.date}</p>}
              </div>
              {i < order.timeline.length - 1 && (
                <div className={`w-12 sm:w-20 h-0.5 mx-1 ${step.done && order.timeline[i + 1].done ? 'bg-saffron-500' : 'bg-cream-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="px-5 py-4 border-b border-cream-200">
            <h3 className="text-base font-semibold text-charcoal-800">Order Items</h3>
          </div>
          <div className="divide-y divide-cream-100">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-charcoal-700">{item.name}</p>
                  <p className="text-sm text-charcoal-400 mt-0.5">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <p className="font-medium text-charcoal-700">₹{(item.quantity * item.price).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
          {/* Summary */}
          <div className="px-5 py-4 bg-cream-50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-400">Subtotal</span>
              <span className="text-charcoal-600">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400">Discount</span>
                <span className="text-green-600">-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-400">Shipping</span>
              <span className="text-charcoal-600">{order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString('en-IN')}`}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-cream-200">
              <span className="font-semibold text-charcoal-700">Total</span>
              <span className="text-lg font-bold text-saffron-600">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Customer + Shipping + Payment */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-base font-semibold text-charcoal-800">Customer</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-charcoal-700 font-medium">{order.customerName}</p>
              <p className="text-charcoal-500">{order.customerEmail}</p>
              <p className="text-charcoal-500">{order.customerPhone}</p>
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-charcoal-800">Shipping Address</h3>
            </div>
            <p className="text-sm text-charcoal-600 leading-relaxed">{order.shippingAddress}</p>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-charcoal-800">Payment Details</h3>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-400">Method</span>
                <span className="font-medium text-charcoal-700">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-400">Status</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-400">Transaction ID</span>
                <span className="font-medium text-charcoal-700">{order.transactionId || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
