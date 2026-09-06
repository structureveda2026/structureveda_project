import {
  ShieldCheck,
  Heart,
  Coins,
  TrendingUp,
  Sparkles,
  Home,
  Compass,
  ArrowRight,
} from "lucide-react";
import { PUJA_PURPOSE_CATEGORIES } from "../data/pujaCatalogueData";
import pujaSacredDetailsImg from "../../../assets/images/puja/puja-sacred-details.webp.png";

// ── Purpose thumbnail imports (fallbacks until dedicated assets are added) ───
import healthImg       from "../../../assets/images/puja/puja-sankalpa.webp.png";
import marriageImg     from "../../../assets/images/puja/puja-family.webp.png";
import prosperityImg   from "../../../assets/images/puja/puja-prasad.webp.png";
import careerImg       from "../../../assets/images/puja/puja-ritual-setup.webp.png";
import protectionImg   from "../../../assets/images/puja/puja-devotional-altar.webp.png";
import familyImg       from "../../../assets/images/puja/puja-family.webp.png";

// ── PURPOSE_IMAGE_MAP ────────────────────────────────────────────────────────
// Keys match PUJA_PURPOSE_CATEGORIES[n].categoryName exactly.
// Replace individual imports above with dedicated puja-purpose-*.webp assets
// when they are placed in src/assets/images/puja/.
const PURPOSE_IMAGE_MAP = {
  "Health & Wellbeing":        { src: healthImg,      alt: "Sacred Vedic offering for health and wellbeing rituals" },
  "Marriage & Relationships":  { src: marriageImg,    alt: "Family gathering in devotional Puja for marriage and relationships" },
  "Prosperity & Wealth":       { src: prosperityImg,  alt: "Consecrated offerings for prosperity and abundance Pujas" },
  "Career & Success":          { src: careerImg,      alt: "Ritual setup for Vedic Puja performed for career and success" },
  "Protection & Peace":        { src: protectionImg,  alt: "Sacred altar arrangement for protection and peace Pujas" },
  "Family & Home":             { src: familyImg,      alt: "Family devotional gathering during Vedic Puja for home and harmony" },
};

const ICON_MAP = {
  ShieldCheck: ShieldCheck,
  Heart: Heart,
  Coins: Coins,
  TrendingUp: TrendingUp,
  Sparkles: Sparkles,
  Home: Home,
  Compass: Compass,
};

