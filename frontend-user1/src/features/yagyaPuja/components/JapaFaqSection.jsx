import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const JapaFaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What is Mantra Japa?",
      a: "In the Vedic tradition, Japa is the disciplined, focused repetition of a sacred Mantra with a consecrated Sankalpa. It is performed under specific ritual rules, using chanting malas appropriate to the deity and guided by initiated Vedic priests.",
    },
    {
      q: "Which Japa counts are available?",
      a: "Standard benchmarks in the tradition include 11,000, 21,000, 51,000, and 1,25,000 (Purascharana) Japa. However, availability is configured per individual service, as classical Shastras prescribe different counts for different Mantras.",
    },
    {
      q: "How long does 1,25,000 Japa take?",
      a: "A 1,25,000 Maha Purna Japa typically spans between 9 to 14 days, depending on the assigned priest squad size and daily chanting capacity. Vedic chanting is never rushed; sufficient scholars are deployed to maintain proper Chandas meter and cadence.",
    },
    {
      q: "How many Pandits will perform the Japa?",
      a: "The required team of Pandits is calculated dynamically based on the total Japa count, the admin-configured daily capacity per priest, daily chanting hours, and target completion window. It typically ranges from 2 priests for shorter counts to 11 priests for full Purascharana anushthans.",
    },
    {
      q: "Can I choose the completion date?",
      a: "Yes, during future booking configuration, you may propose target dates or auspicious tithis (such as Purnima, Shivaratri, or Ekadashi), subject to priest team availability and required minimum chanting days.",
    },
    {
      q: "Can I book Japa from outside India?",
      a: "Yes. Devotees worldwide can arrange remote Japa. Your personal Sankalpa (Name, Gotra, Family details) is formally pronounced at the commencement, and daily progress or completion details are shared where applicable.",
    },
    {
      q: "Can Japa be performed in Kashi?",
      a: "Yes. Selected Japa services can be conducted directly in the sacred Kshetra of Kashi (Varanasi), either for visiting devotees who attend in person or arranged remotely on their behalf.",
    },
    {
      q: "Is Prasad available?",
      a: "Prasad and consecrated tokens (such as energized malas, holy bhasma, or raksha sutras) are optional and service-specific. Where included or selected, physical dispatch is arranged following ritual completion.",
    },
    {
      q: "Can I request a custom Japa?",
      a: "Yes. If your required deity, rare Mantra, or specific count is not part of our standard catalogue, you can submit a Custom Japa request for Acharya evaluation, capacity calculation, and tailored quotation.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[920px]">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            <HelpCircle size={14} className="text-[#c77722]" />
            <span>CLARITY & SHASTRA</span>
          </div>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Essential guidelines regarding Mantra counts, Pandit allocations, scheduling, and Kashi ritual coordination.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-12 space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const faqId = `japa-faq-ans-${index}`;
            const btnId = `japa-faq-btn-${index}`;

            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-[20px] border border-[#e8d5bc] bg-[#fffaf2] shadow-xs transition duration-200 hover:border-[#c77722]"
              >
                <button
                  type="button"
                  id={btnId}
                  aria-expanded={isOpen}
                  aria-controls={faqId}
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left text-[16px] font-semibold text-[#2b241d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722] cursor-pointer"
                >
                  <span className="font-serif">{faq.q}</span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f4e6d1] text-[#8e5a1e] transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#c77722] text-white" : ""
                    }`}
                  >
                    <ChevronDown size={17} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={faqId}
                    role="region"
                    aria-labelledby={btnId}
                    className="border-t border-[#f0dfca] bg-[#fffdfa] px-5 py-4 text-[14px] leading-relaxed text-[#685c4f]"
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
};

export default JapaFaqSection;
