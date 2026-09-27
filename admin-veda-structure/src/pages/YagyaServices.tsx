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
  Flame,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { useToast } from "@/context/ToastContext";
import yagyaServiceCatalogueService, {
  AdminYagyaServiceListingItem,
  YagyaPurpose,
  YagyaServiceFilters,
} from "@/services/yagyaServiceCatalogueService";

const MODE_OPTIONS = [
  { label: "All Modes", value: "" },
  { label: "Hybrid", value: "hybrid" },
  { label: "In Person", value: "in_person" },
  { label: "Remote", value: "remote" },
];

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

const SORT_OPTIONS: { label: string; value: YagyaServiceFilters["sortBy"] }[] = [
  { label: "Newest Created", value: "created-newest" },
  { label: "Oldest Created", value: "created-oldest" },
  { label: "Name (A to Z)", value: "name-asc" },
  { label: "Name (Z to A)", value: "name-desc" },
  { label: "Price (Low to High)", value: "price-asc" },
  { label: "Price (High to Low)", value: "price-desc" },
];

export default function YagyaServices() {
  const toast = useToast();

  const [services, setServices] = useState<AdminYagyaServiceListingItem[]>([]);
  const [purposes, setPurposes] = useState<YagyaPurpose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdminAccessError, setIsAdminAccessError] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [purposeSlug, setPurposeSlug] = useState("");
  const [mode, setMode] = useState<string>("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");
  const [sortBy, setSortBy] = useState<YagyaServiceFilters["sortBy"]>("created-newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Deactivation
  const [deactivateTarget, setDeactivateTarget] = useState<AdminYagyaServiceListingItem | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  // Load purposes
  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        const data = await yagyaServiceCatalogueService.getYagyaPurposes();
        setPurposes(data);
      } catch (err) {
        console.warn("Could not load Yagya purposes:", err);
      }
    };
    fetchPurposes();
  }, []);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError("");
    setIsAdminAccessError(false);
    try {
      const filters: YagyaServiceFilters = { page, limit: 15, sortBy };
      if (search.trim()) filters.search = search.trim();
      if (purposeSlug) filters.purpose = purposeSlug;
      if (mode) filters.mode = mode as any;
      if (status !== "") filters.isActive = status;
      if (featured !== "") filters.isFeatured = featured;

      const res = await yagyaServiceCatalogueService.getYagyaServices(filters);
      setServices(res.data || []);
      setTotalCount(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      const msg = err?.message || "Failed to load Yagya services.";
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
  }, [search, purposeSlug, mode, status, featured, sortBy, page]);

  useEffect(() => {
    const timer = setTimeout(() => { loadServices(); }, 200);
    return () => clearTimeout(timer);
  }, [loadServices]);

  const handleResetFilters = () => {
    setSearch("");
    setPurposeSlug("");
    setMode("");
    setStatus("");
    setFeatured("");
    setSortBy("created-newest");
    setPage(1);
  };

  const hasActiveFilters =
    search || purposeSlug || mode || status !== "" || featured !== "" || sortBy !== "created-newest";

  const handleDeactivateConfirm = async () => {
    if (!deactivateTarget) return;
    setDeactivating(true);
    try {
      await yagyaServiceCatalogueService.deleteYagyaService(deactivateTarget.id);
      toast.success(`"${deactivateTarget.name}" deactivated successfully.`);
      setDeactivateTarget(null);
      await loadServices();
    } catch (err: any) {
      toast.error(err?.message || "Unable to deactivate Yagya service.");
    } finally {
      setDeactivating(false);
    }
  };

  const handleToggleActivate = async (service: AdminYagyaServiceListingItem) => {
    if (service.isActive) {
      setDeactivateTarget(service);
    } else {
      try {
        await yagyaServiceCatalogueService.updateYagyaService(service.id, { isActive: true });
        toast.success(`"${service.name}" activated successfully.`);
        await loadServices();
      } catch (err: any) {
        toast.error(err?.message || "Unable to activate Yagya service.");
      }
    }
  };

  const activeCount = useMemo(() => services.filter((s) => s.isActive).length, [services]);
  const featuredCount = useMemo(() => services.filter((s) => s.isFeatured).length, [services]);
  const hybridCount = useMemo(() => services.filter((s) => s.availableMode === "hybrid").length, [services]);

  // Purpose filter options
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
        title="Yagya Service Catalogue"
        subtitle="Manage Vedic Yagya rituals, durations, pricing tiers, pandit requirements, and public catalogue visibility."
        actions={
          <Link to="/admin/yagya-services/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Yagya Service
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">Total Services</p>
          <p className="text-2xl font-bold text-charcoal-800">{loading ? "�" : totalCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">Active in Public</p>
          <p className="text-2xl font-bold text-green-600">{loading ? "�" : activeCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">Featured Yagyas</p>
          <p className="text-2xl font-bold text-amber-600">{loading ? "�" : featuredCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-1">Available Hybrid</p>
          <p className="text-2xl font-bold text-saffron-600">{loading ? "�" : hybridCount}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[180px]">
            <SearchBar
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search Yagya services..."
            />
          </div>
          <FilterDropdown
            value={purposeSlug}
            onChange={(v) => { setPurposeSlug(v); setPage(1); }}
            options={purposeOptions}
            label="Purpose"
          />
          <FilterDropdown
            value={mode}
            onChange={(v) => { setMode(v); setPage(1); }}
            options={MODE_OPTIONS}
            label="Mode"
          />
          <FilterDropdown
            value={status}
            onChange={(v) => { setStatus(v); setPage(1); }}
            options={STATUS_FILTER_OPTIONS}
            label="Status"
          />
          <FilterDropdown
            value={featured}
            onChange={(v) => { setFeatured(v); setPage(1); }}
            options={FEATURED_FILTER_OPTIONS}
            label="Featured"
          />
          <FilterDropdown
            value={sortBy || ""}
            onChange={(v) => { setSortBy(v as YagyaServiceFilters["sortBy"]); setPage(1); }}
            options={SORT_OPTIONS as { label: string; value: string }[]}
            label="Sort"
            hasAllOption={false}
          />
          <button
            onClick={loadServices}
            className="p-2 rounded-lg border border-cream-200 text-charcoal-500 hover:bg-cream-100 transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-charcoal-500 hover:text-charcoal-700 border border-cream-200 rounded-lg px-2 py-2 hover:bg-cream-50 transition"
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
            <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-charcoal-500">Loading Yagya services...</p>
          </div>
        ) : isAdminAccessError ? (
          <EmptyState
            icon={<ShieldAlert className="w-10 h-10 text-red-400" />}
            title="Admin Access Required"
            message="Your account does not have admin privileges to view Yagya services."
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
              <button onClick={loadServices} className="btn-secondary flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            }
          />
        ) : services.length === 0 ? (
          <EmptyState
            icon={<Flame className="w-10 h-10 text-saffron-300" />}
            title="No Yagya Services Found"
            message={
              hasActiveFilters
                ? "No services match the selected filters. Try resetting your filters."
                : "Start by creating your first Yagya service in the catalogue."
            }
            action={
              hasActiveFilters ? (
                <button onClick={handleResetFilters} className="btn-secondary">
                  Reset Filters
                </button>
              ) : (
                <Link to="/admin/yagya-services/new" className="btn-primary">
                  <Plus className="w-4 h-4" /> Create Yagya Service
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
                  <th className="text-left px-5 py-3.5 font-semibold">Yagya Ritual</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Purpose</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Duration</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Price</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Mode</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Featured</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Status</th>
                  <th className="text-right px-5 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {services.map((s) => (
                  <tr key={s.id} className="table-row-hover">
                    {/* Image */}
                    <td className="px-5 py-3.5">
                      {s.bannerImage ? (
                        <img
                          src={s.bannerImage}
                          alt={s.name}
                          className="w-12 h-12 rounded-lg object-cover border border-cream-200 flex-shrink-0"
                          onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-serif font-bold text-base flex-shrink-0">
                          {s.name.charAt(0) || "Y"}
                        </div>
                      )}
                    </td>

                    {/* Name / Slug */}
                    <td className="px-5 py-3.5 max-w-xs">
                      <Link
                        to={`/admin/yagya-services/${s.id}`}
                        className="font-semibold text-charcoal-800 hover:text-saffron-600 transition block truncate"
                      >
                        {s.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-charcoal-400 truncate max-w-[180px]">
                          /{s.slug}
                        </span>
                      </div>
                    </td>

                    {/* Purpose */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {s.purpose || s.purposeSummary || "Vedic Yagya"}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium text-charcoal-600">
                        {Array.isArray(s.availableDurations) && s.availableDurations.length > 0
                          ? s.availableDurations.join(" / ") + " Days"
                          : `${s.dailyRitualHours}h / Day`}
                      </span>
                    </td>

                    {/* Starting Price */}
                    <td className="px-5 py-3.5 font-semibold text-charcoal-800">
                      {s.formattedPrice || `?${s.startingPrice.toLocaleString("en-IN")}`}
                    </td>

                    {/* Mode */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs capitalize font-medium text-charcoal-600 bg-cream-100 px-2 py-0.5 rounded">
                        {s.availableMode === "hybrid"
                          ? "Hybrid"
                          : s.availableMode === "in_person"
                          ? "In-Person"
                          : "Remote"}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-3.5">
                      {s.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 text-amber-500" /> Featured
                        </span>
                      ) : (
                        <span className="text-xs text-charcoal-400">Regular</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
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
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/yagya-services/${s.id}`}
                          className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-700 transition"
                          title="View Service Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/yagya-services/${s.id}/edit`}
                          className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-700 transition"
                          title="Edit Yagya Service"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
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
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Yagya Service"
        message={`Are you sure you want to deactivate "${deactivateTarget?.name}"? It will be safely hidden from the public website while preserving all data in the admin dashboard.`}
        confirmText={deactivating ? "Deactivating..." : "Deactivate Service"}
        danger
      />
    </div>
  );
}
