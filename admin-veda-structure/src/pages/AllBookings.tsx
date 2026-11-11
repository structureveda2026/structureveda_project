import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Calendar,
  X,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import unifiedBookingAdminService, {
  UnifiedBooking,
} from "@/services/unifiedBookingAdminService";
import {
  formatCurrency,
  formatDate,
  getSourceTypeConfig,
  getBookingDetailRoute,
} from "@/utils/bookingUtils";

const SOURCE_TYPE_OPTIONS = [
  { label: "All Booking Types", value: "" },
  { label: "Ritual Bookings", value: "RITUAL" },
  { label: "Community Puja", value: "COMMUNITY_PUJA" },
  { label: "Astrologer Consultation", value: "CONSULTATION" },
];

const SERVICE_CATEGORY_OPTIONS = [
  { label: "All Disciplines", value: "" },
  { label: "Puja", value: "PUJA" },
  { label: "Yagya", value: "YAGYA" },
  { label: "Homa", value: "HOMA" },
  { label: "Japa", value: "JAPA" },
  { label: "Path", value: "PATH" },
  { label: "Community Puja", value: "COMMUNITY_PUJA" },
  { label: "Consultation", value: "CONSULTATION" },
];

const BOOKING_STATUS_OPTIONS = [
  { label: "All Booking Statuses", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "All Payment Statuses", value: "" },
  { label: "Paid", value: "Paid" },
  { label: "Pending", value: "Pending" },
  { label: "Failed", value: "Failed" },
  { label: "Refunded", value: "Refunded" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "createdAt-desc" },
  { label: "Oldest First", value: "createdAt-asc" },
  { label: "Booking Date (Desc)", value: "date-desc" },
  { label: "Booking Date (Asc)", value: "date-asc" },
  { label: "Amount (High to Low)", value: "amount-desc" },
  { label: "Amount (Low to High)", value: "amount-asc" },
];

