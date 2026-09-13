import { useEffect, useState, useCallback } from "react";
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
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
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
  { label: "Ceremony Start (Ascending)", sort: "startDateTime", order: "ASC" as const },
  { label: "Ceremony Start (Descending)", sort: "startDateTime", order: "DESC" as const },
  { label: "Date Created (Newest First)", sort: "createdAt", order: "DESC" as const },
  { label: "Date Created (Oldest First)", sort: "createdAt", order: "ASC" as const },
  { label: "Name (A to Z)", sort: "name", order: "ASC" as const },
  { label: "Total Capacity (Highest)", sort: "totalCapacity", order: "DESC" as const },
  { label: "Booked Count (Highest)", sort: "bookedCount", order: "DESC" as const },
];

export default function UpcomingPujas() {
  const navigate = useNavigate();
  const [pujas, setPujas] = useState<UpcomingPujaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [occasion, setOccasion] = useState("");
  const [featured, setFeatured] = useState("");
  const [sortIndex, setSortIndex] = useState(0);

  // Deletion state
  const [deleteTarget, setDeleteTarget] = useState<UpcomingPujaData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPujas = useCallback(async () => {
    setLoading(true);
    setError("");
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
      if (featured === "Featured") filters.isFeatured = true;
      if (featured === "Not Featured") filters.isFeatured = false;

      const data = await upcomingPujaService.getUpcomingPujas(filters);
      setPujas(data);
    } catch (err) {
      setError(
        (err as Error).message || "Failed to load Upcoming Pujas from the server.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, status, category, occasion, featured, sortIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPujas();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadPujas]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setCategory("");
    setOccasion("");
    setFeatured("");
    setSortIndex(0);
  };

  const hasActiveFilters =
    search || status || category || occasion || featured || sortIndex !== 0;

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    setSuccessMessage("");
    try {
      await upcomingPujaService.deleteUpcomingPuja(deleteTarget.id);
      setSuccessMessage(
        `Upcoming Puja "${deleteTarget.name}" and its packages were deleted successfully.`,
      );
      setDeleteTarget(null);
      await loadPujas();
    } catch (err) {
      const msg = (err as Error).message;
      setError(
        msg ||
          "Unable to delete Upcoming Puja. If active bookings exist, deletion is restricted.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Quick summary counts
  const totalCount = pujas.length;
  const publishedCount = pujas.filter((p) => p.status === "Published").length;
  const totalBooked = pujas.reduce((acc, p) => acc + (p.bookedCount || 0), 0);
  const totalCapacity = pujas.reduce((acc, p) => acc + (p.totalCapacity || 0), 0);

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

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage("")}
            className="p-1 rounded-md text-green-700 hover:bg-green-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start justify-between animate-fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Operation Notice</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => setError("")}
            className="p-1 rounded-md text-red-700 hover:bg-red-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-charcoal-400">
              Total Pujas
            </span>
            <Calendar className="w-4 h-4 text-saffron-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal-800 mt-2">{totalCount}</p>
          <span className="text-xs text-charcoal-400">Across all statuses</span>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-charcoal-400">
              Published
            </span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-700 mt-2">{publishedCount}</p>
          <span className="text-xs text-charcoal-400">Ready for public catalog</span>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-charcoal-400">
              Total Capacity
            </span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-charcoal-800 mt-2">{totalCapacity}</p>
          <span className="text-xs text-charcoal-400">Combined devotee slots</span>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-charcoal-400">
              Booked Slots
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{totalBooked}</p>
          <span className="text-xs text-charcoal-400">System operational count</span>
        </div>
      </div>

      {/* Filter and Search Controls Card */}
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by puja name, deity, slug..."
            />
          </div>

          {/* Status Filter */}
          <div>
            <FilterDropdown
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
              label="All Statuses"
            />
          </div>

          {/* Category Filter */}
          <div>
            <FilterDropdown
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
              label="All Categories"
            />
          </div>

          {/* Occasion Filter */}
          <div>
            <FilterDropdown
              value={occasion}
              onChange={setOccasion}
              options={OCCASION_OPTIONS}
              label="All Occasions"
            />
          </div>

          {/* Featured Filter */}
          <div>
            <FilterDropdown
              value={featured}
              onChange={setFeatured}
              options={["Featured", "Not Featured"]}
              label="All Visibility"
            />
          </div>
        </div>

        {/* Secondary Bar: Sorting and Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-cream-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-charcoal-400 font-medium">Sort By:</span>
            <select
              value={sortIndex}
              onChange={(e) => setSortIndex(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg border border-cream-200 bg-white text-charcoal-700 focus:outline-none focus:ring-1 focus:ring-saffron-400"
            >
              {SORT_OPTIONS.map((opt, idx) => (
                <option key={opt.label} value={idx}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-charcoal-500 hover:text-charcoal-800 transition"
              >
                <Filter className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}

            <button
              onClick={loadPujas}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-saffron-700 hover:text-saffron-800 font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Table or State */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-saffron-500 animate-spin mb-3" />
            <p className="text-sm text-charcoal-500">Loading Upcoming Pujas from server...</p>
          </div>
        ) : pujas.length === 0 ? (
          <EmptyState
            title="No upcoming pujas found"
            message={
              hasActiveFilters
                ? "No ceremonies match your current search and filter criteria. Try adjusting your filters."
                : "Get started by creating your first upcoming temple ceremony."
            }
            action={
              hasActiveFilters ? (
                <button onClick={handleResetFilters} className="btn-secondary">
                  Clear All Filters
                </button>
              ) : (
                <Link
                  to="/admin/upcoming-pujas/new"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Upcoming Puja
                </Link>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-50 border-b border-cream-200 text-[11px] uppercase tracking-wider text-charcoal-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Puja Ceremony</th>
                  <th className="py-3 px-4">Ceremony Date & Time</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Capacity vs Booked</th>
                  <th className="py-3 px-4">Packages</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {pujas.map((puja) => {
                  const capacity = puja.totalCapacity || 1;
                  const booked = puja.bookedCount || 0;
                  const percent = Math.min(100, Math.round((booked / capacity) * 100));

                  const ceremonyDateFormatted = new Date(
                    puja.ceremonyDate,
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  const startTimeFormatted = new Date(
                    puja.startDateTime,
                  ).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={puja.id} className="table-row-hover">
                      {/* Puja Name & Slug */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {puja.bannerImage ? (
                            <img
                              src={puja.bannerImage}
                              alt={puja.name}
                              className="w-10 h-10 rounded-lg object-cover border border-cream-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-saffron-50 text-saffron-600 flex items-center justify-center font-semibold text-xs border border-saffron-100 flex-shrink-0">
                              PUJA
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link
                              to={`/admin/upcoming-pujas/${puja.id}`}
                              className="font-semibold text-charcoal-800 hover:text-saffron-600 transition block truncate max-w-xs"
                              title={puja.name}
                            >
                              {puja.name}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-charcoal-400 mt-0.5">
                              <span className="font-mono text-[11px] truncate max-w-[140px]">
                                /{puja.slug}
                              </span>
                              {puja.location && (
                                <span className="inline-flex items-center gap-0.5 text-charcoal-400">
                                  • <MapPin className="w-3 h-3 text-charcoal-400" />
                                  {puja.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Ceremony Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-charcoal-800 font-medium">
                          {ceremonyDateFormatted}
                        </div>
                        <div className="text-xs text-charcoal-400 inline-flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {startTimeFormatted}
                        </div>
                      </td>

                      {/* Classification */}
                      <td className="py-3.5 px-4">
                        <div className="text-charcoal-700 text-xs font-medium">
                          {puja.category || "General"}
                        </div>
                        {puja.occasion && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-cream-100 text-charcoal-600 rounded text-[11px]">
                            {puja.occasion}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={puja.status} />
                      </td>

                      {/* Capacity vs Booked */}
                      <td className="py-3.5 px-4 whitespace-nowrap min-w-[170px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-charcoal-700">
                              Booked: <strong className="text-charcoal-900">{booked}</strong>
                            </span>
                            <span className="text-charcoal-400">
                              Cap: <strong className="text-charcoal-700">{capacity}</strong>
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-cream-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                percent >= 90
                                  ? "bg-red-500"
                                  : percent >= 70
                                    ? "bg-amber-500"
                                    : "bg-saffron-500"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-charcoal-400">
                            {capacity - booked > 0
                              ? `${capacity - booked} slots remaining`
                              : "Capacity full"}
                          </div>
                        </div>
                      </td>

                      {/* Packages */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-cream-100 text-charcoal-700 text-xs font-medium">
                          {puja.packages?.length || 0} package(s)
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {puja.isFeatured ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-charcoal-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <button
                            onClick={() => navigate(`/admin/upcoming-pujas/${puja.id}`)}
                            className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 rounded-lg transition"
                            title="View Puja Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/upcoming-pujas/${puja.id}/edit`)
                            }
                            className="p-1.5 text-charcoal-400 hover:text-saffron-600 hover:bg-cream-100 rounded-lg transition"
                            title="Edit Puja"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(puja)}
                            className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Puja"
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
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Upcoming Puja"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone. Note: The backend will reject deletion if any devotee bookings are associated with this Puja.`}
          confirmText={deleting ? "Deleting..." : "Delete Ceremony"}
          danger={true}
        />
      )}
    </div>
  );
}
