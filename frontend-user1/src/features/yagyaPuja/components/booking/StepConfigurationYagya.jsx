import { useMemo } from "react";
import {
  Clock,
  Calendar,
  Users,
  MapPin,
  AlertCircle,
  Sparkles,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { useRitualBooking } from "../../context/RitualBookingContext";

const ARRANGEMENT_MODE_LABELS = {
  kashi: {
    title: "Kashi Sacred Mandapams (Varanasi)",
    desc: "Conducted in Varanasi at consecrated Yajnashalas near Manikarnika / Assi / Dashashwamedh shrines.",
    badge: "Kashi Sanctum",
  },
  customer_home: {
    title: "At Devotee Yajnashala / Residence",
    desc: "Vedic Acharya and Purohit team arrives at your designated premise with consecrated Homa Kunda setup.",
    badge: "Personal Venue",
  },
  remote: {
    title: "Remote Sankalpa (Live Darshan)",
    desc: "Live stream telecast with personal Gotra recitation, daily Sankalpa link, and Sanctified Prasad dispatch.",
    badge: "Online & Global",
  },
  veda_structure: {
    title: "Veda Structure Consecrated Centre",
    desc: "Conducted in our consecrated Vedic Yajnashala built with traditional acoustic Agnicayana architecture.",
    badge: "Veda Centre",
  },
  temple: {
    title: "Consecrated Mandir Mandapam",
    desc: "Arranged inside a consecrated temple premise adhering to strict Agamic and Shastric protocols.",
    badge: "Temple Shrine",
  },
  other: {
    title: "Other Sacred Venue",
    desc: "Custom sacred site coordinated according to your family Kuladevata or ancestral traditions.",
    badge: "Custom",
  },
};

const LOCATION_TYPE_LABELS = {
  kashi: "Kashi (Varanasi) Sacred Yajnashala",
  customer_home: "Devotee Residence / Private Premises",
  temple: "Consecrated Mandir Premises",
  veda_structure: "Veda Structure Consecrated Centre",
  remote: "Remote Virtual Yajnashala",
  other: "Custom Sacred Location",
};

const TIME_PRESETS = [
  { label: "06:00 AM", desc: "Brahma Muhurta Ahuti" },
  { label: "08:30 AM", desc: "Pratah Kalin Homa" },
  { label: "10:30 AM", desc: "Madhyahna Ahuti" },
  { label: "04:30 PM", desc: "Sayankalin Homa" },
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
 */
const calculateCompletionDate = (startDateStr, daysCount) => {
  if (!startDateStr || !daysCount || daysCount < 1) return "";
  try {
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return "";
    const end = new Date(start);
    end.setDate(start.getDate() + (Number(daysCount) - 1));
    return end.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

/**
 * Step 1: Yagya Configuration Component
 * Exclusively used when serviceType === "YAGYA"
 */
const StepConfigurationYagya = () => {
  const { service, configuration, updateConfiguration, errors } = useRitualBooking();

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
    return Number(service?.dailyRitualHours) || 4;
  }, [service]);

  // 3. Minimum pandits required from service data (Source of Truth)
  const minPandits = useMemo(() => {
    return Number(service?.panditRequirement?.minPandits) || 3;
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
    return list.length > 0 ? list : ["kashi", "remote"];
  }, [service]);

  // Handle duration selection
  const handleDurationSelect = (daysCount) => {
    const numDays = Number(daysCount);
    const totalHours = numDays * dailyHours;

    // Look for matching pricing tier in service data
    let matchedTier = null;
    if (Array.isArray(service?.pricingTiers)) {
      matchedTier = service.pricingTiers.find((t) => Number(t.days) === numDays) || null;
    }

    const currentPandits = Number(configuration.panditCount) || minPandits;
    const tierPandits = matchedTier?.panditCount ? Number(matchedTier.panditCount) : minPandits;
    const targetPandits = Math.max(currentPandits, tierPandits, minPandits);

    const compDate = configuration.bookingDate
      ? calculateCompletionDate(configuration.bookingDate, numDays)
      : "";

    updateConfiguration({
      days: numDays,
      durationSelected: `${numDays} Days`,
      dailyHours,
      durationHours: totalHours,
      panditCount: targetPandits,
      completionDate: compDate,
      selectedPricingTier: matchedTier,
    });
  };

  // Handle start date selection
  const handleDateChange = (dateVal) => {
    const daysCount = Number(configuration.days) || availableDurations[0] || 3;
    const compDate = dateVal ? calculateCompletionDate(dateVal, daysCount) : "";
    updateConfiguration({
      bookingDate: dateVal,
      completionDate: compDate,
    });
  };

  // Handle pandit count adjustment
  const handlePanditIncrement = () => {
    const current = Number(configuration.panditCount) || minPandits;
    updateConfiguration({ panditCount: current + 1 });
  };

  const handlePanditDecrement = () => {
    const current = Number(configuration.panditCount) || minPandits;
    if (current > minPandits) {
      updateConfiguration({ panditCount: current - 1 });
    }
  };

  // Handle arrangement mode selection
  const handleArrangementSelect = (modeKey) => {
    updateConfiguration({
      arrangementMode: modeKey,
      locationType: modeKey,
    });
  };

  // Format date helper for completion preview
  const formatFriendlyDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const selectedDays = Number(configuration.days) || availableDurations[0] || 3;
  const currentTotalHours = selectedDays * dailyHours;

  return (
    <div className="space-y-9">
      {/* SECTION 1: MULTI-DAY YAGYA DURATION */}
      <div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
            <Flame size={16} className="text-[#b36c1e]" />
            <span>1. Multi-Day Yagya Duration (Shastric Anushthan)</span>
            <span className="text-red-500">*</span>
          </label>
          <span className="text-[11.5px] text-[#8a7c6b]">Prescribed Shastric Tiers</span>
        </div>
        <p className="mt-1 text-[12px] text-[#685c4f]">
          Select the multi-day ritual span. Vedic Yagyas require consecutive daily sessions of Ahuti,
          mantra japa, and havan progression.
        </p>

        <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {availableDurations.map((daysCount) => {
            const isSelected = selectedDays === daysCount;
            const tierMatch = Array.isArray(service?.pricingTiers)
              ? service.pricingTiers.find((t) => Number(t.days) === daysCount)
              : null;

            return (
              <button
                key={daysCount}
                type="button"
                onClick={() => handleDurationSelect(daysCount)}
                className={`relative flex flex-col justify-between rounded-2xl p-4.5 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#d4872b] bg-[#fffaf0] shadow-sm"
                    : "border border-[#ead8b8] bg-white hover:border-[#d8c3a1]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[18px] font-bold text-[#2b241d]">
                      {daysCount} Days
                    </span>
                    {isSelected ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eab12c] text-[#1c1308] text-[11px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#8a7c6b]">
                        {daysCount * dailyHours} Total Hrs
                      </span>
                    )}
                  </div>

                  <p className="mt-1 font-serif text-[13px] font-semibold text-[#b36c1e]">
                    {tierMatch?.label || `${daysCount}-Day Sacred Anushthan`}
                  </p>

                  <p className="mt-1 text-[11.5px] leading-relaxed text-[#7a6f62]">
                    {daysCount} consecutive days with {dailyHours} hours of continuous daily Ahuti
                    and Vedic recitations.
                  </p>
                </div>

                {tierMatch?.price && (
                  <div className="mt-3.5 border-t border-[#f0e2cd] pt-2.5 flex items-baseline justify-between">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                      Package Dakshina
                    </span>
                    <span className="font-serif text-[15px] font-bold text-[#2b241d]">
                      ₹{Number(tierMatch.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {errors.days && (
          <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-600">
            <AlertCircle size={13} /> {errors.days}
          </p>
        )}
      </div>

      {/* SECTION 2: DAILY RITUAL HOURS BANNER */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-4.5 text-[13px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
              <Clock size={18} />
            </div>
            <div>
              <p className="font-serif font-bold text-[#2b241d]">
                Daily Continuous Ritual: {dailyHours} Hours / Day
              </p>
              <p className="mt-0.5 text-[12px] text-[#685c4f]">
                Total Continuous Ritual Duration:{" "}
                <strong className="text-[#2b241d]">{currentTotalHours} Hours</strong> across the{" "}
                {selectedDays}-day sacred cycle.
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f8edd8] px-3 py-1 text-[11px] font-bold text-[#b36c1e]">
            <Sparkles size={11} className="text-[#c77722]" />
            Shastric Specification
          </span>
        </div>
      </div>

      {/* SECTION 3: START DATE & COMPLETION DATE PREVIEW */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Start Date */}
        <div>
          <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
            <Calendar size={16} className="text-[#b36c1e]" />
            <span>2. Yagya Commencement Date</span>
            <span className="text-red-500">*</span>
          </label>
          <p className="mt-0.5 text-[11.5px] text-[#8a7c6b]">
            First day of Arani Manthan & Sankalp (must not be in the past)
          </p>
          <input
            type="date"
            min={todayStr}
            value={configuration.bookingDate || ""}
            onChange={(e) => handleDateChange(e.target.value)}
            className={`mt-2.5 w-full rounded-xl border bg-white px-4 py-3 text-[14px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
              errors.bookingDate
                ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                : "border-[#d8c3a1] focus:border-[#d4872b] focus:ring-[#d4872b]"
            }`}
          />
          {errors.bookingDate && (
            <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-600">
              <AlertCircle size={13} /> {errors.bookingDate}
            </p>
          )}
        </div>

        {/* Completion Date (Derived) */}
        <div>
          <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
            <CheckCircle2 size={16} className="text-[#2e7d32]" />
            <span>3. Maha Purnahuti (Completion Date)</span>
          </label>
          <p className="mt-0.5 text-[11.5px] text-[#8a7c6b]">
            Automatically derived from duration ({selectedDays} days)
          </p>

          <div className="mt-2.5 flex h-[48px] items-center rounded-xl border border-[#ead8b8] bg-[#faf6ef] px-4 text-[13.5px]">
            {configuration.completionDate ? (
              <div className="flex items-center gap-2 text-[#2b241d]">
                <Calendar size={14} className="text-[#b36c1e]" />
                <strong className="font-serif">
                  {formatFriendlyDate(configuration.completionDate)}
                </strong>
                <span className="text-[11.5px] text-[#7a6f62]">
                  (Day {selectedDays} Final Ahuti)
                </span>
              </div>
            ) : (
              <span className="italic text-[#9a8d7e]">
                Select commencement date to see completion timeline
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4: DAILY COMMENCEMENT TIME */}
      <div>
        <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
          <Clock size={16} className="text-[#b36c1e]" />
          <span>4. Daily Commencement Time / Preferred Muhurat</span>
          <span className="text-red-500">*</span>
        </label>
        <p className="mt-0.5 text-[11.5px] text-[#8a7c6b]">
          Specify the daily start time for morning or evening Homa rituals
        </p>

        <div className="mt-2.5 max-w-[420px]">
          <input
            type="text"
            placeholder="e.g. 06:00 AM or select a preset below"
            value={configuration.bookingTime || ""}
            onChange={(e) => updateConfiguration({ bookingTime: e.target.value })}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-[14px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
              errors.bookingTime
                ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                : "border-[#d8c3a1] focus:border-[#d4872b] focus:ring-[#d4872b]"
            }`}
          />
        </div>

        {/* Time Presets */}
        <div className="mt-2.5 flex flex-wrap gap-2">
          {TIME_PRESETS.map((preset) => {
            const isSelected = configuration.bookingTime === preset.label;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => updateConfiguration({ bookingTime: preset.label })}
                className={`rounded-xl px-3 py-1.5 text-[11.5px] font-medium transition cursor-pointer ${
                  isSelected
                    ? "bg-[#eab12c] font-bold text-[#1c1308] shadow-2xs"
                    : "border border-[#ead8b8] bg-white text-[#685c4f] hover:bg-[#faf4e8]"
                }`}
              >
                {preset.label} ({preset.desc})
              </button>
            );
          })}
        </div>

        {errors.bookingTime && (
          <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-600">
            <AlertCircle size={13} /> {errors.bookingTime}
          </p>
        )}
      </div>

      {/* SECTION 5: PANDIT TEAM SIZE */}
      <div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
            <Users size={16} className="text-[#b36c1e]" />
            <span>5. Officiating Vedic Purohit Team</span>
            <span className="text-red-500">*</span>
          </label>
          <span className="rounded-full bg-[#f8edd8] px-2.5 py-0.5 text-[11px] font-bold text-[#b36c1e]">
            Min {minPandits} Required
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-4.5">
          <div className="flex items-center rounded-xl border border-[#d8c3a1] bg-white shadow-2xs">
            <button
              type="button"
              onClick={handlePanditDecrement}
              disabled={(Number(configuration.panditCount) || minPandits) <= minPandits}
              className="flex h-11 w-11 items-center justify-center rounded-l-xl text-[18px] font-bold text-[#5c4e3f] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#faf4e8] transition"
            >
              −
            </button>
            <div className="flex h-11 w-14 items-center justify-center font-serif text-[18px] font-bold text-[#2b241d]">
              {configuration.panditCount || minPandits}
            </div>
            <button
              type="button"
              onClick={handlePanditIncrement}
              className="flex h-11 w-11 items-center justify-center rounded-r-xl text-[18px] font-bold text-[#5c4e3f] hover:bg-[#faf4e8] transition cursor-pointer"
            >
              +
            </button>
          </div>

          <div className="flex-1 text-[12.5px] text-[#685c4f]">
            <p className="font-semibold text-[#2b241d]">
              {configuration.panditCount || minPandits} Learned Vedic Scholars
              {service?.panditRequirement?.leadAcharya ? " (Includes 1 Presiding Acharya)" : ""}
            </p>
            <p className="mt-0.5 text-[#8a7c6b]">
              Minimum {minPandits} Acharyas required to maintain continuous four-veda recital
              and simultaneous Ahuti offering.
            </p>
            {Array.isArray(service?.panditRequirement?.roles) &&
              service.panditRequirement.roles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {service.panditRequirement.roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-md border border-[#e8d5b8] bg-white px-2 py-0.5 text-[10.5px] font-semibold text-[#8c571c]"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </div>

        {errors.panditCount && (
          <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-600">
            <AlertCircle size={13} /> {errors.panditCount}
          </p>
        )}
      </div>

      {/* SECTION 6: ARRANGEMENT MODE */}
      <div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
            <Sparkles size={16} className="text-[#b36c1e]" />
            <span>6. Yagya Arrangement Mode</span>
            <span className="text-red-500">*</span>
          </label>
          <span className="text-[11.5px] text-[#8a7c6b]">Service Supported Venues</span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {supportedModes.map((modeKey) => {
            const meta = ARRANGEMENT_MODE_LABELS[modeKey] || {
              title: modeKey,
              desc: "Sacred ceremony venue",
              badge: "Vedic",
            };
            const isSelected = configuration.arrangementMode === modeKey;

            return (
              <button
                key={modeKey}
                type="button"
                onClick={() => handleArrangementSelect(modeKey)}
                className={`flex flex-col justify-between rounded-2xl p-4.5 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#d4872b] bg-[#fffaf0] shadow-sm"
                    : "border border-[#ead8b8] bg-white hover:border-[#d8c3a1]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[16px] font-bold text-[#2b241d]">
                      {meta.title}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                        isSelected
                          ? "bg-[#eab12c] text-[#1c1308]"
                          : "bg-[#f8edd8] text-[#8a571c]"
                      }`}
                    >
                      {meta.badge}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#685c4f]">
                    {meta.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {errors.arrangementMode && (
          <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-600">
            <AlertCircle size={13} /> {errors.arrangementMode}
          </p>
        )}
      </div>

      {/* SECTION 7: CANONICAL LOCATION TYPE */}
      <div>
        <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
          <MapPin size={16} className="text-[#b36c1e]" />
          <span>7. Canonical Location Classification</span>
          <span className="text-red-500">*</span>
        </label>
        <p className="mt-0.5 text-[11.5px] text-[#8a7c6b]">
          Required for purohit travel coordination and ritual acoustic setup
        </p>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {supportedModes.map((locKey) => {
            const label = LOCATION_TYPE_LABELS[locKey] || locKey;
            const isSelected = configuration.locationType === locKey;

            return (
              <button
                key={locKey}
                type="button"
                onClick={() => updateConfiguration({ locationType: locKey })}
                className={`rounded-xl p-3 text-left transition cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#d4872b] bg-[#fffaf0] font-semibold text-[#2b241d] shadow-2xs"
                    : "border border-[#ead8b8] bg-white text-[13px] text-[#5c4e3f] hover:border-[#d8c3a1]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px]">{label}</span>
                  {isSelected && (
                    <span className="text-[#d4872b] text-[13px] font-bold">✓</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {errors.locationType && (
          <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-600">
            <AlertCircle size={13} /> {errors.locationType}
          </p>
        )}
      </div>
    </div>
  );
};

export default StepConfigurationYagya;
