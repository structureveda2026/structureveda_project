import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  CalendarCheck,
  CreditCard,
  StickyNote,
  CheckCircle,
  CalendarClock,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Video,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Phone as PhoneIcon,
  User as UserIcon,
  RotateCcw,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import bookingAdminService, {
  AdminBooking,
} from "@/services/bookingAdminService";

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Actions
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState<number | string>("");
  const [actionLoading, setActionLoading] = useState(false);

  // Reschedule Form
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleNotes, setRescheduleNotes] = useState("");

  // Notes
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchBooking = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await bookingAdminService.getBookingById(id);
      if (res?.data) {
        setBooking(res.data);
        setAdminNotes(res.data.notes || "");
        setRescheduleDate(res.data.consultationDate || "");
        setRescheduleTime(res.data.consultationTime || "");
        setRefundAmount(res.data.amount || "");
      } else {
        setError("Booking not found.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load booking details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  // Handle Status Update
  const handleUpdateStatus = async (newStatus: string) => {
    if (!booking) return;
    setActionLoading(true);
    try {
      await bookingAdminService.updateBookingStatus(
        booking.bookingReference || booking.id,
        newStatus,
        adminNotes
      );
      toast.success(`Booking status changed to "${newStatus}".`);
      setShowCancel(false);
      fetchBooking();
    } catch (err: any) {
      toast.error(err?.message || `Failed to update status to ${newStatus}.`);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reschedule
  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Please provide both a new date and time slot.");
      return;
    }

    setActionLoading(true);
    try {
      await bookingAdminService.rescheduleBooking(
        booking.bookingReference || booking.id,
        rescheduleDate,
        rescheduleTime,
        rescheduleNotes
      );
      toast.success(
        `Consultation rescheduled to ${rescheduleDate} at ${rescheduleTime}.`
      );
      setShowReschedule(false);
      fetchBooking();
    } catch (err: any) {
      toast.error(err?.message || "Failed to reschedule consultation slot.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Verify Refund with Cashfree
  const handleVerifyRefund = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      const res = await bookingAdminService.verifyBookingRefund(
        booking.bookingReference || booking.id
      );
      toast.success(res?.message || "Refund verified with Cashfree.");
      fetchBooking();
    } catch (err: any) {
      toast.error(err?.message || "Failed to verify refund with Cashfree.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Initiate Refund with Cashfree
  const handleInitiateRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setActionLoading(true);
    try {
      const res = await bookingAdminService.initiateBookingRefund(
        booking.bookingReference || booking.id,
        Number(refundAmount) || undefined,
        refundReason || undefined
      );
      toast.success(res?.message || "Refund initiated with Cashfree.");
      setShowRefundModal(false);
      fetchBooking();
    } catch (err: any) {
      toast.error(err?.message || "Failed to initiate refund with Cashfree.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Save Notes
  const handleSaveNotes = async () => {
    if (!booking) return;
    setSavingNotes(true);
    try {
      await bookingAdminService.updateBookingStatus(
        booking.bookingReference || booking.id,
        booking.bookingStatus,
        adminNotes
      );
      toast.success("Notes saved successfully.");
      setBooking({ ...booking, notes: adminNotes });
    } catch (err: any) {
      toast.error(err?.message || "Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-charcoal-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-saffron-600" />
        <p className="text-sm">Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-500 hover:text-charcoal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookings</span>
        </Link>
        <EmptyState
          title="Booking not found"
          message={error || "The requested consultation booking does not exist."}
          icon={<CalendarCheck className="w-8 h-8 text-charcoal-300" />}
        />
      </div>
    );
  }

  const customerInfo = [
    { label: "Customer Name", value: booking.fullName, icon: UserIcon },
    { label: "Phone / WhatsApp", value: booking.phone, icon: Phone },
    { label: "Email Address", value: booking.email || "Not Provided", icon: Mail },
    { label: "Gender", value: booking.gender, icon: UserIcon },
    { label: "Date of Birth", value: booking.dateOfBirth, icon: CalendarClock },
    { label: "Time of Birth", value: booking.timeOfBirth, icon: Clock },
    { label: "Place of Birth", value: booking.placeOfBirth, icon: MapPin },
    { label: "Report Language", value: booking.reportLanguage, icon: Sparkles },
  ];

  const bookingInfo = [
    { label: "Reference Code", value: booking.bookingReference },
    { label: "Astrologer", value: booking.astrologerName },
    { label: "Package Tier", value: booking.packageName },
    { label: "Duration", value: booking.duration },
    { label: "Consultation Date", value: booking.consultationDate },
    { label: "Consultation Time", value: booking.consultationTime },
    { label: "Consultation Mode", value: booking.consultationMode },
    { label: "Booking Status", value: booking.bookingStatus, badge: true },
  ];

  const paymentInfo = [
    {
      label: "Charged Amount",
      value: `₹${Number(booking.amount).toLocaleString("en-IN")}`,
    },
    { label: "Payment Status", value: booking.paymentStatus, badge: true },
    { label: "Transaction ID", value: booking.transactionId || "Pending Gateway Transaction" },
    { label: "Payment Method", value: booking.paymentMethod || "Online" },
    { label: "Created At", value: new Date(booking.createdAt).toLocaleString("en-IN") },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Link */}
      <div>
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-500 hover:text-charcoal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookings</span>
        </Link>
      </div>

      {/* Header & Status Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono text-charcoal-800">
              {booking.bookingReference}
            </h1>
            <StatusBadge status={booking.bookingStatus} />
          </div>
          <p className="text-sm text-charcoal-500 mt-1">
            {booking.packageName} · {booking.astrologerName} · {booking.fullName}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {booking.bookingStatus === "Pending" && (
            <button
              disabled={actionLoading}
              onClick={() => handleUpdateStatus("Confirmed")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-xs transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm Booking</span>
            </button>
          )}

          {(booking.bookingStatus === "Confirmed" ||
            booking.bookingStatus === "Rescheduled") && (
            <button
              disabled={actionLoading}
              onClick={() => handleUpdateStatus("Completed")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg shadow-xs transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Completed</span>
            </button>
          )}

          {booking.bookingStatus !== "Cancelled" &&
            booking.bookingStatus !== "Completed" && (
              <button
                disabled={actionLoading}
                onClick={() => setShowReschedule(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-cream-100 hover:bg-cream-200 text-charcoal-700 rounded-lg border border-cream-200 transition cursor-pointer"
              >
                <CalendarClock className="w-4 h-4" />
                <span>Reschedule</span>
              </button>
            )}

          {booking.bookingStatus !== "Cancelled" &&
            booking.bookingStatus !== "Completed" && (
              <button
                disabled={actionLoading}
                onClick={() => setShowCancel(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Booking</span>
              </button>
            )}
        </div>
      </div>

      {booking.bookingStatus === "Payment Review Required" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Action Required: Payment Captured After Reservation Window Expired</p>
            <p className="mt-1">
              Customer payment was successfully captured on Cashfree, but the 15-minute slot reservation expired and the slot was taken.
              Please contact the client and use <strong>Reschedule</strong> to book an alternative open slot, or <strong>Cancel Booking</strong> to initiate a refund via Cashfree.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information Card */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-base font-semibold text-charcoal-800">
              Client & Kundali Birth Details
            </h3>
          </div>
          <div className="divide-y divide-cream-100 text-sm">
            {customerInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-start gap-3 py-2.5"
                >
                  <Icon className="w-4 h-4 text-charcoal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-charcoal-400 w-32 flex-shrink-0">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-charcoal-700">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Consultation Details Card */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-saffron-50 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-saffron-600" />
            </div>
            <h3 className="text-base font-semibold text-charcoal-800">
              Consultation Schedule & Mode
            </h3>
          </div>
          <div className="divide-y divide-cream-100 text-sm">
            {bookingInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2.5"
              >
                <span className="text-xs text-charcoal-400">{item.label}</span>
                {item.badge ? (
                  <StatusBadge status={item.value} />
                ) : (
                  <span className="text-sm font-medium text-charcoal-700">
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Add-ons list if any */}
          {booking.addOns && Object.values(booking.addOns).some(Boolean) && (
            <div className="p-3 bg-saffron-50/50 rounded-lg border border-saffron-100 space-y-1">
              <span className="text-xs font-semibold text-saffron-800 uppercase tracking-wide">
                Consultation Add-Ons Included:
              </span>
              <div className="flex flex-wrap gap-2 pt-1 text-xs text-charcoal-700">
                {booking.addOns.addOnCouple && (
                  <span className="px-2 py-0.5 bg-white border border-saffron-200 rounded">
                    Couple Chart Analysis
                  </span>
                )}
                {booking.addOns.addOnReport && (
                  <span className="px-2 py-0.5 bg-white border border-saffron-200 rounded">
                    Detailed Written Kundali Report
                  </span>
                )}
                {booking.addOns.addOnExpress && (
                  <span className="px-2 py-0.5 bg-white border border-saffron-200 rounded">
                    Express 24-Hr Scheduling
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-cream-50 flex items-center gap-2.5 text-xs text-charcoal-600">
            <Video className="w-4 h-4 text-saffron-600 flex-shrink-0" />
            <span>
              Consultation Mode:{" "}
              <strong className="text-charcoal-800">
                {booking.consultationMode}
              </strong>
            </span>
          </div>
        </div>

        {/* Payment & Authoritative Pricing */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-charcoal-800">
                Payment & Gateway Status
              </h3>
            </div>
            {/* Refund verification trigger if pending or failed */}
            {(booking.paymentStatus === "Refund Pending" ||
              booking.paymentStatus === "Refund Failed") && (
              <button
                disabled={actionLoading}
                onClick={handleVerifyRefund}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition cursor-pointer"
                title="Query Cashfree gateway to check latest refund state"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    actionLoading ? "animate-spin" : ""
                  }`}
                />
                <span>Verify with Cashfree</span>
              </button>
            )}
          </div>
          <div className="divide-y divide-cream-100 text-sm">
            {paymentInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2.5"
              >
                <span className="text-xs text-charcoal-400">{item.label}</span>
                {item.badge ? (
                  <StatusBadge status={item.value} />
                ) : (
                  <span className="text-sm font-medium text-charcoal-700">
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Refund State Banners */}
          {booking.paymentStatus === "Refund Pending" && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Refund in Pending Status</p>
                <p>
                  The refund has been submitted to Cashfree and is awaiting gateway settlement.
                  Click <strong>Verify with Cashfree</strong> or wait for the gateway webhook to confirm completion.
                </p>
              </div>
            </div>
          )}

          {booking.paymentStatus === "Refund Failed" && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Refund Marked as Failed</p>
                <p>
                  Cashfree rejected or cancelled the refund. Inspect notes below or retry initiating a new refund.
                </p>
              </div>
            </div>
          )}

          {booking.paymentStatus === "Refunded" && (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <p>Refund successfully settled and verified with Cashfree gateway.</p>
            </div>
          )}

          {/* Allow Initiate Refund button if eligible */}
          {(booking.bookingStatus === "Cancelled" ||
            booking.bookingStatus === "Payment Review Required") &&
            (booking.paymentStatus === "Paid" ||
              booking.paymentStatus === "Refund Failed") && (
              <button
                disabled={actionLoading}
                onClick={() => {
                  setRefundAmount(booking.amount);
                  setRefundReason(
                    `Refund for booking ${booking.bookingReference}`
                  );
                  setShowRefundModal(true);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Initiate Gateway Refund (Cashfree)</span>
              </button>
            )}
        </div>

        {/* Internal Admin Notes */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <StickyNote className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-charcoal-800">
              Admin & Astrologer Notes
            </h3>
          </div>
          <textarea
            className="w-full min-h-[110px] p-3 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:border-saffron-500 transition resize-y"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add internal consultation notes, follow-up recommendations, or special client requests..."
          />
          <button
            disabled={savingNotes}
            onClick={handleSaveNotes}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg transition cursor-pointer"
          >
            {savingNotes ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Notes...</span>
              </>
            ) : (
              <span>Save Notes</span>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog: Cancel */}
      <ConfirmDialog
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={() => handleUpdateStatus("Cancelled")}
        title="Cancel Consultation Booking"
        message={`Are you sure you want to cancel booking ${booking.bookingReference}? This will free the consultation slot and mark the record as cancelled.`}
        confirmText="Yes, Cancel Booking"
        confirmVariant="danger"
        loading={actionLoading}
      />

      {/* Reschedule Modal */}
      <Modal
        isOpen={showReschedule}
        onClose={() => setShowReschedule(false)}
        title="Reschedule Consultation"
        size="md"
      >
        <form onSubmit={handleReschedule} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              New Consultation Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:border-saffron-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              New Consultation Time Slot <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 11:30 AM - 12:00 PM"
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:border-saffron-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Reason / Notes for Rescheduling
            </label>
            <textarea
              className="w-full min-h-[80px] p-3 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:border-saffron-500 resize-y"
              value={rescheduleNotes}
              onChange={(e) => setRescheduleNotes(e.target.value)}
              placeholder="e.g. Client requested postponement due to travel..."
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-cream-200">
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => setShowReschedule(false)}
              className="px-4 py-2 text-xs font-medium text-charcoal-600 hover:bg-cream-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg shadow-xs transition"
            >
              {actionLoading ? "Checking Availability..." : "Confirm Reschedule"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Refund Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        title="Initiate Gateway Refund via Cashfree"
        size="md"
      >
        <form onSubmit={handleInitiateRefund} className="space-y-4 text-sm">
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authoritative Gateway Refund</p>
              <p className="mt-0.5">
                This triggers a genuine refund API request directly to Cashfree using an idempotency key.
                Status will be set to <strong>Refund Pending</strong> until Cashfree confirms success.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Refund Amount (INR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              min="1"
              max={booking.amount}
              required
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:border-saffron-500 font-mono"
            />
            <p className="text-xs text-charcoal-400 mt-1">
              Maximum refundable: ₹{Number(booking.amount).toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Reason for Refund
            </label>
            <textarea
              className="w-full min-h-[80px] p-3 text-sm bg-cream-50/50 border border-cream-200 rounded-lg focus:outline-none focus:border-saffron-500 resize-y"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="e.g. Consultation slot cancelled / Payment Review conflict resolved"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-cream-200">
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => setShowRefundModal(false)}
              className="px-4 py-2 text-xs font-medium text-charcoal-600 hover:bg-cream-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition"
            >
              {actionLoading ? "Contacting Cashfree..." : "Submit Refund"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
