import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import japaCatalogueService from "../../../services/japaCatalogueService";
import JapaCategoryCard from "../components/JapaCategoryCard";
import JapaServiceCard from "../components/JapaServiceCard";
import {
  Sparkles,
  RefreshCw,
  ChevronRight as BreadcrumbChevron,
  ChevronDown,
  BookOpen,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

import heroBgImg from "../../../assets/images/yagya-puja/download (3).jpg";
import ctaBgImg from "../../../assets/images/puja/puja-final-cta.webp.png";

// ── Static FAQ Content tailored for Japa ──
const FAQ_ITEMS = [
  {
    q: "What is Mantra Japa and how does it work?",
    a: "Mantra Japa is the focused, rhythmic recitation of consecrated Vedic or Puranic mantras using sacred mala beads. The specific sound vibrations dissolve karmic obstacles, purify consciousness, and channel divine grace toward your sankalpa.",
  },
  {
    q: "Can Japa be performed on my behalf remotely?",
    a: "Yes. Through the sacred tradition of Pratinidhi (proxy) chanting, initiated Vedic pandits invoke your name, gotra, and spiritual intention during the morning sankalpa in Kashi and complete the full count on your behalf.",
  },
  {
    q: "How are the Japa counts (11,000 to 1,25,000) chosen?",
    a: "Cycles of 11,000 and 21,000 are recommended for periodic planetary remediation and peace. A count of 1,25,000 (Sawa Lakh Japa) constitutes a canonical Maha-Anushthan for overcoming deep-rooted obstacles, serious health concerns, or profound spiritual milestones.",
  },
  {
    q: "Which mala is used for the recitation?",
    a: "The sacred rosary matches the deity: Rudraksha for Lord Shiva and Mahamrityunjaya, Tulsi for Lord Vishnu and Rama, Sphatik or Kamal Gatta for Goddess Lakshmi, and Red Sandalwood for Durga and Hanuman.",
  },
  {
    q: "Is Dashansh Havan performed after Japa completion?",
    a: "Yes. In strict accordance with Vedic vidhi, every completed Japa anushthan concludes with Dashansh Havan (10% oblations), along with Tarpana, Marjana, and Brahmana Bhojanam.",
  },
  {
    q: "What sacred items will I receive after completion?",
    a: "Following the purnahuti, consecrated energized items such as raksha sutra, blessed bhasma, energized rudraksha or yantra, and sacred prasad are packed and dispatched to your address.",
  },
];

/**
 * ALL JAPA CATEGORIES PAGE (/yagya-puja/japa/all)
 * Displays all active Vedic Japa categories without pagination.
 * Features an editorial sacred ritual hero banner, responsive 3-column category grid,
 * recommended Japa services, consultation CTA banner, and ritual FAQs.
 */
const JapaAllCatalogueListing = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Recommended Japa services
  const [recommendedServices, setRecommendedServices] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  // FAQ accordion state (first item open by default)
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Set document title & scroll to top on mount
  useEffect(() => {
    document.title = "All Japa Categories in Kashi • Veda Structure";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch all active categories from backend API
  useEffect(() => {
    let isMounted = true;

    japaCatalogueService
      .getJapaCategories(reloadTrigger > 0)
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          const sorted = [...data].sort(
            (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
          );
          setCategories(sorted);
        } else {
          setCategories([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Could not load all Japa categories:", err);
        setError("Unable to load Japa categories. Please check your connection and try again.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reloadTrigger]);

  // Fetch Recommended Japa Services (6 curated services from API)
  useEffect(() => {
    let isMounted = true;

    japaCatalogueService
      .getJapaServices({ limit: 6, sortBy: "featured" })
      .then((res) => {
        if (!isMounted) return;
        if (res && Array.isArray(res.services)) {
          setRecommendedServices(res.services);
        }
        setLoadingRecommended(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Could not load recommended Japa services:", err);
        setLoadingRecommended(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div id="all-japa-categories" className="min-h-screen bg-[#fffaf0] text-[#2b241d]">
      {/* ── FULL-WIDTH EDITORIAL JAPA HERO BANNER ── */}
      <header className="group relative w-full overflow-hidden border-y border-[#ebdcc4] bg-[#140c06]">
        {/* Authentic Background Ritual Imagery */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBgImg}
            alt="Sacred Vedic Mantra Japa recitation"
            className="h-full w-full object-cover object-[18%_center] sm:object-[22%_center] lg:object-[28%_center] transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
            loading="eager"
          />

          {/* Right-Weighted Warm Gradient Scrim */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[rgba(20,12,5,0.60)] via-[rgba(20,12,5,0.72)] to-[rgba(20,12,5,0.92)] sm:bg-gradient-to-r sm:from-[rgba(20,12,5,0.18)] sm:via-[rgba(20,12,5,0.52)] sm:via-42% sm:to-[rgba(20,12,5,0.90)] sm:to-75%"
          />

          {/* Subtle Top & Bottom Vignettes */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(20,12,5,0.85)] to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[rgba(20,12,5,0.60)] to-transparent"
          />

          {/* Warm Ambient Radial Glow Behind Right-Side Text */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#eab12c]/10 blur-[130px]"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto flex min-h-[520px] sm:min-h-[550px] lg:min-h-[580px] xl:min-h-[620px] w-full max-w-[1240px] flex-col justify-between px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {/* Top: Breadcrumb positioned top-left over hero image */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-[#e8ded1]/90"
          >
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <BreadcrumbChevron size={12} className="text-[#d4c5b2]/70" />
            <Link to="/yagya-puja" className="transition-colors hover:text-white">
              Yagya &amp; Puja
            </Link>
            <BreadcrumbChevron size={12} className="text-[#d4c5b2]/70" />
            <Link to="/yagya-puja/japa" className="transition-colors hover:text-white">
              Japa / Chanting
            </Link>
            <BreadcrumbChevron size={12} className="text-[#d4c5b2]/70" />
            <span className="font-semibold text-[#f5ce6f]">All Japa Categories</span>
          </nav>

          {/* Middle/Right: Hero Content Block */}
          <div className="my-auto flex w-full justify-end pt-8 pb-6">
            <div className="w-full max-w-[580px] text-left lg:max-w-[620px]">
              {/* Eyebrow */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#eab12c]/35 bg-[#1a1007]/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#f5ce6f] shadow-xs backdrop-blur-md">
                <Sparkles size={12} className="text-[#eab12c]" />
                <span>SACRED TRADITIONS DIRECTORY</span>
              </div>

              {/* H1 */}
              <h1 className="font-serif text-[34px] font-bold tracking-tight text-[#fffdfa] sm:text-[44px] lg:text-[52px] xl:text-[58px] leading-[1.14]">
                All Vedic <span className="text-[#f5ce6f]">Japa</span> Categories
              </h1>

              {/* Description */}
              <p className="mt-4 text-[15px] leading-relaxed text-[#ede1d1] sm:text-[16.5px] sm:leading-relaxed">
                Select a consecrated mantra tradition or Shastric purpose to discover authentic Japa ceremonies and chanting recitations by verified Pandits in Kashi.
              </p>

              {/* Tradition Indicators */}
              <div className="mt-7 flex flex-wrap items-center gap-6 text-[13px] font-medium text-[#d9c9b5]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#eab12c]" />
                  <span>Canonical Mantra Traditions</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#eab12c]" />
                  <span>Strict Kalpa &amp; Agama Shastra Vidhi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom subtle alignment anchor */}
          <div aria-hidden="true" className="h-2" />
        </div>
      </header>

      {/* ── SECTION 1: ALL JAPA CATEGORIES DIRECTORY ── */}
      <section className="mx-auto max-w-[1240px] px-4 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eed7b6] bg-[#fbf5ea] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
            <Sparkles size={11} className="text-[#c77722]" />
            <span>EXPLORE BY TRADITION</span>
          </div>
          <h2 className="mt-3 font-serif text-[28px] font-bold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Discover Your Japa Tradition
          </h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[15px] leading-relaxed text-[#75695c] sm:text-[16px]">
            Explore sacred Mantra Japa traditions by deity, spiritual intention, and Shastric purpose.
          </p>
          <div className="mt-4 text-[13px] font-medium text-[#8c7e6e]">
            Showing all{" "}
            <strong className="font-bold text-[#2b241d]">
              {loading ? "..." : categories.length}
            </strong>{" "}
            Active Japa Categories
          </div>
        </div>

        {/* Categories Grid / Loading / Error / Empty States */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="shadow-xs flex flex-col overflow-hidden rounded-[20px] border border-[#e8d9bc] bg-[#fffdfa] animate-pulse"
              >
                <div className="w-full aspect-[16/10] bg-[#ebdcc4]/60" />
                <div className="p-5 space-y-3">
                  <div className="mx-auto h-5 w-3/4 rounded bg-[#ebdcc4]/70" />
                  <div className="mx-auto h-3.5 w-1/2 rounded bg-[#ebdcc4]/40" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="shadow-xs rounded-[28px] border border-[#f0c8a8] bg-[#fffbf7] p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fce8dc] text-[#c74422]">
              <RefreshCw size={24} />
            </div>
            <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
              Unable to load Categories
            </h3>
            <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-[#75695c]">
              {error}
            </p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setLoading(true);
                setReloadTrigger((prev) => prev + 1);
              }}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#eab12c] px-7 py-3 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition hover:bg-[#dda018]"
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <JapaCategoryCard key={category.id || category.slug} category={category} />
            ))}
          </div>
        ) : (
          <div className="shadow-xs rounded-[28px] border border-[#ead8b8] bg-[#fffdf9] p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
              <Sparkles size={24} />
            </div>
            <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
              No Japa Categories Found
            </h3>
            <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-[#75695c]">
              Please check back shortly as active Vedic traditions are being consecrated.
            </p>
          </div>
        )}
      </section>

      {/* ── SECTION 2: RECOMMENDED JAPA CEREMONIES ── */}
      <section className="border-t border-[#ebdcc4] bg-[#fbf6ed] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eed7b6] bg-[#f5ede0] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
              <Sparkles size={11} className="text-[#c77722]" />
              <span>SACRED RECITATIONS</span>
            </div>
            <h2 className="mt-3 font-serif text-[28px] font-bold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              Recommended Japa Ceremonies
            </h2>
            <p className="mx-auto mt-3 max-w-[620px] text-[15px] leading-relaxed text-[#75695c] sm:text-[16px]">
              Explore consecrated Vedic Japa anushthans commonly chosen for health, peace, and spiritual protection.
            </p>
          </div>

          {loadingRecommended ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="flex flex-col overflow-hidden rounded-[20px] border border-[#e8d9bc] bg-[#fffdfa] shadow-xs animate-pulse"
                >
                  <div className="w-full aspect-[4/3] bg-[#ebdcc4]/60" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-[#ebdcc4]/70" />
                    <div className="h-3.5 w-full rounded bg-[#ebdcc4]/40" />
                    <div className="h-3.5 w-4/5 rounded bg-[#ebdcc4]/40" />
                  </div>
                </div>
              ))}
            </div>
          ) : recommendedServices.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendedServices.map((service) => (
                <JapaServiceCard key={service.id || service.slug} service={service} />
              ))}
            </div>
          ) : null}

          {/* Bottom Explore All Japa CTA linking to /yagya-puja/japa */}
          <div className="mt-12 text-center">
            <Link
              to="/yagya-puja/japa"
              className="group inline-flex items-center gap-2 rounded-full border border-[#c77722] bg-[#c77722] px-8 py-3.5 text-[14px] font-bold text-[#fffdfa] shadow-sm transition-all duration-300 hover:bg-[#b06318] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722]"
            >
              <span>Explore All Japa</span>
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: NEED GUIDANCE? (CINEMATIC IMAGE CTA BANNER) ── */}
      <section className="relative w-full overflow-hidden border-y border-[#ebdcc4] bg-[#1a110a] py-20 sm:py-24 lg:py-28 min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] flex items-center justify-center">
        {/* Background Ritual Imagery */}
        <div className="absolute inset-0 z-0">
          <img
            src={ctaBgImg}
            alt="Sacred Vedic Japa and chanting rituals"
            className="h-full w-full object-cover object-center opacity-45 sm:opacity-50"
            loading="lazy"
          />

          {/* Deep Warm Scrim Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#18110b]/85 via-[#1a110a]/75 to-[#18110b]/90"
          />

          {/* Vignettes */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#140c06]/60 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#140c06]/70 to-transparent"
          />

          {/* Ambient Warm Golden Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[500px] rounded-full bg-[#eab12c]/12 blur-[130px]"
          />
        </div>

        {/* Centered Content */}
        <div className="relative z-10 mx-auto max-w-[820px] px-4 sm:px-6 lg:px-8 text-center text-[#fffdfa]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eab12c]/40 bg-[#1c1208]/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#f5ce6f] shadow-xs backdrop-blur-md">
            <MessageSquare size={12} className="text-[#eab12c]" />
            <span>NEED GUIDANCE?</span>
          </div>

          <h2 className="mt-5 font-serif text-[30px] font-bold leading-tight text-[#fffdfa] sm:text-[38px] lg:text-[44px]">
            Not Sure Which Mantra Japa Is Right for You?
          </h2>

          <p className="mx-auto mt-4 max-w-[560px] text-[15.5px] leading-relaxed text-[#ded4c5] sm:text-[17px]">
            Speak with our Vedic scholars to determine the ideal mantra count and deity tradition aligned with your birth nakshatra and sankalpa.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/book-consultation"
              className="group inline-flex items-center gap-2.5 rounded-full border border-[#f5ce6f] bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#1a1208] shadow-[0_4px_18px_rgba(234,177,44,0.35)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_24px_rgba(234,177,44,0.48)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5ce6f]"
            >
              <span>Talk to an Astrologer</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: FREQUENTLY ASKED QUESTIONS ── */}
      <section className="border-t border-[#ebdcc4] bg-[#fbf6ed] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eed7b6] bg-[#f5ede0] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
              <Sparkles size={11} className="text-[#c77722]" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="mt-3 font-serif text-[28px] font-bold text-[#2b241d] sm:text-[34px] lg:text-[38px]">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-2.5 max-w-[560px] text-[14.5px] leading-relaxed text-[#75695c] sm:text-[15.5px]">
              Answers to commonly asked questions about booking and participating in sacred Vedic Mantra Japa.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-[16px] border border-[#ebdcc4] bg-[#fffdfa] shadow-2xs transition-colors hover:border-[#dfc8a5]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left font-serif text-[15.5px] font-bold text-[#2b241d] transition-colors hover:text-[#c77722] sm:p-5 sm:text-[16.5px]"
                    aria-expanded={isOpen}
                  >
                    <span className="leading-snug">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#b36c1e] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#f2e6d5] px-4 pt-3 pb-4 text-[13.5px] leading-relaxed text-[#685c4f] sm:px-5 sm:pb-5">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: VEDIC TRUST ANCHOR NOTE ── */}
      <div className="border-t border-[#ebdcc4] bg-[#fffaf0] py-12">
        <div className="mx-auto flex max-w-[1240px] items-center justify-center gap-3 px-4 text-center text-[13px] text-[#8c7e6e]">
          <BookOpen size={16} className="text-[#c77722]" />
          <span>Every Japa recitation is performed strictly per Vedic Kalpa &amp; Agama Shastras in Kashi.</span>
        </div>
      </div>
    </div>
  );
};

export default JapaAllCatalogueListing;
