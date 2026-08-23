import { Calendar, FileText, CreditCard, Video, CheckCircle2, ArrowRight } from "lucide-react";

export const getBookingSteps = (astrologerName = "Vishal Bhardwaj") => [
  {
    step: "01",
    title: "Select Package",
    subtitle: "Choose Duration & Focus",
    description:
      "Pick the consultation tier that fits your needs — from 30-min Essential Clarity to 60-min Complete Guidance.",
    Icon: Calendar,
  },
  {
    step: "02",
    title: "Provide Birth Details",
    subtitle: "Accurate Kundali Casting",
    description:
      "Enter your Date, exact Time, and Place of Birth along with your specific questions and preferred language.",
    Icon: FileText,
  },
  {
    step: "03",
    title: "Pick Slot & Confirm",
    subtitle: "Secure & Instant Booking",
    description:
      "Choose an available date and time slot that suits your schedule and complete secure online payment.",
    Icon: CreditCard,
  },
  {
    step: "04",
    title: "Live 1-on-1 Session",
    subtitle: "Private Audio / Video Call",
    description: `Join the secure consultation link at your scheduled time to connect directly with Astrologer ${astrologerName}.`,
    Icon: Video,
  },
];

const AstrologerBookingProcess = ({
  eyebrow = "Simple & Seamless Process",
  heading = "How Your Consultation Booking Works",
  description = "Book your private consultation in 4 effortless steps with instant slot confirmation.",
  astrologerName = "Vishal Bhardwaj",
  steps,
  buttonText = "Start Your Booking Now",
  onBookConsultation,
}) => {
  const processSteps = steps || getBookingSteps(astrologerName);

  return (
    <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#f8edd8]/70 via-[#fffdf9] to-[#f8edd8]/50 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="relative mx-auto max-w-[1240px]">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-[760px] text-center sm:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#d4872b]/70" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
              {eyebrow}
            </p>
            <span className="h-px w-8 bg-[#d4872b]/70" />
          </div>

          <h2 className="font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[46px] lg:text-[50px]">
            {heading}
          </h2>

          {description && (
            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              {description}
            </p>
          )}
        </div>

        {/* 4 Process Step Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => {
            const StepIcon = step.Icon;
            return (
              <div
                key={step.step}
                className="group relative flex flex-col justify-between rounded-[26px] border-2 border-[#ead8b8] bg-white p-6 shadow-[0_8px_25px_rgba(80,60,30,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d4872b] hover:shadow-[0_18px_40px_rgba(212,135,43,0.15)] sm:p-7"
              >
                <div>
                  {/* Top Row: Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center rounded-full bg-[#f8edd8] px-3.5 py-1 font-serif text-[15px] font-bold text-[#b36c1e] transition-colors duration-300 group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                      Step {step.step}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e6cca0] bg-[#fffaf0] text-[#d4872b] shadow-[0_3px_12px_rgba(212,135,43,0.08)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#eab12c] group-hover:text-[#2b241d]">
                      <StepIcon size={20} strokeWidth={1.8} />
                    </div>
                  </div>

                  <p className="mt-5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#c77722]">
                    {step.subtitle}
                  </p>

                  <h3 className="mt-1 font-serif text-[22px] font-semibold text-[#2b241d] transition-colors duration-300 group-hover:text-[#a86616]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {step.description}
                  </p>
                </div>

                {/* Step Sequence Indicator */}
                <div className="mt-6 flex items-center gap-2 border-t border-[#f0e4cf] pt-3 text-[11.5px] font-semibold text-[#8c7e6c]">
                  <CheckCircle2 size={14} className="text-[#d4872b]" />
                  <span>Instant Confirmation</span>
                </div>

                {/* Bottom Gold Line */}
                <span className="absolute bottom-0 left-6 h-[3px] w-0 rounded-full bg-[#eab12c] transition-all duration-500 group-hover:w-16" />
              </div>
            );
          })}
        </div>

        {/* Action CTA Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onBookConsultation}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#eab12c] px-9 py-4 text-[14px] font-bold text-[#2b241d] shadow-[0_10px_25px_rgba(234,177,44,0.25)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_14px_32px_rgba(234,177,44,0.35)]"
          >
            <span>{buttonText}</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AstrologerBookingProcess;
