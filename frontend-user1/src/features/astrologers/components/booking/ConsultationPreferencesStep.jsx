import { useState } from "react";
import { ArrowRight, Check, Phone, Video } from "lucide-react";

const CONSULTATION_TOPICS = [
  "Career & Job",
  "Business",
  "Marriage",
  "Relationship",
  "Finance",
  "Family",
  "Education",
  "Property",
  "Foreign Travel",
  "Life Decisions",
  "Remedies & Muhurat",
  "Other"
];

const ConsultationPreferencesStep = ({ data, onUpdate, onNext, onPrev }) => {
  const [errors, setErrors] = useState({});

  const handleTopicToggle = (topic) => {
    const newTopics = data.topics.includes(topic)
      ? data.topics.filter(t => t !== topic)
      : [...data.topics, topic];

    onUpdate({ topics: newTopics });
    if (errors.topics) {
      setErrors(prev => ({ ...prev, topics: "" }));
    }
  };

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (data.topics.length === 0) {
      newErrors.topics = "Please select at least one consultation topic";
    }

    if (!data.consultationMode) {
      newErrors.consultationMode = "Please select a consultation mode";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  const characterCount = data.mainQuestion.length;
  const maxCharacters = 500;

  return (
    <div className="rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-8">
      <h2 className="font-serif text-[28px] text-[#F7F4ED]">What Would You Like Guidance On?</h2>
      <p className="mt-2 text-[14px] text-[#B8A88F]">
        Select the areas you'd like to discuss during your consultation.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Topics */}
        <div>
          <label className="block text-[13px] font-medium text-[#E8D28A]">
            Consultation Topics <span className="text-[#C9A227]">*</span>
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CONSULTATION_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleTopicToggle(topic)}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-[13px] font-medium transition-all ${
                  data.topics.includes(topic)
                    ? "border-[#C9A227] bg-[#C9A227] text-[#121212]"
                    : "border-[#3a3026] text-[#E8D28A] hover:border-[#C9A227]"
                }`}
              >
                {data.topics.includes(topic) && <Check size={16} />}
                {topic}
              </button>
            ))}
          </div>
          {errors.topics && (
            <p className="mt-2 text-[12px] text-red-400">{errors.topics}</p>
          )}
        </div>

        {/* Main Question */}
        <div>
          <label htmlFor="mainQuestion" className="block text-[13px] font-medium text-[#E8D28A]">
            Your Main Question <span className="text-[#8a7c6b]">(Optional)</span>
          </label>
          <p className="mt-1 text-[12px] text-[#8a7c6b]">
            What would you most like clarity on?
          </p>
          <textarea
            id="mainQuestion"
            value={data.mainQuestion}
            onChange={(e) => {
              if (e.target.value.length <= maxCharacters) {
                handleChange("mainQuestion", e.target.value);
              }
            }}
            placeholder="Tell us briefly what you would like to discuss during your consultation..."
            rows={5}
            className="mt-2 w-full rounded-lg border-2 border-[#3a3026] bg-[#121212] px-4 py-3 text-[14px] text-[#F7F4ED] placeholder-[#8a7c6b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
          />
          <div className="mt-1 text-right text-[12px] text-[#8a7c6b]">
            {characterCount} / {maxCharacters}
          </div>
        </div>

        {/* Consultation Mode */}
        <div>
          <label className="block text-[13px] font-medium text-[#E8D28A]">
            Preferred Consultation Mode <span className="text-[#C9A227]">*</span>
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleChange("consultationMode", "Audio Call")}
              className={`flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                data.consultationMode === "Audio Call"
                  ? "border-[#C9A227] bg-[#C9A227]/10"
                  : "border-[#3a3026] hover:border-[#C9A227]"
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                data.consultationMode === "Audio Call" ? "bg-[#C9A227]" : "bg-[#3a3026]"
              }`}>
                <Phone size={20} className={data.consultationMode === "Audio Call" ? "text-[#121212]" : "text-[#E8D28A]"} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#F7F4ED]">Audio Call</p>
                <p className="mt-1 text-[12px] text-[#B8A88F]">One-to-one voice consultation</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleChange("consultationMode", "Video Call")}
              className={`flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                data.consultationMode === "Video Call"
                  ? "border-[#C9A227] bg-[#C9A227]/10"
                  : "border-[#3a3026] hover:border-[#C9A227]"
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                data.consultationMode === "Video Call" ? "bg-[#C9A227]" : "bg-[#3a3026]"
              }`}>
                <Video size={20} className={data.consultationMode === "Video Call" ? "text-[#121212]" : "text-[#E8D28A]"} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#F7F4ED]">Video Call</p>
                <p className="mt-1 text-[12px] text-[#B8A88F]">Face-to-face guidance</p>
              </div>
            </button>
          </div>
          {errors.consultationMode && (
            <p className="mt-2 text-[12px] text-red-400">{errors.consultationMode}</p>
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
            Continue to Review
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationPreferencesStep;
