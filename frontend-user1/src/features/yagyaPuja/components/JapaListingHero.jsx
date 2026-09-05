import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Compass } from "lucide-react";
import malaImg from "../../../assets/images/p-mala.jpg";
import mantraImg from "../../../assets/images/c-mantra.jpg";
import { Link } from "react-router-dom";

const JapaListingHero = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden border-b border-[#e8d7be] bg-gradient-to-b from-[#fcf7ee] via-[#faf4e6] to-[#f6eedc] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      {/* Decorative background subtle glow */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#ecd5b2]/40 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-[#f3deb8]/30 blur-[90px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Hero Text Content */}
          <div className="text-left lg:col-span-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8b584] bg-[#fbf3e4] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8e5a1e] shadow-xs">
              <Sparkles size={13} className="text-[#c77722]" />
              <span>VEDIC JAPA • MANTRA • SANKALPA</span>
            </div>

            {/* H1 Heading */}
            <h1 className="mt-5 font-serif text-[34px] font-semibold leading-[1.16] tracking-tight text-[#2b241d] sm:text-[46px] lg:text-[52px]">
              Mantra Japa, Performed With Sankalpa
            </h1>

            {/* Subtitle */}
            <p className="mt-4 font-serif text-[18px] font-medium leading-relaxed text-[#7a4e1e] sm:text-[21px]">
              Structured Vedic Mantra Japa performed according to prescribed counts, Sankalpa and ritual requirements.
            </p>

            {/* Supporting Text */}
            <p className="mt-3.5 max-w-[620px] text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
              Choose your Mantra Japa, select the prescribed Japa count and let Veda Structure coordinate the chanting, Pandit team, schedule and applicable ritual arrangements.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#b56e20] to-[#cb832c] px-7 py-3.5 text-[14.5px] font-semibold text-[#fffcf5] shadow-[0_8px_20px_rgba(181,110,32,0.28)] transition duration-300 hover:brightness-105 hover:shadow-[0_12px_26px_rgba(181,110,32,0.36)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b56e20] cursor-pointer"
              >
                <span>Explore Japa</span>
                <ArrowRight size={16} />
              </button>

              <Link
                to="/book-consultation"
                className="inline-flex items-center gap-2 rounded-full border border-[#c4a179] bg-[#fffaf1] px-6 py-3.5 text-[14px] font-semibold text-[#4e3c28] shadow-xs transition duration-300 hover:border-[#a0631c] hover:bg-white hover:text-[#2b241d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a0631c]"
              >
                <span>Talk to a Vedic Expert</span>
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[#e6d3ba] pt-6 text-[12.5px] text-[#78644e]">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck size={16} className="text-[#a8641b]" />
                <span>Prescribed Count Verification</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <HeartHandshake size={16} className="text-[#a8641b]" />
                <span>Dedicated Pandit Team</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Compass size={16} className="text-[#a8641b]" />
                <span>Kashi & Remote Coordination</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visuals (Jap Mala & Mantra Manuscript) */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-[420px] lg:max-w-none">
              {/* Primary Manuscript/Mala Image Card */}
              <div className="relative overflow-hidden rounded-[26px] border border-[#d6b78d] bg-[#22170f] shadow-[0_18px_45px_rgba(60,40,20,0.18)]">
                <img
                  src={malaImg}
                  alt="Vedic Jap Mala for disciplined Mantra chanting"
                  className="h-[340px] w-full object-cover opacity-90 transition duration-700 hover:scale-105 sm:h-[400px]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b110a]/90 via-[#1b110a]/35 to-transparent" />

                {/* Floating Mantra Manuscript Inset */}
                <div className="absolute bottom-5 left-5 right-5 rounded-[18px] border border-white/15 bg-[#1f150d]/85 p-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <img
                      src={mantraImg}
                      alt="Vedic Mantra manuscript"
                      className="h-12 w-12 rounded-xl object-cover border border-[#c4a179]/40"
                    />
                    <div>
                      <span className="block text-[10.5px] font-bold uppercase tracking-widest text-[#f0cb79]">
                        TRADITIONAL PRACTICE
                      </span>
                      <p className="font-serif text-[15px] font-medium text-[#fcf5e9]">
                        Disciplined Recitation with Sankalpa
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Counter Badge */}
              <div className="absolute -bottom-4 -left-4 hidden rounded-[20px] border border-[#d2b184] bg-[#fffaf0] p-4 shadow-[0_12px_30px_rgba(80,50,20,0.12)] sm:block">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#8a571c]">
                  STANDARD BENCHMARKS
                </span>
                <p className="mt-0.5 font-serif text-[18px] font-bold text-[#2b241d]">
                  11K • 21K • 51K • 125K
                </p>
                <span className="text-[11px] text-[#7a6a57]">Per Service Availability</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JapaListingHero;
