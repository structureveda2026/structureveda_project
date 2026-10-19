import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  CalendarClock,
  CheckCircle,
  XCircle,
  Clock,
  CalendarCheck,
  RefreshCw,
  AlertCircle,
  Search,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import bookingAdminService, {
  AdminBooking,
} from "@/services/bookingAdminService";

const astrologerFilterOptions = [
  "Vishal Bhardwaj",
  "Acharya Anurag Bhardwaj",
];

const bookingStatuses = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
  "Rescheduled",
  "Payment Review Required",
];

const paymentStatuses = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
  "Refund Pending",
  "Refund Failed",
];

export default function Bookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [astrologerName, setAstrologerName] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    try {
      let astroCode = "";
      if (astrologerName === "Vishal Bhardwaj") astroCode = "ast-vishal";
      if (astrologerName === "Acharya Anurag Bhardwaj") astroCode = "ast-anurag";

      const res = await bookingAdminService.getBookings({
        search: search.trim() || undefined,
        astrologerId: astroCode || undefined,
        bookingStatus: status || undefined,
        paymentStatus: paymentStatus || undefined,
        page,
        limit: 10,
      });

      if (res?.data) {
        setBookings(res.data);
        setTotal(res.total || res.data.length);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load consultation bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [search, astrologerName, status, paymentStatus, page]);

  // Derived stats from current view/totals
  const pendingCount = bookings.filter((b) => b.bookingStatus === "Pending").length;
  const confirmedCount = bookings.filter((b) => b.bookingStatus === "Confirmed").length;
  const completedCount = bookings.filter((b) => b.bookingStatus === "Completed").length;
  const cancelledCount = bookings.filter((b) => b.bookingStatus === "Cancelled").length;

  const stats = [
    {
      label: "Total Registered",
      value: String(total),
      icon: Clock,
      color: "text-saffron-600",
      bg: "bg-saffron-50",
    },
    {
      label: "Confirmed / Active",
      value: String(confirmedCount),
      icon: CalendarClock,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Completed",
      value: String(completedCount),
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Cancelled / Pending",
      value: `${cancelledCount} / ${pendingCount}`,
      icon: XCircle,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Consultation Bookings"
        description="Monitor, manage, and reschedule client consultations for Vishal Bhardwaj and Acharya Anurag Bhardwaj."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-charcoal-400">{s.label}</p>
                  <p className="text-xl font-bold text-charcoal-800">
                    {s.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search reference, name, phone..."
          />
          <FilterDropdown
            value={astrologerName}
            onChange={(v) => {
              setAstrologerName(v);
              setPage(1);
            }}
            options={astrologerFilterOptions}
            label="All Astrologers"
          />
          <FilterDropdown
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={bookingStatuses}
            label="All Booking Status"
          />
          <FilterDropdown
            value={paymentStatus}
            onChange={(v) => {
              setPaymentStatus(v);
              setPage(1);
            }}
            options={paymentStatuses}
            label="All Payment Status"
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadBookings()}
            className="px-2.5 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded font-medium transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-charcoal-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-saffron-600" />
            <p className="text-sm">Loading consultation bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No bookings found"
            message="No consultation bookings matched your search or filter criteria."
            icon={<CalendarCheck className="w-8 h-8 text-charcoal-300" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Reference</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Astrologer</th>
                  <th className="text-left px-5 py-3 font-medium">Package Tier</th>
                  <th className="text-left px-5 py-3 font-medium">Consultation Date</th>
                  <th className="text-left px-5 py-3 font-medium">Slot Time</th>
                  <th className="text-left px-5 py-3 font-medium">Amount</th>
                  <th className="text-left px-5 py-3 font-medium">Payment</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="table-row-hover">
                    <td className="px-5 py-3 font-mono font-medium text-charcoal-700">
                      <Link
                        to={`/admin/bookings/${b.bookingReference || b.id}`}
                        className="hover:text-saffron-600"
                      >
                        {b.bookingReference}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-charcoal-800">
                        {b.fullName}
                      </div>
                      <div className="text-xs text-charcoal-400 font-mono">
                        {b.phone}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-charcoal-600 font-medium">
                      {b.astrologerName}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-charcoal-700">{b.packageName}</div>
                      <div className="text-xs text-charcoal-400">{b.duration}</div>
                    </td>
                    <td className="px-5 py-3 text-charcoal-600">
                      {b.consultationDate}
                    </td>
                    <td className="px-5 py-3 text-charcoal-500 font-medium">
                      {b.consultationTime}
                    </td>
                    <td className="px-5 py-3 font-bold text-saffron-700">
                      ₹{Number(b.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.bookingStatus} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/admin/bookings/${b.bookingReference || b.id}`}
                        className="inline-flex p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition"
                        title="View Full Booking Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 10 && (
          <div className="px-5 py-4 border-t border-cream-100">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