export default function AllBookings() {
  const [bookings, setBookings] = useState<UnifiedBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(25);

  // Debounce search input
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
      const res = await unifiedBookingAdminService.getUnifiedBookings({
        search: debouncedSearch.trim() || undefined,
        sourceType: sourceType || undefined,
        serviceCategory: serviceCategory || undefined,
        bookingStatus: bookingStatus || undefined,
        paymentStatus: paymentStatus || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit,
        sortBy,
      });

      if (res?.success) {
        setBookings(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      } else {
        setError("Failed to retrieve booking records.");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while fetching bookings.");
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    sourceType,
    serviceCategory,
    bookingStatus,
    paymentStatus,
    startDate,
    endDate,
    page,
    limit,
    sortBy,
  ]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSourceType("");
    setServiceCategory("");
    setBookingStatus("");
    setPaymentStatus("");
    setStartDate("");
    setEndDate("");
    setSortBy("createdAt-desc");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(sourceType) ||
    Boolean(serviceCategory) ||
    Boolean(bookingStatus) ||
    Boolean(paymentStatus) ||
    Boolean(startDate) ||
    Boolean(endDate) ||
    sortBy !== "createdAt-desc";

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="All Bookings"
          subtitle="Unified catalogue across Rituals, Community Pujas, and Consultations."
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchBookings()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-charcoal-700 bg-white border border-cream-300 rounded-lg hover:bg-cream-50 transition cursor-pointer disabled:opacity-50"
            title="Reload data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by reference, customer name, phone or email..."
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

          {/* Booking Type Filter */}
          <div>
            <select
              value={sourceType}
              onChange={(e) => {
                setSourceType(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white text-charcoal-700"
            >
              {SOURCE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Service Category */}
          <div>
            <select
              value={serviceCategory}
              onChange={(e) => {
                setServiceCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white text-charcoal-700"
            >
              {SERVICE_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Row: Booking Status, Payment Status, Date Range, Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-cream-200">
          <div>
            <select
              value={bookingStatus}
              onChange={(e) => {
                setBookingStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 text-charcoal-700"
            >
              {BOOKING_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 text-charcoal-700"
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              title="Start Date (Booking Date)"
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
              title="End Date (Booking Date)"
              className="w-full px-2.5 py-1.5 text-xs bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 text-charcoal-700"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 text-charcoal-700"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="p-1.5 text-charcoal-400 hover:text-red-600 transition shrink-0"
                title="Reset All Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchBookings()}
            className="text-red-800 underline font-medium hover:text-red-950 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table Card */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-charcoal-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-saffron-500 mb-2" />
            Loading booking records...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No bookings match your filters"
              message="Try adjusting your search criteria or resetting filters to see available bookings."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider border-b border-cream-200">
                    <th className="text-left px-5 py-3 font-medium">Booking Ref</th>
                    <th className="text-left px-5 py-3 font-medium">Customer</th>
                    <th className="text-left px-5 py-3 font-medium">Contact</th>
                    <th className="text-left px-5 py-3 font-medium">Service</th>
                    <th className="text-left px-5 py-3 font-medium">Type</th>
                    <th className="text-left px-5 py-3 font-medium">Booking Date</th>
                    <th className="text-left px-5 py-3 font-medium">Amount</th>
                    <th className="text-left px-5 py-3 font-medium">Payment</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">Created At</th>
                    <th className="text-right px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {bookings.map((b) => {
                    const typeCfg = getSourceTypeConfig(b.sourceType);
                    const detailUrl = getBookingDetailRoute(b.sourceType, b.recordId);

                    return (
                      <tr key={`${b.sourceType}-${b.recordId}`} className="table-row-hover">
                        {/* Reference */}
                        <td className="px-5 py-3 font-semibold text-charcoal-900 whitespace-nowrap">
                          <Link
                            to={detailUrl}
                            className="hover:text-saffron-600 transition underline-offset-2 hover:underline"
                          >
                            {b.bookingReference}
                          </Link>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-3 text-charcoal-700 whitespace-nowrap">
                          <div className="font-medium">{b.customerName || "Devotee"}</div>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-3 text-xs text-charcoal-500 whitespace-nowrap">
                          <div>{b.customerPhone || "—"}</div>
                          {b.customerEmail && (
                            <div className="text-[11px] text-charcoal-400">{b.customerEmail}</div>
                          )}
                        </td>

                        {/* Service */}
                        <td className="px-5 py-3 text-charcoal-700 max-w-xs truncate" title={b.serviceName}>
                          <div className="font-medium truncate">{b.serviceName}</div>
                          <div className="text-[11px] text-charcoal-400 uppercase tracking-wider">
                            {b.serviceCategory}
                          </div>
                        </td>

                        {/* Booking Type */}
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${typeCfg.badge}`}>
                            {typeCfg.shortLabel}
                          </span>
                        </td>

                        {/* Booking Date */}
                        <td className="px-5 py-3 text-charcoal-600 whitespace-nowrap text-xs">
                          <div>{formatDate(b.bookingDate)}</div>
                          {b.bookingTime && (
                            <div className="text-[11px] text-charcoal-400">{b.bookingTime}</div>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-3 font-semibold text-charcoal-800 whitespace-nowrap">
                          {formatCurrency(b.amount, b.currency)}
                        </td>

                        {/* Payment Status */}
                        <td className="px-5 py-3 whitespace-nowrap">
                          <StatusBadge status={b.paymentStatus} />
                        </td>

                        {/* Booking Status */}
                        <td className="px-5 py-3 whitespace-nowrap">
                          <StatusBadge status={b.bookingStatus} />
                        </td>

                        {/* Created At */}
                        <td className="px-5 py-3 text-xs text-charcoal-400 whitespace-nowrap">
                          {formatDate(b.createdAt)}
                        </td>

                        {/* Action */}
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
                of <span className="font-semibold text-charcoal-700">{total}</span> bookings
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

