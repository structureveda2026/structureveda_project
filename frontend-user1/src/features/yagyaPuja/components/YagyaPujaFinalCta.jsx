import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const YagyaPujaFinalCta = () => {
  const handleScrollToCategories = () => {
    const el = document.getElementById("service-categories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-[#ebdcc4] bg-gradient-to-b from-[#fbf4e8] via-[#f8edd8] to-[#f4e4c7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-[#eab12c]/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[320px] w-[320px] rounded-full bg-[#d4872b]/15 blur-[100px]" />

      <div className="relative mx-auto max-w-[960px] text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffaf0]/95 px-3.5 py-1 shadow-2xs backdrop-blur-xs">
          <Sparkles size={13} className="text-[#c77722]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            Start Your Sankalpa
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-4 font-serif text-[34px] font-semibold text-[#2b241d] sm:text-[44px]">
          Begin Your Ritual Journey
        </h2>

        {/* Supporting Text */}
        <p className="mx-auto mt-3 max-w-[620px] text-[15px] leading-relaxed text-[#5e5143] sm:text-[16px]">
          Explore our Puja, Yagya, Japa, Path, Homa and Kashi services. Receive personalized sankalpas, traditional vidhi, and energized holy prasadam.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={handleScrollToCategories}
            className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_6px_22px_rgba(234,177,44,0.35)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_8px_28px_rgba(234,177,44,0.45)] sm:w-auto"
          >
            <span>Explore Our Rituals</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <Link
            to="/yagya-puja/kashi"
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-white px-7 py-3 text-[14px] font-semibold text-[#2b241d] shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:bg-[#fffaf0] hover:text-[#c77722] sm:w-auto"
          >
            <span>Explore Puja in Kashi</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default YagyaPujaFinalCta;
