import { useState } from "react";
import { ChevronDown } from "lucide-react";

const PujaFAQ = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[860px]">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="mt-3 font-serif text-[32px] font-semibold leading-tight text-[#2b241d] sm:text-[42px]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-[15px] text-[#685c4f]">
            Everything you need to know about the ritual procedure, Sankalp, and blessings.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`overflow-hidden rounded-[22px] border-2 transition-all duration-300 ${
                  isOpen
                    ? "border-[#d4872b] bg-white shadow-[0_10px_30px_rgba(212,135,43,0.1)]"
                    : "border-[#ead8b8] bg-white/90 hover:border-[#d4872b]/70 hover:bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left sm:p-6"
                >
                  <span className="font-serif text-[18px] font-bold text-[#2b241d] sm:text-[19px]">
                    {faq.question}
                  </span>
                  <div
                    className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-[#eab12c] text-[#1c1308] rotate-180"
                        : "bg-[#f8edd8] text-[#b36c1e]"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[#f0e2cd] px-5 pb-6 pt-4 text-[14.5px] leading-relaxed text-[#685c4f] sm:px-6 animate-in fade-in duration-200">
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

export default PujaFAQ;
