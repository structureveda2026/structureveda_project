import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Power,
  Trash2,
  RefreshCw,
  AlertCircle,
  Package,
  CheckCircle2,
  Tag,
  Clock,
  Sparkles,
  DollarSign,
  Search,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import StatCard from "@/components/StatCard";
import { useToast } from "@/context/ToastContext";
import astrologerAdminService, {
  AdminAstrologer,
  AstrologerPackage,
  CreatePackageInput,
  UpdatePackageInput,
} from "@/services/astrologerAdminService";

interface PackageFormData {
  packageKey: string;
  title: string;
  subtitle: string;
  duration: string;
  price: string;
  originalPrice: string;
  isPopular: boolean;
  badge: string;
  knownFor: string[];
  consultationDetails: string[];
  displayOrder: number;
  isActive: boolean;
}

const initialFormData: PackageFormData = {
  packageKey: "",
  title: "",
  subtitle: "",
  duration: "",
  price: "",
  originalPrice: "",
  isPopular: false,
  badge: "",
  knownFor: [],
  consultationDetails: [],
  displayOrder: 0,
  isActive: true,
};

export default function AstrologerPackages() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [astrologer, setAstrologer] = useState<AdminAstrologer | null>(null);
  const [packages, setPackages] = useState<AstrologerPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("displayOrder-asc");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<AstrologerPackage | null>(null);
  const [formData, setFormData] = useState<PackageFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Temporary inputs for array fields
  const [knownForInput, setKnownForInput] = useState("");
  const [detailInput, setDetailInput] = useState("");

  // Action states for confirm dialogs
  const [statusTarget, setStatusTarget] = useState<AstrologerPackage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AstrologerPackage | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      // Load astrologer profile
      const astroRes = await astrologerAdminService.getAstrologerById(id);
      if (astroRes?.data) {
        setAstrologer(astroRes.data);
      } else {
        setError("Astrologer not found.");
        return;
      }

      // Load packages with current filters
      const pkgRes = await astrologerAdminService.getAstrologerPackages(id, {
        search,
        isActive: statusFilter,
        sortBy,
      });
      if (pkgRes?.data) {
        setPackages(pkgRes.data);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load consultation packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, search, statusFilter, sortBy]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPackage(null);
    setFormData({
      ...initialFormData,
      displayOrder: packages.length,
    });
    setFormErrors({});
    setKnownForInput("");
    setDetailInput("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (pkg: AstrologerPackage) => {
    setEditingPackage(pkg);
    setFormData({
      packageKey: pkg.packageKey,
      title: pkg.title,
      subtitle: pkg.subtitle || "",
      duration: pkg.duration,
      price: String(pkg.price),
      originalPrice: pkg.originalPrice ? String(pkg.originalPrice) : "",
      isPopular: Boolean(pkg.isPopular),
      badge: pkg.badge || "",
      knownFor: Array.isArray(pkg.knownFor) ? [...pkg.knownFor] : [],
      consultationDetails: Array.isArray(pkg.consultationDetails)
        ? [...pkg.consultationDetails]
        : [],
      displayOrder: pkg.displayOrder || 0,
      isActive: Boolean(pkg.isActive),
    });
    setFormErrors({});
    setKnownForInput("");
    setDetailInput("");
    setIsModalOpen(true);
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!editingPackage) {
      if (!formData.packageKey.trim()) {
        errors.packageKey = "Package key is required (e.g., 'essential', 'vip-destiny').";
      } else if (!/^[a-zA-Z0-9_-]{2,50}$/.test(formData.packageKey.trim())) {
        errors.packageKey =
          "Package key must contain only letters, numbers, dashes, and underscores (2-50 characters).";
      }
    }

    if (!formData.title.trim()) {
      errors.title = "Package title is required.";
    } else if (formData.title.trim().length > 150) {
      errors.title = "Package title cannot exceed 150 characters.";
    }

    if (!formData.duration.trim()) {
      errors.duration = "Duration is required (e.g., '30 Minutes', '60 Minutes (1 Hr)').";
    }

    if (formData.price === "" || formData.price === undefined) {
      errors.price = "Price is required.";
    } else {
      const p = parseFloat(formData.price);
      if (isNaN(p) || p < 0) {
        errors.price = "Price must be a valid non-negative number.";
      }
    }

    if (formData.originalPrice.trim()) {
      const op = parseFloat(formData.originalPrice);
      if (isNaN(op) || op < 0) {
        errors.originalPrice = "Original price must be a valid non-negative number.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Create / Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !validateForm()) return;

    setSubmitting(true);
    try {
      if (editingPackage) {
        // Update
        const payload: UpdatePackageInput = {
          title: formData.title.trim(),
          subtitle: formData.subtitle.trim() || null,
          duration: formData.duration.trim(),
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice.trim()
            ? parseFloat(formData.originalPrice)
            : null,
          isPopular: formData.isPopular,
          badge: formData.badge.trim() || null,
          knownFor: formData.knownFor,
          consultationDetails: formData.consultationDetails,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };

        await astrologerAdminService.updateAstrologerPackage(
          id,
          editingPackage.id,
          payload
        );
        toast.success(`Package "${formData.title}" updated successfully.`);
      } else {
        // Create
        const payload: CreatePackageInput = {
          packageKey: formData.packageKey.trim().toLowerCase(),
          title: formData.title.trim(),
          subtitle: formData.subtitle.trim() || null,
          duration: formData.duration.trim(),
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice.trim()
            ? parseFloat(formData.originalPrice)
            : null,
          isPopular: formData.isPopular,
          badge: formData.badge.trim() || null,
          knownFor: formData.knownFor,
          consultationDetails: formData.consultationDetails,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };

        await astrologerAdminService.createAstrologerPackage(id, payload);
        toast.success(`Package "${formData.title}" created successfully.`);
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save consultation package.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Package Active Status
  const handleToggleStatus = async () => {
    if (!id || !statusTarget) return;
    setActionLoading(true);
    try {
      const newStatus = !statusTarget.isActive;
      await astrologerAdminService.updateAstrologerPackageStatus(
        id,
        statusTarget.id,
        newStatus
      );
      toast.success(
        `Package "${statusTarget.title}" has been ${
          newStatus ? "activated" : "deactivated"
        }.`
      );
      setStatusTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update package status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Package
  const handleDeletePackage = async () => {
    if (!id || !deleteTarget) return;
    setActionLoading(true);
    try {
      await astrologerAdminService.deleteAstrologerPackage(id, deleteTarget.id);
      toast.success(`Package "${deleteTarget.title}" removed successfully.`);
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(
        err?.message ||
          "Cannot delete package. It may be referenced by customer bookings. Deactivate it instead."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Tag Add/Remove Helpers
  const handleAddKnownFor = () => {
    const val = knownForInput.trim();
    if (val && !formData.knownFor.includes(val)) {
      setFormData({
        ...formData,
        knownFor: [...formData.knownFor, val],
      });
      setKnownForInput("");
    }
  };

  const handleRemoveKnownFor = (tagToRemove: string) => {
    setFormData({
      ...formData,
      knownFor: formData.knownFor.filter((t) => t !== tagToRemove),
    });
  };

  const handleAddDetail = () => {
    const val = detailInput.trim();
    if (val && !formData.consultationDetails.includes(val)) {
      setFormData({
        ...formData,
        consultationDetails: [...formData.consultationDetails, val],
      });
      setDetailInput("");
    }
  };

  const handleRemoveDetail = (idx: number) => {
    setFormData({
      ...formData,
      consultationDetails: formData.consultationDetails.filter((_, i) => i !== idx),
    });
  };

  // Calculate quick stats
  const activeCount = packages.filter((p) => p.isActive).length;
  const prices = packages
    .filter((p) => p.isActive)
    .map((p) => Number(p.price))
    .filter((pr) => !isNaN(pr));
  const startingPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const avgPrice =
    prices.length > 0
      ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
      : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/admin/astrologers/${id}`}
          className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {astrologer?.name || "Astrologer Profile"}</span>
        </Link>

        {astrologer?.slug && (
          <a
            href={`http://localhost:5173/astrologer/${astrologer.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-saffron-600 hover:text-saffron-700 font-medium"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageHeader
            title={`${astrologer?.name || "Astrologer"} — Consultation Packages`}
            description="Manage consultation tiers, pricing, duration, features, and active availability for this astrologer."
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-medium rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Consultation Package</span>
        </button>
      </div>

      {/* Info notice about booking safety */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Consultation Pricing Safety:</span> Package
          records configured here are actively published to the public astrologer
          APIs and catalog views. Existing customer bookings are safely linked and
          protected from accidental deletion.
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Packages"
          value={packages.length}
          icon={Package}
        />
        <StatCard
          title="Active Tiers"
          value={activeCount}
          icon={CheckCircle2}
        />
        <StatCard
          title="Starting Price"
          value={startingPrice ? `₹${startingPrice.toLocaleString("en-IN")}` : "N/A"}
          icon={DollarSign}
        />
        <StatCard
          title="Average Price"
          value={avgPrice ? `₹${avgPrice.toLocaleString("en-IN")}` : "N/A"}
          icon={Sparkles}
        />
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-cream-200 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search packages by title, key, or duration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500/20 focus:border-saffron-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-cream-50/50 border border-cream-200 rounded-lg px-3 py-2 text-charcoal-700 focus:outline-none focus:border-saffron-500"
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-cream-50/50 border border-cream-200 rounded-lg px-3 py-2 text-charcoal-700 focus:outline-none focus:border-saffron-500"
          >
            <option value="displayOrder-asc">Sort: Display Order</option>
            <option value="price-asc">Sort: Price (Low to High)</option>
            <option value="price-desc">Sort: Price (High to Low)</option>
            <option value="title-asc">Sort: Title (A-Z)</option>
            <option value="created-newest">Sort: Newest First</option>
          </select>

          <button
            onClick={() => loadData()}
            className="p-2 border border-cream-200 rounded-lg hover:bg-cream-100 text-charcoal-500 transition cursor-pointer"
            title="Refresh packages"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadData}
            className="px-2.5 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded font-medium transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Packages Grid */}
      {loading ? (
        <div className="p-16 text-center text-charcoal-400 bg-white rounded-xl border border-cream-200 shadow-sm">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-saffron-600" />
          <p className="text-sm">Loading consultation packages...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white rounded-xl border border-cream-200 shadow-sm p-8">
          <EmptyState
            title="No consultation packages found"
            description={
              search || statusFilter
                ? "No package matches your filter criteria."
                : "No packages have been created for this astrologer yet."
            }
            icon={Package}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-xl border p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between ${
                pkg.isActive
                  ? "border-cream-200"
                  : "border-cream-200/60 bg-cream-50/30 opacity-80"
              }`}
            >
              <div className="space-y-3">
                {/* Header: Title, Key, Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-charcoal-900 text-base">
                        {pkg.title}
                      </h3>
                      {pkg.isPopular && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-amber-500 text-white rounded-full">
                          Popular
                        </span>
                      )}
                      {pkg.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-saffron-100 text-saffron-800 rounded-md">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-charcoal-400">
                      <span className="font-mono bg-cream-100 px-1.5 py-0.5 rounded text-[11px] text-charcoal-600">
                        key: {pkg.packageKey}
                      </span>
                      <span>•</span>
                      <span>Order: {pkg.displayOrder}</span>
                    </div>
                  </div>

                  <StatusBadge status={pkg.isActive ? "Active" : "Inactive"} />
                </div>

                {/* Duration & Pricing */}
                <div className="p-3 bg-cream-50/60 rounded-lg border border-cream-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-charcoal-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-saffron-600" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    {pkg.originalPrice && (
                      <span className="text-xs text-charcoal-400 line-through">
                        ₹{Number(pkg.originalPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                    <span className="text-base font-bold text-saffron-700">
                      ₹{Number(pkg.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Subtitle */}
                {pkg.subtitle && (
                  <p className="text-xs text-charcoal-600 italic">
                    &ldquo;{pkg.subtitle}&rdquo;
                  </p>
                )}

                {/* Known For Tags */}
                {pkg.knownFor && pkg.knownFor.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 block mb-1">
                      Best Suited For:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.knownFor.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs bg-saffron-50 text-saffron-800 rounded border border-saffron-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deliverables / Details Checklist */}
                {pkg.consultationDetails && pkg.consultationDetails.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 block mb-1">
                      Deliverables Included:
                    </span>
                    <ul className="space-y-1 text-xs text-charcoal-600">
                      {pkg.consultationDetails.map((det, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{det}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-cream-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-charcoal-400">
                  ID: {pkg.id.slice(0, 8)}...
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Status Toggle */}
                  <button
                    onClick={() => setStatusTarget(pkg)}
                    className={`p-1.5 rounded-lg transition cursor-pointer text-xs flex items-center gap-1 px-2.5 ${
                      pkg.isActive
                        ? "text-green-700 bg-green-50 hover:bg-green-100"
                        : "text-charcoal-600 bg-cream-100 hover:bg-cream-200"
                    }`}
                    title={pkg.isActive ? "Deactivate Package" : "Activate Package"}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{pkg.isActive ? "Active" : "Inactive"}</span>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="p-1.5 text-charcoal-600 hover:text-saffron-600 hover:bg-cream-100 rounded-lg transition cursor-pointer"
                    title="Edit Package"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteTarget(pkg)}
                    className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingPackage ? `Edit Consultation Package` : `Create Consultation Package`}
        size="lg"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4 text-sm">
          {/* Package Key & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Package Identifier Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. essential, complete, vip-destiny"
                value={formData.packageKey}
                disabled={Boolean(editingPackage)}
                onChange={(e) =>
                  setFormData({ ...formData, packageKey: e.target.value })
                }
                className={`w-full px-3 py-2 text-sm bg-cream-50/50 border rounded-lg focus:outline-none transition ${
                  formErrors.packageKey
                    ? "border-red-400"
                    : "border-cream-200 focus:border-saffron-500"
                } ${editingPackage ? "opacity-60 cursor-not-allowed bg-cream-100" : ""}`}
              />
              {formErrors.packageKey && (
                <p className="text-xs text-red-600 mt-1">{formErrors.packageKey}</p>
              )}
              {editingPackage && (
                <p className="text-[11px] text-charcoal-400 mt-1">
                  Key cannot be changed to prevent breaking existing booking references.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Package Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Essential Vedic Clarity"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 text-sm bg-cream-50/50 border rounded-lg focus:outline-none transition ${
                  formErrors.title
                    ? "border-red-400"
                    : "border-cream-200 focus:border-saffron-500"
                }`}
              />
              {formErrors.title && (
                <p className="text-xs text-red-600 mt-1">{formErrors.title}</p>
              )}
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Subtitle / Overview Tagline
            </label>
            <input
              type="text"
              placeholder="e.g. Quick clarity on 1-2 pressing life questions"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:border-saffron-500 transition"
            />
          </div>

          {/* Duration, Price, Original Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 30 Minutes"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className={`w-full px-3 py-2 text-sm bg-cream-50/50 border rounded-lg focus:outline-none transition ${
                  formErrors.duration
                    ? "border-red-400"
                    : "border-cream-200 focus:border-saffron-500"
                }`}
              />
              {formErrors.duration && (
                <p className="text-xs text-red-600 mt-1">{formErrors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Consultation Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 1100"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full px-3 py-2 text-sm bg-cream-50/50 border rounded-lg focus:outline-none transition ${
                  formErrors.price
                    ? "border-red-400"
                    : "border-cream-200 focus:border-saffron-500"
                }`}
              />
              {formErrors.price && (
                <p className="text-xs text-red-600 mt-1">{formErrors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Original Price / MRP (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 1500 (strikethrough)"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
                className={`w-full px-3 py-2 text-sm bg-cream-50/50 border rounded-lg focus:outline-none transition ${
                  formErrors.originalPrice
                    ? "border-red-400"
                    : "border-cream-200 focus:border-saffron-500"
                }`}
              />
              {formErrors.originalPrice && (
                <p className="text-xs text-red-600 mt-1">
                  {formErrors.originalPrice}
                </p>
              )}
            </div>
          </div>

          {/* Badge, Display Order, Popular toggle, Active toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Highlight Badge (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Best Value, Recommended"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:border-saffron-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:border-saffron-500 transition"
              />
            </div>

            <div className="flex flex-col justify-end space-y-2 pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-charcoal-700">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) =>
                    setFormData({ ...formData, isPopular: e.target.checked })
                  }
                  className="rounded border-cream-300 text-saffron-600 focus:ring-saffron-500"
                />
                <span>Popular Tier</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-charcoal-700">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-cream-300 text-saffron-600 focus:ring-saffron-500"
                />
                <span>Active / Published</span>
              </label>
            </div>
          </div>

          {/* Known For Tags */}
          <div className="border-t border-cream-100 pt-3">
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Best Suited For / Known For (Tags)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Type tag (e.g., Kundali Matching, Career)..."
                value={knownForInput}
                onChange={(e) => setKnownForInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKnownFor();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:border-saffron-500"
              />
              <button
                type="button"
                onClick={handleAddKnownFor}
                className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-charcoal-700 text-xs font-medium rounded-lg transition"
              >
                Add Tag
              </button>
            </div>

            {formData.knownFor.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {formData.knownFor.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs bg-saffron-50 text-saffron-800 rounded border border-saffron-200"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKnownFor(tag)}
                      className="text-saffron-500 hover:text-saffron-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Consultation Deliverables */}
          <div className="border-t border-cream-100 pt-3">
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Included Deliverables / Highlights
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. 30-min one-on-one session with Prashna chart"
                value={detailInput}
                onChange={(e) => setDetailInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddDetail();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:border-saffron-500"
              />
              <button
                type="button"
                onClick={handleAddDetail}
                className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-charcoal-700 text-xs font-medium rounded-lg transition"
              >
                Add Deliverable
              </button>
            </div>

            {formData.consultationDetails.length > 0 && (
              <ul className="space-y-1 max-h-32 overflow-y-auto text-xs text-charcoal-700">
                {formData.consultationDetails.map((det, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-1.5 rounded bg-cream-50 border border-cream-100"
                  >
                    <span className="flex-1 pr-2">{det}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDetail(idx)}
                      className="text-charcoal-400 hover:text-red-600 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={submitting}
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-charcoal-600 hover:bg-cream-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-saffron-600 hover:bg-saffron-700 text-white font-medium text-sm rounded-lg shadow-xs transition"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>
                  {editingPackage ? "Update Package" : "Create Package"}
                </span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog: Status Toggle */}
      <ConfirmDialog
        isOpen={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleToggleStatus}
        title={
          statusTarget?.isActive
            ? `Deactivate ${statusTarget?.title}?`
            : `Activate ${statusTarget?.title}?`
        }
        message={
          statusTarget?.isActive
            ? `Deactivating this package will hide it from the public booking and pricing tables. Existing customer bookings referencing this package remain completely intact.`
            : `Activating this package will make it available to clients on the public website and booking flows.`
        }
        confirmText={
          statusTarget?.isActive ? "Deactivate Package" : "Activate Package"
        }
        confirmVariant={statusTarget?.isActive ? "danger" : "primary"}
        loading={actionLoading}
      />

      {/* Confirmation Dialog: Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeletePackage}
        title={`Delete "${deleteTarget?.title}"?`}
        message="Are you sure you want to permanently delete this package? If customer bookings exist for this package, the system will prevent deletion and suggest deactivating it instead."
        confirmText="Delete Package"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </div>
  );
}
