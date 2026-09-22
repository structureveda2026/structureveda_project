import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Power,
  RefreshCw,
  Sparkles,
  Layers,
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
import pujaServiceCatalogueService, {
  AdminPujaServiceListingItem,
  PujaPurpose,
  PujaServiceFilters,
} from "@/services/pujaServiceCatalogueService";

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

const SORT_OPTIONS: { label: string; value: PujaServiceFilters["sortBy"] }[] = [
  { label: "Newest Created", value: "created-newest" },
  { label: "Oldest Created", value: "created-oldest" },
  { label: "Name (A to Z)", value: "name-asc" },
  { label: "Name (Z to A)", value: "name-desc" },
  { label: "Price (Low to High)", value: "price-asc" },
  { label: "Price (High to Low)", value: "price-desc" },
];

export default function PujaServices() {
  const navigate = useNavigate();
  const toast = useToast();

  const [services, setServices] = useState<AdminPujaServiceListingItem[]>([]);
  const [purposes, setPurposes] = useState<PujaPurpose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdminAccessError, setIsAdminAccessError] = useState(false);

  // Filters state
  const [search, setSearch] = useState("");
  const [purposeSlug, setPurposeSlug] = useState("");
  const [mode, setMode] = useState<string>("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");
  const [sortBy, setSortBy] = useState<PujaServiceFilters["sortBy"]>("created-newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Deactivation state
  const [deactivateTarget, setDeactivateTarget] = useState<AdminPujaServiceListingItem | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  // Load dynamic purposes on mount
  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        const data = await pujaServiceCatalogueService.getPurposes();
        setPurposes(data);
      } catch (err) {
        console.warn("Could not load Puja purposes:", err);
      }
    };
    fetchPurposes();
  }, []);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError("");
    setIsAdminAccessError(false);
    try {
      const filters: PujaServiceFilters = {
        page,
        limit: 15,
        sortBy,
      };

      if (search.trim()) filters.search = search.trim();
      if (purposeSlug) filters.purpose = purposeSlug;
      if (mode) filters.mode = mode as any;
      if (status !== "") filters.isActive = status;
      if (featured !== "") filters.isFeatured = featured;

      const res = await pujaServiceCatalogueService.getPujaServices(filters);
      setServices(res.data || []);
      setTotalCount(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      const msg = err?.message || "Failed to load Puja services from the server.";
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
    const timer = setTimeout(() => {
      loadServices();
    }, 200);
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
      await pujaServiceCatalogueService.deletePujaService(deactivateTarget.id);
      toast.success(`"${deactivateTarget.name}" deactivated successfully.`);
      setDeactivateTarget(null);
      await loadServices();
    } catch (err: any) {
      toast.error(err?.message || "Unable to deactivate Puja service.");
    } finally {
      setDeactivating(false);
    }
  };

  const handleToggleActivate = async (service: AdminPujaServiceListingItem) => {
    if (service.isActive) {
      // Prompt deactivation confirm
      setDeactivateTarget(service);
    } else {
      // Direct reactivate via update
      try {
        await pujaServiceCatalogueService.updatePujaService(service.id, { isActive: true });
        toast.success(`"${service.name}" activated successfully.`);
        await loadServices();
      } catch (err: any) {
        toast.error(err?.message || "Unable to activate Puja service.");
      }
    }
  };

  // Quick summary counts
  const activeCount = useMemo(() => services.filter((s) => s.isActive).length, [services]);
  const featuredCount = useMemo(() => services.filter((s) => s.isFeatured).length, [services]);
  const hybridCount = useMemo(() => services.filter((s) => s.availableMode === "hybrid").length, [services]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Puja Service Catalogue"
        subtitle="Manage reusable Vedic rituals, spiritual purposes, pricing tiers, durations and public catalogue visibility."
        actions={
          <Link
            to="/admin/puja-services/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Puja Service
          </Link>
        }
      />

      {/* Admin Authorization Notice */}
      {isAdminAccessError && (
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 animate-fade-in shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950 text-base">
                  Administrator Privilege Required
                </p>
                <p className="text-sm text-amber-800 mt-1">
                  Your current account session does not have administrator privileges to manage the Puja catalogue. Please sign in with an authorized admin account.
                </p>
              </div>
            </div>
            <Link
              to="/admin/login"
              className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-center"
            >
              <LogIn className="w-4 h-4" />
              Sign in as Admin
            </Link>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 hover:shadow-elevated transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider">
                Total Services
              </p>
              <p className="text-2xl font-bold text-charcoal-800 mt-1">
                {totalCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-saffron-50 flex items-center justify-center text-saffron-600">
              <Flame className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card p-5 hover:shadow-elevated transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider">
                Active in Public
              </p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {activeCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <Power className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card p-5 hover:shadow-elevated transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider">
                Featured Rituals
              </p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {featuredCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card p-5 hover:shadow-elevated transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider">
                Hybrid Available
              </p>
              <p className="text-2xl font-bold text-indigo-700 mt-1">
                {hybridCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Area */}
      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <SearchBar
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search service, deity, summary..."
            className="lg:col-span-2"
          />

          {/* Dynamic Purpose Selector */}
          <div className="relative">
            <select
              value={purposeSlug}
              onChange={(e) => { setPurposeSlug(e.target.value); setPage(1); }}
              className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-lg border border-cream-200 bg-white text-sm text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-300 transition cursor-pointer"
            >
              <option value="">All Purposes</option>
              {purposes.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Dropdown */}
          <div className="relative">
            <select
              value={mode}
              onChange={(e) => { setMode(e.target.value); setPage(1); }}
              className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-lg border border-cream-200 bg-white text-sm text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-300 transition cursor-pointer"
            >
              {MODE_OPTIONS.map((m) => (
                <option key={m.label} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-lg border border-cream-200 bg-white text-sm text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-300 transition cursor-pointer"
            >
              {STATUS_FILTER_OPTIONS.map((s) => (
                <option key={s.label} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second row: Sort and actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-cream-100 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-charcoal-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as any); setPage(1); }}
                className="bg-cream-50 border border-cream-200 rounded-lg px-2.5 py-1.5 text-xs text-charcoal-700 font-medium focus:outline-none focus:ring-1 focus:ring-saffron-400"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured filter toggle */}
            <div className="flex items-center gap-2">
              <span className="text-charcoal-400 font-medium">Visibility:</span>
              <select
                value={featured}
                onChange={(e) => { setFeatured(e.target.value); setPage(1); }}
                className="bg-cream-50 border border-cream-200 rounded-lg px-2.5 py-1.5 text-xs text-charcoal-700 font-medium focus:outline-none focus:ring-1 focus:ring-saffron-400"
              >
                {FEATURED_FILTER_OPTIONS.map((f) => (
                  <option key={f.label} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="btn-ghost text-xs px-2.5 py-1.5 text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            )}
            <button
              onClick={() => loadServices()}
              disabled={loading}
              className="btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1.5"
              title="Refresh Listing"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Table / Empty State */}
      <div className="card overflow-hidden">
        {loading && services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-charcoal-500">Loading Puja catalogue services...</p>
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            title="No Puja services found"
            message={hasActiveFilters ? "Try adjusting your search criteria or clearing filters." : "Create your first Puja catalogue service to begin."}
            action={
              hasActiveFilters ? (
                <button onClick={handleResetFilters} className="btn-secondary">
                  Reset Filters
                </button>
              ) : (
                <Link to="/admin/puja-services/new" className="btn-primary">
                  <Plus className="w-4 h-4" /> Create Puja Service
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
                  <th className="text-left px-5 py-3.5 font-semibold">Puja Ritual</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Purpose</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Price</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Mode</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Featured</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Status</th>
                  <th className="text-right px-5 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {services.map((s) => {
                  return (
                    <tr key={s.id} className="table-row-hover">
                      {/* Image Thumbnail */}
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
                          <div className="w-12 h-12 rounded-lg bg-cream-100 border border-cream-200 flex items-center justify-center text-saffron-600 font-serif font-bold text-base flex-shrink-0">
                            {s.name.charAt(0) || "P"}
                          </div>
                        )}
                      </td>

                      {/* Name, Slug */}
                      <td className="px-5 py-3.5 max-w-xs">
                        <Link
                          to={`/admin/puja-services/${s.id}`}
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
                          {s.purpose?.name || "Vedic Ritual"}
                        </span>
                      </td>

                      {/* Starting Price */}
                      <td className="px-5 py-3.5 font-semibold text-charcoal-800">
                        {s.formattedPrice || `₹${s.startingPrice.toLocaleString("en-IN")}`}
                      </td>

                      {/* Available Mode */}
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
                            to={`/admin/puja-services/${s.id}`}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-700 transition"
                            title="View Service Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/puja-services/${s.id}/edit`}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-700 transition"
                            title="Edit Puja Service"
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
                            title={s.isActive ? "Deactivate (Soft Delete)" : "Reactivate Service"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="p-4 border-t border-cream-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>

      {/* Confirm Soft Deactivation Modal */}
      <ConfirmDialog
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Puja Service"
        message={`Are you sure you want to deactivate "${deactivateTarget?.name}"? It will be safely hidden from the public website while preserving all data in the admin dashboard.`}
        confirmText={deactivating ? "Deactivating..." : "Deactivate Service"}
        danger
      />
    </div>
  );
}
