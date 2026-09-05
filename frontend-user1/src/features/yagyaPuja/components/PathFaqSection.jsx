import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const PathFaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What is Path / Recitation?",
      a: "In the Vedic tradition, Path involves the systematic reading or chanting of a selected sacred scripture, Granth, Stotra, or Purana chapter according to classical Sanskrit Swara, meter, and ritual procedure, initiated with a sacred Sankalpa.",
    },
    {
      q: "Can a Path be performed over multiple days?",
      a: "Yes. Depending on the scripture's length, recitations can be arranged in a single session (such as Sundarkand), same-day extended sessions, or multi-day anushthans (such as 3-day Saptashati or 9-day Ramcharitmanas Navah Parayan).",
    },
    {
      q: "Can I choose a specific scripture?",
      a: "Yes. You can choose from our curated catalogue of traditional scriptures or submit a Custom Path Request for rare Puranas, Stotras, or Vedic Samhita sections.",
    },
    {
      q: "Can I choose the number of Pandits?",
      a: "Recommended scholar team sizes are configured based on text length and target completion days. For custom requests, you may request specific squad sizes (e.g. 2, 3–5, or 7+ Pandits) for Acharya evaluation.",
    },
    {
      q: "Can I book a Path from outside India?",
      a: "Yes. Devotees worldwide can arrange remote recitation services. Your personal Sankalpa (Name, Gotra, Family members) is formally consecrated in Kashi, and daily progress or completion updates are shared.",
    },
    {
      q: "Can I perform Path in Kashi?",
      a: "Yes. Selected Path services can be arranged directly in the holy city of Kashi (Varanasi), either for visiting devotees attending in person or arranged remotely on their behalf.",
    },
    {
      q: "Can my family members be included?",
      a: "Yes. Where supported by the service configuration, names, Gotras, and Nakshatras of family members can be included in the opening Sankalpa prayers.",
    },
    {
      q: "Is Samagri included?",
      a: "Essential recitation items (sacred Granth, pure ghee lamp, roli, chandan, akshat, and archana flowers) are included. Specific optional Prasad arrangements are detailed prior to booking.",
    },
    {
      q: "Can I request a custom Path?",
      a: "Yes. If your required scripture, Granth, or specific chapter count is not in our standard catalogue, you can submit a Custom Path Request for review and tailored quotation.",
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
            Essential guidelines regarding scripture formats, Pandit allocations, scheduling, and Kashi ritual coordination.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-12 space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const faqId = `path-faq-ans-${index}`;
            const btnId = `path-faq-btn-${index}`;

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

export default PathFaqSection;
