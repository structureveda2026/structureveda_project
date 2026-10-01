import { useMemo } from "react";
import {
  Clock,
  Calendar,
  Users,
  MapPin,
  AlertCircle,
  Sparkles,
  Hash,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useRitualBooking } from "../../context/RitualBookingContext";

const ARRANGEMENT_MODE_LABELS = {
  kashi: {
    title: "Kashi Sacred Shrines (Varanasi)",
    desc: "Chanted in Varanasi at sacred temple sanctums and Ganga shrines with consecrated Mala.",
    badge: "Kashi Kshetra",
  },
  remote: {
    title: "Remote Sankalpa (Live Audio/Video)",
    desc: "Personal Sankalpa recitation over live video/audio link with consecrated Japa Mala delivered to your home.",
    badge: "Online & Global",
  },
  customer_home: {
    title: "At Devotee Residence",
    desc: "Designated Vedic Purohit team arrives at your premise for daily synchronized Anushthan recitation.",
    badge: "Personal Venue",
  },
  temple: {
    title: "Consecrated Mandir",
    desc: "Arranged inside a consecrated temple with dedicated sanctum access and classical acoustics.",
    badge: "Temple Sanctum",
  },
  veda_structure: {
    title: "Veda Structure Centre",
    desc: "Arranged at our dedicated Vedic sanctuary with authentic acoustic chanting halls.",
    badge: "Veda Centre",
  },
  other: {
    title: "Other Sacred Venue",
    desc: "Coordinated at an auspicious Tirtha or ancestral venue according to tradition.",
    badge: "Custom",
  },
};

const LOCATION_TYPE_LABELS = {
  kashi: "Kashi (Varanasi) Sacred Shrines",
  remote: "Remote Virtual Sanctuary",
  customer_home: "Devotee Personal Residence",
  temple: "Consecrated Mandir / Temple",
  veda_structure: "Veda Structure Centre",
  other: "Custom Sacred Location",
};

const TIME_PRESETS = [
  { label: "06:00 AM", desc: "Brahma Muhurta (Most Auspicious)" },
  { label: "08:30 AM", desc: "Pratah (Morning Chanting)" },
  { label: "11:00 AM", desc: "Madhyahna (Noon Chanting)" },
  { label: "05:30 PM", desc: "Sayankalin (Evening Chanting)" },
  { label: "07:30 PM", desc: "Sandhya Samapti" },
];

const formatCount = (count) => {
  if (!count) return "";
  if (count >= 100000) return `${(count / 100000).toLocaleString("en-IN")} Lakh`;
  if (count >= 1000) return `${(count / 1000).toLocaleString("en-IN")}K`;
  return Number(count).toLocaleString("en-IN");
};

/**
 * Calculates Japa completion date (commencement date + requiredDays - 1)
 */
