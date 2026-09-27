import { Users, Plus, Trash2, Heart, Sparkles, AlertCircle } from "lucide-react";
import {
  useRitualBooking,
  VEDIC_RASHIS,
  VEDIC_NAKSHATRAS,
  FAMILY_RELATIONS,
} from "../../context/RitualBookingContext";

const StepFamilyMembers = () => {
  const {
    familyMembers,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    errors,
  } = useRitualBooking();

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="rounded-xl border border-[#ead8b8] bg-[#fffaf0] p-4 text-[13px] text-[#685c4f]">
        <div className="flex items-start gap-2.5">
          <Heart size={16} className="mt-0.5 shrink-0 text-[#b36c1e]" />
          <div>
            <p className="font-semibold text-[#2b241d]">
              Family Members & Co-Yajamana (Optional)
            </p>
            <p className="mt-0.5 text-[#7a6f62]">
              Include your spouse, children, parents, or siblings to receive the sanctified Sankalpa blessings and Gotra recitation. The primary Yajman is already captured in Step 2.
            </p>
          </div>
        </div>
      </div>

      {/* Global Validation Error Banner if present */}
      {errors.familyMembers && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] text-red-700 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-red-600" />
          <span>{errors.familyMembers}</span>
        </div>
      )}

      {/* Empty State when no members added */}
      {familyMembers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#dfcdb1] bg-[#fffdfa] p-8 text-center sm:p-10">
          <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-full bg-[#fbf3e4] text-[#b36c1e]">
            <Users size={24} />
          </div>
          <h3 className="mt-3.5 font-serif text-[17px] font-semibold text-[#2b241d]">
            No Additional Family Members Added
          </h3>
          <p className="mx-auto mt-1.5 max-w-[460px] text-[13px] leading-relaxed text-[#7a6f62]">
            The Vedic ceremony will be performed primarily for the registered Yajman. If you wish to invoke blessings for your family, click below to add them.
          </p>
          <button
            type="button"
            onClick={addFamilyMember}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2b241d] px-5 py-2.5 text-[13px] font-semibold text-white shadow-xs hover:bg-[#43372c] transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Family Member</span>
          </button>
        </div>
      ) : (
        /* List of Family Member Cards */
        <div className="space-y-6">
          {familyMembers.map((member, idx) => {
            const nameError = errors[`familyMember_${idx}_name`];
            const isUnknownGotra = member.gotra === "Unknown";

            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-xs transition hover:border-[#dfcdb1]"
              >
                {/* Member Header */}
                <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8edd8] text-[12px] font-bold text-[#b36c1e]">
                      {idx + 1}
                    </span>
                    <h4 className="font-serif text-[15.5px] font-semibold text-[#2b241d]">
                      {member.name ? member.name : `Family Member ${idx + 1}`}
                    </h4>
                    {member.relation && (
                      <span className="rounded-full bg-[#f4ebe1] px-2.5 py-0.5 text-[11px] font-medium text-[#7a6f62]">
                        {member.relation}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFamilyMember(idx)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-100/70 hover:text-red-700 transition cursor-pointer"
                    aria-label={`Remove Family Member ${idx + 1}`}
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>

                {/* Form Fields Grid */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Name (Required) */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-[13px] font-semibold text-[#2b241d]">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya Sharma"
                      value={member.name || ""}
                      onChange={(e) => updateFamilyMember(idx, { name: e.target.value })}
                      className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
                        nameError
                          ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                          : "border-[#e0d3be] focus:border-[#b36c1e] focus:ring-[#b36c1e]"
                      }`}
                    />
                    {nameError && (
                      <p className="mt-1 text-[11.5px] text-red-600">{nameError}</p>
                    )}
                  </div>

                  {/* Relation */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#2b241d]">
                      Relation to Yajman
                    </label>
                    <select
                      value={member.relation || "Spouse"}
                      onChange={(e) => updateFamilyMember(idx, { relation: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#e0d3be] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:border-[#b36c1e] focus:outline-none focus:ring-1 focus:ring-[#b36c1e]"
                    >
                      {FAMILY_RELATIONS.map((rel) => (
                        <option key={rel} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#2b241d]">
                      Gender
                    </label>
                    <select
                      value={member.gender || "Female"}
                      onChange={(e) => updateFamilyMember(idx, { gender: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#e0d3be] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:border-[#b36c1e] focus:outline-none focus:ring-1 focus:ring-[#b36c1e]"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#2b241d]">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={member.dob || ""}
                      onChange={(e) => updateFamilyMember(idx, { dob: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#e0d3be] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:border-[#b36c1e] focus:outline-none focus:ring-1 focus:ring-[#b36c1e]"
                    />
                  </div>

                  {/* Gotra */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-semibold text-[#2b241d]">Gotra</label>
                      <label className="flex items-center gap-1.5 text-[11.5px] text-[#7a6f62] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isUnknownGotra}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateFamilyMember(idx, { gotra: "Unknown" });
                            } else {
                              updateFamilyMember(idx, { gotra: "" });
                            }
                          }}
                          className="h-3.5 w-3.5 rounded border-[#ead8b8] text-[#b36c1e] focus:ring-[#b36c1e]"
                        />
                        <span>Unknown</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Bharadwaja"
                      disabled={isUnknownGotra}
                      value={isUnknownGotra ? "Unknown / Not Sure" : member.gotra || ""}
                      onChange={(e) => updateFamilyMember(idx, { gotra: e.target.value })}
                      className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
                        isUnknownGotra
                          ? "bg-[#fbf7f0] text-[#8a7c6b] border-[#ebdcc7]"
                          : "border-[#e0d3be] focus:border-[#b36c1e] focus:ring-[#b36c1e]"
                      }`}
                    />
                  </div>

                  {/* Rashi */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#2b241d]">
                      Rashi (Moon Sign)
                    </label>
                    <select
                      value={member.rashi || ""}
                      onChange={(e) => updateFamilyMember(idx, { rashi: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#e0d3be] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:border-[#b36c1e] focus:outline-none focus:ring-1 focus:ring-[#b36c1e]"
                    >
                      <option value="">Select Rashi (Optional)</option>
                      {VEDIC_RASHIS.map((rashi) => (
                        <option key={rashi} value={rashi}>
                          {rashi}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nakshatra */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#2b241d]">
                      Janma Nakshatra
                    </label>
                    <select
                      value={member.nakshatra || ""}
                      onChange={(e) => updateFamilyMember(idx, { nakshatra: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#e0d3be] bg-white px-3.5 py-2 text-[13.5px] text-[#2b241d] transition focus:border-[#b36c1e] focus:outline-none focus:ring-1 focus:ring-[#b36c1e]"
                    >
                      <option value="">Select Nakshatra (Optional)</option>
                      {VEDIC_NAKSHATRAS.map((nak) => (
                        <option key={nak} value={nak}>
                          {nak}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Another Member Button */}
          <div className="flex justify-start pt-1">
            <button
              type="button"
              onClick={addFamilyMember}
              className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffaf0] px-5 py-2 text-[13px] font-semibold text-[#b36c1e] shadow-2xs hover:bg-[#f8edd8] transition cursor-pointer"
            >
              <Plus size={15} />
              <span>+ Add Another Family Member</span>
            </button>
          </div>
        </div>
      )}

      {/* Astro Note */}
      <div className="rounded-xl border border-[#f0e2cd] bg-[#fbf7f0] p-4 text-[12.5px] text-[#7a6f62]">
        <div className="flex items-start gap-2">
          <Sparkles size={15} className="mt-0.5 shrink-0 text-[#b36c1e]" />
          <p>
            Vedic purohits invoke each family member&apos;s Gotra and Nakshatra during the introductory recitation of the Sankalpa Patra to extend the spiritual benefits across your household.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepFamilyMembers;
