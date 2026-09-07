import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";

/**
 * SECTION 13: FAQ
 * 8 Umbrella-level questions and answers covering booking, Sankalp, Kashi participation, and ritual differences.
 */
const UmbrellaFaq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Can I book a Puja from outside India?",
      answer:
        "Yes. Devotees living in the USA, UK, Canada, Australia, UAE, and worldwide frequently book rituals through Veda Structure. You can specify your family gotra and intentions online, receive personal video recordings of your specific Gotra Sankalp, and have energized holy prasad dispatched to your international address where postal regulations permit.",
    },
    {
      question: "Can I perform a Puja in Kashi?",
      answer:
        "Yes. We facilitate rituals directly on sacred Ganga ghats and consecrated Varanasi kshetras. You can either attend in-person with our designated local Acharya team, or participate remotely through personalized live Sankalp coordination.",
    },
    {
      question: "What rituals are available?",
      answer:
        "Our ecosystem provides six core ritual streams: daily and special Pujas, multi-day ceremonial Yagyas, disciplined Japa chanting anushthans, complete scriptural Path recitations, purifying Homa/Havan fire ceremonies, and specialized Kashi Kshetra rituals.",
    },
    {
      question: "Can my family members participate?",
      answer:
        "Yes. During the booking and Sankalp coordination phase, you can provide the full names, gotras, and nakshatras of up to several family members so that the merit and protective blessings of the ceremony are explicitly invoked for all of them.",
    },
    {
      question: "How does Sankalp work?",
      answer:
        "A Sankalp is the solemn Vedic vow defining the devotee's spiritual intention, ancestral gotra, geographical location, and date according to the Hindu Panchang. The presiding Acharya invokes this sacred dedication before commencing the ritual, establishing your direct spiritual connection to the ceremony.",
    },
    {
      question: "How does the booking process work?",
      answer:
        "You select your required ritual, choose your preferred timing and attendance mode (in-person or remote), enter your gotra and prayer intention details, and review the transparent service deliverables. Our team then assigns qualified Vedic scholars and arranges all pure Shastric samagri.",
    },
    {
      question: "What is the difference between Puja and Yagya?",
      answer:
        "A Puja is typically a deity-centered worship involving abhishekam, archana, and offerings (usually 2 to 5 hours). A Yagya is an extensive sacred fire ceremony (Havan) involving specialized Kundas, multiple priests chanting Vedic Samhitas, and thousands of herbal ahutis, often structured over several hours or multiple consecutive days.",
    },
    {
      question: "Can I choose a specific ritual based on my purpose?",
      answer:
        "Yes. Our platform organizes rituals by life intentions — including marriage and relationship harmony, wealth and business prosperity, home purification, planetary balance (Graha Shanti), protection, education, and spiritual practice.",
    },
  ];

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1000px]">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
              FREQUENTLY ASKED QUESTIONS
            </span>
          </div>

          <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Common Inquiries About <span className="text-[#c77722]">Vedic Ceremonies</span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-[650px] font-sans text-[14.5px] leading-relaxed text-[#5c4e3f]">
            Understand how our rituals are organized, how your family Sankalp is taken, and what deliverables you receive.
          </p>

          <div aria-hidden="true" className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/60">
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
            <span className="text-[12px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
          </div>
        </div>

        {/* Accordion List */}
        <div className="mt-12 space-y-3.5 sm:mt-14">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-[18px] border border-[#ead8b8] bg-[#fffcf7] transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left cursor-pointer sm:p-5.5"
                >
                  <span className="font-serif text-[16.5px] sm:text-[17.5px] font-bold text-[#2b241d]">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ead8b8] bg-[#fbf5e8] text-[#b36c1e] transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#eab12c] text-[#1c1308] border-[#eab12c]" : ""
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[#f0e2cd] px-5 pb-5 pt-3.5 sm:px-5.5 sm:pb-5.5 text-[13.5px] sm:text-[14px] leading-relaxed text-[#65584a]">
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

export default UmbrellaFaq;
