import { ShieldCheck, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * SECTION 1: TOP TRUST BAR
 * Very thin, compact premium strip highlighting Kashi authenticity and booking access.
 */
const UmbrellaTrustBar = () => {
  return (
    <aside aria-label="Authenticity Announcement" className="relative z-20 border-b border-[#ebdcc4] bg-[#fbf5e8] py-2 px-4 sm:px-8 text-[11px] sm:text-[12px] text-[#5c4e3f]">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Left Trust Statement */}
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} className="text-[#b36c1e] shrink-0" />
          <p className="font-medium tracking-wide">
            Authentic Vedic Rituals <span className="text-[#c77722]/50 mx-1">•</span> Performed in Kashi <span className="text-[#c77722]/50 mx-1">•</span> Experienced Vedic Acharyas <span className="text-[#c77722]/50 mx-1">•</span> Online &amp; Offline Booking
          </p>
        </div>

        {/* Right Help & Fast Action CTA */}
        <div className="flex items-center gap-4 text-[11px] sm:text-[11.5px]">
          <span className="hidden sm:inline text-[#827464]">
            Helpline: 9 AM – 8 PM IST
          </span>
          <span className="hidden sm:inline text-[#c77722]/30">•</span>
          <Link
            to="/yagya-puja/puja"
            className="inline-flex items-center gap-1 font-bold text-[#b36c1e] transition-colors hover:text-[#8e4f0d]"
          >
            <span>Book a Puja</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default UmbrellaTrustBar;
