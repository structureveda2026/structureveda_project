import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Flame,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Users,
  ShieldCheck,
  Clock,
  Calendar,
  Gift,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { HOMA_CATALOGUE_LIST } from "../data/homaCatalogueData";
import homaCatalogueService, {
  mapApiHomaServiceDetailToUi,
  getHomaFallbackImage,
  getHomaServiceGallery,
  isUnresolvableAsset,
} from "../../../services/homaCatalogueService";
import HomaServiceCard from "../components/HomaServiceCard";
import HomaSamagriSection from "../components/HomaSamagriSection";
import PublicSEO from "../../../components/common/PublicSEO";
import cardYagyaFireImg from "../../../assets/images/library/cards/card-yagya-fire.jpg";

/**
 * Standardized HomaServiceDetails Page
 * Design C Concept: Premium Gallery (55%) + Floating Booking Panel (45%)
 * Dynamic customer detail experience across ALL Vedic Homa ceremonies.
 * Route: /yagya-puja/homa/:slug
 */
export default function HomaServiceDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryImgErrors, setGalleryImgErrors] = useState({});
  const [relatedHomas, setRelatedHomas] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Fetch service details from authoritative API with static fallback on failure
  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentSlide(0);
    setGalleryImgErrors({});

    async function loadService() {
      try {
        const data = await homaCatalogueService.getHomaServiceBySlug(slug);
        if (!isMounted) return;

        if (data) {
          setService(data);
          document.title = `${data.name} | Vedic Homa & Havan | Veda Structure`;
          setLoading(false);
        } else {
          // Check static fallback
          const fallback = HOMA_CATALOGUE_LIST.find((h) => h.slug === slug);
          if (fallback) {
            const mapped = mapApiHomaServiceDetailToUi(fallback);
            setService(mapped);
            document.title = `${mapped.name} | Vedic Homa & Havan | Veda Structure`;
            setLoading(false);
          } else {
            setError("The requested Vedic Homa ritual could not be found.");
            setLoading(false);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn(
          `Homa service detail API error for ${slug}, engaging fallback:`,
          err?.message || err
        );
        const fallback = HOMA_CATALOGUE_LIST.find((h) => h.slug === slug);
        if (fallback) {
          const mapped = mapApiHomaServiceDetailToUi(fallback);
          setService(mapped);
          document.title = `${mapped.name} | Vedic Homa & Havan | Veda Structure`;
          setLoading(false);
        } else {
          setError(
            "Unable to load ceremony details. Please check your connection and try again."
          );
          setLoading(false);
        }
      }
    }

    loadService();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Dynamic related homas from active catalogue API
  useEffect(() => {
    let isMounted = true;
    async function loadRelated() {
      try {
        const res = await homaCatalogueService.getHomaServices({ limit: 12 });
        if (!isMounted) return;
        const all = Array.isArray(res?.services) ? res.services : [];
        const candidates = all.filter(
          (h) => h.slug !== slug && h.id !== service?.id
        );

        // Prioritize ceremonies from the same category first
        const currentCat = service?.category?.slug || service?.categoryId;
        const sorted = candidates.sort((a, b) => {
          const aMatch =
            a.category?.slug === currentCat || a.categoryId === currentCat;
          const bMatch =
            b.category?.slug === currentCat || b.categoryId === currentCat;
          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;
          return 0;
        });

        const top3 = sorted.slice(0, 3);
        if (top3.length > 0) {
          setRelatedHomas(top3);
        } else {
          setRelatedHomas(
            HOMA_CATALOGUE_LIST.filter((h) => h.slug !== slug)
              .slice(0, 3)
              .map(mapApiHomaServiceDetailToUi)
          );
        }
      } catch {
        if (!isMounted) return;
        setRelatedHomas(
          HOMA_CATALOGUE_LIST.filter((h) => h.slug !== slug)
            .slice(0, 3)
            .map(mapApiHomaServiceDetailToUi)
        );
      }
    }

    if (slug) {
      loadRelated();
    }
    return () => {
      isMounted = false;
    };
  }, [slug, service?.id, service?.category?.slug, service?.categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCF6] flex flex-col items-center justify-center p-8">
        <div className="relative mb-4">
          <Flame className="w-12 h-12 text-[#B77920] animate-pulse" />
        </div>
        <h3 className="font-serif text-xl font-bold text-[#30251C] mb-2">
          Loading Sacred Homa Ceremony...
        </h3>
        <p className="text-sm text-[#766D60]">
          Consulting Vedic repository and ritual parameters.
        </p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-[#FFFCF6] flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl border border-[#EAD8BC] max-w-md text-center shadow-md">
          <AlertCircle className="w-12 h-12 text-[#B77920] mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-[#30251C] mb-2">
            Ceremony Not Found
          </h3>
          <p className="text-sm text-[#766D60] mb-6">
            {error || "The requested Vedic Homa ritual could not be found."}
          </p>
          <Link
            to="/yagya-puja/homa"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B77920] hover:bg-[#A06416] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Homa Catalogue</span>
          </Link>
        </div>
      </div>
    );
  }

  // Safe visual asset resolution with fallback guarantee
  const fallbackImg =
    (service.slug ? getHomaFallbackImage(service.slug) : null) || cardYagyaFireImg;

  const rawGallery =
    Array.isArray(service.gallery) && service.gallery.length > 0
      ? service.gallery
      : Array.isArray(service.galleryImages) && service.galleryImages.length > 0
        ? service.galleryImages
        : getHomaServiceGallery(service.slug, service.image || fallbackImg);

  const galleryImages = (
    rawGallery.length > 0 ? rawGallery : [service.image || fallbackImg]
  ).map((img, idx) => {
    if (galleryImgErrors[idx]) return fallbackImg;
    if (isUnresolvableAsset(img)) {
      return fallbackImg;
    }
    return img || fallbackImg;
  });

  // Top 3 curated views for Design C Gallery (1 primary + 2-3 supporting thumbnails)
  const displayThumbnails = galleryImages.slice(0, 3);
  const totalSlides = displayThumbnails.length;

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // Service FAQs from API response
  const serviceFaqs = Array.isArray(service.faqs) && service.faqs.length > 0
    ? service.faqs
    : Array.isArray(service.faq) && service.faq.length > 0
      ? service.faq
      : [];

  const startingPrice = Number(service.startingPrice || service.basePrice || 0);

  const handleBookNow = () => {
    navigate(`/yagya-puja/homa/${service.slug}/book`, {
      state: {
        service,
        configuration: {
          havanCount: service.availableHavanCounts?.[0] || 1,
          days: service.availableDays?.[0] || 1,
          location: service.kashiAvailable !== false ? "kashi" : "remote",
        },
      },
    });
  };

  const havanCounts =
    Array.isArray(service.availableHavanCounts) &&
      service.availableHavanCounts.length > 0
      ? service.availableHavanCounts
      : [1, 3, 5];

  const durationDays =
    Array.isArray(service.availableDays) && service.availableDays.length > 0
      ? service.availableDays
      : [1, 2];

  const minPandits = service.minimumPandits || 2;
  const maxPandits =
    service.maximumPandits || service.recommendedPandits || 7;

  return (
    <div className="min-h-screen bg-[#FFFCF6] text-[#30251C] pb-24 lg:pb-16">
      <PublicSEO service={service} serviceType="homa" />

      {/* ── 1. BREADCRUMB NAVIGATION ── */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#EAD8BC] bg-[#F8F1E6]/60 px-4 py-3 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-[1360px] items-center gap-2 text-[12px] text-[#766D60]">
          <Link to="/" className="hover:text-[#B77920] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/yagya-puja" className="hover:text-[#B77920] transition-colors">
            Yagya &amp; Puja
          </Link>
          <span>/</span>
          <Link to="/yagya-puja/homa" className="hover:text-[#B77920] transition-colors">
            Homa &amp; Havan
          </Link>
          {service.categoryDetails?.slug && (
            <>
              <span>/</span>
              <Link
                to={`/yagya-puja/homa/category/${service.categoryDetails.slug}`}
                className="hover:text-[#B77920] transition-colors"
              >
                {service.categoryDetails.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="font-semibold text-[#30251C] truncate">
            {service.name}
          </span>
        </div>
      </nav>

      {/* ── 2. MAIN SERVICE HERO: DESIGN C (PREMIUM GALLERY ~55% + FLOATING BOOKING PANEL ~45%) ── */}
      <section className="border-b border-[#EAD8BC] bg-gradient-to-b from-[#FFFCF6] via-[#F8F1E6]/30 to-[#FFFCF6] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-[1360px]">
          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
            {/* ══ LEFT COLUMN: PREMIUM IMAGE GALLERY (APPROX 55% / 7 COLS) ══ */}
            <div className="lg:col-span-7 space-y-3.5">
              {/* Primary Service Image Frame */}
              <div className="relative overflow-hidden rounded-[22px] border border-[#EAD8BC] bg-[#241A12] shadow-sm">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={displayThumbnails[currentSlide] || galleryImages[0] || fallbackImg}
                    alt={`${service.name} - Ceremony View ${currentSlide + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="eager"
                    onError={() =>
                      setGalleryImgErrors((prev) => ({
                        ...prev,
                        [currentSlide]: true,
                      }))
                    }
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Previous / Next Slide Controls */}
                  {totalSlides > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition hover:bg-black/85 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B77920]"
                        aria-label="Previous ceremony image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition hover:bg-black/85 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B77920]"
                        aria-label="Next ceremony image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Floating Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F1711]/85 border border-white/20 text-[10.5px] uppercase tracking-wider text-[#F5CE6F] font-semibold backdrop-blur-md shadow-xs">
                      <Sparkles size={11} className="text-[#EAB12C]" />
                      {service.homaType || "Vedic Fire Ceremony"}
                    </span>
                  </div>

                  {/* Image Counter Badge (1/3, 2/3, etc.) */}
                  <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs border border-white/10">
                    {currentSlide + 1} / {totalSlides}
                  </div>
                </div>
              </div>

              {/* Supporting Images Row (Design C) */}
              {totalSlides > 1 && (
                <div
                  className={`grid gap-3 ${totalSlides === 2 ? "grid-cols-2" : "grid-cols-3"
                    }`}
                >
                  {displayThumbnails.map((img, idx) => {
                    const isActive = currentSlide === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        className={`group relative overflow-hidden rounded-[16px] border-2 transition-all duration-300 cursor-pointer aspect-[16/10] bg-[#241A12] ${isActive
                            ? "border-[#B77920] border-[#B7791F] shadow-sm ring-2 ring-[#B77920]/25"
                            : "border-[#EAD8BC] opacity-75 hover:opacity-100 hover:border-[#B77920]/60"
                          }`}
                        aria-label={`View ceremony image ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${service.name} view ${idx + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={() =>
                            setGalleryImgErrors((prev) => ({
                              ...prev,
                              [idx]: true,
                            }))
                          }
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        {isActive && (
                          <span className="absolute bottom-1.5 left-2 rounded-full bg-[#B77920] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                            Active View
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ══ RIGHT COLUMN: CEREMONY INFORMATION & FLOATING BOOKING PANEL (APPROX 45% / 5 COLS) ══ */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              <div>
                {/* 1. Category / Specification Label */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F1E6] border border-[#EAD8BC] text-[11px] font-bold uppercase tracking-[0.2em] text-[#B77920] mb-2.5">
                  <Flame size={12} className="text-[#C77722]" />
                  <span>{service.homaType || "Vedic Fire Ceremony"}</span>
                </div>

                {/* 2. Service Title in Elegant Serif Typography */}
                <h1 className="font-serif text-[30px] sm:text-[34px] lg:text-[38px] font-bold text-[#30251C] leading-[1.2] tracking-tight mb-1.5">
                  {service.name}
                </h1>

                {/* 3. Short Spiritual Tagline (if available) */}
                {service.purpose && (
                  <p className="font-serif italic text-[13.5px] sm:text-[14px] text-[#B77920] leading-snug mb-2.5">
                    "{service.purpose}"
                  </p>
                )}

                {/* 4. Short Service Description (2-3 lines) */}
                <p className="text-[13.5px] sm:text-[14px] text-[#5C4E3F] leading-relaxed line-clamp-3 mb-4">
                  {service.description || service.shortDescription}
                </p>

                {/* 5. Kashi and Remote Availability Indicators */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAD8BC] bg-[#F8F1E6]/80 px-2.5 py-1 text-[11.5px] font-medium text-[#30251C]">
                    <CheckCircle2
                      size={13}
                      className={
                        service.kashiAvailable !== false
                          ? "text-[#2E7D32]"
                          : "text-gray-400"
                      }
                    />
                    <span>
                      Kashi Sanctum (Varanasi):{" "}
                      <strong className="font-semibold">
                        {service.kashiAvailable !== false
                          ? "Available"
                          : "Not Supported"}
                      </strong>
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAD8BC] bg-[#F8F1E6]/80 px-2.5 py-1 text-[11.5px] font-medium text-[#30251C]">
                    <CheckCircle2
                      size={13}
                      className={
                        service.remoteAvailable !== false
                          ? "text-[#2E7D32]"
                          : "text-gray-400"
                      }
                    />
                    <span>
                      Remote Live Stream:{" "}
                      <strong className="font-semibold">
                        {service.remoteAvailable !== false
                          ? "Available"
                          : "Not Supported"}
                      </strong>
                    </span>
                  </span>
                </div>

                {/* 6. Compact Ceremony Specification Panel (2x2 Grid) */}
                <div className="rounded-[20px] border border-[#EAD8BC] bg-[#F8F1E6]/60 p-4 shadow-2xs">
                  <div className="grid grid-cols-2 divide-x divide-y divide-[#EAD8BC]/60">
                    {/* Supported Havans */}
                    <div className="pr-3 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7966] block">
                        Supported Havans
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {havanCounts.map((cnt) => (
                          <span
                            key={cnt}
                            className="inline-flex items-center gap-1 rounded-md border border-[#EAD8BC] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#B77920]"
                          >
                            <Flame size={10} className="text-[#C77722]" />
                            {cnt} {cnt === 1 ? "Havan" : "Havans"}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Available Durations */}
                    <div className="pl-3 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7966] block">
                        Available Durations
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {durationDays.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center gap-1 rounded-md border border-[#EAD8BC] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#5C4E3F]"
                          >
                            <Calendar size={10} className="text-[#C77722]" />
                            {d} {d === 1 ? "Day" : "Days"}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pandit Requirements */}
                    <div className="pr-3 pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7966] block">
                        Pandit Scale
                      </span>
                      <div className="mt-1 flex items-center gap-1.5 text-[12.5px] font-bold text-[#30251C]">
                        <Users size={12} className="text-[#B77920]" />
                        <span>
                          {minPandits}–{maxPandits} Acharyas
                        </span>
                      </div>
                    </div>

                    {/* Daily Ceremony Hours */}
                    <div className="pl-3 pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7966] block">
                        Daily Ritual Hours
                      </span>
                      <div className="mt-1 flex items-center gap-1.5 text-[12.5px] font-bold text-[#30251C]">
                        <Clock size={12} className="text-[#B77920]" />
                        <span>{service.dailyHours || "3 – 4 Hours Daily"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. Floating Booking Panel (Design C) */}
                <div className="mt-5 rounded-[22px] border border-[#EAD8BC] bg-white p-5 shadow-[0_8px_24px_rgba(48,37,28,0.06)] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#8A7966] block">
                        Starting Dakshina
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-serif text-[30px] sm:text-[32px] font-bold text-[#B77920]">
                          ₹{startingPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[11.5px] text-[#766D60]">
                          (All-inclusive Shastric Vidhi)
                        </span>
                      </div>
                      <span className="mt-0.5 block text-[10.5px] text-[#A39682]">
                        * Baseline configuration. Authoritative Dakshina configured on booking.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleBookNow}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B77920] to-[#C77722] hover:brightness-105 px-7 py-3 text-[13px] font-bold uppercase tracking-wider text-white shadow-sm transition-all active:scale-98 cursor-pointer shrink-0"
                    >
                      <span>Book Homa Ceremony</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>

                  {/* 8. Small Trust Indicators */}
                  <div className="pt-3.5 border-t border-[#F2E6D5] flex flex-wrap items-center gap-3.5 text-[11.5px] text-[#766D60]">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-[#2E7D32]" />
                      Initiated Vedic Purohits & Acharyas
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-[#2E7D32]" />
                      Verified Shastric Samagri Included
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-[#2E7D32]" />
                      Gotra & Nakshatra Sankalpa Guaranteed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. PANDIT QUALIFICATIONS & AGNI SANKALPA COORDINATES ── */}
      <section className="py-14 sm:py-18 bg-[#FFFCF6] border-b border-[#EAD8BC]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Prescribed Pandit Qualifications */}
            <div className="flex flex-col justify-between bg-[#F8F1E6]/70 p-6 sm:p-8 rounded-[22px] border border-[#EAD8BC] shadow-2xs">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-[#B77920] mb-2">
                  <Users className="w-4 h-4 text-[#C77722]" />
                  <span>Prescribed Pandit Qualifications</span>
                </div>
                <h3 className="font-serif text-[22px] sm:text-[24px] text-[#30251C] font-bold mb-2">
                  Initiated Acharyas for {service.name}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-[#766D60] mb-5">
                  Fire oblations demand strict adherence to Vedic pronunciation, swara chanting, and continuous Agnihotra discipline:
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(service.requiredSkills)
                    ? service.requiredSkills
                    : [
                      "Vedic Agnihotra Specialist",
                      "Shukla Yajurveda / Rigveda Samhita Vidhi",
                      "Kashi Kshetra Initiated Scholar",
                    ]
                  ).map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-[12px] bg-white text-[#5C4E3F] px-3.5 py-2 rounded-xl border border-[#EAD8BC] font-medium shadow-2xs"
                    >
                      <Sparkles size={11} className="text-[#C77722]" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAD8BC]/70 flex items-center gap-2 text-[12px] text-[#766D60]">
                <ShieldCheck size={14} className="text-[#2E7D32] shrink-0" />
                <span>
                  All Acharyas are background-verified and initiated in hereditary Vedic Shakhas.
                </span>
              </div>
            </div>

            {/* Agni Sankalpa Coordinates */}
            <div className="flex flex-col justify-between bg-[#F8F1E6]/70 p-6 sm:p-8 rounded-[22px] border border-[#EAD8BC] shadow-2xs">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-[#B77920] mb-2">
                  <Sparkles className="w-4 h-4 text-[#C77722]" />
                  <span>Agni Sankalpa Coordinates</span>
                </div>
                <h3 className="font-serif text-[22px] sm:text-[24px] text-[#30251C] font-bold mb-2">
                  Required Devotee Information
                </h3>
                <p className="text-[13.5px] leading-relaxed text-[#766D60] mb-5">
                  The Acharya invokes the supreme deities referencing your personal cosmic coordinates during the preliminary invocation:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
                  <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-[#EAD8BC] shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-[#B77920] shrink-0" />
                    <span className="font-medium text-[#30251C]">
                      Yajamana Full Name
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-[#EAD8BC] shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-[#B77920] shrink-0" />
                    <span className="font-medium text-[#30251C]">
                      Vedic Gotra (or Kashyapa)
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-[#EAD8BC] shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-[#B77920] shrink-0" />
                    <span className="font-medium text-[#30251C]">
                      Janma Nakshatra (Star)
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-[#EAD8BC] shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-[#B77920] shrink-0" />
                    <span className="font-medium text-[#30251C]">
                      Specific Prayer Intention
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAD8BC]/70 flex items-center gap-2 text-[12px] text-[#766D60]">
                <CheckCircle2 size={14} className="text-[#B77920] shrink-0" />
                <span>
                  Up to 5 immediate family members can be linked into the primary Sankalpa.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CONSECRATED PRASAD & SACRED DISPATCH ── */}
      {service.prasad && (
        <section className="py-10 bg-[#FFFAF0] border-b border-[#EAD8BC]" id="consecrated-prasad">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-[22px] border border-[#EAD8BC] bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F8F1E6] border border-[#EAD8BC] text-[#B77920]">
                  <Gift size={24} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFFAF0] border border-[#EAD8BC] text-[10.5px] font-bold uppercase tracking-wider text-[#B77920] mb-1.5">
                    <span>Consecrated Shastric Prasad</span>
                  </div>
                  <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#30251C]">
                    Blessed Prasad &amp; Sacred Bhasma Dispatch
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#594533] max-w-3xl">
                    {service.prasad}
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2 rounded-xl border border-[#C1E2C6] bg-[#EAF5EA] px-3.5 py-2 text-[12px] font-semibold text-[#2B7A35]">
                <ShieldCheck size={16} />
                <span>Dispatched Post-Purnahuti</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. SACRED SAMAGRI & INCLUSIONS ── */}
      {/* Sacred Samagri Specifications Section */}
      <HomaSamagriSection service={service} />

      {/* ── 5. CEREMONY FREQUENTLY ASKED QUESTIONS ── */}
      {serviceFaqs.length > 0 && (
        <section className="py-14 sm:py-18 bg-[#FFFCF6] border-b border-[#EAD8BC]" id="ceremony-faqs">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B77920] block mb-2">
                CEREMONY QUESTIONS &amp; ANSWERS
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#30251C] font-bold">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-[#735F4C] mt-2 leading-relaxed">
                Authoritative Shastric guidance on {service.name}, ritual vidhi, and participation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {serviceFaqs.map((faq, idx) => {
                const qText = faq.question || faq.q || "";
                const aText = faq.answer || faq.a || "";
                const isOpen = openFaqIndex === idx;

                return (
                  <div
                    key={idx}
                    className="rounded-[18px] border border-[#EAD8BC] bg-[#FFFDF9] overflow-hidden transition-all shadow-2xs hover:border-[#B77920]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer gap-3"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif text-[15px] sm:text-[16px] font-bold text-[#30251C] leading-snug">
                        {qText}
                      </span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F8F1E6] text-[#B77920]">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-[13.5px] leading-relaxed text-[#594533] border-t border-[#F2E8D8] pt-3">
                        {aText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. RELATED HOMA CEREMONIES ── */}
      {relatedHomas.length > 0 && (
        <section className="py-14 sm:py-18 bg-[#F8F1E6]/50 border-b border-[#EAD8BC]">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[10.5px] uppercase tracking-widest text-[#B77920] font-bold">
                RELATED TRADITIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#30251C] mt-1 font-bold">
                Other Sacred Homa Ceremonies
              </h2>
              <p className="mt-2 text-[13.5px] text-[#766D60]">
                Explore related canonical Vedic fire rituals consecrated in the sacred fire tradition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedHomas.map((rel) => (
                <HomaServiceCard
                  key={rel.id || rel.slug}
                  service={rel}
                  mode="related"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. MOBILE STICKY BOTTOM BOOKING BAR ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#EAD8BC] bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-[#766D60]">
              Starting Dakshina
            </span>
            <span className="font-serif text-[19px] font-bold text-[#B77920]">
              ₹{startingPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <button
            type="button"
            onClick={handleBookNow}
            className="flex-1 max-w-[220px] rounded-xl bg-gradient-to-r from-[#B77920] to-[#C77722] py-2.5 text-center text-[12.5px] font-bold uppercase tracking-wider text-white shadow-md hover:brightness-105 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Book Ceremony</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
