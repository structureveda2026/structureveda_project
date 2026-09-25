import { Sparkles, ScrollText, AlertCircle, HeartHandshake, HelpCircle } from "lucide-react";
import { useRitualBooking } from "../../context/RitualBookingContext";

const INTENTION_SUGGESTIONS = [
  "Ayushya & Good Health (आरोग्य)",
  "Removal of Obstacles & Evil Eye (विघ्न निवारण)",
  "Family Harmony & Peaceful Home (पारिवारिक शांति)",
  "Prosperity & Financial Stability (धन-धान्य समृद्धि)",
  "Career Growth & Business Success (कार्य सिद्धि)",
  "Planetary & Dosha Shanti (ग्रह दोष शांति)",
  "Spiritual Upliftment & Punya (आध्यात्मिक उन्नति)",
];

const StepSankalp = () => {
  const { service, sankalpDetails, updateSankalpDetails, errors } = useRitualBooking();

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="rounded-xl border border-[#ead8b8] bg-[#fffaf0] p-4 text-[13px] text-[#685c4f]">
        <div className="flex items-start gap-2.5">
          <ScrollText size={16} className="mt-0.5 shrink-0 text-[#b36c1e]" />
          <div>
            <p className="font-semibold text-[#2b241d]">
              Sacred Sankalp (Ritual Intention & Resolution)
            </p>
            <p className="mt-0.5 text-[#7a6f62]">
              In Vedic tradition, the Sankalp connects your inner consciousness and spiritual desire with the divine vibration of the ceremony. Your words are recited aloud during the opening vidhi.
            </p>
          </div>
        </div>
      </div>

      {/* 1. CEREMONY PURPOSE */}
      <div>
        <label className="block text-[13.5px] font-semibold text-[#2b241d]">
          1. Ceremony Spiritual Purpose
        </label>
        <p className="text-[11.5px] text-[#8a7c6b]">
          The overarching scriptural purpose of {service?.name || "this ceremony"}
        </p>
        <input
          type="text"
          placeholder="e.g. Protection, Peace, Longevity"
          value={sankalpDetails.purpose || ""}
          onChange={(e) => updateSankalpDetails({ purpose: e.target.value })}
          className="mt-2 w-full rounded-xl border border-[#d8c3a1] bg-white px-4 py-2.5 text-[14px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
        />
        {service?.purposeSummary && !sankalpDetails.purpose && (
          <button
            type="button"
            onClick={() => updateSankalpDetails({ purpose: service.purposeSummary })}
            className="mt-1.5 text-[11.5px] text-[#b36c1e] hover:underline cursor-pointer"
          >
            Use service default: "{service.purposeSummary}"
          </button>
        )}
      </div>

      {/* 2. MAIN INTENTION (REQUIRED IF PURPOSE EMPTY) */}
      <div>
        <label className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#2b241d]">
          <Sparkles size={14} className="text-[#b36c1e]" />
          <span>2. Main Sankalp Intention (मुख्य संकल्प)</span>
          <span className="text-red-500">*</span>
        </label>
        <p className="text-[11.5px] text-[#8a7c6b]">
          Select from traditional intentions or describe your core spiritual motive
        </p>

        <input
          type="text"
          placeholder="e.g. Health, removal of obstacles, or family harmony"
          value={sankalpDetails.mainIntention || ""}
          onChange={(e) => updateSankalpDetails({ mainIntention: e.target.value })}
          className={`mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-[14px] text-[#2b241d] transition focus:outline-none focus:ring-1 ${
            errors.mainIntention
              ? "border-red-400 focus:border-red-500 focus:ring-red-400"
              : "border-[#d8c3a1] focus:border-[#d4872b] focus:ring-[#d4872b]"
          }`}
        />

        {/* Quick Suggestion Chips */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {INTENTION_SUGGESTIONS.map((suggestion) => {
            const isSelected = sankalpDetails.mainIntention === suggestion;
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => updateSankalpDetails({ mainIntention: suggestion })}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                  isSelected
                    ? "bg-[#eab12c] font-bold text-[#1c1308] shadow-2xs"
                    : "border border-[#ead8b8] bg-white text-[#685c4f] hover:bg-[#faf4e8]"
                }`}
              >
                {suggestion}
              </button>
            );
          })}
        </div>

        {errors.mainIntention && (
          <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-600">
            <AlertCircle size={13} /> {errors.mainIntention}
          </p>
        )}
      </div>

      {/* 3. SPECIFIC SANKALP PRAYER */}
      <div>
        <label className="block text-[13.5px] font-semibold text-[#2b241d]">
          3. Specific Devotee Prayer / Personal Sankalp Words
        </label>
        <p className="text-[11.5px] text-[#8a7c6b]">
          Describe your prayer in your own words. Officiating pandits will hold sacred Kusha grass, Gangajal, and Akshat while reciting your Sankalp.
        </p>
        <textarea
          rows={4}
          placeholder="State your personal prayer in detail (e.g. Seeking Lord Shiva's divine grace for the good health, longevity, and peaceful life of my parents and family members)..."
          value={sankalpDetails.specificSankalp || ""}
          onChange={(e) => updateSankalpDetails({ specificSankalp: e.target.value })}
          className="mt-2 w-full rounded-xl border border-[#d8c3a1] bg-white p-3.5 text-[14px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
        />
      </div>

      {/* 4. SPECIAL RITUAL PREFERENCES (OPTIONAL) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#2b241d]">
            <HeartHandshake size={14} className="text-[#b36c1e]" />
            <span>4. Special Ritual Request (Optional)</span>
          </label>
          <p className="text-[11px] text-[#8a7c6b]">
            Specific deity focus, particular archana, or mantra recitations
          </p>
          <textarea
            rows={3}
            placeholder="e.g. Dedicated Bilva Patra Archana or Sahasranama recital"
            value={sankalpDetails.specialRequest || ""}
            onChange={(e) => updateSankalpDetails({ specialRequest: e.target.value })}
            className="mt-2 w-full rounded-xl border border-[#d8c3a1] bg-white p-3 text-[13.5px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#2b241d]">
            <HelpCircle size={14} className="text-[#b36c1e]" />
            <span>5. Special Instructions for Pandits (Optional)</span>
          </label>
          <p className="text-[11px] text-[#8a7c6b]">
            Coordination notes, seating preferences for elders, language choices
          </p>
          <textarea
            rows={3}
            placeholder="e.g. Please arrange seated chair Sankalp for elderly father, Hindi/English commentary requested"
            value={sankalpDetails.specialInstructions || ""}
            onChange={(e) => updateSankalpDetails({ specialInstructions: e.target.value })}
            className="mt-2 w-full rounded-xl border border-[#d8c3a1] bg-white p-3 text-[13.5px] text-[#2b241d] focus:border-[#d4872b] focus:outline-none focus:ring-1 focus:ring-[#d4872b]"
          />
        </div>
      </div>
    </div>
  );
};

export default StepSankalp;
