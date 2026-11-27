import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ChevronRight as BreadcrumbChevron,
  Clock,
  Users,
  Flame,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Layers,
  HeartHandshake,
  BookOpen,
  MapPin,
  UserCheck,
  Video,
  Phone,
} from "lucide-react";
import { SHODASHA_SAMSKARS } from "../data/specialPujaData";

export default function SpecialPujaServiceDetail() {
  const { samskarSlug } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [samskarSlug]);

  const samskar =
    SHODASHA_SAMSKARS.find((s) => s.slug === samskarSlug) ||
    SHODASHA_SAMSKARS[0];

  const currentIndex = SHODASHA_SAMSKARS.findIndex((s) => s.id === samskar.id);
  const prevSamskar =
    currentIndex > 0 ? SHODASHA_SAMSKARS[currentIndex - 1] : null;
  const nextSamskar =
    currentIndex < SHODASHA_SAMSKARS.length - 1
      ? SHODASHA_SAMSKARS[currentIndex + 1]
      : null;

  const bookingServicePayload = {
    id: 100 + samskar.id,
    slug: samskar.slug,
    name: samskar.name,
    hindiName: samskar.sanskritName,
    tagline: samskar.tagline,
    shortDescription: samskar.shortDesc,
    description: samskar.description,
    serviceType: "PUJA",
    startingPrice: 5100,
    formattedPrice: "₹5,100",
    primaryImage: samskar.image,
    image: samskar.image,
    bannerImage: samskar.image,
    duration: samskar.duration,
    availableDurations: ["2 Hours", "3 Hours", "Full Day"],
    durationHours: [2, 3],
    priestCount: 2,
    category: "Special Puja - Shodasha Samskar",
    purposeSummary: samskar.significance,
    availableMode: "In Person / Kashi / Remote",
    rawAvailableMode: "kashi",
    location: "Kashi Sanctum / Devotee Home / Sacred Tirtha",
    locationType: "Kashi Sanctum / Devotee Home",
    isKashiAvailable: true,
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#2b241d] selection:bg-[#eab12c]/30">
      {/* =========================================================
          1. HERO SECTION WITH IMAGE & BREADCRUMBS
          Matching existing PujaServiceDetails.jsx layout & structure
      ========================================================== */}
      <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#fffaf0] to-[#fffdfa] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 xl:px-12">
        <div className="pointer-events-none absolute -left-20 top-10 h-[380px] w-[380px] rounded-full bg-[#eab12c]/10 blur-[100px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-[320px] w-[320px] rounded-full bg-[#d4872b]/8 blur-[90px]" />

        <div className="relative mx-auto max-w-[1320px]">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-[#7a6d5f]"
          >
            <Link to="/" className="transition-colors hover:text-[#c77722]">
              Home
            </Link>
            <BreadcrumbChevron size={13} className="text-[#a89d91]" />
            <Link to="/yagya-puja" className="transition-colors hover:text-[#c77722]">
              Yagya &amp; Puja
            </Link>
            <BreadcrumbChevron size={13} className="text-[#a89d91]" />
            <Link
              to="/yagya-puja/special-puja"
              className="transition-colors hover:text-[#c77722]"
            >
              Special Puja
            </Link>
            <BreadcrumbChevron size={13} className="text-[#a89d91]" />
            <Link
              to="/yagya-puja/special-puja/samskar"
              className="transition-colors hover:text-[#c77722]"
            >
              Shodasha Samskars
            </Link>
            <BreadcrumbChevron size={13} className="text-[#a89d91]" />
            <span className="font-semibold text-[#2b241d] truncate max-w-[260px] sm:max-w-none">
              {samskar.name}
            </span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
            {/* Gallery / Image Column (Left 6 cols) */}
            <div className="lg:col-span-6">
              <div className="group relative overflow-hidden rounded-[26px] sm:rounded-[30px] border-2 border-[#e6caa0] bg-[#fffdfa] p-2 shadow-[0_16px_45px_rgba(80,60,30,0.08)] transition-all duration-500 hover:border-[#d4872b]/70">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#241a12]">
                  <img
                    src={samskar.image}
                    alt={`${samskar.name} Samskara ceremony`}
                    className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b120a]/75 via-transparent to-black/20" />

                  {/* Top Serial Number Pill */}
                  <div className="absolute left-4 top-4 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#1c130b]/85 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md shadow-sm">
                      <Sparkles size={11} className="text-[#eab12c]" />
                      Samskara #{samskar.number}
                    </span>
                  </div>

                  {/* Life-Stage Badge on Image */}
                  <div className="absolute bottom-4 left-4 z-10 max-w-[85%]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11.5px] font-medium text-[#f0e3ce] backdrop-blur-sm shadow-sm">
                      <MapPin size={13} className="shrink-0 text-[#eab12c]" />
                      <span>{samskar.phase} Stage</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Column (Right 6 cols) */}
            <div className="space-y-4 lg:col-span-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4872b]/35 bg-[#fdf5e6] px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                  <Sparkles size={11} className="text-[#c77722]" />
                  SHODASHA SAMSKAR CEREMONY
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="font-serif text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#2b241d] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
                  {samskar.name}
                </h1>
                <span className="text-[18px] sm:text-[22px] font-bold text-[#b36c1e]">
                  {samskar.sanskritName}
                </span>
              </div>

              <p className="font-serif text-[15px] italic leading-snug text-[#9d5b12] sm:text-[16.5px]">
                "{samskar.tagline}"
              </p>

              <p className="text-[13.5px] sm:text-[14.5px] leading-relaxed text-[#5e5143]">
                {samskar.shortDesc}
              </p>

              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="inline-flex items-center gap-2 rounded-xl border border-[#ead8b8] bg-[#fffaf0] px-3.5 py-1.5 text-[13px] font-semibold text-[#2b241d] shadow-2xs">
                  <Clock size={14} className="text-[#d4872b]" />
                  <span>Duration: {samskar.duration}</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-[#ead8b8] bg-[#fffaf0] px-3.5 py-1.5 text-[13px] font-semibold text-[#2b241d] shadow-2xs">
                  <Users size={14} className="text-[#d4872b]" />
                  <span>Acharyas: {samskar.priestsRequired}</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-[#ead8b8] bg-[#fffaf0] px-3.5 py-1.5 text-[13px] font-semibold text-[#2b241d] shadow-2xs">
                  <Calendar size={14} className="text-[#d4872b]" />
                  <span>Timing: {samskar.timing}</span>
                </div>
              </div>

              {/* Action Button Row */}
              <div className="flex flex-wrap items-center gap-4 border-t border-[#ead8b8] pt-5">
                <Link
                  to={samskar.bookingPath || `/yagya-puja/special-puja/samskar/${samskar.slug}/book`}
                  state={{ service: bookingServicePayload }}
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_8px_24px_rgba(234,177,44,0.3)] transition-all duration-300 hover:brightness-105"
                >
                  <span>Book Ceremony / Check Muhurta</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="tel:+918887776655"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#b36c1e] hover:text-[#8e4f0d] transition-colors"
                >
                  <Phone size={14} />
                  <span>Call: +91 888 777 6655</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. MAIN CONTENT: BALANCED TWO-COLUMN LAYOUT
          Left: Shastric Details, Vidhi & Offerings (8 cols)
          Right: Sticky Inquiry & Ceremony Summary (4 cols)
      ========================================================== */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left Column (8 cols) */}
            <div className="space-y-8 lg:col-span-8">
              {/* Shastric Overview & Meaning */}
              <div className="rounded-[24px] border border-[#ead8b8] bg-[#fffdfa] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 text-[#b36c1e] mb-3">
                  <BookOpen size={18} className="text-[#c77722]" />
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                    SCRIPTURAL CONTEXT
                  </span>
                </div>
                <h2 className="font-serif text-[22px] font-bold text-[#2b241d] sm:text-[26px]">
                  Shastric Overview &amp; Spiritual Meaning
                </h2>
                <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#5c4e3f]">
                  {samskar.description}
                </p>
              </div>

              {/* Spiritual Significance */}
              <div className="rounded-[24px] border border-[#ead8b8] bg-[#fffdfa] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 text-[#b36c1e] mb-3">
                  <Sparkles size={18} className="text-[#c77722]" />
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                    KARMIC PURPOSE
                  </span>
                </div>
                <h2 className="font-serif text-[22px] font-bold text-[#2b241d] sm:text-[26px]">
                  Spiritual Significance &amp; Karmic Fruits
                </h2>
                <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#5c4e3f]">
                  {samskar.significance}
                </p>
              </div>

              {/* Step-by-Step Ritual Sequence (Vidhi) */}
              <div className="rounded-[24px] border border-[#ead8b8] bg-[#fffdfa] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 text-[#b36c1e] mb-3">
                  <Layers size={18} className="text-[#c77722]" />
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                    CEREMONY PROCEDURE
                  </span>
                </div>
                <h2 className="font-serif text-[22px] font-bold text-[#2b241d] sm:text-[26px]">
                  Step-by-Step Ritual Sequence (Vidhi)
                </h2>
                <div className="mt-5 space-y-3">
                  {samskar.vidhiSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 rounded-xl border border-[#ebdcc4] bg-[#fbf5ea]/50 p-4 transition-colors hover:border-[#c77722]"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eab12c] text-[11.5px] font-bold text-[#1c1308]">
                        {idx + 1}
                      </span>
                      <p className="text-[13.5px] font-medium leading-relaxed text-[#45372a]">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sacred Samagri & Key Ahutis */}
              <div className="rounded-[24px] border border-[#ead8b8] bg-[#fffdfa] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 text-[#b36c1e] mb-3">
                  <Flame size={18} className="text-[#c77722]" />
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                    VEDIC SAMAGRI
                  </span>
                </div>
                <h2 className="font-serif text-[22px] font-bold text-[#2b241d] sm:text-[26px]">
                  Sacred Samagri &amp; Key Ahutis
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {samskar.keyOfferings.map((offering, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 rounded-xl border border-[#ebdcc4] bg-[#fbf5ea]/60 px-4 py-3 text-[13px] font-medium text-[#45372a]"
                    >
                      <CheckCircle2 size={15} className="text-[#b36c1e] shrink-0" />
                      <span>{offering}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Feature Highlights matching existing detail pages */}
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4 pt-2">
                <div className="rounded-2xl border border-[#ead8b8] bg-[#fffcf7] p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                    <ShieldCheck size={18} />
                  </div>
                  <h4 className="mt-2.5 font-serif text-[14px] font-bold text-[#2b241d]">
                    Authentic Vidhi
                  </h4>
                  <p className="mt-1 text-[12px] text-[#75695c]">
                    Strict adherence to Shukla Yajurveda &amp; Grihya Sutras.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ead8b8] bg-[#fffcf7] p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                    <UserCheck size={18} />
                  </div>
                  <h4 className="mt-2.5 font-serif text-[14px] font-bold text-[#2b241d]">
                    Vedic Acharyas
                  </h4>
                  <p className="mt-1 text-[12px] text-[#75695c]">
                    Conducted by trained, experienced Gurukul priests.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ead8b8] bg-[#fffcf7] p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                    <CheckCircle2 size={18} />
                  </div>
                  <h4 className="mt-2.5 font-serif text-[14px] font-bold text-[#2b241d]">
                    Gotra Sankalpa
                  </h4>
                  <p className="mt-1 text-[12px] text-[#75695c]">
                    Personalized family Gotra, Nakshatra, and name chanted.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ead8b8] bg-[#fffcf7] p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                    <Video size={18} />
                  </div>
                  <h4 className="mt-2.5 font-serif text-[14px] font-bold text-[#2b241d]">
                    Updates &amp; Prasad
                  </h4>
                  <p className="mt-1 text-[12px] text-[#75695c]">
                    Full video footage and blessed prasad delivered home.
                  </p>
                </div>
              </div>

              {/* Previous / Next Samskar Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#ebdcc4]">
                {prevSamskar ? (
                  <Link
                    to={`/yagya-puja/special-puja/samskar/${prevSamskar.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffcf7] px-4 py-2 text-[12.5px] font-bold text-[#b36c1e] hover:border-[#c77722] transition-colors"
                  >
                    <ArrowLeft size={13} />
                    <span>
                      #{prevSamskar.number} {prevSamskar.name}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {nextSamskar && (
                  <Link
                    to={`/yagya-puja/special-puja/samskar/${nextSamskar.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffcf7] px-4 py-2 text-[12.5px] font-bold text-[#b36c1e] hover:border-[#c77722] transition-colors"
                  >
                    <span>
                      #{nextSamskar.number} {nextSamskar.name}
                    </span>
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Sticky Booking & Inquiry Card (4 cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 overflow-hidden rounded-[26px] border-2 border-[#e6caa0] bg-[#fffdfa] p-6 shadow-[0_16px_45px_rgba(80,60,30,0.08)]">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                  CEREMONY INQUIRY &amp; SANKALP
                </span>

                <h3 className="mt-1 font-serif text-[22px] font-bold text-[#2b241d]">
                  Arrange {samskar.name}
                </h3>
                <p className="text-[12.5px] text-[#75695c] mt-0.5">
                  Conducted according to your family Gotra &amp; Janma Nakshatra.
                </p>

                <div className="mt-5 space-y-3 border-t border-b border-[#f0e2cc] py-4 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7d6f60]">Ceremony Stage</span>
                    <strong className="font-semibold text-[#2b241d]">
                      {samskar.phase}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7d6f60]">Purohit Team</span>
                    <strong className="font-semibold text-[#2b241d]">
                      {samskar.priestsRequired}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7d6f60]">Estimated Duration</span>
                    <strong className="font-semibold text-[#2b241d]">
                      {samskar.duration}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7d6f60]">Location</span>
                    <strong className="font-semibold text-[#2b241d]">
                      Kashi Sanctum / At Home
                    </strong>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    to={samskar.bookingPath || `/yagya-puja/special-puja/samskar/${samskar.slug}/book`}
                    state={{ service: bookingServicePayload }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#eab12c] py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_18px_rgba(234,177,44,0.3)] hover:bg-[#dda018] transition-colors"
                  >
                    <span>Check Muhurta &amp; Book</span>
                    <ArrowRight size={15} />
                  </Link>

                  <a
                    href="tel:+918887776655"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffaf0] py-3 text-[13px] font-bold text-[#2b241d] hover:border-[#b36c1e] hover:text-[#b36c1e] transition-colors"
                  >
                    <Phone size={14} className="text-[#b36c1e]" />
                    <span>Speak with an Acharya</span>
                  </a>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f0e2cc] space-y-2 text-[11.5px] text-[#554637]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#b36c1e] shrink-0" />
                    <span>Pure Vedic Samagri &amp; Havan ahutis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#b36c1e] shrink-0" />
                    <span>Live broadcast or recording provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartHandshake size={14} className="text-[#b36c1e] shrink-0" />
                    <span>Blessed Prasad dispatched worldwide</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
