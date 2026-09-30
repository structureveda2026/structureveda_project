import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Edit,
  Power,
  RefreshCw,
  Sparkles,
  X,
  ShieldAlert,
  LogIn,
  BookOpen,
  MapPin,
  Globe,
  Users,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { useToast } from "@/context/ToastContext";
import japaServiceCatalogueService, {
  AdminJapaServiceListingItem,
  JapaPurpose,
  JapaServiceFilters,
} from "@/services/japaServiceCatalogueService";

const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Active Only", value: "true" },
  { label: "Inactive Only", value: "false" },
];

const FEATURED_FILTER_OPTIONS = [
  { label: "All Visibility", value: "" },
  { label: "Featured Only", value: "true" },
  { label: "Not Featured", value: "false" },
];

const SORT_OPTIONS: { label: string; value: JapaServiceFilters["sortBy"] }[] = [
  { label: "Newest Created", value: "created-newest" },
  { label: "Oldest Created", value: "created-oldest" },
  { label: "Name (A to Z)", value: "name-asc" },
  { label: "Name (Z to A)", value: "name-desc" },
  { label: "Price (Low to High)", value: "price-asc" },
  { label: "Price (High to Low)", value: "price-desc" },
];

export default function JapaServices() {
  const toast = useToast();

  const [services, setServices] = useState<AdminJapaServiceListingItem[]>([]);
  const [purposes, setPurposes] = useState<JapaPurpose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdminAccessError, setIsAdminAccessError] = useState(false);

  // Filters state
  const [search, setSearch] = useState("");
  const [purposeSlug, setPurposeSlug] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");
  const [sortBy, setSortBy] = useState<JapaServiceFilters["sortBy"]>("created-newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Deactivation state
  const [deactivateTarget, setDeactivateTarget] = useState<AdminJapaServiceListingItem | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  // Load dynamic purpose categories from API
  useEffect(() => {
    let isMounted = true;
    const fetchPurposes = async () => {
      try {
        const data = await japaServiceCatalogueService.getJapaPurposes();
        if (isMounted) {
          setPurposes(data);
        }
      } catch (err) {
        console.warn("Could not load Japa purposes:", err);
      }
    };
    fetchPurposes();
    return () => {
      isMounted = false;
    };
  }, []);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError("");
    setIsAdminAccessError(false);
    try {
      const filters: JapaServiceFilters = { page, limit: 15, sortBy };
      if (search.trim()) filters.search = search.trim();
      if (purposeSlug) filters.purpose = purposeSlug;
      if (status !== "") filters.isActive = status;
      if (featured !== "") filters.isFeatured = featured;

      const res = await japaServiceCatalogueService.getJapaServices(filters);
      setServices(res.data || []);
      setTotalCount(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load Japa services.";
      if (
        msg.toLowerCase().includes("admin access required") ||
        msg.toLowerCase().includes("unauthorized") ||
        msg.toLowerCase().includes("forbidden")
      ) {
        setIsAdminAccessError(true);
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [search, purposeSlug, status, featured, sortBy, page, toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadServices();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadServices]);

  const handleResetFilters = () => {
    setSearch("");
    setPurposeSlug("");
    setStatus("");
    setFeatured("");
    setSortBy("created-newest");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(purposeSlug) ||
    status !== "" ||
    featured !== "" ||
    sortBy !== "created-newest";

  const handleDeactivateConfirm = async () => {
    if (!deactivateTarget) return;
    setDeactivating(true);
    try {
      await japaServiceCatalogueService.deleteJapaService(deactivateTarget.id);
      toast.success(`"${deactivateTarget.name}" deactivated successfully.`);
      setDeactivateTarget(null);
      await loadServices();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Unable to deactivate Japa service.";
      toast.error(msg);
    } finally {
      setDeactivating(false);
    }
  };

  const handleToggleActivate = async (service: AdminJapaServiceListingItem) => {
    if (service.isActive) {
      setDeactivateTarget(service);
    } else {
      try {
        await japaServiceCatalogueService.updateJapaService(service.id, { isActive: true });
        toast.success(`"${service.name}" activated successfully.`);
        await loadServices();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Unable to activate Japa service.";
        toast.error(msg);
      }
    }
  };

  const activeCount = useMemo(() => services.filter((s) => s.isActive).length, [services]);
  const featuredCount = useMemo(() => services.filter((s) => s.isFeatured).length, [services]);
  const kashiCount = useMemo(() => services.filter((s) => s.isKashiAvailable).length, [services]);

  // Purpose options dynamically built from API
  const purposeOptions = useMemo(
    () => [
      { label: "All Purposes", value: "" },
      ...purposes.map((p) => ({ label: p.name, value: p.slug })),
    ],
    [purposes],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Japa Service Catalogue"
        subtitle="Manage Vedic Mantra Japa rituals, recitation counts, pricing, pandit capacities, and public catalogue visibility."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">
            Total Services
          </p>
          <p className="text-2xl font-bold text-charcoal-800">
            {loading ? "..." : totalCount}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">
            Active in Public
          </p>
          <p className="text-2xl font-bold text-green-600">
            {loading ? "..." : activeCount}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">
            Featured Japas
          </p>
          <p className="text-2xl font-bold text-amber-600">
            {loading ? "..." : featuredCount}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">
            Kashi Available
          </p>
          <p className="text-2xl font-bold text-saffron-600">
            {loading ? "..." : kashiCount}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[200px]">
            <SearchBar
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search by name, mantra, or slug..."
            />
          </div>
          <FilterDropdown
            value={purposeSlug}
            onChange={(v) => {
              setPurposeSlug(v);
              setPage(1);
            }}
            options={purposeOptions}
            label="Purpose"
          />
          <FilterDropdown
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={STATUS_FILTER_OPTIONS}
            label="Status"
          />
          <FilterDropdown
            value={featured}
            onChange={(v) => {
              setFeatured(v);
              setPage(1);
            }}
            options={FEATURED_FILTER_OPTIONS}
            label="Featured"
          />
          <FilterDropdown
            value={sortBy || ""}
            onChange={(v) => {
              setSortBy(v as JapaServiceFilters["sortBy"]);
              setPage(1);
            }}
            options={SORT_OPTIONS as { label: string; value: string }[]}
            label="Sort"
            hasAllOption={false}
          />
          <button
            type="button"
            onClick={loadServices}
            className="p-2.5 rounded-lg border border-cream-200 text-charcoal-500 hover:bg-cream-100 transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-charcoal-500 hover:text-charcoal-700 border border-cream-200 rounded-lg px-2.5 py-2 hover:bg-cream-50 transition"
            >
              <X className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-charcoal-500">
              Loading Japa services...
            </p>
          </div>
        ) : isAdminAccessError ? (
          <EmptyState
            icon={<ShieldAlert className="w-10 h-10 text-red-400" />}
            title="Admin Access Required"
            message="Your account does not have administrator privileges to view Japa services."
            action={
              <Link to="/admin/login" className="btn-primary flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Go to Login
              </Link>
            }
          />
        ) : error && services.length === 0 ? (
          <EmptyState
            title="Unable to Load Services"
            message={error}
            action={
              <button
                type="button"
                onClick={loadServices}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            }
          />
        ) : services.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-10 h-10 text-saffron-300" />}
            title="No Japa Services Found"
            message={
              hasActiveFilters
                ? "No services match the selected filters. Try resetting your filters."
                : "The Japa service catalogue is currently empty."
            }
            action={
              hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn-secondary"
                >
                  Reset Filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider border-b border-cream-200">
                  <th className="text-left px-5 py-3.5 font-semibold">Image</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Japa Service</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Mantra</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Purpose</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Available Counts</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Starting Price</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Pandits</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Availability</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Featured</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Status</th>
                  <th className="text-right px-5 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-cream-50/50 transition-colors">
                    {/* Banner Image */}
                    <td className="px-5 py-3.5">
                      {s.bannerImage ? (
                        <img
                          src={s.bannerImage}
                          alt={s.name}
                          className="w-12 h-12 rounded-lg object-cover border border-cream-200 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-saffron-50 border border-saffron-200 flex items-center justify-center text-saffron-600 font-serif font-bold text-base flex-shrink-0">
                          {s.name.charAt(0) || "J"}
                        </div>
                      )}
                    </td>

                    {/* Service Name & Slug */}
                    <td className="px-5 py-3.5 max-w-xs">
                      <span className="font-semibold text-charcoal-800 block truncate">
                        {s.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-charcoal-400 truncate max-w-[180px]">
                          /{s.slug}
                        </span>
                      </div>
                    </td>

                    {/* Mantra Preview */}
                    <td className="px-5 py-3.5 max-w-[200px]">
                      <span
                        className="text-xs font-serif text-charcoal-600 line-clamp-2"
                        title={s.mantra}
                      >
                        {s.mantra}
                      </span>
                    </td>

                    {/* Purpose */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {s.purpose || s.purposeSummary || "Vedic Japa"}
                      </span>
                    </td>

                    {/* Available Counts (Recitation based) */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {Array.isArray(s.availableCounts) && s.availableCounts.length > 0 ? (
                          s.availableCounts.map((count) => (
                            <span
                              key={count}
                              className="text-[11px] font-mono bg-cream-100 text-charcoal-700 px-1.5 py-0.5 rounded"
                            >
                              {count.toLocaleString("en-IN")}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-charcoal-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Starting Price */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-charcoal-800">
                      {s.formattedPrice || `₹${Number(s.startingPrice).toLocaleString("en-IN")}`}
                    </td>

                    {/* Pandit Requirements */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-xs text-charcoal-600">
                        <Users className="w-3.5 h-3.5 text-charcoal-400" />
                        <span>
                          {s.minimumPandits} - {s.maximumPandits} (rec: {s.recommendedPandits})
                        </span>
                      </div>
                      <div className="text-[11px] text-charcoal-400 mt-0.5">
                        {s.dailyCapacityPerPandit?.toLocaleString("en-IN")} chants/pandit
                      </div>
                    </td>

                    {/* Availability Modes */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {s.isKashiAvailable && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-saffron-700 bg-saffron-50 px-1.5 py-0.5 rounded"
                            title="Available in Kashi (Varanasi)"
                          >
                            <MapPin className="w-3 h-3 text-saffron-500" /> Kashi
                          </span>
                        )}
                        {s.isRemoteAvailable && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded"
                            title="Available Remotely"
                          >
                            <Globe className="w-3 h-3 text-blue-500" /> Remote
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Featured Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {s.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 text-amber-500" /> Featured
                        </span>
                      ) : (
                        <span className="text-xs text-charcoal-400">Regular</span>
                      )}
                    </td>

                    {/* Active/Inactive Status Badge */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleActivate(s)}
                        title={s.isActive ? "Click to deactivate" : "Click to activate"}
                        className="focus:outline-none"
                      >
                        <StatusBadge status={s.isActive ? "Active" : "Inactive"} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Action Placeholder (disabled until Phase J4-F detail page) */}
                        <button
                          type="button"
                          disabled
                          className="p-1.5 rounded-lg text-charcoal-300 opacity-40 cursor-not-allowed"
                          title="View details (Coming in J4-F)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Action Placeholder (disabled until Phase J4-E form) */}
                        <button
                          type="button"
                          disabled
                          className="p-1.5 rounded-lg text-charcoal-300 opacity-40 cursor-not-allowed"
                          title="Edit service (Coming in J4-E)"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete / Deactivate Action (fully supported by backend soft delete) */}
                        <button
                          type="button"
                          onClick={() => handleToggleActivate(s)}
                          className={`p-1.5 rounded-lg transition ${
                            s.isActive
                              ? "text-charcoal-400 hover:bg-red-50 hover:text-red-600"
                              : "text-charcoal-400 hover:bg-green-50 hover:text-green-600"
                          }`}
                          title={s.isActive ? "Deactivate Service" : "Activate Service"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && services.length > 0 && (
          <div className="p-4 border-t border-cream-100">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </div>

      {/* Deactivate Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deactivateTarget)}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Japa Service"
        message={`Are you sure you want to deactivate "${deactivateTarget?.name}"? It will be safely hidden from the public catalogue while preserving all historical ritual bookings.`}
        confirmText={deactivating ? "Deactivating..." : "Deactivate Service"}
        danger
      />
    </div>
  );
}
