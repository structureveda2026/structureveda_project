import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Clock,
  Users,
  Calendar,
  User,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Lock,
  RefreshCw,
  AlertCircle,
  Video,
  Home,
  Building,
  Check,
  ScrollText,
  Sparkles,
  Package,
  Film,
  Award,
  Heart,
} from "lucide-react";
import {
  useRitualBooking,
  CANONICAL_ARRANGEMENT_MODES,
  VEDIC_RASHIS,
  VEDIC_NAKSHATRAS,
  FAMILY_RELATIONS,
  AVAILABLE_ADDONS,
} from "../../context/RitualBookingContext";
import { getServiceFallbackImage } from "../../../../services/pujaCatalogueService";

const ARRANGEMENT_MODE_LABELS = {
  kashi: {
    title: "Kashi Shrines & Ghats",
    desc: "Conducted at holy Ganga ghats or consecrated temples in Varanasi.",
    badge: "Kashi Special",
    icon: Sparkles,
  },
  remote: {
    title: "Remote Sankalpa",
    desc: "Live stream darshan with sanctified Prasad dispatched to your doorstep.",
    badge: "Online / Global",
    icon: Video,
  },
  customer_home: {
    title: "Devotee Residence",
    desc: "Purohit team visits your home with complete ceremonial samagri.",
    badge: "At Your Home",
    icon: Home,
  },
  temple: {
    title: "Consecrated Mandir",
    desc: "Arranged inside a consecrated temple with dedicated sanctum access.",
    badge: "Sacred Shrine",
    icon: MapPin,
  },
  veda_structure: {
    title: "Veda Structure Centre",
    desc: "Conducted in our dedicated Vedic sanctuary with acoustic mandapam.",
    badge: "Veda Centre",
    icon: Building,
  },
  other: {
    title: "Custom Venue",
    desc: "Coordinated at your designated family ancestral shrine or venue.",
    badge: "Custom",
    icon: MapPin,
  },
};

const TIME_PRESETS = [
  { label: "06:00 AM", desc: "Brahma Muhurta (06:00 AM)" },
  { label: "08:30 AM", desc: "Pratah / Morning (08:30 AM)" },
  { label: "11:00 AM", desc: "Madhyahna / Noon (11:00 AM)" },
  { label: "05:30 PM", desc: "Pradosha / Evening (05:30 PM)" },
  { label: "07:30 PM", desc: "Sandhya Aarti (07:30 PM)" },
];

const INTENTION_SUGGESTIONS = [
  "Ayushya & Good Health (आरोग्य)",
  "Removal of Obstacles (विघ्न निवारण)",
  "Family Peace & Harmony (पारिवारिक शांति)",
  "Prosperity & Abundance (धन समृद्धि)",
  "Career & Business Growth (कार्य सिद्धि)",
  "Planetary & Dosha Shanti (ग्रह शांति)",
];

const ADDON_ICONS = {
  prasad: Package,
  additional_pandit: Users,
  additional_day: Calendar,
  special_samagri: Sparkles,
  live_participation: Video,
  video_recording: Film,
  certificate: Award,
  other_service: Heart,
};

