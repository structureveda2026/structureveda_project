import { MapPin, Building, Home, Video, Sparkles, AlertCircle, Phone, User } from "lucide-react";
import { useRitualBooking } from "../../context/RitualBookingContext";

const StepLocation = () => {
  const { configuration, locationDetails, updateLocationDetails, errors } = useRitualBooking();

  const mode = configuration.locationType || configuration.arrangementMode || "remote";

  const isRemote = mode === "remote";
  const isVedaStructure = mode === "veda_structure";
  const isKashi = mode === "kashi";
  const isCustomerHome = mode === "customer_home";
  const isTemple = mode === "temple";
  const isOther = mode === "other";

  const requiresPhysicalAddress = isCustomerHome || isOther || isTemple;

  // Mode badge and title helpers
  const getModeTitle = () => {
    switch (mode) {
      case "remote":
        return "Remote / Online Sankalpa (Live Stream)";
      case "veda_structure":
        return "Veda Structure Ashram & Spiritual Centre";
      case "kashi":
        return "Kashi Ghats & Sanctified Shrines (Varanasi)";
      case "customer_home":
        return "Devotee Residence / Private Premises";
      case "temple":
        return "Consecrated Mandir / Temple Premises";
      case "other":
        return "Sacred Designated Venue";
      default:
        return mode;
    }
  };

  return (
    <div className="space-y-8">
      {/* Venue Mode Header Banner */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8edd8] text-[#b36c1e]">
              {isRemote && <Video size={20} />}
              {isVedaStructure && <Building size={20} />}
              {isKashi && <Sparkles size={20} />}
              {isCustomerHome && <Home size={20} />}
              {(isTemple || isOther) && <MapPin size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                  SELECTED ARRANGEMENT MODE
                </span>
                <span className="rounded-full bg-[#f4ebe1] px-2 py-0.5 text-[10.5px] font-semibold text-[#7a6f62]">
                  Configured in Step 1
                </span>
              </div>
              <h3 className="font-serif text-[17px] font-bold text-[#2b241d]">
                {getModeTitle()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* REMOTE ARRANGEMENT STATE */}
      {isRemote && (
        <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#2e7d32]">
            <Sparkles size={18} />
            <h4 className="font-serif text-[16px] font-semibold text-[#2b241d]">
              Digital & Remote Ceremony Coordination
            </h4>
          </div>
          <p className="text-[13.5px] leading-relaxed text-[#685c4f]">
            Your Puja will be coordinated remotely by our dedicated Vedic scholars at our sanctified premises. <strong>No physical venue address is required</strong> from you.
          </p>
          <div className="rounded-xl border border-[#e4d5be] bg-[#fbf6ec] p-4 text-[13px] text-[#7a6f62] space-y-2">
            <p className="font-semibold text-[#2b241d]">What to expect for Remote Sankalpa:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>High-definition interactive video stream coordination link sent via WhatsApp / Email before the muhurat.</li>
              <li>Purohits will chant the solemn Sankalpa by explicitly reciting your Gotra, Nakshatra, and stated prayer intentions.</li>
              <li>Prasad dispatch will be coordinated to your registered profile address following completion of the rituals.</li>
            </ul>
          </div>
        </div>
      )}

      {/* VEDA STRUCTURE ASHRAM STATE */}
      {isVedaStructure && (
        <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5">
            <Building size={18} className="text-[#b36c1e]" />
            <h4 className="font-serif text-[16px] font-semibold text-[#2b241d]">
              Veda Structure Spiritual Sanctuary & Yagyashala
            </h4>
          </div>
          <p className="text-[13.5px] leading-relaxed text-[#685c4f]">
            The ceremony will be performed at the consecrated <strong>Veda Structure Spiritual Centre & Yagyashala</strong>. All pure dravya, sacred wood, and officiating purohit arrangements are maintained on-site according to strict Shastric protocols.
          </p>

          <div className="rounded-xl border border-[#ead8b8] bg-[#fffaf0] p-4 text-[13px] text-[#685c4f]">
            <p className="font-semibold text-[#2b241d]">Venue Details:</p>
            <p className="mt-1 text-[#7a6f62]">
              Veda Structure Vedic Heritage & Anushthan Sansthan, Varanasi / Delhi NCR Sanctuary.
            </p>
            <p className="mt-0.5 text-[12px] text-[#8a7c6b]">
              Exact entry access pass, navigation map coordinates, and Acharya reception contact will be shared directly upon confirmation.
            </p>
          </div>

          {/* Optional Contact Person */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-[#f0e2cd]">
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2b241d]">
                <User size={13} className="text-[#b36c1e]" />
                <span>Visiting Devotee / Contact Person</span>
                <span className="text-[11px] font-normal text-[#8a7c6b]">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Name of attending devotee"
                value={locationDetails.contactPerson || ""}
                onChange={(e) => updateLocationDetails({ contactPerson: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#e0d3be] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:border-[#b36c1e] focus:outline-none focus:ring-1 focus:ring-[#b36c1e]"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2b241d]">
                <Phone size={13} className="text-[#b36c1e]" />
                <span>On-Site Arrival Phone</span>
                <span className="text-[11px] font-normal text-[#8a7c6b]">(Optional)</span>
              </label>
              <input
                type="tel"
                placeholder="Devotee mobile for arrival"
                value={locationDetails.landmark || ""}
                onChange={(e) => updateLocationDetails({ landmark: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#e0d3be] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:border-[#b36c1e] focus:outline-none focus:ring-1 focus:ring-[#b36c1e]"
              />
            </div>
          </div>
        </div>
      )}

      {/* KASHI GHATS STATE */}
      {isKashi && (
        <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5">
            <Sparkles size={18} className="text-[#b36c1e]" />
            <h4 className="font-serif text-[16px] font-semibold text-[#2b241d]">
              Sacred Kashi Kshetra (Varanasi Ghats & Shrines)
            </h4>
          </div>
          <p className="text-[13.5px] leading-relaxed text-[#685c4f]">
            The rituals will be organized along the holy banks of the Ganges in Kashi or designated traditional Mathas in Varanasi under the guidance of authenticated local Acharyas.
          </p>

          <div className="rounded-xl border border-[#ead8b8] bg-[#fffaf0] p-4 text-[13px] text-[#685c4f]">
            <p className="font-semibold text-[#2b241d]">Kashi Coordination Notice:</p>
            <p className="mt-1 text-[#7a6f62]">
              Veda Structure coordinates the ceremony at authenticated ghats or sacred riverside temples based on seasonal river levels and tradition. No manual ghat booking is required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-[#f0e2cd]">
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2b241d]">
                <User size={13} className="text-[#b36c1e]" />
                <span>Devotee Attending in Varanasi</span>
                <span className="text-[11px] font-normal text-[#8a7c6b]">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Name of visiting devotee"
                value={locationDetails.contactPerson || ""}
                onChange={(e) => updateLocationDetails({ contactPerson: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#e0d3be] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:border-[#b36c1e] focus:outline-none focus:ring-1 focus:ring-[#b36c1e]"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2b241d]">
                <MapPin size={13} className="text-[#b36c1e]" />
                <span>Hotel / Stay Address in Varanasi</span>
                <span className="text-[11px] font-normal text-[#8a7c6b]">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Local stay location or special notes"
                value={locationDetails.landmark || ""}
                onChange={(e) => updateLocationDetails({ landmark: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#e0d3be] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:border-[#b36c1e] focus:outline-none focus:ring-1 focus:ring-[#b36c1e]"
              />
            </div>
          </div>
        </div>
      )}

      {/* PHYSICAL VENUES: CUSTOMER HOME / TEMPLE / OTHER */}
      {requiresPhysicalAddress && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[#ead8b8] bg-[#fffaf0] p-4 text-[13px] text-[#685c4f]">
            <p className="font-semibold text-[#2b241d]">
              {isCustomerHome
                ? "Devotee Residence & Venue Details"
                : isTemple
                ? "Mandir / Temple Venue Details"
                : "Designated Sacred Ceremony Venue Details"}
            </p>
            <p className="mt-0.5 text-[#7a6f62]">
              Please provide the exact address where the officiating purohits and ceremonial samagri will arrive.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-6 sm:p-7 shadow-xs space-y-5">
            {/* Street Address */}
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2b241d]">
                <MapPin size={13} className="text-[#b36c1e]" />
                <span>
                  {isTemple ? "Mandir Name & Detailed Address" : "Full Street Address"}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder={
                  isTemple
                    ? "e.g. Shri Siddhivinayak Mandir, Prabhadevi..."
                    : "e.g. Flat 402, Shanti Niketan Apartments, 5th Main Road..."
                }
                value={locationDetails.address || ""}
                onChange={(e) => updateLocationDetails({ address: e.target.value })}
                className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13.5px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
                  errors.address
                    ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                    : "border-[#e0d3be] focus:border-[#b36c1e] focus:ring-[#b36c1e]"
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-[11.5px] text-red-600">{errors.address}</p>
              )}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[13px] font-semibold text-[#2b241d]">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Varanasi, Mumbai, New Delhi"
                  value={locationDetails.city || ""}
                  onChange={(e) => updateLocationDetails({ city: e.target.value })}
                  className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
                    errors.city
                      ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                      : "border-[#e0d3be] focus:border-[#b36c1e] focus:ring-[#b36c1e]"
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-[11.5px] text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#2b241d]">
                  State {requiresPhysicalAddress && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Uttar Pradesh, Maharashtra"
                  value={locationDetails.state || ""}
                  onChange={(e) => updateLocationDetails({ state: e.target.value })}
                  className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
                    errors.state
                      ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                      : "border-[#e0d3be] focus:border-[#b36c1e] focus:ring-[#b36c1e]"
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-[11.5px] text-red-600">{errors.state}</p>
                )}
              </div>
            </div>

            {/* Pincode & Country */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[13px] font-semibold text-[#2b241d]">
                  Postal Pincode {requiresPhysicalAddress && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 221001"
                  value={locationDetails.pincode || ""}
                  onChange={(e) => updateLocationDetails({ pincode: e.target.value })}
                  className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
                    errors.pincode
                      ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                      : "border-[#e0d3be] focus:border-[#b36c1e] focus:ring-[#b36c1e]"
                  }`}
                />
                {errors.pincode && (
                  <p className="mt-1 text-[11.5px] text-red-600">{errors.pincode}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#2b241d]">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value={locationDetails.country || "India"}
                  className="mt-1.5 w-full rounded-xl border border-[#ebdcc7] bg-[#fbf7f0] px-3.5 py-2 text-[13.5px] text-[#7a6f62] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Landmark & Contact Person */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-[#f0e2cd]">
              <div>
                <label className="block text-[13px] font-semibold text-[#2b241d]">
                  Nearby Landmark <span className="text-[11px] font-normal text-[#8a7c6b]">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Shiv Mandir / Behind Metro Pillar 42"
                  value={locationDetails.landmark || ""}
                  onChange={(e) => updateLocationDetails({ landmark: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#e0d3be] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:border-[#b36c1e] focus:outline-none focus:ring-1 focus:ring-[#b36c1e]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#2b241d]">
                  Venue Contact Person / Host Phone <span className="text-[11px] font-normal text-[#8a7c6b]">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma (+91 9876543210)"
                  value={locationDetails.contactPerson || ""}
                  onChange={(e) => updateLocationDetails({ contactPerson: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#e0d3be] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:border-[#b36c1e] focus:outline-none focus:ring-1 focus:ring-[#b36c1e]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reassurance note */}
      <div className="rounded-xl border border-[#f0e2cd] bg-[#fbf7f0] p-4 text-[12.5px] text-[#7a6f62] flex items-start gap-2">
        <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#b36c1e]" />
        <p>
          Our ceremonial logistics coordinator will connect with the contact person 24 hours prior to the auspicious date to ensure yagyashala orientation, purified water, and clean seating setups are ready.
        </p>
      </div>
    </div>
  );
};

export default StepLocation;
