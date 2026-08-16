import { CheckCircle, ArrowRight } from "lucide-react";

const BookingConfirmation = ({ bookingData, onBackToVishal }) => {
  const { astrologer, consultation } = bookingData;

  return (
    <div className="min-h-[60vh] py-12">
      <div className="mx-auto max-w-[680px] text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-[#C9A227]/10 p-4">
            <CheckCircle size={64} className="text-[#C9A227]" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-8 font-serif text-[36px] text-[#F7F4ED] sm:text-[42px]">
          Your Consultation Request is Ready
        </h1>

        {/* Details Card */}
        <div className="mt-8 rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-8">
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            YOU HAVE SELECTED
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="font-serif text-[24px] font-semibold text-[#F7F4ED]">
                {astrologer.name}
              </p>
              <p className="mt-1 text-[14px] text-[#B8A88F]">{astrologer.title}</p>
              <p className="mt-1 text-[13px] text-[#8a7c6b]">{astrologer.location}</p>
            </div>

            <div className="border-t border-[#3a3026]" />

            <div>
              <p className="text-[15px] text-[#E8D28A]">{consultation.title}</p>
              <p className="mt-2 font-serif text-[32px] font-bold text-[#C9A227]">
                ₹{consultation.price}
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mt-8 rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/5 p-6">
          <p className="text-[14px] leading-7 text-[#E8D28A]">
            Your consultation details have been successfully prepared.
            <br />
            <br />
            Our booking system will confirm the appointment once backend and payment integration are connected.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onBackToVishal}
          className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-8 py-4 text-[14px] font-semibold text-[#121212] transition-all hover:bg-[#E8D28A]"
        >
          BACK TO VISHAL BHARDWAJ
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>

        {/* Additional Info */}
        <p className="mt-6 text-[12px] text-[#8a7c6b]">
          This is a frontend demonstration. No payment or API request has been made.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
