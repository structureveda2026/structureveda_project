import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  CalendarCheck,
  CreditCard,
  StickyNote,
  Clock,
  MapPin,
  Phone,
  Mail,
  Flame,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  ShieldAlert,
  Save,
  Users,
  Sparkles,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import unifiedBookingAdminService, {
  AdminRitualBooking,
} from "@/services/unifiedBookingAdminService";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/utils/bookingUtils";

const ALLOWED_STATUSES: Array<"Pending" | "Confirmed" | "Completed" | "Cancelled"> = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export default function RitualBookingDetail() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [booking, setBooking] = useState<AdminRitualBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Operational status & notes edit form
  const [selectedStatus, setSelectedStatus] = useState<
    "Pending" | "Confirmed" | "Completed" | "Cancelled"
  >("Pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchBooking = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await unifiedBookingAdminService.getRitualBookingById(id);
      if (res?.success && res.data) {
        setBooking(res.data);
        setSelectedStatus(res.data.bookingStatus);
        setAdminNotes(res.data.notes || "");
      } else {
        setError("Ritual booking not found.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load ritual booking details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleUpdateStatusAndNotes = async () => {
    if (!booking) return;

    // Validate unpaid confirmation rule
    if (selectedStatus === "Confirmed" && booking.paymentStatus !== "Paid") {
      toast.error(
        "Cannot confirm an unpaid booking. A verified payment is required before confirming a ceremony.");
      return;
    }

    setUpdating(true);
    try {
      const res = await unifiedBookingAdminService.updateRitualBookingStatus(
        booking.id || booking.bookingReference,
        {
          bookingStatus: selectedStatus,
          notes: adminNotes.trim(),
        }
      );

      if (res?.success) {
        toast.success("Booking status and operational notes updated successfully.");
        setBooking(res.data);
        setSelectedStatus(res.data.bookingStatus);
        setAdminNotes(res.data.notes || "");
      } else {
        toast.error(res?.message || "Failed to update booking status.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Unable to update booking status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-sm text-charcoal-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-saffron-500 mb-3" />
        Loading ritual booking details...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/bookings/rituals"
          className="inline-flex items-center gap-2 text-sm text-charcoal-600 hover:text-saffron-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ritual Bookings</span>
        </Link>
        <EmptyState
          title="Booking Not Found"
          message={error || "The requested ritual booking does not exist."}
        />
      </div>
    );
  }

  const isTerminalState =
    booking.bookingStatus === "Completed" || booking.bookingStatus === "Cancelled";
  const isPaid = booking.paymentStatus === "Paid";

  return (
    <div className="space-y-6 pb-16">
      {/* Back Link & Header */}
      <div>
        <Link
          to="/admin/bookings/rituals"
          className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 hover:text-saffron-600 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ritual Bookings</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-serif text-charcoal-900">
                {booking.bookingReference}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-saffron-50 text-saffron-800 border border-saffron-200">
                {booking.serviceType}
              </span>
            </div>
            <p className="text-sm text-charcoal-500 mt-1">
              {booking.serviceName} • Created on {formatDateTime(booking.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={booking.paymentStatus} />
            <StatusBadge status={booking.bookingStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Customer & Yajman Details */}
          <div className="card p-5">
            <h3 className="text-base font-semibold text-charcoal-800 mb-4 flex items-center gap-2 border-b border-cream-200 pb-3">
              <User className="w-4 h-4 text-saffron-600" />
              Yajman & Customer Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-charcoal-400 block">Full Name</span>
                <span className="font-semibold text-charcoal-800">
                  {booking.customer?.name || "—"}
                </span>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Contact Phone</span>
                <div className="flex items-center gap-1.5 text-charcoal-800 font-medium">
                  <Phone className="w-3.5 h-3.5 text-charcoal-400" />
                  <span>{booking.customer?.phone || "—"}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Email Address</span>
                <div className="flex items-center gap-1.5 text-charcoal-800">
                  <Mail className="w-3.5 h-3.5 text-charcoal-400" />
                  <span>{booking.customer?.email || "—"}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Gotra</span>
                <span className="font-medium text-charcoal-800">
                  {booking.customer?.gotra || "—"}
                </span>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Rashi</span>
                <span className="text-charcoal-700">
                  {booking.customer?.rashi || "—"}
                </span>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Nakshatra</span>
                <span className="text-charcoal-700">
                  {booking.customer?.nakshatra || "—"}
                </span>
              </div>

              {(booking.customer?.address || booking.customer?.city) && (
                <div className="sm:col-span-2 pt-2 border-t border-cream-100">
                  <span className="text-xs text-charcoal-400 block">Address</span>
                  <div className="flex items-start gap-1.5 text-charcoal-700 text-xs mt-1">
                    <MapPin className="w-3.5 h-3.5 text-charcoal-400 shrink-0 mt-0.5" />
                    <span>
                      {[
                        booking.customer.address,
                        booking.customer.city,
                        booking.customer.state,
                        booking.customer.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Family Members if registered */}
            {booking.familyMembers && booking.familyMembers.length > 0 && (
              <div className="mt-5 pt-4 border-t border-cream-200">
                <h4 className="text-xs font-bold text-charcoal-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-charcoal-400" />
                  Registered Family Members ({booking.familyMembers.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {booking.familyMembers.map((fm, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-cream-50 border border-cream-200 space-y-0.5"
                    >
                      <p className="font-semibold text-charcoal-800">
                        {fm.name || `Member ${idx + 1}`}
                      </p>
                      <p className="text-charcoal-500">
                        Relation: {fm.relation || "Family"} • Gotra: {fm.gotra || "—"}
                      </p>
                      {(fm.rashi || fm.nakshatra) && (
                        <p className="text-charcoal-400 text-[11px]">
                          Rashi: {fm.rashi || "—"} • Nakshatra: {fm.nakshatra || "—"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Service & Ceremony Details */}
          <div className="card p-5">
            <h3 className="text-base font-semibold text-charcoal-800 mb-4 flex items-center gap-2 border-b border-cream-200 pb-3">
              <Flame className="w-4 h-4 text-saffron-600" />
              Ceremony & Schedule Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-charcoal-400 block">Service Name</span>
                <span className="font-semibold text-charcoal-800">{booking.serviceName}</span>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Ceremony Date</span>
                <div className="flex items-center gap-1.5 font-semibold text-charcoal-800">
                  <CalendarCheck className="w-3.5 h-3.5 text-saffron-600" />
                  <span>{formatDate(booking.bookingDate)}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Time Slot</span>
                <div className="flex items-center gap-1.5 text-charcoal-700">
                  <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                  <span>{booking.bookingTime || "As per muhurta"}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Duration</span>
                <span className="text-charcoal-700">
                  {booking.durationSelected || `${booking.durationHours || 1} Hour(s)`}
                </span>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Required Pandits</span>
                <span className="text-charcoal-700 font-medium">
                  {booking.panditCount || 1} Vedic Priest(s)
                </span>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Arrangement Mode</span>
                <span className="text-charcoal-700">
                  {booking.arrangementMode || "At Vedic Sanctum / Temple"}
                </span>
              </div>

              {booking.venueDetails && Object.keys(booking.venueDetails).length > 0 && (
                <div className="sm:col-span-2 pt-2 border-t border-cream-100 text-xs">
                  <span className="text-charcoal-400 block mb-1">Venue Information</span>
                  <div className="p-2.5 rounded bg-cream-50 border border-cream-200 text-charcoal-700">
                    <pre className="whitespace-pre-wrap font-sans text-xs">
                      {JSON.stringify(booking.venueDetails, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Sankalpa Details */}
          <div className="card p-5">
            <h3 className="text-base font-semibold text-charcoal-800 mb-4 flex items-center gap-2 border-b border-cream-200 pb-3">
              <Sparkles className="w-4 h-4 text-saffron-600" />
              Sacred Sankalpa & Prayers
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-charcoal-400 block">Sankalpa Purpose</span>
                <p className="font-semibold text-charcoal-800 mt-0.5">
                  {booking.sankalpDetails?.purpose || "Peace, Prosperity, & Spiritual Welfare"}
                </p>
              </div>

              {booking.sankalpDetails?.description && (
                <div>
                  <span className="text-xs text-charcoal-400 block">Specific Wishes / Notes</span>
                  <p className="text-charcoal-700 text-xs mt-1 p-2.5 rounded bg-cream-50 border border-cream-200 leading-relaxed">
                    {booking.sankalpDetails.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 4. Samagri & Add-ons */}
          {booking.addons && booking.addons.length > 0 && (
            <div className="card p-5">
              <h3 className="text-base font-semibold text-charcoal-800 mb-4 flex items-center gap-2 border-b border-cream-200 pb-3">
                <StickyNote className="w-4 h-4 text-saffron-600" />
                Selected Samagri & Add-ons ({booking.addons.length})
              </h3>
              <div className="divide-y divide-cream-100 text-sm">
                {booking.addons.map((addon, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <span className="text-charcoal-700 font-medium">
                      {addon.name || `Addon #${idx + 1}`}
                    </span>
                    <span className="font-semibold text-charcoal-900">
                      {formatCurrency(addon.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column: Status Management, Pricing, Payment */}
        <div className="space-y-6">
          {/* Status & Operational Notes Manager */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-800 mb-3 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-saffron-600" />
              Manage Booking Status
            </h3>

            {isTerminalState && (
              <div className="mb-3 p-2.5 bg-charcoal-100 border border-cream-300 rounded-lg text-xs text-charcoal-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-charcoal-500 shrink-0" />
                <span>
                  This booking is in terminal state ({booking.bookingStatus}) and cannot be changed.
                </span>
              </div>
            )}

            {!isPaid && (
              <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Unpaid Booking:</strong> Cannot confirm until payment is verified by Cashfree.
                </span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-charcoal-700 block mb-1.5">
                  Update Booking Status
                </label>
                <select
                  disabled={isTerminalState || updating}
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(
                      e.target.value as "Pending" | "Confirmed" | "Completed" | "Cancelled"
                    )
                  }
                  className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 disabled:opacity-50 text-charcoal-800"
                >
                  {ALLOWED_STATUSES.map((st) => {
                    const disableConfirm = st === "Confirmed" && !isPaid;
                    return (
                      <option key={st} value={st} disabled={disableConfirm}>
                        {st} {disableConfirm ? " (Payment Required)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="font-medium text-charcoal-700 block mb-1.5">
                  Admin Operational Notes
                </label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record pandit assignments, puja arrangements, or special devotee notes..."
                  className="w-full p-2.5 text-xs bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 text-charcoal-800 placeholder-charcoal-400"
                />
              </div>

              <button
                type="button"
                onClick={handleUpdateStatusAndNotes}
                disabled={isTerminalState || updating}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-saffron-600 hover:bg-saffron-700 rounded-lg transition disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {updating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-800 mb-3 flex items-center gap-2 border-b border-cream-200 pb-2.5">
              <CreditCard className="w-4 h-4 text-saffron-600" />
              Financial Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 text-charcoal-600">
                <span>Base Dakshina:</span>
                <span className="font-medium text-charcoal-900">
                  {formatCurrency(booking.pricing?.basePrice, booking.pricing?.currency)}
                </span>
              </div>

              {Number(booking.pricing?.panditAddonPrice || 0) > 0 && (
                <div className="flex justify-between py-1 text-charcoal-600">
                  <span>Additional Pandit Dakshina:</span>
                  <span className="font-medium text-charcoal-900">
                    {formatCurrency(booking.pricing?.panditAddonPrice, booking.pricing?.currency)}
                  </span>
                </div>
              )}

              {Number(booking.pricing?.addonsTotal || 0) > 0 && (
                <div className="flex justify-between py-1 text-charcoal-600">
                  <span>Samagri & Add-ons:</span>
                  <span className="font-medium text-charcoal-900">
                    {formatCurrency(booking.pricing?.addonsTotal, booking.pricing?.currency)}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-cream-200 flex justify-between items-center text-sm">
                <span className="font-bold text-charcoal-800">Total Payable:</span>
                <span className="font-bold text-saffron-700 text-base">
                  {formatCurrency(booking.pricing?.totalAmount, booking.pricing?.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Metadata Card */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-800 mb-3 flex items-center gap-2 border-b border-cream-200 pb-2.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Payment Records
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-charcoal-400 block">Payment Gateway</span>
                <span className="font-semibold text-charcoal-800">
                  {booking.paymentGateway || "Cashfree"}
                </span>
              </div>

              <div>
                <span className="text-charcoal-400 block">Payment Status</span>
                <div className="mt-1">
                  <StatusBadge status={booking.paymentStatus} />
                </div>
              </div>

              {booking.transactionId && (
                <div>
                  <span className="text-charcoal-400 block">Gateway Transaction ID</span>
                  <span className="font-mono text-charcoal-800 font-semibold break-all">
                    {booking.transactionId}
                  </span>
                </div>
              )}

              {booking.paymentSessionId && (
                <div>
                  <span className="text-charcoal-400 block">Payment Session ID</span>
                  <span className="font-mono text-charcoal-600 break-all text-[11px]">
                    {booking.paymentSessionId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

