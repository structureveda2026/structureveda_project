import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Power,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  Hash,
  FileText,
  ExternalLink,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import JapaCategoryIcon from "@/components/JapaCategoryIcon";
import { useToast } from "@/context/ToastContext";
import japaCategoryAdminService, {
  AdminJapaCategory,
} from "@/services/japaCategoryAdminService";
import japaServiceCatalogueService, {
  AdminJapaServiceListingItem,
} from "@/services/japaServiceCatalogueService";

export default function JapaCategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [category, setCategory] = useState<AdminJapaCategory | null>(null);
  const [services, setServices] = useState<AdminJapaServiceListingItem[]>([]);
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
        const data = await japaCategoryAdminService.getCategoryById(id);
        setCategory(data);

        // Fetch associated services for this category
        if (data && data.slug) {
          setServicesLoading(true);
          try {
            const svcRes = await japaServiceCatalogueService.getJapaServices({
              category: data.slug,
              limit: 50,
            });
            if (svcRes && Array.isArray(svcRes.data)) {
              setServices(svcRes.data);
            }
          } catch (svcErr) {
            console.warn("Unable to fetch associated Japa services:", svcErr);
          } finally {
            setServicesLoading(false);
          }
        }
      } catch (err: unknown) {
        setError((err as Error)?.message || "Unable to load Japa category details.");
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
      await japaCategoryAdminService.deleteCategory(category.id);
      toast.success(`Category "${category.name}" deactivated successfully.`);
      setDeactivateOpen(false);
      // Refresh detail
      const updated = await japaCategoryAdminService.getCategoryById(category.id);
      setCategory(updated);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to deactivate Japa category.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!category) return;
    setActionLoading(true);
    try {
      await japaCategoryAdminService.updateCategory(category.id, {
        isActive: true,
      });
      toast.success(`Category "${category.name}" reactivated successfully.`);
      const updated = await japaCategoryAdminService.getCategoryById(category.id);
      setCategory(updated);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to reactivate Japa category.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">
          Loading category details...
        </p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto">
        <Info className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-charcoal-900 mb-1">
          Category Not Found
        </h2>
        <p className="text-sm text-charcoal-600 mb-5">
          {error || "The requested Japa category could not be located."}
        </p>
        <Link to="/admin/japa/categories" className="btn-primary">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/japa/categories"
          className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>
      </div>

      {/* Page Header */}
      <PageHeader
        title={category.name}
        subtitle="Detailed configuration, associated services, and metadata for this Japa category."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/admin/japa/categories/${category.id}/edit`}
              className="btn-secondary flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Category</span>
            </Link>

            {category.isActive ? (
              <button
                onClick={() => setDeactivateOpen(true)}
                className="btn-danger flex items-center gap-1.5 cursor-pointer"
                disabled={actionLoading}
              >
                <Power className="w-4 h-4" />
                <span>Deactivate</span>
              </button>
            ) : (
              <button
                onClick={handleReactivate}
                className="btn-primary flex items-center gap-1.5 cursor-pointer bg-green-600 hover:bg-green-700"
                disabled={actionLoading}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Activate Category</span>
              </button>
            )}
          </div>
        }
      />

      {/* Main Grid: Left Overview, Right Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Metadata Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-5">
            <h2 className="text-base font-semibold text-charcoal-900 border-b border-cream-200 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-saffron-600" />
              Category Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block">
                  Category Name
                </span>
                <span className="font-medium text-charcoal-800 mt-1 block">
                  {category.name}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block">
                  URL Slug
                </span>
                <span className="font-mono text-xs text-charcoal-700 bg-cream-100 px-2 py-0.5 rounded mt-1 inline-block">
                  {category.slug}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block">
                  Status
                </span>
                <div className="mt-1">
                  <StatusBadge
                    status={category.isActive ? "Active" : "Inactive"}
                  />
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block">
                  Display Order
                </span>
                <span className="font-semibold text-charcoal-700 mt-1 inline-flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-charcoal-400" />
                  {category.displayOrder}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block">
                  Configured Icon
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 rounded-lg bg-saffron-50 border border-saffron-200 flex items-center justify-center">
                    <JapaCategoryIcon
                      iconName={category.iconName}
                      className="w-4 h-4 text-saffron-600"
                    />
                  </div>
                  <span className="font-mono text-xs text-charcoal-600">
                    {category.iconName || "Sparkles"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block">
                  Public Customer Route
                </span>
                <span className="font-mono text-xs text-saffron-700 mt-1 block break-all">
                  /yagya-puja/japa/category/{category.slug}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-3 border-t border-cream-200">
              <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block">
                Description
              </span>
              <p className="mt-1.5 text-sm text-charcoal-700 leading-relaxed whitespace-pre-line">
                {category.description || (
                  <span className="italic text-charcoal-400">
                    No description provided for this category.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Associated Services Card */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div>
                <h2 className="text-base font-semibold text-charcoal-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-saffron-600" />
                  Associated Japa Services ({services.length})
                </h2>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Vedic Mantra Japa rituals classified under this category.
                </p>
              </div>
              <Link
                to={`/admin/japa-services?category=${category.slug}`}
                className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 inline-flex items-center gap-1 transition"
              >
                <span>Manage Services</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {servicesLoading ? (
              <div className="py-8 text-center text-xs text-charcoal-400 animate-pulse">
                Loading associated Japa services...
              </div>
            ) : services.length === 0 ? (
              <div className="py-6">
                <EmptyState
                  icon={FileText}
                  title="No Associated Services Found"
                  message={`No Japa services are currently linked to "${category.name}". Services can be assigned to this category from service management.`}
                />
              </div>
            ) : (
              <div className="divide-y divide-cream-100">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/admin/japa-services/${svc.id}`}
                        className="font-semibold text-sm text-charcoal-900 hover:text-saffron-600 transition block truncate"
                      >
                        {svc.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs text-charcoal-500 bg-cream-100 px-1.5 py-0.5 rounded">
                          {svc.slug}
                        </span>
                        {svc.formattedPrice && (
                          <span className="text-xs font-semibold text-saffron-700">
                            Starting {svc.formattedPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge
                        status={svc.isActive ? "Active" : "Inactive"}
                      />
                      <Link
                        to={`/admin/japa-services/${svc.id}`}
                        className="p-1 rounded text-charcoal-400 hover:text-charcoal-700 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visuals & Timestamps */}
        <div className="space-y-6">
          {/* Category Thumbnail Image Card */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-charcoal-900 border-b border-cream-200 pb-2">
              Category Thumbnail
            </h3>

            {category.image ? (
              <div className="rounded-xl overflow-hidden border border-cream-200 bg-cream-50">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-cream-300 p-8 text-center bg-cream-50/50">
                <div className="w-12 h-12 rounded-xl bg-saffron-50 border border-saffron-100 flex items-center justify-center mx-auto mb-2 text-saffron-600">
                  <JapaCategoryIcon
                    iconName={category.iconName}
                    className="w-6 h-6"
                  />
                </div>
                <p className="text-xs text-charcoal-500">
                  No custom thumbnail uploaded. The customer frontend will display a deterministic canonical fallback.
                </p>
              </div>
            )}
          </div>

          {/* System Metadata Card */}
          <div className="card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-charcoal-900 border-b border-cream-200 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-charcoal-400" />
              Audit Timestamps
            </h3>

            <div className="text-xs space-y-2 text-charcoal-600">
              <div className="flex justify-between">
                <span className="text-charcoal-400">Record ID:</span>
                <span className="font-mono text-[11px] text-charcoal-700 truncate max-w-[170px]" title={category.id}>
                  {category.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-400">Created:</span>
                <span>{new Date(category.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-400">Last Updated:</span>
                <span>{new Date(category.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Deactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={handleDeactivate}
        title="Deactivate Japa Category"
        message={`Are you sure you want to deactivate "${category.name}"? This category will be hidden from customer-facing discovery, but all associated Japa service records will remain intact.`}
        confirmText="Deactivate Category"
        danger={true}
      />
    </div>
  );
}
