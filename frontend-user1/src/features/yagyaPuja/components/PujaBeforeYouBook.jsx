import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import pujaDevotionalAltarImg from "../../../assets/images/puja/puja-devotional-altar.webp.png";

const PujaBeforeYouBook = () => {
  // Ordered to match Row 1: Configuration / Coordination, Row 2: Foundational / Ritual Specific
  const callouts = [
    {
      title: "What You Choose",
      tag: "Configuration",
      points: [
        "Specific Puja ritual aligned to your spiritual purpose",
        "Prescribed duration (2h Essential, 3h Detailed, 5h Extended)",
        "Preferred date and auspicious timing window",
        "In-person attendance at Kashi or Remote live Sankalpa",
      ],
      motif: (
        <svg aria-hidden="true" className="h-18 w-18 text-[#b36c1e]/[0.08] transition-transform duration-500 group-hover:scale-105" viewBox="0 0 80 80" fill="none" stroke="currentColor">
          <circle cx="65" cy="15" r="12" strokeWidth="0.8" />
          <circle cx="65" cy="15" r="24" strokeWidth="0.7" strokeDasharray="2 2" />
          <path d="M65 3 C58 12 52 18 65 27 C78 18 72 12 65 3 Z" strokeWidth="0.7" />
          <circle cx="65" cy="15" r="3" fill="currentColor" fillOpacity="0.2" strokeWidth="0.4" />
        </svg>
      ),
    },
    {
      title: "What Happens Next",
      tag: "Coordination",
      points: [
        "Confirmation review and priest team assignment",
        "Preparation of fresh flowers, naivedyam, and sanctified items",
        "Vedic ceremony conducted with strict acoustic precision",
        "Dedication of merit and prasad packaging post-Purnahuti",
      ],
      motif: (
        <svg aria-hidden="true" className="h-18 w-18 text-[#b36c1e]/[0.08] transition-transform duration-500 group-hover:scale-105" viewBox="0 0 80 80" fill="none" stroke="currentColor">
          <rect x="48" y="2" width="30" height="30" rx="3" strokeWidth="0.7" />
          <circle cx="63" cy="17" r="7" strokeWidth="0.7" strokeDasharray="2 2" />
          <path d="M63 7 L63 27 M53 17 L73 17" strokeWidth="0.6" />
          <circle cx="63" cy="17" r="2.5" fill="currentColor" fillOpacity="0.2" strokeWidth="0.4" />
        </svg>
      ),
    },
    {
      title: "What Is Included",
      tag: "Foundational",
      points: [
        "Learned Vedic Purohits versed in prescribed Shakhas",
        "Foundational Shastric samagri (Pure Cow Ghee, Samidha, Gangajal)",
        "Accurate recording of your personal Gotra and Nakshatra",
        "Applicable completion updates and consecrated prasad",
      ],
      motif: (
        <svg aria-hidden="true" className="h-18 w-18 text-[#b36c1e]/[0.08] transition-transform duration-500 group-hover:scale-105" viewBox="0 0 80 80" fill="none" stroke="currentColor">
          <circle cx="65" cy="15" r="14" strokeWidth="0.8" />
          <circle cx="65" cy="15" r="26" strokeWidth="0.6" strokeDasharray="3 2" />
          <path d="M53 15 C60 9 70 9 77 15 C70 21 60 21 53 15 Z" strokeWidth="0.7" />
          <circle cx="65" cy="15" r="3.5" fill="currentColor" fillOpacity="0.2" strokeWidth="0.4" />
        </svg>
      ),
    },
    {
      title: "What May Vary",
      tag: "Ritual Specific",
      points: [
        "Deity-specific offerings (lotus, bilva leaves, special modaks)",
        "Number of attending Acharyas based on ritual scale",
        "Temple sanctum versus private Ganga ghat venue logistics",
        "Doorstep prasad delivery transit depending on destination",
      ],
      motif: (
        <svg aria-hidden="true" className="h-18 w-18 text-[#b36c1e]/[0.08] transition-transform duration-500 group-hover:scale-105" viewBox="0 0 80 80" fill="none" stroke="currentColor">
          <path d="M65 4 C57 14 50 20 65 28 C80 20 73 14 65 4 Z" strokeWidth="0.7" />
          <circle cx="65" cy="16" r="13" strokeWidth="0.6" strokeDasharray="2 2" />
          <circle cx="65" cy="16" r="3" fill="currentColor" fillOpacity="0.2" strokeWidth="0.4" />
        </svg>
      ),
    },
  ];

  const topics = [
    "What is this Puja?",
    "Purpose & Benefits",
    "Traditional Significance",
    "Who can perform it?",
    "Auspicious Muhurtas",
    "Prescribed Duration",
    "Shastric Vidhi",
    "Mantra Recitation",
    "Pandit Team Size",
    "Samagri Specifications",
    "Sankalpa Parameters",
    "Available Dates",
    "Location & Venue",
    "Prasad Arrangements",
    "Transparent Pricing",
    "Ritual FAQs",
  ];

  return (
    <section className="relative overflow-hidden border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      {/* Subtle warm ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fcf5e8]/70 via-transparent to-transparent"
      />

      <div className="relative mx-auto max-w-[1360px]">

        {/* ── ZONE A: Section Header ── */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
              Complete Clarity & Preparation
            </span>
          </div>

          <h2 className="mt-2.5 font-serif text-[28px] font-semibold leading-[1.15] sm:text-[36px] lg:text-[40px]">
            <span className="text-[#2b241d]">
              Before You Book,
            </span>
            <span className="text-[#c77722]">
              {" "}Know Your Puja
            </span>
          </h2>


          <p className="mx-auto mt-3.5 max-w-[750px] font-sans text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
            We believe a sacred ritual should be understood before it is booked. Here is how your ceremony is structured
            and what transparent information is available on every service page:
          </p>

          {/* Understated Gold Divider */}
          <div
            aria-hidden="true"
            className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/60"
          >
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
            <span className="text-[12px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
          </div>
        </div>

        {/* ── ZONE B: Hero Devotional Altar Visual Area + Floating Callouts ── */}
        <div className="mt-12 sm:mt-14">
          {/* Large Horizontal Devotional Visual Centerpiece */}
          <div className="group relative mx-auto h-[260px] max-w-[1240px] overflow-hidden rounded-[22px] border border-[#ead8b8] bg-[#1e140d] shadow-[0_12px_36px_rgba(50,35,20,0.08)] sm:h-[320px] lg:h-[380px]">
            <img
              src={pujaDevotionalAltarImg}
              alt="Consecrated temple altar with sacred offerings and traditional lamps"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              loading="lazy"
            />

            {/* Subtle warm/dark gradient overlay at bottom */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140c06]/85 via-[#140c06]/30 via-40% to-transparent"
            />

            {/* Subtle Center Watermark Badge on Image Top-Center */}
            <div className="absolute left-6 top-5 sm:left-8 sm:top-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eab12c]/35 bg-[#160d06]/65 px-3 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#f5ce6f] backdrop-blur-xs">
                <Sparkles size={11} className="text-[#eab12c]" />
                <span>Sacred Vidhi & Shastric Discipline</span>
              </span>
            </div>
          </div>

          {/* 4 Floating / Layered Editorial Callout Panels (2 × 2 Grid) */}
          <div className="relative z-10 mx-auto -mt-16 max-w-[1180px] px-2 sm:-mt-24 sm:px-4 lg:-mt-28">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {callouts.map((c) => (
                <div
                  key={c.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#ead8b8] bg-[#fbf6eb]/98 p-5.5 shadow-[0_6px_24px_rgba(50,35,15,0.065)] backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c77722] hover:bg-[#fffcf7] hover:shadow-[0_10px_30px_rgba(199,119,34,0.11)] sm:p-6"
                >
                  {/* Subtle Ornamental Background Motif (Top-Right) */}
                  <div className="pointer-events-none absolute -right-1 -top-1 z-0">
                    {c.motif}
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    {/* Subtle Editorial Label */}
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                      {c.tag}
                    </span>

                    {/* Serif Title */}
                    <h3 className="mt-1 font-serif text-[18px] font-semibold text-[#2b241d] transition-colors duration-200 group-hover:text-[#b36c1e]">
                      {c.title}
                    </h3>

                    {/* Points List */}
                    <ul className="mt-3.5 space-y-2.5">
                      {c.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-[12.5px] leading-[1.6] text-[#65584a] sm:text-[13px]">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f4e8d4] text-[#b36c1e]">
                            <Check size={11} strokeWidth={2.5} />
                          </div>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ZONE C: Parameter Directory Area + Faded Indian Line-Art Ornaments ── */}
        <div className="relative mt-16 sm:mt-20">
          {/* Subtle Background Mandala Line-Art in Bottom-Left and Bottom-Right */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 text-[#b36c1e]/[0.06]"
            viewBox="0 0 140 140"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="70" cy="70" r="30" strokeWidth="0.8" />
            <circle cx="70" cy="70" r="50" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="70" cy="70" r="66" strokeWidth="0.6" />
            <path d="M70 20 C60 45 45 60 20 70 C45 80 60 95 70 120 C80 95 95 80 120 70 C95 60 80 45 70 20 Z" strokeWidth="0.8" />
          </svg>

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 text-[#b36c1e]/[0.06]"
            viewBox="0 0 140 140"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="70" cy="70" r="30" strokeWidth="0.8" />
            <circle cx="70" cy="70" r="50" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="70" cy="70" r="66" strokeWidth="0.6" />
            <path d="M70 20 C60 45 45 60 20 70 C45 80 60 95 70 120 C80 95 95 80 120 70 C95 60 80 45 70 20 Z" strokeWidth="0.8" />
          </svg>

          {/* Section Subtitle */}
          <div className="text-center">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a755d]">
              Parameters Detailed on Every Individual Service Page:
            </p>
          </div>

          {/* 16 Refined Information Chips (4 Columns on Desktop) */}
          <div className="relative z-10 mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-3">
            {topics.map((topic) => (
              <div
                key={topic}
                className="group flex h-11 items-center gap-2.5 rounded-[12px] border border-[#ead8b8] bg-[#fbf6eb] px-3.5 shadow-[0_2px_8px_rgba(60,40,15,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c77722] hover:bg-[#fffcf7] hover:shadow-[0_4px_14px_rgba(199,119,34,0.08)]"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#e6d3b3] bg-[#f5ebd7] text-[#b36c1e] transition-colors duration-200 group-hover:border-[#c77722] group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                  <Check size={11} strokeWidth={2.5} />
                </div>
                <span className="truncate font-sans text-[12.5px] font-medium text-[#2b241d] transition-colors duration-200 group-hover:text-[#965511] sm:text-[13px]">
                  {topic}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Footer */}
          <div className="mt-12 text-center sm:mt-14">
            <Link
              to="/yagya-puja/puja/rudrabhishek-puja"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#eab12c] px-8 py-3.5 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_18px_rgba(234,177,44,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#dda018] hover:shadow-[0_6px_22px_rgba(234,177,44,0.36)]"
            >
              <span>View Example Puja Details</span>
              <ArrowRight size={15} />
            </Link>

            <p className="mt-3 text-[12.5px] leading-relaxed text-[#786b5c]">
              Explore an example service detail page with complete Shastric information and transparent configuration.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PujaBeforeYouBook;