const PujaPurposeDiscovery = ({ selectedPurpose, onSelectPurpose }) => {
  const handlePurposeClick = (categoryName) => {
    if (onSelectPurpose) {
      onSelectPurpose(categoryName);
    }
    const el = document.getElementById("puja-catalogue");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">

        {/* ── Section Header (approved — unchanged) ── */}
        <div className="mb-12 text-center lg:mb-14">
          <div className="inline-flex items-center gap-2 border-b border-[#c77722]/40 pb-1.5">
            <Sparkles size={11} className="text-[#c77722]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              Purpose &amp; Intention
            </span>
          </div>

          <h2 className="mt-5 font-serif leading-[1.15]">
            <span className="block text-[26px] font-semibold text-[#2b241d] sm:text-[32px] lg:text-[38px]">
              Find a Puja According to Your
            </span>
            <span className="block text-[34px] font-bold text-[#c77722] sm:text-[42px] lg:text-[46px]">
              Purpose
              <span
                aria-hidden="true"
                className="mx-auto mt-1 block h-[2px] w-12 rounded-full bg-[#c77722]/50 sm:w-16"
              />
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-[600px] text-[14.5px] leading-[1.75] text-[#5c4e3f] sm:text-[15.5px]">
            Choose an intention that matters to you and discover Pujas arranged
            around that purpose.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/70"
          >
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
            <span className="text-[13px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
          </div>
        </div>

        {/* ── 3-Column Purpose Grid ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {PUJA_PURPOSE_CATEGORIES.map((category, idx) => {
            const Icon = ICON_MAP[category.iconName] || Sparkles;
            const isSelected = selectedPurpose === category.categoryName;
            const num = String(idx + 1).padStart(2, "0");
            const thumb = PURPOSE_IMAGE_MAP[category.categoryName] ?? {
              src: pujaSacredDetailsImg,
              alt: category.categoryName,
            };

            return (
              <button
                type="button"
                key={category.id}
                onClick={() => handlePurposeClick(category.categoryName)}
                aria-pressed={isSelected}
                aria-label={`Select purpose: ${category.categoryName}`}
                className={`group flex h-full w-full cursor-pointer flex-col rounded-[16px] border p-5 text-left shadow-[0_3px_14px_rgba(60,40,15,0.06)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722] sm:p-6 ${
                  isSelected
                    ? "border-[#c77722] bg-[#fff9ed] shadow-[0_6px_22px_rgba(199,119,34,0.14)]"
                    : "border-[#e8d9bc] bg-[#fffdfa] hover:border-[#c77722] hover:bg-[#fdf8ee] hover:shadow-[0_6px_20px_rgba(199,119,34,0.10)]"
                }`}
              >
                {/* ── Card Top: Number · Image · Arrow ── */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Number */}
                    <span
                      className={`mt-0.5 shrink-0 font-sans text-[12px] font-bold tabular-nums transition-colors duration-250 ${
                        isSelected
                          ? "text-[#c77722]"
                          : "text-[#c5b59f] group-hover:text-[#c77722]"
                      }`}
                    >
                      {num}
                    </span>

                    {/* Thumbnail */}
                    <div
                      className={`shrink-0 overflow-hidden rounded-lg border transition-all duration-300 ${
                        isSelected
                          ? "border-[#c77722]/60 shadow-[0_2px_8px_rgba(199,119,34,0.18)]"
                          : "border-[#e0ceaf] group-hover:border-[#c77722]/40 group-hover:shadow-[0_2px_6px_rgba(199,119,34,0.10)]"
                      }`}
                      style={{ width: "80px", height: "60px", flexShrink: 0 }}
                    >
                      <img
                        src={thumb.src}
                        alt={thumb.alt}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Arrow — top right */}
                  <ArrowRight
                    size={15}
                    className={`mt-1 shrink-0 transition-all duration-250 ${
                      isSelected
                        ? "translate-x-0.5 text-[#c77722]"
                        : "text-[#d2baa0] group-hover:translate-x-1 group-hover:text-[#c77722]"
                    }`}
                  />
                </div>

                {/* ── Card Body: Title + Description ── */}
                <div className="mt-4 flex flex-1 flex-col">
                  {/* Title row */}
                  <div className="flex items-center gap-1.5">
                    <Icon
                      size={13}
                      className={`shrink-0 transition-colors duration-250 ${
                        isSelected ? "text-[#c77722]" : "text-[#c5b59f] group-hover:text-[#c77722]"
                      }`}
                    />
                    <h3
                      className={`font-serif text-[17px] font-bold leading-snug transition-colors duration-250 sm:text-[18px] ${
                        isSelected
                          ? "text-[#c77722]"
                          : "text-[#2b241d] group-hover:text-[#b36c1e]"
                      }`}
                    >
                      {category.categoryName}
                    </h3>
                    {isSelected && (
                      <span className="ml-auto shrink-0 rounded-full bg-[#f8edd8] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#b36c1e]">
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-2.5 flex-1 text-[13px] leading-[1.65] text-[#685c4f]">
                    {category.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Clear selection utility ── */}
        {selectedPurpose && selectedPurpose !== "All Purposes" && (
          <div className="mt-7 text-center">
            <button
              type="button"
              onClick={() => handlePurposeClick("All Purposes")}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#c77722] hover:underline cursor-pointer"
            >
              <span>← Show all purposes</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PujaPurposeDiscovery;
