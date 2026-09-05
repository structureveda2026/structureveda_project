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
  Hash,
  Package,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Info,
} from "lucide-react";
import { JAPA_CATALOGUE_LIST } from "../data/japaCatalogueData";
import JapaServiceCard from "../components/JapaServiceCard";

const formatCount = (count) => {
  if (count >= 100000) return `${(count / 100000).toLocaleString("en-IN")} Lakh`;
  if (count >= 1000) return `${(count / 1000).toLocaleString("en-IN")}K`;
  return count.toLocaleString("en-IN");
};

const JapaServiceDetails = () => {
  const { slug } = useParams();
  const service =
    JAPA_CATALOGUE_LIST.find((j) => j.slug === slug) || JAPA_CATALOGUE_LIST[0];

  // Gallery slider
  const galleryImages =
    Array.isArray(service.gallery) && service.gallery.length > 0
      ? service.gallery
      : [service.image];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentSlide(0);
    setSelectedVariantIndex(0);
    if (service?.name) {
      document.title = `${service.name} | Vedic Mantra Japa | Veda Structure`;
    }
  }, [slug, service]);

  const selectedVariant =
    service.variants && service.variants[selectedVariantIndex]
      ? service.variants[selectedVariantIndex]
      : {
          count: service.availableCounts?.[0] || 11000,
          label: `${formatCount(service.availableCounts?.[0] || 11000)} Japa`,
          startingPrice: service.startingPrice,
          estimatedDuration: service.completionWindow || "3-4 Days",
          minimumPandits: service.minimumPandits,
          recommendedPandits: service.recommendedPandits,
        };

  const relatedJapas = JAPA_CATALOGUE_LIST.filter(
    (j) => j.slug !== service.slug
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#faf4e6] text-[#2b241d]">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-3.5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 text-[12.5px] text-[#78644e]">
          <Link to="/" className="hover:text-[#a8641b]">Home</Link>
          <span>/</span>
          <Link to="/yagya-puja" className="hover:text-[#a8641b]">Yagya & Puja</Link>
          <span>/</span>
          <Link to="/yagya-puja/japa" className="hover:text-[#a8641b]">Japa</Link>
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
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80"
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80"
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
                        className={`relative h-16 w-20 overflow-hidden rounded-lg border-2 transition ${
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
                    VEDIC JAPA SERVICE
                  </span>
                  {service.kashiAvailable && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f4e4cd] px-3 py-1 text-[11px] font-bold text-[#8a571c]">
                      <MapPin size={11} />
                      Kashi Kshetra
                    </span>
                  )}
                  {service.remoteAvailable && (
                    <span className="rounded-full bg-[#eee5d8] px-3 py-1 text-[11px] font-bold text-[#685c4f]">
                      Remote Available
                    </span>
                  )}
                </div>

                <h1 className="mt-4 font-serif text-[32px] font-bold leading-tight text-[#2b241d] sm:text-[40px]">
                  {service.name}
                </h1>

                {/* Mantra Display Box */}
                {service.mantra && (
                  <div className="mt-4 rounded-2xl border border-[#ebd6be] bg-[#faf3e5] p-4">
                    <span className="block text-[10.5px] font-bold uppercase tracking-widest text-[#8a571c]">
                      VEDIC MANTRA TEXT
                    </span>
                    <p className="mt-1 font-serif text-[16.5px] font-medium leading-relaxed text-[#553b1e]">
                      {service.mantra}
                    </p>
                    {service.mantraMeaning && (
                      <p className="mt-2 text-[12.5px] italic text-[#735d46]">
                        {service.mantraMeaning}
                      </p>
                    )}
                  </div>
                )}

                <p className="mt-4 text-[14.5px] leading-relaxed text-[#5c4e3f]">
                  {service.description}
                </p>

                {/* Purpose Note */}
                <div className="mt-4 flex items-center gap-2 text-[13px] text-[#7d674b]">
                  <Sparkles size={14} className="text-[#c77722]" />
                  <span>
                    Traditional Context: <strong>{service.purpose}</strong>
                  </span>
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
                    to="/book-consultation"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b56e20] to-[#cb832c] px-6 py-3 text-[13.5px] font-bold text-white shadow-md hover:brightness-105"
                  >
                    <span>Talk to a Vedic Scholar</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configurable Count Selector for this Specific Service */}
      <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
              SERVICE SPECIFIC RECITATIONS
            </span>
            <h2 className="mt-2 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[34px]">
              Prescribed Counts for {service.name}
            </h2>
            <p className="mx-auto mt-2 max-w-[620px] text-[14px] text-[#685c4f]">
              Select from the classical Anushthan counts traditionally approved for this specific Mantra.
            </p>
          </div>

          {/* Variants Grid */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(service.variants || []).map((v, idx) => {
              const isSelected = selectedVariantIndex === idx;

              return (
                <div
                  key={v.count}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`relative flex cursor-pointer flex-col justify-between rounded-[22px] border p-6 transition-all duration-300 ${
                    isSelected
                      ? "border-[#c77722] bg-white shadow-[0_10px_30px_rgba(199,119,34,0.15)] ring-2 ring-[#c77722]"
                      : "border-[#e6d3ba] bg-[#fffaf1] hover:border-[#c77722] hover:bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-[#8a571c]">
                        <Hash size={12} className="text-[#c77722]" />
                        Variant {idx + 1}
                      </span>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c77722] text-white">
                          <CheckCircle2 size={13} />
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-serif text-[22px] font-bold text-[#2b241d]">
                      {v.label || `${formatCount(v.count)} Japa`}
                    </h3>

                    <div className="mt-4 space-y-2 border-t border-[#f0e1cb] pt-3 text-[12.5px] text-[#6d5b4a]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#c77722]" /> Duration:
                        </span>
                        <span className="font-semibold text-[#2b241d]">{v.estimatedDuration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-[#c77722]" /> Team:
                        </span>
                        <span className="font-semibold text-[#2b241d]">{v.minimumPandits} – {v.recommendedPandits} Priests</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 font-bold text-[#2b241d]">
                        <span>Starting Price:</span>
                        <span className="text-[#a8641b]">₹{v.startingPrice?.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#f0e1cb]">
                    <span className={`block text-center text-[12px] font-bold ${isSelected ? "text-[#c77722]" : "text-[#8a725b]"}`}>
                      {isSelected ? "Selected Configuration" : "Click to Select"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Plan Summary Banner */}
          <div className="mx-auto mt-10 max-w-[800px] rounded-[24px] border border-[#d8c3a1] bg-[#fffdfa] p-6 shadow-xs">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="rounded-full bg-[#faedd9] px-3 py-0.5 text-[10.5px] font-bold uppercase text-[#8a571c]">
                  Active Selection Preview
                </span>
                <h4 className="mt-1 font-serif text-[20px] font-bold text-[#2b241d]">
                  {selectedVariant.label} Plan
                </h4>
                <p className="text-[12.5px] text-[#786959]">
                  {selectedVariant.estimatedDuration} • {selectedVariant.minimumPandits}–{selectedVariant.recommendedPandits} Vedic Priests
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="block text-[10.5px] font-bold uppercase text-[#8a725b]">Starting At</span>
                  <span className="font-serif text-[22px] font-bold text-[#2b241d]">
                    ₹{selectedVariant.startingPrice?.toLocaleString("en-IN")}
                  </span>
                </div>
                <Link
                  to="/book-consultation"
                  className="rounded-full bg-[#2b241d] px-5 py-2.5 text-[13px] font-bold text-[#f7ecd5] hover:bg-[#a8641b] hover:text-white"
                >
                  Consult Acharya
                </Link>
              </div>
            </div>
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
              {service.samagri.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#e2cca8] bg-[#faf2e3] px-3.5 py-2 text-[13px] font-semibold text-[#5c421f]"
                >
                  <Package size={14} className="text-[#b36c1e]" />
                  {item}
                </span>
              ))}
            </div>

            {service.prasad && (
              <div className="mt-6 rounded-2xl border border-[#ebd8c1] bg-[#faf5ec] p-4 text-[13px] text-[#6b5845]">
                <strong>Prasad Provision:</strong> {service.prasad}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Related Japa Services */}
      <section className="px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-[26px] font-bold text-[#2b241d]">
              Explore Other Mantra Japa Services
            </h3>
            <Link
              to="/yagya-puja/japa"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#a8641b] hover:underline"
            >
              <span>All Japa</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedJapas.map((rel) => (
              <JapaServiceCard key={rel.id} service={rel} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default JapaServiceDetails;
