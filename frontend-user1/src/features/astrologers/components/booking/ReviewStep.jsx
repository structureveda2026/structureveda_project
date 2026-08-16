import { Edit2, ArrowRight } from "lucide-react";

const ReviewStep = ({ bookingData, onEdit, onConfirm, onPrev }) => {
  const { astrologer, consultation, user, birthDetails, preferences } = bookingData;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-8">
        <h2 className="font-serif text-[28px] text-[#F7F4ED]">Review Your Consultation</h2>
        <p className="mt-2 text-[14px] text-[#B8A88F]">
          Please review your details before confirming.
        </p>

        <div className="mt-8 space-y-6">
          {/* Astrologer */}
          <div className="rounded-xl border border-[#3a3026] bg-[#121212] p-6">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
              ASTROLOGER
            </h3>
            <div className="mt-4">
              <p className="font-serif text-[18px] font-semibold text-[#F7F4ED]">
                {astrologer.name}
              </p>
              <p className="mt-1 text-[13px] text-[#B8A88F]">{astrologer.title}</p>
              <p className="mt-1 text-[12px] text-[#8a7c6b]">{astrologer.location}</p>
            </div>
          </div>

          {/* Consultation */}
          <div className="rounded-xl border border-[#3a3026] bg-[#121212] p-6">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
              CONSULTATION
            </h3>
            <div className="mt-4 space-y-2">
              <p className="text-[14px] text-[#F7F4ED]">{consultation.title}</p>
              <p className="text-[13px] text-[#B8A88F]">
                Mode: <span className="text-[#E8D28A]">{preferences.consultationMode}</span>
              </p>
            </div>
          </div>

          {/* Your Details */}
          <div className="rounded-xl border border-[#3a3026] bg-[#121212] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                YOUR DETAILS
              </h3>
              <button
                onClick={() => onEdit(1)}
                className="flex items-center gap-1 text-[12px] font-medium text-[#E8D28A] transition-colors hover:text-[#C9A227]"
              >
                <Edit2 size={14} />
                Edit
              </button>
            </div>
            <div className="mt-4 space-y-2 text-[13px]">
              <p className="text-[#B8A88F]">
                Name: <span className="text-[#F7F4ED]">{user.fullName}</span>
              </p>
              <p className="text-[#B8A88F]">
                Email: <span className="text-[#F7F4ED]">{user.email}</span>
              </p>
              <p className="text-[#B8A88F]">
                Phone: <span className="text-[#F7F4ED]">{user.phone}</span>
              </p>
              <p className="text-[#B8A88F]">
                City: <span className="text-[#F7F4ED]">{user.city}, {user.country}</span>
              </p>
              {user.gender && (
                <p className="text-[#B8A88F]">
                  Gender: <span className="text-[#F7F4ED]">{user.gender}</span>
                </p>
              )}
            </div>
          </div>

          {/* Birth Details */}
          <div className="rounded-xl border border-[#3a3026] bg-[#121212] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                BIRTH DETAILS
              </h3>
              <button
                onClick={() => onEdit(2)}
                className="flex items-center gap-1 text-[12px] font-medium text-[#E8D28A] transition-colors hover:text-[#C9A227]"
              >
                <Edit2 size={14} />
                Edit
              </button>
            </div>
            <div className="mt-4 space-y-2 text-[13px]">
              <p className="text-[#B8A88F]">
                Date of Birth: <span className="text-[#F7F4ED]">{formatDate(birthDetails.dateOfBirth)}</span>
              </p>
              <p className="text-[#B8A88F]">
                Time of Birth: <span className="text-[#F7F4ED]">{formatTime(birthDetails.timeOfBirth)}</span>
              </p>
              <p className="text-[#B8A88F]">
                Place of Birth: <span className="text-[#F7F4ED]">{birthDetails.placeOfBirth}</span>
              </p>
              <p className="text-[#B8A88F]">
                Birth Time Accuracy:{" "}
                <span className="text-[#F7F4ED]">
                  {birthDetails.birthTimeAccuracy === "yes"
                    ? "Exact time"
                    : birthDetails.birthTimeAccuracy === "approximately"
                    ? "Approximately"
                    : "Not known"}
                </span>
              </p>
            </div>
          </div>

          {/* Topics & Question */}
          <div className="rounded-xl border border-[#3a3026] bg-[#121212] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                CONSULTATION TOPICS
              </h3>
              <button
                onClick={() => onEdit(3)}
                className="flex items-center gap-1 text-[12px] font-medium text-[#E8D28A] transition-colors hover:text-[#C9A227]"
              >
                <Edit2 size={14} />
                Edit
              </button>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {preferences.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-[#C9A227] bg-[#C9A227]/10 px-3 py-1 text-[12px] text-[#E8D28A]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              {preferences.mainQuestion && (
                <div className="mt-4">
                  <p className="text-[12px] font-semibold text-[#B8A88F]">Your Main Question:</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#E8D28A]">
                    {preferences.mainQuestion}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={onPrev}
            className="w-full rounded-lg border-2 border-[#3a3026] px-6 py-4 text-[14px] font-semibold text-[#E8D28A] transition-all hover:border-[#C9A227]"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-6 py-4 text-[14px] font-semibold text-[#121212] transition-all hover:bg-[#E8D28A]"
          >
            CONFIRM CONSULTATION
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
