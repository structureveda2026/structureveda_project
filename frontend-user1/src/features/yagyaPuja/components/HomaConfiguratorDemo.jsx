import { useState, useEffect } from "react";
import { Flame, Calendar, Clock, MapPin, Users, Sparkles, Check, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { HOMA_CATALOGUE_LIST } from "../data/homaCatalogueData";

const HomaConfiguratorDemo = () => {
  const [selectedHomaSlug, setSelectedHomaSlug] = useState("maha-mrityunjaya-homa");
  const activeHoma =
    HOMA_CATALOGUE_LIST.find((h) => h.slug === selectedHomaSlug) || HOMA_CATALOGUE_LIST[0];

  // Selected parameters
  const [selectedHavanCount, setSelectedHavanCount] = useState(
    activeHoma.availableHavanCounts?.[0] || 1
  );
  const [selectedDays, setSelectedDays] = useState(
    activeHoma.availableDays?.[0] || 1
  );
  const [selectedLocation, setSelectedLocation] = useState(
    activeHoma.kashiAvailable ? "kashi" : "remote"
  );
  const [selectedDate, setSelectedDate] = useState("2026-09-18");
  const [selectedSankalpaType, setSelectedSankalpaType] = useState("Family Sankalpa");

  // Synchronize options when activeHoma changes
  useEffect(() => {
    if (!activeHoma.availableHavanCounts.includes(selectedHavanCount)) {
      setSelectedHavanCount(activeHoma.availableHavanCounts[0]);
    }
    if (!activeHoma.availableDays.includes(selectedDays)) {
      setSelectedDays(activeHoma.availableDays[0]);
    }
    if (selectedLocation === "kashi" && !activeHoma.kashiAvailable) {
      setSelectedLocation("remote");
    }
    if (selectedLocation === "remote" && !activeHoma.remoteAvailable) {
      setSelectedLocation("kashi");
    }
  }, [activeHoma]);

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[800px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8b584] bg-[#fbf3e4] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8e5a1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span>ILLUSTRATIVE CONFIGURATION • ARCHITECTURE PREVIEW</span>
          </div>
          <h2 className="mt-3 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Configure Your Homa
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Interact with the six core configuration dimensions below to preview how Havan counts, duration days, and location dynamically adapt per specific Vedic service.
          </p>
        </div>

        {/* Demonstrator Interactive Container */}
        <div className="mx-auto mt-12 max-w-[960px] overflow-hidden rounded-[28px] border border-[#d8c3a1] bg-[#fffdfa] shadow-[0_12px_36px_rgba(80,60,30,0.08)]">
          {/* Top Demo Bar */}
          <div className="border-b border-[#ebdcc4] bg-gradient-to-r from-[#fbf4e8] via-[#f7ecd5] to-[#f4e2bf] px-6 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#8a571c]">
                CONFIGURATION DEMONSTRATOR
              </span>
              <span className="rounded-full bg-[#2b241d] px-3 py-0.5 text-[11px] font-semibold text-[#f7ecd5]">
                Architecture Preview
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Step 01: Select Homa */}
            <div>
              <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#a8641b]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c77722] text-[11px] text-white">1</span>
                <span>Select Homa Service</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {HOMA_CATALOGUE_LIST.slice(0, 5).map((homa) => (
                  <button
                    key={homa.slug}
                    type="button"
                    onClick={() => setSelectedHomaSlug(homa.slug)}
                    className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition cursor-pointer ${
                      selectedHomaSlug === homa.slug
                        ? "bg-[#2b241d] text-[#f7ecd5] shadow-xs"
                        : "border border-[#d6b8a0] bg-white text-[#5c4e3f] hover:border-[#c77722]"
                    }`}
                  >
                    {homa.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 02 & 03: Number of Havan & Number of Days (Strictly Service-Specific) */}
            <div className="grid gap-6 sm:grid-cols-2 border-t border-[#f0e1cb] pt-6">
              {/* Step 02: Number of Havan */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#a8641b]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c77722] text-[11px] text-white">2</span>
                  <span>Number of Havan (Service Specific)</span>
                </div>
                <p className="mt-1 text-[11.5px] text-[#78644e]">
                  Available counts for {activeHoma.name}:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeHoma.availableHavanCounts.map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setSelectedHavanCount(cnt)}
                      className={`rounded-xl px-4 py-2 text-[13px] font-bold transition cursor-pointer ${
                        selectedHavanCount === cnt
                          ? "bg-[#c77722] text-white shadow-xs"
                          : "border border-[#d6b8a0] bg-[#fffaf1] text-[#6d4c1b] hover:bg-[#fffdfa]"
                      }`}
                    >
                      {cnt === "custom" ? "Custom Havan" : `${cnt} Havan`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 03: Number of Days */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#a8641b]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c77722] text-[11px] text-white">3</span>
                  <span>Number of Days (Service Specific)</span>
                </div>
                <p className="mt-1 text-[11.5px] text-[#78644e]">
                  Available timeline for {activeHoma.name}:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeHoma.availableDays.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDays(d)}
                      className={`rounded-xl px-4 py-2 text-[13px] font-bold transition cursor-pointer ${
                        selectedDays === d
                          ? "bg-[#c77722] text-white shadow-xs"
                          : "border border-[#d6b8a0] bg-[#fffaf1] text-[#6d4c1b] hover:bg-[#fffdfa]"
                      }`}
                    >
                      {d} {d === 1 ? "Day" : "Days"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 04 & 05: Date & Location */}
            <div className="grid gap-6 sm:grid-cols-2 border-t border-[#f0e1cb] pt-6">
              {/* Step 04: Date */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#a8641b]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c77722] text-[11px] text-white">4</span>
                  <span>Preferred Date (Sample Preview)</span>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-[#d6b8a0] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                />
              </div>

              {/* Step 05: Location (Service-Level Availability) */}
              <div>
                <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#a8641b]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c77722] text-[11px] text-white">5</span>
                  <span>Location (Service Specific)</span>
                </div>
                <div className="mt-3 flex gap-2">
                  {activeHoma.kashiAvailable && (
                    <button
                      type="button"
                      onClick={() => setSelectedLocation("kashi")}
                      className={`flex-1 rounded-xl py-2 text-[12.5px] font-bold transition cursor-pointer ${
                        selectedLocation === "kashi"
                          ? "bg-[#2b241d] text-[#f7ecd5]"
                          : "border border-[#d6b8a0] bg-white text-[#5c4e3f]"
                      }`}
                    >
                      Kashi Mandapams
                    </button>
                  )}
                  {activeHoma.remoteAvailable && (
                    <button
                      type="button"
                      onClick={() => setSelectedLocation("remote")}
                      className={`flex-1 rounded-xl py-2 text-[12.5px] font-bold transition cursor-pointer ${
                        selectedLocation === "remote"
                          ? "bg-[#2b241d] text-[#f7ecd5]"
                          : "border border-[#d6b8a0] bg-white text-[#5c4e3f]"
                      }`}
                    >
                      Remote Participation
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 06: Sankalpa Scope */}
            <div className="border-t border-[#f0e1cb] pt-6">
              <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#a8641b]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c77722] text-[11px] text-white">6</span>
                <span>Sankalpa Scope</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Individual Sankalpa", "Couple Sankalpa", "Family Sankalpa", "Special Occasion"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSankalpaType(s)}
                    className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition cursor-pointer ${
                      selectedSankalpaType === s
                        ? "bg-[#8a571c] text-white"
                        : "border border-[#d6b8a0] bg-white text-[#5c4e3f]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Configuration Summary Strip */}
            <div className="rounded-2xl border border-[#d8c3a1] bg-[#faf2e2] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="rounded-full bg-[#faedd9] px-2.5 py-0.5 text-[10.5px] font-bold uppercase text-[#8a571c]">
                    Calculated Summary (Preview)
                  </span>
                  <h4 className="mt-1 font-serif text-[19px] font-bold text-[#2b241d]">
                    {activeHoma.name} • {selectedHavanCount} Havan • {selectedDays} Day(s)
                  </h4>
                  <p className="text-[12.5px] text-[#78644e]">
                    Location: {selectedLocation === "kashi" ? "Kashi Shrines" : "Remote"} • {selectedSankalpaType}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-[10.5px] font-bold uppercase text-[#8a725b]">Illustrative Price</span>
                    <span className="font-serif text-[22px] font-bold text-[#2b241d]">
                      ₹{activeHoma.startingPrice?.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <Link
                    to={`/yagya-puja/homa/${activeHoma.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#2b241d] px-5 py-2.5 text-[13px] font-bold text-[#f7ecd5] transition hover:bg-[#a8641b] hover:text-white"
                  >
                    <span>View Detail</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Explanatory Disclaimer Banner */}
            <div className="flex items-start gap-2.5 rounded-xl border border-[#e2cca8] bg-[#faf0dc] p-3.5 text-[12px] leading-relaxed text-[#755c3f]">
              <Info size={15} className="mt-0.5 shrink-0 text-[#b36c1e]" />
              <p>
                <strong>Architecture Preview Note:</strong> This interactive demonstrator illustrates how Havan counts and days adapt dynamically to each service. Real date booking, priest locking, and payment engine will be managed in future stages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomaConfiguratorDemo;
