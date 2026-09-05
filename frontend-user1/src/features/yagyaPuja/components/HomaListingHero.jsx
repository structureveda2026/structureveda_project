import { Flame, Sparkles, ArrowRight, ShieldCheck, Compass, Users } from "lucide-react";
import yagyaHeroImg from "../../../assets/images/yagya_hero.png";
import samagriImg from "../../../assets/images/p-samagri.jpg";

const HomaListingHero = ({ onExploreClick, onConsultClick }) => {
  return (
    <section className="relative overflow-hidden border-b border-[#e8d7be] bg-gradient-to-b from-[#fcf7ee] via-[#faf4e6] to-[#f6eedc] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      {/* Warm ambient light glow */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[460px] w-[460px] rounded-full bg-[#f3c88e]/35 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/3 h-[420px] w-[420px] rounded-full bg-[#f6d7a4]/30 blur-[90px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Hero Copy & Actions */}
          <div className="text-left lg:col-span-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8b584] bg-[#fbf3e4] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8e5a1e] shadow-xs">
              <Flame size={13} className="text-[#c77722]" />
              <span>VEDIC HOMA • HAVAN • AGNI • AHUTI</span>
            </div>

            {/* H1 Heading */}
            <h1 className="mt-5 font-serif text-[36px] font-semibold leading-[1.16] tracking-tight text-[#2b241d] sm:text-[48px] lg:text-[54px]">
              Vedic Homa & Havan
            </h1>

            {/* Subtitle */}
            <p className="mt-4 font-serif text-[18px] font-medium leading-relaxed text-[#7a4e1e] sm:text-[21px]">
              Traditional fire rituals performed with Sankalpa, prescribed Mantra, Ahuti and ritual discipline.
            </p>

            {/* Supporting Content */}
            <p className="mt-3.5 max-w-[620px] text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
              Choose a traditional Homa, configure your available Havan count and duration, and let Veda Structure coordinate initiated Pandits, sacred Samagri, and ritual arrangements.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#b56e20] to-[#cb832c] px-7 py-3.5 text-[14.5px] font-semibold text-[#fffcf5] shadow-[0_8px_20px_rgba(181,110,32,0.28)] transition duration-300 hover:brightness-105 hover:shadow-[0_12px_26px_rgba(181,110,32,0.36)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b56e20] cursor-pointer"
              >
                <span>Explore Homa & Havan</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={onConsultClick}
                className="inline-flex items-center gap-2 rounded-full border border-[#c4a179] bg-[#fffaf1] px-6 py-3.5 text-[14px] font-semibold text-[#4e3c28] shadow-xs transition duration-300 hover:border-[#a0631c] hover:bg-white hover:text-[#2b241d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a0631c] cursor-pointer"
              >
                <span>Which Homa Is Right for Me?</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[#e6d3ba] pt-6 text-[12.5px] text-[#78644e]">
              <div className="flex items-center gap-2 font-medium">
                <Flame size={16} className="text-[#a8641b]" />
                <span>Consecrated Sacred Fire (Agni)</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Users size={16} className="text-[#a8641b]" />
                <span>Initiated Vedic Scholars</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Compass size={16} className="text-[#a8641b]" />
                <span>Kashi & Remote Coordination</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visuals (Agni / Havan Kund / Acharya) */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto flex max-w-[380px] flex-col items-center sm:max-w-[420px] lg:max-w-none">
              {/* Soft Golden Halo Behind Havan Kund Artwork */}
              <div className="pointer-events-none absolute inset-0 -m-8 rounded-full bg-gradient-to-tr from-[#d4872b]/25 via-[#f5ce6f]/20 to-transparent blur-3xl" />

              {/* Sacred Acharya & Havan Kund Artwork */}
              <div className="relative z-10 w-full overflow-hidden rounded-[28px] border border-[#d6b78d] bg-gradient-to-b from-[#241910] via-[#1e130a] to-[#160d06] p-6 shadow-[0_20px_50px_rgba(60,35,15,0.22)]">
                <div className="relative flex items-center justify-center">
                  <img
                    src={yagyaHeroImg}
                    alt="Vedic Acharya performing Ahuti into the sacred Agni Havan Kund"
                    className="max-h-[380px] w-auto object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.5)] transition duration-700 hover:scale-[1.02]"
                  />
                </div>

                {/* Floating Bottom Info Inset */}
                <div className="mt-4 rounded-[18px] border border-white/15 bg-[#2a1b10]/90 p-3.5 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <img
                      src={samagriImg}
                      alt="Sacred Havan Samagri"
                      className="h-11 w-11 rounded-xl border border-[#c4a179]/40 object-cover"
                    />
                    <div>
                      <span className="block text-[10.5px] font-bold uppercase tracking-widest text-[#f0cb79]">
                        SACRED AGNI AHUTI
                      </span>
                      <p className="font-serif text-[14.5px] font-medium text-[#fcf5e9]">
                        Pure Ghrita, Samidha & Herbal Samagri
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Badge */}
              <div className="absolute -bottom-4 -left-4 hidden rounded-[20px] border border-[#d2b184] bg-[#fffaf0] p-4 shadow-[0_12px_30px_rgba(80,50,20,0.12)] sm:block">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#8a571c]">
                  CONFIGURABLE HAVAN
                </span>
                <p className="mt-0.5 font-serif text-[17px] font-bold text-[#2b241d]">
                  1 • 3 • 5 • 7 • 11 Havan
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

export default HomaListingHero;
