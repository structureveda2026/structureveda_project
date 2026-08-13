import { useState } from 'react';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import { categories } from '@/data/mockData';

export default function Categories() {
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Organize your products into categories for easier management."
        actions={<button onClick={() => { setEditCat(null); setForm({ name: '', description: '' }); setShowModal(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Add Category</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="card p-5 hover:shadow-elevated transition group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-saffron-50 flex items-center justify-center">
                <FolderTree className="w-5 h-5 text-saffron-600" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => { setEditCat(cat.id); setForm({ name: cat.name, description: cat.description }); setShowModal(true); }} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteTarget(cat.id)} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-red-50 hover:text-red-500 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-charcoal-800">{cat.name}</h3>
            <p className="text-sm text-charcoal-400 mt-1 line-clamp-2">{cat.description}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-100">
              <span className="text-sm text-charcoal-500"><strong className="text-charcoal-700">{cat.productsCount}</strong> products</span>
              <StatusBadge status={cat.status} />
            </div>
            <p className="text-xs text-charcoal-300 mt-2">Created {cat.createdAt}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editCat ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <div>
            <label className="label-field">Category Name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Puja Items" />
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea className="input-field min-h-[80px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Category description" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => setShowModal(false)} className="btn-primary">{editCat ? 'Update' : 'Create'} Category</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {}}
        title="Delete Category"
        message="Are you sure you want to delete this category? Products in this category will need to be reassigned."
        confirmText="Delete"
        danger
      />
    </div>
  );
}
