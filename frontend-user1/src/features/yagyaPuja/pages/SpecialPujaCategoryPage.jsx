import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Sun,
  BookOpen,
  ArrowLeft,
  Calendar,
  Landmark,
  Phone,
} from "lucide-react";
import {
  SPECIAL_PUJA_CATEGORIES,
  SHODASHA_SAMSKARS,
  BIRTHDAY_PUJA_SERVICES,
  PINDA_DAAN_LOCATIONS,
  TIRTH_SHRADH_CEREMONIES,
  SPECIAL_PUJA_IMAGES,
} from "../data/specialPujaData";

export default function SpecialPujaCategoryPage({ category: categoryProp }) {
  const { categorySlug } = useParams();
  const activeSlug = categoryProp || categorySlug || "samskar";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSlug]);

  const categoryInfo =
    SPECIAL_PUJA_CATEGORIES.find((c) => c.slug === activeSlug) ||
    SPECIAL_PUJA_CATEGORIES[0];

  const [selectedPhase, setSelectedPhase] = useState("all");

  const phases = [
    { id: "all", label: "All 16 Samskars" },
    { id: "Pre-natal", label: "Pre-natal (1–3)" },
    { id: "Infancy", label: "Infancy (4–7)" },
    { id: "Childhood", label: "Childhood (8–10)" },
    { id: "Student Life", label: "Student Life (11–14)" },
    { id: "Householder", label: "Householder (15)" },
    { id: "Final Transition", label: "Final Transition (16)" },
  ];

  const filteredSamskars =
    selectedPhase === "all"
      ? SHODASHA_SAMSKARS
      : SHODASHA_SAMSKARS.filter((s) => s.phase === selectedPhase);

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#2b241d] selection:bg-[#eab12c]/30">
      {/* ========================================================
          BREADCRUMB STRIP
      ========================================================= */}
      <div className="border-b border-[#ebdcc4] bg-[#fbf5ea]/70 px-5 py-3 text-[12px] font-medium text-[#7a6d5f]">
        <div className="mx-auto flex max-w-[1360px] items-center gap-1.5 flex-wrap">
          <Link to="/" className="transition-colors hover:text-[#c77722]">
            Home
          </Link>
          <ChevronRight size={13} className="text-[#a89d91]" />
          <Link to="/yagya-puja" className="transition-colors hover:text-[#c77722]">
            Yagya &amp; Puja
          </Link>
          <ChevronRight size={13} className="text-[#a89d91]" />
          <Link
            to="/yagya-puja/special-puja"
            className="transition-colors hover:text-[#c77722]"
          >
            Special Puja
          </Link>
          <ChevronRight size={13} className="text-[#a89d91]" />
          <span className="font-semibold text-[#2b241d]">{categoryInfo.name}</span>
        </div>
      </div>

      {/* ========================================================
          PAGE HERO BANNER WITH PROMINENT CATEGORY IMAGE
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-[#ebdcc4] bg-gradient-to-b from-[#fbf4e8] via-[#fffaf0] to-[#fffdfa] px-5 py-10 sm:py-14 lg:px-12">
        <div className="relative mx-auto max-w-[1360px]">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4872b]/35 bg-[#fdf5e6] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                <Sparkles size={11} className="text-[#c77722]" />
                <span>{categoryInfo.badge}</span>
              </div>

              <h1 className="mt-3.5 font-serif text-[32px] font-bold leading-tight text-[#2b241d] sm:text-[40px] lg:text-[46px]">
                {categoryInfo.name}
              </h1>

              <p className="mt-1 font-serif text-[18px] font-semibold text-[#b36c1e]">
                {categoryInfo.hindiName}
              </p>

              <p className="mt-3.5 max-w-[620px] text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#5c4e3f]">
                {categoryInfo.description}
              </p>

              {/* Quick Navigation to other categories */}
              <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-[#ebdcc4]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                  Categories:
                </span>
                {SPECIAL_PUJA_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={cat.path}
                    className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all ${
                      cat.slug === activeSlug
                        ? "bg-[#eab12c] text-[#1c1308] shadow-2xs"
                        : "border border-[#ead8b8] bg-[#fffcf7] text-[#5c4e3f] hover:border-[#c77722] hover:text-[#b36c1e]"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-[24px] border-2 border-[#e6cca0] bg-[#241a12] shadow-xl">
                <img
                  src={categoryInfo.image}
                  alt={categoryInfo.name}
                  className="h-[280px] w-full object-cover sm:h-[340px] transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#f5ce6f]">
                    {categoryInfo.categoryBadge}
                  </span>
                  <p className="font-serif text-[18px] font-bold text-white mt-0.5">
                    {categoryInfo.tagline}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MAIN CONTENT AREA BASED ON ACTIVE CATEGORY
      ========================================================= */}
      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1360px]">
          {/* ====================================================
              CASE 1: SHODASHA SAMSKARS (16 RITES)
          ==================================================== */}
          {activeSlug === "samskar" && (
            <div>
              {/* Filter Tabs & Count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebdcc4] mb-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Life-Stage:
                  </span>
                  {phases.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPhase(p.id)}
                      className={`rounded-full px-3.5 py-1 text-[12px] font-semibold transition-all cursor-pointer ${
                        selectedPhase === p.id
                          ? "bg-[#b36c1e] text-white shadow-2xs"
                          : "border border-[#ead8b8] bg-[#fffcf7] text-[#5c4e3f] hover:border-[#c77722] hover:text-[#b36c1e]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <span className="text-[12px] font-medium text-[#7a6d5f]">
                  Showing <strong className="text-[#2b241d]">{filteredSamskars.length}</strong> of 16 Rites
                </span>
              </div>

              {/* 16 Samskars Grid: Consistent heights & prominent imagery */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredSamskars.map((s) => (
                  <Link
                    key={s.id}
                    to={`/yagya-puja/special-puja/samskar/${s.slug}`}
                    className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-4 shadow-[0_2px_10px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)] cursor-pointer"
                  >
                    <div>
                      {/* Samskar Visual */}
                      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        <span className="absolute top-2.5 left-2.5 rounded-full bg-[#180f08]/85 px-2.5 py-0.5 font-serif text-[12px] font-bold text-[#f5ce6f] border border-[#eab12c]/40 backdrop-blur-xs">
                          #{s.number}
                        </span>

                        <span className="absolute bottom-2.5 right-2.5 rounded-full bg-[#fffaf0]/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#75695c] shadow-xs">
                          {s.phase}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="mt-3.5">
                        <div className="flex items-baseline justify-between gap-1">
                          <h3 className="font-serif text-[18px] font-bold text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                            {s.name}
                          </h3>
                          <span className="text-[12px] font-semibold text-[#b36c1e] shrink-0">
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

                    {/* View Full Ritual Button */}
                    <div className="mt-4 pt-3 border-t border-[#f0e2cc]">
                      <div className="inline-flex w-full items-center justify-between rounded-full bg-[#fbf5ea] px-3.5 py-2 text-[12px] font-bold text-[#b36c1e] transition-all group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                        <span>View Full Ritual</span>
                        <ChevronRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              CASE 2: BIRTHDAY PUJA
          ==================================================== */}
          {activeSlug === "birthday-puja" && (
            <div className="space-y-10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {BIRTHDAY_PUJA_SERVICES.map((srv) => (
                  <div
                    key={srv.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-5 shadow-[0_2px_10px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]"
                  >
                    <div>
                      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
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
                        <h3 className="font-serif text-[18px] font-bold leading-snug text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                          {srv.name}
                        </h3>
                        <p className="text-[12px] font-semibold text-[#b36c1e] mt-0.5">
                          {srv.hindiName}
                        </p>
                        <p className="mt-2 text-[13px] leading-relaxed text-[#65584a]">
                          {srv.summary}
                        </p>

                        <div className="mt-3.5 space-y-1.5 pt-3 border-t border-[#f0e2cc]">
                          {srv.keyBenefits.map((b, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[12px] text-[#554637]">
                              <CheckCircle2 size={12} className="text-[#b36c1e] shrink-0" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#f0e2cc]">
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
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#eab12c] py-2.5 text-[13px] font-bold text-[#1c1308] shadow-[0_2px_10px_rgba(234,177,44,0.2)] transition-all duration-200 hover:bg-[#dda018] hover:shadow-[0_4px_14px_rgba(234,177,44,0.3)]"
                      >
                        <span>Book Ceremony</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              CASE 3: PINDA DAAN
          ==================================================== */}
          {activeSlug === "pinda-daan" && (
            <div className="space-y-10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {PINDA_DAAN_LOCATIONS.map((loc) => (
                  <div
                    key={loc.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-5 shadow-[0_2px_10px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]"
                  >
                    <div>
                      <div className="relative h-48 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
                        <img
                          src={loc.image}
                          alt={loc.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-[#180f08]/85 px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#f5ce6f] border border-[#eab12c]/30">
                          <MapPin size={11} />
                          <span>{loc.state}</span>
                        </span>
                      </div>

                      <div className="mt-4">
                        <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                          {loc.name}
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-[#65584a]">
                          {loc.significance}
                        </p>

                        <div className="mt-4 pt-3 border-t border-[#f0e2cc]">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                            Sacred Sites:
                          </span>
                          <ul className="mt-1.5 space-y-1 text-[12px] text-[#554637]">
                            {loc.holySites.map((site, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <span className="text-[#b36c1e] font-bold">•</span>
                                <span>{site}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#f0e2cc] space-y-2">
                      <p className="text-[11.5px] text-[#7d6f60]">
                        Ideal Timing: <strong className="text-[#2b241d]">{loc.idealTime}</strong>
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
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#eab12c] py-2.5 text-[13px] font-bold text-[#1c1308] shadow-[0_2px_10px_rgba(234,177,44,0.2)] transition-all duration-200 hover:bg-[#dda018] hover:shadow-[0_4px_14px_rgba(234,177,44,0.3)]"
                      >
                        <span>Book at {loc.name}</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              CASE 4: TIRTH SHRADH
          ==================================================== */}
          {activeSlug === "tirth-shradh" && (
            <div className="space-y-10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {TIRTH_SHRADH_CEREMONIES.map((c) => (
                  <div
                    key={c.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-5 shadow-[0_2px_10px_rgba(60,40,15,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]"
                  >
                    <div>
                      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#ead8b8]/60 bg-[#1c1209]">
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
                        <h3 className="font-serif text-[18px] font-bold leading-snug text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                          {c.name}
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-[#65584a]">
                          {c.significance}
                        </p>

                        <div className="mt-3.5 space-y-1 pt-3 border-t border-[#f0e2cc]">
                          {c.vidhiIncludes.map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[12px] text-[#554637]">
                              <CheckCircle2 size={12} className="text-[#b36c1e] shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#f0e2cc]">
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
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#eab12c] py-2.5 text-[13px] font-bold text-[#1c1308] shadow-[0_2px_10px_rgba(234,177,44,0.2)] transition-all duration-200 hover:bg-[#dda018] hover:shadow-[0_4px_14px_rgba(234,177,44,0.3)]"
                      >
                        <span>Book Ceremony</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Return to Special Puja Hub */}
      <div className="border-t border-[#ebdcc4] bg-[#fbf5ea]/50 py-8 text-center">
        <Link
          to="/yagya-puja/special-puja"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-[#b36c1e] hover:text-[#8e4f0d] transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Return to Special Puja Overview</span>
        </Link>
      </div>
    </div>
  );
}
