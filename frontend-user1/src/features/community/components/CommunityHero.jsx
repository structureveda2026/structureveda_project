import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Award,
  CheckCircle2,
  Flame,
  Star,
  MapPin,
  Clock,
  BookOpen,
  Edit3,
  Eye,
} from "lucide-react";
import templeBg from "../../../assets/images/sacred-vedic-temple-hero-bg.jpg";
import { getUserCustomProfile } from "../data/communityMockData";

const CommunityHero = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-[#1f1309] text-white">
      {/* Background Temple Image with Deep Warm Spiritual Overlay */}
      <div className="absolute inset-0">
        <img
          src={templeBg}
          alt="Sacred Vedic Temple Background"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform duration-1000 opacity-40 mix-blend-luminosity"
        />
        {/* Multi-layered gradient for optimal readability & atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#170e06]/98 via-[#251509]/92 to-[#3a200d]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f07] via-transparent to-[#140b04]/70" />

        {/* Decorative gold radiance / glow spots */}
        <div
          className="pointer-events-none absolute -top-24 left-1/4 w-[500px] h-[350px] bg-[#d4af37]/15 blur-3xl rounded-full"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 right-10 w-[450px] h-[350px] bg-[#e67e22]/15 blur-3xl rounded-full"
          aria-hidden="true"
        />
      </div>

      {/* Main Hero Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, Value Proposition & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#3d240d]/90 via-[#4e2f11]/90 to-[#3d240d]/90 border border-[#d4af37]/40 shadow-md backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#f6ad55]" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#fbd38d]">
                VEDA STRUCTURE COMMUNITY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f6ad55]" />
              <span className="text-[11px] font-medium text-[#fcebd0]">
                Vedic Scholar Directory
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#fffdfa] tracking-tight leading-[1.18] drop-shadow-sm">
              Connect with{" "}
              <span className="font-serif italic bg-gradient-to-r from-[#ffd89b] via-[#f7b733] to-[#e67e22] bg-clip-text text-transparent">
                Vedic Experts
              </span>{" "}
              & Sanatana Acharyas
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base md:text-lg text-[#ecd8c3] leading-relaxed max-w-2xl font-sans">
              A dedicated sanctuary where revered Pandits and Astrologers showcase their lineage, gurukul training, and authentic vidhis—and seekers discover trusted spiritual professionals across sacred pilgrimage cities worldwide.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-md sm:max-w-none">
              {getUserCustomProfile() ? (
                <>
                  <Link
                    to={`/community/edit-profile?slug=${getUserCustomProfile().slug}`}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#b35d14] via-[#c9711c] to-[#e08424] hover:from-[#9e4e0e] hover:via-[#b35d14] hover:to-[#c9711c] text-white font-semibold text-sm md:text-base shadow-lg shadow-[#b35d14]/30 hover:shadow-xl hover:shadow-[#b35d14]/40 transition-all transform active:scale-[0.98] border border-[#f5b061]/30"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit My Profile</span>
                  </Link>

                  <Link
                    to={`/community/profile/${getUserCustomProfile().slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#fff7ed] hover:text-white font-medium text-sm md:text-base border border-[#e2c18d]/30 hover:border-[#e2c18d]/60 backdrop-blur-md shadow-xs transition-all"
                  >
                    <Eye className="w-4 h-4 text-[#fbd38d]" />
                    <span>View My Profile</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/community/create-profile"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#b35d14] via-[#c9711c] to-[#e08424] hover:from-[#9e4e0e] hover:via-[#b35d14] hover:to-[#c9711c] text-white font-semibold text-sm md:text-base shadow-lg shadow-[#b35d14]/30 hover:shadow-xl hover:shadow-[#b35d14]/40 transition-all transform active:scale-[0.98] border border-[#f5b061]/30"
                >
                  <span>Create Your Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#fff7ed] hover:text-white font-medium text-sm md:text-base border border-[#e2c18d]/30 hover:border-[#e2c18d]/60 backdrop-blur-md shadow-xs transition-all"
              >
                <Compass className="w-4 h-4 text-[#fbd38d]" />
                <span>Explore Community</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#d1b9a2]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">100+ Acharyas</span>
                <span>Active in Directory</span>
              </div>
              <span className="hidden sm:inline text-stone-600">•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#e67e22]" />
                <span>Varanasi, Haridwar, Ujjain, Ayodhya</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composition with Overlapping Showcase Cards */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Background Warm Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#c9711c]/20 to-[#ffd89b]/10 rounded-3xl blur-2xl -z-10" />

            <div className="relative space-y-4 max-w-md mx-auto lg:max-w-none">
              {/* Primary Showcase Card: Pandit Rameshwar Shastri */}
              <div className="bg-gradient-to-br from-[#2a1a0f]/95 via-[#22150c]/95 to-[#1a1009]/95 border border-[#d4af37]/40 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                      alt="Acharya Rameshwar Shastri"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-[#d4af37]/60 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-600 rounded-full shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#543011] text-[#fbd38d] border border-[#a66a2b]/50">
                        Pandit / Acharya
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-white truncate">
                      Acharya Rameshwar Shastri
                    </h4>
                    <p className="text-xs text-[#cfb79f] truncate">
                      Shukla Yajurveda Parayan Acharya
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-[#e8d5c2]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#f6ad55]" />
                        24+ Yrs Exp.
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-[#f6ad55]" />
                        Varanasi (Kashi)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-[#4a2e16] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#fbd38d]">
                    <Star className="w-3.5 h-3.5 fill-[#fbd38d] text-[#fbd38d]" />
                    <span className="font-bold">4.96</span>
                    <span className="text-[#a89078] text-[11px]">(340+ Pujas)</span>
                  </div>
                  <span className="text-[11px] text-[#f6ad55] font-medium flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Maha Rudrabhishek Vidhi
                  </span>
                </div>
              </div>

              {/* Secondary Floating Overlapping Card: Dr. Sunita Joshi (Astrologer) */}
              <div className="bg-gradient-to-br from-[#24170d]/95 to-[#1c120a]/95 border border-[#d4af37]/30 rounded-2xl p-4 shadow-xl backdrop-blur-md -mt-2 ml-4 sm:ml-8 transform hover:-translate-y-1 transition duration-300">
                <div className="flex items-center gap-3.5">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                    alt="Dr. Sunita Joshi"
                    className="w-12 h-12 rounded-xl object-cover border border-[#c2964a]/50"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#422247] text-[#e9b8f5] border border-[#83468f]/50">
                        Vedic Astrologer
                      </span>
                      <span className="text-[10px] text-[#e0b57e] font-semibold">
                        Ph.D. Jyotish
                      </span>
                    </div>
                    <h5 className="font-serif text-sm font-bold text-white truncate mt-0.5">
                      Dr. Sunita Joshi
                    </h5>
                    <p className="text-[11px] text-[#c7af99] truncate">
                      KP Astrology & Prashna Shastra • 19+ Yrs Exp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Trust Floating Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1b1007]/90 border border-[#d4af37]/40 text-[11px] text-[#fcebd0] shadow-lg backdrop-blur-md">
                <BookOpen className="w-3.5 h-3.5 text-[#f6ad55]" />
                <span className="font-semibold text-white">Parampara Integrity:</span>
                <span>Authentic Shastra Injunctions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Highlights Strip Beneath Hero */}
      <div className="relative bg-[#170e06] border-t border-[#422914] py-6 sm:py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-lg bg-[#b35d14]/20 border border-[#b35d14]/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#f6ad55]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">Verified Lineage</p>
                <p className="text-[11px] text-[#b89f89]">Gurukul & Parampara</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-lg bg-[#b35d14]/20 border border-[#b35d14]/40 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#f6ad55]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">Rigorous Standards</p>
                <p className="text-[11px] text-[#b89f89]">Shastric Credentials</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-lg bg-[#b35d14]/20 border border-[#b35d14]/40 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-[#f6ad55]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">Direct Discovery</p>
                <p className="text-[11px] text-[#b89f89]">Transparent Profiles</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-lg bg-[#b35d14]/20 border border-[#b35d14]/40 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-[#f6ad55]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">100% Authentic</p>
                <p className="text-[11px] text-[#b89f89]">Strict Shastra Vidhis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHero;
