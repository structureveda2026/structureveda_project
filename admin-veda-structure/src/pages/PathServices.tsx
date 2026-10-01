import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
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
  Calendar,
  Clock,
  Scroll,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { useToast } from "@/context/ToastContext";
import pathServiceCatalogueService, {
  AdminPathServiceListingItem,
  PathPurpose,
  PathServiceFilters,
  PATH_FORMAT_LABELS,
  PathFormatType,
} from "@/services/pathServiceCatalogueService";

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

const SORT_OPTIONS: { label: string; value: PathServiceFilters["sortBy"] }[] = [
  { label: "Newest Created", value: "created-newest" },
  { label: "Oldest Created", value: "created-oldest" },
  { label: "Name (A to Z)", value: "name-asc" },
  { label: "Name (Z to A)", value: "name-desc" },
  { label: "Price (Low to High)", value: "price-asc" },
  { label: "Price (High to Low)", value: "price-desc" },
];

const PATH_COMPACT_FORMAT_LABELS: Record<string, string> = {
  single_session: "Single Session",
  same_day: "Same-Day",
  multi_day: "Multi-Day",
  akhand_path: "Akhand Path",
  custom_request: "Custom",
};

function ServiceThumbnail({
  src,
  alt,
  fallbackLetter,
  icon: Icon,
}: {
  src?: string | null;
  alt: string;
  fallbackLetter?: string;
  icon?: React.ElementType;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-12 h-12 rounded-lg bg-saffron-50 border border-saffron-200 flex items-center justify-center text-saffron-600 font-serif font-bold text-base flex-shrink-0">
        {Icon ? <Icon className="w-5 h-5 text-saffron-500" /> : (fallbackLetter || alt.charAt(0) || "P")}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-12 h-12 rounded-lg object-cover border border-cream-200 flex-shrink-0"
      onError={() => setHasError(true)}
    />
  );
}

