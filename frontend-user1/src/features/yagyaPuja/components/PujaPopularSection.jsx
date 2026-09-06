import { useMemo } from "react";
import { Sparkles, ArrowRight, MapPin, Clock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedPujaServices } from "../data/pujaCatalogueData";

const PopularPujaCard = ({ service }) => {
  if (!service) return null;

  return (
    <Link
      to={`/yagya-puja/puja/${service.slug}`}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[22px] border border-[#ead8b8] bg-[#fffdfa] shadow-[0_4px_16px_rgba(60,40,15,0.05)] transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_10px_30px_rgba(199,119,34,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722] cursor-pointer"
    >
      <div>
        {/* ── Image Area (Reduced Height 200–210px) ── */}
        <div className="relative h-[200px] w-full overflow-hidden bg-[#1f1510] sm:h-[210px]">
          <img
            src={service.image}
            alt={service.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* Ambient subtle warm dark bottom gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a120b]/75 via-[#1a120b]/15 to-transparent" />

          {/* Featured badge — small, elegant, upper-left */}
          {service.isFeatured && (
            <div className="absolute left-3.5 top-3.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#eab12c]/30 bg-[#160d06]/75 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#f5ce6f] backdrop-blur-xs shadow-xs">
                <Sparkles size={9} className="text-[#eab12c]" />
                Featured
              </span>
            </div>
          )}

          {/* Location badge — subtle, bottom-right */}
          <div className="absolute bottom-3.5 right-3.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-2.5 py-0.5 text-[10px] font-medium text-[#f0e4cc] backdrop-blur-xs">
              <MapPin size={9.5} className="text-[#eab12c]" />
              {service.locationType || "Kashi & Sacred Dhams"}
            </span>
          </div>
        </div>

        {/* ── Card Content Area ── */}
        <div className="p-5 sm:p-6">
          {/* Metadata Row: Deity + Duration */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="rounded-full border border-[#eed7b6] bg-[#f8edd8] px-2.5 py-0.5 text-[#8a561c]">
              {service.deity}
            </span>
            <span className="text-[#d2baa0]">·</span>
            <span className="flex items-center gap-1 font-medium text-[#6e6052]">
              <Clock size={11} className="text-[#c77722]" />
              {service.duration || (service.availableDurations ? service.availableDurations.join(", ") : "2–3 Hours")}
            </span>
          </div>

          {/* Service Title */}
          <h3 className="mt-3 font-serif text-[20px] font-bold leading-snug text-[#2b241d] transition-colors duration-250 group-hover:text-[#b36c1e] sm:text-[21px]">
            {service.name}
          </h3>

          {/* Service Description */}
          <p className="mt-2 text-[13px] leading-[1.65] text-[#685c4f] line-clamp-2 sm:line-clamp-3">
            {service.shortDescription || service.purpose}
          </p>

          {/* Service Mode */}
          <div className="mt-3.5 flex items-center gap-1.5 text-[11.5px] font-medium text-[#7d674b]">
            <ShieldCheck size={13} className="shrink-0 text-[#b36c1e]" />
            <span>{service.availableMode || "In-Person (Kashi) or Remote"}</span>
          </div>
        </div>
      </div>

      {/* ── Footer: Price + View Puja CTA ── */}
      <div className="border-t border-[#f0e2cd] p-5 pt-4 sm:p-6 sm:pt-4">
        <div className="flex items-end justify-between">
          {/* Price */}
          <div>
            <span className="block text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#9c8e7e]">
              Starting From
            </span>
            <span className="mt-0.5 block font-serif text-[22px] font-bold leading-none text-[#2b241d]">
              {service.formattedPrice}
            </span>
          </div>

          {/* Outlined Compact CTA Button */}
          <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#d6b8a0] bg-transparent px-3.5 py-2 text-[12px] font-bold text-[#2b241d] transition-all duration-300 group-hover:border-[#eab12c] group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
            <span>View Puja</span>
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>

      {/* Subtle bottom gold accent bar on hover */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#eab12c] via-[#f5ce6f] to-transparent transition-all duration-500 group-hover:w-full"
      />
    </Link>
  );
};

const PujaPopularSection = () => {
  const featuredServices = useMemo(() => {
    return getFeaturedPujaServices();
  }, []);

  if (featuredServices.length === 0) return null;

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1400px]">

        {/* ── Section Header ── */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            {/* Simple Editorial Eyebrow */}
            <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
              <Sparkles size={12} className="text-[#c77722]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                Recommended Vedic Rituals
              </span>
            </div>

            {/* Main Heading */}

            <h2 className="mt-2.5 font-serif text-[28px] font-semibold leading-[1.15] sm:text-[36px] lg:text-[40px]">
              <span className="text-[#2b241d]">
                Popular
              </span>
              <span className="text-[#c77722]">
                {" "}Pujas
              </span>
            </h2>

            {/* Narrative Subtitle */}
            <p className="mt-2.5 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
              Frequently requested ceremonies conducted with comprehensive Vedic vidhi and personalized Gotra Sankalpa.
            </p>
          </div>

          {/* Right Action: Refined Editorial Link */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("puja-catalogue");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex shrink-0 items-center gap-2 pb-1 text-[13.5px] font-semibold text-[#b36c1e] transition-colors duration-200 hover:text-[#2b241d] cursor-pointer md:pb-2"
          >
            <span>View all catalogue services</span>
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* ── Featured Grid ── */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7 items-stretch">
          {featuredServices.map((service) => (
            <PopularPujaCard key={`popular-${service.id}`} service={service} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PujaPopularSection;
