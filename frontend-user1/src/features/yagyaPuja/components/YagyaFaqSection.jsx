import { useState } from "react";
import { ChevronDown } from "lucide-react";

const YagyaFaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is the difference between Puja and Yagya?",
      answer:
        "A Puja is a focused ritual involving prayers, stotram recitations, and direct deity archana, often completed in 1 to 3 hours. A Yagya is a multi-day ceremonial Vedic fire sacrifice centered around consecrated Agni, disciplined mantra commitments (anushthan), continuous ahutis (herbal offerings), and a dedicated team of Vedic Purohits working systematically across multiple days.",
    },
    {
      question: "How many days is a Yagya?",
      answer:
        "Duration depends upon the prescribed Shastric requirements of the specific Yagya. Standard Vedic Yagyas are arranged for 3, 5, 7, 9, or 11 days according to the target mantra count and seeker Sankalpa.",
    },
    {
      question: "How many hours per day?",
      answer:
        "A typical multi-day Yagya entails approximately 5 hours of dedicated ritual per day, including morning altar consecration, continuous mantra japa, havan ahutis, and evening mangal aarti.",
    },
    {
      question: "How many Pandits are required?",
      answer:
        "The number of Pandits depends on the selected Yagya, duration, and configured ritual requirements. For instance, a 3-day anushthan typically requires 3 to 5 Acharyas, while a 7 or 11-day Mahayagya requires 7 to 11 trained Vedic scholars.",
    },
    {
      question: "Can I choose the start date?",
      answer:
        "Yes. You can select your preferred auspicious start date during the configuration step, subject to priest team scheduling and astrological tithi coordination.",
    },
    {
      question: "Can I perform Yagya in Kashi?",
      answer:
        "Yes. Veda Structure coordinates selected Yagya ceremonies directly in Kashi (Varanasi) on sacred Ganga ghats and consecrated Yagya Shalas, whether you are attending in person or dedicating through remote Gotra Sankalpa.",
    },
    {
      question: "Can I book from outside India?",
      answer:
        "Yes. Devotees worldwide can arrange multi-day Yagyas remotely. Our priests invoke your exact Name, Gotra, Nakshatra, and family members during the daily Sankalpa, accompanied by video updates and dispatched energized prasad.",
    },
    {
      question: "Is Samagri included?",
      answer:
        "Applicable ceremonial wood (samidha), pure cow ghee, herbs, lotus seeds, and grains required for the prescribed Yagya are fully coordinated by Veda Structure. Exact inclusions are reviewed transparently prior to confirmation.",
    },
    {
      question: "Can my family participate?",
      answer:
        "Yes. Family members can be included in the formal Sankalpa. In-person ceremonies welcome family attendance, while remote arrangements invoke family members' names during the daily ritual dedications.",
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
            Clear, honest answers regarding multi-day Yagya ceremonies, scheduling, duration, and Pandit requirements.
          </p>
        </div>

        {/* Accordion List */}
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

export default YagyaFaqSection;
