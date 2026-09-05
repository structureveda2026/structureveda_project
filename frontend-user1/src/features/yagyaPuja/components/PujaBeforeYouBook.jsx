import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PujaBeforeYouBook = () => {
  const topics = [
    "What is this Puja?",
    "Purpose",
    "Traditional significance",
    "Who can perform it?",
    "When is it performed?",
    "Duration",
    "Vidhi",
    "Mantra",
    "Pandit requirement",
    "Samagri",
    "Sankalpa",
    "Available dates",
    "Location",
    "Prasad",
    "Price",
    "FAQs",
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Editorial Frame */}
        <div className="rounded-[28px] border border-[#ebdcc4] bg-[#fffdfa] p-8 shadow-xs sm:p-10 lg:p-12">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
              COMPLETE CLARITY & PREPARATION
            </p>
            <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              Before You Book, Know Your Puja
            </h2>
            <p className="mx-auto mt-3 max-w-[700px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
              We believe a sacred ritual should be understood before it is booked. Each individual Puja detail page provides
              comprehensive context regarding every facet of your ritual:
            </p>
          </div>

          {/* Grid of 16 Information Items */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
            {topics.map((topic) => (
              <div
                key={topic}
                className="flex items-center gap-2.5 rounded-xl border border-[#ebdcc4]/80 bg-[#fffaf0] p-3.5 text-[13px] font-semibold text-[#2b241d] shadow-2xs"
              >
                <CheckCircle2 size={16} className="shrink-0 text-[#c77722]" />
                <span>{topic}</span>
              </div>
            ))}
          </div>

          {/* CTA Footer */}
          <div className="mt-10 text-center">
            <Link
              to="/yagya-puja/puja/rudrabhishek-puja"
              className="inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.3)] transition hover:bg-[#dda018]"
            >
              <span>View Puja Details</span>
              <ArrowRight size={15} />
            </Link>
            <p className="mt-2.5 text-[12.5px] text-[#786b5c]">
              Explore an example service detail page with complete shastric information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PujaBeforeYouBook;
