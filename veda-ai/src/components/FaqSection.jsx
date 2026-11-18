import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../data/prompts';
import SectionHeading from './SectionHeading';

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-16 sm:py-20">
      <SectionHeading title="Frequently Asked Questions" />
      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-gold/15 bg-white/5 backdrop-blur-sm overflow-hidden transition-colors hover:border-gold/30"
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-serif text-base sm:text-lg text-white">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm text-mutedtext leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
