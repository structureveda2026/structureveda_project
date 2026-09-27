import { Clock, Calendar, Users, MapPin, AlertCircle, Sparkles } from "lucide-react";
import {
  useRitualBooking,
  CANONICAL_ARRANGEMENT_MODES,
  CANONICAL_LOCATION_TYPES,
} from "../../context/RitualBookingContext";

const ARRANGEMENT_MODE_LABELS = {
  remote: {
    title: "Remote Sankalpa",
    desc: "Live stream darshan, personal Gotra recitation, and sanctified Prasad delivery to your address.",
    badge: "Online & Global",
  },
  kashi: {
    title: "Kashi Ghats & Shrines",
    desc: "Conducted in-person at consecrated Kashi Manikarnika / Dashashwamedh / Temple shrines in Varanasi.",
    badge: "Kashi Special",
  },
  customer_home: {
    title: "At Devotee Residence",
    desc: "Learned Vedic Purohit team arrives at your home with complete authentic ceremonial preparation.",
    badge: "Personal Venue",
  },
  temple: {
    title: "Consecrated Mandir",
    desc: "Arranged inside a consecrated temple with dedicated sanctum access and complete ritual acoustics.",
    badge: "Sacred Shrine",
  },
  veda_structure: {
    title: "Veda Structure Centre",
    desc: "Conducted in our dedicated Vedic sanctuary with traditional acoustic mandapam architecture.",
    badge: "Veda Centre",
  },
  other: {
    title: "Other Sacred Venue",
    desc: "Custom sacred location coordinated according to your family lineage or ancestral traditions.",
    badge: "Custom",
  },
};

const LOCATION_TYPE_LABELS = {
  kashi: "Kashi (Varanasi) Ghats & Shrines",
  customer_home: "Devotee Personal Residence",
  temple: "Consecrated Mandir / Temple",
  veda_structure: "Veda Structure Consecrated Centre",
  remote: "Remote Virtual Sanctuary",
  other: "Custom Sacred Location",
};

const TIME_PRESETS = [
  { label: "06:00 AM", desc: "Brahma Muhurta" },
  { label: "08:30 AM", desc: "Pratah (Morning)" },
  { label: "11:00 AM", desc: "Madhyahna (Noon)" },
  { label: "05:30 PM", desc: "Pradosha (Evening)" },
  { label: "07:30 PM", desc: "Sandhya Aarti" },
];

