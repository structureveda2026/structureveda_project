import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  UserPlus,
  BookOpen,
  Users,
  Landmark,
  Flower2,
} from "lucide-react";
import vedicHeroBg from "../../../assets/images/vedic-community-hero-bg.jpg";

const CommunityHero = ({ onExploreDirectory }) => {
  return (
    <section className="relative overflow-hidden bg-[#fffcf7] border-b border-[#ebdcc2]">
      {/* Background Photographic Layer with Responsive Vedic Composition */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img
          src={vedicHeroBg}
          alt="Sacred Varanasi Ghats and Vedic Pandit Meditation at Sunrise"
          className="w-full h-full object-cover object-[78%_center] sm:object-[center_right] lg:object-right"
          loading="eager"
        />

        {/* Luminous Ivory-to-Transparent Editorial Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fffcf7] via-[#fffcf7]/95 via-[55%] md:via-[52%] lg:via-[48%] to-transparent" />

        {/* Mobile Contrast Guard */}
        <div className="sm:hidden absolute inset-0 bg-[#fffcf7]/70" />

        {/* Subtle Warm Sun radiance in center */}
        <div
          className="absolute bottom-0 right-1/3 w-[360px] h-[220px] bg-[#d4af37]/10 blur-3xl rounded-full"
          aria-hidden="true"
        />
      </div>

      {/* Main Container Aligned to Application Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14 min-h-[380px] lg:min-h-[420px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full">
          {/* Left Column: Heading, Value Proposition, Actions & Stats */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4 sm:space-y-5 text-left">
            {/* Small Eyebrow Label */}
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#9b4e10]">
              <Sparkles className="w-3.5 h-3.5 text-[#b35d14]" />
              <span>VEDA STRUCTURE COMMUNITY</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold text-[#23180f] tracking-tight leading-[1.14]">
              A Sacred Space for
              <br />
              Vedic Wisdom &amp;{" "}
              <span className="text-[#b35d14]">Connection</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-[15px] lg:text-[15.5px] text-[#5c4736] leading-relaxed max-w-xl font-sans">
              Join Pandits, Acharyas, Astrologers and sincere seekers from around the world. Share knowledge, ask questions, explore rituals, and stay connected with the living tradition of Sanatana Dharma.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-3.5">
              <Link
                to="/community/create-profile"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#9b4e10] hover:bg-[#853f09] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#9b4e10]/25 transition-all transform active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b35d14]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Your Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {onExploreDirectory && (
                <button
                  type="button"
                  onClick={onExploreDirectory}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#fff9f0] text-[#3d2b1d] border border-[#b35d14] text-xs sm:text-sm font-bold shadow-2xs transition-all transform active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b35d14]"
                >
                  <BookOpen className="w-4 h-4 text-[#9b4e10]" />
                  <span>Explore Expert Directory</span>
                </button>
              )}
            </div>

            {/* Community Statistics Bar */}
            <div className="pt-4 sm:pt-5 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-[#ebdcc2]/80">
              {/* Stat 1: Practitioners */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#faeed8] flex items-center justify-center text-[#9b4e10] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-[#23180f] leading-none">
                    100+
                  </p>
                  <p className="text-[11px] text-[#78614e] mt-1 whitespace-nowrap">
                    Verified Practitioners
                  </p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-[#ebdcc2]" />

              {/* Stat 2: Sacred Cities */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#faeed8] flex items-center justify-center text-[#9b4e10] shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-[#23180f] leading-none">
                    9+
                  </p>
                  <p className="text-[11px] text-[#78614e] mt-1 whitespace-nowrap">
                    Sacred Cities
                  </p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-[#ebdcc2]" />

              {/* Stat 3: Authentic Guidance */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#faeed8] flex items-center justify-center text-[#9b4e10] shrink-0">
                  <Flower2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-[#23180f] leading-none">
                    Authentic
                  </p>
                  <p className="text-[11px] text-[#78614e] mt-1 whitespace-nowrap">
                    Shastra-based Guidance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Spiritual Quote Card Over Background Scene */}
          {/* <div className="lg:col-span-5 xl:col-span-5 flex justify-end items-center relative">
            <div className="hidden lg:block w-full max-w-[290px] xl:max-w-[310px] bg-[#2b180d]/80 backdrop-blur-md border border-[#c49a56]/40 rounded-2xl p-5 shadow-2xl text-white mr-2 xl:mr-8 transition-all hover:border-[#c49a56]/70">
              <Quote className="w-5 h-5 text-[#e5a855] rotate-180 mb-2.5 fill-[#e5a855]/20" />
              <p className="font-serif italic text-xs sm:text-[13px] text-[#fff6e9] leading-relaxed">
                &ldquo;Together, let us preserve, practise and share the timeless wisdom of the Vedas.&rdquo;
              </p>
              <div className="pt-3 mt-3 border-t border-[#c49a56]/30 text-center">
                <p className="text-[10.5px] text-[#e0a962] font-semibold tracking-wider uppercase">
                  &mdash; Veda Structure Community &mdash;
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default CommunityHero;
