import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const HOMA_FAQS = [
  {
    q: 'What is the difference between Homa and Havan?',
    a: 'In Vedic practice, "Homa" and "Havan" are largely synonymous terms referring to fire rituals where sacred Ahutis (offerings) are made into consecrated Agni with specific Mantras and Sankalpa. In regional dialects, Havan is the common Hindi and colloquial term, while Homa is the classical Sanskrit Shastric term frequently used in Agama and Vedic treatises.',
  },
  {
    q: 'Can I choose the number of Havan?',
    a: 'Yes, but available Havan counts are service-specific. Not every Homa supports every count. Standard options across our catalogue include 1, 3, 5, 7, and 11 Havan sessions (or Custom). When you select a specific Homa, our system only displays the Havan counts that are scripturally and practically supported for that ritual.',
  },
  {
    q: 'Can I choose multiple days?',
    a: 'Yes, for rituals that support multi-day Anushthana (such as Maha Mrityunjaya, Durga Chandi, or extended Navagraha Homas), you can configure 2 or 3 day sessions. Shorter rituals, such as standard Maha Ganapati or Vastu Shanti, are traditionally performed as single-day ceremonies and will only show 1 Day available.',
  },
  {
    q: 'How many Pandits will perform the Homa?',
    a: 'The size of the Pandit team is determined strictly by your Homa configuration—including the ritual type, the total number of Havans, and the duration. A 1-day single Havan typically requires 2 to 3 Pandits, whereas multi-day 7 or 11 Havan rituals may require 5 to 7 or more Pandits to sustain continuous Vedic chanting and Ahuti offerings.',
  },
  {
    q: 'Is Samagri included in the arrangement?',
    a: 'Yes, all essential ritual materials—including pure Desi Cow Ghee (Ghrita), dry Samidha wood, standard herbs, dhanya, kumkum, and akshata—are included in our foundational arrangement. Specialized ritual offerings (such as lotus flowers for Lakshmi Homa or bilva leaves for Rudra Homa) are catalogued as dedicated service items.',
  },
  {
    q: 'Can I perform Homa in Kashi?',
    a: 'Yes, selected Homas can be arranged directly in the sacred Kshetra of Kashi (Varanasi), subject to ritual venue and schedule availability. Each service in our catalogue explicitly indicates whether Kashi arrangements and/or Remote live streaming arrangements are available.',
  },
  {
    q: 'Can I book from outside India?',
    a: 'Yes, devotees residing in the United States, United Kingdom, Europe, Canada, Australia, and worldwide can arrange rituals. Your Gotra and Nakshatra Sankalpa is recited in your name before Agni, and a high-definition remote link allows you to witness the fire ritual in real-time.',
  },
  {
    q: 'Can I request a custom Homa?',
    a: 'Absolutely. If you require a specialized fire ritual not listed in the standard catalogue—or wish to organize an extensive 21 or 51 Ahuti cycle—you can submit a custom inquiry via our "Request Custom Homa" section. Our coordinating Acharyas will review the Shastric requirements and structure a dedicated arrangement.',
  },
];

export default function HomaFaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-[#fbf8f2] border-b border-[#e8dfd1]" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf3e3] border border-[#ebdcc4] text-xs font-semibold uppercase tracking-wider text-[#b36c1e] mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMMON INQUIRIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2a221b]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#685847] mt-2">
            Clear, honest answers regarding Vedic Havan configuration, Pandit requirements, and ritual logistics.
          </p>
        </div>

        {/* Accessible Accordion */}
        <div className="space-y-4">
          {HOMA_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#ebdcc4] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#fcfaf6] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b36c1e]"
                >
                  <span className="font-serif font-semibold text-base text-[#2a221b]">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-[#ebdcc4] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#b36c1e] text-white border-[#b36c1e]' : 'bg-[#faf6ee] text-[#7d5329]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="px-6 pb-5 pt-1 text-sm text-[#5d4f40] leading-relaxed border-t border-[#f0e8dc] bg-[#fffdf9]"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
