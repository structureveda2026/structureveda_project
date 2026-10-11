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
  CreditCard,
  Home,
} from "lucide-react";
import ritualBookingService from "../../../services/ritualBookingService";
import yagyaCatalogueService from "../../../services/yagyaCatalogueService";

const RITUAL_STORAGE_KEY = "veda_active_ritual_booking";

/**
 * YagyaBookingStatus Page
 * Route: /yagya-puja/yagya/:slug/booking-status
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
const YagyaBookingStatus = () => {
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
        return "Kashi Sacred Mandapams & Shrines (Varanasi)";
      case "customer_home":
        return "Devotee Residence / Private Premises";
      case "temple":
        return "Consecrated Mandir / Temple Mandapam";
      case "veda_structure":
        return "Veda Structure Consecrated Centre";
      case "other":
        return "Other Sacred Designated Venue";
      default:
        return mode || "Vedic Yajnashala";
    }
  };

  // Format date helper (UTC-safe)
  const formatDate = (dateStr) => {
    if (!dateStr) return "Scheduled with Acharyas";
    try {
      const cleanStr = String(dateStr).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
        const [y, m, d] = cleanStr.split("-").map(Number);
        const dateObj = new Date(Date.UTC(y, m - 1, d));
        return dateObj.toLocaleDateString("en-IN", {
          timeZone: "UTC",
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
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
          const sRes = await yagyaCatalogueService.getYagyaServiceBySlug(slug);
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

      // 4. Optionally fetch detailed ritual booking record for rich Yagya metadata
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
        serviceType: statusData.serviceType || "YAGYA",
        serviceSlug: statusData.serviceSlug || slug,
        serviceName:
          statusData.serviceName ||
          fullDetail?.service?.name ||
          serviceDetails?.name ||
          "Sacred Vedic Yagya",
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
        // Yagya-specific parameters
        days:
          fullDetail?.configuration?.days ||
          fullDetail?.sankalpDetails?.yagyaMetadata?.days ||
          (statusData.durationSelected ? parseInt(statusData.durationSelected, 10) : 3),
        dailyHours:
          fullDetail?.configuration?.dailyHours ||
          fullDetail?.sankalpDetails?.yagyaMetadata?.dailyHours ||
          serviceDetails?.dailyRitualHours ||
          5,
        panditCount:
          fullDetail?.configuration?.panditCount ||
          fullDetail?.panditCount ||
          serviceDetails?.panditRequirement?.minimumPandits ||
          3,
        commencementDate:
          statusData.bookingDate ||
          fullDetail?.configuration?.date,
        completionDate:
          fullDetail?.configuration?.completionDate ||
          fullDetail?.sankalpDetails?.yagyaMetadata?.completionDate,
        arrangementMode:
          fullDetail?.configuration?.arrangementMode ||
          statusData.arrangementMode ||
          "kashi",
        pricingTier:
          fullDetail?.sankalpDetails?.yagyaMetadata?.selectedPricingTier ||
          fullDetail?.configuration?.selectedPricingTier,
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
      console.error("Yagya status check error:", err);
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
    navigate(`/yagya-puja/yagya/${targetSlug}/book`);
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
            Verifying Sacred Yagya Dakshina...
          </h2>

          <p className="mt-2 text-[14px] leading-relaxed text-[#685c4f]">
            Communicating with the payment gateway to retrieve authoritative confirmation for your multi-day Vedic Yagya Anushthan.
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
              ? `No active Vedic Yagya ceremony record could be located for reference ${candidateRef}.`
              : "No booking reference was provided in this session."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/yagya-puja/yagya"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-6 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.25)] hover:brightness-105 transition"
            >
              <Flame size={15} />
              <span>Back to Yagya Catalogue</span>
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
              to="/yagya-puja/yagya"
              className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#5c4e3f] hover:bg-[#faf4e8] transition"
            >
              <Flame size={15} />
              <span>Back to Yagya Catalogue</span>
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
                The transaction was cancelled, interrupted, or declined by the payment gateway. Your Yagya ceremonial reservation is safely preserved.
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
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Sacred Yagya Service
                  </span>
                  <span className="font-serif text-[15px] font-bold text-[#2b241d]">
                    {booking?.serviceName || "Vedic Maha Yagya"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#ebd7be] pb-3">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Anushthan Duration
                  </span>
                  <span className="text-[13.5px] font-semibold text-[#2b241d]">
                    {booking?.days || 3} Days ({booking?.dailyHours || 5} Hours / Day)
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#ebd7be] pb-3">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Total Package Dakshina
                  </span>
                  <span className="font-serif text-[20px] font-bold text-[#b36c1e]">
                    ₹{Number(booking?.amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Current Status
                  </span>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold text-red-800">
                    Payment Failed / Pending
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={handleRetryPayment}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_6px_20px_rgba(234,177,44,0.35)] hover:brightness-105 transition cursor-pointer"
                >
                  <CreditCard size={17} />
                  <span>Retry Secure Payment</span>
                </button>

                <button
                  type="button"
                  onClick={verifyAndFetchStatus}
                  disabled={isVerifying}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#ead8b8] bg-white px-6 py-3.5 text-[13.5px] font-semibold text-[#5c4e3f] hover:bg-[#faf4e8] transition cursor-pointer"
                >
                  <RefreshCw size={15} className={isVerifying ? "animate-spin text-[#b36c1e]" : "text-[#b36c1e]"} />
                  <span>Re-check Payment Status</span>
                </button>

                <Link
                  to="/yagya-puja/yagya"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#ead8b8] bg-white px-6 py-3.5 text-[13.5px] font-semibold text-[#5c4e3f] hover:bg-[#faf4e8] transition"
                >
                  <Flame size={15} />
                  <span>Yagya Catalogue</span>
                </Link>
              </div>

              <p className="text-center text-[12px] text-[#8a7c6b]">
                No duplicate booking was created. You can resume and complete checkout securely.
              </p>
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
          <div className="overflow-hidden rounded-[26px] border-2 border-amber-300 bg-[#fffdfa] shadow-[0_12px_40px_rgba(180,120,30,0.08)]">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-b from-[#2e2011] to-[#1c1308] px-6 py-10 text-center text-white sm:px-10">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-[#1c1308] shadow-[0_8px_24px_rgba(245,158,11,0.4)] ring-4 ring-white/20">
                <Clock size={44} className="stroke-[2.2]" />
              </div>

              <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/20 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-200">
                <span>RESERVATION RECORDED • PAYMENT PENDING</span>
              </div>

              <h1 className="relative mt-3 font-serif text-[28px] font-bold text-white sm:text-[34px]">
                Ceremony Payment Pending
              </h1>

              <p className="relative mx-auto mt-2 max-w-[520px] text-[14px] leading-relaxed text-[#f4ebe1]">
                Your sacred Yagya ceremony has been registered. Complete the Dakshina to dispatch Acharyas and initiate consecrated samagri preparations.
              </p>

              {/* Reference */}
              {candidateRef && (
                <div className="relative mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-xs">
                  <span className="text-[12px] font-medium text-amber-200">
                    Booking Reference:
                  </span>
                  <span className="font-mono text-[15px] font-bold tracking-wider text-white">
                    {candidateRef}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="ml-1 rounded-md p-1 hover:bg-white/20 transition cursor-pointer"
                    title="Copy reference"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              )}
            </div>

            {/* Details & Actions */}
            <div className="p-6 sm:p-10 space-y-6">
              <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-6 space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#ebd7be] pb-3">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Sacred Yagya
                  </span>
                  <span className="font-serif text-[15.5px] font-bold text-[#2b241d]">
                    {booking?.serviceName || "Vedic Maha Yagya"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#ebd7be] pb-3">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Anushthan Span
                  </span>
                  <span className="text-[13.5px] font-semibold text-[#2b241d]">
                    {booking?.days || 3} Days • {booking?.panditCount || 3} Vedic Acharyas
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#ebd7be] pb-3">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Commencement Date
                  </span>
                  <span className="text-[13.5px] font-semibold text-[#2b241d]">
                    {formatDate(booking?.bookingDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#ebd7be] pb-3">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Venue & Mode
                  </span>
                  <span className="text-[13.5px] font-semibold text-[#2b241d]">
                    {getArrangementLabel(booking?.arrangementMode)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Total Dakshina
                  </span>
                  <span className="font-serif text-[22px] font-bold text-[#b36c1e]">
                    ₹{Number(booking?.amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={handleRetryPayment}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_6px_20px_rgba(234,177,44,0.35)] hover:brightness-105 transition cursor-pointer"
                >
                  <CreditCard size={17} />
                  <span>Complete Payment Online</span>
                </button>

                <button
                  type="button"
                  onClick={verifyAndFetchStatus}
                  disabled={isVerifying}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#ead8b8] bg-white px-6 py-3.5 text-[13.5px] font-semibold text-[#5c4e3f] hover:bg-[#faf4e8] transition cursor-pointer"
                >
                  <RefreshCw size={15} className={isVerifying ? "animate-spin text-[#b36c1e]" : "text-[#b36c1e]"} />
                  <span>Check Status</span>
                </button>

                <Link
                  to="/yagya-puja/yagya"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#ead8b8] bg-white px-6 py-3.5 text-[13.5px] font-semibold text-[#5c4e3f] hover:bg-[#faf4e8] transition"
                >
                  <Flame size={15} />
                  <span>Catalogue</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 6: PAYMENT CONFIRMED / SUCCESSFUL
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#fffaf0] pb-24 pt-6 sm:pb-32 sm:pt-10">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6">
        <div className="overflow-hidden rounded-[26px] border border-[#ead8b8] bg-[#fffdfa] shadow-[0_16px_48px_rgba(80,60,30,0.08)]">
          {/* Hero Header */}
          <div className="relative bg-gradient-to-b from-[#241a10] via-[#1a120b] to-[#120c07] px-6 py-12 text-center text-white sm:px-10">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)] ring-4 ring-white/20">
              <CheckCircle2 size={46} className="stroke-[2.2]" />
            </div>

            <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-[#eab12c]/40 bg-[#f8edd8]/15 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#eab12c]">
              <Sparkles size={12} className="text-[#eab12c]" />
              <span>VEDIC SANKALPA CONFIRMED</span>
            </div>

            <h1 className="relative mt-3 font-serif text-[28px] font-bold text-white sm:text-[36px]">
              Har Har Mahadev! Your Yagya is Confirmed
            </h1>

            <p className="relative mx-auto mt-2 max-w-[540px] text-[14px] leading-relaxed text-[#f4ebe1]">
              The ceremonial Dakshina for <strong>{booking?.serviceName}</strong> has been received and verified. The Acharyas are being consecrated for your sacred sankalpa.
            </p>

            {/* Reference Badge with Copy */}
            {candidateRef && (
              <div className="relative mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-xs">
                <span className="text-[12px] font-medium text-[#ebd8b8]">
                  Booking Reference:
                </span>
                <span className="font-mono text-[16px] font-bold tracking-wider text-white">
                  {candidateRef}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 transition cursor-pointer"
                  title="Copy reference"
                  aria-label="Copy booking reference"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
            )}
          </div>

          {/* Details & Invoice Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Confirmation Key Facts Banner */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                  Booking Status
                </span>
                <div className="mt-1 flex items-center justify-center gap-1.5 text-[14px] font-bold text-[#2e7d32]">
                  <CheckCircle2 size={16} />
                  <span>Confirmed</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                  Payment Status
                </span>
                <div className="mt-1 flex items-center justify-center gap-1.5 text-[14px] font-bold text-[#2e7d32]">
                  <CreditCard size={16} />
                  <span>Paid Online</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                  Total Dakshina
                </span>
                <p className="mt-1 font-serif text-[17px] font-bold text-[#b36c1e]">
                  ₹{Number(booking?.amount || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Sacred Ceremony Schedule Details */}
            <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#f0e2cd] pb-3 text-[#2b241d]">
                <Flame size={18} className="text-[#b36c1e]" />
                <h3 className="font-serif text-[17px] font-bold">
                  Sacred Ceremony Schedule & Inclusions
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 text-[13.5px] sm:grid-cols-2">
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">
                    Vedic Ceremony
                  </span>
                  <strong className="text-[#2b241d]">{booking?.serviceName}</strong>
                </div>

                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">
                    Yajman / Devotee
                  </span>
                  <strong className="text-[#2b241d]">{booking?.customerName}</strong>
                </div>

                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">
                    Commencement Date (Day 1)
                  </span>
                  <strong className="text-[#2b241d]">
                    {formatDate(booking?.commencementDate || booking?.bookingDate)}
                  </strong>
                </div>

                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">
                    Maha Purnahuti (Completion Date)
                  </span>
                  <strong className="text-[#2e7d32]">
                    {formatDate(booking?.completionDate)}
                  </strong>
                </div>

                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">
                    Anushthan Span
                  </span>
                  <strong className="text-[#2b241d]">
                    {booking?.days || 3} Consecutive Days ({booking?.dailyHours || 5} Hours Daily)
                  </strong>
                </div>

                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">
                    Officiating Priest Team
                  </span>
                  <strong className="text-[#2b241d]">
                    {booking?.panditCount || 3} Learned Vedic Scholars
                  </strong>
                </div>

                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">
                    Daily Commencement Time
                  </span>
                  <strong className="text-[#2b241d]">{booking?.bookingTime || "06:00 AM"}</strong>
                </div>

                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">
                    Arrangement & Venue
                  </span>
                  <strong className="text-[#2b241d]">
                    {getArrangementLabel(booking?.arrangementMode)}
                  </strong>
                </div>
              </div>
            </div>

            {/* What to Expect Next */}
            <div className="rounded-2xl border border-[#e4d5be] bg-[#fbf6ec] p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#2b241d]">
                <ShieldCheck size={18} className="text-[#2e7d32]" />
                <h4 className="font-serif text-[16px] font-bold">
                  What Happens Next (Vedic Coordination Protocol)
                </h4>
              </div>

              <ul className="list-disc pl-5 text-[13px] leading-relaxed text-[#685c4f] space-y-1.5">
                <li>
                  <strong>Priest Consecration:</strong> Our presiding Acharya in Kashi will review your Sankalp intentions and assign the Vedic Purohit team.
                </li>
                <li>
                  <strong>Live Stream Coordination:</strong> A high-definition two-way video link will be dispatched to your registered WhatsApp ({booking?.phone || "registered number"}) prior to Muhurat.
                </li>
                <li>
                  <strong>Consecrated Maha Prasad:</strong> Post Purnahuti, sanctified dry fruits, Bhasma, and sacred raksha sutra will be carefully packed and couriered to your address.
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-6 py-3 text-[13.5px] font-semibold text-[#5c4e3f] hover:bg-[#faf4e8] transition cursor-pointer"
              >
                <Printer size={16} />
                <span>Print Booking Receipt</span>
              </button>

              <Link
                to="/yagya-puja/yagya"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-7 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.25)] hover:brightness-105 transition"
              >
                <Flame size={16} />
                <span>Browse More Yagyas</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-6 py-3 text-[13.5px] font-semibold text-[#5c4e3f] hover:bg-[#faf4e8] transition"
              >
                <Home size={16} />
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YagyaBookingStatus;
