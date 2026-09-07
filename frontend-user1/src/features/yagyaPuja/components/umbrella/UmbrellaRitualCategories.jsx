import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import pujaRudrabhishekImg from "../../../../assets/images/puja-rudrabhishek.jpg";
import pujaMrityunjayaImg from "../../../../assets/images/puja-mrityunjaya.jpg";
import pSamagriImg from "../../../../assets/images/p-samagri.jpg";
import cMantraImg from "../../../../assets/images/c-mantra.jpg";

/**
 * SECTION 4: CHOOSE THE RITUAL THAT MATCHES YOUR PURPOSE
 * Four primary discovery cards (Puja, Yagya, Homa/Havan, and Japa/Path dual action).
 */
const UmbrellaRitualCategories = () => {
  return (
    <section id="ritual-categories" className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
              SACRED RITUAL STREAMS
            </span>
          </div>

          <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Choose the Ritual That <span className="text-[#c77722]">Matches Your Purpose</span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-[700px] font-sans text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
            Explore our foundational Vedic offerings, structured to guide you from personal devotion and planetary harmony to grand multi-day community celebrations.
          </p>

          <div aria-hidden="true" className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/60">
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
            <span className="text-[12px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
          </div>
        </div>

        {/* 4 Primary Discovery Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:mt-14">

          {/* CARD 1: PUJA */}
          <div className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-5 shadow-[0_2px_12px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]">
            <div>
              <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
                <img
                  src={pujaRudrabhishekImg}
                  alt="Daily and special Vedic Pujas"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-[#180f08]/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f5ce6f] border border-[#eab12c]/40 backdrop-blur-xs">
                  Individual &amp; Family
                </span>
              </div>

              <div className="mt-4.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                  PUJA
                </span>
                <h3 className="mt-1 font-serif text-[20px] font-bold leading-snug text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                  Daily &amp; Special Puja
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#65584a]">
                  Authentic deity worship conducted with Shukla Yajurveda vidhi, personalized Gotra Sankalp, and pure samagri.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f0e2cc]">
              <Link
                to="/yagya-puja/puja"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#b36c1e] transition-colors hover:text-[#8e4f0d]"
              >
                <span>Explore Puja</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* CARD 2: YAGYA */}
          <div className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-5 shadow-[0_2px_12px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]">
            <div>
              <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
                <img
                  src={pujaMrityunjayaImg}
                  alt="Multi-day ceremonial Vedic Yagya"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-[#180f08]/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f5ce6f] border border-[#eab12c]/40 backdrop-blur-xs">
                  Vedic Anushthan
                </span>
              </div>

              <div className="mt-4.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                  YAGYA
                </span>
                <h3 className="mt-1 font-serif text-[20px] font-bold leading-snug text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                  Multi-day Vedic Yagya
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#65584a]">
                  Consecrated sacred fire ceremonies officiated by qualified Vedic Acharyas for collective peace and cosmic alignment.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f0e2cc]">
              <Link
                to="/yagya-puja/yagya"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#b36c1e] transition-colors hover:text-[#8e4f0d]"
              >
                <span>Explore Yagya</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* CARD 3: HOMA / HAVAN */}
          <div className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-5 shadow-[0_2px_12px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]">
            <div>
              <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
                <img
                  src={pSamagriImg}
                  alt="Purifying fire offerings and samagri"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-[#180f08]/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f5ce6f] border border-[#eab12c]/40 backdrop-blur-xs">
                  Fire Offerings
                </span>
              </div>

              <div className="mt-4.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                  HOMA / HAVAN
                </span>
                <h3 className="mt-1 font-serif text-[20px] font-bold leading-snug text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                  Fire Rituals &amp; Offerings
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#65584a]">
                  Purifying sacred fire ahutis with pure cow ghee and traditional herbs to cleanse domestic spaces and energies.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f0e2cc]">
              <Link
                to="/yagya-puja/homa"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#b36c1e] transition-colors hover:text-[#8e4f0d]"
              >
                <span>Explore Homa</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* CARD 4: JAPA / PATH (Dual Connected Action) */}
          <div className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-5 shadow-[0_2px_12px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]">
            <div>
              <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
                <img
                  src={cMantraImg}
                  alt="Disciplined mantra japa and holy scripture path"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-[#180f08]/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f5ce6f] border border-[#eab12c]/40 backdrop-blur-xs">
                  Mantra &amp; Recitation
                </span>
              </div>

              <div className="mt-4.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                  JAPA / PATH
                </span>
                <h3 className="mt-1 font-serif text-[20px] font-bold leading-snug text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                  Mantra &amp; Vedic Recitation
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#65584a]">
                  Structured acoustic mantra commitments and complete scriptural recitations conducted by dedicated scholars.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f0e2cc] flex items-center justify-between gap-2">
              <Link
                to="/yagya-puja/japa"
                className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#b36c1e] transition-colors hover:text-[#8e4f0d]"
              >
                <span>Explore Japa</span>
                <ArrowRight size={13} />
              </Link>
              <span className="text-[#ebdcc4]">•</span>
              <Link
                to="/yagya-puja/path"
                className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#b36c1e] transition-colors hover:text-[#8e4f0d]"
              >
                <span>Explore Path</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default UmbrellaRitualCategories;
