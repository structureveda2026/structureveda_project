import { useState, useMemo, useEffect } from "react";
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
  Edit2,
  Lock,
  RefreshCw,
  AlertCircle,
  Video,
  Home,
  Building,
  Check,
  ScrollText,
  Sparkles,
  Flame,
  CheckCircle2,
  Package,
  HeartHandshake,
  HelpCircle,
} from "lucide-react";
import {
  useRitualBooking,
  VEDIC_RASHIS,
  VEDIC_NAKSHATRAS,
  FAMILY_RELATIONS,
} from "../../context/RitualBookingContext";

const ARRANGEMENT_MODE_LABELS = {
  kashi: {
    title: "Kashi Mandapams & Shrines",
    desc: "Conducted in Varanasi at consecrated Yajnashalas near Manikarnika & Assi shrines.",
    badge: "Kashi Sanctum",
    icon: Flame,
  },
  customer_home: {
    title: "At Devotee Yajnashala",
    desc: "Vedic Purohit team arrives at your premise with complete consecrated Homa Kunda setup.",
    badge: "Personal Venue",
    icon: Home,
  },
  remote: {
    title: "Remote Sankalpa (Live Darshan)",
    desc: "Live video stream darshan with personal Gotra recitation and Sanctified Prasad dispatch.",
    badge: "Online & Global",
    icon: Video,
  },
  temple: {
    title: "Consecrated Mandir Premises",
    desc: "Arranged inside a consecrated temple adhering to strict Agamic and Shastric protocols.",
    badge: "Temple Shrine",
    icon: MapPin,
  },
  veda_structure: {
    title: "Veda Structure Consecrated Centre",
    desc: "Conducted in our consecrated Vedic Yajnashala built with traditional acoustic Agnicayana mandapam.",
    badge: "Veda Centre",
    icon: Building,
  },
  other: {
    title: "Other Sacred Venue",
    desc: "Custom sacred site coordinated according to your family Kuladevata or ancestral traditions.",
    badge: "Custom Venue",
    icon: MapPin,
  },
};

const TIME_PRESETS = [
  { label: "06:00 AM", desc: "Brahma Muhurta Ahuti (06:00 AM)" },
  { label: "08:30 AM", desc: "Pratah Kalin Homa (08:30 AM)" },
  { label: "10:30 AM", desc: "Madhyahna Ahuti (10:30 AM)" },
  { label: "04:30 PM", desc: "Sayankalin Homa (04:30 PM)" },
];

const INTENTION_SUGGESTIONS = [
  "Ayushya & Good Health (आरोग्य)",
  "Removal of Obstacles & Evil Eye (विघ्न निवारण)",
  "Family Harmony & Peaceful Home (पारिवारिक शांति)",
  "Prosperity & Financial Stability (धन-धान्य समृद्धि)",
  "Career Growth & Business Success (कार्य सिद्धि)",
  "Planetary & Dosha Shanti (ग्रह दोष शांति)",
  "Spiritual Upliftment & Punya (आध्यात्मिक उन्नति)",
];

/**
 * Maps a service location mode string to canonical internal mode
 */
const mapToCanonicalMode = (rawMode) => {
  if (!rawMode) return "kashi";
  const m = String(rawMode).toLowerCase().trim();
  if (m === "kashi_sanctum" || m === "kashi") return "kashi";
  if (m === "home_premise" || m === "customer_home" || m === "home") return "customer_home";
  if (m === "remote" || m === "online") return "remote";
  if (m === "temple" || m === "mandir") return "temple";
  if (m === "veda_structure" || m === "veda_centre") return "veda_structure";
  if (m === "other") return "other";
  return "kashi";
};

/**
 * Calculates Yagya completion date (start date + days - 1)
 * Strict UTC arithmetic to avoid timezone shifts.
 */
const calculateCompletionDate = (startDateStr, daysCount) => {
  if (!startDateStr || !daysCount || Number(daysCount) < 1) return "";
  try {
    const parts = String(startDateStr).split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return "";
    const [year, month, day] = parts;
    const d = new Date(Date.UTC(year, month - 1, day));
    if (isNaN(d.getTime())) return "";
    d.setUTCDate(d.getUTCDate() + (Number(daysCount) - 1));
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

/**
 * Format date helper (timezone-safe)
 */
const formatFriendlyDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    const parts = String(dateStr).split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return dateStr;
    const [year, month, day] = parts;
    const d = new Date(Date.UTC(year, month - 1, day));
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return dateStr;
  }
};

