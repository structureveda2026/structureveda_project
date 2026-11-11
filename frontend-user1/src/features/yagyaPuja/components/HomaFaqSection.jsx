import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const HOMA_FAQS = [
  {
    q: "What is the difference between Homa and Havan?",
    a: "In Vedic practice, 'Homa' and 'Havan' are synonymous terms referring to fire rituals where sacred Ahutis (offerings) are made into consecrated Agni with specific Mantras and Sankalpa. Havan is the colloquial and regional term, while Homa is the classical Sanskrit Shastric designation in Vedic and Agamic treatises.",
  },
  {
    q: "Can I choose the number of Havan sessions?",
    a: "Yes, but available Havan counts are ceremony-specific. Standard options across our catalogue include 1, 3, 5, 7, and 11 Havan sessions (or Custom). When you select a specific Homa, only scripturally authorized Havan counts for that tradition are available.",
  },
  {
    q: "Can I choose multiple days for a ceremony?",
    a: "Yes, for rituals that support multi-day Anushthana (such as Maha Mrityunjaya, Durga Chandi, or extended Navagraha Homas), you can configure 2 or 3 day sessions. Single-Havan ceremonies are completed in 1 day in accordance with Vedic rules.",
  },
  {
    q: "How many Pandits will perform the Homa?",
    a: "The size of the Acharya team is determined strictly by the ritual configuration—including the deity tradition, total Havans, and duration. A 1-day single Havan typically engages 2 to 3 initiated Pandits, whereas multi-day 7 or 11 Havan ceremonies engage 5 to 7 or more Pandits.",
  },
  {
    q: "Is Samagri included in the Dakshina?",
    a: "Yes, all foundational ritual materials—including pure Desi Cow Ghee (Ghrita), dry Samidha wood (Palash, Peepal, Shami), botanical herbs, dhanya, kumkum, and akshata—are included by default in the authoritative Dakshina.",
  },
  {
    q: "Can I perform Homa in Kashi or participate remotely?",
    a: "Yes, Homas can be arranged directly in the sacred Kshetra of Kashi (Varanasi), or conducted on your behalf with high-definition live Sankalpa streaming and consecrated bhasma dispatched to your home address.",
  },
  {
    q: "Can devotees outside India book a Homa ceremony?",
    a: "Yes, devotees residing across the globe regularly book rituals. Your Gotra and Nakshatra Sankalpa is recited in your name before Agni, and live streaming links allow you to participate in real-time.",
  },
];

export default function HomaFaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const leftFaqs = HOMA_FAQS.slice(0, 4);
  const rightFaqs = HOMA_FAQS.slice(4);

  const renderFaqCard = (faq, idx) => {
    const isOpen = openIndex === idx;

    return (
      <div
        key={idx}
        className="bg-[#FFFDF9] rounded-xl border border-[#EAD8B8] overflow-hidden transition-all duration-200 shadow-2xs hover:border-[#B7791F]/70"
      >
        <button
          type="button"
          onClick={() => toggleFaq(idx)}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${idx}`}
          id={`faq-question-${idx}`}
          className="w-full text-left px-5 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3.5 hover:bg-[#FFFAF0]/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B7791F] cursor-pointer"
        >
          <span className="font-serif font-semibold text-[14.5px] sm:text-[15.5px] text-[#29231B] leading-snug">
            {faq.q}
          </span>
          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 ${
              isOpen
                ? "rotate-180 bg-[#B7791F] text-white border-[#B7791F]"
                : "bg-[#FFFAF0] text-[#766D60] border-[#EAD8B8]"
            }`}
          >
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </button>

        {isOpen && (
          <div
            id={`faq-answer-${idx}`}
            role="region"
            aria-labelledby={`faq-question-${idx}`}
            className="px-5 pb-4 pt-1 sm:px-5 sm:pb-4.5 text-[13px] sm:text-[13.5px] text-[#766D60] leading-relaxed border-t border-[#F2E6D5] bg-[#FFFDF9]"
          >
            {faq.a}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FFFAF0] border-b border-[#EAD8B8]" id="faq">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EAD8B8] text-[10.5px] font-bold uppercase tracking-wider text-[#B7791F] mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMMON INQUIRIES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#29231B]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-[14.5px] text-[#766D60] mt-2 max-w-xl mx-auto">
            Clear answers regarding Vedic Havan configuration, Pandit requirements, and ritual logistics.
          </p>
        </div>

        {/* Desktop & Tablet: Balanced Two-Column Layout (4 on Left, 3 on Right) */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-5 items-start">
          <div className="space-y-3.5">
            {leftFaqs.map((faq, localIdx) => renderFaqCard(faq, localIdx))}
          </div>
          <div className="space-y-3.5">
            {rightFaqs.map((faq, localIdx) => renderFaqCard(faq, localIdx + 4))}
          </div>
        </div>

        {/* Mobile: Single Sequential Column (All 7 Questions in Order) */}
        <div className="md:hidden space-y-3">
          {HOMA_FAQS.map((faq, idx) => renderFaqCard(faq, idx))}
        </div>
      </div>
    </section>
  );
}
