import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const getDefaultFaqs = (astrologerName = "Vishal Bhardwaj") => {
  const firstName = astrologerName.split(" ")[0] || astrologerName;
  return [
    {
      question: "How long is each consultation session?",
      answer:
        "Sessions range from 30 minutes (Essential Clarity) to 60 minutes (Complete Kundali Analysis), 90 minutes (Deep-Dive), and extended 3-hour family consultations. You can select your preferred duration during booking.",
    },
    {
      question: "How is the consultation conducted online?",
      answer:
        "Consultations take place via private 1-on-1 Audio or Video calls over a secure link. You can join conveniently from your phone, laptop, or tablet from anywhere in the world.",
    },
    {
      question: "Do I need a pre-made Kundali before the session?",
      answer: `No, you only need your exact date of birth, time of birth, and place of birth. Astrologer ${astrologerName} casts and computes your precise Janam Kundali, Navamsha (D-9), and planetary strengths directly.`,
    },
    {
      question: "Can I ask multiple questions during the session?",
      answer:
        "Yes, every consultation includes dedicated time for your personal questions. For multiple life domains (e.g. career + marriage + finance), we recommend the 60-minute or 90-minute package for adequate depth.",
    },
    {
      question: "Is my personal data and consultation confidential?",
      answer: `Absolutely. 100% privacy and confidentiality are guaranteed. Your birth details, personal circumstances, and conversation remain strictly private between you and Astrologer ${firstName}.`,
    },
    {
      question: "Will suitable Vedic remedies be provided?",
      answer: `Yes. If astrological afflictions or unfavorable planetary periods are identified, ${firstName} provides authentic, practical Vedic remedies — including mantra sadhana, karma alignments, and gemstone guidance rooted in Sanatan traditions.`,
    },
    {
      question: "In which languages is the consultation available?",
      answer:
        "Consultations are conducted fluently in both Hindi and English, according to your preference and comfort.",
    },
    {
      question: "Can I reschedule my appointment if something urgent comes up?",
      answer:
        "Yes, you can easily reschedule your consultation slot prior to the session time through our support team or booking confirmation page.",
    },
  ];
};

const AstrologerFaq = ({
  eyebrow = "Clarity & Assurance",
  heading = "Frequently Asked Questions",
  description = "Everything you need to know about the consultation format, chart analysis, privacy, and Vedic remedies.",
  astrologerName = "Vishal Bhardwaj",
  faqs,
  supportPromptText = "Have a specific question not listed here?",
  supportLinkText = "Connect directly with our consultation support",
  onBookConsultation,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqList = faqs || getDefaultFaqs(astrologerName);

  return (
    <section
      id="faq"
      className="reveal-on-scroll scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute -left-28 top-1/4 h-[450px] w-[450px] rounded-full bg-[#d4872b]/[0.04] blur-[120px]" />

      <div className="relative mx-auto max-w-[860px]">
        {/* Section Header */}
        <div className="mb-14 text-center sm:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#d4872b]/70" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
              {eyebrow}
            </p>
            <span className="h-px w-8 bg-[#d4872b]/70" />
          </div>

          <h2 className="font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[46px] lg:text-[48px]">
            {heading}
          </h2>

          {description && (
            <p className="mx-auto mt-4 max-w-[600px] text-[15px] leading-relaxed text-[#685c4f]">
              {description}
            </p>
          )}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqList.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-[22px] border-2 transition-all duration-300 ${
                  isOpen
                    ? "border-[#d4872b] bg-white shadow-[0_10px_30px_rgba(212,135,43,0.12)]"
                    : "border-[#ead8b8] bg-white/90 hover:border-[#d4872b]/70 hover:bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors"
                >
                  <span className="flex items-center gap-3.5 pr-4 text-[15.5px] font-semibold text-[#2b241d]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] font-serif text-[12px] font-bold text-[#b36c1e]">
                      {index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-[#eab12c] text-[#2b241d] rotate-180"
                        : "bg-[#f8edd8] text-[#b36c1e]"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[#f0e2cd] bg-[#fffdf9] p-6 pt-5">
                    <p className="text-[14.5px] leading-relaxed text-[#685c4f]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Help Prompt */}
        <div className="mt-10 rounded-2xl border border-[#ead8b8] bg-[#f8edd8]/60 p-5 text-center">
          <p className="text-[13.5px] text-[#685c4f]">
            {supportPromptText}{" "}
            <button
              type="button"
              onClick={onBookConsultation}
              className="font-bold text-[#b36c1e] underline underline-offset-4 hover:text-[#2b241d]"
            >
              {supportLinkText}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AstrologerFaq;