const YagyaSinglePageBooking = () => {
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

  // Co-Yajman editing state
  const [editingMemberIdx, setEditingMemberIdx] = useState(null);
  const [memberFormData, setMemberFormData] = useState({
    name: "",
    relation: "Self",
    gender: "Male",
    gotra: "",
    rashi: "",
    nakshatra: "",
    dob: "",
  });
  const [memberFormError, setMemberFormError] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  // 1. Available Durations from service data (Source of Truth)
  const availableDurations = useMemo(() => {
    if (Array.isArray(service?.availableDurations) && service.availableDurations.length > 0) {
      return service.availableDurations.map((d) => Number(d)).filter((d) => !isNaN(d) && d > 0);
    }
    return [3, 5, 7];
  }, [service]);

  // 2. Daily ritual hours from service data (Source of Truth)
  const dailyHours = useMemo(() => {
    return Number(service?.dailyRitualHours) || 5;
  }, [service]);

  // 3. Minimum pandits required from service data (Source of Truth)
  const minPandits = useMemo(() => {
    return (
      Number(service?.panditRequirement?.minPandits) ||
      Number(service?.panditRequirement?.minimumPandits) ||
      3
    );
  }, [service]);

  // 4. Supported canonical arrangement modes derived strictly from service data
  const supportedModes = useMemo(() => {
    const list = [];
    if (Array.isArray(service?.locationModes) && service.locationModes.length > 0) {
      service.locationModes.forEach((raw) => {
        const canonical = mapToCanonicalMode(raw);
        if (!list.includes(canonical)) list.push(canonical);
      });
    }
    if (service?.isKashiAvailable !== false && !list.includes("kashi")) {
      list.unshift("kashi");
    }
    if (service?.isRemoteAvailable !== false && !list.includes("remote")) {
      list.push("remote");
    }
    return list.length > 0 ? list : ["kashi", "remote"];
  }, [service]);

  const selectedDays = Number(configuration.days) || availableDurations[0] || 3;

  // Active pricing tier for currently selected duration
  const currentTier = useMemo(() => {
    if (Array.isArray(service?.pricingTiers)) {
      return service.pricingTiers.find((t) => Number(t.days) === selectedDays) || null;
    }
    return null;
  }, [service, selectedDays]);

  // Authoritative pandits prescribed for this tier
  const currentTierPandits = useMemo(() => {
    if (currentTier?.panditCount) {
      return Number(currentTier.panditCount);
    }
    return minPandits;
  }, [currentTier, minPandits]);

  // Initial synchronization for clean first load
  useEffect(() => {
    const updates = {};
    if (!configuration.days) {
      const defaultDays = availableDurations[0] || 3;
      updates.days = defaultDays;
      updates.durationSelected = `${defaultDays} Days`;
      updates.dailyHours = dailyHours;
      updates.durationHours = defaultDays * dailyHours;
      updates.panditCount = currentTierPandits;
      if (configuration.bookingDate) {
        updates.completionDate = calculateCompletionDate(configuration.bookingDate, defaultDays);
      }
      if (currentTier) {
        updates.selectedPricingTier = currentTier;
      }
    }
    if (!configuration.arrangementMode) {
      const defaultMode = supportedModes[0] || "kashi";
      updates.arrangementMode = defaultMode;
      updates.locationType = defaultMode;
    }
    if (!configuration.bookingTime) {
      updates.bookingTime = "06:00 AM";
    }
    if (Object.keys(updates).length > 0) {
      updateConfiguration(updates);
    }
  }, [
    configuration.days,
    configuration.arrangementMode,
    configuration.bookingTime,
    configuration.bookingDate,
    availableDurations,
    dailyHours,
    currentTierPandits,
    currentTier,
    supportedModes,
    updateConfiguration,
  ]);

  // Handle duration selection
  const handleDurationSelect = (daysCount) => {
    const numDays = Number(daysCount);
    const totalHours = numDays * dailyHours;

    let matchedTier = null;
    if (Array.isArray(service?.pricingTiers)) {
      matchedTier = service.pricingTiers.find((t) => Number(t.days) === numDays) || null;
    }

    const tierPandits = matchedTier?.panditCount ? Number(matchedTier.panditCount) : minPandits;
    const compDate = configuration.bookingDate
      ? calculateCompletionDate(configuration.bookingDate, numDays)
      : "";

    updateConfiguration({
      days: numDays,
      durationSelected: `${numDays} Days`,
      dailyHours,
      durationHours: totalHours,
      panditCount: tierPandits,
      completionDate: compDate,
      selectedPricingTier: matchedTier,
    });
  };

  // Handle start date selection
  const handleDateChange = (dateVal) => {
    const compDate = dateVal ? calculateCompletionDate(dateVal, selectedDays) : "";
    updateConfiguration({
      bookingDate: dateVal,
      completionDate: compDate,
    });
  };

  // Handle time selection
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

  // Handle venue selection (updates both canonical fields simultaneously)
  const handleArrangementSelect = (modeKey) => {
    updateConfiguration({
      arrangementMode: modeKey,
      locationType: modeKey,
    });
  };

  // Unknown Gotra toggle
  const handleUnknownGotraToggle = (checked) => {
    updateYajmanDetails({ gotra: checked ? "Unknown" : "" });
  };

  // Family Member Handlers
  const handleOpenAddMember = () => {
    setMemberFormData({
      name: "",
      relation: "Spouse",
      gender: "Female",
      gotra: yajmanDetails.gotra && yajmanDetails.gotra !== "Unknown" ? yajmanDetails.gotra : "",
      rashi: "",
      nakshatra: "",
      dob: "",
    });
    setMemberFormError("");
    setEditingMemberIdx("new");
  };

  const handleStartEditMember = (idx) => {
    const mem = familyMembers[idx];
    if (!mem) return;
    setMemberFormData({
      name: mem.name || "",
      relation: mem.relation || "Spouse",
      gender: mem.gender || "Female",
      gotra: mem.gotra || "",
      rashi: mem.rashi || "",
      nakshatra: mem.nakshatra || "",
      dob: mem.dob || "",
    });
    setMemberFormError("");
    setEditingMemberIdx(idx);
  };

  const handleSaveMember = () => {
    const trimmedName = (memberFormData.name || "").trim();
    if (!trimmedName) {
      setMemberFormError("Please enter the family member's full name.");
      return;
    }
    setMemberFormError("");

    const memberPayload = {
      name: trimmedName,
      relation: memberFormData.relation || "Spouse",
      gender: memberFormData.gender || "Female",
      gotra: (memberFormData.gotra || "").trim(),
      rashi: memberFormData.rashi || "",
      nakshatra: memberFormData.nakshatra || "",
      dob: memberFormData.dob || "",
    };

    if (editingMemberIdx === "new") {
      addFamilyMember(memberPayload);
    } else if (typeof editingMemberIdx === "number" && editingMemberIdx >= 0) {
      updateFamilyMember(editingMemberIdx, memberPayload);
    } else {
      addFamilyMember(memberPayload);
    }

    setMemberFormData({
      name: "",
      relation: "Spouse",
      gender: "Female",
      gotra: "",
      rashi: "",
      nakshatra: "",
      dob: "",
    });
    setEditingMemberIdx(null);
  };

  const handleCancelMemberForm = () => {
    setMemberFormData({
      name: "",
      relation: "Spouse",
      gender: "Female",
      gotra: "",
      rashi: "",
      nakshatra: "",
      dob: "",
    });
    setMemberFormError("");
    setEditingMemberIdx(null);
  };

  // Hero image with safe fallbacks
  const primaryImg =
    service?.image || service?.bannerImage || "/assets/card-yagya-fire-CIHyRsVH.jpg";

  // Authoritative total price calculation
  const totalDakshina =
    priceBreakdown?.totalAmount != null
      ? priceBreakdown.totalAmount
      : priceBreakdown?.calculatedAmount != null
      ? priceBreakdown.calculatedAmount
      : currentTier?.price != null
      ? Number(currentTier.price)
      : service?.startingPrice || 0;

  const currentMode = configuration.arrangementMode || supportedModes[0] || "kashi";
  const requiresPhysicalAddress =
    currentMode === "customer_home" || currentMode === "other" || currentMode === "temple";

  return (
    <div className="min-h-screen bg-[#FFFAF0] pt-4 sm:pt-6 pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8" data-booking-form>
        {/* Top Breadcrumb & Return Link */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#EAD8B8] pb-2.5 text-[12px] text-[#766D60]">
          <div className="flex items-center gap-1.5 truncate">
            <Link to="/" className="hover:text-[#29231B] transition">Home</Link>
            <span>/</span>
            <Link to="/yagya-puja/yagya" className="hover:text-[#29231B] transition">Yagya</Link>
            <span>/</span>
            <Link
              to={`/yagya-puja/yagya/${service?.slug}`}
              className="hover:text-[#29231B] transition truncate max-w-[180px]"
            >
              {service?.name || "Yagya"}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#B7791F]">Booking</span>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/yagya-puja/yagya/${service?.slug}`)}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#766D60] hover:text-[#29231B] transition cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Overview</span>
          </button>
        </div>

        {/* Minimal Clean Heading */}
        <div className="mb-5">
          <h1 className="font-serif text-[24px] sm:text-[30px] font-bold text-[#29231B] tracking-tight">
            Arrange {service?.name || "Sacred Vedic Yagya"}
          </h1>
        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* =========================================================================
              LEFT COLUMN: STREAMLINED FORM SECTIONS (65-70% width)
          ========================================================================== */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            {/* SECTION 1: YAGYA MULTI-DAY SCHEDULE */}
            <section
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
              data-error-field={
                errors.days || errors.bookingDate || errors.bookingTime || errors.panditCount
                  ? "yagya_schedule"
                  : undefined
              }
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF5E5] text-[11px] font-bold text-[#B7791F]">
                    1
                  </span>
                  <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                    Multi-Day Anushthan Schedule
                  </h2>
                </div>
                <span className="rounded-full bg-[#FFF5E5] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#B7791F]">
                  Required
                </span>
              </div>

              <div className="mt-4 space-y-4">
                {/* 1A. Duration / Package Selection */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-[13px] font-semibold text-[#29231B]">
                      Yagya Duration & Package <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11.5px] text-[#766D60]">
                      {dailyHours} Continuous Hours / Day
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {availableDurations.map((daysCount) => {
                      const isSelected = selectedDays === daysCount;
                      const tierMatch = Array.isArray(service?.pricingTiers)
                        ? service.pricingTiers.find((t) => Number(t.days) === daysCount)
                        : null;
                      const tierPrice = tierMatch?.price ? Number(tierMatch.price) : null;
                      const tierPandits = tierMatch?.panditCount
                        ? Number(tierMatch.panditCount)
                        : minPandits;

                      return (
                        <button
                          key={daysCount}
                          type="button"
                          onClick={() => handleDurationSelect(daysCount)}
                          className={`flex flex-col justify-between rounded-lg p-3 text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-2 border-[#D99A20] bg-[#FFF5E5]/70 shadow-xs ring-1 ring-[#D99A20]/20"
                              : "border border-[#EAD8B8] bg-white hover:border-[#D8C3A1]"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-serif text-[16px] font-bold text-[#29231B]">
                                {daysCount} Days
                              </span>
                              {isSelected ? (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D99A20] text-white text-[10px] font-bold">
                                  ✓
                                </span>
                              ) : (
                                <span className="h-3.5 w-3.5 rounded-full border border-[#D8C3A1]" />
                              )}
                            </div>

                            <p className="mt-1 text-[11px] text-[#766D60] leading-tight">
                              {daysCount * dailyHours} Total Ritual Hrs • {tierPandits} Scholars
                            </p>
                          </div>

                          {tierPrice && (
                            <div className="mt-2.5 pt-2 border-t border-[#F0E4D2] flex items-baseline justify-between">
                              <span className="text-[10px] font-medium uppercase text-[#766D60]">
                                Package
                              </span>
                              <span className="font-serif text-[13.5px] font-bold text-[#29231B]">
                                ₹{tierPrice.toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.days && (
                    <p className="mt-1 flex items-center gap-1 text-[11.5px] text-red-600">
                      <AlertCircle size={12} /> {errors.days}
                    </p>
                  )}
                </div>

                {/* 1B. Commencement Date & Maha Purnahuti (End Date) */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {/* Start Date */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#29231B]">
                      Commencement Date (Day 1) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={configuration.bookingDate || ""}
                      onChange={(e) => handleDateChange(e.target.value)}
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

                  {/* Maha Purnahuti Completion Date (Derived) */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#29231B]">
                      Maha Purnahuti (Day {selectedDays})
                    </label>
                    <div className="mt-1.5 flex h-[38px] items-center rounded-lg border border-[#EAD8B8] bg-[#FFFAF0] px-3 text-[13px] text-[#29231B]">
                      {configuration.completionDate ? (
                        <div className="flex items-center gap-1.5 font-medium text-[#2e7d32]">
                          <CheckCircle2 size={13} className="text-[#2e7d32] shrink-0" />
                          <span>{formatFriendlyDate(configuration.completionDate)}</span>
                          <span className="text-[11px] text-[#766D60]">(Purnahuti)</span>
                        </div>
                      ) : (
                        <span className="italic text-[#9a8d7e] text-[12px]">
                          Select commencement date
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 1C. Daily Commencement Time & Officiating Scholar Team */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {/* Daily Muhurta Selection */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#29231B]">
                      Daily Muhurta / Start Time <span className="text-red-500">*</span>
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

                  {/* Officiating Scholar Team Badge (Authoritative Package Inclusion) */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#29231B]">
                      Officiating Vedic Purohit Team
                    </label>
                    <div className="mt-1.5 flex h-[38px] items-center justify-between rounded-lg border border-[#EAD8B8] bg-[#FFFAF0] px-3 text-[12.5px] text-[#29231B]">
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-[#B7791F] shrink-0" />
                        <span className="font-semibold text-[#29231B]">
                          {currentTierPandits} Learned Scholars
                        </span>
                      </div>
                      <span className="rounded-full bg-[#FFF5E5] px-2 py-0.5 text-[10.5px] font-bold text-[#B7791F]">
                        Package Included
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: SACRED VENUE COORDINATION */}
            <section
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
              data-error-field={errors.arrangementMode || errors.address || errors.city ? "venue" : undefined}
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF5E5] text-[11px] font-bold text-[#B7791F]">
                    2
                  </span>
                  <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                    Sacred Ceremony Venue
                  </h2>
                </div>
                <span className="rounded-full bg-[#FFF5E5] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#B7791F]">
                  Required
                </span>
              </div>

              <div className="mt-4 space-y-4">
                {/* Venue Mode Cards */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {supportedModes.map((modeKey) => {
                    const meta = ARRANGEMENT_MODE_LABELS[modeKey] || {
                      title: modeKey,
                      desc: "Consecrated ceremony venue",
                      badge: "Vedic",
                      icon: Sparkles,
                    };
                    const IconComp = meta.icon;
                    const isSelected = currentMode === modeKey;

                    return (
                      <button
                        key={modeKey}
                        type="button"
                        onClick={() => handleArrangementSelect(modeKey)}
                        className={`flex flex-col justify-between rounded-lg p-3 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-2 border-[#D99A20] bg-[#FFF5E5]/70 shadow-xs ring-1 ring-[#D99A20]/20"
                            : "border border-[#EAD8B8] bg-white hover:border-[#D8C3A1]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <IconComp size={14} className={isSelected ? "text-[#D99A20]" : "text-[#766D60]"} />
                              <span className="font-serif text-[13.5px] font-bold text-[#29231B]">
                                {meta.title}
                              </span>
                            </div>
                            {isSelected ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D99A20] text-white text-[10px] font-bold">
                                ✓
                              </span>
                            ) : (
                              <span className="h-3.5 w-3.5 rounded-full border border-[#D8C3A1]" />
                            )}
                          </div>
                          <p className="mt-1 text-[11px] text-[#766D60] leading-snug">
                            {meta.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Conditional Address Drawer for Home / Mandir / Custom Venue */}
                {requiresPhysicalAddress ? (
                  <div className="rounded-lg border border-[#EAD8B8] bg-[#FFFAF0]/80 p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#29231B]">
                      <MapPin size={13} className="text-[#B7791F]" />
                      <span>
                        {currentMode === "temple"
                          ? "Temple Mandir Name & Address Details"
                          : "Venue Address Coordinates"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[11.5px] font-medium text-[#766D60]">
                          Street Address / House / Landmark <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 108 Shanti Kunj, Near Shiva Temple, Shivpur"
                          value={locationDetails.address || ""}
                          onChange={(e) => updateLocationDetails({ address: e.target.value })}
                          className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-[12.5px] text-[#29231B] focus:outline-none focus:ring-1 ${
                            errors.address
                              ? "border-red-400 focus:ring-red-400"
                              : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                          }`}
                        />
                        {errors.address && (
                          <p className="mt-1 text-[11px] text-red-600">{errors.address}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11.5px] font-medium text-[#766D60]">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Varanasi, Lucknow, Delhi"
                          value={locationDetails.city || ""}
                          onChange={(e) => updateLocationDetails({ city: e.target.value })}
                          className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-[12.5px] text-[#29231B] focus:outline-none focus:ring-1 ${
                            errors.city
                              ? "border-red-400 focus:ring-red-400"
                              : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                          }`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-[11px] text-red-600">{errors.city}</p>
                        )}
                      </div>

                      {currentMode !== "temple" && (
                        <div>
                          <label className="block text-[11.5px] font-medium text-[#766D60]">
                            Postal Pincode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="6-digit pincode"
                            value={locationDetails.pincode || ""}
                            onChange={(e) => updateLocationDetails({ pincode: e.target.value })}
                            className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-[12.5px] text-[#29231B] focus:outline-none focus:ring-1 ${
                              errors.pincode
                                ? "border-red-400 focus:ring-red-400"
                                : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                            }`}
                          />
                          {errors.pincode && (
                            <p className="mt-1 text-[11px] text-red-600">{errors.pincode}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-[#EAD8B8] bg-[#FFFAF0]/50 p-3 text-[12px] text-[#766D60] flex items-center gap-2">
                    <Check size={14} className="text-[#2e7d32] shrink-0" />
                    <span>
                      {currentMode === "remote"
                        ? "Remote coordination. Live stream telecast and Gotra chanting link will be shared. No physical venue address required."
                        : currentMode === "kashi"
                        ? "Ceremony will be performed at consecrated Yajnashalas in Varanasi. Devotees may attend in person or receive live telecast."
                        : "Ceremony will be hosted at Veda Structure Consecrated Sanctuary."}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 3: YAJMAN DETAILS */}
            <section
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
              data-error-field={errors.name || errors.mobile || errors.email ? "yajman" : undefined}
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF5E5] text-[11px] font-bold text-[#B7791F]">
                    3
                  </span>
                  <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                    Primary Devotee (Yajman)
                  </h2>
                </div>
                <span className="rounded-full bg-[#FFF5E5] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#B7791F]">
                  Required
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#29231B]">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Chandra Sharma"
                      value={yajmanDetails.name || ""}
                      onChange={(e) => updateYajmanDetails({ name: e.target.value })}
                      className={`mt-1.5 w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-[#29231B] transition focus:outline-none focus:ring-1 ${
                        errors.name
                          ? "border-red-400 focus:ring-red-400"
                          : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 flex items-center gap-1 text-[11.5px] text-red-600">
                        <AlertCircle size={12} /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Mobile / WhatsApp */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#29231B]">
                      WhatsApp / Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={yajmanDetails.mobile || ""}
                      onChange={(e) => updateYajmanDetails({ mobile: e.target.value })}
                      className={`mt-1.5 w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-[#29231B] transition focus:outline-none focus:ring-1 ${
                        errors.mobile
                          ? "border-red-400 focus:ring-red-400"
                          : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                      }`}
                    />
                    {errors.mobile && (
                      <p className="mt-1 flex items-center gap-1 text-[11.5px] text-red-600">
                        <AlertCircle size={12} /> {errors.mobile}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-semibold text-[#29231B]">
                      Email Address <span className="text-[11px] font-normal text-[#766D60]">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. devotee@example.com (for receipts & recordings)"
                      value={yajmanDetails.email || ""}
                      onChange={(e) => updateYajmanDetails({ email: e.target.value })}
                      className={`mt-1.5 w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-[#29231B] transition focus:outline-none focus:ring-1 ${
                        errors.email
                          ? "border-red-400 focus:ring-red-400"
                          : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 flex items-center gap-1 text-[11.5px] text-red-600">
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Collapsible Gotra & Astrological Details */}
                <div className="pt-2 border-t border-[#F0E4D2]">
                  <button
                    type="button"
                    onClick={() => setIsAstrologyOpen(!isAstrologyOpen)}
                    className="flex w-full items-center justify-between py-1 text-left text-[12.5px] font-semibold text-[#B7791F] hover:text-[#8C571C] transition cursor-pointer"
                  >
                    <span>+ Add Gotra, Rashi, Nakshatra & Birth Details (Optional)</span>
                    {isAstrologyOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {isAstrologyOpen && (
                    <div className="mt-3 rounded-lg border border-[#EAD8B8] bg-[#FFFAF0]/70 p-3.5 space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {/* Gotra */}
                        <div>
                          <div className="flex items-center justify-between">
                            <label className="text-[11.5px] font-medium text-[#766D60]">Gotra</label>
                            <label className="flex items-center gap-1 text-[10.5px] text-[#766D60] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={yajmanDetails.gotra === "Unknown"}
                                onChange={(e) => handleUnknownGotraToggle(e.target.checked)}
                                className="h-3 w-3 rounded text-[#D99A20]"
                              />
                              <span>Unknown</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. Kashyapa, Bharadwaj"
                            disabled={yajmanDetails.gotra === "Unknown"}
                            value={yajmanDetails.gotra === "Unknown" ? "Kashyapa (Pramana)" : yajmanDetails.gotra || ""}
                            onChange={(e) => updateYajmanDetails({ gotra: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B] disabled:bg-gray-100"
                          />
                        </div>

                        {/* Rashi */}
                        <div>
                          <label className="text-[11.5px] font-medium text-[#766D60]">Moon Sign (Rashi)</label>
                          <select
                            value={yajmanDetails.rashi || ""}
                            onChange={(e) => updateYajmanDetails({ rashi: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B]"
                          >
                            <option value="">— Select Rashi —</option>
                            {VEDIC_RASHIS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Nakshatra */}
                        <div>
                          <label className="text-[11.5px] font-medium text-[#766D60]">Birth Star (Nakshatra)</label>
                          <select
                            value={yajmanDetails.nakshatra || ""}
                            onChange={(e) => updateYajmanDetails({ nakshatra: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B]"
                          >
                            <option value="">— Select Nakshatra —</option>
                            {VEDIC_NAKSHATRAS.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                          <label className="text-[11.5px] font-medium text-[#766D60]">Date of Birth</label>
                          <input
                            type="date"
                            value={yajmanDetails.dob || ""}
                            onChange={(e) => updateYajmanDetails({ dob: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B]"
                          />
                        </div>

                        {/* Father's Name */}
                        <div>
                          <label className="text-[11.5px] font-medium text-[#766D60]">Father's Name</label>
                          <input
                            type="text"
                            placeholder="Father's name"
                            value={yajmanDetails.fatherName || ""}
                            onChange={(e) => updateYajmanDetails({ fatherName: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B]"
                          />
                        </div>

                        {/* Spouse Name */}
                        <div>
                          <label className="text-[11.5px] font-medium text-[#766D60]">Spouse's Name</label>
                          <input
                            type="text"
                            placeholder="Spouse's name"
                            value={yajmanDetails.spouseName || ""}
                            onChange={(e) => updateYajmanDetails({ spouseName: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* SECTION 4: SANKALP & SACRED PRAYER */}
            <section
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
              data-error-field={errors.mainIntention ? "sankalp" : undefined}
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF5E5] text-[11px] font-bold text-[#B7791F]">
                    4
                  </span>
                  <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                    Sacred Sankalp & Prayer
                  </h2>
                </div>
                <span className="rounded-full bg-[#FFF5E5] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#B7791F]">
                  Required
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                {/* 4A. Main Sankalp Intention */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#29231B]">
                    Primary Sankalp Intention <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Health, removal of obstacles, family harmony, or prosperity"
                    value={sankalpDetails.mainIntention || ""}
                    onChange={(e) => updateSankalpDetails({ mainIntention: e.target.value })}
                    className={`mt-1.5 w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-[#29231B] transition focus:outline-none focus:ring-1 ${
                      errors.mainIntention
                        ? "border-red-400 focus:ring-red-400"
                        : "border-[#EAD8B8] focus:border-[#D99A20] focus:ring-[#D99A20]"
                    }`}
                  />

                  {/* Suggestion Chips */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {INTENTION_SUGGESTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => updateSankalpDetails({ mainIntention: item })}
                        className="rounded-md border border-[#EAD8B8] bg-[#FFFAF0] px-2 py-0.5 text-[11px] font-medium text-[#766D60] hover:border-[#D99A20] hover:text-[#29231B] transition cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  {errors.mainIntention && (
                    <p className="mt-1 flex items-center gap-1 text-[11.5px] text-red-600">
                      <AlertCircle size={12} /> {errors.mainIntention}
                    </p>
                  )}
                </div>

                {/* 4B. Personal Prayer */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#29231B]">
                    Specific Devotee Prayer Words{" "}
                    <span className="text-[11px] font-normal text-[#766D60]">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="State your personal prayer in your own words. Presiding Acharyas will recite this during daily Ahutis."
                    value={sankalpDetails.specificSankalp || ""}
                    onChange={(e) => updateSankalpDetails({ specificSankalp: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-[#EAD8B8] bg-white p-2.5 text-[12.5px] text-[#29231B] focus:border-[#D99A20] focus:outline-none focus:ring-1 focus:ring-[#D99A20]"
                  />
                </div>

                {/* Optional Collapsible Special Instructions */}
                <div className="pt-2 border-t border-[#F0E4D2]">
                  <button
                    type="button"
                    onClick={() => setIsSpecialInstructionsOpen(!isSpecialInstructionsOpen)}
                    className="flex w-full items-center justify-between py-1 text-left text-[12.5px] font-semibold text-[#B7791F] hover:text-[#8C571C] transition cursor-pointer"
                  >
                    <span>+ Add Special Requests or Pandit Instructions (Optional)</span>
                    {isSpecialInstructionsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {isSpecialInstructionsOpen && (
                    <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <div>
                        <label className="text-[11.5px] font-medium text-[#766D60]">
                          Special Deity / Archana Focus
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Dedicated Bilva Patra Ahutis"
                          value={sankalpDetails.specialRequest || ""}
                          onChange={(e) => updateSankalpDetails({ specialRequest: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B]"
                        />
                      </div>
                      <div>
                        <label className="text-[11.5px] font-medium text-[#766D60]">
                          Seating or Pandit Coordination Note
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Chair arrangement for elder, Hindi commentary"
                          value={sankalpDetails.specialInstructions || ""}
                          onChange={(e) =>
                            updateSankalpDetails({ specialInstructions: e.target.value })
                          }
                          className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* SECTION 5: FAMILY MEMBERS (CO-YAJMANS) */}
            <section className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF5E5] text-[11px] font-bold text-[#B7791F]">
                    5
                  </span>
                  <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                    Family Members & Co-Yajmans
                  </h2>
                </div>
                <span className="rounded-full bg-[#FFFAF0] border border-[#EAD8B8] px-2.5 py-0.5 text-[10.5px] font-medium text-[#766D60]">
                  Optional
                </span>
              </div>

              <div className="mt-3.5 space-y-3">
                {/* Member List */}
                {familyMembers && familyMembers.length > 0 ? (
                  <div className="space-y-2">
                    {familyMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-[#EAD8B8] bg-[#FFFAF0]/50 p-2.5 text-[12.5px]"
                      >
                        <div>
                          <span className="font-semibold text-[#29231B]">{member.name}</span>
                          <span className="ml-2 text-[11px] text-[#766D60]">
                            ({member.relation || "Family"} • {member.gender || "Member"})
                          </span>
                          {member.gotra && (
                            <span className="ml-2 text-[10.5px] text-[#B7791F]">
                              Gotra: {member.gotra}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEditMember(idx)}
                            className="text-[#766D60] hover:text-[#B7791F] transition p-1 cursor-pointer"
                            title="Edit member"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFamilyMember(idx)}
                            className="text-[#766D60] hover:text-red-500 transition p-1 cursor-pointer"
                            title="Remove member"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-[#766D60]">
                    Include family members in the daily Sankalp recitations (optional).
                  </p>
                )}

                {/* Add / Edit Member Drawer */}
                {editingMemberIdx !== null ? (
                  <div className="rounded-lg border border-[#EAD8B8] bg-[#FFFAF0]/80 p-3 space-y-2.5">
                    <p className="text-[12px] font-semibold text-[#29231B]">
                      {editingMemberIdx === "new" ? "Add Family Member" : "Edit Family Member"}
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Member Full Name *"
                          value={memberFormData.name}
                          onChange={(e) => {
                            setMemberFormData((p) => ({ ...p, name: e.target.value }));
                            if (memberFormError) setMemberFormError("");
                          }}
                          className={`w-full rounded-lg border bg-white px-2.5 py-1.5 text-[12px] text-[#29231B] ${
                            memberFormError ? "border-red-400 focus:border-red-500" : "border-[#EAD8B8]"
                          }`}
                        />
                        {memberFormError && (
                          <p className="mt-1 text-[10.5px] text-red-600">{memberFormError}</p>
                        )}
                      </div>
                      <div>
                        <select
                          value={memberFormData.relation}
                          onChange={(e) =>
                            setMemberFormData((p) => ({ ...p, relation: e.target.value }))
                          }
                          className="w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px]"
                        >
                          {FAMILY_RELATIONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Gotra (optional)"
                          value={memberFormData.gotra}
                          onChange={(e) =>
                            setMemberFormData((p) => ({ ...p, gotra: e.target.value }))
                          }
                          className="w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCancelMemberForm}
                        className="rounded-lg border border-[#EAD8B8] bg-white px-3 py-1 text-[11.5px] font-medium text-[#766D60] hover:bg-gray-50 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveMember}
                        className="rounded-lg bg-[#D99A20] px-3.5 py-1 text-[11.5px] font-bold text-white shadow-2xs hover:bg-[#B7791F] transition cursor-pointer"
                      >
                        {editingMemberIdx === "new" ? "Save Member" : "Update Member"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenAddMember}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#D8C3A1] bg-[#FFFAF0] px-3 py-1.5 text-[11.5px] font-semibold text-[#B7791F] hover:bg-[#FFF5E5] transition cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>+ Add Family Member</span>
                  </button>
                )}
              </div>
            </section>

            {/* SECTION 6: INCLUDED SHASTRIC SAMAGRI & CEREMONY RITES */}
            <section className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF5E5] text-[11px] font-bold text-[#B7791F]">
                    6
                  </span>
                  <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                    Sacred Samagri & Inclusions
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10.5px] font-semibold text-emerald-800">
                  Fully Included
                </span>
              </div>

              <div className="mt-3.5 space-y-2.5 text-[12px] text-[#766D60]">
                <p>
                  Every Veda Structure Yagya is an authentic Shastric anushthan conducted with uncompromised ritual purity. All necessary items are fully covered by the package Dakshina:
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-1">
                  <div className="flex items-center gap-2 rounded-lg bg-[#FFFAF0] p-2 border border-[#EAD8B8]">
                    <Check size={14} className="text-[#2e7d32] shrink-0" />
                    <span>Pure Desi Gir Cow Bilona Ghee</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-[#FFFAF0] p-2 border border-[#EAD8B8]">
                    <Check size={14} className="text-[#2e7d32] shrink-0" />
                    <span>Consecrated Samidha Wood & Homa Dravyas</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-[#FFFAF0] p-2 border border-[#EAD8B8]">
                    <Check size={14} className="text-[#2e7d32] shrink-0" />
                    <span>Learned Vedic Acharya Team Dakshina</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-[#FFFAF0] p-2 border border-[#EAD8B8]">
                    <Check size={14} className="text-[#2e7d32] shrink-0" />
                    <span>Consecrated Maha Prasad Shipped to Home</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: STICKY DESKTOP ORDER SUMMARY (30-35% width)
          ========================================================================== */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-4 self-start">
            <div className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs max-h-[calc(100vh-2rem)] overflow-y-auto">
              {/* Compact Thumbnail Hero */}
              <div className="relative h-28 w-full overflow-hidden rounded-lg bg-[#F8EDD8]">
                <img
                  src={primaryImg}
                  alt={service?.name || "Yagya Ritual"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                  <p className="font-serif text-[14px] font-bold leading-tight truncate">
                    {service?.name || "Vedic Yagya"}
                  </p>
                  <p className="text-[10px] text-amber-200">
                    {selectedDays}-Day Sacred Anushthan
                  </p>
                </div>
              </div>

              {/* Ceremony Details Breakdown */}
              <div className="mt-3.5 space-y-2 border-b border-[#F0E4D2] pb-3 text-[12px]">
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Duration:</span>
                  <span className="font-semibold text-[#29231B]">
                    {selectedDays} Days ({selectedDays * dailyHours} Total Hrs)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Commencement:</span>
                  <span className="font-semibold text-[#29231B]">
                    {configuration.bookingDate ? formatFriendlyDate(configuration.bookingDate) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Maha Purnahuti:</span>
                  <span className="font-semibold text-[#2e7d32]">
                    {configuration.completionDate
                      ? formatFriendlyDate(configuration.completionDate)
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Daily Time:</span>
                  <span className="font-semibold text-[#29231B]">
                    {configuration.bookingTime || "06:00 AM"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Purohit Team:</span>
                  <span className="font-semibold text-[#29231B]">
                    {currentTierPandits} Scholars
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Sacred Venue:</span>
                  <span className="font-semibold text-[#29231B] text-right truncate max-w-[150px]">
                    {ARRANGEMENT_MODE_LABELS[currentMode]?.title || currentMode}
                  </span>
                </div>
              </div>

              {/* Authoritative Price Calculation Status */}
              <div className="mt-3">
                {isCalculatingPrice ? (
                  <div className="flex items-center justify-center gap-1.5 py-3 text-[12px] text-[#B7791F]">
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Verifying authoritative Dakshina...</span>
                  </div>
                ) : priceError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-[11.5px] text-red-700">
                    <p className="font-semibold">Calculation Notice</p>
                    <p className="mt-0.5">{priceError}</p>
                    <button
                      type="button"
                      onClick={() => calculatePrice()}
                      className="mt-1 font-bold underline cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-[12px]">
                    <div className="flex items-center justify-between text-[#766D60]">
                      <span>{selectedDays}-Day Package Dakshina:</span>
                      <span className="font-medium text-[#29231B]">
                        ₹{Number(totalDakshina).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#766D60]">
                      <span>Samagri & Travel:</span>
                      <span className="font-medium text-emerald-700">Included</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Total Dakshina Callout */}
              <div className="mt-3.5 border-t border-[#F0E4D2] pt-3 flex items-baseline justify-between">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#766D60]">
                    Total Sacred Dakshina
                  </span>
                  <span className="text-[10px] text-[#766D60]">All inclusions covered</span>
                </div>
                <span className="font-serif text-[22px] font-bold text-[#B7791F]">
                  ₹{Number(totalDakshina).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Submission / Payment Error Notices */}
              {submissionError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-[11.5px] text-red-700">
                  <p className="font-semibold">Booking Creation Notice</p>
                  <p className="mt-0.5">{submissionError}</p>
                </div>
              )}

              {paymentError && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11.5px] text-amber-800">
                  <p className="font-semibold">Payment Notice</p>
                  <p className="mt-0.5">{paymentError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={initiateBookingAndPayment}
                  disabled={isSubmitting || isOpeningPayment || isCalculatingPrice || !!priceError}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D99A20] via-[#E2A62C] to-[#B7791F] py-3 text-[13.5px] font-bold text-white shadow-md hover:brightness-105 active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Creating sacred booking...</span>
                    </>
                  ) : isOpeningPayment ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Opening Cashfree Checkout...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>
                        {bookingReference ? "Retry Secure Dakshina" : "Proceed to Secure Dakshina"}
                      </span>
                    </>
                  )}
                </button>

                {bookingReference && (
                  <button
                    type="button"
                    onClick={checkPaymentStatus}
                    className="w-full rounded-full border border-[#EAD8B8] bg-[#FFFAF0] py-2 text-[12px] font-semibold text-[#766D60] hover:text-[#29231B] transition cursor-pointer"
                  >
                    Check Payment Status ({bookingReference})
                  </button>
                )}
              </div>

              {/* Reassurance Footer */}
              <div className="mt-3 text-center text-[10.5px] text-[#766D60] space-y-0.5">
                <p>256-Bit SSL Encrypted • Powered by Cashfree</p>
                <p>Rigorous Shastric Vidhi • Verified Vedic Acharyas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE STICKY BOTTOM BAR (Fixed at bottom on screens < lg)
      ========================================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#EAD8B8] bg-white/95 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[600px] items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#766D60]">
              Total Dakshina ({selectedDays} Days)
            </span>
            <span className="font-serif text-[18px] font-bold text-[#B7791F]">
              ₹{Number(totalDakshina).toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="button"
            onClick={initiateBookingAndPayment}
            disabled={isSubmitting || isOpeningPayment || isCalculatingPrice || !!priceError}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D99A20] via-[#E2A62C] to-[#B7791F] px-5 py-2.5 text-[12.5px] font-bold text-white shadow-sm hover:brightness-105 active:scale-98 transition disabled:opacity-50 cursor-pointer"
          >
            <Lock size={12} />
            <span>{bookingReference ? "Retry Dakshina" : "Proceed to Dakshina"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default YagyaSinglePageBooking;

