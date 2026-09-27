import { User, Phone, Mail, Sparkles, AlertCircle } from "lucide-react";
import {
  useRitualBooking,
  VEDIC_RASHIS,
  VEDIC_NAKSHATRAS,
} from "../../context/RitualBookingContext";

const StepYajman = () => {
  const { yajmanDetails, updateYajmanDetails, errors } = useRitualBooking();

  const isUnknownGotra = yajmanDetails.gotra === "Unknown";

  const handleUnknownGotraToggle = (checked) => {
    if (checked) {
      updateYajmanDetails({ gotra: "Unknown" });
    } else {
      updateYajmanDetails({ gotra: "" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="rounded-xl border border-[#ead8b8] bg-[#fffaf0] p-4 text-[13px] text-[#685c4f]">
        <div className="flex items-start gap-2.5">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-[#b36c1e]" />
          <div>
            <p className="font-semibold text-[#2b241d]">
              Sacred Yajman (Primary Devotee) Details
            </p>
            <p className="mt-0.5 text-[#7a6f62]">
              The primary devotee in whose name the ceremony Sankalp and Vedic Gotra recitation will be invoked by the officiating purohits.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: PRIMARY IDENTITY (REQUIRED) */}
      <div className="space-y-5">
        <h3 className="font-serif text-[17px] font-semibold text-[#2b241d] border-b border-[#f0e2cd] pb-2">
          1. Primary Identity & Contact
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#2b241d]">
              <User size={14} className="text-[#b36c1e]" />
              <span>Full Name</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Chandra Sharma"
              value={yajmanDetails.name || ""}
              onChange={(e) => updateYajmanDetails({ name: e.target.value })}
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-[14px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                  : "border-[#d8c3a1] focus:border-[#d4872b] focus:ring-[#d4872b]"
              }`}
            />
            {errors.name && (
              <p className="mt-1 flex items-center gap-1 text-[12px] text-red-600">
                <AlertCircle size={13} /> {errors.name}
              </p>
            )}
          </div>

          {/* Mobile / WhatsApp */}
          <div>
            <label className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#2b241d]">
              <Phone size={14} className="text-[#b36c1e]" />
              <span>WhatsApp / Mobile Number</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={yajmanDetails.mobile || ""}
              onChange={(e) => updateYajmanDetails({ mobile: e.target.value })}
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-[14px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
                errors.mobile
                  ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                  : "border-[#d8c3a1] focus:border-[#d4872b] focus:ring-[#d4872b]"
              }`}
            />
            <p className="mt-1 text-[11px] text-[#8a7c6b]">
              Live darshan links and ceremony updates are sent to this number
            </p>
            {errors.mobile && (
              <p className="mt-1 flex items-center gap-1 text-[12px] text-red-600">
                <AlertCircle size={13} /> {errors.mobile}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#2b241d]">
              <Mail size={14} className="text-[#b36c1e]" />
              <span>Email Address</span>
              <span className="text-[11.5px] text-[#8a7c6b]">(Optional)</span>
            </label>
            <input
              type="email"
              placeholder="e.g. devotee@example.com"
              value={yajmanDetails.email || ""}
              onChange={(e) => updateYajmanDetails({ email: e.target.value })}
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-[14px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                  : "border-[#d8c3a1] focus:border-[#d4872b] focus:ring-[#d4872b]"
              }`}
            />
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-[12px] text-red-600">
                <AlertCircle size={13} /> {errors.email}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[13.5px] font-semibold text-[#2b241d]">
              Gender
            </label>
            <div className="mt-2 flex items-center gap-3">
              {["Male", "Female", "Other"].map((g) => {
                const isSelected = yajmanDetails.gender === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateYajmanDetails({ gender: g })}
                    className={`flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition cursor-pointer ${
                      isSelected
                        ? "border-2 border-[#d4872b] bg-[#fffaf0] text-[#1c1308] shadow-2xs"
                        : "border border-[#ead8b8] bg-white text-[#685c4f] hover:bg-[#faf4e8]"
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ASTROLOGICAL & GOTRA DETAILS (OPTIONAL) */}
      <div className="space-y-5">
        <h3 className="font-serif text-[17px] font-semibold text-[#2b241d] border-b border-[#f0e2cd] pb-2">
          2. Gotra & Astrological Coordinates (Optional)
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* Gotra */}
          <div>
            <label className="block text-[13.5px] font-semibold text-[#2b241d]">
              Yajman Gotra
            </label>
            <input
              type="text"
              placeholder="e.g. Kashyap, Bharadwaja"
              disabled={isUnknownGotra}
              value={isUnknownGotra ? "Unknown" : yajmanDetails.gotra || ""}
              onChange={(e) => updateYajmanDetails({ gotra: e.target.value })}
              className="mt-2 w-full rounded-xl border border-[#d8c3a1] bg-white px-4 py-2.5 text-[14px] text-[#2b241d] disabled:bg-[#f5f1eb] disabled:text-[#8a7c6b] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
            />
            <label className="mt-2 flex items-center gap-2 cursor-pointer text-[12px] text-[#685c4f]">
              <input
                type="checkbox"
                checked={isUnknownGotra}
                onChange={(e) => handleUnknownGotraToggle(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-[#d8c3a1] text-[#d4872b] focus:ring-[#d4872b]"
              />
              <span>I do not know my Gotra</span>
            </label>
          </div>

          {/* Rashi */}
          <div>
            <label className="block text-[13.5px] font-semibold text-[#2b241d]">
              Rashi (Moon Sign)
            </label>
            <select
              value={yajmanDetails.rashi || ""}
              onChange={(e) => updateYajmanDetails({ rashi: e.target.value })}
              className="mt-2 w-full rounded-xl border border-[#d8c3a1] bg-white px-3.5 py-2.5 text-[13.5px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
            >
              <option value="">Select Rashi (Optional)</option>
              {VEDIC_RASHIS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Nakshatra */}
          <div>
            <label className="block text-[13.5px] font-semibold text-[#2b241d]">
              Nakshatra (Birth Star)
            </label>
            <select
              value={yajmanDetails.nakshatra || ""}
              onChange={(e) => updateYajmanDetails({ nakshatra: e.target.value })}
              className="mt-2 w-full rounded-xl border border-[#d8c3a1] bg-white px-3.5 py-2.5 text-[13.5px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
            >
              <option value="">Select Nakshatra (Optional)</option>
              {VEDIC_NAKSHATRAS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Birth Details Row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-[13px] font-semibold text-[#2b241d]">
              Date of Birth
            </label>
            <input
              type="date"
              value={yajmanDetails.dob || ""}
              onChange={(e) => updateYajmanDetails({ dob: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[#d8c3a1] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#2b241d]">
              Time of Birth
            </label>
            <input
              type="text"
              placeholder="e.g. 06:45 AM or Unknown"
              value={yajmanDetails.timeOfBirth || ""}
              onChange={(e) => updateYajmanDetails({ timeOfBirth: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[#d8c3a1] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#2b241d]">
              Place of Birth
            </label>
            <input
              type="text"
              placeholder="City, State"
              value={yajmanDetails.placeOfBirth || ""}
              onChange={(e) => updateYajmanDetails({ placeOfBirth: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[#d8c3a1] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: LINEAGE & FAMILY RECITATION (OPTIONAL) */}
      <div className="space-y-4">
        <h3 className="font-serif text-[17px] font-semibold text-[#2b241d] border-b border-[#f0e2cd] pb-2">
          3. Lineage Recitation (Optional)
        </h3>
        <p className="text-[12px] text-[#7a6f62]">
          Traditional Vedic Sankalpas optionally recite the Yajman's parents and spouse names for full ancestral merit.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-[13px] font-medium text-[#2b241d]">
              Father's Name
            </label>
            <input
              type="text"
              placeholder="Father's full name"
              value={yajmanDetails.fatherName || ""}
              onChange={(e) => updateYajmanDetails({ fatherName: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[#d8c3a1] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#2b241d]">
              Mother's Name
            </label>
            <input
              type="text"
              placeholder="Mother's full name"
              value={yajmanDetails.motherName || ""}
              onChange={(e) => updateYajmanDetails({ motherName: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[#d8c3a1] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#2b241d]">
              Spouse Name
            </label>
            <input
              type="text"
              placeholder="Spouse name (if married)"
              value={yajmanDetails.spouseName || ""}
              onChange={(e) => updateYajmanDetails({ spouseName: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[#d8c3a1] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepYajman;
