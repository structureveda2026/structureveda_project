import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  IndianRupee,
  Flame,
  Users,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ShieldAlert,
  CreditCard,
  Eye,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
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

export default function BookingOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentBookings, setRecentBookings] = useState<UnifiedBooking[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Distribution breakdowns from loaded sample
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({
    RITUAL: 0,
    COMMUNITY_PUJA: 0,
    CONSULTATION: 0,
  });

  const [bookingStatusCounts, setBookingStatusCounts] = useState<Record<string, number>>({
    Pending: 0,
    Confirmed: 0,
    Completed: 0,
    Cancelled: 0,
  });

  const [paymentStatusCounts, setPaymentStatusCounts] = useState<Record<string, number>>({
    Paid: 0,
    Pending: 0,
    Failed: 0,
    Refunded: 0,
  });

  const [verifiedRevenue, setVerifiedRevenue] = useState(0);

  const loadOverviewData = async () => {
    setLoading(true);
    setError("");
    try {
      // Query recent bookings with high limit to compute live KPIs
      const res = await unifiedBookingAdminService.getUnifiedBookings({
        page: 1,
        limit: 100,
        sortBy: "createdAt-desc",
      });

      if (res?.success && Array.isArray(res.data)) {
        setRecentBookings(res.data.slice(0, 10));
        setTotalCount(res.total || res.data.length);

        // Calculate distribution across the fetched dataset
        const catMap: Record<string, number> = {
          RITUAL: 0,
          COMMUNITY_PUJA: 0,
          CONSULTATION: 0,
        };
        const bStatusMap: Record<string, number> = {
          Pending: 0,
          Confirmed: 0,
          Completed: 0,
          Cancelled: 0,
        };
        const pStatusMap: Record<string, number> = {
          Paid: 0,
          Pending: 0,
          Failed: 0,
          Refunded: 0,
        };

        let rev = 0;

        res.data.forEach((b) => {
          // Source Category
          if (b.sourceType && catMap[b.sourceType] !== undefined) {
            catMap[b.sourceType] = (catMap[b.sourceType] || 0) + 1;
          }

          // Booking Status
          const bStatus = b.bookingStatus;
          if (bStatus) {
            bStatusMap[bStatus] = (bStatusMap[bStatus] || 0) + 1;
          }

          // Payment Status
          const pStatus = b.paymentStatus;
          if (pStatus) {
            if (pStatus === "Paid") {
              pStatusMap.Paid = (pStatusMap.Paid || 0) + 1;
              rev += Number(b.amount || 0);
            } else if (pStatus === "Pending") {
              pStatusMap.Pending = (pStatusMap.Pending || 0) + 1;
            } else if (pStatus === "Failed") {
              pStatusMap.Failed = (pStatusMap.Failed || 0) + 1;
            } else if (pStatus.toLowerCase().includes("refund")) {
              pStatusMap.Refunded = (pStatusMap.Refunded || 0) + 1;
            }
          }
        });

        setCategoryCounts(catMap);
        setBookingStatusCounts(bStatusMap);
        setPaymentStatusCounts(pStatusMap);
        setVerifiedRevenue(rev);
      } else {
        setError("Failed to fetch booking statistics.");
      }
    } catch (err: any) {
      setError(err?.message || "Error loading booking overview data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverviewData();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Booking Overview"
          subtitle="Centralized management dashboard for Rituals, Community Pujas, and Astrologer Consultations."
        />
        <div className="flex items-center gap-3">
          <button
            onClick={loadOverviewData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-charcoal-700 bg-white border border-cream-300 rounded-lg hover:bg-cream-50 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-saffron-600 rounded-lg hover:bg-saffron-700 transition cursor-pointer shadow-sm"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Revenue Compliance Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">
            Strict Financial Rule Enforcement
          </p>
          <p className="text-amber-800">
            Only successfully paid transactions with verified gateway records count toward collected revenue.
            Pending orders, failed attempts, and refunded amounts are strictly excluded from collected revenue totals.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadOverviewData}
            className="text-red-800 underline font-medium hover:text-red-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* 6 Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Bookings */}
        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-saffron-50 flex items-center justify-center mb-2">
            <CalendarCheck className="w-4 h-4 text-saffron-600" />
          </div>
          <p className="text-xs text-charcoal-400 font-medium">Total Bookings</p>
          <p className="text-xl font-bold text-charcoal-800 mt-1">
            {loading ? "..." : totalCount.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Paid Bookings */}
        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xs text-charcoal-400 font-medium">Paid Bookings</p>
          <p className="text-xl font-bold text-green-700 mt-1">
            {loading ? "..." : (paymentStatusCounts.Paid || 0).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Pending Payments */}
        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xs text-charcoal-400 font-medium">Pending Payments</p>
          <p className="text-xl font-bold text-amber-700 mt-1">
            {loading ? "..." : (paymentStatusCounts.Pending || 0).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Failed Payments */}
        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xs text-charcoal-400 font-medium">Failed Payments</p>
          <p className="text-xl font-bold text-red-600 mt-1">
            {loading ? "..." : (paymentStatusCounts.Failed || 0).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Confirmed Bookings */}
        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xs text-charcoal-400 font-medium">Confirmed Bookings</p>
          <p className="text-xl font-bold text-blue-700 mt-1">
            {loading ? "..." : (bookingStatusCounts.Confirmed || 0).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Cancelled Bookings */}
        <div className="card p-4">
          <div className="w-9 h-9 rounded-lg bg-charcoal-100 flex items-center justify-center mb-2">
            <AlertTriangle className="w-4 h-4 text-charcoal-500" />
          </div>
          <p className="text-xs text-charcoal-400 font-medium">Cancelled</p>
          <p className="text-xl font-bold text-charcoal-700 mt-1">
            {loading ? "..." : (bookingStatusCounts.Cancelled || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Breakdown Cards: Category, Booking Status, Payment Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Category Breakdown */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-saffron-600" />
            Booking Distribution by Category
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-cream-50/70 border border-cream-200">
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-saffron-600" />
                <span className="text-sm font-medium text-charcoal-700">Ritual Bookings</span>
              </div>
              <span className="text-sm font-bold text-charcoal-900">
                {categoryCounts.RITUAL || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cream-50/70 border border-cream-200">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-charcoal-700">Community Puja</span>
              </div>
              <span className="text-sm font-bold text-charcoal-900">
                {categoryCounts.COMMUNITY_PUJA || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cream-50/70 border border-cream-200">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-charcoal-700">Consultations</span>
              </div>
              <span className="text-sm font-bold text-charcoal-900">
                {categoryCounts.CONSULTATION || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Status Summary */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-saffron-600" />
            Booking Fulfillment Status
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-center">
              <p className="text-xs text-amber-800 font-medium">Pending</p>
              <p className="text-lg font-bold text-amber-900 mt-1">
                {bookingStatusCounts.Pending || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-center">
              <p className="text-xs text-blue-800 font-medium">Confirmed</p>
              <p className="text-lg font-bold text-blue-900 mt-1">
                {bookingStatusCounts.Confirmed || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50/70 border border-green-200 text-center">
              <p className="text-xs text-green-800 font-medium">Completed</p>
              <p className="text-lg font-bold text-green-900 mt-1">
                {bookingStatusCounts.Completed || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50/70 border border-red-200 text-center">
              <p className="text-xs text-red-800 font-medium">Cancelled</p>
              <p className="text-lg font-bold text-red-900 mt-1">
                {bookingStatusCounts.Cancelled || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Status Summary */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-charcoal-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-saffron-600" />
            Payment Status & Verified Revenue
          </h3>
          <div className="p-3 mb-3 rounded-lg bg-green-50/80 border border-green-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-green-800 font-medium">Verified Paid Revenue</p>
              <p className="text-lg font-bold text-green-900">
                {formatCurrency(verifiedRevenue)}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-green-700" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between px-2.5 py-1.5 rounded bg-cream-50 border border-cream-200">
              <span className="text-charcoal-600">Paid:</span>
              <span className="font-semibold text-green-700">{paymentStatusCounts.Paid || 0}</span>
            </div>
            <div className="flex justify-between px-2.5 py-1.5 rounded bg-cream-50 border border-cream-200">
              <span className="text-charcoal-600">Pending:</span>
              <span className="font-semibold text-amber-700">{paymentStatusCounts.Pending || 0}</span>
            </div>
            <div className="flex justify-between px-2.5 py-1.5 rounded bg-cream-50 border border-cream-200">
              <span className="text-charcoal-600">Failed:</span>
              <span className="font-semibold text-red-700">{paymentStatusCounts.Failed || 0}</span>
            </div>
            <div className="flex justify-between px-2.5 py-1.5 rounded bg-cream-50 border border-cream-200">
              <span className="text-charcoal-600">Refunded:</span>
              <span className="font-semibold text-charcoal-700">{paymentStatusCounts.Refunded || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="card overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-cream-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-charcoal-800">
              Recent Bookings
            </h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Latest incoming reservations across all disciplines.
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-charcoal-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-saffron-500 mb-2" />
            Loading recent bookings...
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No bookings recorded yet"
              message="New reservations across Rituals, Community Pujas, or Consultations will appear here."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Reference</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Service</th>
                  <th className="text-left px-5 py-3 font-medium">Type</th>
                  <th className="text-left px-5 py-3 font-medium">Amount</th>
                  <th className="text-left px-5 py-3 font-medium">Payment</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-right px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {recentBookings.map((b) => {
                  const typeCfg = getSourceTypeConfig(b.sourceType);
                  const detailUrl = getBookingDetailRoute(b.sourceType, b.recordId);

                  return (
                    <tr key={`${b.sourceType}-${b.recordId}`} className="table-row-hover">
                      <td className="px-5 py-3 font-medium text-charcoal-800">
                        <Link
                          to={detailUrl}
                          className="hover:text-saffron-600 transition underline-offset-2 hover:underline"
                        >
                          {b.bookingReference}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-charcoal-700">
                        <div className="font-medium">{b.customerName || "Devotee"}</div>
                        {b.customerPhone && (
                          <div className="text-xs text-charcoal-400">{b.customerPhone}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-charcoal-600 max-w-xs truncate" title={b.serviceName}>
                        {b.serviceName}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${typeCfg.badge}`}>
                          {typeCfg.shortLabel}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-charcoal-800">
                        {formatCurrency(b.amount, b.currency)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={b.paymentStatus} />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={b.bookingStatus} />
                      </td>
                      <td className="px-5 py-3 text-xs text-charcoal-500">
                        {formatDate(b.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to={detailUrl}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-600 hover:text-saffron-700 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

