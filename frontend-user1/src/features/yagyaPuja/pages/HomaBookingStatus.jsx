import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  Printer,
  Calendar,
  User,
  Users,
  MapPin,
  CreditCard,
  Home,
} from "lucide-react";
import ritualBookingService from "../../../services/ritualBookingService";
import homaCatalogueService from "../../../services/homaCatalogueService";

const RITUAL_STORAGE_KEY = "veda_active_ritual_booking";

/**
 * HomaBookingStatus Page
 * Route: /yagya-puja/homa/:slug/booking-status
 *
 * Handles:
 * 1. Cashfree return URL: ?order_id={order_id}
 * 2. Recovery from localStorage (veda_active_ritual_booking) or URL query params
 * 3. Server-side payment verification (authoritative)
 * 4. Display of 6 canonical states:
 *    - Loading
 *    - Payment Successful / Confirmed
 *    - Payment Pending
 *    - Payment Failed
 *    - Booking Not Found
 *    - Verification Error
 * 5. Retry / resume payment without creating duplicate bookings
 */
const HomaBookingStatus = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL parameters & recovery
  const orderId = searchParams.get("order_id") || searchParams.get("orderId");
  const queryRef =
    searchParams.get("bookingReference") ||
    searchParams.get("ref") ||
    searchParams.get("reference");
  const storedRef =
    typeof window !== "undefined" ? localStorage.getItem(RITUAL_STORAGE_KEY) : null;

  // Derive candidate booking reference
  const candidateRef = (() => {
    if (orderId && typeof orderId === "string") {
      return orderId.split("_")[0].trim().toUpperCase();
    }
    if (queryRef && typeof queryRef === "string") {
      return queryRef.split("_")[0].trim().toUpperCase();
    }
    if (storedRef && typeof storedRef === "string") {
      return storedRef.split("_")[0].trim().toUpperCase();
    }
    return null;
  })();

  // Page States: "LOADING" | "CONFIRMED" | "PENDING" | "FAILED" | "NOT_FOUND" | "ERROR"
  const [pageStatus, setPageStatus] = useState("LOADING");
  const [booking, setBooking] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Format canonical arrangement mode
  const getArrangementLabel = (mode) => {
    switch (mode) {
      case "remote":
        return "Remote Sankalpa (Live Audio/Video Telecast)";
      case "kashi":
        return "Kashi Sacred Ghats & Consecrated Shrines (Varanasi)";
      case "customer_home":
        return "Devotee Residence / Private Premises";
      case "temple":
        return "Consecrated Mandir / Temple Sanctum";
      case "veda_structure":
        return "Veda Structure Ashram & Consecrated Centre";
      case "other":
        return "Other Sacred Designated Venue";
      default:
        return mode || "Vedic Fire Altar";
    }
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "Scheduled with Acharyas";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Authoritative Verification & Status Retrieval
  const verifyAndFetchStatus = useCallback(async () => {
    if (!candidateRef || !candidateRef.startsWith("VEDA-")) {
      setPageStatus("NOT_FOUND");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    try {
      // 1. Fetch service details if slug is available
      if (slug) {
        try {
          const sRes = await homaCatalogueService.getHomaServiceBySlug(slug);
          if (sRes) {
            setServiceDetails(sRes);
          }
        } catch {
          // Non-critical, fallback to booking data
        }
      }

      // 2. Perform authoritative server verification
      let verifyRes = null;
      try {
        // Send orderId if present (supports retry orders with suffixes), else candidateRef
        verifyRes = await ritualBookingService.verifyPayment(orderId || candidateRef);
      } catch (vErr) {
        console.warn("Payment verify endpoint notice:", vErr?.response?.data || vErr.message);
      }

      // 3. Fetch authoritative booking status
      const statusRes = await ritualBookingService.getBookingStatus(candidateRef);

      if (!statusRes?.success || !statusRes?.data) {
        setPageStatus("NOT_FOUND");
        return;
      }

      const statusData = statusRes.data;

      // 4. Optionally fetch detailed ritual booking record for rich Homa metadata
      let fullDetail = null;
      try {
        const detailRes = await ritualBookingService.getRitualBooking(candidateRef);
        if (detailRes?.success && detailRes?.data) {
          fullDetail = detailRes.data;
        }
      } catch {
        // Non-blocking fallback
      }

      // Assemble unified authoritative booking state
      const unifiedBooking = {
        bookingReference: statusData.bookingReference || candidateRef,
        bookingStatus: statusData.bookingStatus,
        paymentStatus: statusData.paymentStatus,
        amount:
          statusData.amount != null
            ? statusData.amount
            : fullDetail?.pricing?.totalAmount != null
            ? fullDetail.pricing.totalAmount
            : 0,
        serviceType: statusData.serviceType || "HOMA",
        serviceSlug: statusData.serviceSlug || slug,
        serviceName:
          statusData.serviceName ||
          fullDetail?.service?.name ||
          serviceDetails?.name ||
          "Sacred Vedic Homa",
        bookingDate:
          statusData.bookingDate ||
          fullDetail?.configuration?.commencementDate ||
          fullDetail?.configuration?.date,
        bookingTime: statusData.bookingTime || fullDetail?.configuration?.timeSlot,
        customerName:
          statusData.customerName ||
          fullDetail?.yajman?.name ||
          "Devotee",
        phone: statusData.phone || fullDetail?.yajman?.mobile,
        email: statusData.email || fullDetail?.yajman?.email,
        transactionId: statusData.transactionId || verifyRes?.data?.transactionId,
        // Homa-specific parameters
        havanCount:
          fullDetail?.configuration?.havanCount ||
          fullDetail?.sankalp?.homaMetadata?.havanCount ||
          1,
        days:
          fullDetail?.configuration?.days ||
          fullDetail?.configuration?.durationDays ||
          fullDetail?.sankalp?.homaMetadata?.days ||
          1,
        durationDays:
          fullDetail?.configuration?.durationDays ||
          fullDetail?.configuration?.days ||
          1,
        panditCount:
          fullDetail?.configuration?.panditCount ||
          fullDetail?.sankalp?.homaMetadata?.panditCount ||
          1,
        dailyHours:
          fullDetail?.configuration?.dailyHours ||
          fullDetail?.sankalp?.homaMetadata?.dailyHours ||
          serviceDetails?.dailyHours ||
          "3 – 4 Hours Daily",
        havanCapacityPerPandit:
          fullDetail?.configuration?.havanCapacityPerPandit ||
          serviceDetails?.havanCapacityPerPandit ||
          "500 Ahutis per Pandit / Day",
        commencementDate:
          fullDetail?.configuration?.commencementDate ||
          statusData.bookingDate,
        completionDate:
          fullDetail?.configuration?.completionDate ||
          fullDetail?.sankalp?.homaMetadata?.completionDate,
        arrangementMode:
          fullDetail?.configuration?.arrangementMode ||
          "kashi",
      };

      setBooking(unifiedBooking);

      // 5. Determine Authoritative State
      const isConfirmed =
        (verifyRes?.success && verifyRes?.confirmed) ||
        (unifiedBooking.bookingStatus === "Confirmed" && unifiedBooking.paymentStatus === "Paid");

      if (isConfirmed) {
        // Payment Successful
        localStorage.removeItem(RITUAL_STORAGE_KEY);
        setPageStatus("CONFIRMED");
      } else if (
        unifiedBooking.bookingStatus === "Cancelled" ||
        unifiedBooking.paymentStatus === "Failed" ||
        verifyRes?.orderStatus === "TERMINATED" ||
        verifyRes?.orderStatus === "EXPIRED"
      ) {
        setPageStatus("FAILED");
      } else {
        // Payment Pending
        setPageStatus("PENDING");
      }
    } catch (err) {
      console.error("Homa status check error:", err);
      if (err.response?.status === 404) {
        setPageStatus("NOT_FOUND");
      } else {
        setPageStatus("ERROR");
        setErrorMessage(
          err.response?.data?.message ||
            "Unable to verify booking status with the payment server. Please try again."
        );
      }
    } finally {
      setIsVerifying(false);
    }
  }, [candidateRef, orderId, slug, serviceDetails]);

  useEffect(() => {
    let isCancelled = false;
    Promise.resolve().then(() => {
      if (!isCancelled) {
        verifyAndFetchStatus();
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [verifyAndFetchStatus]);

  // Handle Copy Reference
  const handleCopy = () => {
    if (!candidateRef) return;
    navigator.clipboard?.writeText(candidateRef).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  // Handle Print Receipt
  const handlePrint = () => {
    window.print();
  };

  // Handle Retry / Resume Payment
  // Preserves active booking reference in localStorage so RitualBookingWizard restores it
  // and reuses the existing booking reference without creating a duplicate.
  const handleRetryPayment = () => {
    if (candidateRef) {
      localStorage.setItem(RITUAL_STORAGE_KEY, candidateRef);
    }
    const targetSlug = slug || booking?.serviceSlug || "";
    navigate(`/yagya-puja/homa/${targetSlug}/book`);
  };

  // =========================================================================
  // STATE 1: LOADING
  // =========================================================================
  if (pageStatus === "LOADING" || (isVerifying && !booking)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fffaf0] px-4 py-16">
        <div className="w-full max-w-[500px] rounded-[24px] border border-[#ead8b8] bg-[#fffdfa] p-8 text-center shadow-[0_12px_36px_rgba(80,60,30,0.06)]">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#d4872b] to-[#eab12c] text-white shadow-[0_8px_24px_rgba(212,135,43,0.35)]">
            <RefreshCw size={36} className="animate-spin text-white" />
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d4872b]/30 bg-[#f8edd8] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span>AUTHORITATIVE VERIFICATION</span>
          </div>

          <h2 className="mt-3 font-serif text-[24px] font-bold text-[#2b241d]">
            Verifying Sacred Homa Dakshina...
          </h2>

          <p className="mt-2 text-[14px] leading-relaxed text-[#685c4f]">
            Communicating with the payment gateway to retrieve authoritative confirmation for your Vedic Homa Anushthan.
          </p>

          <div className="mt-6 rounded-xl border border-[#f0e2cd] bg-[#fbf5eb] p-3 text-[12px] text-[#706254]">
            <span>Please do not close or refresh this page.</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 2: BOOKING NOT FOUND
  // =========================================================================
  if (pageStatus === "NOT_FOUND") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fffaf0] px-4 py-16">
        <div className="w-full max-w-[520px] rounded-[24px] border border-[#ead8b8] bg-[#fffdfa] p-8 text-center shadow-[0_12px_36px_rgba(80,60,30,0.06)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertCircle size={36} />
          </div>

          <h2 className="mt-4 font-serif text-[24px] font-bold text-[#2b241d]">
            Ceremony Booking Not Found
          </h2>

          <p className="mt-2 text-[14px] leading-relaxed text-[#685c4f]">
            {candidateRef
              ? `No active Homa ceremony record could be located for reference ${candidateRef}.`
              : "No booking reference was provided in this session."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/yagya-puja/homa"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-6 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.25)] hover:brightness-105 transition"
            >
              <Flame size={15} />
              <span>Back to Homa Catalogue</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#5c4e3f] hover:bg-[#faf4e8] transition"
            >
              <Home size={15} />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 3: VERIFICATION ERROR
  // =========================================================================
  if (pageStatus === "ERROR") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fffaf0] px-4 py-16">
        <div className="w-full max-w-[520px] rounded-[24px] border border-amber-200 bg-[#fffdfa] p-8 text-center shadow-[0_12px_36px_rgba(80,60,30,0.06)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <AlertTriangle size={36} />
          </div>

          <h2 className="mt-4 font-serif text-[24px] font-bold text-[#2b241d]">
            Payment Verification Notice
          </h2>

          <p className="mt-2 text-[14px] leading-relaxed text-[#685c4f]">
            {errorMessage || "We experienced a temporary delay communicating with the payment server."}
          </p>

          {candidateRef && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#ead8b8] bg-[#fbf5eb] px-4 py-2 font-mono text-[13px] font-bold text-[#b36c1e]">
              <span>Ref: {candidateRef}</span>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={verifyAndFetchStatus}
              disabled={isVerifying}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-6 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.25)] hover:brightness-105 transition cursor-pointer"
            >
              <RefreshCw size={15} className={isVerifying ? "animate-spin" : ""} />
              <span>Retry Verification</span>
            </button>

            <Link
              to="/yagya-puja/homa"
              className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#5c4e3f] hover:bg-[#faf4e8] transition"
            >
              <Flame size={15} />
              <span>Back to Homa Catalogue</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 4: PAYMENT FAILED
  // =========================================================================
  if (pageStatus === "FAILED") {
    return (
      <div className="min-h-screen bg-[#fffaf0] pb-24 pt-6 sm:pb-32 sm:pt-10">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <div className="overflow-hidden rounded-[26px] border-2 border-red-200 bg-[#fffdfa] shadow-[0_12px_40px_rgba(180,40,30,0.08)]">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-b from-[#3a1d1d] to-[#241111] px-6 py-10 text-center text-white sm:px-10">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-[0_8px_24px_rgba(225,29,72,0.4)] ring-4 ring-white/20">
                <AlertCircle size={44} className="stroke-[2.2]" />
              </div>

              <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/20 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-rose-200">
                <span>PAYMENT NOT COMPLETED</span>
              </div>

              <h1 className="relative mt-3 font-serif text-[28px] font-bold text-white sm:text-[34px]">
                Payment Incomplete / Interrupted
              </h1>

              <p className="relative mx-auto mt-2 max-w-[500px] text-[14px] leading-relaxed text-rose-100/90">
                The transaction was cancelled, interrupted, or declined by the payment gateway. Your ceremonial reservation is preserved.
              </p>

              {/* Reference */}
              {candidateRef && (
                <div className="relative mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-xs">
                  <span className="text-[12px] font-medium text-rose-200">
                    Booking Reference:
                  </span>
                  <span className="font-mono text-[15px] font-bold tracking-wider text-rose-100">
                    {candidateRef}
                  </span>
                </div>
              )}
            </div>

            {/* Details & Actions */}
            <div className="p-6 sm:p-10 space-y-6">
              <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#ebd7be] pb-3">
                  <span className="text-[12.5px] font-medium text-[#8a7c6b]">
                    Ceremony
                  </span>
                  <span className="font-serif text-[16px] font-bold text-[#2b241d]">
                    {booking?.serviceName || "Sacred Vedic Homa"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#ebd7be] pb-3">
                  <span className="text-[12.5px] font-medium text-[#8a7c6b]">
                    Authoritative Dakshina
                  </span>
                  <span className="font-serif text-[20px] font-bold text-[#b36c1e]">
                    ₹{Number(booking?.amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="text-[12.5px] text-[#6d5f51]">
                  You can retry secure payment without re-entering your Gotra, Nakshatra, or Sankalp parameters. The same booking reference will be safely preserved.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRetryPayment}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-7 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.3)] hover:brightness-105 transition cursor-pointer"
                >
                  <RefreshCw size={15} />
                  <span>Retry Secure Payment</span>
                </button>

                <Link
                  to="/yagya-puja/homa"
                  className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-6 py-3 text-[13px] font-semibold text-[#5c4e3f] hover:bg-[#faf4e8] transition"
                >
                  <Flame size={15} />
                  <span>Back to Homa Catalogue</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 5: PAYMENT PENDING
  // =========================================================================
  if (pageStatus === "PENDING") {
    return (
      <div className="min-h-screen bg-[#fffaf0] pb-24 pt-6 sm:pb-32 sm:pt-10">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <div className="overflow-hidden rounded-[26px] border-2 border-amber-300 bg-[#fffdfa] shadow-[0_12px_40px_rgba(212,135,43,0.1)]">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-b from-[#2e2316] to-[#1c150c] px-6 py-10 text-center text-white sm:px-10">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-[#1c1308] shadow-[0_8px_24px_rgba(245,158,11,0.45)] ring-4 ring-white/20">
                <Clock size={44} className="stroke-[2.2]" />
              </div>

              <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/20 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-200">
                <span>PAYMENT PENDING CONFIRMATION</span>
              </div>

              <h1 className="relative mt-3 font-serif text-[28px] font-bold text-white sm:text-[34px]">
                Awaiting Payment Confirmation
              </h1>

              <p className="relative mx-auto mt-2 max-w-[520px] text-[14px] leading-relaxed text-amber-100/90">
                Your Homa reservation is reserved. If you have already authorized payment via UPI or net banking, the gateway may take a moment to synchronize.
              </p>

              {/* Reference */}
              {candidateRef && (
                <div className="relative mt-6 inline-flex items-center gap-2 rounded-2xl border border-amber-300/30 bg-white/10 px-5 py-2.5 backdrop-blur-xs">
                  <span className="text-[12px] font-medium text-amber-200">
                    Booking Reference:
                  </span>
                  <span className="font-mono text-[15px] font-bold tracking-wider text-amber-100">
                    {candidateRef}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="ml-1 rounded-md bg-white/15 px-2 py-0.5 text-[11px] text-white hover:bg-white/25 cursor-pointer"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              )}
            </div>

            {/* Details & Actions */}
            <div className="p-6 sm:p-10 space-y-6">
              <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#ebd7be] pb-3">
                  <span className="text-[12.5px] font-medium text-[#8a7c6b]">
                    Ceremony
                  </span>
                  <span className="font-serif text-[16px] font-bold text-[#2b241d]">
                    {booking?.serviceName || "Sacred Vedic Homa"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#ebd7be] pb-3">
                  <span className="text-[12.5px] font-medium text-[#8a7c6b]">
                    Commencement Date
                  </span>
                  <span className="font-semibold text-[#2b241d]">
                    {formatDate(booking?.commencementDate || booking?.bookingDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] font-medium text-[#8a7c6b]">
                    Authoritative Dakshina
                  </span>
                  <span className="font-serif text-[20px] font-bold text-[#b36c1e]">
                    ₹{Number(booking?.amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={verifyAndFetchStatus}
                  disabled={isVerifying}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-6 py-2.5 text-[13px] font-semibold text-[#5c4e3f] shadow-2xs hover:bg-[#faf4e8] transition cursor-pointer"
                >
                  <RefreshCw size={15} className={isVerifying ? "animate-spin" : ""} />
                  <span>Refresh Status</span>
                </button>

                <button
                  type="button"
                  onClick={handleRetryPayment}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-7 py-2.5 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.3)] hover:brightness-105 transition cursor-pointer"
                >
                  <CreditCard size={15} />
                  <span>Complete / Retry Payment</span>
                </button>

                <Link
                  to="/yagya-puja/homa"
                  className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#5c4e3f] hover:bg-[#faf4e8] transition"
                >
                  <Flame size={15} />
                  <span>Back to Homa Catalogue</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 6: PAYMENT SUCCESSFUL / CONFIRMED
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#fffaf0] pb-24 pt-6 sm:pb-32 sm:pt-10">
      <div className="mx-auto max-w-[820px] px-4 sm:px-6">
        {/* Printable Card Container */}
        <div className="overflow-hidden rounded-[26px] border-2 border-[#e6cca6] bg-[#fffdfa] shadow-[0_12px_40px_rgba(80,60,30,0.08)]">
          {/* Header Banner */}
          <div className="relative bg-gradient-to-b from-[#2b241d] to-[#1c1611] px-6 py-10 text-center text-white sm:px-10">
            {/* Auspicious background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#eab12c]/20 via-transparent to-transparent pointer-events-none" />

            {/* Success Icon */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#2e7d32] to-[#4caf50] text-white shadow-[0_8px_24px_rgba(46,125,50,0.45)] ring-4 ring-[#fffdfa]/20">
              <CheckCircle2 size={44} className="stroke-[2.2]" />
            </div>

            <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-[#eab12c]/40 bg-[#eab12c]/15 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f7d686]">
              <Sparkles size={12} className="text-[#f7d686]" />
              <span>SACRED HOMA / HAVAN CEREMONY CONFIRMED</span>
            </div>

            <h1 className="relative mt-3 font-serif text-[30px] font-bold text-[#fffdfa] sm:text-[38px]">
              Booking Confirmed
            </h1>

            <p className="relative mx-auto mt-2 max-w-[520px] text-[14px] leading-relaxed text-[#ead8b8]">
              Your auspicious Sankalp and sacred Homa fire offering parameters have been sanctified in the Vedic registry. May divine grace and peace be bestowed upon your household.
            </p>

            {/* Reference Badge */}
            <div className="relative mt-6 inline-flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-[#ead8b8]/30 bg-white/10 px-5 py-2.5 backdrop-blur-xs">
              <span className="text-[12px] font-medium text-[#d9c5ab]">
                Booking Reference:
              </span>
              <span className="font-mono text-[15px] font-bold tracking-wider text-[#ffd375]">
                {booking?.bookingReference || candidateRef}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy Booking Reference"
                className="ml-1 inline-flex items-center gap-1 rounded-md bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-white/25 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e2cd] pb-6">
              <div>
                <span className="block text-[11.5px] font-semibold uppercase tracking-wider text-[#8a7c6b]">
                  Payment Status
                </span>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-[12.5px] font-bold text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>{booking?.paymentStatus || "Paid"}</span>
                </div>
              </div>

              <div>
                <span className="block text-[11.5px] font-semibold uppercase tracking-wider text-[#8a7c6b]">
                  Booking Status
                </span>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-[12.5px] font-bold text-amber-800">
                  <ShieldCheck size={14} className="text-amber-700" />
                  <span>{booking?.bookingStatus || "Confirmed"}</span>
                </div>
              </div>

              <div>
                <span className="block text-[11.5px] font-semibold uppercase tracking-wider text-[#8a7c6b]">
                  Dakshina Confirmed
                </span>
                <span className="mt-1 block font-serif text-[22px] font-bold text-[#b36c1e]">
                  ₹{Number(booking?.amount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Sacred Summary Grid */}
            <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-6 space-y-5">
              <h2 className="font-serif text-[17px] font-bold text-[#2b241d] border-b border-[#ebd7be] pb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-[#b36c1e]" />
                <span>Sanctified Homa / Fire Offering Details</span>
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-[13.5px]">
                {/* Service Name */}
                <div className="sm:col-span-2">
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">
                    Sacred Vedic Homa
                  </span>
                  <p className="mt-0.5 font-serif text-[18px] font-bold text-[#2b241d]">
                    {booking?.serviceName || "Maha Mrityunjaya Homa"}
                  </p>
                </div>

                {/* Primary Yajman */}
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <User size={12} className="text-[#b36c1e]" />
                    <span>Primary Yajman (Devotee)</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {booking?.customerName || "Devotee"}
                  </p>
                </div>

                {/* Officiating Team */}
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <Users size={12} className="text-[#b36c1e]" />
                    <span>Officiating Team</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {booking?.panditCount || 1} Learned Vedic Scholar{Number(booking?.panditCount) > 1 ? "s" : ""}
                  </p>
                </div>

                {/* Havan Count */}
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <Flame size={12} className="text-[#b36c1e]" />
                    <span>Sacred Havan Scale</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {booking?.havanCount || 1} Havan Offering{Number(booking?.havanCount) > 1 ? "s" : ""}
                  </p>
                </div>

                {/* Duration Days */}
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <Calendar size={12} className="text-[#b36c1e]" />
                    <span>Ritual Duration</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {booking?.days || booking?.durationDays || 1} Day{Number(booking?.days || booking?.durationDays) > 1 ? "s" : ""} Session
                  </p>
                </div>

                {/* Daily Chanting Cadence */}
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <Clock size={12} className="text-[#b36c1e]" />
                    <span>Daily Chanting Cadence</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {booking?.dailyHours || "3 – 4 Hours Daily"}
                  </p>
                </div>

                {/* Daily Operational Capacity */}
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <Sparkles size={12} className="text-[#b36c1e]" />
                    <span>Ahuti Capacity Cadence</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {booking?.havanCapacityPerPandit || "500 Ahutis per Pandit / Day"}
                  </p>
                </div>

                {/* Commencement Date */}
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <Calendar size={12} className="text-[#b36c1e]" />
                    <span>Commencement Date</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {formatDate(booking?.commencementDate || booking?.bookingDate)}
                  </p>
                </div>

                {/* Completion Date */}
                {booking?.completionDate && (
                  <div>
                    <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                      <Calendar size={12} className="text-[#2e7d32]" />
                      <span>Maha Purnahuti (Completion Date)</span>
                    </span>
                    <p className="mt-0.5 font-semibold text-[#2b241d]">
                      {formatDate(booking.completionDate)}
                    </p>
                  </div>
                )}

                {/* Arrangement / Venue */}
                <div className="sm:col-span-2">
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <MapPin size={12} className="text-[#b36c1e]" />
                    <span>Arrangement & Venue</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {getArrangementLabel(booking?.arrangementMode)}
                  </p>
                </div>

                {/* Dakshina Amount */}
                <div className="sm:col-span-2 border-t border-[#ebd7be] pt-3 flex items-baseline justify-between">
                  <span className="text-[12px] font-semibold text-[#8a7c6b] flex items-center gap-1.5">
                    <CreditCard size={13} className="text-[#2e7d32]" />
                    <span>Total Dakshina (Authoritative Confirmed):</span>
                  </span>
                  <span className="font-serif text-[20px] font-bold text-[#b36c1e]">
                    ₹{Number(booking?.amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="rounded-2xl border border-[#f0e2cd] bg-[#fdf8f0] p-5 text-[12.5px] text-[#6d5f51] space-y-2">
              <div className="flex items-center gap-2 font-serif text-[14.5px] font-bold text-[#2b241d]">
                <ShieldCheck size={16} className="text-[#2e7d32]" />
                <span>Next Steps for Your Sacred Homa Fire Ceremony</span>
              </div>
              <p>
                • Our senior Acharya will review your Gotra, Nakshatra, and intention parameters to prepare the consecrated Homa Kunda and organic herbal samagri.
              </p>
              <p>
                • You will receive SMS & WhatsApp coordination updates at least 24 hours prior to the auspicious commencement Muhurat.
              </p>
              <p>
                • For remote sankalpa, the private consecrated live video access link will be dispatched to your registered contact.
              </p>
              <p>
                • Consecrated Homa Bhasma, energized Raksha Sutra, and Prasadam will be dispatched by speed post after Purnahuti.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#5c4e3f] shadow-2xs hover:bg-[#faf4e8] transition cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Print Receipt</span>
                </button>

                <Link
                  to="/yagya-puja/homa"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-7 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.25)] hover:brightness-105 transition"
                >
                  <Flame size={15} />
                  <span>Back to Homa Catalogue</span>
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#5c4e3f] shadow-2xs hover:bg-[#faf4e8] transition"
                >
                  <Home size={15} />
                  <span>Return to Home</span>
                </Link>
              </div>

              <div className="text-center pt-2">
                <Link
                  to={`/yagya-puja/homa/${slug || booking?.serviceSlug || ""}`}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#b36c1e] hover:underline cursor-pointer"
                >
                  <span>Book Another Ceremony</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomaBookingStatus;
