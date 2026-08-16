import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";

const BirthDetailsStep = ({ data, onUpdate, onNext, onPrev }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!data.timeOfBirth) {
      newErrors.timeOfBirth = "Time of birth is required";
    }

    if (!data.placeOfBirth.trim()) {
      newErrors.placeOfBirth = "Place of birth is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div className="rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-8">
      <h2 className="font-serif text-[28px] text-[#F7F4ED]">Your Birth Details</h2>
      <p className="mt-2 text-[14px] text-[#B8A88F]">
        Accurate birth details help the astrologer understand your Kundali more precisely.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-[13px] font-medium text-[#E8D28A]">
            Date of Birth <span className="text-[#C9A227]">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={data.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`mt-2 w-full rounded-lg border-2 bg-[#121212] px-4 py-3 text-[14px] text-[#F7F4ED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
              errors.dateOfBirth ? "border-red-500" : "border-[#3a3026]"
            }`}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-[12px] text-red-400">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Birth Time Accuracy */}
        <div>
          <label className="block text-[13px] font-medium text-[#E8D28A]">
            Do you know your exact birth time? <span className="text-[#C9A227]">*</span>
          </label>
          <div className="mt-3 space-y-2">
            {[
              { value: "yes", label: "Yes, exact time" },
              { value: "approximately", label: "Approximately" },
              { value: "no", label: "I don't know" }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("birthTimeAccuracy", option.value)}
                className={`block w-full rounded-lg border-2 px-5 py-3 text-left text-[13px] font-medium transition-all ${
                  data.birthTimeAccuracy === option.value
                    ? "border-[#C9A227] bg-[#C9A227] text-[#121212]"
                    : "border-[#3a3026] text-[#E8D28A] hover:border-[#C9A227]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time of Birth */}
        <div>
          <label htmlFor="timeOfBirth" className="block text-[13px] font-medium text-[#E8D28A]">
            {data.birthTimeAccuracy === "approximately" ? "Approximate Birth Time" : "Time of Birth"}{" "}
            <span className="text-[#C9A227]">*</span>
          </label>
          <input
            type="time"
            id="timeOfBirth"
            value={data.timeOfBirth}
            onChange={(e) => handleChange("timeOfBirth", e.target.value)}
            className={`mt-2 w-full rounded-lg border-2 bg-[#121212] px-4 py-3 text-[14px] text-[#F7F4ED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
              errors.timeOfBirth ? "border-red-500" : "border-[#3a3026]"
            }`}
          />
          {errors.timeOfBirth && (
            <p className="mt-1 text-[12px] text-red-400">{errors.timeOfBirth}</p>
          )}
        </div>

        {/* Info for "I don't know" */}
        {data.birthTimeAccuracy === "no" && (
          <div className="rounded-lg border border-[#C9A227]/30 bg-[#C9A227]/5 p-4">
            <div className="flex gap-3">
              <Info size={18} className="shrink-0 text-[#C9A227]" />
              <p className="text-[13px] leading-relaxed text-[#E8D28A]">
                Please share the closest available information. The astrologer can guide you during the consultation.
              </p>
            </div>
          </div>
        )}

        {/* Place of Birth */}
        <div>
          <label htmlFor="placeOfBirth" className="block text-[13px] font-medium text-[#E8D28A]">
            Place of Birth <span className="text-[#C9A227]">*</span>
          </label>
          <input
            type="text"
            id="placeOfBirth"
            value={data.placeOfBirth}
            onChange={(e) => handleChange("placeOfBirth", e.target.value)}
            placeholder="City, State, Country"
            className={`mt-2 w-full rounded-lg border-2 bg-[#121212] px-4 py-3 text-[14px] text-[#F7F4ED] placeholder-[#8a7c6b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
              errors.placeOfBirth ? "border-red-500" : "border-[#3a3026]"
            }`}
          />
          {errors.placeOfBirth && (
            <p className="mt-1 text-[12px] text-red-400">{errors.placeOfBirth}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onPrev}
            className="w-full rounded-lg border-2 border-[#3a3026] px-6 py-4 text-[14px] font-semibold text-[#E8D28A] transition-all hover:border-[#C9A227]"
          >
            Back
          </button>
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-6 py-4 text-[14px] font-semibold text-[#121212] transition-all hover:bg-[#E8D28A]"
          >
            Continue
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default BirthDetailsStep;
