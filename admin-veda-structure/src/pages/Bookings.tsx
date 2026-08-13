import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, CalendarClock, CheckCircle, XCircle, Clock, CalendarCheck, Search } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { bookings } from '@/data/mockData';

const bookingTypes = ['Astrology Consultation', 'Pandit Booking', 'Vastu Consultation', 'Numerology', 'Other Services'];
const bookingStatuses = ['Confirmed', 'Pending', 'Completed', 'Cancelled', 'Rescheduled'];
const expertNames = ['Pandit Rajesh Sharma', 'Acharya Meena Iyer', 'Dr. Suresh Verma', 'Guru Sri Anand', 'Pandit Krishna Murthy', 'Jyotish Priya Gupta'];

export default function Bookings() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [expert, setExpert] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (search && !b.customerName.toLowerCase().includes(search.toLowerCase()) && !b.customerPhone.includes(search) && !b.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (type && b.service !== type) return false;
      if (expert && b.expert !== expert) return false;
      if (status && b.status !== status) return false;
      return true;
    });
  }, [search, type, expert, status]);

  const perPage = 8;
  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = [
    { label: "Today's Bookings", value: '12', icon: Clock, color: 'text-saffron-600', bg: 'bg-saffron-50' },
    { label: 'Upcoming', value: '28', icon: CalendarClock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Completed', value: '298', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Cancelled', value: '18', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Manage all astrology consultations, pandit bookings, and spiritual sessions."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-charcoal-400">{s.label}</p>
                  <p className="text-xl font-bold text-charcoal-800">{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name, phone, or ID..." />
          <FilterDropdown value={type} onChange={(v) => { setType(v); setPage(1); }} options={bookingTypes} label="All Types" />
          <FilterDropdown value={expert} onChange={(v) => { setExpert(v); setPage(1); }} options={expertNames} label="All Experts" />
          <FilterDropdown value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={bookingStatuses} label="All Status" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {current.length === 0 ? (
          <EmptyState title="No bookings found" message="Try adjusting your search or filters." icon={<CalendarCheck className="w-8 h-8 text-charcoal-300" />} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Booking ID</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Phone</th>
                  <th className="text-left px-5 py-3 font-medium">Service</th>
                  <th className="text-left px-5 py-3 font-medium">Expert</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Time</th>
                  <th className="text-left px-5 py-3 font-medium">Amount</th>
                  <th className="text-left px-5 py-3 font-medium">Payment</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {current.map((b) => (
                  <tr key={b.id} className="table-row-hover">
                    <td className="px-5 py-3 font-medium text-charcoal-700">
                      <Link to={`/admin/bookings/${b.id}`} className="hover:text-saffron-600">{b.id}</Link>
                    </td>
                    <td className="px-5 py-3 text-charcoal-600">{b.customerName}</td>
                    <td className="px-5 py-3 text-charcoal-500">{b.customerPhone}</td>
                    <td className="px-5 py-3 text-charcoal-600">{b.service}</td>
                    <td className="px-5 py-3 text-charcoal-600">{b.expert}</td>
                    <td className="px-5 py-3 text-charcoal-500">{b.bookingDate}</td>
                    <td className="px-5 py-3 text-charcoal-500">{b.bookingTime}</td>
                    <td className="px-5 py-3 font-medium text-charcoal-700">₹{b.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3"><StatusBadge status={b.paymentStatus} /></td>
                    <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/admin/bookings/${b.id}`} className="inline-flex p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition">
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
