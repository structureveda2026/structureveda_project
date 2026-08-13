import { useState, useMemo } from 'react';
import { CreditCard, IndianRupee, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { payments } from '@/data/mockData';

const paymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded'];
const paymentTypes = ['Order', 'Booking'];

export default function Payments() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (search && !p.transactionId.toLowerCase().includes(search.toLowerCase()) && !p.customerName.toLowerCase().includes(search.toLowerCase()) && !p.refId.toLowerCase().includes(search.toLowerCase())) return false;
      if (type && p.refType !== type) return false;
      if (status && p.status !== status) return false;
      return true;
    });
  }, [search, type, status]);

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = [
    { label: 'Total Revenue', value: '₹4,82,500', icon: IndianRupee, color: 'text-saffron-600', bg: 'bg-saffron-50' },
    { label: 'Paid', value: payments.filter(p => p.status === 'Paid').length.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending', value: payments.filter(p => p.status === 'Pending').length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Failed', value: payments.filter(p => p.status === 'Failed').length.toString(), icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Refunded', value: payments.filter(p => p.status === 'Refunded').length.toString(), icon: RotateCcw, color: 'text-charcoal-500', bg: 'bg-charcoal-100' },
  ];

  return (
    <div>
      <PageHeader title="Payments" subtitle="Track all transactions, payments, and refunds." />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
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
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by transaction ID, customer, or ref..." />
          <FilterDropdown value={type} onChange={(v) => { setType(v); setPage(1); }} options={paymentTypes} label="All Types" />
          <FilterDropdown value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={paymentStatuses} label="All Status" />
        </div>
      </div>

      <div className="card overflow-hidden">
        {current.length === 0 ? (
          <EmptyState title="No payments found" message="Try adjusting your search or filters." icon={<CreditCard className="w-8 h-8 text-charcoal-300" />} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Transaction ID</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Order / Booking ID</th>
                  <th className="text-left px-5 py-3 font-medium">Type</th>
                  <th className="text-left px-5 py-3 font-medium">Amount</th>
                  <th className="text-left px-5 py-3 font-medium">Method</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {current.map((p) => (
                  <tr key={p.id} className="table-row-hover">
                    <td className="px-5 py-3 font-medium text-charcoal-700">{p.transactionId}</td>
                    <td className="px-5 py-3 text-charcoal-600">{p.customerName}</td>
                    <td className="px-5 py-3 text-charcoal-600">{p.refId}</td>
                    <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full bg-cream-100 text-xs text-charcoal-500">{p.refType}</span></td>
                    <td className="px-5 py-3 font-medium text-charcoal-700">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-charcoal-600">{p.method}</td>
                    <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3 text-charcoal-500">{p.date}</td>
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
