import {
  Sparkles,
  ScrollText,
  BookOpen,
  Flame,
  Sun,
  ShieldCheck,
} from "lucide-react";
import defaultPujaImage from "../../../assets/images/puja_about.png";

const INSIGHT_ICONS = [ScrollText, Sparkles, BookOpen, Flame, Sun, ShieldCheck];

const PujaSignificance = ({ puja }) => {
  if (!puja || !puja.significance || puja.significance.length === 0) {
    return null;
  }

  // Pick a distinct secondary image from the puja gallery if available, fallback to main or default
  const significanceImage =
    (Array.isArray(puja.images) && puja.images.length > 1 ? puja.images[1] : null) ||
    puja.image ||
    defaultPujaImage;

  return (
    <section
      id="spiritual-significance"
      className="border-b border-[#ead8b8] bg-[#fffdfa] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          
          {/* =========================================================
              LEFT COLUMN: SCRIPTURAL WISDOM & INSIGHT ITEMS
              Desktop -> Left (7 cols)
              Mobile  -> Top
          ========================================================== */}
          <div className="lg:col-span-7">
            
            {/* Eyebrow */}
            <div className="mb-3.5 flex items-center gap-2">
              <Sparkles
                size={14}
                strokeWidth={1.8}
                className="text-[#c77722]"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#b36c1e] sm:text-[11px]">
                Scriptural Wisdom
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="font-serif text-[32px] font-medium leading-[1.12] text-[#2b241d] sm:text-[38px] lg:text-[44px] xl:text-[48px]">
              Spiritual Significance
            </h2>

            {/* Decorative Gold Accent Bar */}
            <div className="mt-4 flex items-center gap-2">
              <span className="h-[2px] w-12 rounded-full bg-[#d4872b]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
            </div>

            {/* Introductory Narrative */}
            <p className="mt-6 max-w-[760px] text-[15px] leading-[1.8] text-[#5e5143] sm:text-[16px]">
              Rooted in timeless Vedic revelations, performing this sacred ritual aligns the devotee&apos;s karmic vibrations with celestial harmony and divine consciousness.
            </p>

            {/* Dynamic Scriptural Insights */}
            <div className="mt-8 space-y-3.5">
              {puja.significance.map((item, idx) => {
                const IconComponent = INSIGHT_ICONS[idx % INSIGHT_ICONS.length];

                return (
                  <div
                    key={idx}
                    className="group relative flex items-start gap-4 rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4872b]/70 hover:bg-[#fff7ea] hover:shadow-[0_8px_24px_rgba(139,91,36,0.06)]"
                  >
                    {/* Subtle decorative hover glow */}
                    <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#eab12c]/[0.06] blur-xl transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Icon Container */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e8c995] bg-[#fffdfa] text-[#c77722] shadow-2xs transition-transform duration-300 group-hover:scale-105">
                      <IconComponent size={17} strokeWidth={1.8} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] leading-relaxed text-[#4a3d31] sm:text-[14.5px]">
                        {item}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* =========================================================
              RIGHT COLUMN: SACRED SPIRITUAL MEDIA FRAME
              Desktop -> Right (5 cols)
              Mobile  -> Below Content
          ========================================================== */}
          <div className="lg:col-span-5">
            <div className="group relative">
              
              {/* Outer Decorative Gold Frame */}
              <div className="relative rounded-[28px] border-2 border-[#e6caa0] bg-[#fffdfa] p-2 shadow-[0_18px_55px_rgba(80,60,30,0.08)] transition-all duration-500 group-hover:border-[#d9b47b] group-hover:shadow-[0_22px_65px_rgba(139,91,36,0.12)] sm:p-2.5">
                
                {/* Image Aspect Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[21px] bg-[#241a12] sm:aspect-[5/4] lg:aspect-[4/3]">
                  <img
                    src={significanceImage}
                    alt={`Spiritual significance of ${puja.name}`}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    loading="lazy"
                  />

                  {/* Bottom Gradient Scrim */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b120a]/70 via-[#1b120a]/15 to-transparent" />

                  {/* Top Ambient Glow */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />

                  {/* Floating Caption / Badge */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-2 text-[11px] font-medium text-[#f5e8d2] shadow-lg backdrop-blur-md sm:text-[12px]">
                      <Sparkles
                        size={13}
                        strokeWidth={1.8}
                        className="shrink-0 text-[#eab12c]"
                      />
                      <span className="truncate">
                        {puja.deity ? `${puja.deity} Aradhana` : "Sacred Vedic Ritual"} • {puja.location || "Kashi"}
                      </span>
                    </div>
                  </div>

                  {/* Small Top Right Decorative Accent */}
                  <div className="pointer-events-none absolute right-4 top-4 h-8 w-8 rounded-full border border-[#f1c86c]/40 bg-black/25 backdrop-blur-xs" />
                </div>
              </div>

              {/* Soft Ambient Glows */}
              <div className="pointer-events-none absolute -bottom-5 -right-5 -z-10 h-28 w-28 rounded-full bg-[#eab12c]/10 blur-3xl" />
              <div className="pointer-events-none absolute -left-5 -top-5 -z-10 h-24 w-24 rounded-full bg-[#d4872b]/10 blur-3xl" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PujaSignificance;
