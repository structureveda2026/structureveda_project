import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, CalendarCheck, IndianRupee, Calendar } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { customers, orders, bookings } from '@/data/mockData';

export default function CustomerDetail() {
  const { id } = useParams();
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return <EmptyState title="Customer not found" message="This customer doesn't exist." action={<Link to="/admin/customers" className="btn-primary">Back to Customers</Link>} />;
  }

  const customerOrders = orders.filter(o => o.customerId === customer.id);
  const customerBookings = bookings.filter(b => b.customerId === customer.id);

  const stats = [
    { label: 'Total Orders', value: customer.orders.toString(), icon: ShoppingBag, color: 'text-saffron-600', bg: 'bg-saffron-50' },
    { label: 'Total Bookings', value: customer.bookings.toString(), icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Spent', value: `₹${customer.totalSpent.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Member Since', value: customer.joinedDate, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div>
      <div className="mb-4">
        <Link to="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-saffron-600 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <div className="card p-5 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <img src={customer.avatar} alt={customer.name} className="w-20 h-20 rounded-full object-cover mb-3" />
            <h2 className="text-lg font-bold text-charcoal-800">{customer.name}</h2>
            <div className="mt-1.5"><StatusBadge status={customer.status} /></div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-charcoal-300" />
              <span className="text-charcoal-600">{customer.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-charcoal-300" />
              <span className="text-charcoal-600">{customer.phone}</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-4 h-4 text-charcoal-300 mt-0.5" />
              <span className="text-charcoal-600">{customer.address}</span>
            </div>
          </div>
        </div>

        {/* Stats + History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="card p-4">
                  <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="text-xs text-charcoal-400">{s.label}</p>
                  <p className="text-base font-bold text-charcoal-800 mt-0.5">{s.value}</p>
                </div>
              );
            })}
          </div>

          {/* Order History */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-cream-200">
              <h3 className="text-base font-semibold text-charcoal-800">Order History</h3>
            </div>
            {customerOrders.length === 0 ? (
              <EmptyState title="No orders" message="This customer hasn't placed any orders." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                      <th className="text-left px-5 py-3 font-medium">Order ID</th>
                      <th className="text-left px-5 py-3 font-medium">Items</th>
                      <th className="text-left px-5 py-3 font-medium">Total</th>
                      <th className="text-left px-5 py-3 font-medium">Status</th>
                      <th className="text-left px-5 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {customerOrders.map((o) => (
                      <tr key={o.id} className="table-row-hover">
                        <td className="px-5 py-3 font-medium text-charcoal-700">
                          <Link to={`/admin/orders/${o.id}`} className="hover:text-saffron-600">#{o.id}</Link>
                        </td>
                        <td className="px-5 py-3 text-charcoal-600">{o.items.length} item(s)</td>
                        <td className="px-5 py-3 font-medium text-charcoal-700">₹{o.total.toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3"><StatusBadge status={o.orderStatus} /></td>
                        <td className="px-5 py-3 text-charcoal-500">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Booking History */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-cream-200">
              <h3 className="text-base font-semibold text-charcoal-800">Booking History</h3>
            </div>
            {customerBookings.length === 0 ? (
              <EmptyState title="No bookings" message="This customer hasn't made any bookings." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                      <th className="text-left px-5 py-3 font-medium">Booking ID</th>
                      <th className="text-left px-5 py-3 font-medium">Service</th>
                      <th className="text-left px-5 py-3 font-medium">Expert</th>
                      <th className="text-left px-5 py-3 font-medium">Date</th>
                      <th className="text-left px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {customerBookings.map((b) => (
                      <tr key={b.id} className="table-row-hover">
                        <td className="px-5 py-3 font-medium text-charcoal-700">
                          <Link to={`/admin/bookings/${b.id}`} className="hover:text-saffron-600">{b.id}</Link>
                        </td>
                        <td className="px-5 py-3 text-charcoal-600">{b.service}</td>
                        <td className="px-5 py-3 text-charcoal-600">{b.expert}</td>
                        <td className="px-5 py-3 text-charcoal-500">{b.bookingDate}</td>
                        <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
