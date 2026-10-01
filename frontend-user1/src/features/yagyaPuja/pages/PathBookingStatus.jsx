import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  Printer,
} from "lucide-react";
import ritualBookingService from "../../../services/ritualBookingService";
import pathCatalogueService from "../../../services/pathCatalogueService";

const RITUAL_STORAGE_KEY = "veda_active_ritual_booking";

/**
 * PathBookingStatus Page
 * Route: /yagya-puja/path/:slug/booking-status
 *
 * Handles:
 * 1. Cashfree return URL: ?order_id={order_id}
 * 2. Recovery from localStorage (veda_active_ritual_booking) or URL query params
 * 3. Authoritative booking status retrieval via ritualBookingService
 * 4. Display of canonical states:
 *    - Loading
 *    - Confirmed / Successful
 *    - Pending
 *    - Failed
 *    - Booking Not Found
 * 5. Printing / saving sacred booking voucher
 */
const PathBookingStatus = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

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
        return mode || "Vedic Path Altar";
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

  // Authoritative Status Retrieval
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
          const sRes = await pathCatalogueService.getPathServiceBySlug(slug);
          if (sRes) {
            setServiceDetails(sRes);
          }
        } catch {
          // Non-critical, fallback to booking data
        }
      }

      // 2. Fetch authoritative booking status
      const res = await ritualBookingService.getBookingStatus(candidateRef);

      if (res && res.success && res.data) {
        const bData = res.data;
        setBooking(bData);

        const bStatus = String(bData.bookingStatus || "").toLowerCase();
        const pStatus = String(bData.paymentStatus || "").toLowerCase();

        if (bStatus === "confirmed" || pStatus === "paid" || pStatus === "success") {
          setPageStatus("CONFIRMED");
          // Clear temporary recovery key on confirmed completion
          if (typeof window !== "undefined") {
            localStorage.removeItem(RITUAL_STORAGE_KEY);
          }
        } else if (bStatus === "cancelled" || pStatus === "failed") {
          setPageStatus("FAILED");
        } else {
          setPageStatus("PENDING");
        }
      } else {
        // Fallback: try direct booking reference lookup
        try {
          const direct = await ritualBookingService.getBookingByReference(candidateRef);
          if (direct && (direct.success || direct.data)) {
            const bData = direct.data || direct;
            setBooking(bData);
            setPageStatus(
              bData.bookingStatus === "Confirmed" ? "CONFIRMED" : "PENDING"
            );
          } else {
            setPageStatus("NOT_FOUND");
          }
        } catch {
          setPageStatus("NOT_FOUND");
        }
      }
    } catch (err) {
      console.error("Path booking verification error:", err);
      // Try fallback direct lookup before failing
      try {
        const direct = await ritualBookingService.getBookingByReference(candidateRef);
        if (direct && (direct.success || direct.data)) {
          const bData = direct.data || direct;
          setBooking(bData);
          setPageStatus(
            bData.bookingStatus === "Confirmed" ? "CONFIRMED" : "PENDING"
          );
        } else {
          setPageStatus("ERROR");
          setErrorMessage(
            err.response?.data?.message || err.message || "Failed to retrieve booking status."
          );
        }
      } catch {
        setPageStatus("ERROR");
        setErrorMessage(
          err.response?.data?.message || err.message || "Failed to retrieve booking status."
        );
      }
    } finally {
      setIsVerifying(false);
    }
  }, [candidateRef, slug]);

  useEffect(() => {
    const timer = setTimeout(() => {
      verifyAndFetchStatus();
    }, 0);
    return () => clearTimeout(timer);
  }, [verifyAndFetchStatus]);

  // Copy reference to clipboard
  const handleCopyReference = () => {
    if (candidateRef) {
      navigator.clipboard.writeText(candidateRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Print voucher
  const handlePrint = () => {
    window.print();
  };

  // Helper getters from booking or metadata
  const pathMeta = booking?.sankalpDetails?.pathMetadata || booking?.pathMetadata || {};
  const config = booking?.configuration || {};
  const yajman = booking?.yajmanDetails || booking?.yajman || {};
  const sankalp = booking?.sankalpDetails || booking?.sankalp || {};
  const serviceName =
    pathMeta.serviceName ||
    serviceDetails?.name ||
    booking?.serviceName ||
    "Sacred Vedic Path";
  const scripture =
    pathMeta.scripture ||
    serviceDetails?.scripture ||
    "Classical Vedic Granth";
  const selectedFormat =
    pathMeta.selectedFormat ||
    config.selectedFormat ||
    config.format ||
    "Standard Recitation";
  const selectedDuration =
    pathMeta.selectedDuration ||
    config.durationSelected ||
    config.duration ||
    "3 to 4 Hours";
  const selectedDays =
    pathMeta.selectedDays ||
    config.days ||
    1;
  const panditCount =
    pathMeta.panditCount ||
    config.panditCount ||
    2;
  const commencementDate =
    pathMeta.commencementDate ||
    booking?.commencementDate ||
    booking?.bookingDate ||
    config.commencementDate;
  const completionDate =
    pathMeta.completionDate ||
    booking?.completionDate ||
    config.completionDate;
  const totalAmount =
    booking?.totalAmount != null
      ? booking.totalAmount
      : booking?.pricing?.totalAmount != null
      ? booking.pricing.totalAmount
      : serviceDetails?.startingPrice || 5100;

  // LOADING STATE
  if (pageStatus === "LOADING" || isVerifying) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#faf4e6] p-6 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722] shadow-sm">
            <RefreshCw size={28} className="animate-spin text-[#b36c1e]" />
          </div>
          <h2 className="font-serif text-[22px] font-semibold text-[#2b241d]">
            Verifying Sacred Path Reservation...
          </h2>
          <p className="text-[14px] text-[#786958]">
            Authoritatively retrieving booking details for <strong>{candidateRef || "order"}</strong>.
          </p>
        </div>
      </div>
    );
  }

  // NOT FOUND STATE
  if (pageStatus === "NOT_FOUND") {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#faf4e6] p-6 text-center">
        <div className="max-w-[480px] rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-8 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertCircle size={28} />
          </div>
          <h2 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
            Reservation Record Not Found
          </h2>
          <p className="mt-2 text-[14px] text-[#6d5b4a]">
            We could not locate an active Path booking associated with reference{" "}
            <strong>{candidateRef || "N/A"}</strong>.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/yagya-puja/path"
              className="rounded-full bg-[#b56e20] px-6 py-2.5 text-[13px] font-bold text-white shadow-sm hover:bg-[#8f5211]"
            >
              Browse Path Catalogue
            </Link>
            <Link
              to="/"
              className="rounded-full border border-[#ebdcc4] bg-white px-6 py-2.5 text-[13px] font-bold text-[#5c4e3f] hover:bg-[#faf4e8]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf4e6] py-10 px-4 sm:px-6 lg:px-8 text-[#2b241d]">
      <div className="mx-auto max-w-[900px] space-y-6">
        {/* Status Header Banner */}
        <div
          className={`overflow-hidden rounded-2xl border p-6 sm:p-8 shadow-sm ${
            pageStatus === "CONFIRMED"
              ? "border-[#c5e1a5] bg-[#f1f8e9]"
              : pageStatus === "PENDING"
              ? "border-[#ffe082] bg-[#fffde7]"
              : "border-[#ffcdd2] bg-[#ffebee]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  pageStatus === "CONFIRMED"
                    ? "bg-[#2e7d32] text-white"
                    : pageStatus === "PENDING"
                    ? "bg-[#f57f17] text-white"
                    : "bg-[#c62828] text-white"
                }`}
              >
                {pageStatus === "CONFIRMED" ? (
                  <CheckCircle2 size={26} />
                ) : pageStatus === "PENDING" ? (
                  <Clock size={26} />
                ) : (
                  <AlertCircle size={26} />
                )}
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#685c4f]">
                  BOOKING REFERENCE & STATUS
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h1 className="font-mono text-[20px] font-bold tracking-tight text-[#2b241d] sm:text-[24px]">
                    {candidateRef || booking?.bookingReference}
                  </h1>
                  <button
                    type="button"
                    onClick={handleCopyReference}
                    title="Copy reference code"
                    className="p-1.5 rounded-lg border border-[#d6b8a0] bg-white text-[#786958] hover:text-[#2b241d] cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>

                <p className="mt-1 text-[13.5px] font-medium text-[#5c4e3f]">
                  {pageStatus === "CONFIRMED"
                    ? "Your Sacred Path recitation has been confirmed and scheduled with initiated Vedic scholars."
                    : pageStatus === "PENDING"
                    ? "Your Path booking is received. Verification is in progress with the sacred registry."
                    : errorMessage || "We could not verify completion. Please review or contact support."}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span
                className={`inline-block rounded-full px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider ${
                  pageStatus === "CONFIRMED"
                    ? "bg-[#2e7d32] text-white"
                    : pageStatus === "PENDING"
                    ? "bg-[#f57f17] text-white"
                    : "bg-[#c62828] text-white"
                }`}
              >
                {pageStatus === "CONFIRMED"
                  ? "Confirmed"
                  : pageStatus === "PENDING"
                  ? "Pending Verification"
                  : "Action Required"}
              </span>
              <div className="mt-2 text-[12px] text-[#786958]">
                Payment: <strong>{booking?.paymentStatus || "Logged"}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Voucher / Sacred Ceremony Summary Slip */}
        <div className="overflow-hidden rounded-2xl border border-[#e6d3ba] bg-[#fffdf9] p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header Strip with Scripture info */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#f0e1cb] pb-5 gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                SACRED RECITATION SANCTUM
              </span>
              <h2 className="font-serif text-[24px] font-bold text-[#2b241d]">
                {serviceName}
              </h2>
              <p className="text-[13px] text-[#786958] flex items-center gap-1.5 mt-0.5">
                <BookOpen size={14} className="text-[#c77722]" />
                Granth: <strong>{scripture}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a725b]">
                Canonical Dakshina
              </span>
              <div className="font-serif text-[24px] font-bold text-[#b56e20]">
                ₹{Number(totalAmount).toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Grid of Recitation Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-[13px]">
            <div className="rounded-xl border border-[#ebd8c1] bg-[#faf4e6] p-4">
              <span className="block text-[11px] font-bold uppercase text-[#8a725b]">
                Recitation Format
              </span>
              <p className="mt-1 font-serif text-[15px] font-bold text-[#2b241d]">
                {selectedFormat}
              </p>
              <span className="text-[11px] text-[#786958]">
                Duration: {selectedDuration}
              </span>
            </div>

            <div className="rounded-xl border border-[#ebd8c1] bg-[#faf4e6] p-4">
              <span className="block text-[11px] font-bold uppercase text-[#8a725b]">
                Anushthan Timeline
              </span>
              <p className="mt-1 font-serif text-[15px] font-bold text-[#2b241d]">
                {selectedDays} Day{Number(selectedDays) > 1 ? "s" : ""}
              </p>
              <span className="text-[11px] text-[#786958]">
                {selectedDays === 1 ? "Single-day recitation" : "Consecutive daily sessions"}
              </span>
            </div>

            <div className="rounded-xl border border-[#ebd8c1] bg-[#faf4e6] p-4">
              <span className="block text-[11px] font-bold uppercase text-[#8a725b]">
                Vedic Scholar Squad
              </span>
              <p className="mt-1 font-serif text-[15px] font-bold text-[#2b241d]">
                {panditCount} Learned Brahmin{Number(panditCount) > 1 ? "s" : ""}
              </p>
              <span className="text-[11px] text-[#786958]">
                Initiated in Granth chanting
              </span>
            </div>

            <div className="rounded-xl border border-[#ebd8c1] bg-[#faf4e6] p-4">
              <span className="block text-[11px] font-bold uppercase text-[#8a725b]">
                Commencement Date
              </span>
              <p className="mt-1 font-semibold text-[#2b241d]">
                {formatDate(commencementDate)}
              </p>
              <span className="text-[11px] text-[#786958]">
                Muhurat: {config.bookingTime || config.timeSlot || "06:00 AM"}
              </span>
            </div>

            <div className="rounded-xl border border-[#ebd8c1] bg-[#faf4e6] p-4">
              <span className="block text-[11px] font-bold uppercase text-[#8a725b]">
                Sacred Purnahuti (End Date)
              </span>
              <p className="mt-1 font-semibold text-[#2e7d32]">
                {formatDate(completionDate)}
              </p>
              <span className="text-[11px] text-[#786958]">
                Authoritative completion
              </span>
            </div>

            <div className="rounded-xl border border-[#ebd8c1] bg-[#faf4e6] p-4">
              <span className="block text-[11px] font-bold uppercase text-[#8a725b]">
                Arrangement Mode
              </span>
              <p className="mt-1 font-semibold text-[#2b241d]">
                {getArrangementLabel(config.arrangementMode || booking?.arrangementMode)}
              </p>
            </div>
          </div>

          {/* Devotee & Sankalp Details Strip */}
          <div className="border-t border-[#f0e1cb] pt-5 space-y-4">
            <h3 className="font-serif text-[16px] font-bold text-[#2b241d]">
              Devotee & Sankalp Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div className="space-y-1">
                <span className="text-[#8a725b]">Devotee (Yajman):</span>
                <p className="font-semibold text-[#2b241d]">
                  {yajman.name || "Devotee"}
                </p>
                {yajman.gotra && (
                  <p className="text-[12px] text-[#6d5b4a]">
                    Gotra: <strong>{yajman.gotra}</strong>
                  </p>
                )}
                {yajman.nakshatra && (
                  <p className="text-[12px] text-[#6d5b4a]">
                    Nakshatra: <strong>{yajman.nakshatra}</strong>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[#8a725b]">Sacred Intention / Sankalp:</span>
                <p className="font-medium text-[#2b241d]">
                  {sankalp.specificSankalp ||
                    sankalp.purpose ||
                    serviceDetails?.purpose ||
                    "Traditional family wellbeing and spiritual grace."}
                </p>
              </div>
            </div>
          </div>

          {/* Actions & Print Row */}
          <div className="border-t border-[#f0e1cb] pt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-full border border-[#d6b8a0] bg-white px-5 py-2 text-[13px] font-semibold text-[#2b241d] hover:bg-[#faf4e8] transition cursor-pointer"
              >
                <Printer size={15} />
                <span>Print Confirmation Slip</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/yagya-puja/path"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#b56e20] px-6 py-2 text-[13px] font-bold text-white shadow-sm hover:bg-[#8f5211] transition"
              >
                <span>Browse More Paths</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathBookingStatus;
