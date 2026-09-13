import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

/**
 * Verified FAQ content grounded strictly in existing repository data,
 * SankalpForm architecture, and Shastric ritual procedures.
 */
const FAQ_ITEMS = [
  {
    question: "What is an Upcoming Puja?",
    answer:
      "Upcoming Pujas are date-specific Vedic ceremonies scheduled on auspicious Shastric Muhurats, festivals, or holy tithis in Kashi (Varanasi). Devotees participate by registering their personal or family Sankalp, which is individually chanted by certified Vedic Purohits during the collective ceremony.",
  },
  {
    question: "Can I participate remotely if I cannot travel to Kashi?",
    answer:
      "Yes, physical presence in Kashi is not required. Your personalized Sankalp—including your Name, Gotra, and specific prayer intentions—is invoked directly before the deity by learned Brahmins. Following the completion of the ritual, ceremony video updates and sanctified Prasadam are dispatched to your home.",
  },
  {
    question: "How does the personalized Sankalp work?",
    answer:
      "During registration, you provide your name, Gotra, date of birth, and personal intention. At the commencement of the ritual (the Sankalp Vidhi), the Acharyas invoke your details before the sacred fire or Shiva Lingam, dedicating the spiritual merit and cosmic vibrations of the ceremony to you.",
  },
  {
    question: "Can I include my family members in the Sankalp?",
    answer:
      "Yes. Depending on the ceremony package chosen (Individual, Couple, or Family), you can include up to 6 immediate family members with their individual names and Gotras. Every member's name is chanted by the Purohits during the formal Sankalp invocation.",
  },
  {
    question: "Where are these sacred ceremonies performed?",
    answer:
      "All ceremonies are conducted in authentic sacred kshetras in Varanasi (Kashi), such as shrines near Kashi Vishwanath Kshetra, Dashashwamedh Ghat, Manikarnika, and dedicated Vedic Yagya Shalas by traditionally trained Brahmins.",
  },
  {
    question: "What if I do not know my Gotra?",
    answer:
      "If you do not know your Gotra, our Acharyas will perform the Sankalp using the universal Kashyap Gotra alongside your birth name and date of birth, in full accordance with authentic Vedic Shastric sanction.",
  },
  {
    question: "What happens after I complete my booking?",
    answer:
      "You receive an instant digital booking confirmation with your ceremony details. On the scheduled day, the priest team arranges authentic samagri and conducts the ritual. Post-Purnahuti, video highlights are shared via WhatsApp or Email, and consecrated Prasadam is dispatched to your address.",
  },
  {
    question: "How do I know the exact date and timing of the Puja?",
    answer:
      "Every upcoming ceremony has a fixed Shastric date and Muhurat window displayed clearly on its ceremony card and on the Upcoming Puja Calendar above. You can view the scheduled date and start time prior to confirming your registration.",
  },
  {
    question: "What if a ceremony is marked 'Booking Closed' or 'Almost Full'?",
    answer:
      "To preserve ritual authenticity and provide dedicated time for individual Sankalp chanting, each ceremony has a finite registration capacity. Once capacity is reached or the booking window closes, registrations end for that date. You can explore upcoming dates on the calendar or request an on-demand personal ceremony in our Puja Catalogue.",
  },
  {
    question: "What is the difference between an Upcoming Puja and a Personal Puja?",
    answer:
      "Upcoming Pujas are date-specific collective rituals scheduled on significant astronomical tithis and festivals where devotees participate via individual Sankalps. Personal Pujas in our Catalogue are private ceremonies arranged exclusively for your household on your preferred date and customized Vedic timing.",
  },
];

const UpcomingPujaFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="upcoming-puja-faq"
      aria-label="Frequently Asked Questions About Upcoming Pujas"
      className="mt-14 mb-8 sm:mt-18 sm:mb-12"
    >
      <div className="mx-auto max-w-[1120px]">
        {/* ── Section Header ── */}
        <div className="mb-7 sm:mb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
            <HelpCircle size={12} className="text-[#c77722]" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="font-serif text-[26px] font-bold text-[#2b241d] sm:text-[32px] lg:text-[34px] leading-tight">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto max-w-[680px] text-[13.5px] sm:text-[14px] leading-relaxed text-[#6b5d4e]">
            Everything you need to know about remote participation, personalized Sankalp chanting in
            Kashi, Shastric Muhurats, and Prasad delivery.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-2.5 flex items-center justify-center gap-2 text-[#c77722]/50"
          >
            <span className="h-px w-7 bg-[#c77722]/30 sm:w-10" />
            <Sparkles size={11} className="text-[#c77722]" />
            <span className="h-px w-7 bg-[#c77722]/30 sm:w-10" />
          </div>
        </div>

        {/* ── FAQ Accordion Grid (2 columns on desktop/tablet, 1 on mobile) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-3 sm:gap-4">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-panel-${idx}`;
            const buttonId = `faq-button-${idx}`;

            return (
              <div
                key={idx}
                className={`overflow-hidden rounded-[16px] border transition-all duration-200 ${
                  isOpen
                    ? "border-[#c77722] bg-[#fffdfa] shadow-[0_4px_16px_rgba(199,119,34,0.06)]"
                    : "border-[#ebdcc4] bg-[#fffdfa] hover:border-[#c77722]/70"
                }`}
              >
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => handleToggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="flex w-full items-center justify-between gap-3.5 p-4 sm:p-4.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
                >
                  <span className="min-w-0 flex-1 font-serif text-[15px] sm:text-[16px] font-bold text-[#2b241d] leading-snug">
                    {faq.question}
                  </span>

                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                      isOpen
                        ? "border-[#c77722] bg-[#eab12c] text-[#1c1308] rotate-180"
                        : "border-[#ebdcc4] bg-[#fffaf0] text-[#b36c1e]"
                    }`}
                  >
                    <ChevronDown size={14} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="border-t border-[#f0e2cd] px-4.5 pt-3 pb-4.5 sm:px-5 sm:pb-5 text-[13px] sm:text-[13.5px] leading-relaxed text-[#685c4f]"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingPujaFAQ;
