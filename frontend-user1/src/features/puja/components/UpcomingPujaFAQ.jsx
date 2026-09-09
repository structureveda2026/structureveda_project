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
      className="mt-16 mb-8 sm:mt-20 sm:mb-12"
    >
      <div className="mx-auto max-w-[960px]">
        {/* ── Section Header ── */}
        <div className="mb-10 text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
            <HelpCircle size={12} className="text-[#c77722]" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="font-serif text-[28px] font-bold text-[#2b241d] sm:text-[36px]">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto max-w-[680px] text-[14.5px] leading-relaxed text-[#6b5d4e]">
            Everything you need to know about remote participation, personalized Sankalp chanting in
            Kashi, Shastric Muhurats, and Prasad delivery.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-4 flex items-center justify-center gap-2.5 text-[#c77722]/50"
          >
            <span className="h-px w-8 bg-[#c77722]/30 sm:w-12" />
            <Sparkles size={11} className="text-[#c77722]" />
            <span className="h-px w-8 bg-[#c77722]/30 sm:w-12" />
          </div>
        </div>

        {/* ── FAQ Accordion Stack ── */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-panel-${idx}`;
            const buttonId = `faq-button-${idx}`;

            return (
              <div
                key={idx}
                className={`overflow-hidden rounded-[20px] border transition-all duration-200 ${
                  isOpen
                    ? "border-[#c77722] bg-[#fffdfa] shadow-[0_6px_22px_rgba(199,119,34,0.08)]"
                    : "border-[#ebdcc4] bg-[#fffdfa]/90 hover:border-[#c77722]/70 hover:bg-[#fffdfa]"
                }`}
              >
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => handleToggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors sm:px-6 sm:py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
                >
                  <span className="font-serif text-[16.5px] font-bold text-[#2b241d] sm:text-[18px]">
                    {faq.question}
                  </span>

                  <div
                    className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                      isOpen
                        ? "border-[#c77722] bg-[#eab12c] text-[#1c1308] rotate-180"
                        : "border-[#ebdcc4] bg-[#fffaf0] text-[#b36c1e]"
                    }`}
                  >
                    <ChevronDown size={15} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="border-t border-[#f0e2cd] px-5 pt-3.5 pb-5 text-[13.5px] leading-relaxed text-[#685c4f] sm:px-6 sm:pb-6"
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