export default function PathServices() {
  const toast = useToast();

  const [services, setServices] = useState<AdminPathServiceListingItem[]>([]);
  const [purposes, setPurposes] = useState<PathPurpose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdminAccessError, setIsAdminAccessError] = useState(false);

  // Filters state
  const [search, setSearch] = useState("");
  const [purposeSlug, setPurposeSlug] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");
  const [sortBy, setSortBy] = useState<PathServiceFilters["sortBy"]>("created-newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Deactivation state
  const [deactivateTarget, setDeactivateTarget] = useState<AdminPathServiceListingItem | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  // Load dynamic purpose categories from API
  useEffect(() => {
    let isMounted = true;
    const fetchPurposes = async () => {
      try {
        const data = await pathServiceCatalogueService.getPathPurposes();
        if (isMounted) {
          setPurposes(data);
        }
      } catch (err) {
        console.warn("Could not load Path purposes:", err);
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
      const filters: PathServiceFilters = { page, limit: 15, sortBy };
      if (search.trim()) filters.search = search.trim();
      if (purposeSlug) filters.purpose = purposeSlug;
      if (status !== "") filters.isActive = status;
      if (featured !== "") filters.isFeatured = featured;

      const res = await pathServiceCatalogueService.getPathServices(filters);
      setServices(res.data || []);
      setTotalCount(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load Path services.";
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
    const target = deactivateTarget;
    if (!target) return;
    setDeactivating(true);
    try {
      await pathServiceCatalogueService.deletePathService(target.id);
      toast.success(`"${target.name}" deactivated successfully.`);
      setDeactivateTarget(null);
      await loadServices();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Unable to deactivate Path service.";
      toast.error(msg);
    } finally {
      setDeactivating(false);
    }
  };

  const handleToggleActivate = async (service: AdminPathServiceListingItem) => {
    if (service.isActive) {
      setDeactivateTarget(service);
    } else {
      try {
        await pathServiceCatalogueService.updatePathService(service.id, { isActive: true });
        toast.success(`"${service.name}" activated successfully.`);
        await loadServices();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Unable to activate Path service.";
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
        title="Path / Recitation Services"
        subtitle="Manage Vedic Path & scripture recitations, recitation formats, duration schedules, pandit scholars, starting prices, and public catalogue visibility."
        actions={
          <Link to="/admin/path-services/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Path Service
          </Link>
        }
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
            Featured Paths
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
              placeholder="Search by name, scripture, slug, or purpose..."
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
              setSortBy(v as PathServiceFilters["sortBy"]);
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
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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
              Loading Path services...
            </p>
          </div>
        ) : isAdminAccessError ? (
          <EmptyState
            icon={<ShieldAlert className="w-10 h-10 text-red-400" />}
            title="Admin Access Required"
            message="Your account does not have administrator privileges to view Path services."
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
            title="No Path Services Found"
            message={
              hasActiveFilters
                ? "No services match the selected filters. Try resetting your filters."
                : "The Path service catalogue is currently empty."
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
              ) : (
                <Link
                  to="/admin/path-services/new"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Path Service
                </Link>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider border-b border-cream-200">
                  <th className="text-left px-5 py-3.5 font-semibold">Image</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Service</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Scripture</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Purpose</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Formats & Schedule</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Scholars</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Locations</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Starting Price</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Visibility</th>
                  <th className="text-right px-5 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {services.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-cream-50/50 transition-colors"
                  >
                    {/* 1. Image */}
                    <td className="px-5 py-3.5">
                      <ServiceThumbnail
                        src={item.bannerImage}
                        alt={item.name}
                        fallbackLetter={item.name.charAt(0) || "P"}
                        icon={Scroll}
                      />
                    </td>

                    {/* 2. Service (Name & Slug) */}
                    <td className="px-5 py-3.5 max-w-xs">
                      <Link
                        to={`/admin/path-services/${item.id}`}
                        className="font-semibold text-charcoal-800 hover:text-saffron-600 transition block truncate"
                        title={item.name}
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-charcoal-400 truncate max-w-[180px]">
                          /{item.slug}
                        </span>
                      </div>
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-cream-100 text-charcoal-600 font-medium">
                        {item.pathType || "Vedic Path"}
                      </span>
                    </td>

                    {/* 3. Scripture */}
                    <td className="px-5 py-3.5 max-w-[180px]">
                      <div className="flex items-center gap-1.5 text-xs text-charcoal-700">
                        <Scroll className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                        <span className="truncate font-medium" title={item.scripture}>
                          {item.scripture}
                        </span>
                      </div>
                    </td>

                    {/* 4. Purpose */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 max-w-[160px] truncate"
                        title={item.purpose || item.purposeSummary || "Vedic Path"}
                      >
                        {item.purpose || item.purposeSummary || "Vedic Path"}
                      </span>
                    </td>

                    {/* 5. Formats & Schedule */}
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1 max-w-[200px]">
                          {item.availableFormats && item.availableFormats.length > 0 ? (
                            <>
                              {item.availableFormats.slice(0, 2).map((f) => (
                                <span
                                  key={f}
                                  className="text-[11px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium whitespace-nowrap"
                                >
                                  {PATH_COMPACT_FORMAT_LABELS[f] || PATH_FORMAT_LABELS[f as PathFormatType] || f}
                                </span>
                              ))}
                              {item.availableFormats.length > 2 && (
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-cream-100 text-charcoal-600 font-medium cursor-help"
                                  title={item.availableFormats
                                    .map((f) => PATH_COMPACT_FORMAT_LABELS[f] || PATH_FORMAT_LABELS[f as PathFormatType] || f)
                                    .join(", ")}
                                >
                                  +{item.availableFormats.length - 2} more
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-charcoal-400">—</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-charcoal-500">
                          <Calendar className="w-3 h-3 text-charcoal-400 flex-shrink-0" />
                          <span>
                            {item.minimumDays === item.maximumDays
                              ? `${item.minimumDays} Day`
                              : `${item.minimumDays} - ${item.maximumDays} Days`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 6. Scholars */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-xs text-charcoal-700">
                        <Users className="w-3.5 h-3.5 text-charcoal-400" />
                        <span>
                          {item.minimumPandits === item.maximumPandits
                            ? `${item.minimumPandits} Vedic Pandits`
                            : `${item.minimumPandits} - ${item.maximumPandits} Pandits`}
                        </span>
                      </div>
                      {item.recommendedPandits && (
                        <div className="text-[11px] text-charcoal-400 mt-0.5">
                          (rec: {item.recommendedPandits})
                        </div>
                      )}
                    </td>

                    {/* 7. Locations */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {item.isKashiAvailable && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-saffron-700 bg-saffron-50 px-1.5 py-0.5 rounded"
                            title="Performed in Holy Kashi"
                          >
                            <MapPin className="w-3 h-3 text-saffron-500" />
                            Kashi
                          </span>
                        )}
                        {item.isRemoteAvailable && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded"
                            title="Remote / Live Stream"
                          >
                            <Globe className="w-3 h-3 text-blue-500" />
                            Remote
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 8. Starting Price */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-charcoal-800">
                      {item.formattedPrice || `₹${Number(item.startingPrice).toLocaleString("en-IN")}`}
                    </td>

                    {/* 9. Visibility & Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleActivate(item)}
                          title={item.isActive ? "Click to deactivate" : "Click to activate"}
                          className="focus:outline-none"
                        >
                          <StatusBadge status={item.isActive ? "Active" : "Inactive"} />
                        </button>
                        {item.isFeatured && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 10. Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/path-services/${item.id}`}
                          className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-700 transition"
                          title="View Service Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/path-services/${item.id}/edit`}
                          className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-700 transition"
                          title="Edit Path Service"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleActivate(item)}
                          className={`p-1.5 rounded-lg transition ${
                            item.isActive
                              ? "text-charcoal-400 hover:bg-red-50 hover:text-red-600"
                              : "text-charcoal-400 hover:bg-green-50 hover:text-green-600"
                          }`}
                          title={item.isActive ? "Deactivate Service" : "Activate Service"}
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

      {/* Confirm Deactivation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deactivateTarget)}
        title="Deactivate Path Service?"
        message={`Are you sure you want to deactivate "${deactivateTarget?.name}"? It will immediately be hidden from the public Path catalogue and public detail pages. Existing bookings remain intact.`}
        confirmText={deactivating ? "Deactivating..." : "Deactivate Service"}
        cancelText="Cancel"
        danger={true}
        onConfirm={handleDeactivateConfirm}
        onClose={() => setDeactivateTarget(null)}
      />
    </div>
  );
}
