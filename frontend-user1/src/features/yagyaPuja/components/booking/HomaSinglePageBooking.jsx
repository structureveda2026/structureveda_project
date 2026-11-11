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
} from "lucide-react";
import {
  useRitualBooking,
  VEDIC_RASHIS,
  VEDIC_NAKSHATRAS,
  FAMILY_RELATIONS,
} from "../../context/RitualBookingContext";
import cardYagyaFireImg from "../../../../assets/images/library/cards/card-yagya-fire.jpg";

const ARRANGEMENT_MODE_LABELS = {
  kashi: {
    title: "Kashi Sacred Shrines & Ghats (Varanasi)",
    desc: "Sacred fire altar ignited along the sacred Ganga ghats and consecrated Varanasi temples by initiated Vedic Acharyas.",
    badge: "Kashi Sanctum",
    icon: Flame,
  },
  remote: {
    title: "Remote Sankalpa (Live Audio/Video)",
    desc: "Live stream telecast with personal Gotra Sankalpa recitation and energized Homa Bhasma dispatch to your home.",
    badge: "Online & Global",
    icon: Video,
  },
  customer_home: {
    title: "At Devotee Residence / Premises",
    desc: "Initiated Vedic priests arrive at your venue with complete traditional Homa Kunda setup and samagri.",
    badge: "Personal Venue",
    icon: Home,
  },
  temple: {
    title: "Consecrated Mandir",
    desc: "Conducted in a consecrated temple sanctum adhering to strict Agamic fire protocols.",
    badge: "Temple Sanctum",
    icon: MapPin,
  },
  veda_structure: {
    title: "Veda Structure Consecrated Centre",
    desc: "Arranged inside our dedicated Vedic sanctuary with authentic acoustic chanting halls.",
    badge: "Veda Centre",
    icon: Building,
  },
  other: {
    title: "Other Sacred Venue",
    desc: "Coordinated at an auspicious Tirtha or ancestral venue according to classical tradition.",
    badge: "Custom",
    icon: MapPin,
  },
};

const TIME_PRESETS = [
  { label: "06:00 AM", desc: "Brahma Muhurta (06:00 AM - Most Auspicious)" },
  { label: "08:30 AM", desc: "Pratah Kalin (08:30 AM - Morning Fire Offering)" },
  { label: "11:00 AM", desc: "Madhyahna (11:00 AM - Noon Ahuti)" },
  { label: "05:30 PM", desc: "Sayankalin (05:30 PM - Evening Fire Ritual)" },
  { label: "07:30 PM", desc: "Sandhya Purnahuti (07:30 PM - Final Ahuti)" },
];

const INTENTION_SUGGESTIONS = [
  "Ayushya & Health Restoration (आरोग्य व दीर्घायु)",
  "Removal of Negative Energies & Evil Eye (शत्रु व विघ्न बाधा निवारण)",
  "Prosperity, Lakshmi & Business Growth (धन-धान्य व कार्य सिद्धि)",
  "Planetary & Graha Dosha Shanti (नवग्रह व वास्तु शांति)",
  "Family Protection & Harmony (गृह शांति व कुल रक्षा)",
  "Spiritual Purity & Karmic Cleansing (आत्म शुद्धि व मोक्ष)",
];

