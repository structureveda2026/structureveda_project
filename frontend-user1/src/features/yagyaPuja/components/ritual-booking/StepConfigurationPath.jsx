import { useMemo } from "react";
import {
  Clock,
  Calendar,
  Users,
  MapPin,
  AlertCircle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useRitualBooking } from "../../context/RitualBookingContext";

const ARRANGEMENT_MODE_LABELS = {
  kashi: {
    title: "Kashi Sacred Shrines & Ghats (Varanasi)",
    desc: "Sacred recitation recited along the sacred Ganga ghats and consecrated Varanasi mandirs by initiated Vedic Acharyas.",
    badge: "Kashi Sanctum",
  },
  remote: {
    title: "Remote Sankalpa (Live Audio/Video)",
    desc: "Live telecast stream with personalized Gotra Sankalpa recitation and consecrated Prasadam dispatch to your home.",
    badge: "Online & Global",
  },
  customer_home: {
    title: "At Devotee Residence / Premises",
    desc: "Initiated Vedic scholars arrive at your venue with complete classical Granth Pothi setup.",
    badge: "Personal Venue",
  },
  temple: {
    title: "Consecrated Mandir",
    desc: "Conducted in a consecrated temple sanctum adhering to traditional recitation protocols.",
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

const TIME_PRESETS = [
  { label: "06:00 AM", desc: "Brahma Muhurta (Most Auspicious)" },
  { label: "08:30 AM", desc: "Pratah (Morning Recitation Session)" },
  { label: "11:00 AM", desc: "Madhyahna (Noon Session)" },
  { label: "05:30 PM", desc: "Sayankalin (Evening Recitation Session)" },
  { label: "07:30 PM", desc: "Sandhya Aarti & Purnahuti" },
];

const FORMAT_LABELS = {
  single_session: {
    title: "Single Session",
    desc: "Completed continuously in one defined session (approx. 2–4 hours).",
    badge: "Single Day",
  },
  same_day: {
    title: "Same-Day Extended",
    desc: "Extended morning and evening sessions performed within the same day.",
    badge: "Single Day",
  },
  multi_day: {
    title: "Multi-Day Anushthan",
    desc: "Structured across consecutive days with systematic daily chapter targets.",
    badge: "Multi-Day",
  },
  custom_request: {
    title: "Custom Schedule",
    desc: "A tailored timeline evaluated and arranged according to astrological guidance.",
    badge: "Tailored",
  },
};

/**
 * Step 0: Path Configuration Component
 * Exclusively used when serviceType === "PATH"
 */
const StepConfigurationPath = () => {
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

  // 1. Available Formats from backend service
  const availableFormats = useMemo(() => {
    if (Array.isArray(service?.availableFormats) && service.availableFormats.length > 0) {
      return service.availableFormats;
    }
    return ["single_session", "same_day"];
  }, [service]);

  // Current active format
  const activeFormat = useMemo(() => {
    const current = configuration.format || configuration.selectedFormat;
    if (current && availableFormats.includes(current)) {
      return current;
    }
    return availableFormats[0] || "single_session";
  }, [configuration.format, configuration.selectedFormat, availableFormats]);

  const isSingleSession = activeFormat === "single_session" || activeFormat === "same_day";

  // 2. Available Durations from backend service
  const availableDurations = useMemo(() => {
    if (Array.isArray(service?.availableDurations) && service.availableDurations.length > 0) {
      return service.availableDurations;
    }
    return ["3 to 4 Hours"];
  }, [service]);

  // Current active duration
  const activeDuration = useMemo(() => {
    const current = configuration.duration || configuration.durationSelected;
    if (current && availableDurations.includes(current)) {
      return current;
    }
    return availableDurations[0] || "3 to 4 Hours";
  }, [configuration.duration, configuration.durationSelected, availableDurations]);

  // 3. Days constraints
  const minDays = Number(service?.minimumDays) || 1;
  const maxDays = isSingleSession ? 1 : Math.max(minDays, Number(service?.maximumDays) || 9);
  const recDays = isSingleSession
    ? 1
    : Math.min(Math.max(minDays, Number(service?.recommendedDays) || minDays), maxDays);

  const activeDays = useMemo(() => {
    if (isSingleSession) return 1;
    const current = Number(configuration.days);
    if (!isNaN(current) && current >= minDays && current <= maxDays) {
      return current;
    }
    return recDays;
  }, [isSingleSession, configuration.days, minDays, maxDays, recDays]);

  // 4. Pandit constraints from live service
  const minPandits = Number(service?.minimumPandits) || 1;
  const maxPandits = Math.max(minPandits, Number(service?.maximumPandits) || 5);
  const recPandits = Math.min(
    Math.max(minPandits, Number(service?.recommendedPandits) || minPandits),
    maxPandits
  );

  const activePandits = useMemo(() => {
    const current = Number(configuration.panditCount);
    if (!isNaN(current) && current >= minPandits && current <= maxPandits) {
      return current;
    }
    return recPandits;
  }, [configuration.panditCount, minPandits, maxPandits, recPandits]);

  // 5. Commencement date and completion preview
  const activeCommencementDate =
    configuration.bookingDate || configuration.commencementDate || minDateStr;

  const previewCompletionDate = useMemo(() => {
    if (!activeCommencementDate || !activeDays) return "";
    try {
      const d = new Date(activeCommencementDate);
      if (isNaN(d.getTime())) return "";
      d.setDate(d.getDate() + (Number(activeDays) - 1));
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  }, [activeCommencementDate, activeDays]);

  // Format date helper for preview
  const formatDatePreview = (dateStr) => {
    if (!dateStr) return "To be derived";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
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

  // Handlers
  const handleFormatChange = (fmt) => {
    const single = fmt === "single_session" || fmt === "same_day";
    const newDays = single ? 1 : Math.max(minDays, Number(configuration.days) || recDays);
    updateConfiguration({
      format: fmt,
      selectedFormat: fmt,
      days: newDays,
      durationDays: newDays,
    });
  };

  const handleDurationChange = (dur) => {
    updateConfiguration({
      duration: dur,
      durationSelected: dur,
    });
  };

  const handleDaysChange = (newDays) => {
    const d = Math.max(minDays, Math.min(maxDays, Number(newDays)));
    updateConfiguration({
      days: d,
      durationDays: d,
    });
  };

  const handlePanditsChange = (newCount) => {
    const p = Math.max(minPandits, Math.min(maxPandits, Number(newCount)));
    updateConfiguration({
      panditCount: p,
    });
  };

  const handleDateChange = (date) => {
    updateConfiguration({
      bookingDate: date,
      commencementDate: date,
    });
  };

  const handleTimeChange = (time) => {
    updateConfiguration({
      bookingTime: time,
      timeSlot: time,
    });
  };

  const handleArrangementChange = (mode) => {
    updateConfiguration({
      arrangementMode: mode,
      locationType: mode,
    });
  };

  return (
    <div className="space-y-10">
      {/* Scripture & Service Overview Header Banner */}
      <div className="rounded-2xl border border-[#d8b584] bg-[#faf2e3] p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e5a1e]">
              SACRED SCRIPTURE RECITATION
            </span>
            <h2 className="mt-1 font-serif text-[22px] font-bold text-[#2b241d]">
              {service?.name || "Vedic Path"}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[12.5px] text-[#553b1e]">
              <span className="font-semibold text-[#8e5a1e]">
                Granth: {service?.scripture || "Classical Vedic Scripture"}
              </span>
              <span>•</span>
              <span>Type: {service?.pathType || "Vedic Path"}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <BookOpen size={13} className="text-[#c77722]" />
                Structure: {service?.chapterStructure || "Complete Sacred Chapters"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e4d1b8] bg-white px-4 py-2 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a725b]">
              Canonical Dakshina
            </span>
            <div className="font-serif text-[20px] font-bold text-[#2b241d]">
              {isCalculatingPrice ? (
                <span className="text-[14px] text-amber-700 animate-pulse">Calculating...</span>
              ) : (
                `₹${(
                  priceBreakdown?.totalAmount ??
                  priceBreakdown?.calculatedAmount ??
                  service?.startingPrice ??
                  5100
                ).toLocaleString("en-IN")}`
              )}
            </div>
            <span className="text-[10px] text-[#7a6f62]">
              Priest squad included in base dakshina
            </span>
          </div>
        </div>
      </div>

      {/* 1. RECITATION FORMAT SELECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[14px] font-bold text-[#2b241d]">
            <BookOpen size={17} className="text-[#c77722]" />
            <span>Select Recitation Format</span>
            <span className="text-red-500">*</span>
          </label>
          <span className="text-[11.5px] text-[#786958]">
            Supported specifically for {service?.name}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
          {availableFormats.map((fmt) => {
            const isSelected = activeFormat === fmt;
            const meta = FORMAT_LABELS[fmt] || {
              title: fmt.replace(/_/g, " ").toUpperCase(),
              desc: "Traditional recitation arrangement.",
              badge: "Standard",
            };

            return (
              <button
                key={fmt}
                type="button"
                onClick={() => handleFormatChange(fmt)}
                className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition cursor-pointer ${
                  isSelected
                    ? "border-[#c77722] bg-[#fffaf1] shadow-xs ring-1 ring-[#c77722]"
                    : "border-[#e0ceb5] bg-white hover:border-[#c77722]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#f8edd8] px-2.5 py-0.5 text-[10.5px] font-bold text-[#8a571c]">
                      {meta.badge}
                    </span>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c77722] text-white">
                        <CheckCircle2 size={13} />
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 font-serif text-[16px] font-bold text-[#2b241d]">
                    {meta.title}
                  </h4>
                  <p className="mt-1 text-[12px] text-[#6d5b4a] leading-relaxed">
                    {meta.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {errors.format && (
          <p className="text-[12px] font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle size={13} /> {errors.format}
          </p>
        )}
      </div>

      {/* 2. RECITATION DURATION SELECTION */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-[14px] font-bold text-[#2b241d]">
          <Clock size={17} className="text-[#c77722]" />
          <span>Select Recitation Duration</span>
          <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-wrap gap-2.5">
          {availableDurations.map((dur) => {
            const isSelected = activeDuration === dur;
            return (
              <button
                key={dur}
                type="button"
                onClick={() => handleDurationChange(dur)}
                className={`rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition cursor-pointer ${
                  isSelected
                    ? "border-[#c77722] bg-[#2b241d] text-[#f8edd8] shadow-xs"
                    : "border-[#e0ceb5] bg-white text-[#5c4e3f] hover:border-[#c77722]"
                }`}
              >
                {dur}
              </button>
            );
          })}
        </div>

        {errors.duration && (
          <p className="text-[12px] font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle size={13} /> {errors.duration}
          </p>
        )}
      </div>

      {/* 3. DAYS SELECTION (Coupling Rule enforced) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[14px] font-bold text-[#2b241d]">
            <Calendar size={17} className="text-[#c77722]" />
            <span>Recitation Days</span>
            <span className="text-red-500">*</span>
          </label>
          <span className="text-[11.5px] text-[#786958]">
            {isSingleSession
              ? "Single session / same-day must be completed in 1 day"
              : `Allowed: ${minDays} to ${maxDays} Days (Recommended: ${recDays})`}
          </span>
        </div>

        {isSingleSession ? (
          <div className="rounded-xl border border-[#ebd6be] bg-[#fffaf1] p-3 text-[13px] text-[#6d5b4a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8edd8] font-bold text-[#b36c1e]">
                1
              </span>
              <span><strong>1 Day:</strong> Single-session / Same-day continuous recitation</span>
            </div>
            <span className="text-[11px] font-semibold text-[#8a571c] uppercase tracking-wider">
              Enforced Format
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-7">
            {Array.from({ length: maxDays - minDays + 1 }, (_, i) => minDays + i).map((d) => {
              const isSelected = activeDays === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDaysChange(d)}
                  className={`rounded-xl border py-3 text-center transition cursor-pointer ${
                    isSelected
                      ? "border-[#c77722] bg-[#c77722] text-white font-bold shadow-xs"
                      : "border-[#e0ceb5] bg-white text-[#2b241d] hover:border-[#c77722]"
                  }`}
                >
                  <span className="block text-[15px]">{d}</span>
                  <span className="block text-[10px] uppercase tracking-wider opacity-80">
                    Day{d > 1 ? "s" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {errors.days && (
          <p className="text-[12px] font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle size={13} /> {errors.days}
          </p>
        )}
      </div>

      {/* 4. PANDIT TEAM SELECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[14px] font-bold text-[#2b241d]">
            <Users size={17} className="text-[#c77722]" />
            <span>Officiating Pandit Squad</span>
            <span className="text-red-500">*</span>
          </label>
          <span className="text-[11.5px] text-[#786958]">
            Minimum: {minPandits}, Recommended: {recPandits}, Max: {maxPandits} Scholars
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: maxPandits - minPandits + 1 }, (_, i) => minPandits + i).map((p) => {
            const isSelected = activePandits === p;
            const isRecommended = p === recPandits;

            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePanditsChange(p)}
                className={`relative flex flex-col items-center justify-center rounded-xl border p-3.5 transition cursor-pointer ${
                  isSelected
                    ? "border-[#c77722] bg-[#fffaf1] shadow-xs ring-1 ring-[#c77722]"
                    : "border-[#e0ceb5] bg-white hover:border-[#c77722]"
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-2 rounded-full bg-[#b36c1e] px-2 py-0.2 text-[9.5px] font-bold text-white uppercase tracking-wider">
                    Recommended
                  </span>
                )}
                <span className="font-serif text-[18px] font-bold text-[#2b241d]">{p}</span>
                <span className="text-[11.5px] text-[#6d5b4a]">
                  Vedic Pandit{p > 1 ? "s" : ""}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-[11.5px] text-[#7a6f62] italic">
          * Note: Officiating scholar dakshina is included in the base Path amount without additional surcharge.
        </p>

        {errors.panditCount && (
          <p className="text-[12px] font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle size={13} /> {errors.panditCount}
          </p>
        )}
      </div>

      {/* 5. COMMENCEMENT DATE & COMPLETION DATE PREVIEW */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Commencement Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[14px] font-bold text-[#2b241d]">
            <Calendar size={17} className="text-[#c77722]" />
            <span>Commencement Date</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            min={minDateStr}
            value={activeCommencementDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full rounded-xl border border-[#d6b8a0] bg-white px-4 py-2.5 text-[14px] text-[#2b241d] transition focus:border-[#c77722] focus:outline-none"
          />
          <p className="text-[11px] text-[#7a6f62]">
            Select an auspicious tithi for beginning the sacred recitation.
          </p>
          {errors.bookingDate && (
            <p className="text-[12px] font-semibold text-red-600 flex items-center gap-1">
              <AlertCircle size={13} /> {errors.bookingDate}
            </p>
          )}
        </div>

        {/* Server Completion Date Preview */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[14px] font-bold text-[#2b241d]">
            <Sparkles size={17} className="text-[#c77722]" />
            <span>Maha Purnahuti (Completion Preview)</span>
          </label>
          <div className="rounded-xl border border-[#ebd6be] bg-[#faf3e5] px-4 py-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8a571c]">
              SERVER-DERIVED COMPLETION DATE
            </span>
            <p className="font-serif text-[16px] font-bold text-[#2b241d]">
              {formatDatePreview(priceBreakdown?.completionDate || previewCompletionDate)}
            </p>
            <span className="block text-[10.5px] text-[#7a6f62]">
              Authoritatively calculated as {activeDays} Day{activeDays > 1 ? "s" : ""} from start.
            </span>
          </div>
        </div>
      </div>

      {/* 6. MUHURAT / COMMENCEMENT TIME */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-[14px] font-bold text-[#2b241d]">
          <Clock size={17} className="text-[#c77722]" />
          <span>Muhurat / Commencement Time</span>
          <span className="text-red-500">*</span>
        </label>

        <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {TIME_PRESETS.map((t) => {
            const isSelected =
              (configuration.bookingTime || configuration.timeSlot || "06:00 AM") === t.label;
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => handleTimeChange(t.label)}
                className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition cursor-pointer ${
                  isSelected
                    ? "border-[#c77722] bg-[#2b241d] text-[#f8edd8] shadow-xs"
                    : "border-[#e0ceb5] bg-white text-[#2b241d] hover:border-[#c77722]"
                }`}
              >
                <span className="font-serif text-[15px] font-bold">{t.label}</span>
                <span className="mt-0.5 text-[10px] opacity-80">{t.desc}</span>
              </button>
            );
          })}
        </div>

        {errors.bookingTime && (
          <p className="text-[12px] font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle size={13} /> {errors.bookingTime}
          </p>
        )}
      </div>

      {/* 7. ARRANGEMENT MODE */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-[14px] font-bold text-[#2b241d]">
          <MapPin size={17} className="text-[#c77722]" />
          <span>Arrangement & Venue Mode</span>
          <span className="text-red-500">*</span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(ARRANGEMENT_MODE_LABELS).map(([modeKey, info]) => {
            if (modeKey === "kashi" && service?.isKashiAvailable === false) return null;
            if (modeKey === "remote" && service?.isRemoteAvailable === false) return null;

            const isSelected =
              (configuration.arrangementMode || configuration.locationType || "kashi") === modeKey;

            return (
              <button
                key={modeKey}
                type="button"
                onClick={() => handleArrangementChange(modeKey)}
                className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition cursor-pointer ${
                  isSelected
                    ? "border-[#c77722] bg-[#fffaf1] shadow-xs ring-1 ring-[#c77722]"
                    : "border-[#e0ceb5] bg-white hover:border-[#c77722]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#f8edd8] px-2.5 py-0.5 text-[10.5px] font-bold text-[#8a571c]">
                      {info.badge}
                    </span>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c77722] text-white">
                        <CheckCircle2 size={13} />
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 font-serif text-[15px] font-bold text-[#2b241d]">
                    {info.title}
                  </h4>
                  <p className="mt-1 text-[12px] text-[#6d5b4a] leading-relaxed">
                    {info.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {errors.arrangementMode && (
          <p className="text-[12px] font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle size={13} /> {errors.arrangementMode}
          </p>
        )}
      </div>

      {/* Pricing / Calculation Status Notification */}
      {isCalculatingPrice && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[13px] text-amber-800 flex items-center gap-2">
          <RefreshCw size={16} className="animate-spin text-amber-600 shrink-0" />
          <span>Calculating authoritative Dakshina from the Vedic registry...</span>
        </div>
      )}

      {priceError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] text-red-800 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{priceError}</span>
        </div>
      )}
    </div>
  );
};

export default StepConfigurationPath;
