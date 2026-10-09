import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Power,
  CheckCircle2,
  Calendar,
  BookOpen,
  Info,
  ExternalLink,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import PathCategoryIcon from "@/components/PathCategoryIcon";
import { useToast } from "@/context/ToastContext";
import pathCategoryAdminService, {
  AdminPathCategory,
} from "@/services/pathCategoryAdminService";
import pathServiceCatalogueService, {
  AdminPathServiceListingItem,
} from "@/services/pathServiceCatalogueService";

export default function PathCategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [category, setCategory] = useState<AdminPathCategory | null>(null);
  const [services, setServices] = useState<AdminPathServiceListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [error, setError] = useState("");
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await pathCategoryAdminService.getCategoryById(id);
        setCategory(data);

        // Fetch associated services for this category
        if (data && data.slug) {
          setServicesLoading(true);
          try {
            const svcRes = await pathServiceCatalogueService.getPathServices({
              category: data.slug,
              limit: 50,
            });
            if (svcRes && Array.isArray(svcRes.data)) {
              setServices(svcRes.data);
            }
          } catch (svcErr) {
            console.warn("Unable to fetch associated Path services:", svcErr);
          } finally {
            setServicesLoading(false);
          }
        }
      } catch (err: unknown) {
        setError((err as Error)?.message || "Unable to load Path category details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleDeactivate = async () => {
    if (!category) return;
    setActionLoading(true);
    try {
      await pathCategoryAdminService.deleteCategory(category.id);
      toast.success(`Category "${category.name}" deactivated successfully.`);
      setDeactivateOpen(false);
      const updated = await pathCategoryAdminService.getCategoryById(category.id);
      setCategory(updated);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to deactivate Path category.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!category) return;
    setActionLoading(true);
    try {
      await pathCategoryAdminService.updateCategory(category.id, {
        isActive: true,
      });
      toast.success(`Category "${category.name}" reactivated successfully.`);
      const updated = await pathCategoryAdminService.getCategoryById(category.id);
      setCategory(updated);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to reactivate Path category.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">
          Loading category details...
        </p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <EmptyState
          title="Category Not Found"
          message={error || "The requested Path category could not be found."}
          action={
            <Link
              to="/admin/path/categories"
              className="btn-primary flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Categories
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={category.name}
        subtitle="Liturgical Category for Scripture & Parayan Recitation Services."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/path/categories"
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <Link
              to={`/admin/path/categories/${category.id}/edit`}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" /> Edit Category
            </Link>
            {category.isActive ? (
              <button
                type="button"
                onClick={() => setDeactivateOpen(true)}
                className="btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200 flex items-center gap-2 cursor-pointer"
              >
                <Power className="w-4 h-4" /> Deactivate
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReactivate}
                disabled={actionLoading}
                className="btn-secondary text-green-600 hover:bg-green-50 hover:border-green-200 flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Reactivate
              </button>
            )}
          </div>
        }
      />

      {/* Meta Highlights Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">
            Status
          </p>
          <div className="mt-1">
            <StatusBadge status={category.isActive ? "active" : "inactive"} />
          </div>
        </div>

        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">
            Display Order
          </p>
          <p className="text-2xl font-bold text-charcoal-800 font-mono">
            {category.displayOrder ?? 0}
          </p>
        </div>

        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">
            Associated Recitations
          </p>
          <p className="text-2xl font-bold text-charcoal-800 font-mono">
            {servicesLoading ? "..." : services.length}
          </p>
        </div>

        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">
            Category Icon
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-7 h-7 rounded-lg bg-saffron-50 border border-saffron-100 flex items-center justify-center text-saffron-600">
              <PathCategoryIcon iconName={category.iconName} className="w-4 h-4 text-saffron-600" />
            </div>
            <span className="text-xs font-medium text-charcoal-600">
              {category.iconName || "BookOpen"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Details and Banner Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 md:col-span-2 space-y-4">
          <h3 className="text-base font-semibold text-charcoal-800 border-b border-cream-100 pb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-saffron-600" />
            Category Specification
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-medium text-charcoal-400 block mb-0.5">
                Category Title
              </span>
              <p className="font-semibold text-charcoal-800 text-base">
                {category.name}
              </p>
            </div>

            <div>
              <span className="text-xs font-medium text-charcoal-400 block mb-0.5">
                URL Identifier (Slug)
              </span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-xs bg-cream-100 px-2 py-1 rounded text-charcoal-700">
                  {category.slug}
                </code>
                <a
                  href={`/yagya-puja/path/category/${category.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-saffron-600 hover:underline inline-flex items-center gap-1"
                >
                  View on Customer Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div>
              <span className="text-xs font-medium text-charcoal-400 block mb-0.5">
                Description
              </span>
              <p className="text-charcoal-600 leading-relaxed text-sm bg-cream-50/50 p-3 rounded-lg border border-cream-100">
                {category.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-cream-100 text-xs text-charcoal-500">
              <div>
                <span className="block font-medium text-charcoal-400">Created:</span>
                <span className="inline-flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleString("en-IN")
                    : "—"}
                </span>
              </div>
              <div>
                <span className="block font-medium text-charcoal-400">Last Updated:</span>
                <span className="inline-flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                  {category.updatedAt
                    ? new Date(category.updatedAt).toLocaleString("en-IN")
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image Column */}
        <div className="card p-6 flex flex-col items-center justify-start text-center">
          <h3 className="text-sm font-semibold text-charcoal-800 w-full text-left border-b border-cream-100 pb-3 mb-4">
            Featured Banner
          </h3>
          {category.image ? (
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-cream-200 bg-cream-50">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-cream-200 flex flex-col items-center justify-center text-charcoal-400 bg-cream-50/50">
              <BookOpen className="w-10 h-10 text-charcoal-300 mb-2" />
              <span className="text-xs">No image uploaded</span>
            </div>
          )}
          <p className="text-[11px] text-charcoal-400 mt-3 text-left w-full">
            Image shown on customer category discovery cards and hero banners.
          </p>
        </div>
      </div>

      {/* Associated Services Table */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-cream-100 pb-3">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-saffron-600" />
            Path Services Assigned to this Category ({services.length})
          </h3>
          <Link
            to="/admin/path-services/new"
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            Create Recitation Service
          </Link>
        </div>

        {servicesLoading ? (
          <div className="py-8 text-center text-xs text-charcoal-400">
            Loading associated recitations...
          </div>
        ) : services.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-charcoal-500">
              No Path services are currently assigned to this category.
            </p>
            <p className="text-xs text-charcoal-400 mt-1">
              You can assign services to this category when creating or editing them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cream-100 bg-cream-50/50 text-charcoal-400 font-semibold uppercase tracking-wider">
                  <th className="px-3 py-2.5">Service Name</th>
                  <th className="px-3 py-2.5">Classification</th>
                  <th className="px-3 py-2.5">Scripture</th>
                  <th className="px-3 py-2.5">Starting Price</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-cream-50/40">
                    <td className="px-3 py-2.5 font-medium text-charcoal-800">
                      <Link
                        to={`/admin/path-services/${svc.id}`}
                        className="hover:text-saffron-600 transition"
                      >
                        {svc.name}
                      </Link>
                      <span className="block text-[10px] text-charcoal-400 font-mono">
                        /{svc.slug}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-charcoal-600">
                      {svc.pathType || "Vedic Path"}
                    </td>
                    <td className="px-3 py-2.5 text-charcoal-600">
                      {svc.scripture || "—"}
                    </td>
                    <td className="px-3 py-2.5 font-mono font-medium text-charcoal-800">
                      ₹{svc.startingPrice?.toLocaleString("en-IN") || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <StatusBadge status={svc.isActive ? "active" : "inactive"} />
                    </td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/path-services/${svc.id}`}
                          className="text-saffron-600 hover:underline font-medium"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/path-services/${svc.id}/edit`}
                          className="text-charcoal-500 hover:text-charcoal-700"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deactivate Modal */}
      <ConfirmDialog
        open={deactivateOpen}
        title="Deactivate Path Category?"
        message={`Are you sure you want to deactivate "${category.name}"? This category will be hidden from public discovery pages and filter options. Any assigned Path services will remain active and intact.`}
        confirmLabel="Deactivate Category"
        cancelLabel="Keep Active"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateOpen(false)}
      />
    </div>
  );
}
