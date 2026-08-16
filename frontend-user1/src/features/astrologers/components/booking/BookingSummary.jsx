import { Check } from "lucide-react";

const BookingSummary = ({ bookingData, currentStep }) => {
  const { astrologer, consultation, preferences } = bookingData;
  const savings = consultation.originalPrice - consultation.price;

  return (
    <div className="rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-6">
      <h3 className="font-serif text-[20px] text-[#F7F4ED]">Consultation Summary</h3>

      <div className="mt-6 space-y-4">
        {/* Consultation Title */}
        <div>
          <p className="text-[13px] font-semibold text-[#E8D28A]">
            {consultation.title}
          </p>
          <p className="mt-1 text-[12px] text-[#B8A88F]">with {astrologer.name}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#3a3026]" />

        {/* Price Breakdown */}
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between text-[#B8A88F]">
            <span>Original Price</span>
            <span className="line-through">₹{consultation.originalPrice}</span>
          </div>
          <div className="flex justify-between text-[#E8D28A]">
            <span>Consultation Price</span>
            <span className="font-semibold">₹{consultation.price}</span>
          </div>
          <div className="flex justify-between text-[#C9A227]">
            <span>You Save</span>
            <span className="font-semibold">₹{savings}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#3a3026]" />

        {/* Total */}
        <div className="flex items-baseline justify-between">
          <span className="text-[14px] font-semibold text-[#F7F4ED]">Total</span>
          <span className="font-serif text-[28px] font-bold text-[#C9A227]">
            ₹{consultation.price}
          </span>
        </div>

        {/* Selected Topics (if available) */}
        {currentStep >= 3 && preferences.topics.length > 0 && (
          <>
            <div className="border-t border-[#3a3026]" />
            <div>
              <p className="text-[12px] font-semibold text-[#E8D28A]">Selected Topics:</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {preferences.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-2 py-1 text-[10px] text-[#E8D28A]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Consultation Mode (if selected) */}
        {currentStep >= 3 && preferences.consultationMode && (
          <>
            <div className="border-t border-[#3a3026]" />
            <div className="flex items-center gap-2 text-[13px]">
              <Check size={16} className="text-[#C9A227]" />
              <span className="text-[#E8D28A]">{preferences.consultationMode}</span>
            </div>
          </>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 space-y-2 rounded-lg border border-[#3a3026] bg-[#121212] p-4">
        <div className="flex items-center gap-2 text-[11px] text-[#B8A88F]">
          <Check size={14} className="text-[#C9A227]" />
          <span>Secure Booking</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#B8A88F]">
          <Check size={14} className="text-[#C9A227]" />
          <span>Confidential Consultation</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#B8A88F]">
          <Check size={14} className="text-[#C9A227]" />
          <span>Personalized Vedic Guidance</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
