import { useState } from "react";
import { ChevronDown, HelpCircle, ArrowRight, Sparkles, MessageSquare } from "lucide-react";

const JAPA_FAQS = [
  {
    q: "What is Mantra Japa and how does it differ from a standard Puja?",
    a: "While a Puja consists primarily of ritual offerings (Upacharas) to deities, Mantra Japa is a disciplined meditation practice involving the rhythmic, focused recitation of sacred Vedic or Tantric shlokas for a fixed count (Anushthan), generating concentrated spiritual resonance for the devotee's specific Sankalpa.",
  },
  {
    q: "Which Japa recitation counts are available?",
    a: "Standard Anushthan tiers supported across our services include 11,000 (Laghu Japa), 21,000 (Madhyama), 51,000 (Maha Japa), and 1,25,000 (Vedic Purascharana). Note that available counts are tailored to the specific Shastric rules of each individual deity mantra.",
  },
  {
    q: "How is the completion duration determined?",
    a: "Duration is mathematically governed by Shastric recitation quotas: typically 2,000 to 2,500 recitations per Pandit per day across a 4-hour chanting session. Dividing the total count by the squad's daily chanting capacity yields the required number of days.",
  },
  {
    q: "How many Pandits are required for a Japa Anushthan?",
    a: "Depending on the total count and complexity of the mantra Chandas, team sizes range from a minimum of 2 Purohits (for 11k counts) up to 11 senior Vedic scholars for a 1,25,000 Purascharana ceremony.",
  },
  {
    q: "Can Mantra Japa be performed remotely on my behalf?",
    a: "Yes. In the Remote Sankalpa mode, the Purohits recite your specific Gotra, Janma Nakshatra, and intention at the beginning of each session on your behalf, with the same spiritual efficacy as in-person presence.",
  },
  {
    q: "Is Kashi Kshetra Japa available?",
    a: "Yes. All canonical Japa ceremonies offer the option to be arranged directly in Varanasi (Kashi) at sanctified temple mandaps along the sacred Ganga kshetra by verified Gurukul Acharyas.",
  },
  {
    q: "What Prasad and consecrated items are included?",
    a: "Upon completion, the rosary (Mala) energized during recitation, consecrated protective Raksha Sutra thread, and sanctum-touched dry Prasad (Vibhuti, Kumkum, Akshat) are carefully packaged and couriered to your mailing address.",
  },
  {
    q: "Can I request a custom Japa count or rare Vedic mantra?",
    a: "Yes. If your family tradition or Jyotish consultation recommends a specific unlisted mantra or custom recitation count, our Vedic coordination team can arrange a tailored Anushthan.",
  },
];

/**
 * Section 08: FAQs & Final Restrained Booking CTA
 * Consolidates scriptural FAQs and conversion banner in the warm ivory design system.
 */
const JapaFAQAndCTA = ({ onExploreClick, onCustomClick }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="border-b border-[#ead8bc] bg-[#f8f1e6] py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-[700px] mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8bc] bg-[#fffcf6] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8a561c]">
            <HelpCircle size={12} className="text-[#b77920]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="mt-3 font-serif text-[28px] sm:text-[34px] font-bold text-[#30251c]">
            Questions About Vedic Mantra Japa
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[#6b5845]">
            Everything you need to know about counts, duration, Pandit qualifications, and Prasad delivery.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-10 mx-auto max-w-[840px] space-y-3">
          {JAPA_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-[#ead8bc] bg-[#fffdfa] transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[#fffcf7] cursor-pointer"
                >
                  <span className="font-serif text-[16px] sm:text-[17px] font-bold text-[#30251c] pr-4">
                    {faq.q}
                  </span>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 bg-[#b77920] text-white"
                        : "bg-[#f4e7d3] text-[#7a4814]"
                    }`}
                  >
                    <ChevronDown size={15} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[#f0e3ce] bg-[#fdf9f2] p-5 pt-4 text-[13.5px] leading-relaxed text-[#5c4d3c]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final Conversion Banner (Restrained Warm Palette) */}
        <div className="mt-16 mx-auto max-w-[960px] overflow-hidden rounded-[26px] border border-[#ead8bc] bg-[#fffcf6] p-8 sm:p-12 text-center shadow-xs">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8bc] bg-[#fbf6ed] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8a561c]">
            <Sparkles size={12} className="text-[#b77920]" />
            <span>Begin Your Sacred Sankalpa</span>
          </div>

          <h2 className="mt-4 font-serif text-[28px] sm:text-[36px] font-bold text-[#30251c]">
            Begin Your Mantra Japa With Sankalpa
          </h2>

          <p className="mx-auto mt-3 max-w-[620px] text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#6b5845]">
            Select from our authentic Vedic ceremonies performed by initiated scholars with rigorous
            anushthan counts, personalized Sankalpa, and consecrated sanctum Prasad.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 rounded-full bg-[#b77920] px-7 py-3 text-[13.5px] font-bold text-white shadow-xs transition-all hover:bg-[#8f5211] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b77920] cursor-pointer"
            >
              <span>Explore All Japa Ceremonies</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={onCustomClick}
              className="inline-flex items-center gap-2 rounded-full border border-[#ead8bc] bg-white px-6 py-3 text-[13.5px] font-bold text-[#6d4c1b] transition-all hover:border-[#b77920] hover:bg-[#faf3e8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b77920] cursor-pointer"
            >
              <MessageSquare size={14} className="text-[#b77920]" />
              <span>Request Custom Japa Enquiry</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JapaFAQAndCTA;