const PujaSinglePageBooking = () => {
  const navigate = useNavigate();
  const {
    service,
    configuration,
    updateConfiguration,
    yajmanDetails,
    updateYajmanDetails,
    sankalpDetails,
    updateSankalpDetails,
    familyMembers,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    locationDetails,
    updateLocationDetails,
    addons,
    toggleAddon,
    priceBreakdown,
    isCalculatingPrice,
    priceError,
    calculatePrice,
    bookingReference,
    isSubmitting,
    isOpeningPayment,
    submissionError,
    paymentError,
    checkPaymentStatus,
    errors,
    initiateBookingAndPayment,
  } = useRitualBooking();

  const [isAstrologyOpen, setIsAstrologyOpen] = useState(false);
  const [isSpecialInstructionsOpen, setIsSpecialInstructionsOpen] = useState(false);
  const [isCustomTime, setIsCustomTime] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const primaryImg =
    service?.image || service?.bannerImage || getServiceFallbackImage(service?.slug);

  const rawDurations =
    Array.isArray(service?.availableDurations) && service.availableDurations.length > 0
      ? service.availableDurations
      : service?.duration
      ? [service.duration]
      : ["2 Hours"];

  const durationHoursList =
    Array.isArray(service?.durationHours) && service.durationHours.length > 0
      ? service.durationHours
      : [];

  const handleDurationSelect = (dur, index) => {
    let hours = durationHoursList[index] != null ? Number(durationHoursList[index]) : null;
    if (!hours) {
      const parsed = parseInt(dur, 10);
      hours = !isNaN(parsed) && parsed > 0 ? parsed : null;
    }
    updateConfiguration({
      durationSelected: dur,
      durationHours: hours,
    });
  };

  const handlePanditIncrement = () => {
    const current = Number(configuration.panditCount) || 1;
    updateConfiguration({ panditCount: current + 1 });
  };

  const handlePanditDecrement = () => {
    const current = Number(configuration.panditCount) || 1;
    if (current > 1) {
      updateConfiguration({ panditCount: current - 1 });
    }
  };

  const handleArrangementSelect = (modeKey) => {
    updateConfiguration({
      arrangementMode: modeKey,
      locationType: modeKey,
    });
  };

  const handleTimeSelectChange = (e) => {
    const val = e.target.value;
    if (val === "CUSTOM") {
      setIsCustomTime(true);
      updateConfiguration({ bookingTime: "" });
    } else {
      setIsCustomTime(false);
      updateConfiguration({ bookingTime: val });
    }
  };

  const currentMode = configuration.arrangementMode || "kashi";
  const requiresPhysicalAddress =
    currentMode === "customer_home" || currentMode === "other" || currentMode === "temple";
  const isKashi = currentMode === "kashi";
  const isVedaStructure = currentMode === "veda_structure";
  const isRemote = currentMode === "remote";

  const isUnknownGotra = yajmanDetails.gotra === "Unknown";
  const handleUnknownGotraToggle = (checked) => {
    if (checked) {
      updateYajmanDetails({ gotra: "Unknown" });
    } else {
      updateYajmanDetails({ gotra: "" });
    }
  };

  const displayTotal =
    priceBreakdown?.totalAmount != null
      ? priceBreakdown.totalAmount
      : priceBreakdown?.calculatedAmount != null
      ? priceBreakdown.calculatedAmount
      : priceBreakdown?.amount != null
      ? priceBreakdown.amount
      : service?.startingPrice || 0;

  const baseAmount = priceBreakdown?.basePrice || service?.startingPrice || 0;
  const extraPanditCharge =
    priceBreakdown?.additionalPanditCharge || priceBreakdown?.additionalPanditsCharge || 0;
  const addonsTotal = priceBreakdown?.addonsTotal || 0;

  const formatDisplayMode = (mode) => {
    switch (mode) {
      case "remote":
        return "Remote Sankalpa (Live)";
      case "kashi":
        return "Kashi Shrines & Ghats";
      case "customer_home":
        return "Devotee Residence";
      case "temple":
        return "Consecrated Mandir";
      case "veda_structure":
        return "Veda Structure Centre";
      case "other":
        return "Custom Venue";
      default:
        return mode || "—";
    }
  };

  const hasAstrologyData =
    Boolean(yajmanDetails.gotra) ||
    Boolean(yajmanDetails.rashi) ||
    Boolean(yajmanDetails.nakshatra) ||
    Boolean(yajmanDetails.dob);

  return (
    <div className="min-h-screen bg-[#FFFAF0] pb-24 pt-4 sm:pb-28 sm:pt-6">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8" data-booking-form>
        {/* Top Breadcrumb & Return Link (Tight spacing) */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#EAD8B8] pb-2.5 text-[12px] text-[#766D60]">
          <div className="flex items-center gap-1.5 truncate">
            <Link to="/" className="hover:text-[#29231B] transition">Home</Link>
            <span>/</span>
            <Link to="/yagya-puja/puja" className="hover:text-[#29231B] transition">Puja</Link>
            <span>/</span>
            <Link to={`/yagya-puja/puja/${service?.slug}`} className="hover:text-[#29231B] transition truncate max-w-[180px]">
              {service?.name || "Ceremony"}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#B7791F]">Booking</span>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/yagya-puja/puja/${service?.slug}`)}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#766D60] hover:text-[#29231B] transition cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Overview</span>
          </button>
        </div>

        {/* Minimal Clean Heading (No marketing badges, no promotional subtitle) */}
        <div className="mb-5">
          <h1 className="font-serif text-[24px] sm:text-[30px] font-bold text-[#29231B] tracking-tight">
            Arrange {service?.name || "Sacred Rudrabhishek Puja"}
          </h1>
        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* =========================================================================
              LEFT COLUMN: STREAMLINED FORM SECTIONS (65-70% width)
          ========================================================================== */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">

            {/* SECTION 1: CEREMONY SCHEDULE & VENUE */}
            <section
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
              data-error-field={errors.durationSelected || errors.bookingDate || errors.bookingTime || errors.panditCount || errors.arrangementMode ? "ceremony_details" : undefined}
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                  1. Ceremony Schedule & Venue
                </h2>
                <span className="rounded-full bg-[#FFF5E5] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#B7791F]">
                  Required
                </span>
              </div>

              <div className="mt-4 space-y-4">
                {/* 1A. Duration Selection */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#29231B]">
                    Ceremony Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {rawDurations.map((dur, idx) => {
                      const isSelected = configuration.durationSelected === dur;
                      const displayHours = durationHoursList[idx] || parseInt(dur, 10) || null;
                      return (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => handleDurationSelect(dur, idx)}
                          className={`flex items-center justify-between rounded-lg p-3 text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-2 border-[#D99A20] bg-[#FFF5E5]/70 shadow-xs ring-1 ring-[#D99A20]/20"
                              : "border border-[#EAD8B8] bg-white hover:border-[#D8C3A1]"
                          }`}
                        >
                          <div>
                            <span className="font-serif text-[14.5px] font-bold text-[#29231B]">
                              {dur}
                            </span>
                            {displayHours && (
                              <p className="text-[11px] text-[#766D60]">
                                Approx. {displayHours} hrs
                              </p>
                            )}
                          </div>
                          {isSelected ? (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D99A20] text-white text-[10px] font-bold">
                              ✓
                            </span>
                          ) : (
                            <span className="h-3.5 w-3.5 rounded-full border border-[#D8C3A1]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.durationSelected && (
                    <p className="mt-1 flex items-center gap-1 text-[11.5px] text-red-600">
                      <AlertCircle size={12} /> {errors.durationSelected}
                    </p>
                  )}
                </div>

                {/* 1B. Ceremony Date & Muhurta Time */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {/* Date Input */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#29231B]">
                      Ceremony Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={configuration.bookingDate || ""}
                      onChange={(e) => updateConfiguration({ bookingDate: e.target.value })}
                      className={`mt-1.5 w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-[#29231B] transition focus:outline-none focus:ring-1 ${
                        errors.bookingDate
                          ? "border-red-400 focus:ring-red-400"
                          : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                      }`}
                    />
                    {errors.bookingDate && (
                      <p className="mt-1 flex items-center gap-1 text-[11.5px] text-red-600">
                        <AlertCircle size={12} /> {errors.bookingDate}
                      </p>
                    )}
                  </div>

                  {/* Time Selection via Select Dropdown */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#29231B]">
                      Auspicious Muhurta / Time <span className="text-red-500">*</span>
                    </label>
                    {!isCustomTime ? (
                      <select
                        value={configuration.bookingTime || "06:00 AM"}
                        onChange={handleTimeSelectChange}
                        className={`mt-1.5 w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-[#29231B] transition focus:outline-none focus:ring-1 ${
                          errors.bookingTime
                            ? "border-red-400 focus:ring-red-400"
                            : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                        }`}
                      >
                        {TIME_PRESETS.map((p) => (
                          <option key={p.label} value={p.label}>
                            {p.desc}
                          </option>
                        ))}
                        <option value="CUSTOM">+ Specify other time...</option>
                      </select>
                    ) : (
                      <div className="mt-1.5 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. 07:15 AM"
                          autoFocus
                          value={configuration.bookingTime || ""}
                          onChange={(e) => updateConfiguration({ bookingTime: e.target.value })}
                          className="flex-1 rounded-lg border border-[#EAD8B8] bg-white px-3 py-2 text-[13px] text-[#29231B] focus:border-[#D99A20] focus:outline-none focus:ring-1 focus:ring-[#D99A20]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomTime(false);
                            updateConfiguration({ bookingTime: "06:00 AM" });
                          }}
                          className="rounded-lg border border-[#EAD8B8] bg-[#FFFAF0] px-2.5 py-2 text-[11.5px] font-semibold text-[#766D60] hover:text-[#29231B]"
                        >
                          Presets
                        </button>
                      </div>
                    )}
                    {errors.bookingTime && (
                      <p className="mt-1 flex items-center gap-1 text-[11.5px] text-red-600">
                        <AlertCircle size={12} /> {errors.bookingTime}
                      </p>
                    )}
                  </div>
                </div>

                {/* 1C. Officiating Pandit Team Counter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-[#EAD8B8] bg-[#FFFAF0]/70 p-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#29231B]">
                      Officiating Purohits <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[11.5px] text-[#766D60]">
                      1 Purohit included. Additional Purohits assist in chanting (+₹500/purohit).
                    </p>
                  </div>

                  <div className="flex items-center rounded-lg border border-[#D8C3A1] bg-white shadow-2xs self-start sm:self-center">
                    <button
                      type="button"
                      onClick={handlePanditDecrement}
                      disabled={configuration.panditCount <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded-l-lg text-[15px] font-bold text-[#766D60] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFF5E5] transition"
                      aria-label="Decrease pandit count"
                    >
                      −
                    </button>
                    <div className="flex h-8 w-10 items-center justify-center font-serif text-[15px] font-bold text-[#29231B]">
                      {configuration.panditCount || 1}
                    </div>
                    <button
                      type="button"
                      onClick={handlePanditIncrement}
                      className="flex h-8 w-8 items-center justify-center rounded-r-lg text-[15px] font-bold text-[#766D60] hover:bg-[#FFF5E5] transition cursor-pointer"
                      aria-label="Increase pandit count"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 1D. Ceremony Venue */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#29231B]">
                    Sacred Ceremony Venue <span className="text-red-500">*</span>
                  </label>

                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {CANONICAL_ARRANGEMENT_MODES.map((modeKey) => {
                      const meta = ARRANGEMENT_MODE_LABELS[modeKey] || {
                        title: modeKey,
                        desc: "Ceremonial setup",
                        badge: "Vedic",
                        icon: MapPin,
                      };
                      const isSelected = currentMode === modeKey;
                      const IconComp = meta.icon;

                      return (
                        <button
                          key={modeKey}
                          type="button"
                          onClick={() => handleArrangementSelect(modeKey)}
                          className={`flex items-start gap-2.5 rounded-lg p-2.5 text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-2 border-[#D99A20] bg-[#FFF5E5]/70 shadow-xs ring-1 ring-[#D99A20]/20"
                              : "border border-[#EAD8B8] bg-white hover:border-[#D8C3A1]"
                          }`}
                        >
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                              isSelected ? "bg-[#D99A20] text-white" : "bg-[#FFF5E5] text-[#B7791F]"
                            }`}
                          >
                            <IconComp size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block font-serif text-[13.5px] font-bold text-[#29231B] truncate leading-tight">
                              {meta.title}
                            </span>
                            <span className="block mt-0.5 text-[10.5px] text-[#766D60] line-clamp-1">
                              {meta.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.arrangementMode && (
                    <p className="mt-1 flex items-center gap-1 text-[11.5px] text-red-600">
                      <AlertCircle size={12} /> {errors.arrangementMode}
                    </p>
                  )}
                </div>

                {/* 1E. Conditional Venue Details */}
                {requiresPhysicalAddress && (
                  <div className="rounded-lg border border-[#EAD8B8] bg-[#FFF5E5]/40 p-3.5 space-y-3">
                    <span className="block font-serif text-[13.5px] font-bold text-[#29231B]">
                      {currentMode === "temple" ? "Mandir Address" : "Venue Street Address"}
                    </span>

                    <div>
                      <input
                        type="text"
                        placeholder={
                          currentMode === "temple"
                            ? "Mandir Name & Detailed Address"
                            : "Full Street Address, House / Flat number"
                        }
                        value={locationDetails.address || ""}
                        onChange={(e) => updateLocationDetails({ address: e.target.value })}
                        className={`w-full rounded-lg border bg-white px-3 py-1.5 text-[12.5px] text-[#29231B] transition focus:outline-none focus:ring-1 ${
                          errors.address
                            ? "border-red-400 focus:ring-red-400"
                            : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                        }`}
                      />
                      {errors.address && (
                        <p className="mt-0.5 text-[11px] text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      <div>
                        <input
                          type="text"
                          placeholder="City *"
                          value={locationDetails.city || ""}
                          onChange={(e) => updateLocationDetails({ city: e.target.value })}
                          className={`w-full rounded-lg border bg-white px-3 py-1.5 text-[12.5px] text-[#29231B] ${
                            errors.city ? "border-red-400" : "border-[#EAD8B8] focus:border-[#D99A20]"
                          }`}
                        />
                        {errors.city && (
                          <p className="mt-0.5 text-[11px] text-red-600">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="State *"
                          value={locationDetails.state || ""}
                          onChange={(e) => updateLocationDetails({ state: e.target.value })}
                          className={`w-full rounded-lg border bg-white px-3 py-1.5 text-[12.5px] text-[#29231B] ${
                            errors.state ? "border-red-400" : "border-[#EAD8B8] focus:border-[#D99A20]"
                          }`}
                        />
                        {errors.state && (
                          <p className="mt-0.5 text-[11px] text-red-600">{errors.state}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Pincode *"
                          value={locationDetails.pincode || ""}
                          onChange={(e) => updateLocationDetails({ pincode: e.target.value })}
                          className={`w-full rounded-lg border bg-white px-3 py-1.5 text-[12.5px] text-[#29231B] ${
                            errors.pincode ? "border-red-400" : "border-[#EAD8B8] focus:border-[#D99A20]"
                          }`}
                        />
                        {errors.pincode && (
                          <p className="mt-0.5 text-[11px] text-red-600">{errors.pincode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {isRemote && (
                  <div className="rounded-lg border border-[#EAD8B8] bg-[#FFF5E5]/60 px-3 py-2 text-[12px] text-[#766D60] flex items-center gap-2">
                    <Video size={14} className="shrink-0 text-[#B7791F]" />
                    <span>Live stream link sent via WhatsApp. Sacred Prasad delivered to your registered contact.</span>
                  </div>
                )}

                {isKashi && (
                  <div className="rounded-lg border border-[#EAD8B8] bg-[#FFF5E5]/60 px-3 py-2 text-[12px] text-[#766D60] flex items-center gap-2">
                    <Sparkles size={14} className="shrink-0 text-[#B7791F]" />
                    <span>Coordinated at consecrated Ganga ghats or riverside shrines in Varanasi.</span>
                  </div>
                )}

                {isVedaStructure && (
                  <div className="rounded-lg border border-[#EAD8B8] bg-[#FFF5E5]/60 px-3 py-2 text-[12px] text-[#766D60] flex items-center gap-2">
                    <Building size={14} className="shrink-0 text-[#B7791F]" />
                    <span>Conducted at Veda Sanctuary. Arrival coordinates provided upon booking.</span>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 2: PRIMARY DEVOTEE (YAJMAN) DETAILS */}
            <section
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
              data-error-field={errors.name || errors.mobile || errors.email ? "yajman_details" : undefined}
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                  2. Primary Devotee (Yajman)
                </h2>
                <span className="rounded-full bg-[#FFF5E5] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#B7791F]">
                  Required
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="block text-[12.5px] font-semibold text-[#29231B]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={yajmanDetails.name || ""}
                    onChange={(e) => updateYajmanDetails({ name: e.target.value })}
                    className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-[#29231B] transition focus:outline-none focus:ring-1 ${
                      errors.name ? "border-red-400 focus:ring-red-400" : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-0.5 text-[11px] text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#29231B]">
                    WhatsApp / Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={yajmanDetails.mobile || ""}
                    onChange={(e) => updateYajmanDetails({ mobile: e.target.value })}
                    className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-[#29231B] transition focus:outline-none focus:ring-1 ${
                      errors.mobile ? "border-red-400 focus:ring-red-400" : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                    }`}
                  />
                  {errors.mobile && (
                    <p className="mt-0.5 text-[11px] text-red-600">{errors.mobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#29231B]">
                    Email Address <span className="text-[11px] font-normal text-[#766D60]">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="devotee@example.com"
                    value={yajmanDetails.email || ""}
                    onChange={(e) => updateYajmanDetails({ email: e.target.value })}
                    className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-[#29231B] transition focus:outline-none focus:ring-1 ${
                      errors.email ? "border-red-400 focus:ring-red-400" : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-0.5 text-[11px] text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#29231B]">
                    Gender
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    {["Male", "Female", "Other"].map((g) => {
                      const isSelected = yajmanDetails.gender === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => updateYajmanDetails({ gender: g })}
                          className={`flex-1 rounded-lg py-1.5 text-[12.5px] font-semibold transition cursor-pointer ${
                            isSelected
                              ? "border-2 border-[#D99A20] bg-[#FFF5E5] text-[#29231B]"
                              : "border border-[#EAD8B8] bg-white text-[#766D60] hover:bg-[#FFFAF0]"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: GOTRA & ASTROLOGICAL DETAILS (OPTIONAL COLLAPSIBLE) */}
            <section className="rounded-xl border border-[#EAD8B8] bg-white shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setIsAstrologyOpen((prev) => !prev)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#FFFAF0]/50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-[15px] sm:text-[16px] font-bold text-[#29231B]">
                    3. Gotra & Astrological Coordinates
                  </h2>
                  <span className="rounded-full bg-[#FFF5E5] px-2 py-0.5 text-[10px] font-medium text-[#B7791F]">
                    Optional
                  </span>
                  {hasAstrologyData && !isAstrologyOpen && (
                    <span className="hidden sm:inline text-[11px] text-[#766D60]">
                      ({yajmanDetails.gotra || "Gotra added"})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[12px] text-[#766D60]">
                  <span>{isAstrologyOpen ? "Hide" : "+ Add"}</span>
                  {isAstrologyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isAstrologyOpen && (
                <div className="border-t border-[#F0E4D2] p-4 bg-[#FFFAF0]/30 space-y-3.5">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-[12px] font-semibold text-[#29231B]">Gotra</label>
                        <label className="flex items-center gap-1 text-[10.5px] text-[#766D60] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isUnknownGotra}
                            onChange={(e) => handleUnknownGotraToggle(e.target.checked)}
                            className="h-3 w-3 rounded text-[#D99A20]"
                          />
                          <span>Unknown</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Kashyap"
                        disabled={isUnknownGotra}
                        value={isUnknownGotra ? "Unknown" : yajmanDetails.gotra || ""}
                        onChange={(e) => updateYajmanDetails({ gotra: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-3 py-1.5 text-[12.5px] text-[#29231B] disabled:bg-[#f5f1eb]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#29231B]">
                        Rashi (Moon Sign)
                      </label>
                      <select
                        value={yajmanDetails.rashi || ""}
                        onChange={(e) => updateYajmanDetails({ rashi: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12.5px] text-[#29231B]"
                      >
                        <option value="">Select Rashi</option>
                        {VEDIC_RASHIS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#29231B]">
                        Janma Nakshatra
                      </label>
                      <select
                        value={yajmanDetails.nakshatra || ""}
                        onChange={(e) => updateYajmanDetails({ nakshatra: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12.5px] text-[#29231B]"
                      >
                        <option value="">Select Nakshatra</option>
                        {VEDIC_NAKSHATRAS.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-1">
                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#29231B]">Date of Birth</label>
                      <input
                        type="date"
                        value={yajmanDetails.dob || ""}
                        onChange={(e) => updateYajmanDetails({ dob: e.target.value })}
                        className="mt-0.5 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#29231B]">Time of Birth</label>
                      <input
                        type="text"
                        placeholder="e.g. 06:45 AM"
                        value={yajmanDetails.timeOfBirth || ""}
                        onChange={(e) => updateYajmanDetails({ timeOfBirth: e.target.value })}
                        className="mt-0.5 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#29231B]">Place of Birth</label>
                      <input
                        type="text"
                        placeholder="City, State"
                        value={yajmanDetails.placeOfBirth || ""}
                        onChange={(e) => updateYajmanDetails({ placeOfBirth: e.target.value })}
                        className="mt-0.5 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F0E4D2] grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <input
                      type="text"
                      placeholder="Father's name (optional)"
                      value={yajmanDetails.fatherName || ""}
                      onChange={(e) => updateYajmanDetails({ fatherName: e.target.value })}
                      className="rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1 text-[12px] text-[#29231B]"
                    />
                    <input
                      type="text"
                      placeholder="Mother's name (optional)"
                      value={yajmanDetails.motherName || ""}
                      onChange={(e) => updateYajmanDetails({ motherName: e.target.value })}
                      className="rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1 text-[12px] text-[#29231B]"
                    />
                    <input
                      type="text"
                      placeholder="Spouse name (if married)"
                      value={yajmanDetails.spouseName || ""}
                      onChange={(e) => updateYajmanDetails({ spouseName: e.target.value })}
                      className="rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1 text-[12px] text-[#29231B]"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* SECTION 4: SACRED SANKALP & PRAYER */}
            <section
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
              data-error-field={errors.mainIntention ? "sankalp_details" : undefined}
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                  4. Sacred Sankalp & Prayer
                </h2>
                <span className="rounded-full bg-[#FFF5E5] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#B7791F]">
                  Required
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                {/* Main Sankalp Intention */}
                <div>
                  <label className="block text-[12.5px] font-semibold text-[#29231B]">
                    Main Sankalp Intention <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Pick a preset below or type your intention"
                    value={sankalpDetails.mainIntention || ""}
                    onChange={(e) => updateSankalpDetails({ mainIntention: e.target.value })}
                    className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-[#29231B] transition focus:outline-none focus:ring-1 ${
                      errors.mainIntention ? "border-red-400 focus:ring-red-400" : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                    }`}
                  />
                  {/* Preset chips */}
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {INTENTION_SUGGESTIONS.map((sugg) => {
                      const isSelected = sankalpDetails.mainIntention === sugg;
                      return (
                        <button
                          key={sugg}
                          type="button"
                          onClick={() => updateSankalpDetails({ mainIntention: sugg })}
                          className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                            isSelected
                              ? "bg-[#D99A20] font-bold text-white shadow-2xs"
                              : "border border-[#EAD8B8] bg-[#FFFAF0] text-[#766D60] hover:bg-[#FFF5E5]"
                          }`}
                        >
                          {sugg}
                        </button>
                      );
                    })}
                  </div>
                  {errors.mainIntention && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.mainIntention}</p>
                  )}
                </div>

                {/* Specific Prayer */}
                <div>
                  <label className="block text-[12.5px] font-semibold text-[#29231B]">
                    Personal Prayer / Special Requests <span className="text-[11px] font-normal text-[#766D60]">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Recited aloud by Pandits during Sankalp (e.g. good health for family)..."
                    value={sankalpDetails.specificSankalp || ""}
                    onChange={(e) => updateSankalpDetails({ specificSankalp: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white p-2.5 text-[12.5px] text-[#29231B] focus:border-[#D99A20] focus:outline-none focus:ring-1 focus:ring-[#D99A20]"
                  />
                </div>

                {/* Collapsible Pandit Notes */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsSpecialInstructionsOpen((prev) => !prev)}
                    className="text-[11.5px] font-semibold text-[#B7791F] hover:underline cursor-pointer"
                  >
                    {isSpecialInstructionsOpen ? "− Hide priest instructions" : "+ Add special priest instructions (optional)"}
                  </button>

                  {isSpecialInstructionsOpen && (
                    <input
                      type="text"
                      placeholder="e.g. Seated chair for elderly father, Hindi/English commentary"
                      value={sankalpDetails.specialInstructions || ""}
                      onChange={(e) => updateSankalpDetails({ specialInstructions: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-[#EAD8B8] bg-white px-3 py-1.5 text-[12px] text-[#29231B] focus:border-[#D99A20] focus:outline-none"
                    />
                  )}
                </div>
              </div>
            </section>

            {/* SECTION 5: CO-YAJMAN & FAMILY MEMBERS (OPTIONAL) */}
            <section
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
              data-error-field={errors.familyMembers ? "family_members" : undefined}
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                  5. Family Members / Co-Yajman
                </h2>
                <span className="rounded-full bg-[#FFF5E5] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#B7791F]">
                  Optional
                </span>
              </div>

              {errors.familyMembers && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-[11.5px] text-red-700">
                  {errors.familyMembers}
                </div>
              )}

              <div className="mt-3 space-y-3">
                {familyMembers.length === 0 ? (
                  <div className="flex items-center justify-between rounded-lg border border-dashed border-[#D8C3A1] bg-[#FFFAF0]/50 px-3.5 py-2.5 text-[12px] text-[#766D60]">
                    <span>Performed primarily for the Yajman. Add family members if desired.</span>
                    <button
                      type="button"
                      onClick={addFamilyMember}
                      className="inline-flex items-center gap-1 rounded-full border border-[#D99A20] bg-white px-3 py-1 text-[11.5px] font-bold text-[#B7791F] hover:bg-[#FFF5E5] transition cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>+ Add Member</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {familyMembers.map((member, idx) => {
                      const nameError = errors[`familyMember_${idx}_name`];
                      return (
                        <div
                          key={idx}
                          className="rounded-lg border border-[#EAD8B8] bg-[#FFFAF0]/30 p-3 space-y-2.5"
                        >
                          <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-1.5">
                            <span className="font-serif text-[13px] font-bold text-[#29231B]">
                              Member #{idx + 1}: {member.name || "New Member"}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFamilyMember(idx)}
                              className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-800 cursor-pointer"
                            >
                              <Trash2 size={11} />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                            <div>
                              <input
                                type="text"
                                placeholder="Full Name *"
                                value={member.name || ""}
                                onChange={(e) => updateFamilyMember(idx, { name: e.target.value })}
                                className={`w-full rounded-lg border bg-white px-2.5 py-1 text-[12px] text-[#29231B] ${
                                  nameError ? "border-red-400" : "border-[#EAD8B8]"
                                }`}
                              />
                              {nameError && (
                                <p className="mt-0.5 text-[10.5px] text-red-600">{nameError}</p>
                              )}
                            </div>

                            <div>
                              <select
                                value={member.relation || "Spouse"}
                                onChange={(e) => updateFamilyMember(idx, { relation: e.target.value })}
                                className="w-full rounded-lg border border-[#EAD8B8] bg-white px-2 py-1 text-[12px] text-[#29231B]"
                              >
                                {FAMILY_RELATIONS.map((rel) => (
                                  <option key={rel} value={rel}>{rel}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <select
                                value={member.gender || "Female"}
                                onChange={(e) => updateFamilyMember(idx, { gender: e.target.value })}
                                className="w-full rounded-lg border border-[#EAD8B8] bg-white px-2 py-1 text-[12px] text-[#29231B]"
                              >
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={addFamilyMember}
                      className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#B7791F] hover:underline cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>+ Add another family member</span>
                    </button>
                  </>
                )}
              </div>
            </section>

            {/* SECTION 6: EXISTING ADDITIONAL SERVICES (ADD-ONS) */}
            <section className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                  6. Ceremony Customizations & Add-ons
                </h2>
                <span className="rounded-full bg-[#FFF5E5] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#B7791F]">
                  Optional
                </span>
              </div>

              {/* Addons Grid */}
              <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {AVAILABLE_ADDONS.map((addon) => {
                  const isSelected = addons.some((item) => item.type === addon.type);
                  const IconComp = ADDON_ICONS[addon.type] || Sparkles;

                  return (
                    <div
                      key={addon.type}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-start gap-2.5 rounded-lg border p-2.5 transition-all cursor-pointer select-none ${
                        isSelected
                          ? "border-[#D99A20] bg-[#FFF5E5]/70 shadow-xs ring-1 ring-[#D99A20]/20"
                          : "border-[#EAD8B8] bg-white hover:border-[#D8C3A1]"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                          isSelected ? "bg-[#D99A20] text-white" : "bg-[#FFF5E5] text-[#B7791F]"
                        }`}
                      >
                        <IconComp size={13} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-serif text-[13px] font-bold text-[#29231B] truncate">
                            {addon.name}
                          </span>
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                              isSelected ? "border-[#D99A20] bg-[#D99A20] text-white" : "border-[#D8C3A1]"
                            }`}
                          >
                            {isSelected && <Check size={10} strokeWidth={3} />}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10.5px] text-[#766D60] line-clamp-1">
                          {addon.tagline}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: STICKY BOOKING SUMMARY (30-35% width)
          ========================================================================== */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
            <div className="overflow-hidden rounded-xl border border-[#EAD8B8] bg-white shadow-xs">
              {/* Compact Preview Image */}
              <div className="relative h-28 w-full overflow-hidden bg-[#29231B]">
                <img
                  src={primaryImg}
                  alt={service?.name}
                  className="h-full w-full object-cover object-center opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1308]/90 via-[#1c1308]/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#D99A20]">
                    SACRED CEREMONY
                  </span>
                  <h3 className="font-serif text-[15px] font-bold leading-tight truncate">
                    {service?.name || "Ceremony"}
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-3.5">
                {/* Clean Configuration Recap */}
                <div className="space-y-1.5 border-b border-[#F0E4D2] pb-3 text-[12px]">
                  <div className="flex items-center justify-between text-[#766D60]">
                    <span>Duration:</span>
                    <strong className="text-[#29231B]">
                      {configuration.durationSelected || "—"}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-[#766D60]">
                    <span>Date & Time:</span>
                    <strong className="text-[#29231B] truncate max-w-[160px]">
                      {configuration.bookingDate
                        ? `${configuration.bookingDate} (${configuration.bookingTime || "06:00 AM"})`
                        : "—"}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-[#766D60]">
                    <span>Venue:</span>
                    <strong className="text-[#29231B] truncate max-w-[160px]">
                      {formatDisplayMode(configuration.arrangementMode)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-[#766D60]">
                    <span>Primary Devotee:</span>
                    <strong className="text-[#29231B] truncate max-w-[160px]">
                      {yajmanDetails.name ? yajmanDetails.name : "—"}
                    </strong>
                  </div>
                </div>

                {/* Dakshina Breakdown */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#766D60]">
                    <span>Dakshina Breakdown</span>
                    {isCalculatingPrice && (
                      <span className="inline-flex items-center gap-1 text-[10.5px] text-[#B7791F] animate-pulse">
                        <RefreshCw size={10} className="animate-spin" />
                        Calculating...
                      </span>
                    )}
                  </div>

                  {priceError ? (
                    <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-[11px] text-red-700">
                      <p>{priceError}</p>
                      <button
                        type="button"
                        onClick={() => calculatePrice()}
                        className="mt-0.5 font-bold underline cursor-pointer hover:text-red-900"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-1 text-[12.5px]">
                      <div className="flex items-center justify-between text-[#766D60]">
                        <span>Base Ceremony:</span>
                        <span className="font-semibold text-[#29231B]">
                          ₹{Number(baseAmount).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {extraPanditCharge > 0 && (
                        <div className="flex items-center justify-between text-[#766D60]">
                          <span>Additional Purohits:</span>
                          <span className="font-semibold text-[#29231B]">
                            +₹{Number(extraPanditCharge).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}

                      {addonsTotal > 0 && (
                        <div className="flex items-center justify-between text-[#766D60]">
                          <span>Add-ons Total:</span>
                          <span className="font-semibold text-[#29231B]">
                            +₹{Number(addonsTotal).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}

                      <div className="border-t border-[#EAD8B8] pt-2 flex items-baseline justify-between">
                        <div>
                          <span className="block text-[10.5px] font-bold uppercase tracking-wider text-[#766D60]">
                            Total Payable
                          </span>
                          <span className="text-[9.5px] text-[#8a7c6b]">All samagri included</span>
                        </div>
                        <span className="font-serif text-[22px] font-bold text-[#B7791F]">
                          ₹{Number(displayTotal).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {submissionError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-700">
                    <p className="font-bold">Booking Notice</p>
                    <p>{submissionError}</p>
                  </div>
                )}

                {paymentError && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-800">
                    <p className="font-bold">Payment Notice</p>
                    <p>{paymentError}</p>
                  </div>
                )}

                {/* Primary CTA Button */}
                <div className="pt-1 space-y-1.5">
                  <button
                    type="button"
                    onClick={initiateBookingAndPayment}
                    disabled={isSubmitting || isOpeningPayment || isCalculatingPrice || !!priceError}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D99A20] via-[#E6A935] to-[#B7791F] py-3 px-5 text-[13.5px] font-bold text-[#1c1308] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs hover:brightness-105 transition cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Creating booking...</span>
                      </>
                    ) : isOpeningPayment ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Connecting to gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        <span>{bookingReference ? "Retry Payment" : "Proceed to Secure Payment"}</span>
                      </>
                    )}
                  </button>

                  {bookingReference && !isSubmitting && !isOpeningPayment && (
                    <button
                      type="button"
                      onClick={checkPaymentStatus}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-[#EAD8B8] bg-white py-1.5 text-[11.5px] font-semibold text-[#766D60] hover:bg-[#FFFAF0] transition cursor-pointer"
                    >
                      <RefreshCw size={12} className="text-[#B7791F]" />
                      <span>Check Payment Status</span>
                    </button>
                  )}
                </div>

                {/* Subtle Trust Note */}
                <p className="text-center text-[10.5px] text-[#8a7c6b]">
                  Verified Purohits • Pure Samagri • 256-bit SSL Cashfree
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE STICKY BOTTOM BAR (< 1024px)
      ========================================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAD8B8] px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3">
        <div>
          <span className="block text-[9.5px] font-bold uppercase tracking-wider text-[#766D60]">
            Total Dakshina
          </span>
          <span className="font-serif text-[18px] font-bold text-[#B7791F]">
            ₹{Number(displayTotal).toLocaleString("en-IN")}
          </span>
        </div>

        <button
          type="button"
          onClick={initiateBookingAndPayment}
          disabled={isSubmitting || isOpeningPayment || isCalculatingPrice || !!priceError}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D99A20] via-[#E6A935] to-[#B7791F] px-5 py-2 text-[12.5px] font-bold text-[#1c1308] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs hover:brightness-105 transition cursor-pointer"
        >
          {isSubmitting || isOpeningPayment ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Lock size={13} />
          )}
          <span>{bookingReference ? "Retry Payment" : "Proceed to Payment"}</span>
        </button>
      </div>
    </div>
  );
};

export default PujaSinglePageBooking;
