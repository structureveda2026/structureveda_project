import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { YAGYA_PUJA_FAQS } from "../data/yagyaPujaData";

const YagyaPujaFaq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="border-t border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4e8d1] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            <HelpCircle size={12} />
            <span>Common Queries</span>
          </div>

          <h2 className="mt-3 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[40px]">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-3 max-w-[620px] text-[15px] leading-relaxed text-[#685c4f]">
            Find answers to commonly asked questions about our Vedic Yagya, Puja, Japa, and Kashi services.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-10 space-y-3.5">
          {YAGYA_PUJA_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#ebdcc4] bg-white shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[#faf5eb]"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-[16.5px] font-semibold text-[#2b241d] sm:text-[18px]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#c77722] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-[#f2e6d5] bg-[#fffdfa] px-5 pb-5 pt-3.5 animate-in fade-in duration-200">
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

export default YagyaPujaFaq;
