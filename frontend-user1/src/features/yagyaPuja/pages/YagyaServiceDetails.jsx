import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Flame,
} from "lucide-react";
import yagyaCatalogueService, {
  getYagyaFallbackImage,
} from "../../../services/yagyaCatalogueService";
import YagyaServiceCard from "../components/YagyaServiceCard";

export default function YagyaServiceDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);

  // Active duration configuration state for interactive preview
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Load Yagya detail from backend
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const data = await yagyaCatalogueService.getYagyaServiceBySlug(slug);
        if (!isMounted) return;

        if (!data) {
          setError("Yagya ceremony not found.");
          return;
        }

        setService(data);
        setError(null);
        if (Array.isArray(data.availableDurations) && data.availableDurations.length > 0) {
          setSelectedDuration(data.availableDurations[0]);
        }

        // Load related Yagyas
        try {
          const listRes = await yagyaCatalogueService.getYagyaServices({ limit: 4 });
          if (isMounted && listRes && listRes.services) {
            setRelatedServices(listRes.services.filter((s) => s.slug !== slug).slice(0, 3));
          }
        } catch {
          // Non-critical
        }
      } catch (err) {
        console.error("Failed to load yagya details:", err);
        if (isMounted) setError("Failed to load Yagya ceremony details. Please check connection.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Set SEO Title
  useEffect(() => {
    if (service?.name) {
      document.title = `${service.name} in Kashi | Multi-Day Vedic Yagya | Veda Structure`;
    }
  }, [service]);

  const handleBookNow = () => {
    if (service?.slug) {
      navigate(`/yagya-puja/yagya/${service.slug}/book`, {
        state: { service },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fffaf0] p-6 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-3 border-[#c77722] border-t-transparent" />
        <p className="mt-4 font-serif text-[18px] text-[#5c4d3c]">Loading Sacred Yagya Ceremony...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fffaf0] p-6 text-center">
        <div className="max-w-[480px] rounded-2xl border border-[#ebd8bc] bg-white p-8 shadow-sm">
          <Flame size={36} className="mx-auto text-[#c77722]" />
          <h2 className="mt-3 font-serif text-[24px] font-bold text-[#2b241d]">Sacred Yagya Not Found</h2>
          <p className="mt-2 text-[14px] text-[#75695c]">{error || "The requested Yagya ceremony could not be loaded."}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/yagya-puja/yagya"
              className="rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#1c1308] hover:bg-[#dda018]"
            >
              Browse All Yagyas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fallbackImg = getYagyaFallbackImage(service.slug);
  const images = Array.isArray(service.images) && service.images.length > 0 ? service.images : [fallbackImg];
  const activeImage = images[activeImageIndex] || fallbackImg;

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#2b241d]">
      {/* 1. BREADCRUMBS & TOP NAV */}
      <div className="border-b border-[#ead8b8] bg-[#fffdfa] px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1360px] items-center gap-2 text-[12px] font-medium text-[#75695c]">
          <Link to="/" className="hover:text-[#c77722]">
            Home
          </Link>
          <ChevronRight size={13} className="text-[#c5b59f]" />
          <Link to="/yagya-puja" className="hover:text-[#c77722]">
            Yagya & Puja
          </Link>
          <ChevronRight size={13} className="text-[#c5b59f]" />
          <Link to="/yagya-puja/yagya" className="hover:text-[#c77722]">
            Vedic Yagya
          </Link>
          <ChevronRight size={13} className="text-[#c5b59f]" />
          <span className="truncate font-semibold text-[#2b241d]">{service.name}</span>
        </div>
      </div>

      {/* 2. HERO / SHOWCASE SECTION */}
      <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#fffaf0] to-[#fffdfa] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1360px]">
          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
            
            {/* LEFT: GALLERY */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-[24px] border border-[#ebd8bc] bg-[#241a12] shadow-md">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={activeImage}
                    alt={service.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md">
                      <Sparkles size={11} className="text-[#eab12c]" />
                      Multi-Day Yagya
                    </span>
                  </div>

                  {/* Kashi Tag */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[12px] font-medium text-[#f0e3ce] backdrop-blur-xs">
                    <MapPin size={13} className="text-[#eab12c]" />
                    <span>{service.location || "Kashi (Varanasi)"}</span>
                  </div>
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="flex gap-2.5 p-3.5 bg-[#fbf6ec] border-t border-[#ebd8bc] overflow-x-auto">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                          activeImageIndex === idx ? "border-[#c77722] shadow-xs" : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt={`view-${idx}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: OVERVIEW & BOOKING PANEL */}
            <div className="lg:col-span-6 space-y-6">
              {/* Eyebrow */}
              {service.eyebrow && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d4872b]/35 bg-[#fdf5e6] px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                  <Sparkles size={11} className="text-[#c77722]" />
                  {service.eyebrow}
                </div>
              )}

              {/* Title & Tagline */}
              <div>
                <h1 className="font-serif text-[30px] font-bold leading-tight text-[#2b241d] sm:text-[38px] lg:text-[42px]">
                  {service.name}
                </h1>
                {service.tagline && (
                  <p className="mt-2 font-serif text-[15px] italic text-[#9d5b12] sm:text-[16.5px]">
                    &ldquo;{service.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Short Description */}
              <p className="text-[14.5px] leading-relaxed text-[#5c4d3c] sm:text-[15.5px]">
                {service.shortDescription}
              </p>

              {/* Multi-Day Duration Selection Preview */}
              {Array.isArray(service.availableDurations) && service.availableDurations.length > 0 && (
                <div className="rounded-2xl border border-[#e8d5b8] bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between text-[13px] font-bold text-[#4a3e30]">
                    <span className="flex items-center gap-2">
                      <Calendar size={15} className="text-[#c77722]" />
                      Multi-Day Duration Options:
                    </span>
                    <span className="text-[12px] font-medium text-[#8c6d48]">
                      {service.dailyHoursDisplay || "5 Hours / Day"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {service.availableDurations.map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setSelectedDuration(days)}
                        className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-[13px] font-bold transition ${
                          selectedDuration === days
                            ? "border-[#c77722] bg-[#fdf5e6] text-[#b36c1e] shadow-2xs"
                            : "border-[#e3d0b3] bg-[#fffdfa] text-[#5c4d3c] hover:border-[#c77722]"
                        }`}
                      >
                        <Calendar size={13} />
                        <span>{days} Days Anushthan</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pandit Team Requirements Card */}
              {service.panditRequirement && (
                <div className="rounded-2xl border border-[#e8d5b8] bg-[#fbf6ec] p-4.5">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#4a3e30]">
                    <Users size={15} className="text-[#c77722]" />
                    <span>Conducted by Qualified Vedic Purohit Team</span>
                  </div>
                  <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-[12px]">
                    <div className="rounded-xl border border-[#ebd8bc] bg-white p-2">
                      <span className="text-[10px] uppercase font-bold text-[#8c6d48] block">Min Acharyas</span>
                      <span className="text-[15px] font-bold text-[#2b241d]">
                        {service.panditRequirement.minimumPandits || 3}
                      </span>
                    </div>
                    <div className="rounded-xl border border-[#ebd8bc] bg-[#fdf7ee] p-2">
                      <span className="text-[10px] uppercase font-bold text-[#b36c1e] block">Recommended</span>
                      <span className="text-[15px] font-bold text-[#b36c1e]">
                        {service.panditRequirement.recommendedPandits || 5}
                      </span>
                    </div>
                    <div className="rounded-xl border border-[#ebd8bc] bg-white p-2">
                      <span className="text-[10px] uppercase font-bold text-[#8c6d48] block">Max Acharyas</span>
                      <span className="text-[15px] font-bold text-[#2b241d]">
                        {service.panditRequirement.maximumPandits || 11}
                      </span>
                    </div>
                  </div>
                  {service.panditRequirement.skillRequirements && (
                    <p className="mt-2.5 text-[11.5px] italic text-[#705e4b]">
                      * {service.panditRequirement.skillRequirements}
                    </p>
                  )}
                </div>
              )}

              {/* Pricing & CTA Action */}
              <div className="rounded-2xl border border-[#deb779] bg-gradient-to-br from-[#fffefc] to-[#fbf5e8] p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c6d48]">
                      Starting Dakshina
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-[28px] font-bold text-[#2b241d]">
                        {service.formattedPrice}
                      </span>
                      <span className="text-[12px] text-[#705e4b]">
                        ({selectedDuration || service.availableDurations?.[0] || 3} Days Ceremony)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBookNow}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_8px_20px_rgba(234,177,44,0.3)] transition-all hover:brightness-105 active:scale-98"
                  >
                    <span>Book This Yagya</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="mt-3.5 flex flex-wrap items-center gap-4 text-[12px] text-[#705e4b] border-t border-[#ebd8bc] pt-3">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#3b8a45]" />
                    In-Person (Kashi) or Remote Gotra Sankalpa
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#3b8a45]" />
                    Pure Desi Cow Ghee & Sacred Ahutis
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT THE YAGYA & SIGNIFICANCE */}
      <section className="border-b border-[#ead8b8] bg-[#fffdfa] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
                <Sparkles size={13} className="text-[#c77722]" />
                <span>SACRED SHASTRA OVERVIEW</span>
              </div>

              <h2 className="font-serif text-[28px] font-bold text-[#2b241d] sm:text-[34px]">
                About the {service.name}
              </h2>

              <div className="flex items-center gap-2">
                <span className="h-[2px] w-12 rounded-full bg-[#d4872b]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
              </div>

              <p className="text-[15px] leading-relaxed text-[#5c4d3c] whitespace-pre-line">
                {service.fullDescription || service.description || service.shortDescription}
              </p>

              {/* Significance Points */}
              {Array.isArray(service.significance) && service.significance.length > 0 && (
                <div className="mt-6 space-y-2.5">
                  <h3 className="font-serif text-[18px] font-bold text-[#2b241d]">
                    Spiritual Significance
                  </h3>
                  <ul className="space-y-2">
                    {service.significance.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[#5c4d3c]">
                        <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#c77722]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Inclusions & Samagri Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#ebd8bc] bg-[#fffaf0] p-6 shadow-xs space-y-5">
                <h3 className="font-serif text-[20px] font-bold text-[#2b241d] flex items-center gap-2">
                  <Flame size={18} className="text-[#c77722]" />
                  <span>Sacred Samagri & Ahutis</span>
                </h3>

                {Array.isArray(service.samagri) && service.samagri.length > 0 ? (
                  <div className="space-y-2.5">
                    {service.samagri.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-[#ebd8bc] bg-white px-3.5 py-2.5 text-[13px]"
                      >
                        <span className="font-medium text-[#3b3024]">{item.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${
                            item.status === "included"
                              ? "bg-[#e8f5e9] text-[#2e7d32]"
                              : item.status === "optional"
                              ? "bg-[#fff3e0] text-[#e65100]"
                              : "bg-[#e3f2fd] text-[#1565c0]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-[#705e4b]">All authentic Shastric samagri included.</p>
                )}

                {/* Prasad Description */}
                {service.prasad && (
                  <div className="rounded-xl border border-[#e8d5b8] bg-[#fbf6ec] p-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e] block">
                      Consecrated Prasad Pack
                    </span>
                    <p className="mt-1 text-[12.5px] text-[#5c4d3c]">{service.prasad}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DAILY TIMELINE / MULTI-DAY SCHEDULE */}
      {Array.isArray(service.dailySchedule) && service.dailySchedule.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#fbf6ec] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="text-center mb-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                SYSTEMATIC ANUSHTHAN
              </span>
              <h2 className="mt-2 font-serif text-[28px] font-bold text-[#2b241d] sm:text-[34px]">
                Multi-Day Daily Schedule & Progression
              </h2>
              <p className="mt-2 text-[14.5px] text-[#705e4b]">
                Conducted systematically across 5 hours each day by our certified Purohit Mandal.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.dailySchedule.map((sched, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#ebd8bc] bg-white p-5 shadow-2xs hover:border-[#c77722] transition"
                >
                  <span className="font-serif text-[24px] font-bold text-[#c77722]">
                    {typeof sched.day === "number" ? `Day 0${sched.day}` : sched.day}
                  </span>
                  <h3 className="mt-1 font-serif text-[16px] font-bold text-[#2b241d]">
                    {sched.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#5c4d3c]">
                    {sched.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. SACRED PROCEDURE & STEPS */}
      {Array.isArray(service.procedureSteps) && service.procedureSteps.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#fffdfa] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-[1240px]">
            <div className="text-center mb-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                AUTHENTIC VIDHI
              </span>
              <h2 className="mt-2 font-serif text-[28px] font-bold text-[#2b241d] sm:text-[34px]">
                Step-by-Step Sacred Procedure
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {service.procedureSteps.map((stepItem, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#ebd8bc] bg-[#fffaf0] p-5 shadow-2xs hover:shadow-xs transition"
                >
                  <span className="font-serif text-[26px] font-bold text-[#d4872b]/70">
                    {stepItem.step}
                  </span>
                  <h3 className="mt-1.5 font-serif text-[16px] font-bold text-[#2b241d]">
                    {stepItem.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#685c4f]">
                    {stepItem.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. FAQS ACCORDION */}
      {Array.isArray(service.faqs) && service.faqs.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#fbf6ec] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-[800px]">
            <div className="text-center mb-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="mt-2 font-serif text-[26px] font-bold text-[#2b241d] sm:text-[32px]">
                Questions About {service.name}
              </h2>
            </div>

            <div className="space-y-3">
              {service.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl border border-[#ebd8bc] bg-white transition shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? -1 : idx)}
                    className="flex w-full items-center justify-between p-4 text-left font-serif text-[15.5px] font-bold text-[#2b241d] hover:bg-[#fffdfa]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={17}
                      className={`text-[#c77722] transition-transform ${
                        activeFaqIndex === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeFaqIndex === idx && (
                    <div className="border-t border-[#f4e8d3] p-4 text-[13.5px] leading-relaxed text-[#5c4d3c] bg-[#fffaf0]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. EXPLORE RELATED YAGYAS */}
      {relatedServices.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#fffdfa] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-[1360px]">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                  SACRED CEREMONIES
                </span>
                <h2 className="mt-1 font-serif text-[24px] font-bold text-[#2b241d] sm:text-[28px]">
                  Explore Other Vedic Yagyas
                </h2>
              </div>
              <Link to="/yagya-puja/yagya" className="text-[13px] font-bold text-[#c77722] hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((item) => (
                <YagyaServiceCard key={item.id} service={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. FINAL SANKALP CTA BANNER */}
      <section className="bg-gradient-to-b from-[#fffaf0] via-[#fbf3e4] to-[#f7ebd4] px-4 py-16 text-center sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[700px] space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4872b]/30 bg-white/80 px-3.5 py-1 backdrop-blur-xs">
            <Sparkles size={13} className="text-[#c77722]" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              SANATAN TRADITION
            </span>
          </div>

          <h2 className="font-serif text-[32px] font-bold leading-tight text-[#2b241d] sm:text-[40px]">
            Begin Your Sacred Yagya Sankalp
          </h2>

          <p className="text-[15px] leading-relaxed text-[#685c4f]">
            Arrange the sacred {service.name} performed with traditional Vedic authenticity, pure cow ghee ahutis, and dedicated purohits in Kashi.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleBookNow}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-9 py-4 text-[14.5px] font-bold text-[#1c1308] shadow-[0_10px_28px_rgba(234,177,44,0.3)] transition-all hover:brightness-105"
            >
              <span>Book This Yagya</span>
              <ArrowRight size={17} />
            </button>

            <Link
              to="/yagya-puja/yagya"
              className="inline-flex items-center gap-2 rounded-full border border-[#d6b8a0] bg-white px-7 py-3.5 text-[14px] font-bold text-[#2b241d] shadow-2xs hover:border-[#d4872b] hover:bg-[#fffaf0]"
            >
              Explore All Yagyas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
