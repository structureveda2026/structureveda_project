import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Landmark,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronRight as BreadcrumbChevron,
  ChevronDown,
  UserCheck,
  Video,
  Sun,
  Heart,
  ScrollText,
  BookOpen,
  Flame,
} from "lucide-react";
import {
  getPujaCatalogueBySlug,
  PUJA_CATALOGUE_LIST,
} from "../data/pujaCatalogueData";
import PujaServiceCard from "../components/PujaServiceCard";
import defaultAboutImage from "../../../assets/images/puja_about.png";

const INSIGHT_ICONS = [ScrollText, Sparkles, BookOpen, Flame, Sun, ShieldCheck];

const PujaServiceDetails = () => {
  const { slug } = useParams();
  const service =
    getPujaCatalogueBySlug(slug) ||
    PUJA_CATALOGUE_LIST.find((p) => p.slug === slug) ||
    PUJA_CATALOGUE_LIST[0];

  // Gallery slider
  const images =
    Array.isArray(service?.images) && service.images.length > 0
      ? service.images
      : [service?.image].filter(Boolean);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentSlide(0);
  }, [slug]);

  const handlePrevSlide = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextSlide = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleScrollToInfo = () => {
    const el = document.getElementById("service-when-where") || document.getElementById("about-service");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const relatedServices = PUJA_CATALOGUE_LIST.filter(
    (p) => p.slug !== service?.slug
  ).slice(0, 3);

  if (!service) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6 text-center">
        <div>
          <h2 className="font-serif text-[28px] font-bold text-[#2b241d]">
            Service Not Found
          </h2>
          <p className="mt-2 text-[14px] text-[#685c4f]">
            The requested Vedic Puja service is currently not available in our catalogue.
          </p>
          <Link
            to="/yagya-puja/puja"
            className="mt-5 inline-block rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#1c1308]"
          >
            Browse All Puja Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#2b241d]">
      {/* =========================================================
          1. HERO SECTION WITH GALLERY & BREADCRUMBS
      ========================================================== */}
      <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#fffaf0] to-[#fffdfa] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 xl:px-12">
        <div className="pointer-events-none absolute -left-20 top-10 h-[380px] w-[380px] rounded-full bg-[#eab12c]/10 blur-[100px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-[320px] w-[320px] rounded-full bg-[#d4872b]/8 blur-[90px]" />

        <div className="relative mx-auto max-w-[1320px]">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-[#7a6d5f]">
            <Link to="/" className="transition-colors hover:text-[#c77722]">
              Home
            </Link>
            <BreadcrumbChevron size={13} className="text-[#a89d91]" />
            <Link to="/yagya-puja" className="transition-colors hover:text-[#c77722]">
              Yagya & Puja
            </Link>
            <BreadcrumbChevron size={13} className="text-[#a89d91]" />
            <Link to="/yagya-puja/puja" className="transition-colors hover:text-[#c77722]">
              Puja
            </Link>
            <BreadcrumbChevron size={13} className="text-[#a89d91]" />
            <span className="font-semibold text-[#2b241d] truncate max-w-[240px] sm:max-w-none">
              {service.name}
            </span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
            {/* Gallery Column */}
            <div className="lg:col-span-6">
              <div className="group relative overflow-hidden rounded-[26px] sm:rounded-[30px] border-2 border-[#e6caa0] bg-[#fffdfa] p-2 shadow-[0_16px_45px_rgba(80,60,30,0.08)] transition-all duration-500 hover:border-[#d4872b]/70">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#241a12]">
                  <img
                    src={images[currentSlide] || service.image}
                    alt={`${service.name} - slide ${currentSlide + 1}`}
                    className="h-full w-full object-cover object-center transition-all duration-500"
                    loading="eager"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b120a]/75 via-transparent to-black/20" />

                  {service.isFeatured && (
                    <div className="absolute left-4 top-4 z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#1c130b]/85 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md shadow-sm">
                        <Sparkles size={11} className="text-[#eab12c]" />
                        Featured Service
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 z-10 max-w-[85%]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11.5px] font-medium text-[#f0e3ce] backdrop-blur-sm shadow-sm">
                      <MapPin size={13} className="shrink-0 text-[#eab12c]" />
                      <span className="truncate">{service.locationType || "Kashi & Sacred Shrines"}</span>
                    </span>
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        aria-label="Previous slide"
                        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-all hover:bg-black/85 hover:scale-105"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        aria-label="Next slide"
                        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-all hover:bg-black/85 hover:scale-105"
                      >
                        <ChevronRight size={20} />
                      </button>

                      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 backdrop-blur-sm">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              idx === currentSlide
                                ? "w-4 bg-[#eab12c]"
                                : "w-1.5 bg-white/60 hover:bg-white"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Information Column */}
            <div className="space-y-4 lg:col-span-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4872b]/35 bg-[#fdf5e6] px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                  <Sparkles size={11} className="text-[#c77722]" />
                  {service.eyebrow || "VEDIC PUJA SERVICE"}
                </span>
              </div>

              <h1 className="font-serif text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#2b241d] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
                {service.name}
              </h1>

              {service.tagline && (
                <p className="font-serif text-[15px] italic leading-snug text-[#9d5b12] sm:text-[16.5px]">
                  "{service.tagline}"
                </p>
              )}

              <p className="text-[13.5px] sm:text-[14.5px] leading-relaxed text-[#5e5143]">
                {service.shortDescription || service.fullDescription}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="inline-flex items-center gap-2 rounded-xl border border-[#ead8b8] bg-[#fffaf0] px-3.5 py-1.5 text-[13px] font-semibold text-[#2b241d] shadow-2xs">
                  <Clock size={14} className="text-[#d4872b]" />
                  <span>Duration: {service.duration || "2 - 3 Hours"}</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-[#ead8b8] bg-[#fffaf0] px-3.5 py-1.5 text-[13px] font-semibold text-[#2b241d] shadow-2xs">
                  <MapPin size={14} className="text-[#d4872b]" />
                  <span>{service.locationType || "Kashi & Sacred Shrines"}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ead8b8] pt-5">
                <div>
                  <span className="block text-[10.5px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Starting From
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-[28px] font-bold text-[#2b241d] sm:text-[32px]">
                      {service.formattedPrice}
                    </span>
                    <span className="text-[12px] font-medium text-[#8a7c6b]">
                      (Incl. Samagri & Sankalp)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleScrollToInfo}
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_8px_24px_rgba(234,177,44,0.3)] transition-all duration-300 hover:brightness-105"
                >
                  <span>Book This Puja</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. ABOUT THE PUJA SERVICE
      ========================================================== */}
      <section id="about-service" className="border-b border-[#ead8b8] bg-[#fffdfa] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#b36c1e] sm:text-[11px]">
                Sacred Overview
              </p>
              <h2 className="mt-2 font-serif text-[32px] font-medium leading-[1.12] text-[#2b241d] sm:text-[38px] lg:text-[42px]">
                About the Ceremony
              </h2>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-[2px] w-12 rounded-full bg-[#d4872b]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
              </div>

              <div className="mt-6 space-y-4 text-[15px] leading-[1.8] text-[#5e5143] sm:text-[16px]">
                <p>{service.fullDescription || service.shortDescription}</p>
                <p>
                  Conducted in accordance with authentic Vedic injunctions, this sacred ritual is officiated with strict adherence to mantra pronunciation, pure samagri, and dedicated gotra sankalpa invocation.
                </p>
              </div>

              {/* 4 Feature Highlights */}
              <div className="mt-8 grid grid-cols-2 gap-3.5 sm:gap-4">
                <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                    <ShieldCheck size={18} />
                  </div>
                  <h4 className="mt-2.5 font-serif text-[14px] font-bold text-[#2b241d]">
                    Authentic Vidhi
                  </h4>
                  <p className="mt-1 text-[12px] text-[#75695c]">
                    Strict adherence to traditional Vedic shastras.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                    <UserCheck size={18} />
                  </div>
                  <h4 className="mt-2.5 font-serif text-[14px] font-bold text-[#2b241d]">
                    Vedic Acharyas
                  </h4>
                  <p className="mt-1 text-[12px] text-[#75695c]">
                    Conducted by certified, experienced priests.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                    <CheckCircle2 size={18} />
                  </div>
                  <h4 className="mt-2.5 font-serif text-[14px] font-bold text-[#2b241d]">
                    Gotra Sankalpa
                  </h4>
                  <p className="mt-1 text-[12px] text-[#75695c]">
                    Personalized name and lineage dedication.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-4 shadow-2xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                    <Video size={18} />
                  </div>
                  <h4 className="mt-2.5 font-serif text-[14px] font-bold text-[#2b241d]">
                    Updates & Prasad
                  </h4>
                  <p className="mt-1 text-[12px] text-[#75695c]">
                    Video update and energized prasad delivery.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-[26px] border-2 border-[#e6cca0] bg-[#241a12] shadow-xl">
                <img
                  src={defaultAboutImage}
                  alt="Sacred Vedic Ceremony Overview"
                  className="h-[360px] w-full object-cover sm:h-[420px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-center sm:text-left">
                  <p className="font-serif text-[18px] font-semibold text-white">
                    {service.deity} Invocation
                  </p>
                  <p className="text-[12px] text-[#f4e8d1]/80">
                    Consecrated with pure dhoop, flowers, and traditional ahutis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. TRADITIONAL INTENTIONS / SPIRITUAL BENEFITS
      ========================================================== */}
      {service.whyPerform && service.whyPerform.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#faf5eb] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto mb-12 max-w-[700px] text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                DEVOTIONAL SIGNIFICANCE
              </p>
              <h2 className="mt-3 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[40px]">
                Why Perform This Puja?
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#685c4f]">
                Traditional purposes and devotional intentions associated with this Vedic ritual.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.whyPerform.map((benefit, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col justify-between rounded-[22px] border border-[#e6cca0] bg-white p-6 shadow-2xs transition-all duration-300 hover:border-[#d4872b] hover:shadow-[0_12px_30px_rgba(212,135,43,0.1)]"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722] transition-colors group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="mt-4 font-serif text-[18px] font-bold text-[#2b241d] transition-colors group-hover:text-[#c77722]">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f]">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          4. SPIRITUAL & SCRIPTURAL SIGNIFICANCE
      ========================================================== */}
      {service.significance && service.significance.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#fffdfa] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto mb-10 max-w-[700px] text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#b36c1e]">
                Scriptural Wisdom
              </p>
              <h2 className="mt-2 font-serif text-[32px] font-medium text-[#2b241d] sm:text-[40px]">
                Spiritual Significance
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#685c4f]">
                Rooted in timeless Vedic texts, performing this ritual aligns the devotee with traditional spiritual heritage.
              </p>
            </div>

            <div className="space-y-3.5 max-w-[900px] mx-auto">
              {service.significance.map((item, idx) => {
                const IconComponent = INSIGHT_ICONS[idx % INSIGHT_ICONS.length];
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-4 sm:p-5 transition hover:border-[#d4872b]/70"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e8c995] bg-white text-[#c77722] shadow-2xs">
                      <IconComponent size={17} />
                    </div>
                    <p className="text-[14px] leading-relaxed text-[#4a3d31]">
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          5. WHAT'S INCLUDED IN THE SERVICE
      ========================================================== */}
      {service.whatsIncluded && service.whatsIncluded.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            <div className="mx-auto mb-12 max-w-[700px] text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                SERVICE DELIVERABLES
              </p>
              <h2 className="mt-3 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[40px]">
                What's Included in Your Service
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#685c4f]">
                Complete peace of mind with authentic ritual execution, pure samagri, and sanctified prasadam delivery.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.whatsIncluded.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#e6cca0] bg-white p-5 shadow-2xs transition hover:border-[#d4872b]"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-[14px] font-medium text-[#4a3d31] leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          6. PROCEDURE / HOW IT IS PERFORMED
      ========================================================== */}
      {service.procedureSteps && service.procedureSteps.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#faf5eb] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto mb-12 max-w-[700px] text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                AUTHENTIC VEDIC VIDHI
              </p>
              <h2 className="mt-3 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[40px]">
                How the Puja is Performed
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#685c4f]">
                A structured ceremonial flow conducted by trained Vedic priests.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.procedureSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-[22px] border border-[#e6cca0] bg-white p-6 shadow-2xs transition-all duration-300 hover:border-[#d4872b]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-[26px] font-bold text-[#d4872b]">
                        {step.step}
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8edd8] text-[#b36c1e]">
                        <CheckCircle2 size={16} />
                      </span>
                    </div>
                    <h3 className="mt-4 font-serif text-[18px] font-bold text-[#2b241d]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#685c4f]">
                      {step.description}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-[#ead8b8] pt-3 text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                    Phase 0{idx + 1} of 04
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          7. WHEN AND WHERE (VENUE & SCHEDULING)
      ========================================================== */}
      <section id="service-when-where" className="border-b border-[#ead8b8] bg-[#faf6ed] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto mb-12 max-w-[700px] text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
              VENUE & SCHEDULING
            </p>
            <h2 className="mt-3 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[40px]">
              When and Where
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#685c4f]">
              Flexible scheduling, sanctified venues, and ceremony duration details.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[24px] border border-[#e6cca0] bg-white p-7 shadow-2xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8edd8] text-[#c77722]">
                <Landmark size={22} />
              </div>
              <h3 className="mt-5 font-serif text-[20px] font-bold text-[#2b241d]">
                Available Locations
              </h3>
              <p className="mt-2 text-[14px] font-semibold text-[#b36c1e]">
                {service.locationType || "Kashi & Sacred Mandirs"}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#685c4f]">
                {service.isKashiAvailable
                  ? "Can be organized directly in Kashi on sacred Ganga ghats or consecrated ashram mandirs."
                  : "Organized in consecrated Vedic shrines and traditional mandirs."}
              </p>
            </div>

            <div className="rounded-[24px] border border-[#e6cca0] bg-white p-7 shadow-2xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8edd8] text-[#c77722]">
                <Clock size={22} />
              </div>
              <h3 className="mt-5 font-serif text-[20px] font-bold text-[#2b241d]">
                Flexible Scheduling
              </h3>
              <p className="mt-2 text-[14px] font-semibold text-[#b36c1e]">
                Auspicious Tithi / Chosen Date
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#685c4f]">
                Services can be coordinated on your requested date or aligned with an auspicious muhurat calculated by our Jyotish Acharyas.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#e6cca0] bg-white p-7 shadow-2xs sm:col-span-2 lg:col-span-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8edd8] text-[#c77722]">
                <ShieldCheck size={22} />
              </div>
              <h3 className="mt-5 font-serif text-[20px] font-bold text-[#2b241d]">
                Estimated Duration
              </h3>
              <p className="mt-2 text-[14px] font-semibold text-[#b36c1e]">
                {service.duration || "2 - 3 Hours"} (Approx.)
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#685c4f]">
                Covers preparation, gotra sankalpa recitation, continuous offerings, and concluding Maha Aarti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          8. SERVICE-SPECIFIC FAQ
      ========================================================== */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[860px]">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                FREQUENTLY ASKED QUESTIONS
              </p>
              <h2 className="mt-3 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[40px]">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-[15px] text-[#685c4f]">
                Common questions regarding this specific Puja service.
              </p>
            </div>

            <div className="space-y-3.5">
              {service.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-[#ebdcc4] bg-white shadow-2xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      className="flex w-full items-center justify-between p-5 text-left hover:bg-[#faf5eb]"
                    >
                      <span className="font-serif text-[17px] font-semibold text-[#2b241d]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-[#c77722] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[#f2e6d5] bg-[#fffdfa] px-5 pb-5 pt-3.5 text-[14px] leading-relaxed text-[#685c4f]">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          9. RELATED PUJA SERVICES
      ========================================================== */}
      {relatedServices.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                  EXPLORE MORE TRADITIONS
                </p>
                <h2 className="mt-2 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[38px]">
                  Related Puja Services
                </h2>
              </div>
              <Link
                to="/yagya-puja/puja"
                className="inline-flex items-center gap-2 rounded-full border border-[#d6b8a0] bg-white px-5 py-2.5 text-[12.5px] font-bold text-[#2b241d] shadow-2xs transition hover:border-[#d4872b] hover:bg-[#fffaf0]"
              >
                <span>View All Services</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((rel) => (
                <PujaServiceCard key={rel.id} service={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          10. FINAL CTA
      ========================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fffaf0] via-[#fbf3e4] to-[#f8edd8] px-5 py-20 text-center sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[750px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4872b]/30 bg-white/80 px-3.5 py-1 backdrop-blur-xs shadow-2xs">
            <Sparkles size={13} className="text-[#c77722]" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              SANATAN TRADITION
            </span>
          </div>

          <h2 className="mt-4 font-serif text-[34px] font-semibold leading-tight text-[#2b241d] sm:text-[44px]">
            Begin Your Sacred Sankalp
          </h2>

          <p className="mt-4 text-[15.5px] leading-relaxed text-[#685c4f] sm:text-[16px]">
            Arrange the sacred {service.name} performed with traditional Vedic authenticity, pure samagri, and dedicated gotra recitation.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleScrollToInfo}
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-9 py-4 text-[14.5px] font-bold text-[#1c1308] shadow-[0_10px_28px_rgba(234,177,44,0.3)] transition-all duration-300 hover:brightness-105"
            >
              <span>Book This Puja</span>
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <Link
              to="/yagya-puja/puja"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-white px-7 py-3.5 text-[14px] font-bold text-[#2b241d] shadow-2xs transition hover:border-[#d4872b] hover:bg-[#fffaf0]"
            >
              Explore All Puja Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PujaServiceDetails;
