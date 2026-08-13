import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Copy } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import StatusBadge from '@/components/StatusBadge';
import ActionMenu from '@/components/ActionMenu';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import { products, categories } from '@/data/mockData';

const statusOptions = ['Active', 'Draft', 'Out of Stock'];
const stockOptions = ['In Stock', 'Low Stock', 'Out of Stock'];
const priceRanges = ['Under ₹500', '₹500 - ₹2000', 'Above ₹2000'];

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && p.category !== category) return false;
      if (status && p.status !== status) return false;
      if (stock === 'In Stock' && p.stock <= p.lowStockThreshold) return false;
      if (stock === 'Low Stock' && (p.stock > p.lowStockThreshold || p.stock === 0)) return false;
      if (stock === 'Out of Stock' && p.stock !== 0) return false;
      if (price === 'Under ₹500' && p.price >= 500) return false;
      if (price === '₹500 - ₹2000' && (p.price < 500 || p.price > 2000)) return false;
      if (price === 'Above ₹2000' && p.price <= 2000) return false;
      return true;
    });
  }, [search, category, status, stock, price]);

  const perPage = 8;
  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage spiritual products available on Veda Structure."
        actions={
          <Link to="/admin/products/new" className="btn-primary">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        }
      />

      {/* Filters */}
      <div className="card p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search products..." className="lg:col-span-1" />
          <FilterDropdown value={category} onChange={(v) => { setCategory(v); setPage(1); }} options={categories.map(c => c.name)} label="All Categories" />
          <FilterDropdown value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={statusOptions} label="All Status" />
          <FilterDropdown value={stock} onChange={(v) => { setStock(v); setPage(1); }} options={stockOptions} label="All Stock" />
          <FilterDropdown value={price} onChange={(v) => { setPrice(v); setPage(1); }} options={priceRanges} label="All Prices" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {current.length === 0 ? (
          <EmptyState title="No products found" message="Try adjusting your filters or add a new product." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Image</th>
                  <th className="text-left px-5 py-3 font-medium">Product Name</th>
                  <th className="text-left px-5 py-3 font-medium">Category</th>
                  <th className="text-left px-5 py-3 font-medium">Price</th>
                  <th className="text-left px-5 py-3 font-medium">Stock</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Created</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {current.map((p) => (
                  <tr key={p.id} className="table-row-hover">
                    <td className="px-5 py-3">
                      <img src={p.thumbnail} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                    </td>
                    <td className="px-5 py-3">
                      <Link to={`/admin/products/${p.id}`} className="font-medium text-charcoal-700 hover:text-saffron-600 transition">
                        {p.name}
                      </Link>
                      <p className="text-xs text-charcoal-400 mt-0.5">{p.sku}</p>
                    </td>
                    <td className="px-5 py-3 text-charcoal-600">{p.category}</td>
                    <td className="px-5 py-3">
                      <span className="font-medium text-charcoal-700">₹{p.price.toLocaleString('en-IN')}</span>
                      {p.discountPrice && <p className="text-xs text-charcoal-400 line-through">₹{p.discountPrice.toLocaleString('en-IN')}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={p.stock === 0 ? 'text-red-500 font-medium' : p.stock <= p.lowStockThreshold ? 'text-amber-600 font-medium' : 'text-charcoal-600'}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3 text-charcoal-500">{p.createdAt}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/products/${p.id}`} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition" title="View">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link to={`/admin/products/${p.id}/edit`} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleteTarget(p.id)} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-red-50 hover:text-red-500 transition" title="Delete">
                          <Trash2 className="w-4 h-4" />
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

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { setDeleteTarget(null); }}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </div>
  );
}
