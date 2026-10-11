import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Power,
  CheckCircle2,
  Calendar,
  Flame,
  Info,
  Hash,
  FileText,
  ExternalLink,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import HomaCategoryIcon from "@/components/HomaCategoryIcon";
import { useToast } from "@/context/ToastContext";
import homaCategoryAdminService, {
  AdminHomaCategory,
} from "@/services/homaCategoryAdminService";
import homaServiceCatalogueService, {
  AdminHomaServiceListingItem,
} from "@/services/homaServiceCatalogueService";

export default function HomaCategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [category, setCategory] = useState<AdminHomaCategory | null>(null);
  const [services, setServices] = useState<AdminHomaServiceListingItem[]>([]);
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
        const data = await homaCategoryAdminService.getCategoryById(id);
        setCategory(data);

        // Fetch associated services for this category
        if (data && data.slug) {
          setServicesLoading(true);
          try {
            const svcRes = await homaServiceCatalogueService.getHomaServices({
              category: data.slug,
              limit: 50,
            });
            if (svcRes && Array.isArray(svcRes.data)) {
              setServices(svcRes.data);
            }
          } catch (svcErr) {
            console.warn("Unable to fetch associated Homa services:", svcErr);
          } finally {
            setServicesLoading(false);
          }
        }
      } catch (err: unknown) {
        setError((err as Error)?.message || "Unable to load Homa category details.");
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
      await homaCategoryAdminService.deleteCategory(category.id);
      toast.success(`Category "${category.name}" deactivated successfully.`);
      setDeactivateOpen(false);
      // Refresh detail
      const updated = await homaCategoryAdminService.getCategoryById(category.id);
      setCategory(updated);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to deactivate Homa category.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!category) return;
    setActionLoading(true);
    try {
      await homaCategoryAdminService.updateCategory(category.id, {
        isActive: true,
      });
      toast.success(`Category "${category.name}" reactivated successfully.`);
      const updated = await homaCategoryAdminService.getCategoryById(category.id);
      setCategory(updated);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to reactivate Homa category.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Category Details" subtitle="Loading..." />
        <div className="card p-12 flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Category Not Found"
          subtitle="The requested Homa category does not exist."
        />
        <div className="card p-8">
          <EmptyState
            icon={Info}
            title="Category Not Found"
            message={error || "The category you are looking for does not exist or has been removed."}
            action={{
              label: "Back to Homa Categories",
              to: "/admin/homa/categories",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={category.name}
        subtitle="Vedic Homa / Havan tradition classification, metadata, and associated rituals."
        actions={
          <div className="flex items-center gap-3">
            <Link to="/admin/homa/categories" className="btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to Categories</span>
            </Link>
            <Link
              to={`/admin/homa/categories/${category.id}/edit`}
              className="btn-primary flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Category</span>
            </Link>
            {category.isActive ? (
              <button
                type="button"
                onClick={() => setDeactivateOpen(true)}
                disabled={actionLoading}
                className="btn-secondary border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Power className="w-4 h-4" />
                <span>Deactivate</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReactivate}
                disabled={actionLoading}
                className="btn-secondary border-green-200 text-green-700 hover:bg-green-50 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Reactivate</span>
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Banner Card */}
          <div className="card overflow-hidden">
            {category.image ? (
              <div className="h-56 relative bg-charcoal-900">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-saffron-600 shadow-md">
                    <HomaCategoryIcon
                      iconName={category.iconName}
                      className="w-6 h-6 text-saffron-600"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white drop-shadow-sm">
                      {category.name}
                    </h2>
                    <span className="text-xs font-mono text-saffron-200">
                      /{category.slug}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-r from-saffron-50 to-cream-50 flex items-center gap-4 border-b border-cream-200">
                <div className="w-14 h-14 rounded-2xl bg-white border border-saffron-200 flex items-center justify-center text-saffron-600 shadow-xs flex-shrink-0">
                  <HomaCategoryIcon
                    iconName={category.iconName}
                    className="w-7 h-7 text-saffron-600"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal-900">
                    {category.name}
                  </h2>
                  <span className="text-xs font-mono text-charcoal-500">
                    /{category.slug}
                  </span>
                </div>
              </div>
            )}

            {/* Core Info Body */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Description
                </h3>
                <p className="text-sm text-charcoal-700 leading-relaxed">
                  {category.description || (
                    <span className="italic text-charcoal-400">
                      No descriptive narrative provided for this category.
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-cream-100">
                <div>
                  <span className="text-xs text-charcoal-400 block">
                    Display Order
                  </span>
                  <span className="font-semibold text-charcoal-800 text-sm">
                    {category.displayOrder ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-charcoal-400 block">
                    Icon Name
                  </span>
                  <span className="font-mono text-xs text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded inline-block mt-0.5">
                    {category.iconName || "Flame"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-charcoal-400 block">Status</span>
                  <div className="mt-0.5">
                    <StatusBadge
                      status={category.isActive ? "active" : "inactive"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Associated Services Card */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-cream-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-charcoal-900 text-base flex items-center gap-2">
                  <Flame className="w-4 h-4 text-saffron-600" />
                  <span>Associated Homa Services</span>
                </h3>
                <p className="text-xs text-charcoal-400 mt-0.5">
                  Vedic fire rituals categorized under {category.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-saffron-50 text-saffron-700 border border-saffron-200">
                  {services.length} {services.length === 1 ? "Service" : "Services"}
                </span>
                <Link
                  to={`/admin/homa-services?category=${category.slug}`}
                  className="btn-secondary text-xs py-1 px-2.5"
                  title="View in Homa Services table with category filter"
                >
                  Manage Filtered
                </Link>
              </div>
            </div>

            {servicesLoading ? (
              <div className="p-8 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : services.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-charcoal-500 mb-3">
                  No Homa rituals are currently assigned to this category.
                </p>
                <Link
                  to="/admin/homa-services/new"
                  className="btn-primary text-xs inline-flex items-center gap-1.5"
                >
                  Assign New Homa Service
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-cream-100">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-4 flex items-center justify-between hover:bg-cream-50/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      {svc.bannerImage ? (
                        <img
                          src={svc.bannerImage}
                          alt={svc.name}
                          className="w-10 h-10 rounded-lg object-cover border border-cream-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-saffron-50 border border-saffron-100 flex items-center justify-center text-saffron-600 font-bold text-sm">
                          {svc.name.charAt(0) || "H"}
                        </div>
                      )}
                      <div>
                        <Link
                          to={`/admin/homa-services/${svc.id}`}
                          className="font-medium text-sm text-charcoal-900 hover:text-saffron-600 transition block"
                        >
                          {svc.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono text-charcoal-400">
                            /{svc.slug}
                          </span>
                          <span className="text-xs text-charcoal-300">•</span>
                          <span className="text-xs text-charcoal-500">
                            {svc.formattedPrice || `₹${svc.startingPrice}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge
                        status={svc.isActive ? "active" : "inactive"}
                      />
                      <Link
                        to={`/admin/homa-services/${svc.id}`}
                        className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 rounded-lg transition"
                        title="View Service"
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

        {/* Sidebar / Meta Details (1 Column) */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="card p-5 space-y-3.5">
            <h3 className="font-semibold text-charcoal-900 text-sm border-b border-cream-200 pb-2 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-saffron-600" />
              <span>Record Identifiers</span>
            </h3>

            <div>
              <span className="text-xs text-charcoal-400 block">Category ID</span>
              <span className="font-mono text-xs text-charcoal-700 break-all select-all">
                {category.id}
              </span>
            </div>

            <div>
              <span className="text-xs text-charcoal-400 block">Created At</span>
              <span className="text-xs text-charcoal-700 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>

            <div>
              <span className="text-xs text-charcoal-400 block">Last Updated</span>
              <span className="text-xs text-charcoal-700 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                {category.updatedAt
                  ? new Date(category.updatedAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-charcoal-900 text-sm border-b border-cream-200 pb-2">
              Customer Links
            </h3>
            <p className="text-xs text-charcoal-500">
              Direct destination page for customers to discover rituals under this category:
            </p>
            <a
              href={`/yagya-puja/homa/category/${category.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full text-xs flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Customer Listing</span>
            </a>
          </div>
        </div>
      </div>

      {/* Deactivate Confirm Dialog */}
      <ConfirmDialog
        isOpen={deactivateOpen}
        title="Deactivate Homa Category"
        message={`Are you sure you want to deactivate "${category.name}"? This category will be hidden from customer discovery. Associated Homa services will remain in the database.`}
        confirmLabel={actionLoading ? "Deactivating..." : "Deactivate Category"}
        cancelLabel="Cancel"
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateOpen(false)}
        variant="danger"
      />
    </div>
  );
}
