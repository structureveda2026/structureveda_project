import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  RefreshCw,
  AlertCircle,
  Users,
  CheckCircle2,
  Filter,
  X,
  ShieldAlert,
  LogIn,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { useToast } from "@/context/ToastContext";
import upcomingPujaService, {
  UpcomingPujaData,
  UpcomingPujaFilters,
} from "@/services/upcomingPujaService";

const STATUS_OPTIONS = [
  "Draft",
  "Published",
  "Booking Closed",
  "Completed",
  "Cancelled",
];

const CATEGORY_OPTIONS = [
  "Festival Pujas",
  "Tithi Pujas",
  "Special Occasion Pujas",
  "Dosha Shanti Pujas",
  "Kashi Special Rituals",
];

const OCCASION_OPTIONS = [
  "Festival Puja",
  "Purnima",
  "Amavasya",
  "Ekadashi",
  "Pradosh",
  "Sankranti",
  "Navratri",
  "Mahashivratri",
  "Sawan",
  "Special Kashi Rituals",
];

const SORT_OPTIONS = [
  { label: "Earliest Start", sort: "startDateTime", order: "ASC" as const },
  { label: "Latest Start", sort: "startDateTime", order: "DESC" as const },
  { label: "Newest Created", sort: "createdAt", order: "DESC" as const },
  { label: "Oldest Created", sort: "createdAt", order: "ASC" as const },
  { label: "Name (A to Z)", sort: "name", order: "ASC" as const },
  { label: "Highest Capacity", sort: "totalCapacity", order: "DESC" as const },
  { label: "Most Booked", sort: "bookedCount", order: "DESC" as const },
];

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "TBD";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatTime = (dateStr?: string | null) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
};