const StepConfiguration = () => {
  const { service, configuration, updateConfiguration, errors } = useRitualBooking();

  const todayStr = new Date().toISOString().split("T")[0];

  // Resolve available duration options strictly from actual service data
  const rawDurations = Array.isArray(service?.availableDurations) && service.availableDurations.length > 0
    ? service.availableDurations
    : service?.duration
    ? [service.duration]
    : ["2 Hours"];

  const durationHoursList = Array.isArray(service?.durationHours) && service.durationHours.length > 0
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
    // When arrangement mode changes, synchronize locationType sensibly if unselected or default
    updateConfiguration({
      arrangementMode: modeKey,
      locationType: modeKey,
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. CEREMONY DURATION */}
      <div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
            <Clock size={16} className="text-[#b36c1e]" />
            <span>1. Prescribed Ceremony Duration</span>
            <span className="text-red-500">*</span>
          </label>
          <span className="text-[11.5px] text-[#8a7c6b]">From service specifications</span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {rawDurations.map((dur, idx) => {
            const isSelected = configuration.durationSelected === dur;
            let displayHours = durationHoursList[idx] || parseInt(dur, 10) || null;

            return (
              <button
                key={dur}
                type="button"
                onClick={() => handleDurationSelect(dur, idx)}
                className={`relative flex flex-col justify-between rounded-xl p-4 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#d4872b] bg-[#fffaf0] shadow-sm"
                    : "border border-[#ead8b8] bg-white hover:border-[#d8c3a1]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[16px] font-bold text-[#2b241d]">
                      {dur}
                    </span>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eab12c] text-[#1c1308] text-[11px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  {displayHours && (
                    <p className="mt-1 text-[12px] text-[#7a6f62]">
                      Approx. {displayHours} hours of continuous Vedic recitations
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {errors.durationSelected && (
          <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-600">
            <AlertCircle size={13} /> {errors.durationSelected}
          </p>
        )}
      </div>

      {/* 2. CEREMONY DATE & TIME */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Date Input */}
        <div>
          <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
            <Calendar size={16} className="text-[#b36c1e]" />
            <span>2. Auspicious Ceremony Date</span>
            <span className="text-red-500">*</span>
          </label>
          <p className="mt-0.5 text-[11.5px] text-[#8a7c6b]">
            Choose your preferred date (must not be in the past)
          </p>
          <input
            type="date"
            min={todayStr}
            value={configuration.bookingDate || ""}
            onChange={(e) => updateConfiguration({ bookingDate: e.target.value })}
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

        {/* Time Input & Presets */}
        <div>
          <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
            <Clock size={16} className="text-[#b36c1e]" />
            <span>3. Preferred Muhurta / Time</span>
            <span className="text-red-500">*</span>
          </label>
          <p className="mt-0.5 text-[11.5px] text-[#8a7c6b]">
            Select an auspicious time window or specify your exact slot
          </p>

          <input
            type="text"
            placeholder="e.g. 07:00 AM or select a preset below"
            value={configuration.bookingTime || ""}
            onChange={(e) => updateConfiguration({ bookingTime: e.target.value })}
            className={`mt-2.5 w-full rounded-xl border bg-white px-4 py-3 text-[14px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
              errors.bookingTime
                ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                : "border-[#d8c3a1] focus:border-[#d4872b] focus:ring-[#d4872b]"
            }`}
          />

          {/* Quick presets */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {TIME_PRESETS.map((preset) => {
              const isSelected = configuration.bookingTime === preset.label;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => updateConfiguration({ bookingTime: preset.label })}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-[#eab12c] font-bold text-[#1c1308]"
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
      </div>

      {/* 3. PANDIT TEAM SIZE */}
      <div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
            <Users size={16} className="text-[#b36c1e]" />
            <span>4. Officiating Pandit Team Count</span>
            <span className="text-red-500">*</span>
          </label>
          <span className="text-[11.5px] text-[#8a7c6b]">Standard 1 included</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-xl border border-[#ead8b8] bg-[#fffaf0] p-4">
          <div className="flex items-center rounded-xl border border-[#d8c3a1] bg-white shadow-2xs">
            <button
              type="button"
              onClick={handlePanditDecrement}
              disabled={configuration.panditCount <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-l-xl text-[18px] font-bold text-[#5c4e3f] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#faf4e8] transition"
            >
              −
            </button>
            <div className="flex h-11 w-14 items-center justify-center font-serif text-[18px] font-bold text-[#2b241d]">
              {configuration.panditCount || 1}
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
              {configuration.panditCount === 1
                ? "1 Learned Officiating Purohit Included"
                : `${configuration.panditCount} Learned Purohits (1 Included + ${configuration.panditCount - 1} Additional)`}
            </p>
            <p className="mt-0.5 text-[#8a7c6b]">
              Additional Purohits assist in continuous Japa, homa samagri oblation, and veda parayana.
              Dakshina adjustments (+₹500/extra purohit) are calculated authoritatively by backend.
            </p>
          </div>
        </div>
        {errors.panditCount && (
          <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-600">
            <AlertCircle size={13} /> {errors.panditCount}
          </p>
        )}
      </div>

      {/* 4. CANONICAL ARRANGEMENT MODE */}
      <div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
            <Sparkles size={16} className="text-[#b36c1e]" />
            <span>5. Ceremony Arrangement Mode</span>
            <span className="text-red-500">*</span>
          </label>
          <span className="text-[11.5px] text-[#8a7c6b]">Canonical ritual setup</span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CANONICAL_ARRANGEMENT_MODES.map((modeKey) => {
            const meta = ARRANGEMENT_MODE_LABELS[modeKey] || {
              title: modeKey,
              desc: "Ceremonial arrangement",
              badge: "Vedic",
            };
            const isSelected = configuration.arrangementMode === modeKey;

            return (
              <button
                key={modeKey}
                type="button"
                onClick={() => handleArrangementSelect(modeKey)}
                className={`flex flex-col justify-between rounded-xl p-4 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#d4872b] bg-[#fffaf0] shadow-sm"
                    : "border border-[#ead8b8] bg-white hover:border-[#d8c3a1]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[15.5px] font-bold text-[#2b241d]">
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

      {/* 5. CANONICAL LOCATION TYPE */}
      <div>
        <label className="flex items-center gap-2 font-serif text-[16px] font-semibold text-[#2b241d]">
          <MapPin size={16} className="text-[#b36c1e]" />
          <span>6. Canonical Location Type</span>
          <span className="text-red-500">*</span>
        </label>
        <p className="mt-0.5 text-[11.5px] text-[#8a7c6b]">
          Select the canonical location identifier for purohit logistics and scheduling
        </p>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {CANONICAL_LOCATION_TYPES.map((locKey) => {
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

export default StepConfiguration;
