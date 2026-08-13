import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Package, IndianRupee, ShoppingBag, TrendingUp } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useState } from 'react';
import { products, orders } from '@/data/mockData';
import EmptyState from '@/components/EmptyState';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const [showDelete, setShowDelete] = useState(false);

  if (!product) {
    return <EmptyState title="Product not found" message="The product you're looking for doesn't exist." action={<Link to="/admin/products" className="btn-primary">Back to Products</Link>} />;
  }

  const relatedOrders = orders.filter(o => o.items.some(i => i.productId === product.id)).slice(0, 5);

  const stats = [
    { label: 'Total Sales', value: product.sales.toString(), icon: ShoppingBag, color: 'text-saffron-600', bg: 'bg-saffron-50' },
    { label: 'Revenue', value: `₹${(product.sales * product.price).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Current Stock', value: `${product.stock} units`, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div>
      <div className="mb-4">
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-saffron-600 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-800">{product.name}</h1>
          <p className="text-sm text-charcoal-400 mt-1">SKU: {product.sku} · {product.category}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/admin/products/${product.id}/edit`} className="btn-primary">
            <Edit className="w-4 h-4" /> Edit Product
          </Link>
          <button onClick={() => setShowDelete(true)} className="btn-danger">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images */}
        <div className="card p-5 lg:col-span-1">
          <div className="rounded-xl overflow-hidden mb-3 aspect-square">
            <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <div key={i} className="rounded-lg overflow-hidden aspect-square border border-cream-200">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="card p-4">
                  <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="text-xs text-charcoal-400">{s.label}</p>
                  <p className="text-lg font-bold text-charcoal-800 mt-0.5">{s.value}</p>
                </div>
              );
            })}
          </div>

          {/* Product Info */}
          <div className="card p-5">
            <h3 className="text-base font-semibold text-charcoal-800 mb-4">Product Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-cream-100">
                <span className="text-charcoal-400">Price</span>
                <span className="font-medium text-charcoal-700">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
              {product.discountPrice && (
                <div className="flex justify-between py-2 border-b border-cream-100">
                  <span className="text-charcoal-400">Discount Price</span>
                  <span className="font-medium text-saffron-600">₹{product.discountPrice.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-cream-100">
                <span className="text-charcoal-400">Stock</span>
                <span className="font-medium text-charcoal-700">{product.stock} units</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cream-100">
                <span className="text-charcoal-400">SKU</span>
                <span className="font-medium text-charcoal-700">{product.sku}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cream-100">
                <span className="text-charcoal-400">Category</span>
                <span className="font-medium text-charcoal-700">{product.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cream-100">
                <span className="text-charcoal-400">Subcategory</span>
                <span className="font-medium text-charcoal-700">{product.subcategory}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cream-100">
                <span className="text-charcoal-400">Weight</span>
                <span className="font-medium text-charcoal-700">{product.weight}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cream-100">
                <span className="text-charcoal-400">Dimensions</span>
                <span className="font-medium text-charcoal-700">{product.dimensions}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cream-100">
                <span className="text-charcoal-400">Status</span>
                <StatusBadge status={product.status} />
              </div>
              <div className="flex justify-between py-2 border-b border-cream-100">
                <span className="text-charcoal-400">Created</span>
                <span className="font-medium text-charcoal-700">{product.createdAt}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-charcoal-400 mb-1">Description</p>
              <p className="text-sm text-charcoal-600 leading-relaxed">{product.description}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-charcoal-400 mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-cream-100 text-xs text-charcoal-600">#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-cream-200">
              <h3 className="text-base font-semibold text-charcoal-800">Recent Orders</h3>
              <p className="text-sm text-charcoal-400">Orders containing this product</p>
            </div>
            {relatedOrders.length === 0 ? (
              <EmptyState title="No orders yet" message="No orders have been placed for this product." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                      <th className="text-left px-5 py-3 font-medium">Order ID</th>
                      <th className="text-left px-5 py-3 font-medium">Customer</th>
                      <th className="text-left px-5 py-3 font-medium">Qty</th>
                      <th className="text-left px-5 py-3 font-medium">Amount</th>
                      <th className="text-left px-5 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {relatedOrders.map((o) => (
                      <tr key={o.id} className="table-row-hover">
                        <td className="px-5 py-3 font-medium text-charcoal-700">
                          <Link to={`/admin/orders/${o.id}`} className="hover:text-saffron-600">#{o.id}</Link>
                        </td>
                        <td className="px-5 py-3 text-charcoal-600">{o.customerName}</td>
                        <td className="px-5 py-3 text-charcoal-600">{o.items.find(i => i.productId === product.id)?.quantity || 1}</td>
                        <td className="px-5 py-3 font-medium text-charcoal-700">₹{o.total.toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3 text-charcoal-500">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => navigate('/admin/products')}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmText="Delete"
        danger
      />
    </div>
  );
}