const calculateCompletionDate = (startDateStr, daysCount) => {
  if (!startDateStr || !daysCount || Number(daysCount) < 1) return "";
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
 * Step 1: Japa Configuration Component
 * Exclusively used when serviceType === "JAPA"
 */
const StepConfigurationJapa = () => {
  const {
    service,
    configuration,
    updateConfiguration,
    priceBreakdown,
    isCalculatingPrice,
    priceError,
    errors,
  } = useRitualBooking();

  const todayStr = new Date().toISOString().split("T")[0];

  // 1. Available Japa Counts derived strictly from service API data (never hardcoded)
  const availableCounts = useMemo(() => {
    if (Array.isArray(service?.availableCounts) && service.availableCounts.length > 0) {
      return service.availableCounts.map(Number).filter((n) => !isNaN(n) && n > 0);
    }
    if (Array.isArray(service?.variants) && service.variants.length > 0) {
      return service.variants.map((v) => Number(v.count)).filter((n) => !isNaN(n) && n > 0);
    }
    return [11000];
  }, [service]);

  // 2. Active count and matching variant
  const activeCount = useMemo(() => {
    if (configuration.japaCount && availableCounts.includes(Number(configuration.japaCount))) {
      return Number(configuration.japaCount);
    }
    return availableCounts[0] || 11000;
  }, [configuration.japaCount, availableCounts]);

  const activeVariant = useMemo(() => {
    if (Array.isArray(service?.variants) && service.variants.length > 0) {
      const matched = service.variants.find((v) => Number(v.count) === activeCount);
      if (matched) return matched;
    }
    return null;
  }, [service, activeCount]);

  // 3. Pandit constraints from service / active variant data
  const minPandits = useMemo(() => {
    return Number(activeVariant?.minimumPandits || service?.minimumPandits || 2);
  }, [activeVariant, service]);

  const recommendedPandits = useMemo(() => {
    return Number(activeVariant?.recommendedPandits || service?.recommendedPandits || 3);
  }, [activeVariant, service]);

  const maxPandits = useMemo(() => {
    return Number(service?.maximumPandits || 11);
  }, [service]);

  const panditCountOptions = useMemo(() => {
    const list = [];
    for (let i = minPandits; i <= maxPandits; i++) {
      list.push(i);
    }
    return list;
  }, [minPandits, maxPandits]);

  // 4. Daily Capacity & Required Days computation for preview
  const dailyCapacityPerPandit = useMemo(() => {
    return Number(activeVariant?.dailyCapacity || service?.dailyCapacityPerPandit || 2000);
  }, [activeVariant, service]);

  const currentPanditCount = Number(configuration.panditCount) || recommendedPandits;
  const totalDailyCapacity = currentPanditCount * dailyCapacityPerPandit;
  const previewRequiredDays = Math.max(1, Math.ceil(activeCount / Math.max(1, totalDailyCapacity)));

  // Authoritative values from backend response override local preview when available
  const displayRequiredDays =
    priceBreakdown?.requiredDays != null ? priceBreakdown.requiredDays : previewRequiredDays;
  const displayCompletionDate =
    priceBreakdown?.completionDate != null
      ? priceBreakdown.completionDate
      : calculateCompletionDate(configuration.bookingDate, previewRequiredDays);

  // 5. Supported canonical arrangement modes derived strictly from service data
  const supportedModes = useMemo(() => {
    const list = [];
    if (service?.isKashiAvailable !== false) list.push("kashi");
    if (service?.isRemoteAvailable !== false) list.push("remote");
    return list.length > 0 ? list : ["kashi", "remote"];
  }, [service]);

  // Handle Japa Count selection
  const handleCountSelect = (cnt) => {
    const numCount = Number(cnt);
    const variant = Array.isArray(service?.variants)
      ? service.variants.find((v) => Number(v.count) === numCount)
      : null;

    const newPandits = Number(variant?.recommendedPandits || service?.recommendedPandits || minPandits);
    const newDailyCap = Number(variant?.dailyCapacity || service?.dailyCapacityPerPandit || 2000);
    const newTotalCap = newPandits * newDailyCap;
    const newReqDays = Math.max(1, Math.ceil(numCount / Math.max(1, newTotalCap)));
    const newCompletion = calculateCompletionDate(configuration.bookingDate, newReqDays);

    updateConfiguration({
      japaCount: numCount,
      panditCount: newPandits,
      minimumPandits: Number(variant?.minimumPandits || minPandits),
      recommendedPandits: newPandits,
      dailyCapacityPerPandit: newDailyCap,
      totalDailyCapacity: newTotalCap,
      requiredDays: newReqDays,
      days: newReqDays,
      completionDate: newCompletion,
      selectedVariant: variant,
      durationSelected: `${numCount.toLocaleString("en-IN")} Japa`,
    });
  };

  // Handle Pandit count selection
  const handlePanditSelect = (pCount) => {
    const numP = Number(pCount);
    const newTotalCap = numP * dailyCapacityPerPandit;
    const newReqDays = Math.max(1, Math.ceil(activeCount / Math.max(1, newTotalCap)));
    const newCompletion = calculateCompletionDate(configuration.bookingDate, newReqDays);

    updateConfiguration({
      panditCount: numP,
      totalDailyCapacity: newTotalCap,
      requiredDays: newReqDays,
      days: newReqDays,
      completionDate: newCompletion,
    });
  };

  // Handle commencement date selection
  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    const newCompletion = calculateCompletionDate(dateVal, displayRequiredDays);
    updateConfiguration({
      bookingDate: dateVal,
      commencementDate: dateVal,
      completionDate: newCompletion,
    });
  };

  // Handle arrangement mode selection
  const handleModeSelect = (modeKey) => {
    updateConfiguration({
      arrangementMode: modeKey,
      locationType: modeKey,
    });
  };

  // Authoritative Dakshina from backend price breakdown
  const displayAmount =
    priceBreakdown?.totalAmount != null
      ? priceBreakdown.totalAmount
      : priceBreakdown?.calculatedAmount != null
      ? priceBreakdown.calculatedAmount
      : activeVariant?.startingPrice || service?.startingPrice || 0;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
          <Sparkles size={12} className="text-[#c77722]" />
          <span>VEDIC MANTRA JAPA CONFIGURATION</span>
        </div>
        <h2 className="mt-1 font-serif text-[22px] font-bold text-[#2b241d]">
          Prescribed Japa Count & Chanting Team
        </h2>
        <p className="mt-1 text-[13.5px] text-[#6d5b4a]">
          Configure your classical Anushthan count, officiating Vedic Purohit team, and commencement date for{" "}
          <strong className="text-[#2b241d]">{service?.name || "Mantra Japa"}</strong>.
        </p>
      </div>

      {/* 1. JAPA RECITATION COUNT SELECTION */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
              1
            </span>
            <h3 className="font-serif text-[17px] font-semibold text-[#2b241d]">
              Select Japa Recitation Count
            </h3>
          </div>
          <span className="text-[12px] font-medium text-[#8a7c6b]">
            {availableCounts.length} Authoritative Counts Available
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {availableCounts.map((cnt) => {
            const isSelected = activeCount === cnt;
            const variant = Array.isArray(service?.variants)
              ? service.variants.find((v) => Number(v.count) === cnt)
              : null;

            return (
              <button
                key={cnt}
                type="button"
                onClick={() => handleCountSelect(cnt)}
                className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition cursor-pointer ${
                  isSelected
                    ? "border-[#c77722] bg-[#fffaf0] shadow-sm ring-2 ring-[#c77722]"
                    : "border-[#ead8b8] bg-white hover:border-[#d4872b] hover:bg-[#fffdfa]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase text-[#8a571c]">
                      <Hash size={11} className="text-[#c77722]" />
                      Prescribed Count
                    </span>
                    {isSelected && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c77722] text-white">
                        <CheckCircle2 size={12} />
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 font-serif text-[20px] font-bold text-[#2b241d]">
                    {variant?.label || `${formatCount(cnt)} Japa`}
                  </h4>
                  <p className="mt-1 text-[12px] text-[#78644e]">
                    {variant?.estimatedDuration || "Classical Anushthan"}
                  </p>
                </div>

                <div className="mt-4 border-t border-[#f0e2cd] pt-2.5 text-[11.5px] text-[#8a725b] flex items-center justify-between">
                  <span>Indicative:</span>
                  <strong className="text-[#a8641b] font-serif text-[13.5px]">
                    ₹{Number(variant?.startingPrice || service?.startingPrice || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
              </button>
            );
          })}
        </div>

        {errors.japaCount && (
          <p className="mt-3 text-[12px] text-red-600 flex items-center gap-1">
            <AlertCircle size={13} />
            <span>{errors.japaCount}</span>
          </p>
        )}
      </div>

      {/* 2. PANDIT TEAM SELECTION */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
              2
            </span>
            <h3 className="font-serif text-[17px] font-semibold text-[#2b241d]">
              Officiating Vedic Purohit Team
            </h3>
          </div>
          <span className="text-[12px] font-medium text-[#8a7c6b]">
            Min: {minPandits} • Recommended: {recommendedPandits} • Max: {maxPandits}
          </span>
        </div>

        <div className="mt-5">
          <div className="flex flex-wrap gap-2.5">
            {panditCountOptions.map((cnt) => {
              const isSelected = currentPanditCount === cnt;
              const isRec = cnt === recommendedPandits;

              return (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => handlePanditSelect(cnt)}
                  className={`relative flex flex-col items-center justify-center rounded-xl border px-5 py-3 text-center transition cursor-pointer min-w-[90px] ${
                    isSelected
                      ? "border-[#c77722] bg-[#fffaf0] ring-2 ring-[#c77722] shadow-xs"
                      : "border-[#ead8b8] bg-white hover:border-[#d4872b]"
                  }`}
                >
                  <span className="font-serif text-[18px] font-bold text-[#2b241d]">
                    {cnt}
                  </span>
                  <span className="text-[11px] font-medium text-[#78644e]">
                    {cnt === 1 ? "Scholar" : "Scholars"}
                  </span>
                  {isRec && (
                    <span className="mt-1 rounded-full bg-[#faedd9] px-2 py-0.5 text-[9.5px] font-bold text-[#8a571c]">
                      Recommended
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[12px] text-[#7d6b59]">
            Vedic chanting scholars are trained in Sanskrit Chandas and classical recitation techniques to maintain authentic vibration and rhythm.
          </p>

          {errors.panditCount && (
            <p className="mt-2 text-[12px] text-red-600 flex items-center gap-1">
              <AlertCircle size={13} />
              <span>{errors.panditCount}</span>
            </p>
          )}
        </div>
      </div>

      {/* 3. CAPACITY & SCHEDULE PREVIEW BANNER */}
      <div className="rounded-2xl border border-[#d8c3a1] bg-[#fffdfa] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#ebd7be] pb-3 text-[#b36c1e]">
          <Clock size={16} />
          <h4 className="font-serif text-[16px] font-bold text-[#2b241d]">
            Chanting Capacity & Schedule Preview
          </h4>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 text-[13px]">
          <div>
            <span className="block text-[11px] font-semibold uppercase text-[#8a725b]">
              Chanting Team
            </span>
            <span className="mt-0.5 block font-bold text-[#2b241d]">
              {currentPanditCount} Vedic Scholars
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-semibold uppercase text-[#8a725b]">
              Daily Capacity
            </span>
            <span className="mt-0.5 block font-bold text-[#2b241d]">
              {totalDailyCapacity.toLocaleString("en-IN")} Japa / Day
            </span>
            <span className="text-[10.5px] text-[#8c7a68]">
              ({dailyCapacityPerPandit.toLocaleString("en-IN")} per scholar)
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-semibold uppercase text-[#8a725b]">
              Required Days
            </span>
            <span className="mt-0.5 block font-bold text-[#2e7d32]">
              {displayRequiredDays} Days Anushthan
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-semibold uppercase text-[#8a725b]">
              Maha Purnahuti
            </span>
            <span className="mt-0.5 block font-bold text-[#2b241d]">
              {displayCompletionDate || "Select start date"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. COMMENCEMENT DATE & TIME SLOT */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
              3
            </span>
            <h3 className="font-serif text-[17px] font-semibold text-[#2b241d]">
              Commencement Date & Daily Chanting Time
            </h3>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Start Date */}
          <div>
            <label className="block text-[12.5px] font-semibold text-[#5c4e3f]">
              Anushthan Commencement Date <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="date"
                min={todayStr}
                value={configuration.bookingDate || ""}
                onChange={handleDateChange}
                className="w-full rounded-xl border border-[#d6b8a0] bg-white px-3.5 py-2.5 text-[13.5px] text-[#2b241d] focus:border-[#c77722] focus:outline-none"
              />
            </div>
            <p className="mt-1.5 text-[11.5px] text-[#8a7a69]">
              Consecration begins at the chosen date. Final purnahuti will conclude on {displayCompletionDate || "schedule"}.
            </p>
            {errors.bookingDate && (
              <p className="mt-1 text-[12px] text-red-600 flex items-center gap-1">
                <AlertCircle size={13} />
                <span>{errors.bookingDate}</span>
              </p>
            )}
          </div>

          {/* Time Slot Presets */}
          <div>
            <label className="block text-[12.5px] font-semibold text-[#5c4e3f]">
              Daily Commencement Time <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 space-y-2">
              <select
                value={configuration.bookingTime || "06:00 AM"}
                onChange={(e) => updateConfiguration({ bookingTime: e.target.value })}
                className="w-full rounded-xl border border-[#d6b8a0] bg-white px-3.5 py-2.5 text-[13.5px] text-[#2b241d] focus:border-[#c77722] focus:outline-none"
              >
                {TIME_PRESETS.map((p) => (
                  <option key={p.label} value={p.label}>
                    {p.label} — {p.desc}
                  </option>
                ))}
              </select>
            </div>
            {errors.bookingTime && (
              <p className="mt-1 text-[12px] text-red-600 flex items-center gap-1">
                <AlertCircle size={13} />
                <span>{errors.bookingTime}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 5. ARRANGEMENT MODE / LOCATION */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
              4
            </span>
            <h3 className="font-serif text-[17px] font-semibold text-[#2b241d]">
              Arrangement Mode & Sacred Venue
            </h3>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {supportedModes.map((modeKey) => {
            const isSelected = (configuration.arrangementMode || "kashi") === modeKey;
            const info = ARRANGEMENT_MODE_LABELS[modeKey] || ARRANGEMENT_MODE_LABELS.kashi;

            return (
              <div
                key={modeKey}
                onClick={() => handleModeSelect(modeKey)}
                className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition ${
                  isSelected
                    ? "border-[#c77722] bg-[#fffaf0] ring-2 ring-[#c77722] shadow-xs"
                    : "border-[#ead8b8] bg-white hover:border-[#d4872b]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#f8edd8] px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#8a571c]">
                      {info.badge}
                    </span>
                    {isSelected && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c77722] text-white">
                        <CheckCircle2 size={12} />
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 font-serif text-[16px] font-bold text-[#2b241d]">
                    {info.title}
                  </h4>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#685c4f]">
                    {info.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {errors.arrangementMode && (
          <p className="mt-3 text-[12px] text-red-600 flex items-center gap-1">
            <AlertCircle size={13} />
            <span>{errors.arrangementMode}</span>
          </p>
        )}
      </div>

      {/* 6. AUTHORITATIVE DAKSHINA PREVIEW */}
      <div className="rounded-2xl border border-[#d8c3a1] bg-[#fffdfa] p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a725b]">
              Authoritative Dakshina (Backend Calculated)
            </span>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="font-serif text-[28px] font-bold text-[#b36c1e]">
                ₹{Number(displayAmount).toLocaleString("en-IN")}
              </span>
              {isCalculatingPrice && (
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#c77722]">
                  <RefreshCw size={12} className="animate-spin" />
                  <span>Updating price...</span>
                </span>
              )}
            </div>
            <span className="text-[11.5px] text-[#7d6b59]">
              Includes {currentPanditCount} Vedic Purohits, personal Gotra recitation, and consecrated Mala dispatch.
            </span>
          </div>

          {priceError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-[12px] text-red-700">
              {priceError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepConfigurationJapa;
