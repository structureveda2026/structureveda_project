import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Calendar,
  Users,
  BookOpen,
  Package,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { PATH_CATALOGUE_LIST } from "../data/pathCatalogueData";
import pathCatalogueService, {
  mapApiPathServiceDetailToUi,
} from "../services/pathCatalogueService";
import PathServiceCard from "../components/PathServiceCard";

const formatBadge = (fmt) => {
  if (fmt === "single_session") return "Single Session";
  if (fmt === "same_day") return "Same-Day Extended";
  if (fmt === "multi_day") return "Multi-Day Anushthan";
  if (fmt === "custom_request") return "Custom Schedule";
  return fmt;
};

const PathServiceDetails = () => {
  const { slug } = useParams();

  // Find local static initial fallback
  const staticFallback =
    PATH_CATALOGUE_LIST.find((p) => p.slug === slug) || PATH_CATALOGUE_LIST[0];

  const [service, setService] = useState(
    staticFallback ? mapApiPathServiceDetailToUi(staticFallback) : null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedFormatIndex, setSelectedFormatIndex] = useState(0);

  // Fetch authoritative service from backend API
  useEffect(() => {
    let isCancelled = false;
    window.scrollTo({ top: 0, behavior: "smooth" });

    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      setCurrentSlide(0);
      setSelectedFormatIndex(0);

      pathCatalogueService
        .getPathServiceBySlug(slug)
        .then((data) => {
          if (!isCancelled) {
            if (data) {
              setService(data);
              if (data.name) {
                document.title = `${data.name} | Vedic Path & Recitation | Veda Structure`;
              }
            } else {
              // Check static fallback
              const local = PATH_CATALOGUE_LIST.find((p) => p.slug === slug);
              if (local) {
                const mapped = mapApiPathServiceDetailToUi(local);
                setService(mapped);
                document.title = `${mapped.name} | Vedic Path & Recitation | Veda Structure`;
              } else {
                setError("The requested Vedic Path service was not found.");
              }
            }
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.warn("Path detail API failed, checking local static data:", err?.message || err);
            const local = PATH_CATALOGUE_LIST.find((p) => p.slug === slug);
            if (local) {
              const mapped = mapApiPathServiceDetailToUi(local);
              setService(mapped);
              document.title = `${mapped.name} | Vedic Path & Recitation | Veda Structure`;
            } else {
              setError("Unable to load Path details. Please check your connection.");
            }
            setLoading(false);
          }
        });
    }, 0);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [slug]);

  if (loading && !service) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#faf4e6] p-6 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722] animate-spin">
            <RefreshCw size={24} />
          </div>
          <h3 className="font-serif text-[20px] font-semibold text-[#2b241d]">
            Loading Sacred Recitation...
          </h3>
          <p className="text-[13.5px] text-[#75695c]">
            Fetching authoritative Path parameters from the Vedic registry.
          </p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#faf4e6] p-6 text-center">
        <div className="max-w-[460px] rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle size={24} />
          </div>
          <h2 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
            Scripture Recitation Not Found
          </h2>
          <p className="mt-2 text-[14px] text-[#685c4f]">
            {error || "The requested Path service could not be located."}
          </p>
          <div className="mt-6">
            <Link
              to="/yagya-puja/path"
              className="rounded-full bg-[#b56e20] px-6 py-2.5 text-[13px] font-bold text-white shadow-sm hover:bg-[#8f5211]"
            >
              Back to Path Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const galleryImages =
    Array.isArray(service.gallery) && service.gallery.length > 0
      ? service.gallery
      : Array.isArray(service.galleryImages) && service.galleryImages.length > 0
      ? service.galleryImages
      : [service.image || service.bannerImage];

  const relatedPaths = PATH_CATALOGUE_LIST.filter(
    (p) => p.slug !== service.slug
  ).slice(0, 3).map(mapApiPathServiceDetailToUi);

  return (
    <div className="min-h-screen bg-[#faf4e6] text-[#2b241d]">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-3.5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 text-[12.5px] text-[#78644e]">
          <Link to="/" className="hover:text-[#a8641b]">Home</Link>
          <span>/</span>
          <Link to="/yagya-puja" className="hover:text-[#a8641b]">Yagya & Puja</Link>
          <span>/</span>
          <Link to="/yagya-puja/path" className="hover:text-[#a8641b]">Path</Link>
          <span>/</span>
          <span className="font-semibold text-[#2b241d]">{service.name}</span>
        </div>
      </div>

      {/* Main Detail Header Section */}
      <section className="border-b border-[#ebdcc4] bg-[#fffdf9] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Gallery Column */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-[26px] border border-[#d6b78d] bg-[#22170f] shadow-[0_12px_36px_rgba(60,40,20,0.12)]">
                <div className="relative h-[360px] w-full sm:h-[420px]">
                  <img
                    src={galleryImages[currentSlide]}
                    alt={service.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Slider controls if multiple images */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentSlide((prev) =>
                            prev === 0 ? galleryImages.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80 cursor-pointer"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentSlide((prev) =>
                            prev === galleryImages.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80 cursor-pointer"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {galleryImages.length > 1 && (
                  <div className="flex gap-2.5 bg-[#1b120a] p-3">
                    {galleryImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentSlide(i)}
                        className={`relative h-16 w-20 overflow-hidden rounded-lg border-2 transition cursor-pointer ${
                          currentSlide === i
                            ? "border-[#e09e38]"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Service Summary Column */}
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                {/* Eyebrow & Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#d8b584] bg-[#fbf3e4] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8e5a1e]">
                    {service.pathType}
                  </span>
                  {service.isKashiAvailable && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f4e4cd] px-3 py-1 text-[11px] font-bold text-[#8a571c]">
                      <MapPin size={11} />
                      Kashi Kshetra
                    </span>
                  )}
                  {service.isRemoteAvailable && (
                    <span className="rounded-full bg-[#eee5d8] px-3 py-1 text-[11px] font-bold text-[#685c4f]">
                      Remote Available
                    </span>
                  )}
                </div>

                <h1 className="mt-4 font-serif text-[32px] font-bold leading-tight text-[#2b241d] sm:text-[40px]">
                  {service.name}
                </h1>

                {/* Scripture Source Box */}
                <div className="mt-3 rounded-xl border border-[#ebd6be] bg-[#faf3e5] px-4 py-2.5">
                  <span className="block text-[10.5px] font-bold uppercase tracking-widest text-[#8a571c]">
                    SACRED SCRIPTURE / GRANTH
                  </span>
                  <p className="font-serif text-[16px] font-semibold text-[#553b1e]">
                    {service.scripture}
                  </p>
                </div>

                <p className="mt-4 text-[14.5px] leading-relaxed text-[#5c4e3f]">
                  {service.description}
                </p>

                {/* Chapter Structure & Duration */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2 text-[12.5px] text-[#6d5c4a]">
                  <div className="flex items-center gap-2 rounded-lg bg-[#fbf5eb] p-2.5">
                    <BookOpen size={16} className="text-[#c77722]" />
                    <span><strong>Structure:</strong> {service.chapterStructure}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-[#fbf5eb] p-2.5">
                    <Clock size={16} className="text-[#c77722]" />
                    <span><strong>Duration:</strong> {service.estimatedRecitationHours} Est.</span>
                  </div>
                </div>

                {/* Purpose Note */}
                <div className="mt-4 flex items-center gap-2 text-[13px] text-[#7d674b]">
                  <Sparkles size={14} className="text-[#c77722]" />
                  <span>Traditional Context: <strong>{service.purpose}</strong></span>
                </div>
              </div>

              {/* Price & Action Strip */}
              <div className="mt-8 rounded-2xl border border-[#e4d1b8] bg-[#fbf5eb] p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a725b]">
                      Starting From
                    </span>
                    <div className="font-serif text-[28px] font-bold text-[#2b241d]">
                      ₹{service.startingPrice?.toLocaleString("en-IN")}
                    </div>
                    <span className="text-[11px] text-[#8c7a68]">
                      Includes Sankalpa and designated priest team
                    </span>
                  </div>

                  <Link
                    to={`/yagya-puja/path/${service.slug}/book`}
                    state={{ service }}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b56e20] to-[#cb832c] px-7 py-3 text-[14px] font-bold text-white shadow-md hover:brightness-105 transition cursor-pointer"
                  >
                    <span>Book Now / Configure</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recitation Formats Section for this Specific Service */}
      <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
              SERVICE SPECIFIC FORMATS
            </span>
            <h2 className="mt-2 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[34px]">
              Available Formats for {service.name}
            </h2>
            <p className="mx-auto mt-2 max-w-[620px] text-[14px] text-[#685c4f]">
              Choose from the traditional recitation formats supported for this specific scripture.
            </p>
          </div>

          {/* Formats Grid */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(service.availableFormats || []).map((fmt, idx) => {
              const isSelected = selectedFormatIndex === idx;

              return (
                <div
                  key={fmt}
                  onClick={() => setSelectedFormatIndex(idx)}
                  className={`relative flex cursor-pointer flex-col justify-between rounded-[22px] border p-6 transition-all duration-300 ${
                    isSelected
                      ? "border-[#c77722] bg-white shadow-[0_10px_30px_rgba(199,119,34,0.15)] ring-2 ring-[#c77722]"
                      : "border-[#e6d3ba] bg-[#fffaf1] hover:border-[#c77722] hover:bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-[#8a571c]">
                        <Calendar size={12} className="text-[#c77722]" />
                        Format {idx + 1}
                      </span>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c77722] text-white">
                          <CheckCircle2 size={13} />
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-serif text-[21px] font-bold text-[#2b241d]">
                      {formatBadge(fmt)}
                    </h3>

                    <div className="mt-4 space-y-2 border-t border-[#f0e1cb] pt-3 text-[12.5px] text-[#6d5b4a]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#c77722]" /> Duration:
                        </span>
                        <span className="font-semibold text-[#2b241d]">
                          {service.availableDurations?.[idx] || `${service.estimatedRecitationHours}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-[#c77722]" /> Pandit Squad:
                        </span>
                        <span className="font-semibold text-[#2b241d]">
                          {service.minimumPandits} – {service.recommendedPandits} Scholars
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#f0e1cb]">
                    <span className={`block text-center text-[12px] font-bold ${isSelected ? "text-[#c77722]" : "text-[#8a725b]"}`}>
                      {isSelected ? "Selected Format" : "Click to Select"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to={`/yagya-puja/path/${service.slug}/book`}
              state={{ service, selectedFormat: service.availableFormats?.[selectedFormatIndex] }}
              className="inline-flex items-center gap-2 rounded-full bg-[#2b241d] px-8 py-3 text-[13.5px] font-bold text-[#f7ecd5] shadow-md hover:bg-[#3d3228] transition"
            >
              <span>Continue with Selected Format</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Samagri & Inclusions Section */}
      {service.samagri && service.samagri.length > 0 && (
        <section className="border-b border-[#ebdcc4] bg-[#fffdf9] px-5 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <h3 className="font-serif text-[24px] font-bold text-[#2b241d]">
              Ritual Inclusions & Samagri
            </h3>
            <p className="mt-1 text-[13.5px] text-[#6d5c4b]">
              Tailored materials specifically prescribed for {service.name}.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {service.samagri.map((item, idx) => {
                const itemName = typeof item === "string" ? item : item?.name || "Samagri Item";
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#e2cca8] bg-[#faf2e3] px-3.5 py-2 text-[13px] font-semibold text-[#5c421f]"
                  >
                    <Package size={14} className="text-[#b36c1e]" />
                    {itemName}
                  </span>
                );
              })}
            </div>

            {service.prasad && (
              <div className="mt-6 rounded-2xl border border-[#ebd8c1] bg-[#faf5ec] p-4 text-[13px] text-[#6b5845]">
                <strong>Prasad Provision:</strong> {service.prasad}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Related Path Services */}
      <section className="px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-[26px] font-bold text-[#2b241d]">
              Explore Other Scripture Recitations
            </h3>
            <Link
              to="/yagya-puja/path"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#a8641b] hover:underline"
            >
              <span>All Path Services</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPaths.map((rel) => (
              <PathServiceCard key={rel.id || rel.slug} service={rel} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PathServiceDetails;
