import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Sparkles,
  Calendar,
  Clock,
  Users,
  MapPin,
  CreditCard,
  Copy,
  Check,
  Printer,
  ArrowRight,
  Home,
  BookOpen,
  ShieldCheck,
  User,
} from "lucide-react";
import { useRitualBooking } from "../../context/RitualBookingContext";

const RitualBookingConfirmation = () => {
  const navigate = useNavigate();
  const {
    service,
    configuration,
    yajmanDetails,
    confirmedBooking,
    bookingReference,
    priceBreakdown,
    resetBooking,
  } = useRitualBooking();

  const [copied, setCopied] = useState(false);

  // Authoritative reference and data from backend response
  const activeRef =
    confirmedBooking?.bookingReference || bookingReference || "VEDA-PUJA-CONFIRMED";
  const serviceName =
    confirmedBooking?.serviceName || service?.name || "Sacred Vedic Ceremony";
  const bookingDate =
    confirmedBooking?.bookingDate || configuration?.bookingDate || "";
  const bookingTime =
    confirmedBooking?.bookingTime || configuration?.bookingTime || "";
  const customerName =
    confirmedBooking?.customerName ||
    yajmanDetails?.name ||
    "Devotee";

  // Authoritative amount strictly from backend
  const authoritativeAmount =
    confirmedBooking?.amount != null
      ? confirmedBooking.amount
      : confirmedBooking?.totalAmount != null
      ? confirmedBooking.totalAmount
      : priceBreakdown?.totalAmount != null
      ? priceBreakdown.totalAmount
      : priceBreakdown?.calculatedAmount != null
      ? priceBreakdown.calculatedAmount
      : 0;

  const paymentStatus = confirmedBooking?.paymentStatus || "Paid";
  const bookingStatus = confirmedBooking?.bookingStatus || "Confirmed";

  // Format canonical arrangement mode
  const getArrangementLabel = (mode) => {
    switch (mode) {
      case "remote":
        return "Remote Sankalpa (Live Stream)";
      case "kashi":
        return "Kashi Sacred Ghats & Shrines (Varanasi)";
      case "customer_home":
        return "Devotee Residence / Private Premises";
      case "temple":
        return "Consecrated Mandir / Temple Premises";
      case "veda_structure":
        return "Veda Structure Ashram & Spiritual Centre";
      case "other":
        return "Other Sacred Designated Venue";
      default:
        return mode || "Vedic Sanctuary";
    }
  };

  const arrangementLabel = getArrangementLabel(
    configuration?.locationType || configuration?.arrangementMode || "remote",
  );

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "Scheduled with Acharyas";
    try {
      const d = new Date(dateStr);
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

  const handleCopy = () => {
    if (!activeRef) return;
    navigator.clipboard?.writeText(activeRef).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBookAnother = () => {
    resetBooking();
    if (service?.slug) {
      navigate(`/yagya-puja/puja/${service.slug}`);
    } else {
      navigate("/yagya-puja/puja");
    }
  };

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
              <span>SACRED CEREMONY CONFIRMED</span>
            </div>

            <h1 className="relative mt-3 font-serif text-[30px] font-bold text-[#fffdfa] sm:text-[38px]">
              Booking Confirmed
            </h1>

            <p className="relative mx-auto mt-2 max-w-[520px] text-[14px] leading-relaxed text-[#ead8b8]">
              Your auspicious Sankalp and ceremony parameters have been sanctified in the Vedic registry. May divine grace and peace be bestowed upon your household.
            </p>

            {/* Reference Badge */}
            <div className="relative mt-6 inline-flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-[#ead8b8]/30 bg-white/10 px-5 py-2.5 backdrop-blur-xs">
              <span className="text-[12px] font-medium text-[#d9c5ab]">
                Booking Reference:
              </span>
              <span className="font-mono text-[15px] font-bold tracking-wider text-[#ffd375]">
                {activeRef}
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
                  <span>{paymentStatus}</span>
                </div>
              </div>

              <div>
                <span className="block text-[11.5px] font-semibold uppercase tracking-wider text-[#8a7c6b]">
                  Booking Status
                </span>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-[12.5px] font-bold text-amber-800">
                  <ShieldCheck size={14} className="text-amber-700" />
                  <span>{bookingStatus}</span>
                </div>
              </div>

              <div>
                <span className="block text-[11.5px] font-semibold uppercase tracking-wider text-[#8a7c6b]">
                  Dakshina Confirmed
                </span>
                <span className="mt-1 block font-serif text-[22px] font-bold text-[#b36c1e]">
                  ₹{Number(authoritativeAmount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Sacred Summary Grid */}
            <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-6 space-y-5">
              <h2 className="font-serif text-[17px] font-bold text-[#2b241d] border-b border-[#ebd7be] pb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-[#b36c1e]" />
                <span>Sanctified Ceremony Details</span>
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-[13.5px]">
                {/* Service Name */}
                <div className="sm:col-span-2">
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">
                    Sacred Puja / Ritual
                  </span>
                  <p className="mt-0.5 font-serif text-[18px] font-bold text-[#2b241d]">
                    {serviceName}
                  </p>
                </div>

                {/* Primary Yajman */}
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <User size={12} className="text-[#b36c1e]" />
                    <span>Primary Yajman (Devotee)</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {customerName}
                  </p>
                </div>

                {/* Officiating Purohits */}
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <Users size={12} className="text-[#b36c1e]" />
                    <span>Officiating Team</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {configuration?.panditCount || 1} Learned Vedic Scholar{Number(configuration?.panditCount) > 1 ? "s" : ""}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <Calendar size={12} className="text-[#b36c1e]" />
                    <span>Sanctified Date</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {formatDate(bookingDate)}
                  </p>
                </div>

                {/* Time */}
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <Clock size={12} className="text-[#b36c1e]" />
                    <span>Auspicious Muhurat / Time</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {bookingTime || "To be finalized by Acharya"}
                  </p>
                </div>

                {/* Venue / Arrangement */}
                <div className="sm:col-span-2">
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b] flex items-center gap-1">
                    <MapPin size={12} className="text-[#b36c1e]" />
                    <span>Arrangement & Venue</span>
                  </span>
                  <p className="mt-0.5 font-semibold text-[#2b241d]">
                    {arrangementLabel}
                  </p>
                </div>

                {/* Amount */}
                <div className="sm:col-span-2 border-t border-[#ebd7be] pt-3 flex items-baseline justify-between">
                  <span className="text-[12px] font-semibold text-[#8a7c6b] flex items-center gap-1.5">
                    <CreditCard size={13} className="text-[#2e7d32]" />
                    <span>Total Dakshina (Backend Confirmed):</span>
                  </span>
                  <span className="font-serif text-[20px] font-bold text-[#b36c1e]">
                    ₹{Number(authoritativeAmount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="rounded-2xl border border-[#f0e2cd] bg-[#fdf8f0] p-5 text-[12.5px] text-[#6d5f51] space-y-2">
              <div className="flex items-center gap-2 font-serif text-[14.5px] font-bold text-[#2b241d]">
                <ShieldCheck size={16} className="text-[#2e7d32]" />
                <span>Next Steps for Your Sacred Ceremony</span>
              </div>
              <p>
                • Our senior Acharya will review your Gotra, Nakshatra, and intention parameters to prepare the ceremonial Kalash and Samagri.
              </p>
              <p>
                • You will receive SMS & WhatsApp coordination updates at least 24 hours prior to the auspicious Muhurat.
              </p>
              <p>
                • For remote sankalpa, the private consecrated live video access link will be dispatched to your registered contact.
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
                  to="/yagya-puja/puja"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-7 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.25)] hover:brightness-105 transition"
                >
                  <BookOpen size={15} />
                  <span>Puja Catalogue</span>
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
                <button
                  type="button"
                  onClick={handleBookAnother}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#b36c1e] hover:underline cursor-pointer"
                >
                  <span>Book Another Ceremony</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RitualBookingConfirmation;
