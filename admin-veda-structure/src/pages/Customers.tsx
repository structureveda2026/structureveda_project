import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, UserX, Users, IndianRupee, ShoppingBag, CalendarCheck } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { customers } from '@/data/mockData';

export default function Customers() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase()) && !c.phone.includes(search)) return false;
      if (status && c.status !== status) return false;
      return true;
    });
  }, [search, status]);

  const perPage = 8;
  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = [
    { label: 'Total Customers', value: '8,420', icon: Users, color: 'text-saffron-600', bg: 'bg-saffron-50' },
    { label: 'Active', value: customers.filter(c => c.status === 'Active').length.toString(), icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Revenue', value: '₹4.8L', icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg. Order Value', value: '₹2,150', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div>
      <PageHeader title="Customers" subtitle="View and manage all registered customers on Veda Structure." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name, email, or phone..." />
          <FilterDropdown value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={['Active', 'Inactive']} label="All Status" />
        </div>
      </div>

      <div className="card overflow-hidden">
        {current.length === 0 ? (
          <EmptyState title="No customers found" message="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Email</th>
                  <th className="text-left px-5 py-3 font-medium">Phone</th>
                  <th className="text-left px-5 py-3 font-medium">Orders</th>
                  <th className="text-left px-5 py-3 font-medium">Bookings</th>
                  <th className="text-left px-5 py-3 font-medium">Total Spent</th>
                  <th className="text-left px-5 py-3 font-medium">Joined</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {current.map((c) => (
                  <tr key={c.id} className="table-row-hover">
                    <td className="px-5 py-3">
                      <Link to={`/admin/customers/${c.id}`} className="flex items-center gap-3">
                        <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover" />
                        <span className="font-medium text-charcoal-700 hover:text-saffron-600">{c.name}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-charcoal-500">{c.email}</td>
                    <td className="px-5 py-3 text-charcoal-500">{c.phone}</td>
                    <td className="px-5 py-3 text-charcoal-600">{c.orders}</td>
                    <td className="px-5 py-3 text-charcoal-600">{c.bookings}</td>
                    <td className="px-5 py-3 font-medium text-charcoal-700">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-charcoal-500">{c.joinedDate}</td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/customers/${c.id}`} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition" title="View">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-1.5 rounded-lg text-charcoal-400 hover:bg-red-50 hover:text-red-500 transition" title="Deactivate">
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
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
