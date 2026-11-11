import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  IndianRupee,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  Search,
  RefreshCw,
  X,
  ExternalLink,
  ShieldAlert,
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

const PAYMENT_STATUS_OPTIONS = [
  { label: "All Payment Statuses", value: "" },
  { label: "Paid", value: "Paid" },
  { label: "Pending", value: "Pending" },
  { label: "Failed", value: "Failed" },
  { label: "Refunded", value: "Refunded" },
];

const BOOKING_TYPE_OPTIONS = [
  { label: "All Booking Types", value: "" },
  { label: "Ritual Bookings", value: "RITUAL" },
  { label: "Community Puja", value: "COMMUNITY_PUJA" },
  { label: "Astrologer Consultation", value: "CONSULTATION" },
];

export default function Payments() {
  const [payments, setPayments] = useState<UnifiedBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(25);

  // Summary Metrics (Computed strictly on verified paid records)
  const [verifiedRevenue, setVerifiedRevenue] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await unifiedBookingAdminService.getUnifiedBookings({
        search: debouncedSearch.trim() || undefined,
        paymentStatus: paymentStatus || undefined,
        sourceType: sourceType || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit,
        sortBy: "createdAt-desc",
      });

      if (res?.success) {
        const rows = res.data || [];
        setPayments(rows);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);

        // Strict revenue computation across verified paid records in current view
        let rev = 0;
        let p = 0;
        let pend = 0;
        let f = 0;

        rows.forEach((r) => {
          if (r.paymentStatus === "Paid") {
            rev += Number(r.amount || 0);
            p += 1;
          } else if (r.paymentStatus === "Pending") {
            pend += 1;
          } else if (r.paymentStatus === "Failed") {
            f += 1;
          }
        });

        setVerifiedRevenue(rev);
        setPaidCount(p);
        setPendingCount(pend);
        setFailedCount(f);
      } else {
        setError("Failed to load payment records.");
      }
    } catch (err: any) {
      setError(err?.message || "Error loading payment records.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, paymentStatus, sourceType, startDate, endDate, page, limit]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setPaymentStatus("");
    setSourceType("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(paymentStatus) ||
    Boolean(sourceType) ||
    Boolean(startDate) ||
    Boolean(endDate);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Payments & Transactions"
          subtitle="Real-time transaction tracking across Cashfree gateways and offline ceremony registrations."
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchPayments()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-charcoal-700 bg-white border border-cream-300 rounded-lg hover:bg-cream-50 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Revenue Compliance Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">
            Payment Integrity Policy
          </p>
          <p className="text-amber-800">
            Cashfree payment verification and webhooks are authoritative. Administrators cannot manually override gateway states or mark unverified transactions as Paid. Revenue totals reflect only verified, successful collections.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center mb-2">
            <IndianRupee className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xs text-charcoal-400 font-medium">Page Verified Revenue</p>
          <p className="text-xl font-bold text-green-700 mt-1">
            {formatCurrency(verifiedRevenue)}
          </p>
        </div>

        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xs text-charcoal-400 font-medium">Paid Records</p>
          <p className="text-xl font-bold text-charcoal-800 mt-1">{paidCount}</p>
        </div>

        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xs text-charcoal-400 font-medium">Pending Records</p>
          <p className="text-xl font-bold text-amber-700 mt-1">{pendingCount}</p>
        </div>

        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xs text-charcoal-400 font-medium">Failed Records</p>
          <p className="text-xl font-bold text-red-600 mt-1">{failedCount}</p>
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
              placeholder="Search by booking reference, devotee, phone, or service..."
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

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white text-charcoal-700"
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2 border-t border-cream-200">
          <div>
            <select
              value={sourceType}
              onChange={(e) => {
                setSourceType(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 text-charcoal-700"
            >
              {BOOKING_TYPE_OPTIONS.map((opt) => (
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
              title="Start Date"
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
              title="End Date"
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
            onClick={() => fetchPayments()}
            className="text-red-800 underline font-medium hover:text-red-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* Payments Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-charcoal-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-saffron-500 mb-2" />
            Loading transaction records...
          </div>
        ) : payments.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No payment records found"
              message="No transactions match the selected filters."
              icon={<CreditCard className="w-8 h-8 text-charcoal-300" />}
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
                    <th className="text-left px-5 py-3 font-medium">Booking Type</th>
                    <th className="text-left px-5 py-3 font-medium">Service</th>
                    <th className="text-left px-5 py-3 font-medium">Amount</th>
                    <th className="text-left px-5 py-3 font-medium">Gateway</th>
                    <th className="text-left px-5 py-3 font-medium">Payment Status</th>
                    <th className="text-left px-5 py-3 font-medium">Created Date</th>
                    <th className="text-right px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {payments.map((p) => {
                    const typeCfg = getSourceTypeConfig(p.sourceType);
                    const detailUrl = getBookingDetailRoute(p.sourceType, p.recordId);

                    return (
                      <tr key={`${p.sourceType}-${p.recordId}`} className="table-row-hover">
                        <td className="px-5 py-3 font-semibold text-charcoal-900 whitespace-nowrap">
                          <Link
                            to={detailUrl}
                            className="hover:text-saffron-600 transition underline-offset-2 hover:underline"
                          >
                            {p.bookingReference}
                          </Link>
                        </td>

                        <td className="px-5 py-3 text-charcoal-700 whitespace-nowrap">
                          <div className="font-medium">{p.customerName || "Devotee"}</div>
                          {p.customerPhone && (
                            <div className="text-xs text-charcoal-400">{p.customerPhone}</div>
                          )}
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${typeCfg.badge}`}>
                            {typeCfg.shortLabel}
                          </span>
                        </td>

                        <td className="px-5 py-3 text-charcoal-600 max-w-xs truncate" title={p.serviceName}>
                          {p.serviceName}
                        </td>

                        <td className="px-5 py-3 font-semibold text-charcoal-800 whitespace-nowrap">
                          {formatCurrency(p.amount, p.currency)}
                        </td>

                        <td className="px-5 py-3 text-xs text-charcoal-600 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-cream-100 text-charcoal-700 font-medium">
                            {p.paymentGateway || "Cashfree"}
                          </span>
                        </td>

                        <td className="px-5 py-3 whitespace-nowrap">
                          <StatusBadge status={p.paymentStatus} />
                        </td>

                        <td className="px-5 py-3 text-xs text-charcoal-500 whitespace-nowrap">
                          {formatDate(p.createdAt)}
                        </td>

                        <td className="px-5 py-3 text-right whitespace-nowrap">
                          <Link
                            to={detailUrl}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cream-100 hover:bg-saffron-50 text-xs font-semibold text-charcoal-700 hover:text-saffron-700 transition"
                          >
                            <span>Booking</span>
                            <ExternalLink className="w-3 h-3" />
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
                of <span className="font-semibold text-charcoal-700">{total}</span> records
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
