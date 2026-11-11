import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  RefreshCw,
  X,
  RotateCcw,
  Users,
  Info,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import unifiedBookingAdminService, {
  AdminCommunityPujaBooking,
} from "@/services/unifiedBookingAdminService";
import { formatCurrency, formatDate } from "@/utils/bookingUtils";

const BOOKING_STATUS_OPTIONS = [
  { label: "All Booking Statuses", value: "" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Pending", value: "Pending" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Completed", value: "Completed" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "All Payment Statuses", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Not Integrated", value: "Not Integrated" },
];

export default function CommunityPujaBookings() {
  const [bookings, setBookings] = useState<AdminCommunityPujaBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(25);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await unifiedBookingAdminService.getCommunityPujaBookings({
        search: debouncedSearch.trim() || undefined,
        bookingStatus: bookingStatus || undefined,
        paymentStatus: paymentStatus || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit,
      });

      if (res?.success) {
        setBookings(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      } else {
        setError("Failed to retrieve community puja bookings.");
      }
    } catch (err: any) {
      setError(err?.message || "Error loading community puja bookings.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, bookingStatus, paymentStatus, startDate, endDate, page, limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setBookingStatus("");
    setPaymentStatus("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(bookingStatus) ||
    Boolean(paymentStatus) ||
    Boolean(startDate) ||
    Boolean(endDate);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Community Puja Bookings"
          subtitle="Manage registrations for Upcoming Public Ceremonies and Temple Pujas."
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchBookings()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-charcoal-700 bg-white border border-cream-300 rounded-lg hover:bg-cream-50 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Workflow Notice */}
      <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 text-xs text-purple-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-purple-950">
            Community Puja Payment & Registration Workflow
          </p>
          <p className="text-purple-800">
            Community Pujas are registered for public group ceremonies. Payment integration status is indicated directly from recorded data. Unintegrated registrations are handled via traditional temple dakshina or offline coordination.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by reference, devotee name, phone, email, or puja name..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white text-charcoal-800 placeholder-charcoal-400 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Booking Status Filter */}
          <div>
            <select
              value={bookingStatus}
              onChange={(e) => {
                setBookingStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white text-charcoal-700"
            >
              {BOOKING_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range & Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2 border-t border-cream-200">
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              title="Start Registration Date"
              className="w-full px-2.5 py-1.5 text-xs bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 text-charcoal-700"
            />
          </div>

          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              title="End Registration Date"
              className="w-full px-2.5 py-1.5 text-xs bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 text-charcoal-700"
            />
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-charcoal-600 bg-cream-100 hover:bg-cream-200 rounded-lg transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchBookings()}
            className="text-red-800 underline font-medium hover:text-red-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-charcoal-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-saffron-500 mb-2" />
            Loading community puja registrations...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No registrations found"
              message="No community puja bookings match the current filter criteria."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider border-b border-cream-200">
                    <th className="text-left px-5 py-3 font-medium">Booking Ref</th>
                    <th className="text-left px-5 py-3 font-medium">Primary Devotee</th>
                    <th className="text-left px-5 py-3 font-medium">Contact Details</th>
                    <th className="text-left px-5 py-3 font-medium">Upcoming Puja</th>
                    <th className="text-left px-5 py-3 font-medium">Package</th>
                    <th className="text-left px-5 py-3 font-medium">Amount</th>
                    <th className="text-left px-5 py-3 font-medium">Payment Info</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">Registration Date</th>
                    <th className="text-right px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {bookings.map((b) => {
                    const detailUrl = `/admin/bookings/community-puja/${b.id}`;

                    return (
                      <tr key={b.id} className="table-row-hover">
                        <td className="px-5 py-3 font-semibold text-charcoal-900 whitespace-nowrap">
                          <Link
                            to={detailUrl}
                            className="hover:text-saffron-600 transition underline-offset-2 hover:underline"
                          >
                            {b.bookingReference}
                          </Link>
                        </td>

                        <td className="px-5 py-3 text-charcoal-700 whitespace-nowrap font-medium">
                          <div>{b.customer?.name || "Devotee"}</div>
                          {b.devoteeCount > 1 && (
                            <div className="text-[11px] text-purple-700 font-semibold">
                              +{b.devoteeCount - 1} family member(s)
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-3 text-xs text-charcoal-500 whitespace-nowrap">
                          <div>{b.customer?.phone || "—"}</div>
                          {b.customer?.email && (
                            <div className="text-[11px] text-charcoal-400">{b.customer.email}</div>
                          )}
                        </td>

                        <td className="px-5 py-3 text-charcoal-700 max-w-xs truncate" title={b.puja?.name}>
                          <div className="font-medium truncate">{b.puja?.name || "Upcoming Puja"}</div>
                          {b.puja?.ceremonyDate && (
                            <div className="text-[11px] text-charcoal-400">
                              Ceremony: {formatDate(b.puja.ceremonyDate)}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-3 text-charcoal-700 whitespace-nowrap text-xs">
                          <div className="font-medium">{b.package?.name || "Default"}</div>
                          {b.package?.maxDevotees && (
                            <div className="text-[11px] text-charcoal-400">
                              Max {b.package.maxDevotees} devotee(s)
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-3 font-semibold text-charcoal-800 whitespace-nowrap">
                          {formatCurrency(b.amount, b.currency)}
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap">
                          <StatusBadge status={b.paymentStatus || "Not Integrated"} />
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap">
                          <StatusBadge status={b.bookingStatus} />
                        </td>

                        <td className="px-5 py-3 text-xs text-charcoal-400 whitespace-nowrap">
                          {formatDate(b.createdAt)}
                        </td>

                        <td className="px-5 py-3 text-right whitespace-nowrap">
                          <Link
                            to={detailUrl}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cream-100 hover:bg-saffron-50 text-xs font-semibold text-charcoal-700 hover:text-saffron-700 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-charcoal-500">
                Showing <span className="font-semibold text-charcoal-700">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-semibold text-charcoal-700">
                  {Math.min(page * limit, total)}
                </span>{" "}
                of <span className="font-semibold text-charcoal-700">{total}</span> community bookings
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