export default function UpcomingPujas() {
  const navigate = useNavigate();
  const toast = useToast();
  const [pujas, setPujas] = useState<UpcomingPujaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdminAccessError, setIsAdminAccessError] = useState(false);

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [occasion, setOccasion] = useState("");
  const [featured, setFeatured] = useState("");
  const [sortIndex, setSortIndex] = useState(0);
  const [page, setPage] = useState(1);

  // Deletion state
  const [deleteTarget, setDeleteTarget] = useState<UpcomingPujaData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPujas = useCallback(async () => {
    setLoading(true);
    setError("");
    setIsAdminAccessError(false);
    try {
      const activeSort = SORT_OPTIONS[sortIndex];
      const filters: UpcomingPujaFilters = {
        sort: activeSort.sort,
        order: activeSort.order,
      };

      if (search.trim()) filters.search = search.trim();
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (occasion) filters.occasion = occasion;
      if (featured === "Featured Only") filters.isFeatured = true;
      if (featured === "Not Featured") filters.isFeatured = false;

      const data = await upcomingPujaService.getUpcomingPujas(filters);
      setPujas(data);
    } catch (err) {
      const msg = (err as Error).message || "Failed to load Upcoming Pujas from the server.";
      if (msg.toLowerCase().includes("admin access required") || msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("forbidden")) {
        setIsAdminAccessError(true);
      }
      setError(msg);
      toast.error("Something went wrong while connecting to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, status, category, occasion, featured, sortIndex, toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPujas();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadPujas]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setCategory("");
    setOccasion("");
    setFeatured("");
    setSortIndex(0);
    setPage(1);
  };

  const hasActiveFilters =
    search || status || category || occasion || featured || sortIndex !== 0;

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await upcomingPujaService.deleteUpcomingPuja(deleteTarget.id);
      toast.success("Upcoming Puja deleted successfully.");
      setDeleteTarget(null);
      await loadPujas();
    } catch (err) {
      const msg = (err as Error).message || "Unable to delete Upcoming Puja.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  // Quick summary counts
  const totalCount = pujas.length;
  const publishedCount = pujas.filter((p) => p.status === "Published").length;
  const totalCapacity = pujas.reduce((acc, p) => acc + (p.totalCapacity || 0), 0);
  const totalBooked = pujas.reduce((acc, p) => acc + (p.bookedCount || 0), 0);

  // Client pagination
  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(pujas.length / perPage));
  const paginatedPujas = useMemo(() => {
    return pujas.slice((page - 1) * perPage, page * perPage);
  }, [pujas, page]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upcoming Puja"
        subtitle="Manage upcoming ceremonies, capacity, packages, schedules and publishing."
        actions={
          <Link
            to="/admin/upcoming-pujas/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Upcoming Puja
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
                  Your current account session does not have administrator privileges to manage Upcoming Pujas. Please sign in with an authorized admin account.
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
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
              Total Pujas
            </span>
            <div className="w-9 h-9 rounded-lg bg-saffron-50 flex items-center justify-center text-saffron-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-charcoal-800 mt-2">{totalCount}</p>
          <span className="text-xs text-charcoal-400 mt-0.5 block">Across all statuses</span>
        </div>

        <div className="card p-5 hover:shadow-elevated transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
              Published
            </span>
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-700 mt-2">{publishedCount}</p>
          <span className="text-xs text-charcoal-400 mt-0.5 block">Publicly bookable</span>
        </div>

        <div className="card p-5 hover:shadow-elevated transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
              Total Capacity
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-800 mt-2">{totalCapacity}</p>
          <span className="text-xs text-charcoal-400 mt-0.5 block">Available devotee slots</span>
        </div>

        <div className="card p-5 hover:shadow-elevated transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
              Booked Slots
            </span>
            <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center text-gold-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-charcoal-800 mt-2">{totalBooked}</p>
          <span className="text-xs text-charcoal-400 mt-0.5 block">
            {totalCapacity > 0 ? `${Math.round((totalBooked / totalCapacity) * 100)}% overall filled` : "No active quotas"}
          </span>
        </div>
      </div>

      {/* Filter / Search Area */}
      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <SearchBar
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search puja, deity, slug..."
            className="lg:col-span-2"
          />
          <FilterDropdown
            value={status}
            onChange={(v) => { setStatus(v); setPage(1); }}
            options={STATUS_OPTIONS}
            label="All Statuses"
          />
          <FilterDropdown
            value={category}
            onChange={(v) => { setCategory(v); setPage(1); }}
            options={CATEGORY_OPTIONS}
            label="All Categories"
          />
          <FilterDropdown
            value={occasion}
            onChange={(v) => { setOccasion(v); setPage(1); }}
            options={OCCASION_OPTIONS}
            label="All Occasions"
          />
          <FilterDropdown
            value={featured}
            onChange={(v) => { setFeatured(v); setPage(1); }}
            options={["Featured Only", "Not Featured"]}
            label="All Visibility"
          />
        </div>

        {/* Second row: Sort and actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-cream-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-charcoal-400 font-medium">Sort by:</span>
            <select
              value={sortIndex}
              onChange={(e) => { setSortIndex(Number(e.target.value)); setPage(1); }}
              className="bg-cream-50 border border-cream-200 rounded-lg px-2.5 py-1.5 text-xs text-charcoal-700 font-medium focus:outline-none focus:ring-1 focus:ring-saffron-400"
            >
              {SORT_OPTIONS.map((opt, idx) => (
                <option key={idx} value={idx}>
                  {opt.label}
                </option>
              ))}
            </select>
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
              onClick={() => loadPujas()}
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
        {loading && pujas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-charcoal-500">Loading upcoming ceremonies...</p>
          </div>
        ) : pujas.length === 0 ? (
          <EmptyState
            title="No upcoming pujas yet"
            message="Create your first upcoming ceremony to start managing events."
            action={
              <Link to="/admin/upcoming-pujas/new" className="btn-primary">
                <Plus className="w-4 h-4" /> Create Upcoming Puja
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider border-b border-cream-200">
                  <th className="text-left px-5 py-3.5 font-semibold">Image</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Ceremony Name</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Date & Time</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Location</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Category</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Capacity</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Status</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Featured</th>
                  <th className="text-right px-5 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {paginatedPujas.map((p) => {
                  const bookedRatio = p.totalCapacity ? Math.min(100, Math.round(((p.bookedCount || 0) / p.totalCapacity) * 100)) : 0;
                  const isFull = (p.bookedCount || 0) >= (p.totalCapacity || 1);

                  return (
                    <tr key={p.id} className="table-row-hover">
                      {/* Image Thumbnail */}
                      <td className="px-5 py-3.5">
                        {p.bannerImage ? (
                          <img
                            src={p.bannerImage}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover border border-cream-200 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-cream-100 border border-cream-200 flex items-center justify-center text-saffron-600 font-serif font-bold text-base flex-shrink-0">
                            {p.name.charAt(0) || "P"}
                          </div>
                        )}
                      </td>

                      {/* Name, Slug, Deity */}
                      <td className="px-5 py-3.5 max-w-xs">
                        <Link
                          to={`/admin/upcoming-pujas/${p.id}`}
                          className="font-semibold text-charcoal-800 hover:text-saffron-600 transition block truncate"
                        >
                          {p.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-mono text-charcoal-400 truncate max-w-[160px]">
                            /{p.slug}
                          </span>
                          {p.deity && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cream-100 text-charcoal-600 font-medium whitespace-nowrap">
                              {p.deity}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-charcoal-700 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-saffron-500" />
                          <span>{formatDate(p.ceremonyDate)}</span>
                        </div>
                        {p.startDateTime && (
                          <div className="flex items-center gap-1.5 text-xs text-charcoal-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(p.startDateTime)}</span>
                          </div>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-5 py-3.5 max-w-[160px]">
                        <div className="flex items-start gap-1 text-charcoal-600 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-charcoal-400 flex-shrink-0 mt-0.5" />
                          <span className="truncate">{p.location || p.temple || "Varanasi"}</span>
                        </div>
                      </td>

                      {/* Category & Occasion */}
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-charcoal-700 font-medium block">
                          {p.category || "General"}
                        </span>
                        {p.occasion && (
                          <span className="text-[11px] text-charcoal-400 block">
                            {p.occasion}
                          </span>
                        )}
                      </td>

                      {/* Capacity & Bookings */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-700">
                          <span className={isFull ? "text-red-600 font-bold" : ""}>
                            {p.bookedCount || 0}
                          </span>
                          <span className="text-charcoal-300 font-normal">/</span>
                          <span>{p.totalCapacity || 0}</span>
                        </div>
                        <div className="w-20 bg-cream-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              bookedRatio >= 100
                                ? "bg-red-500"
                                : bookedRatio >= 75
                                ? "bg-amber-500"
                                : "bg-saffron-500"
                            }`}
                            style={{ width: `${bookedRatio}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <StatusBadge status={p.status} />
                      </td>

                      {/* Featured */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {p.isFeatured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-charcoal-300">?"</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/upcoming-pujas/${p.id}`}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/upcoming-pujas/${p.id}/edit`}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition"
                            title="Edit Ceremony"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:bg-red-50 hover:text-red-500 transition"
                            title="Delete Ceremony"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Pagination */}
        {pujas.length > perPage && (
          <div className="px-5 py-4 border-t border-cream-100">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Deletion Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Upcoming Puja"
        message={`Are you sure you want to delete "${deleteTarget?.name || "this upcoming puja"}"? This action cannot be undone.`}
        confirmText={deleting ? "Deleting..." : "Delete"}
        danger
      />
    </div>
  );
}
