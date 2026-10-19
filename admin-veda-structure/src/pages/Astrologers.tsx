import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Eye,
  Edit,
  Power,
  RefreshCw,
  AlertCircle,
  Sparkles,
  MapPin,
  Clock,
  Star,
  Package,
  Plus,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import StatCard from "@/components/StatCard";
import { useToast } from "@/context/ToastContext";
import astrologerAdminService, {
  AdminAstrologer,
} from "@/services/astrologerAdminService";

const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Active Only", value: "true" },
  { label: "Inactive Only", value: "false" },
];

export default function Astrologers() {
  const navigate = useNavigate();
  const toast = useToast();

  const [astrologers, setAstrologers] = useState<AdminAstrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Toggle status dialog state
  const [targetAstrologer, setTargetAstrologer] =
    useState<AdminAstrologer | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadAstrologers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await astrologerAdminService.getAstrologers({
        search,
        isActive: status,
      });

      if (res && res.data) {
        setAstrologers(res.data);
      } else {
        setAstrologers([]);
      }
    } catch (err: any) {
      console.error("Error loading astrologers:", err);
      setError(
        err?.message || "Failed to load astrologers. Please check backend connection."
      );
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    loadAstrologers();
  }, [loadAstrologers]);

  const handleToggleStatus = async () => {
    if (!targetAstrologer) return;
    setActionLoading(true);

    try {
      const newStatus = !targetAstrologer.isActive;
      await astrologerAdminService.updateAstrologerStatus(
        targetAstrologer.id,
        newStatus
      );

      toast.success(
        `${targetAstrologer.name} has been ${
          newStatus ? "activated" : "deactivated"
        }.`
      );

      setAstrologers((prev) =>
        prev.map((a) =>
          a.id === targetAstrologer.id ? { ...a, isActive: newStatus } : a
        )
      );

      setTargetAstrologer(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update astrologer status.");
    } finally {
      setActionLoading(false);
    }
  };

  const totalCount = astrologers.length;
  const activeCount = astrologers.filter((a) => a.isActive).length;
  const inactiveCount = totalCount - activeCount;
  const totalPackages = astrologers.reduce(
    (acc, a) => acc + (a.packagesCount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Astrologers"
        description="Manage astrologer profiles, credentials, biographies, and visibility."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadAstrologers()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-charcoal-600 bg-white border border-cream-200 rounded-lg hover:bg-cream-50 transition cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin text-saffron-600" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <Link
              to="/admin/astrologers/new"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-charcoal-900 bg-saffron-500 hover:bg-saffron-400 rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Astrologer</span>
            </Link>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Astrologers"
          value={totalCount}
          icon={Users}
          color="saffron"
        />
        <StatCard
          title="Active Profiles"
          value={activeCount}
          icon={Sparkles}
          color="green"
        />
        <StatCard
          title="Inactive Profiles"
          value={inactiveCount}
          icon={Power}
          color="charcoal"
        />
        <StatCard
          title="Consultation Tiers"
          value={totalPackages}
          icon={Package}
          color="orange"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-cream-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, title, seat, or code..."
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <FilterDropdown
            label="Filter by Status"
            value={status}
            onChange={setStatus}
            options={STATUS_FILTER_OPTIONS}
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-red-700 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadAstrologers()}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded font-medium transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Astrologers Table */}
      <div className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-charcoal-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-saffron-600" />
            <p className="text-sm">Loading astrologers catalogue...</p>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No astrologers found"
              description={
                search || status
                  ? "No astrologer matches your search or filter criteria."
                  : "No astrologer profiles have been initialized in the system."
              }
              icon={Users}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50/50 text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Astrologer</th>
                  <th className="py-3.5 px-4">Holy Seat & Location</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Rating & Reviews</th>
                  <th className="py-3.5 px-4">Packages</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 text-sm">
                {astrologers.map((astrologer) => (
                  <tr
                    key={astrologer.id}
                    className="hover:bg-cream-50/40 transition group"
                  >
                    {/* Astrologer Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {astrologer.profileImage ? (
                          <img
                            src={astrologer.profileImage}
                            alt={astrologer.name}
                            className="w-11 h-11 rounded-full object-cover border border-cream-200 shadow-xs flex-shrink-0"
                            onError={(e) => {
                              // Fallback on image load error
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center font-bold text-base border border-saffron-200 flex-shrink-0">
                            {astrologer.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            to={`/admin/astrologers/${astrologer.id}`}
                            className="font-semibold text-charcoal-800 hover:text-saffron-600 transition block truncate"
                          >
                            {astrologer.name}
                          </Link>
                          <p className="text-xs text-charcoal-500 truncate max-w-xs">
                            {astrologer.title}
                          </p>
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[11px] font-mono bg-cream-100 text-charcoal-600 rounded">
                            {astrologer.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Holy Seat & Location */}
                    <td className="py-3.5 px-4 text-charcoal-600">
                      <div className="flex items-center gap-1.5 font-medium text-charcoal-700">
                        <MapPin className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                        <span>{astrologer.holySeat}</span>
                      </div>
                      <span className="text-xs text-charcoal-400 block mt-0.5">
                        {astrologer.location}
                      </span>
                    </td>

                    {/* Experience */}
                    <td className="py-3.5 px-4 text-charcoal-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                        <span>{astrologer.experienceYears}+ Years</span>
                      </div>
                    </td>

                    {/* Rating & Reviews */}
                    <td className="py-3.5 px-4 text-charcoal-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-charcoal-800">
                          {astrologer.rating ? Number(astrologer.rating).toFixed(1) : "5.0"}
                        </span>
                        <span className="text-xs text-charcoal-400 ml-1">
                          ({astrologer.reviewsCount})
                        </span>
                      </div>
                      <span className="text-xs text-charcoal-400 block mt-0.5">
                        {astrologer.sessionsCount} Sessions
                      </span>
                    </td>

                    {/* Packages */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/astrologers/${astrologer.id}/packages`)
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-saffron-50 hover:bg-saffron-100 text-saffron-700 border border-saffron-200 transition cursor-pointer"
                        title="Manage Packages & Pricing"
                      >
                        <Package className="w-3 h-3" />
                        <span>{astrologer.packagesCount || 0} Tiers</span>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={astrologer.isActive ? "Active" : "Inactive"} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Manage Packages Button */}
                        <button
                          onClick={() =>
                            navigate(`/admin/astrologers/${astrologer.id}/packages`)
                          }
                          className="p-1.5 text-charcoal-400 hover:text-saffron-600 hover:bg-cream-100 rounded-lg transition cursor-pointer"
                          title="Manage Packages & Pricing"
                        >
                          <Package className="w-4 h-4" />
                        </button>

                        {/* View Button */}
                        <button
                          onClick={() => navigate(`/admin/astrologers/${astrologer.id}`)}
                          className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 rounded-lg transition cursor-pointer"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() =>
                            navigate(`/admin/astrologers/${astrologer.id}/edit`)
                          }
                          className="p-1.5 text-charcoal-400 hover:text-saffron-600 hover:bg-cream-100 rounded-lg transition cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Toggle Status Button */}
                        <button
                          onClick={() => setTargetAstrologer(astrologer)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            astrologer.isActive
                              ? "text-green-600 hover:bg-green-50 hover:text-green-700"
                              : "text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-700"
                          }`}
                          title={astrologer.isActive ? "Deactivate" : "Activate"}
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
      </div>

      {/* Confirmation Dialog for Status Toggle */}
      <ConfirmDialog
        isOpen={Boolean(targetAstrologer)}
        onClose={() => setTargetAstrologer(null)}
        onConfirm={handleToggleStatus}
        title={
          targetAstrologer?.isActive
            ? `Deactivate ${targetAstrologer?.name}?`
            : `Activate ${targetAstrologer?.name}?`
        }
        message={
          targetAstrologer?.isActive
            ? `Deactivating this astrologer will hide their profile from the public website listings and booking dropdowns. Existing customer bookings will remain preserved.`
            : `Activating this astrologer will make their profile publicly visible on the website and enable customer consultations.`
        }
        confirmText={
          targetAstrologer?.isActive ? "Deactivate Profile" : "Activate Profile"
        }
        confirmVariant={targetAstrologer?.isActive ? "danger" : "primary"}
        loading={actionLoading}
      />
    </div>
  );
}