/**
 * Calculates Homa completion date (commencement date + days - 1)
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

const HomaSinglePageBooking = () => {
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
    errors,
    initiateBookingAndPayment,
  } = useRitualBooking();

  // Accordion toggles
  const [isAstrologyOpen, setIsAstrologyOpen] = useState(false);
  const [isSpecialInstructionsOpen, setIsSpecialInstructionsOpen] = useState(false);
  const [editingMemberIdx, setEditingMemberIdx] = useState(null);
  const [memberFormData, setMemberFormData] = useState({
    name: "",
    relation: "Spouse",
    gender: "Female",
    gotra: "",
  });
  const [memberFormError, setMemberFormError] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);

  // 1. Available Havan Counts
  const availableHavanCounts = useMemo(() => {
    if (Array.isArray(service?.availableHavanCounts) && service.availableHavanCounts.length > 0) {
      return service.availableHavanCounts
        .map((v) => (v === "custom" || v === "Custom" ? "custom" : Number(v)))
        .filter((n) => n === "custom" || (!isNaN(n) && n > 0));
    }
    return [1];
  }, [service]);

  const activeHavanCount = useMemo(() => {
    if (configuration.havanCount && availableHavanCounts.includes(configuration.havanCount)) {
      return configuration.havanCount;
    }
    return availableHavanCounts[0] || 1;
  }, [configuration.havanCount, availableHavanCounts]);

  // Coupling constraint: 1 Havan implies exactly 1 Day
  const isSingleHavan = Number(activeHavanCount) === 1;

  // 2. Available Days
  const availableDays = useMemo(() => {
    if (Array.isArray(service?.availableDays) && service.availableDays.length > 0) {
      return service.availableDays.map(Number).filter((n) => !isNaN(n) && n > 0);
    }
    return [1];
  }, [service]);

  const activeDays = useMemo(() => {
    if (isSingleHavan) return 1;
    const current = Number(configuration.days);
    if (current && availableDays.includes(current)) {
      return current;
    }
    return availableDays[0] || 1;
  }, [isSingleHavan, configuration.days, availableDays]);

  // 3. Pandit Constraints
  const minPandits = useMemo(() => {
    return Number(service?.minimumPandits || 2);
  }, [service]);

  const recommendedPandits = useMemo(() => {
    return Number(service?.recommendedPandits || minPandits || 3);
  }, [service, minPandits]);

  const maxPandits = useMemo(() => {
    return Number(service?.maximumPandits || 11);
  }, [service]);

  const activePanditCount = useMemo(() => {
    const current = Number(configuration.panditCount);
    if (!isNaN(current) && current >= minPandits && current <= maxPandits) {
      return current;
    }
    return recommendedPandits;
  }, [configuration.panditCount, minPandits, maxPandits, recommendedPandits]);

  const panditOptions = useMemo(() => {
    const list = [];
    for (let i = minPandits; i <= maxPandits; i++) {
      list.push(i);
    }
    return list;
  }, [minPandits, maxPandits]);

  // 4. Derived Completion Date
  const displayCompletionDate = useMemo(() => {
    if (priceBreakdown?.completionDate) return priceBreakdown.completionDate;
    return calculateCompletionDate(configuration.bookingDate, activeDays);
  }, [priceBreakdown?.completionDate, configuration.bookingDate, activeDays]);

  // 5. Supported Arrangement Modes
  const supportedModes = useMemo(() => {
    const list = [];
    if (service?.isKashiAvailable !== false) list.push("kashi");
    if (service?.isRemoteAvailable !== false) list.push("remote");
    return list.length > 0 ? list : ["kashi", "remote"];
  }, [service]);

  const currentMode = configuration.arrangementMode || configuration.locationType || supportedModes[0] || "kashi";
  const requiresPhysicalAddress = currentMode === "customer_home" || currentMode === "temple" || currentMode === "other";

  // Trigger price calculation when configuration changes
  useEffect(() => {
    if (!service?.id) return;
    calculatePrice({
      serviceId: service.id,
      serviceSlug: service.slug,
      serviceType: "HOMA",
      havanCount: activeHavanCount,
      days: activeDays,
      durationDays: activeDays,
      panditCount: activePanditCount,
      commencementDate: configuration.bookingDate || undefined,
      bookingDate: configuration.bookingDate || undefined,
      arrangementMode: currentMode,
      locationType: currentMode,
    });
  }, [
    service?.id,
    service?.slug,
    activeHavanCount,
    activeDays,
    activePanditCount,
    configuration.bookingDate,
    currentMode,
    calculatePrice,
  ]);

  // Handlers with strict coupling enforcement
  const handleHavanSelect = (hCount) => {
    const isNowSingle = Number(hCount) === 1;
    const newDays = isNowSingle ? 1 : activeDays > 1 ? activeDays : availableDays.find((d) => d > 1) || 1;
    const newCompletion = calculateCompletionDate(configuration.bookingDate, newDays);

    updateConfiguration({
      havanCount: hCount,
      days: newDays,
      durationDays: newDays,
      completionDate: newCompletion,
      durationSelected: `${hCount} Havan${Number(hCount) > 1 ? "s" : ""}, ${newDays} Day(s)`,
    });
  };

  const handleDaysSelect = (dCount) => {
    const num = Number(dCount);
    // If selecting multi-day, ensure havanCount is at least 3 (or the next available multi-havan count)
    let newHavanCount = activeHavanCount;
    if (num > 1 && Number(activeHavanCount) === 1) {
      const multiHavan = availableHavanCounts.find((h) => Number(h) > 1);
      if (multiHavan) {
        newHavanCount = multiHavan;
      }
    }
    const newCompletion = calculateCompletionDate(configuration.bookingDate, num);

    updateConfiguration({
      days: num,
      durationDays: num,
      havanCount: newHavanCount,
      completionDate: newCompletion,
      durationSelected: `${newHavanCount} Havan${Number(newHavanCount) > 1 ? "s" : ""}, ${num} Day(s)`,
    });
  };

  const handlePanditSelect = (pCount) => {
    updateConfiguration({
      panditCount: Number(pCount),
    });
  };

  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    const newCompletion = calculateCompletionDate(dateVal, activeDays);
    updateConfiguration({
      bookingDate: dateVal,
      commencementDate: dateVal,
      completionDate: newCompletion,
    });
  };

  const handleTimePresetChange = (timeLabel) => {
    updateConfiguration({
      bookingTime: timeLabel,
      timeSlot: timeLabel,
    });
  };

  const handleModeChange = (modeKey) => {
    updateConfiguration({
      arrangementMode: modeKey,
      locationType: modeKey,
    });
  };

  const handleUnknownGotraToggle = (checked) => {
    updateYajmanDetails({
      gotra: checked ? "Unknown" : "",
    });
  };

  const handleOpenAddMember = () => {
    setMemberFormData({
      name: "",
      relation: "Spouse",
      gender: "Female",
      gotra: yajmanDetails?.gotra && yajmanDetails.gotra !== "Unknown" ? yajmanDetails.gotra : "",
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
    };

    if (editingMemberIdx === "new") {
      addFamilyMember(memberPayload);
    } else if (typeof editingMemberIdx === "number" && editingMemberIdx >= 0) {
      updateFamilyMember(editingMemberIdx, memberPayload);
    } else {
      addFamilyMember(memberPayload);
    }

    setMemberFormData({ name: "", relation: "Spouse", gender: "Female", gotra: "" });
    setEditingMemberIdx(null);
  };

  const handleCancelMemberForm = () => {
    setMemberFormData({ name: "", relation: "Spouse", gender: "Female", gotra: "" });
    setMemberFormError("");
    setEditingMemberIdx(null);
  };

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Display Amount from backend breakdown or formula
  const finalAmount = useMemo(() => {
    if (priceBreakdown?.totalAmount != null) return priceBreakdown.totalAmount;
    if (priceBreakdown?.calculatedAmount != null) return priceBreakdown.calculatedAmount;
    const base = Number(service?.basePrice || 0);
    const perHavan = Number(service?.perHavanPrice || 0);
    const perDay = Number(service?.perDayPrice || 0);
    const hNum = Number(activeHavanCount) || 1;
    const dNum = Number(activeDays) || 1;
    return base + (hNum - 1) * perHavan + (dNum - 1) * perDay;
  }, [priceBreakdown, service, activeHavanCount, activeDays]);

  const primaryImg =
    service?.bannerImage || service?.image || cardYagyaFireImg;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#29231B] pb-24 sm:pb-16">
      {/* =========================================================================
          TOP BREADCRUMB & HEADER BAR
      ========================================================================== */}
      <header className="border-b border-[#F0E4D2] bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={service?.slug ? `/yagya-puja/homa/${service.slug}` : "/yagya-puja"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#EAD8B8] bg-[#FFFAF0] text-[#766D60] hover:bg-[#F8EDD8] hover:text-[#29231B] transition"
              title="Return to Service Details"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#B7791F]">
                  Sacred Homa / Havan
                </span>
                <span className="text-[#C4B59F]">•</span>
                <span className="text-[11px] text-[#766D60]">Vedic Fire Oblation</span>
              </div>
              <h1 className="font-serif text-[17px] sm:text-[19px] font-bold text-[#29231B] leading-tight">
                {service?.name || "Sacred Homa Ceremony"}
              </h1>
            </div>
          </div>

          {/* Quick Price Pill */}
          <div className="hidden sm:flex items-center gap-3 border-l border-[#F0E4D2] pl-4">
            <div className="text-right">
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-[#766D60]">
                Authoritative Dakshina
              </span>
              <span className="font-serif text-[18px] font-bold text-[#B7791F]">
                {isCalculatingPrice ? (
                  <RefreshCw size={14} className="inline animate-spin text-[#B7791F]" />
                ) : (
                  `₹${Number(finalAmount).toLocaleString("en-IN")}`
                )}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTAINER: 2-COLUMN AIRBNB-STYLE LAYOUT
      ========================================================================== */}
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* =========================================================================
              LEFT COLUMN: MAIN BOOKING FORM SECTIONS (65-70% width)
          ========================================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* Price Error Banner */}
            {priceError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[12.5px] text-red-700 flex items-start gap-2.5">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                <div>
                  <p className="font-semibold">Authoritative Pricing Update Needed</p>
                  <p className="mt-0.5 text-red-600">{priceError}</p>
                </div>
              </div>
            )}

            {/* Submission Error Banner */}
            {(submissionError || paymentError) && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[12.5px] text-red-700 flex items-start gap-2.5">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                <div>
                  <p className="font-semibold">Unable to Process Reservation</p>
                  <p className="mt-0.5 text-red-600">{submissionError || paymentError}</p>
                </div>
              </div>
            )}

            {/* SECTION 1: HAVAN COUNT, DURATION & SQUAD */}
            <section
              data-error-field="havanCount"
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF5E5] text-[11px] font-bold text-[#B7791F]">
                    1
                  </span>
                  <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                    Havan Offerings & Ceremony Schedule
                  </h2>
                </div>
                <span className="rounded-full bg-[#FFFAF0] border border-[#EAD8B8] px-2.5 py-0.5 text-[10.5px] font-medium text-[#766D60]">
                  Vedic Ahuti Protocols
                </span>
              </div>

              {/* Havan Count Cards */}
              <div className="mt-4">
                <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#766D60] mb-2">
                  Select Number of Havans
                </label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {availableHavanCounts.map((hCount) => {
                    const isSelected = activeHavanCount === hCount;
                    return (
                      <button
                        key={hCount}
                        type="button"
                        onClick={() => handleHavanSelect(hCount)}
                        className={`relative flex flex-col justify-between rounded-xl border p-3 text-left transition cursor-pointer ${
                          isSelected
                            ? "border-[#D99A20] bg-[#FFFBF0] shadow-xs ring-1.5 ring-[#D99A20]"
                            : "border-[#EAD8B8] bg-white hover:border-[#D8C3A1] hover:bg-[#FFFAF0]/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-[15px] font-bold text-[#29231B]">
                            {hCount === "custom" ? "Custom Havan" : `${hCount} Havan${Number(hCount) > 1 ? "s" : ""}`}
                          </span>
                          {isSelected && (
                            <CheckCircle2 size={14} className="text-[#D99A20]" />
                          )}
                        </div>
                        <span className="mt-1 text-[11px] text-[#766D60]">
                          {Number(hCount) === 1 ? "Single Day Ahuti" : "Multi-Cycle Fire Ritual"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.havanCount && (
                  <p className="mt-1.5 text-[11.5px] text-red-600">{errors.havanCount}</p>
                )}
              </div>

              {/* Duration Selection (Coupled to Havan Count) */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#766D60]">
                    Select Ritual Duration (Days)
                  </label>
                  {isSingleHavan && (
                    <span className="text-[10.5px] text-[#B7791F] font-medium">
                      1 Havan is strictly completed in 1 Day
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {availableDays.map((dCount) => {
                    const isSelected = activeDays === dCount;
                    const isDisabled = isSingleHavan && dCount > 1;

                    return (
                      <button
                        key={dCount}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleDaysSelect(dCount)}
                        className={`relative flex flex-col justify-between rounded-xl border p-3 text-left transition ${
                          isDisabled
                            ? "opacity-40 cursor-not-allowed bg-gray-50 border-gray-200"
                            : isSelected
                            ? "border-[#D99A20] bg-[#FFFBF0] shadow-xs ring-1.5 ring-[#D99A20] cursor-pointer"
                            : "border-[#EAD8B8] bg-white hover:border-[#D8C3A1] hover:bg-[#FFFAF0]/50 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-[15px] font-bold text-[#29231B]">
                            {dCount} Day{dCount > 1 ? "s" : ""}
                          </span>
                          {isSelected && (
                            <CheckCircle2 size={14} className="text-[#D99A20]" />
                          )}
                        </div>
                        <span className="mt-1 text-[10.5px] text-[#766D60]">
                          {dCount === 1 ? "Single Day Session" : "Consecutive Sacred Days"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.days && (
                  <p className="mt-1.5 text-[11.5px] text-red-600">{errors.days}</p>
                )}
              </div>

              {/* Pandit Squad & Daily Ahuti Specs */}
              <div className="mt-5 rounded-xl border border-[#F0E4D2] bg-[#FFFAF0]/60 p-3.5 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#29231B] mb-1">
                      Officiating Vedic Purohits
                    </label>
                    <select
                      value={activePanditCount}
                      onChange={(e) => handlePanditSelect(e.target.value)}
                      className="w-full rounded-lg border border-[#EAD8B8] bg-white px-3 py-2 text-[12.5px] font-medium text-[#29231B]"
                    >
                      {panditOptions.map((p) => (
                        <option key={p} value={p}>
                          {p} Purohits {p === recommendedPandits ? "(Recommended)" : ""}
                        </option>
                      ))}
                    </select>
                    {errors.panditCount && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.panditCount}</p>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-[11px] text-[#766D60]">Fire Offering Cadence:</span>
                    <p className="text-[12.5px] font-semibold text-[#29231B] mt-0.5">
                      {service?.havanCapacityPerPandit || "500 Ahutis per Pandit / Day"}
                    </p>
                    <span className="text-[11px] text-[#B7791F]">
                      Daily Ritual Time: {service?.dailyHours || "3 – 4 Hours Daily"}
                    </span>
                  </div>
                </div>

                {/* Commencement Date & Auspicious Ahuti Time */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-[#F0E4D2]">
                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#29231B] mb-1">
                      Commencement Date
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={configuration.bookingDate || ""}
                      onChange={handleDateChange}
                      className="w-full rounded-lg border border-[#EAD8B8] bg-white px-3 py-2 text-[12.5px] text-[#29231B]"
                    />
                    {errors.bookingDate && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.bookingDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#29231B] mb-1">
                      Ahuti Muhurta Time
                    </label>
                    <select
                      value={configuration.bookingTime || "06:00 AM"}
                      onChange={(e) => handleTimePresetChange(e.target.value)}
                      className="w-full rounded-lg border border-[#EAD8B8] bg-white px-3 py-2 text-[12.5px] text-[#29231B]"
                    >
                      {TIME_PRESETS.map((t) => (
                        <option key={t.label} value={t.label}>
                          {t.desc}
                        </option>
                      ))}
                    </select>
                    {errors.bookingTime && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.bookingTime}</p>
                    )}
                  </div>
                </div>

                {/* Live Completion Date Projection Banner */}
                {configuration.bookingDate && (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50/80 border border-emerald-200 px-3 py-2 text-[12px] text-emerald-800">
                    <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                    <span>
                      Homa timeline: <strong>{formatFriendlyDate(configuration.bookingDate)}</strong>
                      {activeDays > 1 && (
                        <>
                          {" "}to <strong>{formatFriendlyDate(displayCompletionDate)}</strong> ({activeDays} consecutive days)
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 2: ARRANGEMENT MODE & VENUE */}
            <section
              data-error-field="arrangementMode"
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF5E5] text-[11px] font-bold text-[#B7791F]">
                    2
                  </span>
                  <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                    Homa Sanctum & Fire Altar Venue
                  </h2>
                </div>
                <span className="rounded-full bg-[#FFFAF0] border border-[#EAD8B8] px-2.5 py-0.5 text-[10.5px] font-medium text-[#766D60]">
                  Sanctified Options
                </span>
              </div>

              {/* Mode Selection Grid */}
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {supportedModes.map((modeKey) => {
                  const info = ARRANGEMENT_MODE_LABELS[modeKey] || ARRANGEMENT_MODE_LABELS.kashi;
                  const Icon = info.icon;
                  const isSelected = currentMode === modeKey;

                  return (
                    <div
                      key={modeKey}
                      onClick={() => handleModeChange(modeKey)}
                      className={`relative flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition ${
                        isSelected
                          ? "border-[#D99A20] bg-[#FFFBF0] shadow-xs ring-1.5 ring-[#D99A20]"
                          : "border-[#EAD8B8] bg-white hover:border-[#D8C3A1] hover:bg-[#FFFAF0]/40"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          isSelected ? "bg-[#D99A20] text-white" : "bg-[#F8EDD8] text-[#B7791F]"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 pr-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-[13.5px] font-bold text-[#29231B]">
                            {info.title}
                          </h3>
                          {isSelected && <Check size={14} className="text-[#D99A20]" />}
                        </div>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-[#766D60]">
                          {info.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.arrangementMode && (
                <p className="mt-1.5 text-[11.5px] text-red-600">{errors.arrangementMode}</p>
              )}

              {/* Conditional Physical Venue Form */}
              {requiresPhysicalAddress ? (
                <div className="mt-4 rounded-xl border border-[#F0E4D2] bg-[#FFFAF0]/60 p-3.5 space-y-3">
                  <p className="text-[12px] font-semibold text-[#29231B]">
                    Please provide the premises address for Homa Kunda installation:
                  </p>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Street Address / House No. / Landmark"
                        value={locationDetails.address || ""}
                        onChange={(e) => updateLocationDetails({ address: e.target.value })}
                        className="w-full rounded-lg border border-[#EAD8B8] bg-white px-3 py-2 text-[12px] text-[#29231B]"
                      />
                      {errors.address && (
                        <p className="mt-0.5 text-[10.5px] text-red-600">{errors.address}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="City"
                        value={locationDetails.city || ""}
                        onChange={(e) => updateLocationDetails({ city: e.target.value })}
                        className="w-full rounded-lg border border-[#EAD8B8] bg-white px-3 py-2 text-[12px] text-[#29231B]"
                      />
                      {errors.city && (
                        <p className="mt-0.5 text-[10.5px] text-red-600">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="State"
                        value={locationDetails.state || ""}
                        onChange={(e) => updateLocationDetails({ state: e.target.value })}
                        className="w-full rounded-lg border border-[#EAD8B8] bg-white px-3 py-2 text-[12px] text-[#29231B]"
                      />
                      {errors.state && (
                        <p className="mt-0.5 text-[10.5px] text-red-600">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Pincode (6 digits)"
                        value={locationDetails.pincode || ""}
                        onChange={(e) => updateLocationDetails({ pincode: e.target.value })}
                        className="w-full rounded-lg border border-[#EAD8B8] bg-white px-3 py-2 text-[12px] text-[#29231B]"
                      />
                      {errors.pincode && (
                        <p className="mt-0.5 text-[10.5px] text-red-600">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-[#EAD8B8] bg-[#FFFAF0]/50 p-2.5 text-[11.5px] text-[#766D60] flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#2e7d32] shrink-0" />
                  <span>
                    No physical venue setup required from you. The fire altar is prepared at sanctified shrines by our initiated Purohits.
                  </span>
                </div>
              )}
            </section>

            {/* SECTION 3: PRIMARY DEVOTEE (YAJMAN DETAILS) */}
            <section
              data-error-field="name"
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF5E5] text-[11px] font-bold text-[#B7791F]">
                    3
                  </span>
                  <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                    Primary Devotee (Yajman Details)
                  </h2>
                </div>
                <span className="rounded-full bg-[#FFFAF0] border border-[#EAD8B8] px-2.5 py-0.5 text-[10.5px] font-medium text-[#766D60]">
                  Required for Sankalpa
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#29231B]">
                      Yajman Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <User size={14} className="absolute left-3 top-2.5 text-[#A39682]" />
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Chandra"
                        value={yajmanDetails.name || ""}
                        onChange={(e) => updateYajmanDetails({ name: e.target.value })}
                        className="w-full rounded-lg border border-[#EAD8B8] bg-white pl-8 pr-3 py-2 text-[12.5px] text-[#29231B] focus:border-[#D99A20] focus:ring-1 focus:ring-[#D99A20] transition"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#29231B]">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <Phone size={14} className="absolute left-3 top-2.5 text-[#A39682]" />
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={yajmanDetails.mobile || ""}
                        onChange={(e) => updateYajmanDetails({ mobile: e.target.value })}
                        className="w-full rounded-lg border border-[#EAD8B8] bg-white pl-8 pr-3 py-2 text-[12.5px] text-[#29231B] focus:border-[#D99A20] focus:ring-1 focus:ring-[#D99A20] transition"
                      />
                    </div>
                    {errors.mobile && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.mobile}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Email Address */}
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#29231B]">
                      Email Address (Optional)
                    </label>
                    <div className="relative mt-1">
                      <Mail size={14} className="absolute left-3 top-2.5 text-[#A39682]" />
                      <input
                        type="email"
                        placeholder="For ceremony updates and live stream"
                        value={yajmanDetails.email || ""}
                        onChange={(e) => updateYajmanDetails({ email: e.target.value })}
                        className="w-full rounded-lg border border-[#EAD8B8] bg-white pl-8 pr-3 py-2 text-[12.5px] text-[#29231B] focus:border-[#D99A20] focus:ring-1 focus:ring-[#D99A20] transition"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-[11.5px] font-semibold text-[#29231B]">Gender</label>
                    <select
                      value={yajmanDetails.gender || "Male"}
                      onChange={(e) => updateYajmanDetails({ gender: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-3 py-2 text-[12.5px] text-[#29231B] focus:border-[#D99A20] focus:ring-1 focus:ring-[#D99A20] transition"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Collapsible Vedic Astrology & Gotra Details */}
                <div className="pt-2 border-t border-[#F0E4D2]">
                  <button
                    type="button"
                    onClick={() => setIsAstrologyOpen(!isAstrologyOpen)}
                    className="flex w-full items-center justify-between py-1.5 text-left text-[12.5px] font-semibold text-[#B7791F] hover:text-[#8C571C] transition cursor-pointer"
                  >
                    <span>+ Add Gotra, Nakshatra & Vedic Birth Details (Recommended)</span>
                    {isAstrologyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isAstrologyOpen && (
                    <div className="mt-3 rounded-lg border border-[#F0E4D2] bg-[#FFFAF0]/50 p-3.5 space-y-3">
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
                            placeholder="e.g. Bharadwaja, Kaundinya"
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
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                          <label className="text-[11.5px] font-medium text-[#766D60]">Date of Birth</label>
                          <input
                            type="date"
                            value={yajmanDetails.dob || ""}
                            onChange={(e) => updateYajmanDetails({ dob: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px]"
                          />
                        </div>
                        <div>
                          <label className="text-[11.5px] font-medium text-[#766D60]">Time of Birth</label>
                          <input
                            type="time"
                            value={yajmanDetails.timeOfBirth || ""}
                            onChange={(e) => updateYajmanDetails({ timeOfBirth: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px]"
                          />
                        </div>
                        <div>
                          <label className="text-[11.5px] font-medium text-[#766D60]">Place of Birth</label>
                          <input
                            type="text"
                            placeholder="City / State"
                            value={yajmanDetails.placeOfBirth || ""}
                            onChange={(e) => updateYajmanDetails({ placeOfBirth: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* SECTION 4: SACRED SANKALP & PRAYER */}
            <section
              data-error-field="mainIntention"
              className="rounded-xl border border-[#EAD8B8] bg-white p-4 sm:p-5 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-[#F0E4D2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF5E5] text-[11px] font-bold text-[#B7791F]">
                    4
                  </span>
                  <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#29231B]">
                    Sacred Sankalp & Prayer Intention
                  </h2>
                </div>
                <span className="rounded-full bg-[#FFFAF0] border border-[#EAD8B8] px-2.5 py-0.5 text-[10.5px] font-medium text-[#766D60]">
                  Offered into Homa Kunda
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {/* Intention suggestions */}
                <div>
                  <label className="text-[11.5px] font-semibold text-[#29231B]">
                    Select Prayer Intention <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {INTENTION_SUGGESTIONS.map((sug) => {
                      const isSelected = sankalpDetails.mainIntention === sug;
                      return (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => updateSankalpDetails({ mainIntention: sug, purpose: sug })}
                          className={`rounded-full px-3 py-1 text-[11px] font-medium transition cursor-pointer ${
                            isSelected
                              ? "bg-[#D99A20] text-white shadow-2xs"
                              : "bg-[#FFFAF0] border border-[#EAD8B8] text-[#766D60] hover:bg-[#F8EDD8] hover:text-[#29231B]"
                          }`}
                        >
                          {sug}
                        </button>
                      );
                    })}
                  </div>
                  {errors.mainIntention && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.mainIntention}</p>
                  )}
                </div>

                {/* Specific prayer intention */}
                <div>
                  <label className="text-[11.5px] font-semibold text-[#29231B]">
                    Specific Prayer / Personal Sankalp (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Provide specific prayer details, family intentions, or deity archana requests to be recited during the Ahutis."
                    value={sankalpDetails.specificSankalp || ""}
                    onChange={(e) => updateSankalpDetails({ specificSankalp: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white p-2.5 text-[12px] text-[#29231B] focus:border-[#D99A20] focus:ring-1 focus:ring-[#D99A20]"
                  />
                </div>

                {/* Special Instructions Collapsible */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsSpecialInstructionsOpen(!isSpecialInstructionsOpen)}
                    className="flex w-full items-center justify-between py-1 text-left text-[12.5px] font-semibold text-[#B7791F] hover:text-[#8C571C] transition cursor-pointer"
                  >
                    <span>+ Add Special Ahuti Requests or Pandit Notes (Optional)</span>
                    {isSpecialInstructionsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {isSpecialInstructionsOpen && (
                    <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <div>
                        <label className="text-[11.5px] font-medium text-[#766D60]">
                          Specific Deity / Ahuti Dravya Request
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Special Ghee or Modak Ahutis"
                          value={sankalpDetails.specialRequest || ""}
                          onChange={(e) => updateSankalpDetails({ specialRequest: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-[#EAD8B8] bg-white px-2.5 py-1.5 text-[12px] text-[#29231B]"
                        />
                      </div>
                      <div>
                        <label className="text-[11.5px] font-medium text-[#766D60]">
                          Coordination Note
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Notify before Purnahuti"
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
                    Include family members in the sacred Homa Sankalpa (optional).
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

            {/* SECTION 6: CONSECRATED SAMAGRI & HOMA INCLUSIONS */}
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
                  Every Veda Structure Homa is an authentic Vedic fire offering performed with strictly consecrated dravyas and verified priests:
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
                    <span>Initiated Vedic Purohit Team Dakshina</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-[#FFFAF0] p-2 border border-[#EAD8B8]">
                    <Check size={14} className="text-[#2e7d32] shrink-0" />
                    <span>Energized Homa Bhasma Dispatched to Home</span>
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
              {/* Thumbnail Hero */}
              <div className="relative h-28 w-full overflow-hidden rounded-lg bg-[#F8EDD8]">
                <img
                  src={primaryImg}
                  alt={service?.name || "Homa Ritual"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                  <p className="font-serif text-[14px] font-bold leading-tight truncate">
                    {service?.name || "Vedic Homa"}
                  </p>
                  <p className="text-[10px] text-amber-200">
                    {activeHavanCount} Havan • {activeDays} Day{activeDays > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Ceremony Details Breakdown */}
              <div className="mt-3.5 space-y-2 border-b border-[#F0E4D2] pb-3 text-[12px]">
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Havan Count:</span>
                  <span className="font-semibold text-[#29231B]">
                    {activeHavanCount} Havan{Number(activeHavanCount) > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Duration:</span>
                  <span className="font-semibold text-[#29231B]">
                    {activeDays} Day{activeDays > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Purohit Squad:</span>
                  <span className="font-semibold text-[#29231B]">
                    {activePanditCount} Officiating Purohits
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Commencement:</span>
                  <span className="font-semibold text-[#29231B]">
                    {configuration.bookingDate ? formatFriendlyDate(configuration.bookingDate) : "—"}
                  </span>
                </div>
                {activeDays > 1 && (
                  <div className="flex items-center justify-between text-[#766D60]">
                    <span>Completion Date:</span>
                    <span className="font-semibold text-[#2e7d32]">
                      {displayCompletionDate ? formatFriendlyDate(displayCompletionDate) : "—"}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Muhurta Time:</span>
                  <span className="font-semibold text-[#29231B]">
                    {configuration.bookingTime || "06:00 AM"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Arrangement:</span>
                  <span className="font-semibold text-[#29231B]">
                    {ARRANGEMENT_MODE_LABELS[currentMode]?.badge || "Kashi Sanctum"}
                  </span>
                </div>
              </div>

              {/* Authoritative Price Breakdown */}
              <div className="mt-3 space-y-1.5 border-b border-[#F0E4D2] pb-3 text-[12px]">
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Homa Package Dakshina:</span>
                  <span className="font-medium text-[#29231B]">
                    ₹{Number(finalAmount).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Officiating Purohits:</span>
                  <span className="text-[#2e7d32] font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between text-[#766D60]">
                  <span>Homa Samagri & Ghee:</span>
                  <span className="text-[#2e7d32] font-medium">Included</span>
                </div>
              </div>

              {/* Total Authoritative Dakshina */}
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <span className="block text-[10.5px] uppercase tracking-wider font-bold text-[#766D60]">
                    Total Authoritative Dakshina
                  </span>
                  <span className="text-[10px] text-[#766D60]">All inclusions covered</span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-[22px] font-bold text-[#B7791F]">
                    {isCalculatingPrice ? (
                      <RefreshCw size={18} className="inline animate-spin text-[#B7791F]" />
                    ) : (
                      `₹${Number(finalAmount).toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="mt-4 pt-3 border-t border-[#F0E4D2]">
                <label className="flex items-start gap-2 text-[11px] text-[#766D60] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTermsAccepted}
                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded text-[#D99A20] focus:ring-[#D99A20]"
                  />
                  <span>
                    I confirm that the Yajman names, Gotra, and Sankalp intentions provided are accurate for ceremonial Ahutis.
                  </span>
                </label>
              </div>

              {/* Confirm & Book Button */}
              <button
                type="button"
                disabled={!isTermsAccepted || isSubmitting || isOpeningPayment || isCalculatingPrice}
                onClick={initiateBookingAndPayment}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#D99A20] to-[#B7791F] py-3 text-center text-[13.5px] font-bold text-white shadow-md hover:brightness-105 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting || isOpeningPayment ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Connecting Authoritative Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Confirm & Pay Dakshina</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-3 flex items-center justify-center gap-4 text-[10.5px] text-[#766D60]">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-[#2e7d32]" /> 100% Initiated Scholars
                </span>
                <span className="flex items-center gap-1">
                  <Lock size={12} className="text-[#A39682]" /> Cashfree Secure 256-bit
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          MOBILE STICKY BOTTOM DRAWER (Screen width < 1024px)
      ========================================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#EAD8B8] bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-[#766D60]">
              Total Dakshina
            </span>
            <span className="font-serif text-[18px] font-bold text-[#B7791F]">
              ₹{Number(finalAmount).toLocaleString("en-IN")}
            </span>
          </div>
          <button
            type="button"
            disabled={!isTermsAccepted || isSubmitting || isOpeningPayment || isCalculatingPrice}
            onClick={initiateBookingAndPayment}
            className="flex-1 max-w-[240px] rounded-xl bg-[#D99A20] py-2.5 text-center text-[12.5px] font-bold text-white shadow-md hover:bg-[#B7791F] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isSubmitting || isOpeningPayment ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Lock size={13} />
            )}
            <span>Book Homa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomaSinglePageBooking;

