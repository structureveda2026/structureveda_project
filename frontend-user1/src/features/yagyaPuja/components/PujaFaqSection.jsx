import { useState } from "react";
import { ChevronDown } from "lucide-react";

const PujaFaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is a Vedic Puja?",
      answer:
        "A Vedic Puja is a traditional ceremony rooted in the sacred shastras, performed by offering prayers, mantras, and sanctified materials (samagri) to invoke divine presence and dedicated blessings for personal or family wellbeing.",
    },
    {
      question: "How long does a Puja take?",
      answer:
        "Duration depends upon the specific Puja selected and its prescribed ritual requirements. Essential services typically take around 2 hours, detailed arrangements take 3 hours, and extended procedures or multi-priest anushthan take 5 hours or more.",
    },
    {
      question: "Can I choose the date?",
      answer:
        "Yes. Unlike event-based collective ceremonies with fixed calendar schedules, our Puja services allow you to request your preferred auspicious date, subject to operational coordination and priest availability.",
    },
    {
      question: "How many Pandits will perform my Puja?",
      answer:
        "The required Pandit team is coordinated according to the specific ritual vidhi. Standard pujas are conducted by a principal Acharya with supporting assistants, while complex anushthans involve multiple trained Purohits.",
    },
    {
      question: "Can I book from outside Varanasi?",
      answer:
        "Yes. Devotees worldwide can arrange remote Puja services. Your Name and Gotra are invoked during the primary Sankalpa by our priests on the holy banks of River Ganga or in consecrated temples, accompanied by completion updates and prasad delivery.",
    },
    {
      question: "Can my family members be included?",
      answer:
        "Yes. Family-oriented Pujas allow you to include the names, Gotra, and Nakshatra of your spouse, children, or parents within the formal Sankalpa so all members receive divine blessings.",
    },
    {
      question: "Is Puja Samagri included?",
      answer:
        "Applicable ritual materials according to your selected service are arranged by Veda Structure. Exact inclusions for your chosen variant and location are clearly presented before booking confirmation.",
    },
    {
      question: "Can I perform Puja in Kashi?",
      answer:
        "Yes. We coordinate selected Pujas directly at iconic locations in Kashi (Varanasi), including Dashashwamedh and Manikarnika Ghats or traditional mandirs, whether you are visiting physically or participating remotely.",
    },
  ];

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[960px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            COMMON QUESTIONS
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Clear, honest answers regarding our Vedic Puja services, scheduling, samagri, and Sankalpa arrangements.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="mt-10 space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-[18px] border border-[#ebdcc4] bg-[#fffdfa] shadow-2xs transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-[#fcf8f0] sm:px-6 sm:py-5 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-[17.5px] font-bold text-[#2b241d]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={19}
                    className={`ml-4 shrink-0 text-[#b36c1e] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-[#f2e6d5] px-5 pb-5 pt-3.5 sm:px-6">
                    <p className="text-[14px] leading-relaxed text-[#685c4f]">
                      {faq.answer}
                    </p>
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

export default PujaFaqSection;
