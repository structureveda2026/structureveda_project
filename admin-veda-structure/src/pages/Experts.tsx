import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Star, UserCog } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { experts } from '@/data/mockData';

const expertTypes = ['Pandit', 'Astrologer', 'Spiritual Expert'];
const expertStatuses = ['Active', 'On Leave', 'Inactive'];

export default function Experts() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return experts.filter((e) => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.specialization.toLowerCase().includes(search.toLowerCase())) return false;
      if (type && e.type !== type) return false;
      if (status && e.status !== status) return false;
      return true;
    });
  }, [search, type, status]);

  const perPage = 8;
  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <PageHeader
        title="Experts"
        subtitle="Manage pandits, astrologers, and spiritual experts on Veda Structure."
        actions={<Link to="/admin/experts/new" className="btn-primary"><Plus className="w-4 h-4" /> Add Expert</Link>}
      />

      <div className="card p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search experts..." />
          <FilterDropdown value={type} onChange={(v) => { setType(v); setPage(1); }} options={expertTypes} label="All Types" />
          <FilterDropdown value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={expertStatuses} label="All Status" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {current.length === 0 ? (
          <div className="col-span-full"><EmptyState title="No experts found" message="Try adjusting your search or filters." icon={<UserCog className="w-8 h-8 text-charcoal-300" />} /></div>
        ) : (
          current.map((expert) => (
            <div key={expert.id} className="card p-5 hover:shadow-elevated transition group">
              <div className="flex items-start gap-4">
                <img src={expert.photo} alt={expert.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-charcoal-800 truncate">{expert.name}</h3>
                  <p className="text-sm text-charcoal-400 mt-0.5">{expert.type}</p>
                  <div className="mt-1.5"><StatusBadge status={expert.status} /></div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-charcoal-600"><span className="text-charcoal-400">Specialization: </span>{expert.specialization}</p>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-600"><span className="text-charcoal-400">Experience: </span>{expert.experience} yrs</span>
                  <span className="flex items-center gap-1 text-charcoal-600">
                    <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                    {expert.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-600"><span className="text-charcoal-400">Bookings: </span>{expert.bookings}</span>
                  <span className="font-medium text-charcoal-700">₹{expert.consultationFee.toLocaleString('en-IN')}/session</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-cream-100">
                <span className="text-xs text-charcoal-400 mr-auto">{expert.languages.join(', ')}</span>
                <Link to={`/admin/experts/${expert.id}/edit`} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition" title="View">
                  <Eye className="w-4 h-4" />
                </Link>
                <Link to={`/admin/experts/${expert.id}/edit`} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition" title="Edit">
                  <Edit className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {current.length > 0 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
}
