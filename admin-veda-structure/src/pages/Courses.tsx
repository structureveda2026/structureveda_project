import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, GraduationCap, Users, BookOpen, Clock } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import StatusBadge from '@/components/StatusBadge';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import { courses } from '@/data/mockData';

const statusOptions = ['Published', 'Draft', 'Archived'];
const categoryOptions = ['Astrology', 'Spirituality', 'Vastu', 'Numerology', 'Palmistry'];

export default function Courses() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.instructor.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && c.category !== category) return false;
      if (status && c.status !== status) return false;
      return true;
    });
  }, [search, category, status]);

  const perPage = 8;
  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <PageHeader
        title="Courses"
        subtitle="Manage spiritual and astrology courses on Veda Structure."
        actions={<Link to="/admin/courses/new" className="btn-primary"><Plus className="w-4 h-4" /> Add Course</Link>}
      />

      <div className="card p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search courses..." />
          <FilterDropdown value={category} onChange={(v) => { setCategory(v); setPage(1); }} options={categoryOptions} label="All Categories" />
          <FilterDropdown value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={statusOptions} label="All Status" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {current.length === 0 ? (
          <div className="col-span-full"><EmptyState title="No courses found" message="Try adjusting your filters or add a new course." /></div>
        ) : (
          current.map((course) => (
            <div key={course.id} className="card overflow-hidden hover:shadow-elevated transition group">
              <div className="relative h-40 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3"><StatusBadge status={course.status} /></div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-charcoal-800 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-charcoal-400 mt-0.5">by {course.instructor}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-charcoal-500">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-100">
                  <span className="text-lg font-bold text-charcoal-800">₹{course.price.toLocaleString('en-IN')}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link to={`/admin/courses/${course.id}/edit`} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition" title="Edit">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setDeleteTarget(course.id)} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-red-50 hover:text-red-500 transition" title="Delete">
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
        title="Delete Course"
        message="Are you sure you want to delete this course? Enrolled students will lose access."
        confirmText="Delete"
        danger
      />
    </div>
  );
}
