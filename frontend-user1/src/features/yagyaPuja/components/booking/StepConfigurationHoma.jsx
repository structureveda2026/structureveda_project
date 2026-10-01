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
  RefreshCw,
} from "lucide-react";
import { useRitualBooking } from "../../context/RitualBookingContext";

const ARRANGEMENT_MODE_LABELS = {
  kashi: {
    title: "Kashi Sacred Shrines & Ghats (Varanasi)",
    desc: "Sacred fire altar ignited along the sacred Ganga ghats and consecrated Varanasi temples by initiated Vedic Acharyas.",
    badge: "Kashi Sanctum",
  },
  remote: {
    title: "Remote Sankalpa (Live Audio/Video)",
    desc: "Live stream telecast with personal Gotra Sankalpa recitation and energized Homa Bhasma dispatch to your home.",
    badge: "Online & Global",
  },
  customer_home: {
    title: "At Devotee Residence / Premises",
    desc: "Initiated Vedic priests arrive at your venue with complete traditional Homa Kunda setup and samagri.",
    badge: "Personal Venue",
  },
  temple: {
    title: "Consecrated Mandir",
    desc: "Conducted in a consecrated temple sanctum adhering to strict Agamic fire protocols.",
    badge: "Temple Sanctum",
  },
  veda_structure: {
    title: "Veda Structure Consecrated Centre",
    desc: "Arranged inside our dedicated Vedic sanctuary with authentic acoustic chanting halls.",
    badge: "Veda Centre",
  },
  other: {
    title: "Other Sacred Venue",
    desc: "Coordinated at an auspicious Tirtha or ancestral venue according to classical tradition.",
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
  { label: "08:30 AM", desc: "Pratah (Morning Fire Offering)" },
  { label: "11:00 AM", desc: "Madhyahna (Noon Ahuti)" },
  { label: "05:30 PM", desc: "Sayankalin (Evening Fire Ritual)" },
  { label: "07:30 PM", desc: "Sandhya Purnahuti" },
];

/**
 * Calculates completion date (commencement date + days - 1)
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
 * Step 0: Homa Configuration Component
 * Exclusively used when serviceType === "HOMA"
 */
const StepConfigurationHoma = () => {
  const {
    service,
    configuration,
    updateConfiguration,
    priceBreakdown,
    isCalculatingPrice,
    priceError,
    errors,
  } = useRitualBooking();

  // Minimum selectable commencement date is tomorrow
  const minDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  // 1. Available Havan Counts derived dynamically from live Homa service
  const availableHavanCounts = useMemo(() => {
    if (Array.isArray(service?.availableHavanCounts) && service.availableHavanCounts.length > 0) {
      return service.availableHavanCounts
        .map((v) => (v === "custom" || v === "Custom" ? "custom" : Number(v)))
        .filter((n) => n === "custom" || (!isNaN(n) && n > 0));
    }
    return [1];
  }, [service]);

  // Current active Havan count
  const activeHavanCount = useMemo(() => {
    if (configuration.havanCount && availableHavanCounts.includes(configuration.havanCount)) {
      return configuration.havanCount;
    }
    return availableHavanCounts[0] || 1;
  }, [configuration.havanCount, availableHavanCounts]);

  // 2. Available Days derived dynamically from live Homa service
  const availableDays = useMemo(() => {
    if (Array.isArray(service?.availableDays) && service.availableDays.length > 0) {
      return service.availableDays.map(Number).filter((n) => !isNaN(n) && n > 0);
    }
    return [1];
  }, [service]);

  // Active days: If havanCount === 1, only 1 Day is permitted
  const isSingleHavan = Number(activeHavanCount) === 1;
  const activeDays = useMemo(() => {
    if (isSingleHavan) return 1;
    const current = Number(configuration.days);
    if (current && availableDays.includes(current)) {
      return current;
    }
    return availableDays[0] || 1;
  }, [isSingleHavan, configuration.days, availableDays]);

  // 3. Pandit constraints from live service data
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

  // 4. Daily Capacity & Operational Capacity preview
  const havanCapacityPerPandit = useMemo(() => {
    return service?.havanCapacityPerPandit || "500 Ahutis per Pandit / Day";
  }, [service]);

  // Parse numeric capacity if available for display
  const numericCapacity = useMemo(() => {
    const matches = String(havanCapacityPerPandit).match(/\d+/g);
    if (matches && matches.length > 0) {
      return parseInt(matches[matches.length - 1], 10);
    }
    return 500;
  }, [havanCapacityPerPandit]);

  const totalOperationalCapacity = activePanditCount * numericCapacity;

  // 5. Completion date: backend-authoritative response takes precedence
  const displayCompletionDate =
    priceBreakdown?.completionDate ||
    calculateCompletionDate(
      configuration.bookingDate || configuration.commencementDate,
      activeDays
    );

  // 6. Supported canonical arrangement modes derived from service
  const supportedModes = useMemo(() => {
    const list = [];
    if (service?.isKashiAvailable !== false && service?.kashiAvailable !== false) {
      list.push("kashi");
    }
    if (service?.isRemoteAvailable !== false && service?.remoteAvailable !== false) {
      list.push("remote");
    }
    return list.length > 0 ? list : ["kashi", "remote"];
  }, [service]);

  // Handle Havan Count selection
  const handleHavanCountSelect = (cnt) => {
    const numCount = cnt === "custom" ? "custom" : Number(cnt);
    // If selecting 1 Havan, force days to 1
    const nextDays = numCount === 1 ? 1 : activeDays;
    const newCompletion = calculateCompletionDate(
      configuration.bookingDate || configuration.commencementDate,
      nextDays
    );

    updateConfiguration({
      havanCount: numCount,
      days: nextDays,
      durationDays: nextDays,
      durationSelected: `${numCount} Havan, ${nextDays} Day(s)`,
      completionDate: newCompletion,
    });
  };

  // Handle Days Duration selection
  const handleDaysSelect = (d) => {
    if (isSingleHavan && d > 1) return; // Disallow multi-day for 1 Havan
    const numDays = Number(d);
    const newCompletion = calculateCompletionDate(
      configuration.bookingDate || configuration.commencementDate,
      numDays
    );

    updateConfiguration({
      days: numDays,
      durationDays: numDays,
      durationSelected: `${activeHavanCount} Havan, ${numDays} Day(s)`,
      completionDate: newCompletion,
    });
  };

  // Handle Pandit Count Stepper
  const handlePanditIncrement = () => {
    if (activePanditCount < maxPandits) {
      updateConfiguration({
        panditCount: activePanditCount + 1,
      });
    }
  };

  const handlePanditDecrement = () => {
    if (activePanditCount > minPandits) {
      updateConfiguration({
        panditCount: activePanditCount - 1,
      });
    }
  };

  // Handle Commencement Date selection
  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    const newCompletion = calculateCompletionDate(dateVal, activeDays);
    updateConfiguration({
      bookingDate: dateVal,
      commencementDate: dateVal,
      completionDate: newCompletion,
    });
  };

  // Handle Time Slot selection
  const handleTimeSelect = (timeStr) => {
    updateConfiguration({
      bookingTime: timeStr,
      timeSlot: timeStr,
    });
  };

  // Handle Arrangement Mode selection
  const handleModeSelect = (modeKey) => {
    updateConfiguration({
      arrangementMode: modeKey,
      locationType: modeKey,
    });
  };

  // Authoritative Dakshina from backend response
  const displayAmount =
    priceBreakdown?.totalAmount != null
      ? priceBreakdown.totalAmount
      : priceBreakdown?.calculatedAmount != null
      ? priceBreakdown.calculatedAmount
      : service?.startingPrice || 11000;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
          <Sparkles size={12} className="text-[#c77722]" />
          <span>VEDIC HOMA / HAVAN CONFIGURATION</span>
        </div>
        <h2 className="mt-1 font-serif text-[22px] font-bold text-[#2b241d]">
          Configure Sacred Fire Offering & Priestly Team
        </h2>
        <p className="mt-1 text-[13.5px] text-[#6d5b4a]">
          Select from this Homa's authorized Ahuti counts, duration days, and designated Vedic scholars.
        </p>
      </div>

      {/* 1. HAVAN COUNT SELECTION */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
              <Flame size={15} />
            </div>
            <div>
              <h3 className="font-serif text-[16px] font-bold text-[#2b241d]">
                1. Number of Havans (Sacred Offerings)
              </h3>
              <p className="text-[12px] text-[#8a7a68]">
                Prescribed ritual Ahuti scale traditionally authorized for {service?.name || "this Homa"}.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[#f8edd8] px-3 py-1 text-[11px] font-bold text-[#b36c1e]">
            {activeHavanCount} Havan Selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
          {availableHavanCounts.map((cnt) => {
            const isSelected = activeHavanCount === cnt;
            return (
              <button
                key={cnt}
                type="button"
                onClick={() => handleHavanCountSelect(cnt)}
                className={`relative flex flex-col items-center justify-center rounded-xl border p-3.5 transition-all text-center cursor-pointer ${
                  isSelected
                    ? "border-[#c77722] bg-[#fbf5ea] shadow-xs ring-1 ring-[#c77722]"
                    : "border-[#ead8b8] bg-white hover:border-[#c77722] hover:bg-[#fffcf7]"
                }`}
              >
                {isSelected && (
                  <CheckCircle2
                    size={15}
                    className="absolute right-2 top-2 text-[#c77722]"
                  />
                )}
                <Flame
                  size={18}
                  className={isSelected ? "text-[#c77722]" : "text-[#8a725b]"}
                />
                <span className="mt-1 font-serif text-[16px] font-bold text-[#2b241d]">
                  {cnt === "custom" ? "Custom" : `${cnt} Havan`}
                </span>
                <span className="mt-0.5 text-[11px] text-[#7d6854]">
                  {cnt === 1
                    ? "Pratham Homa"
                    : cnt === 3
                    ? "Tri-Kala Cycle"
                    : cnt === 5
                    ? "Pancha Kunda"
                    : `${cnt} Ahuti Cycles`}
                </span>
              </button>
            );
          })}
        </div>

        {errors.havanCount && (
          <p className="text-[12px] text-red-600 flex items-center gap-1 mt-1">
            <AlertCircle size={13} />
            <span>{errors.havanCount}</span>
          </p>
        )}
      </div>

      {/* 2. DURATION / DAYS SELECTION */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
              <Calendar size={15} />
            </div>
            <div>
              <h3 className="font-serif text-[16px] font-bold text-[#2b241d]">
                2. Ritual Duration (Days)
              </h3>
              <p className="text-[12px] text-[#8a7a68]">
                {isSingleHavan
                  ? "A single Havan is performed in a comprehensive 1-day sacred session."
                  : "Spread your multiple Havans over consecutive auspicious days."}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[#f8edd8] px-3 py-1 text-[11px] font-bold text-[#b36c1e]">
            {activeDays} Day(s)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {availableDays.map((d) => {
            const isSelected = activeDays === d;
            const isDisabled = isSingleHavan && d > 1;

            return (
              <button
                key={d}
                type="button"
                disabled={isDisabled}
                onClick={() => handleDaysSelect(d)}
                className={`relative flex flex-col items-center justify-center rounded-xl border p-4 transition-all text-center ${
                  isDisabled
                    ? "border-gray-200 bg-gray-50 opacity-45 cursor-not-allowed"
                    : isSelected
                    ? "border-[#c77722] bg-[#fbf5ea] shadow-xs ring-1 ring-[#c77722] cursor-pointer"
                    : "border-[#ead8b8] bg-white hover:border-[#c77722] hover:bg-[#fffcf7] cursor-pointer"
                }`}
              >
                {isSelected && !isDisabled && (
                  <CheckCircle2
                    size={15}
                    className="absolute right-2 top-2 text-[#c77722]"
                  />
                )}
                <span className="font-serif text-[18px] font-bold text-[#2b241d]">
                  {d} {d === 1 ? "Day" : "Days"}
                </span>
                <span className="mt-1 text-[11.5px] text-[#7d6854]">
                  {d === 1
                    ? "Single Day Session"
                    : d === 2
                    ? "2-Day Anushthan"
                    : `${d}-Day Extended Anushthan`}
                </span>
                {isDisabled && (
                  <span className="mt-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    Requires 3+ Havans
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isSingleHavan && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[12px] text-amber-900 flex items-start gap-2">
            <AlertCircle size={15} className="text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Vedic Protocol:</strong> 1 Havan is performed in a dedicated single-day session. To schedule an extended multi-day Anushthan, please select 3 or more Havans above.
            </span>
          </div>
        )}

        {errors.days && (
          <p className="text-[12px] text-red-600 flex items-center gap-1 mt-1">
            <AlertCircle size={13} />
            <span>{errors.days}</span>
          </p>
        )}
      </div>

      {/* 3. PANDIT TEAM SELECTION (NO SURCHARGE) */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
              <Users size={15} />
            </div>
            <div>
              <h3 className="font-serif text-[16px] font-bold text-[#2b241d]">
                3. Officiating Vedic Priests (Acharyas)
              </h3>
              <p className="text-[12px] text-[#8a7a68]">
                Sanctioned team range: {minPandits} to {maxPandits} Pandits (Recommended: {recommendedPandits}).
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
            ₹0 Surcharge
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#ead8b8] bg-[#fffdf9] p-4">
          <div>
            <div className="font-serif text-[17px] font-bold text-[#2b241d]">
              {activePanditCount} Vedic Acharyas
            </div>
            <div className="text-[12px] text-[#7d6854] mt-0.5">
              {activePanditCount === recommendedPandits
                ? "✨ Recommended scholar team for authentic synchronized chanting"
                : `${activePanditCount} priests chanting sacred Ahuti slokas`}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={activePanditCount <= minPandits}
              onClick={handlePanditDecrement}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4872b] bg-white font-serif text-[18px] font-bold text-[#b36c1e] hover:bg-[#fbf5ea] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
              aria-label="Decrease Pandit count"
            >
              -
            </button>
            <span className="min-w-8 text-center font-serif text-[20px] font-bold text-[#2b241d]">
              {activePanditCount}
            </span>
            <button
              type="button"
              disabled={activePanditCount >= maxPandits}
              onClick={handlePanditIncrement}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4872b] bg-[#c77722] font-serif text-[18px] font-bold text-white hover:bg-[#b36c1e] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
              aria-label="Increase Pandit count"
            >
              +
            </button>
          </div>
        </div>

        {/* Informational Operational Capacity & Daily Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="rounded-xl border border-[#ead8b8] bg-[#fcf8f0] p-3 text-[12px]">
            <span className="text-[#8a725b] font-medium block">Daily Chanting Cadence:</span>
            <span className="font-semibold text-[#2b241d] block mt-0.5">
              {service?.dailyHours || "3 – 4 Hours Daily"}
            </span>
          </div>
          <div className="rounded-xl border border-[#ead8b8] bg-[#fcf8f0] p-3 text-[12px]">
            <span className="text-[#8a725b] font-medium block">Daily Operational Ahuti Capacity:</span>
            <span className="font-semibold text-[#2b241d] block mt-0.5">
              Approx. {totalOperationalCapacity.toLocaleString("en-IN")} Ahutis / Day ({havanCapacityPerPandit})
            </span>
          </div>
        </div>

        {errors.panditCount && (
          <p className="text-[12px] text-red-600 flex items-center gap-1 mt-1">
            <AlertCircle size={13} />
            <span>{errors.panditCount}</span>
          </p>
        )}
      </div>

      {/* 4. COMMENCEMENT DATE & AUSPICIOUS TIME SLOT */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
            <Clock size={15} />
          </div>
          <div>
            <h3 className="font-serif text-[16px] font-bold text-[#2b241d]">
              4. Commencement Date & Auspicious Muhurta
            </h3>
            <p className="text-[12px] text-[#8a7a68]">
              Select the initial start date and daily fire kindling time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-[12px] font-semibold text-[#44362b] mb-1.5">
              Commencement Date (Minimum Tomorrow)
            </label>
            <input
              type="date"
              min={minDateStr}
              value={configuration.bookingDate || configuration.commencementDate || ""}
              onChange={handleDateChange}
              className="w-full rounded-xl border border-[#ebdcc4] bg-white px-3.5 py-2.5 text-[13.5px] text-[#2b241d] focus:border-[#b36c1e] focus:outline-none shadow-2xs"
            />
            {displayCompletionDate && (
              <p className="mt-1.5 text-[11.5px] text-[#2e7d32] font-medium flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>
                  Maha Purnahuti Scheduled: <strong>{displayCompletionDate}</strong> ({activeDays} Day Anushthan)
                </span>
              </p>
            )}
            {errors.bookingDate && (
              <p className="text-[12px] text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle size={13} />
                <span>{errors.bookingDate}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#44362b] mb-1.5">
              Auspicious Commencement Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_PRESETS.slice(0, 4).map((preset) => {
                const isSelected = configuration.bookingTime === preset.label;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleTimeSelect(preset.label)}
                    className={`rounded-lg border px-2.5 py-2 text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? "border-[#c77722] bg-[#fbf5ea] font-semibold text-[#2b241d] ring-1 ring-[#c77722]"
                        : "border-[#ebdcc4] bg-white text-[#685c4f] hover:border-[#c77722]"
                    }`}
                  >
                    <div className="font-bold">{preset.label}</div>
                    <div className="text-[10px] text-[#8a725b] truncate">{preset.desc}</div>
                  </button>
                );
              })}
            </div>
            {errors.bookingTime && (
              <p className="text-[12px] text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle size={13} />
                <span>{errors.bookingTime}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 5. ARRANGEMENT & LOCATION MODE */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
            <MapPin size={15} />
          </div>
          <div>
            <h3 className="font-serif text-[16px] font-bold text-[#2b241d]">
              5. Arrangement & Venue Mode
            </h3>
            <p className="text-[12px] text-[#8a7a68]">
              Select whether you wish this Homa conducted in sacred Kashi or remotely over live telecast.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {supportedModes.map((modeKey) => {
            const isSelected =
              configuration.arrangementMode === modeKey ||
              configuration.locationType === modeKey;
            const meta = ARRANGEMENT_MODE_LABELS[modeKey] || {
              title: LOCATION_TYPE_LABELS[modeKey] || modeKey,
              desc: "Traditional Vedic ceremonial arrangement.",
              badge: "Vedic Venue",
            };

            return (
              <button
                key={modeKey}
                type="button"
                onClick={() => handleModeSelect(modeKey)}
                className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition cursor-pointer ${
                  isSelected
                    ? "border-[#c77722] bg-[#fbf5ea] shadow-xs ring-1 ring-[#c77722]"
                    : "border-[#ead8b8] bg-white hover:border-[#c77722] hover:bg-[#fffcf7]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#f8edd8] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#b36c1e]">
                      {meta.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2 size={16} className="text-[#c77722]" />
                    )}
                  </div>
                  <h4 className="mt-2 font-serif text-[15px] font-bold text-[#2b241d]">
                    {meta.title}
                  </h4>
                  <p className="mt-1 text-[12px] text-[#7d6854] leading-relaxed">
                    {meta.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {errors.arrangementMode && (
          <p className="text-[12px] text-red-600 flex items-center gap-1 mt-1">
            <AlertCircle size={13} />
            <span>{errors.arrangementMode}</span>
          </p>
        )}
      </div>

      {/* 6. DAKSHINA OVERVIEW (AUTHORITATIVE) */}
      <div className="rounded-2xl border border-[#ead8b8] bg-gradient-to-r from-[#faf3e3] to-[#fffdf9] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8a725b] block">
            Authoritative Calculated Dakshina
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-serif text-[26px] font-bold text-[#2b241d]">
              ₹{Number(displayAmount).toLocaleString("en-IN")}
            </span>
            {isCalculatingPrice && (
              <span className="text-xs text-[#b36c1e] inline-flex items-center gap-1 font-medium">
                <RefreshCw size={12} className="animate-spin" />
                Calculating...
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-[#7d6854] mt-0.5">
            Base: ₹{Number(priceBreakdown?.basePrice || service?.basePrice || 11000).toLocaleString("en-IN")} • Extra Havans: +₹{Number(priceBreakdown?.havanAddonPrice || 0).toLocaleString("en-IN")} • Multi-Day: +₹{Number(priceBreakdown?.dayAddonPrice || 0).toLocaleString("en-IN")} • Pandit Team: ₹0
          </p>
        </div>

        {priceBreakdown?.pricingSource && (
          <div className="sm:text-right">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10.5px] font-mono font-semibold text-emerald-800">
              {priceBreakdown.pricingSource}
            </span>
          </div>
        )}
      </div>

      {priceError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] text-red-700 flex items-center gap-2">
          <AlertCircle size={15} className="text-red-600 shrink-0" />
          <span>{priceError}</span>
        </div>
      )}
    </div>
  );
};

export default StepConfigurationHoma;
