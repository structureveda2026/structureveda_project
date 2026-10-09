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
  Flame,
  ExternalLink,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import YagyaCategoryIcon from "@/components/YagyaCategoryIcon";
import { useToast } from "@/context/ToastContext";
import yagyaCategoryAdminService, {
  AdminYagyaCategory,
} from "@/services/yagyaCategoryAdminService";
import yagyaServiceCatalogueService, {
  AdminYagyaServiceListingItem,
} from "@/services/yagyaServiceCatalogueService";

export default function YagyaCategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [category, setCategory] = useState<AdminYagyaCategory | null>(null);
  const [services, setServices] = useState<AdminYagyaServiceListingItem[]>([]);
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
        const data = await yagyaCategoryAdminService.getCategoryById(id);
        setCategory(data);

        // Fetch associated services for this category
        if (data && data.slug) {
          setServicesLoading(true);
          try {
            const svcRes = await yagyaServiceCatalogueService.getYagyaServices({
              category: data.slug,
              limit: 50,
            });
            if (svcRes && Array.isArray(svcRes.data)) {
              setServices(svcRes.data);
            }
          } catch (svcErr) {
            console.warn("Unable to fetch associated Yagya services:", svcErr);
          } finally {
            setServicesLoading(false);
          }
        }
      } catch (err: unknown) {
        setError((err as Error)?.message || "Unable to load Yagya category details.");
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
      await yagyaCategoryAdminService.deleteCategory(category.id);
      toast.success(`Category "${category.name}" deactivated successfully.`);
      setDeactivateOpen(false);
      // Refresh detail
      const updated = await yagyaCategoryAdminService.getCategoryById(category.id);
      setCategory(updated);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to deactivate Yagya category.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!category) return;
    setActionLoading(true);
    try {
      await yagyaCategoryAdminService.updateCategory(category.id, {
        isActive: true,
      });
      toast.success(`Category "${category.name}" reactivated successfully.`);
      const updated = await yagyaCategoryAdminService.getCategoryById(category.id);
      setCategory(updated);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to reactivate Yagya category.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">
          Loading Yagya category details...
        </p>
      </div>
    );
  }

  if (!category) {
    return (
      <EmptyState
        title="Yagya Category Not Found"
        message={
          error || "The requested Yagya category does not exist or has been removed."
        }
        action={
          <Link to="/admin/yagya/categories" className="btn-secondary">
            Back to Categories
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/yagya/categories"
          className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Yagya Categories</span>
        </Link>
      </div>

      {/* Header */}
      <PageHeader
        title={category.name}
        subtitle={`Public URL: /yagya-puja/yagya/category/${category.slug}`}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              to={`/admin/yagya/categories/${category.id}/edit`}
              className="btn-secondary flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Category</span>
            </Link>

            {category.isActive ? (
              <button
                onClick={() => setDeactivateOpen(true)}
                className="btn-danger flex items-center gap-1.5"
                disabled={actionLoading}
              >
                <Power className="w-4 h-4" />
                <span>Deactivate Category</span>
              </button>
            ) : (
              <button
                onClick={handleReactivate}
                className="btn-primary flex items-center gap-1.5"
                disabled={actionLoading}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Activate Category</span>
              </button>
            )}
          </div>
        }
      />

      {/* Main details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Overview, Image, and Associated Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Banner / Image */}
          <div className="card overflow-hidden">
            {category.image ? (
              <div className="h-64 sm:h-80 w-full overflow-hidden bg-cream-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-48 sm:h-56 w-full bg-saffron-50/60 border-b border-cream-200 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-saffron-100 flex items-center justify-center mb-3">
                  <YagyaCategoryIcon
                    iconName={category.iconName}
                    className="w-8 h-8 text-saffron-600"
                  />
                </div>
                <h3 className="font-semibold text-charcoal-800 text-lg">
                  {category.name}
                </h3>
                <p className="text-xs text-charcoal-400 mt-1 font-mono">
                  {category.slug}
                </p>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saffron-50 border border-saffron-100 flex items-center justify-center">
                    <YagyaCategoryIcon
                      iconName={category.iconName}
                      className="w-5 h-5 text-saffron-600"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-charcoal-900">
                      {category.name}
                    </h2>
                    <p className="text-xs text-charcoal-400 font-mono">
                      /{category.slug}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  status={category.isActive ? "Active" : "Inactive"}
                />
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Description
                </h3>
                <p className="text-sm text-charcoal-700 leading-relaxed whitespace-pre-line bg-cream-50/50 p-4 rounded-xl border border-cream-100">
                  {category.description || (
                    <span className="text-charcoal-300 italic">
                      No detailed description added for this category.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Associated Yagya Services List */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-cream-100 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-saffron-600" />
                <h3 className="font-semibold text-charcoal-900 text-sm">
                  Associated Yagya Services
                </h3>
                <span className="text-xs bg-saffron-50 text-saffron-700 font-medium px-2 py-0.5 rounded-full border border-saffron-200">
                  {services.length}
                </span>
              </div>
              <Link
                to={`/admin/yagya-services?category=${category.slug}`}
                className="text-xs font-medium text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
              >
                <span>Manage Services</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {servicesLoading ? (
              <div className="py-6 flex justify-center">
                <div className="w-5 h-5 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : services.length === 0 ? (
              <p className="text-xs text-charcoal-400 py-3 italic">
                No Yagya services are currently assigned to this category.
              </p>
            ) : (
              <div className="divide-y divide-cream-100 max-h-64 overflow-y-auto">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="py-2.5 flex items-center justify-between text-xs hover:bg-cream-50/50 px-2 rounded-lg transition"
                  >
                    <div>
                      <p className="font-semibold text-charcoal-800">{svc.name}</p>
                      <p className="text-charcoal-400 font-mono text-[11px]">
                        Deity: {svc.deity || "—"} • {svc.formattedPrice || `₹${svc.startingPrice}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={svc.isActive ? "Active" : "Inactive"} />
                      <Link
                        to={`/admin/yagya-services/${svc.id}/edit`}
                        className="text-charcoal-400 hover:text-charcoal-700"
                        title="Edit Service"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service Safety Information Box */}
          <div className="card p-5 border-amber-200 bg-amber-50/60 text-amber-900">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <h4 className="font-semibold text-amber-900">
                  Service Preservation & Safety
                </h4>
                <p className="text-amber-800 mt-1 leading-relaxed text-xs">
                  Deactivating this category will remove it from customer navigation
                  and discovery without deleting any assigned Yagya services.
                  Existing Yagya service bookings and records remain completely safe.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Metadata & Attributes */}
        <div className="space-y-6">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-charcoal-900 border-b border-cream-100 pb-3 text-sm">
              Category Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" /> Display Order
                </span>
                <span className="font-semibold text-charcoal-800 bg-cream-100 px-2 py-0.5 rounded">
                  #{category.displayOrder}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Assigned Icon
                </span>
                <span className="font-medium text-charcoal-800 flex items-center gap-1">
                  <YagyaCategoryIcon
                    iconName={category.iconName}
                    className="w-3.5 h-3.5 text-saffron-600"
                  />
                  {category.iconName || "Flame"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Current Status</span>
                <StatusBadge
                  status={category.isActive ? "Active" : "Inactive"}
                />
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Created Date
                </span>
                <span className="text-charcoal-700 font-mono">
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-charcoal-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Last Updated
                </span>
                <span className="text-charcoal-700 font-mono">
                  {category.updatedAt
                    ? new Date(category.updatedAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="card p-5 space-y-3">
            <h4 className="font-semibold text-xs text-charcoal-900 uppercase tracking-wider">
              Actions
            </h4>
            <div className="space-y-2">
              <Link
                to={`/admin/yagya/categories/${category.id}/edit`}
                className="btn-secondary w-full justify-center text-xs py-2 flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Details
              </Link>
              {category.isActive ? (
                <button
                  onClick={() => setDeactivateOpen(true)}
                  className="btn-danger w-full justify-center text-xs py-2 flex items-center gap-1.5"
                  disabled={actionLoading}
                >
                  <Power className="w-3.5 h-3.5" /> Deactivate Category
                </button>
              ) : (
                <button
                  onClick={handleReactivate}
                  className="btn-primary w-full justify-center text-xs py-2 flex items-center gap-1.5"
                  disabled={actionLoading}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Activate Category
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Deactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={handleDeactivate}
        title="Deactivate Yagya Category"
        message="Deactivating this category will not delete its Yagya services. The category will simply become inactive and hidden from customer discovery."
        confirmText="Deactivate Category"
        danger={true}
      />
    </div>
  );
}
