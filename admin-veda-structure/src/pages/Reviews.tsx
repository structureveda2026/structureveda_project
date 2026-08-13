import { useState, useMemo } from 'react';
import { Star, Check, Eye, Trash2, ThumbsDown } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import { reviews } from '@/data/mockData';

const reviewStatuses = ['Approved', 'Pending', 'Hidden'];
const itemTypes = ['Product', 'Course', 'Service'];

export default function Reviews() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (search && !r.customerName.toLowerCase().includes(search.toLowerCase()) && !r.itemName.toLowerCase().includes(search.toLowerCase()) && !r.comment.toLowerCase().includes(search.toLowerCase())) return false;
      if (type && r.itemType !== type) return false;
      if (status && r.status !== status) return false;
      return true;
    });
  }, [search, type, status]);

  const perPage = 8;
  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Moderate customer reviews for products, courses, and services." />

      <div className="card p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search reviews..." />
          <FilterDropdown value={type} onChange={(v) => { setType(v); setPage(1); }} options={itemTypes} label="All Types" />
          <FilterDropdown value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={reviewStatuses} label="All Status" />
        </div>
      </div>

      <div className="space-y-4">
        {current.length === 0 ? (
          <div className="card"><EmptyState title="No reviews found" message="Try adjusting your search or filters." icon={<Star className="w-8 h-8 text-charcoal-300" />} /></div>
        ) : (
          current.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-700">{review.customerName}</p>
                      <p className="text-xs text-charcoal-400">{review.date} · {review.itemType}</p>
                    </div>
                    <div className="flex items-center gap-0.5 ml-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-gold-400 fill-gold-400' : 'text-charcoal-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-charcoal-600 leading-relaxed mt-2">{review.comment}</p>
                  <p className="text-xs text-charcoal-400 mt-2">Reviewing: <span className="font-medium text-charcoal-600">{review.itemName}</span></p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={review.status} />
                  <div className="flex items-center gap-1">
                    {review.status === 'Pending' && (
                      <button className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition" title="Approve">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {review.status !== 'Hidden' && (
                      <button className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 transition" title="Hide">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setDeleteTarget(review.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {current.length > 0 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {}}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review?"
        confirmText="Delete"
        danger
      />
    </div>
  );
}
