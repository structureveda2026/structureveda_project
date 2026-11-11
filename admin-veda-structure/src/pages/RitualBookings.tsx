import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  RefreshCw,
  X,
  RotateCcw,
  Flame,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import unifiedBookingAdminService, {
  AdminRitualBooking,
} from "@/services/unifiedBookingAdminService";
import { formatCurrency, formatDate } from "@/utils/bookingUtils";

const SERVICE_TYPE_OPTIONS = [
  { label: "All Rituals (Puja, Yagya, Homa, Japa, Path)", value: "" },
  { label: "Puja", value: "PUJA" },
  { label: "Yagya", value: "YAGYA" },
  { label: "Homa / Havan", value: "HOMA" },
  { label: "Japa / Chanting", value: "JAPA" },
  { label: "Path / Recitation", value: "PATH" },
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
  { label: "Ceremony Date (Desc)", value: "date-desc" },
  { label: "Ceremony Date (Asc)", value: "date-asc" },
  { label: "Amount (High to Low)", value: "amount-desc" },
  { label: "Amount (Low to High)", value: "amount-asc" },
];

export default function RitualBookings() {
  const [bookings, setBookings] = useState<AdminRitualBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
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
      const res = await unifiedBookingAdminService.getRitualBookings({
        search: debouncedSearch.trim() || undefined,
        serviceType: serviceType || undefined,
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
        setError("Failed to retrieve ritual bookings.");
      }
    } catch (err: any) {
      setError(err?.message || "Error loading ritual bookings.");
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    serviceType,
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
    setServiceType("");
    setBookingStatus("");
    setPaymentStatus("");
    setStartDate("");
    setEndDate("");
    setSortBy("createdAt-desc");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(serviceType) ||
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
          title="Ritual Bookings"
          subtitle="Manage personalized ceremony reservations: Puja, Yagya, Homa, Japa, and Path."
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
              placeholder="Search by reference, ritual name, devotee name, phone, gotra..."
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

          {/* Service Type Filter */}
          <div>
            <select
              value={serviceType}
              onChange={(e) => {
                setServiceType(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white text-charcoal-700"
            >
              {SERVICE_TYPE_OPTIONS.map((opt) => (
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
              title="Start Ceremony Date"
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
              title="End Ceremony Date"
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
            Loading ritual bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No ritual bookings found"
              message="No bookings match the selected filters across Puja, Yagya, Homa, Japa, and Path."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider border-b border-cream-200">
                    <th className="text-left px-5 py-3 font-medium">Booking Ref</th>
                    <th className="text-left px-5 py-3 font-medium">Devotee (Yajman)</th>
                    <th className="text-left px-5 py-3 font-medium">Phone / Gotra</th>
                    <th className="text-left px-5 py-3 font-medium">Service Name</th>
                    <th className="text-left px-5 py-3 font-medium">Type</th>
                    <th className="text-left px-5 py-3 font-medium">Ceremony Date</th>
                    <th className="text-left px-5 py-3 font-medium">Amount</th>
                    <th className="text-left px-5 py-3 font-medium">Payment</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">Created Date</th>
                    <th className="text-right px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {bookings.map((b) => {
                    const detailUrl = `/admin/bookings/rituals/${b.id}`;

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
                          {b.customer?.name || "Devotee"}
                        </td>

                        <td className="px-5 py-3 text-xs text-charcoal-500 whitespace-nowrap">
                          <div>{b.customer?.phone || "—"}</div>
                          {b.customer?.gotra && (
                            <div className="text-[11px] text-charcoal-400">Gotra: {b.customer.gotra}</div>
                          )}
                        </td>

                        <td className="px-5 py-3 text-charcoal-700 max-w-xs truncate" title={b.serviceName}>
                          <div className="font-medium truncate">{b.serviceName}</div>
                          {b.panditCount && (
                            <div className="text-[11px] text-charcoal-400">
                              {b.panditCount} Pandit(s) {b.durationSelected ? `• ${b.durationSelected}` : ""}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-saffron-50 text-saffron-800 border border-saffron-200">
                            {b.serviceType}
                          </span>
                        </td>

                        <td className="px-5 py-3 text-charcoal-600 whitespace-nowrap text-xs">
                          <div>{formatDate(b.bookingDate)}</div>
                          {b.bookingTime && (
                            <div className="text-[11px] text-charcoal-400">{b.bookingTime}</div>
                          )}
                        </td>

                        <td className="px-5 py-3 font-semibold text-charcoal-800 whitespace-nowrap">
                          {formatCurrency(b.pricing?.totalAmount, b.pricing?.currency)}
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap">
                          <StatusBadge status={b.paymentStatus} />
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
                of <span className="font-semibold text-charcoal-700">{total}</span> ritual bookings
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

