import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  ScrollText,
  HeartHandshake,
  Truck,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  Users,
  MapPin,
  Camera,
  Sun,
  BookOpen,
  Phone,
  Landmark,
} from "lucide-react";
import {
  SPECIAL_PUJA_CATEGORIES,
  SHODASHA_SAMSKARS,
  BIRTHDAY_PUJA_SERVICES,
  PINDA_DAAN_LOCATIONS,
  TIRTH_SHRADH_CEREMONIES,
  WHY_CHOOSE_SPECIAL_PUJA,
  SPECIAL_PUJA_STEPS,
  SPECIAL_PUJA_FAQS,
  SPECIAL_PUJA_IMAGES,
} from "../data/specialPujaData";

export default function SpecialPujaLanding() {
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState("all");

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const phases = [
    { id: "all", label: "All 16 Samskars" },
    { id: "Pre-natal", label: "Pre-natal (3)" },
    { id: "Infancy", label: "Infancy (4)" },
    { id: "Childhood", label: "Childhood (3)" },
    { id: "Student Life", label: "Student Life (4)" },
    { id: "Householder", label: "Householder (1)" },
    { id: "Final Transition", label: "Final Transition (1)" },
  ];

  const filteredSamskars =
    selectedPhase === "all"
      ? SHODASHA_SAMSKARS
      : SHODASHA_SAMSKARS.filter((s) => s.phase === selectedPhase);

  const handleScrollToCategories = () => {
    const el = document.getElementById("special-puja-categories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#2b241d] selection:bg-[#eab12c]/30">
      {/* ========================================================
          SECTION A: HERO SECTION
          Atmospheric full-bleed visual composition with balanced editorial wash
      ========================================================= */}
      <section className="relative flex min-h-[620px] items-center overflow-hidden border-b border-[#ebdcc4] px-5 py-14 sm:min-h-[660px] sm:px-8 sm:py-18 lg:min-h-[720px] lg:px-12 lg:py-24">
        {/* Layer 1: Traditional Vedic Puja Ceremony Backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center sm:bg-[center_right_20%] lg:bg-[center_right_10%]"
          style={{ backgroundImage: `url(${SPECIAL_PUJA_IMAGES.hero})` }}
        />

        {/* Layer 2: Editorial Readability Gradient Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fffaf0]/96 via-[#fffaf0]/90 via-[42%] via-[#fffaf0]/40 via-[64%] to-transparent to-[84%] max-lg:bg-gradient-to-b max-lg:from-[#fffaf0]/98 max-lg:via-[#fffaf0]/90 max-lg:to-[#fffaf0]/45"
        />

        {/* Layer 3: Warm Golden Atmospheric Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/4 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#eab12c]/10 blur-[140px]"
        />

        {/* Main Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1360px]">
          <div className="max-w-[640px] lg:max-w-[680px]">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 text-[#b36c1e]">
              <span className="text-[12px] text-[#c77722]">✦</span>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-[#8e4f0d]">
                SPECIAL VEDIC CEREMONIES
              </span>
              <span aria-hidden="true" className="h-px w-12 bg-[#c77722]/35 sm:w-16" />
            </div>

            {/* Main Headline */}
            <h1 className="mt-3.5 font-serif text-[34px] font-bold leading-[1.12] tracking-[-0.02em] text-[#2b241d] sm:text-[44px] lg:text-[50px] xl:text-[54px]">
              Celebrate Every Sacred Milestone with <span className="text-[#b36c1e]">Authentic Vedic Rituals</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 font-serif text-[16px] font-medium leading-relaxed text-[#45372a] sm:text-[17.5px]">
              From the 16 Shodasha Samskars of human life to annual Janamdin Pujas, sacred Pinda Daan, and Tirth Shradh — performed with strict Shastric Vidhi by experienced Vedic Acharyas.
            </p>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <button
                type="button"
                onClick={handleScrollToCategories}
                className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_18px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_24px_rgba(234,177,44,0.4)] active:scale-[0.98]"
              >
                <span>Explore Special Pujas</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <Link
                to="/contact"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#dcc5a7] bg-[#fffaf0]/85 px-6 py-3.5 text-[13.5px] font-semibold text-[#2b241d] shadow-2xs transition-all duration-300 hover:border-[#b36c1e] hover:bg-[#fffdfa] hover:text-[#b36c1e]"
              >
                <Phone size={14} className="text-[#b36c1e]" />
                <span>Consult an Acharya</span>
              </Link>
            </div>

            {/* Trust Line */}
            <div className="mt-7 flex flex-wrap items-center gap-y-2 gap-x-4 text-[12px] font-medium text-[#5c4e3f] sm:text-[12.5px]">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#b36c1e] shrink-0" />
                <span>Sacred Kashi &amp; Holy Tirthas</span>
              </div>
              <span aria-hidden="true" className="hidden text-[#d5c3aa] sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#b36c1e] shrink-0" />
                <span>Family Gotra Sankalp</span>
              </div>
              <span aria-hidden="true" className="hidden text-[#d5c3aa] sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#b36c1e] shrink-0" />
                <span>100% Shastric Authenticity</span>
              </div>
              <span aria-hidden="true" className="hidden text-[#d5c3aa] sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Camera size={14} className="text-[#b36c1e] shrink-0" />
                <span>Video Updates &amp; Blessed Prasad</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION B: SPECIAL PUJA CATEGORIES
          Visual image-based cards matching existing Veda Structure layout
      ========================================================= */}
      <section
        id="special-puja-categories"
        className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1360px]">
          {/* Section Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
              <Sparkles size={12} className="text-[#c77722]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                SACRED RITUAL CATEGORIES
              </span>
            </div>

            <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              Choose Your <span className="text-[#c77722]">Sacred Ceremony</span>
            </h2>

            <p className="mx-auto mt-3.5 max-w-[720px] font-sans text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
              Explore our four dedicated ceremony streams, designed to consecrate important life transitions, celebrate birthdays by Vedic Tithi, and fulfill ancestral duties at sacred Tirthas.
            </p>

            <div aria-hidden="true" className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/60">
              <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
              <span className="text-[12px]">✦</span>
              <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
            </div>
          </div>

          {/* 4 Image-Based Discovery Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:mt-14">
            {SPECIAL_PUJA_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-5 shadow-[0_2px_12px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]"
              >
                <div>
                  {/* Category Image Header */}
                  <div className="relative h-48 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-[#180f08]/85 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f5ce6f] border border-[#eab12c]/40 backdrop-blur-xs">
                      {cat.categoryBadge}
                    </span>
                    <span className="absolute top-3 right-3 rounded-full bg-[#fffaf0]/90 px-2.5 py-0.5 text-[10.5px] font-bold text-[#b36c1e] shadow-xs">
                      {cat.count}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="mt-4.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                      {cat.hindiName}
                    </span>
                    <h3 className="mt-1 font-serif text-[20px] font-bold leading-snug text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#65584a] line-clamp-2">
                      {cat.description}
                    </p>

                    {/* Single focused highlight */}
                    <div className="mt-4 pt-3 border-t border-[#f0e2cc]">
                      <div className="flex items-center gap-2 text-[12px] font-medium text-[#554637]">
                        <CheckCircle2 size={13} className="text-[#b36c1e] shrink-0" />
                        <span className="truncate">{cat.highlight || cat.highlights[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-6 pt-4 border-t border-[#f0e2cc]">
                  <Link
                    to={cat.path}
                    className="inline-flex w-full items-center justify-between rounded-full bg-[#fbf5ea] px-4 py-2.5 text-[13px] font-bold text-[#b36c1e] transition-all duration-200 group-hover:bg-[#eab12c] group-hover:text-[#1c1308]"
                  >
                    <span>Explore {cat.name}</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION C: SHODASHA SAMSKAR (16 SACRED RITES)
          Timeline & interactive life-stage filters with visual ritual cards
      ========================================================= */}
      <section
        id="samskars"
        className="relative border-b border-[#ebdcc4] bg-[#fbf5ea]/60 px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1360px]">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
              <BookOpen size={13} className="text-[#c77722]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                LIFE-CYCLE PURIFICATION
              </span>
            </div>

            <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              16 Sacred Samskars: <span className="text-[#c77722]">A Journey Through Every Stage of Life</span>
            </h2>

            <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
              In Vedic wisdom, each Samskara is an authentic rite of passage that cleanses karmic sheaths, awakens inner intellect, and consecrates life transitions from conception to final liberation.
            </p>
          </div>

          {/* Interactive Life-Stage Filter Tabs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {phases.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPhase(p.id)}
                className={`rounded-full px-4 py-2 text-[12.5px] sm:text-[13px] font-semibold transition-all cursor-pointer ${
                  selectedPhase === p.id
                    ? "bg-[#b36c1e] text-white shadow-xs"
                    : "border border-[#ead8b8] bg-[#fffcf7] text-[#5c4e3f] hover:border-[#c77722] hover:bg-[#fffdfa] hover:text-[#b36c1e]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* 16 Samskars Grid: Responsive & Image-Rich */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredSamskars.map((s) => (
              <Link
                key={s.id}
                to={`/yagya-puja/special-puja/samskar/${s.slug}`}
                className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-4 shadow-[0_2px_10px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)] cursor-pointer"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-40 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Top Sequence Pill */}
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-[#180f08]/85 px-2.5 py-0.5 font-serif text-[12px] font-bold text-[#f5ce6f] border border-[#eab12c]/40 backdrop-blur-xs">
                      #{s.number}
                    </span>

                    {/* Phase Badge */}
                    <span className="absolute bottom-2.5 right-2.5 rounded-full bg-[#fffaf0]/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#75695c] shadow-xs">
                      {s.phase}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-3.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-[18px] font-bold text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                        {s.name}
                      </h3>
                      <span className="text-[12px] font-semibold text-[#b36c1e]">
                        {s.sanskritName}
                      </span>
                    </div>

                    <p className="mt-1 text-[11.5px] italic text-[#8c7456] line-clamp-1">
                      "{s.tagline}"
                    </p>

                    <p className="mt-2 text-[12.5px] leading-relaxed text-[#65584a] line-clamp-2">
                      {s.shortDesc}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#7d6f60] pt-2.5 border-t border-[#f0e2cc]">
                      <span className="flex items-center gap-1 truncate">
                        <Clock size={11} className="text-[#b36c1e] shrink-0" />
                        <span className="truncate">{s.duration}</span>
                      </span>
                      <span className="font-medium text-[#b36c1e]">
                        {s.priestsRequired}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-[#f0e2cc]">
                  <div className="inline-flex w-full items-center justify-between text-[12px] font-bold text-[#b36c1e] group-hover:text-[#8e4f0d]">
                    <span>View Ceremony Details</span>
                    <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Explore All Samskars CTA */}
          <div className="mt-12 text-center">
            <Link
              to="/yagya-puja/special-puja/samskar"
              className="inline-flex items-center gap-2 rounded-full border border-[#b36c1e] bg-[#fffaf0] px-7 py-3 text-[13.5px] font-bold text-[#b36c1e] transition-all hover:bg-[#b36c1e] hover:text-white"
            >
              <span>Explore All 16 Samskars in Full Detail</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION D: BIRTHDAY PUJA
          Dedicated visual section with havan imagery and Vedic Tithi explanation
      ========================================================= */}
      <section className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1360px]">
          {/* Top Banner Row */}
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Visual Column */}
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-[24px] border-2 border-[#e6cca0] bg-[#241a12] shadow-xl">
                <img
                  src={SPECIAL_PUJA_IMAGES.birthdayCategory}
                  alt="Vedic Birthday Havan and Ayushya Homa"
                  className="h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[420px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-[#1c130b]/85 border border-[#eab12c]/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md">
                    Annual Ayushya Homa
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#f5ce6f]">
                    SACRED BIRTHDAY BLESSINGS
                  </span>
                  <h3 className="mt-1 font-serif text-[22px] font-bold text-white">
                    Celebrate by Vedic Janma Tithi
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#f4e8d1]/90">
                    Invoking the blessings of Sage Markandeya and Navagrahas for longevity, vitality, and physical stamina.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-4 lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
                <Sun size={13} className="text-[#c77722]" />
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                  ANNUAL VEDIC JANMADIN
                </span>
              </div>

              <h2 className="font-serif text-[28px] font-bold leading-tight text-[#2b241d] sm:text-[34px] lg:text-[38px]">
                Vedic Birthday Puja &amp; <span className="text-[#c77722]">Ayushya Homa</span>
              </h2>

              <p className="text-[14.5px] leading-relaxed text-[#5c4e3f]">
                Unlike modern birthdays, Vedic tradition marks your birth anniversary by the exact cosmic relationship between the Sun and Moon (Tithi) and stellar constellation (Nakshatra). Performing consecrated Agni Ahutis on this day revitalizes bodily vitality and dissolves longevity afflictions.
              </p>

              {/* Tithi Explanation Callout */}
              <div className="rounded-2xl border border-[#ead8b8] bg-[#fbf5ea] p-4.5">
                <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#b36c1e]">
                  <Sparkles size={14} />
                  <span>The Power of Vedic Tithi Calculation</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#554637]">
                  Your Janma Tithi is the energetic mirror of your birth moment. When our Acharyas conduct Ayushya Homa on this lunar tithi, planetary energies align to grant deep peace, long life (Dirghayu), and protection from ailments.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to="/yagya-puja/special-puja/birthday-puja"
                  className="inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-7 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_18px_rgba(234,177,44,0.3)] hover:bg-[#dda018] transition-colors"
                >
                  <span>Explore Birthday Puja Services</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* 4 Birthday Services Cards Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BIRTHDAY_PUJA_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-5 shadow-[0_2px_10px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#180f08]/85 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f5ce6f] border border-[#eab12c]/40 backdrop-blur-xs">
                      {srv.timing}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-serif text-[17px] font-bold leading-snug text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                      {srv.name}
                    </h3>
                    <p className="text-[11.5px] font-semibold text-[#b36c1e] mt-0.5">
                      {srv.hindiName}
                    </p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-[#65584a] line-clamp-2">
                      {srv.summary}
                    </p>

                    <div className="mt-3.5 space-y-1.5 pt-3 border-t border-[#f0e2cc]">
                      {srv.keyBenefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11.5px] text-[#554637]">
                          <CheckCircle2 size={12} className="text-[#b36c1e] shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#f0e2cc]">
                  <Link
                    to={srv.bookingPath}
                    state={{
                      specialPujaContext: {
                        name: srv.name,
                        hindiName: srv.hindiName,
                        category: "Vedic Birthday Puja",
                        slug: srv.backendSlug || srv.slug,
                      },
                    }}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#eab12c] py-2.5 text-[12.5px] font-bold text-[#1c1308] shadow-[0_2px_10px_rgba(234,177,44,0.2)] transition-all duration-200 hover:bg-[#dda018] hover:shadow-[0_4px_14px_rgba(234,177,44,0.3)]"
                  >
                    <span>Book Ceremony</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION E: PINDA DAAN
          Sacred ancestral liberation at holy river ghats
      ========================================================= */}
      <section className="relative border-b border-[#ebdcc4] bg-[#fbf5ea]/60 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1360px]">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
              <Landmark size={13} className="text-[#c77722]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                ANCESTRAL DEBT LIBERATION
              </span>
            </div>

            <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              Sacred Pinda Daan at <span className="text-[#c77722]">Holy Tirthas</span>
            </h2>

            <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
              Fulfilling Pitru Rin (ancestral debt) is revered in Sanatana Dharma as a sacred duty. Bestow peace upon departed parents and ancestors with authentic Vedic Pinda Visarjan.
            </p>
          </div>

          {/* 5 Holy Tirthas Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {PINDA_DAAN_LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-4 shadow-[0_2px_10px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]"
              >
                <div>
                  <div className="relative h-36 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-[#180f08]/85 px-2 py-0.5 text-[9.5px] font-bold uppercase text-[#f5ce6f] border border-[#eab12c]/30">
                      <MapPin size={10} />
                      <span>{loc.state}</span>
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-serif text-[16.5px] font-bold text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                      {loc.name}
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-[#65584a] line-clamp-3">
                      {loc.significance}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f0e2cc] flex items-center justify-between gap-2">
                  <p className="text-[10.5px] font-medium text-[#7d6f60] italic truncate">
                    Best: {loc.idealTime}
                  </p>
                  <Link
                    to={loc.bookingPath || "/yagya-puja/puja/kashi-ganga-pujan/book"}
                    state={{
                      specialPujaContext: {
                        name: `Pinda Daan (${loc.name})`,
                        hindiName: "पिण्ड दान एवं पितृ तर्पण",
                        targetLocation: `${loc.name}, ${loc.state} (${loc.holySites.join(", ")})`,
                        category: "Pinda Daan",
                        slug: "kashi-ganga-pujan",
                      },
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[#fbf5ea] px-3 py-1 text-[11px] font-bold text-[#b36c1e] hover:bg-[#eab12c] hover:text-[#1c1308] transition-colors shrink-0"
                  >
                    <span>Arrange</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* 4-Step Vidhi Banner */}
          <div className="mt-10 overflow-hidden rounded-[24px] border border-[#ead8b8] bg-[#fffcf7] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebdcc4] pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                  SHODASHA VIDHI
                </span>
                <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                  Four Essential Steps of Vedic Pinda Daan
                </h3>
              </div>
              <Link
                to="/yagya-puja/special-puja/pinda-daan"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#eab12c] px-5 py-2.5 text-[12.5px] font-bold text-[#1c1308] hover:bg-[#dda018] transition-colors shrink-0"
              >
                <span>Explore Pinda Daan</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-[#ebdcc4]/80 bg-[#fbf5ea]/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">STEP 01</span>
                <h4 className="font-serif text-[14.5px] font-bold text-[#2b241d] mt-1">Gotra &amp; Lineage Sankalp</h4>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#65584a]">
                  Chanting of 3 generations of paternal and maternal ancestors with sacred Kusha grass and holy Gangajal.
                </p>
              </div>
              <div className="rounded-xl border border-[#ebdcc4]/80 bg-[#fbf5ea]/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">STEP 02</span>
                <h4 className="font-serif text-[14.5px] font-bold text-[#2b241d] mt-1">Pinda Preparation</h4>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#65584a]">
                  Kneading sacred Pindas of cooked barley flour (Yava), white rice, black sesame, cow milk, and honey.
                </p>
              </div>
              <div className="rounded-xl border border-[#ebdcc4]/80 bg-[#fbf5ea]/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">STEP 03</span>
                <h4 className="font-serif text-[14.5px] font-bold text-[#2b241d] mt-1">Tarpana &amp; Visarjan</h4>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#65584a]">
                  Consecrated offering of water and sesame to Devas and Pitrus, followed by Pinda immersion at holy river ghats.
                </p>
              </div>
              <div className="rounded-xl border border-[#ebdcc4]/80 bg-[#fbf5ea]/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">STEP 04</span>
                <h4 className="font-serif text-[14.5px] font-bold text-[#2b241d] mt-1">Brahmana Bhojan &amp; Daan</h4>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#65584a]">
                  Honoring learned Vedic Brahmins with Satvik Anna, Vastra Daan, and Dakshina for complete ancestral satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION F: TIRTH SHRADH
          Ceremonies for Pitru Shanti and Dosha Nivarana
      ========================================================= */}
      <section className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1360px]">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
              <Sparkles size={12} className="text-[#c77722]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                PITRU SHANTI &amp; DOSHA NIVARANA
              </span>
            </div>

            <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              Tirth Shradh &amp; <span className="text-[#c77722]">Narayan Bali</span>
            </h2>

            <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
              Specialized ancestral rites performed by learned Teertha Purohits to dissolve Pitru Dosha, bring relief to departed souls, and invite peace into family lineage.
            </p>
          </div>

          {/* 4 Shradh Ceremony Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TIRTH_SHRADH_CEREMONIES.map((c) => (
              <div
                key={c.id}
                className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-5 shadow-[0_2px_10px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#180f08]/85 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f5ce6f] border border-[#eab12c]/40 backdrop-blur-xs">
                      {c.hindiName}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-serif text-[17px] font-bold leading-snug text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-[#65584a] line-clamp-3">
                      {c.significance}
                    </p>

                    <div className="mt-3.5 space-y-1 pt-3 border-t border-[#f0e2cc]">
                      {c.vidhiIncludes.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11.5px] text-[#554637]">
                          <CheckCircle2 size={12} className="text-[#b36c1e] shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#f0e2cc] flex items-center justify-between gap-2">
                  <Link
                    to="/yagya-puja/special-puja/tirth-shradh"
                    className="text-[11.5px] font-medium text-[#7d6f60] hover:text-[#b36c1e]"
                  >
                    Details
                  </Link>
                  <Link
                    to={c.bookingPath || "/yagya-puja/puja/kashi-ganga-pujan/book"}
                    state={{
                      specialPujaContext: {
                        name: c.name,
                        hindiName: c.hindiName,
                        category: "Tirth Shradh",
                        slug: "kashi-ganga-pujan",
                      },
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[#fbf5ea] px-3 py-1 text-[11px] font-bold text-[#b36c1e] hover:bg-[#eab12c] hover:text-[#1c1308] transition-colors"
                  >
                    <span>Book Ritual</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION G: WHY CHOOSE VEDA STRUCTURE
          Meaningful trust pillars with Lucide icons
      ========================================================= */}
      <section className="relative border-b border-[#ebdcc4] bg-[#fbf5ea]/60 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1360px]">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
              <ShieldCheck size={13} className="text-[#c77722]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                VEDIC FOUNDATION
              </span>
            </div>

            <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              Why Devotees Trust <span className="text-[#c77722]">Veda Structure</span>
            </h2>

            <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
              Rigorous adherence to traditional Vedic canons, hereditary Acharyas, and complete transparency in every ceremony.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_SPECIAL_PUJA.map((pillar, index) => {
              const icons = {
                ShieldCheck: ShieldCheck,
                ScrollText: ScrollText,
                HeartHandshake: HeartHandshake,
                Truck: Truck,
              };
              const IconComp = icons[pillar.icon] || ShieldCheck;

              return (
                <div
                  key={index}
                  className="rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-6 shadow-[0_2px_10px_rgba(60,40,15,0.04)] text-center transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_6px_20px_rgba(199,119,34,0.1)]"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8edd8] text-[#c77722] mb-4">
                    <IconComp size={22} />
                  </div>
                  <h3 className="font-serif text-[18px] font-bold text-[#2b241d]">
                    {pillar.title}
                  </h3>
                  <p className="text-[11.5px] font-semibold text-[#b36c1e] mt-0.5">
                    {pillar.subtitle}
                  </p>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-[#65584a]">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION H: HOW IT WORKS STEPPER
          Horizontal on desktop, vertical on mobile
      ========================================================= */}
      <section className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1360px]">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
              <Calendar size={13} className="text-[#c77722]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                CLEAR 4-STEP JOURNEY
              </span>
            </div>

            <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              How to Arrange Your <span className="text-[#c77722]">Sacred Ceremony</span>
            </h2>

            <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
              Whether joining in person in Varanasi or participating virtually from anywhere in the world.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SPECIAL_PUJA_STEPS.map((s, idx) => (
              <div
                key={s.step}
                className="relative rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-6 shadow-[0_2px_10px_rgba(60,40,15,0.04)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-[28px] font-bold text-[#c77722]">
                    {s.step}
                  </span>
                  <span className="rounded-full bg-[#fbf5ea] px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#8e4f0d]">
                    Step {idx + 1}
                  </span>
                </div>

                <h3 className="font-serif text-[17px] font-bold text-[#2b241d]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#65584a]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION I: FAQS ACCORDION
          Clean expandable questions with smooth chevrons
      ========================================================= */}
      <section className="relative border-b border-[#ebdcc4] bg-[#fbf5ea]/60 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[900px]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[34px]">
              Clarifications on <span className="text-[#c77722]">Special Pujas &amp; Samskars</span>
            </h2>
            <p className="mt-2 text-[14px] text-[#65584a]">
              Clear answers regarding Vedic protocols, adult rites, and remote participation.
            </p>
          </div>

          <div className="space-y-3.5">
            {SPECIAL_PUJA_FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="overflow-hidden rounded-[18px] border border-[#ead8b8] bg-[#fffcf7] transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-serif text-[16px] font-bold text-[#2b241d] hover:text-[#b36c1e] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#c77722] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-[13.5px] leading-relaxed text-[#5c4e3f] border-t border-[#f0e2cc]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION J: FINAL CTA
          Full-width atmospheric closing banner with dual actions
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-[#ebdcc4] py-16 sm:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SPECIAL_PUJA_IMAGES.finalCtaBg})` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1c1209]/92 via-[#1c1209]/82 to-[#1c1209]/92"
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eab12c]/20 text-[#f5ce6f] mb-5 border border-[#eab12c]/40">
            <Flame size={28} />
          </div>

          <h2 className="font-serif text-[28px] font-bold text-white sm:text-[36px] lg:text-[42px] leading-tight">
            Ready to Consecrate Your Family's Sacred Milestones?
          </h2>

          <p className="mt-4 text-[15px] sm:text-[16px] text-[#f4e8d1]/90 max-w-2xl mx-auto leading-relaxed">
            Connect with our learned Acharyas to determine auspicious Muhurtas, calculate your Vedic Janma Tithi, or arrange authentic Pinda Daan ceremonies.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleScrollToCategories}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_18px_rgba(234,177,44,0.3)] hover:bg-[#dda018] transition-all"
            >
              <span>Explore All Ceremonies</span>
              <ArrowRight size={16} />
            </button>

            <Link
              to="/contact"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-[14px] font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition-colors"
            >
              <Phone size={14} className="text-[#f5ce6f]" />
              <span>Consult Acharya Helpline</span>
            </Link>
          </div>

          <p className="mt-8 text-[12.5px] text-[#f4e8d1]/70 font-serif">
            ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥
          </p>
        </div>
      </section>
    </div>
  );
}
