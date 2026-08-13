import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { products, categories } from '@/data/mockData';
import type { Product } from '@/types';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const existing = isEdit ? products.find((p) => p.id === id) : undefined;

  const [form, setForm] = useState({
    name: existing?.name || '',
    sku: existing?.sku || '',
    category: existing?.category || '',
    subcategory: existing?.subcategory || '',
    description: existing?.description || '',
    shortDescription: existing?.shortDescription || '',
    price: existing?.price?.toString() || '',
    discountPrice: existing?.discountPrice?.toString() || '',
    stock: existing?.stock?.toString() || '',
    lowStockThreshold: existing?.lowStockThreshold?.toString() || '',
    weight: existing?.weight || '',
    dimensions: existing?.dimensions || '',
    tags: existing?.tags?.join(', ') || '',
    status: existing?.status || 'Draft',
    metaTitle: existing?.metaTitle || '',
    metaDescription: existing?.metaDescription || '',
    slug: existing?.slug || '',
  });
  const [images, setImages] = useState<string[]>(existing?.images || []);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent, asDraft: boolean) => {
    e.preventDefault();
    navigate('/admin/products');
  };

  return (
    <div>
      <div className="mb-4">
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-saffron-600 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
      <PageHeader
        title={isEdit ? 'Edit Product' : 'Add New Product'}
        subtitle={isEdit ? 'Update product information and inventory.' : 'Create a new spiritual product for your catalog.'}
      />

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Basic Information */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Product Name <span className="text-red-500">*</span></label>
              <input className="input-field" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Premium Rudraksha Mala" required />
            </div>
            <div>
              <label className="label-field">SKU <span className="text-red-500">*</span></label>
              <input className="input-field" value={form.sku} onChange={(e) => update('sku', e.target.value)} placeholder="e.g. RUDK-001" required />
            </div>
            <div>
              <label className="label-field">Category <span className="text-red-500">*</span></label>
              <select className="input-field" value={form.category} onChange={(e) => update('category', e.target.value)} required>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Subcategory</label>
              <input className="input-field" value={form.subcategory} onChange={(e) => update('subcategory', e.target.value)} placeholder="e.g. Mala" />
            </div>
            <div className="md:col-span-2">
              <label className="label-field">Short Description</label>
              <input className="input-field" value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} placeholder="One-line product summary" />
            </div>
            <div className="md:col-span-2">
              <label className="label-field">Description <span className="text-red-500">*</span></label>
              <textarea className="input-field min-h-[120px] resize-y" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Detailed product description" required />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4">Pricing & Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label-field">Price (₹) <span className="text-red-500">*</span></label>
              <input type="number" className="input-field" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="1299" required />
            </div>
            <div>
              <label className="label-field">Discount Price (₹)</label>
              <input type="number" className="input-field" value={form.discountPrice} onChange={(e) => update('discountPrice', e.target.value)} placeholder="999" />
            </div>
            <div>
              <label className="label-field">Stock Quantity <span className="text-red-500">*</span></label>
              <input type="number" className="input-field" value={form.stock} onChange={(e) => update('stock', e.target.value)} placeholder="45" required />
            </div>
            <div>
              <label className="label-field">Low Stock Threshold</label>
              <input type="number" className="input-field" value={form.lowStockThreshold} onChange={(e) => update('lowStockThreshold', e.target.value)} placeholder="10" />
            </div>
            <div>
              <label className="label-field">Weight</label>
              <input className="input-field" value={form.weight} onChange={(e) => update('weight', e.target.value)} placeholder="e.g. 120g" />
            </div>
            <div>
              <label className="label-field">Dimensions</label>
              <input className="input-field" value={form.dimensions} onChange={(e) => update('dimensions', e.target.value)} placeholder="e.g. 45cm length" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4">Product Images</h3>
          <div className="flex flex-wrap gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative w-28 h-28 rounded-xl overflow-hidden border border-cream-200 group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-charcoal-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <label className="w-28 h-28 rounded-xl border-2 border-dashed border-cream-300 flex flex-col items-center justify-center gap-1.5 text-charcoal-400 hover:border-saffron-400 hover:text-saffron-500 cursor-pointer transition">
              <UploadCloud className="w-6 h-6" />
              <span className="text-xs">Upload</span>
            </label>
          </div>
        </div>

        {/* Tags & Status */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4">Tags & Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label-field">Tags</label>
              <input className="input-field" value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="rudraksha, mala, meditation (comma separated)" />
            </div>
            <div>
              <label className="label-field">Product Status</label>
              <select className="input-field" value={form.status} onChange={(e) => update('status', e.target.value)}>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4">SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Meta Title</label>
              <input className="input-field" value={form.metaTitle} onChange={(e) => update('metaTitle', e.target.value)} placeholder="Premium Rudraksha Mala - Veda Structure" />
            </div>
            <div>
              <label className="label-field">Slug</label>
              <input className="input-field" value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="premium-rudraksha-mala" />
            </div>
            <div className="md:col-span-2">
              <label className="label-field">Meta Description</label>
              <textarea className="input-field min-h-[80px] resize-y" value={form.metaDescription} onChange={(e) => update('metaDescription', e.target.value)} placeholder="Buy authentic 5 Mukhi Rudraksha Mala online" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
          <Link to="/admin/products" className="btn-secondary w-full sm:w-auto">Cancel</Link>
          <button type="button" onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)} className="btn-secondary w-full sm:w-auto">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button type="submit" className="btn-primary w-full sm:w-auto">
            {isEdit ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
