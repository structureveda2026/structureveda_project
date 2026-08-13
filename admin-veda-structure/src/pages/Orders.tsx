import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingBag, Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { orders } from '@/data/mockData';

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const paymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded'];

export default function Orders() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [payment, setPayment] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customerName.toLowerCase().includes(search.toLowerCase())) return false;
      if (status && o.orderStatus !== status) return false;
      if (payment && o.paymentStatus !== payment) return false;
      return true;
    });
  }, [search, status, payment]);

  const perPage = 8;
  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = [
    { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingBag, color: 'text-saffron-600', bg: 'bg-saffron-50' },
    { label: 'Pending', value: orders.filter(o => o.orderStatus === 'Pending').length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Processing', value: orders.filter(o => o.orderStatus === 'Processing').length.toString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Shipped', value: orders.filter(o => o.orderStatus === 'Shipped').length.toString(), icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'Delivered').length.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Cancelled', value: orders.filter(o => o.orderStatus === 'Cancelled').length.toString(), icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div>
      <PageHeader title="Orders" subtitle="Manage all customer orders and track deliveries." />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-xs text-charcoal-400">{s.label}</p>
              <p className="text-lg font-bold text-charcoal-800">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="card p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by order ID or customer..." />
          <FilterDropdown value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={orderStatuses} label="All Order Status" />
          <FilterDropdown value={payment} onChange={(v) => { setPayment(v); setPage(1); }} options={paymentStatuses} label="All Payment Status" />
        </div>
      </div>

      <div className="card overflow-hidden">
        {current.length === 0 ? (
          <EmptyState title="No orders found" message="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Order ID</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Items</th>
                  <th className="text-left px-5 py-3 font-medium">Total</th>
                  <th className="text-left px-5 py-3 font-medium">Payment</th>
                  <th className="text-left px-5 py-3 font-medium">Order Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-right px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {current.map((o) => (
                  <tr key={o.id} className="table-row-hover">
                    <td className="px-5 py-3 font-medium text-charcoal-700">
                      <Link to={`/admin/orders/${o.id}`} className="hover:text-saffron-600">#{o.id}</Link>
                    </td>
                    <td className="px-5 py-3 text-charcoal-600">{o.customerName}</td>
                    <td className="px-5 py-3 text-charcoal-600">{o.items.length} item(s)</td>
                    <td className="px-5 py-3 font-medium text-charcoal-700">₹{o.total.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.paymentStatus} /></td>
                    <td className="px-5 py-3"><StatusBadge status={o.orderStatus} /></td>
                    <td className="px-5 py-3 text-charcoal-500">{o.date}</td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/admin/orders/${o.id}`} className="inline-flex p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {current.length > 0 && <div className="px-5 py-4"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>}
      </div>
    </div>
  );
}
