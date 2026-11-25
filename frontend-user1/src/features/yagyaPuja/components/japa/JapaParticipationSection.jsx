import { MapPin, Video, CheckCircle2, Sparkles, Building, Globe } from "lucide-react";
import kashiImg from "../../../../assets/images/puja-kashi.jpg";
import remoteImg from "../../../../assets/images/c-meditation.jpg";

/**
 * Section 05: Sacred Venue & Participation Modes
 * Side-by-side comparison of Kashi Kshetra vs Remote Sankalpa modes.
 * Respects verified service capabilities.
 */
const JapaParticipationSection = () => {
  return (
    <section className="border-b border-[#ead8bc] bg-[#fffcf6] py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-[700px] mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8bc] bg-[#fbf6ed] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8a561c]">
            <MapPin size={12} className="text-[#b77920]" />
            <span>Sacred Participation</span>
          </div>
          <h2 className="mt-3 font-serif text-[28px] sm:text-[34px] font-bold text-[#30251c]">
            Venue & Participation Arrangements
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[#6b5845]">
            Experience sacred Mantra Japa according to your geographic preference—performed directly
            at consecrated shrines in Kashi or arranged remotely with your personalized Gotra Sankalpa.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Option 1: Kashi Kshetra */}
          <div className="flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#ead8bc] bg-[#fffdfa] shadow-xs transition-all duration-300 hover:border-[#b77920] hover:shadow-[0_12px_28px_rgba(183,121,32,0.12)]">
            <div>
              {/* Image Header */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f5ecd9]">
                <img
                  src={kashiImg}
                  alt="Kashi Varanasi Sacred Shrines"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#241a12]/80 via-[#241a12]/20 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e150d]/85 px-3 py-1 text-[11.5px] font-bold text-[#fce8c8] backdrop-blur-xs">
                    <Building size={12} className="text-[#b77920]" />
                    <span>Kashi Kshetra (Varanasi)</span>
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7">
                <h3 className="font-serif text-[21px] font-bold text-[#30251c]">
                  In-Person or Sanctum Chanting in Kashi
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#5c4d3c]">
                  Arranged at sacred temple shrines and sanctums along the Ganga kshetra in Varanasi by initiated Purohits with rigorous Chandas discipline.
                </p>

                <ul className="mt-5 space-y-3 text-[13px] text-[#6b5845]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#b77920] shrink-0 mt-0.5" />
                    <span>Conducted by verified Varanasi Gurukul Acharyas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#b77920] shrink-0 mt-0.5" />
                    <span>Sacred sthan mahima with classical Vedic mandap resonance.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#b77920] shrink-0 mt-0.5" />
                    <span>Option to attend in-person or have priests recite on your behalf.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#b77920] shrink-0 mt-0.5" />
                    <span>Energized sanctum prasad and consecrated items dispatched to home.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#f0e3ce] bg-[#fbf6ed] p-4 text-center">
              <span className="text-[12px] font-semibold text-[#8a561c]">
                Ideal for major life milestones, Purascharana, and deep planetary peace.
              </span>
            </div>
          </div>

          {/* Option 2: Remote Sankalpa */}
          <div className="flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#ead8bc] bg-[#fffdfa] shadow-xs transition-all duration-300 hover:border-[#b77920] hover:shadow-[0_12px_28px_rgba(183,121,32,0.12)]">
            <div>
              {/* Image Header */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f5ecd9]">
                <img
                  src={remoteImg}
                  alt="Remote Sankalpa Japa"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#241a12]/80 via-[#241a12]/20 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e150d]/85 px-3 py-1 text-[11.5px] font-bold text-[#fce8c8] backdrop-blur-xs">
                    <Globe size={12} className="text-[#b77920]" />
                    <span>Remote Sankalpa (Worldwide)</span>
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7">
                <h3 className="font-serif text-[21px] font-bold text-[#30251c]">
                  Personal Gotra Sankalpa Recited Remotely
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#5c4d3c]">
                  Sacred recitation performed by designated Vedic priests on your behalf, with your Gotra, Nakshatra, and intention recited daily.
                </p>

                <ul className="mt-5 space-y-3 text-[13px] text-[#6b5845]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#b77920] shrink-0 mt-0.5" />
                    <span>Personalized Sankalpa with Yajman, family Gotra, and Nakshatra.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#b77920] shrink-0 mt-0.5" />
                    <span>Regular daily chanting progress reports and commencement notice.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#b77920] shrink-0 mt-0.5" />
                    <span>No travel required; receive complete spiritual fruit from anywhere.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#b77920] shrink-0 mt-0.5" />
                    <span>Consecrated Japa Mala, Raksha Sutra, and dry Prasad parcel delivery.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#f0e3ce] bg-[#fbf6ed] p-4 text-center">
              <span className="text-[12px] font-semibold text-[#8a561c]">
                Ideal for devotees worldwide seeking authentic daily Anushthan benefits.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JapaParticipationSection;
