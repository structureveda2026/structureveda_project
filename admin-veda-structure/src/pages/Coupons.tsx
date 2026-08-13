import { useState } from 'react';
import { Plus, Edit, Trash2, Ticket, Percent, IndianRupee } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { coupons } from '@/data/mockData';

export default function Coupons() {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '', discountType: 'Percentage', discountValue: '', minimumOrder: '',
    maximumDiscount: '', startDate: '', endDate: '', usageLimit: '',
  });

  const openAdd = () => {
    setEditId(null);
    setForm({ code: '', discountType: 'Percentage', discountValue: '', minimumOrder: '', maximumDiscount: '', startDate: '', endDate: '', usageLimit: '' });
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    const c = coupons.find(c => c.id === id);
    if (!c) return;
    setEditId(id);
    setForm({
      code: c.code, discountType: c.discountType, discountValue: c.discountValue.toString(),
      minimumOrder: c.minimumOrder.toString(), maximumDiscount: c.maximumDiscount.toString(),
      startDate: c.startDate, endDate: c.endDate, usageLimit: c.usageLimit.toString(),
    });
    setShowModal(true);
  };

  return (
    <div>
      <PageHeader
        title="Coupons & Offers"
        subtitle="Create and manage discount coupons for your customers."
        actions={<button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Coupon</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="card p-5 hover:shadow-elevated transition group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-saffron-50 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-saffron-600" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-800 text-lg">{coupon.code}</h3>
                  <p className="text-sm text-charcoal-400">
                    {coupon.discountType === 'Percentage' ? (
                      <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> {coupon.discountValue}% OFF</span>
                    ) : (
                      <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {coupon.discountValue} OFF</span>
                    )}
                  </p>
                </div>
              </div>
              <StatusBadge status={coupon.status} />
            </div>
            <div className="space-y-1.5 text-sm text-charcoal-500">
              <div className="flex justify-between"><span>Min Order:</span><span className="font-medium text-charcoal-700">₹{coupon.minimumOrder.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Max Discount:</span><span className="font-medium text-charcoal-700">₹{coupon.maximumDiscount.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Validity:</span><span className="font-medium text-charcoal-700">{coupon.startDate} - {coupon.endDate}</span></div>
              <div className="flex justify-between"><span>Usage:</span><span className="font-medium text-charcoal-700">{coupon.usedCount} / {coupon.usageLimit}</span></div>
            </div>
            <div className="w-full bg-cream-100 rounded-full h-1.5 mt-3">
              <div className="bg-saffron-500 h-1.5 rounded-full" style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }} />
            </div>
            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-cream-100 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => openEdit(coupon.id)} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteTarget(coupon.id)} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-red-50 hover:text-red-500 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Coupon' : 'Add Coupon'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Coupon Code</label>
            <input className="input-field" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="VEDA10" />
          </div>
          <div>
            <label className="label-field">Discount Type</label>
            <select className="input-field" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed Amount</option>
            </select>
          </div>
          <div>
            <label className="label-field">Discount Value</label>
            <input type="number" className="input-field" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} placeholder="10" />
          </div>
          <div>
            <label className="label-field">Minimum Order (₹)</label>
            <input type="number" className="input-field" value={form.minimumOrder} onChange={(e) => setForm({ ...form, minimumOrder: e.target.value })} placeholder="999" />
          </div>
          <div>
            <label className="label-field">Maximum Discount (₹)</label>
            <input type="number" className="input-field" value={form.maximumDiscount} onChange={(e) => setForm({ ...form, maximumDiscount: e.target.value })} placeholder="500" />
          </div>
          <div>
            <label className="label-field">Usage Limit</label>
            <input type="number" className="input-field" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="100" />
          </div>
          <div>
            <label className="label-field">Start Date</label>
            <input type="date" className="input-field" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label className="label-field">End Date</label>
            <input type="date" className="input-field" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
          <button onClick={() => setShowModal(false)} className="btn-primary">{editId ? 'Update' : 'Create'} Coupon</button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {}}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? Existing uses will not be affected."
        confirmText="Delete"
        danger
      />
    </div>
  );
}
