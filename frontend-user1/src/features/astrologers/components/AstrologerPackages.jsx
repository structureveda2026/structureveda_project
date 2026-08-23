import { useState } from "react";
import { ShieldCheck, UserRound, Clock } from "lucide-react";

export const getDefaultPackages = (mainAstrologerImage, secondaryAstrologerImage, astrologerName = "Vishal Bhardwaj") => [
  {
    id: "essential",
    badge: null,
    title: "Elite Certified Astrologers",
    subtitle: "Selected From The Top 5% For Accuracy, Expertise & Trust.",
    image: secondaryAstrologerImage,
    isPopular: false,
    knownFor: [
      "Personalized remedies for career, finance, marriage, and health",
      "Easy-to-follow solutions for daily life",
      "Clear and honest guidance without fear tactics",
      "Key poojas organized and performed with spiritual precision",
    ],
    consultationDetails: [
      "Duration: 30 minutes",
      "Schedule your session immediately",
      "Couple consultation available at checkout",
    ],
    normalPrice: "₹1,100",
    urgentPrice: "₹1,500",
  },
  {
    id: "complete",
    badge: "Most Popular",
    title: `Astrologer ${astrologerName}`,
    subtitle:
      "10+ Years Of Experience | 1,500+ Clients Consulted | Expert In Palmistry & Kundli Reading",
    image: mainAstrologerImage,
    isPopular: true,
    knownFor: [
      "Giving clear actionable guidance that you can implement immediately",
      "Offering simple and effective remedies based on your unique birth chart",
      "Providing detailed predictions trusted by thousands",
      "Specialising in career relationship and health advice",
      "Guidance and support for getting specific pooja done when required",
    ],
    consultationDetails: [
      "Duration: 60-minute session (Comprehensive)",
      "Immediate slot availability & priority booking",
      "Couple Consultation option available at checkout",
    ],
    normalPrice: "₹2,100",
    urgentPrice: "₹2,500",
  },
  {
    id: "premium",
    badge: null,
    title: "Premium Astrologers",
    subtitle:
      "Premium Astrologers Hand-Picked From The Top 1% Of India's Most Trusted Astrologers",
    image: secondaryAstrologerImage,
    isPopular: false,
    knownFor: [
      "Kundli-based timelines for life events",
      "Practical remedies for career love marriage and business",
      "Major poojas and rituals performed with spiritual precision",
      "Comprehensive 3-year Dasha roadmap & transit alignments",
    ],
    consultationDetails: [
      "Duration: 90-minute session",
      "Schedule immediately with priority queue",
      "Couple consultation available at checkout",
    ],
    normalPrice: "₹5,100",
    urgentPrice: "₹5,500",
  },
];

const AstrologerPackages = ({
  heading = "Choose Your",
  highlightedHeading = "Expert Consultation",
  description = "Trusted astrologers with proven experience, ready to guide you with clarity and practical solutions",
  packages,
  mainAstrologerImage,
  secondaryAstrologerImage,
  astrologerName = "Vishal Bhardwaj",
  directAstrologerText,
  onBookConsultation,
}) => {
  const [packageModes, setPackageModes] = useState({
    essential: "normal",
    complete: "normal",
    premium: "normal",
  });

  const togglePackageMode = (pkgId, mode) => {
    setPackageModes((prev) => ({ ...prev, [pkgId]: mode }));
  };

  const consultationPackages =
    packages ||
    getDefaultPackages(mainAstrologerImage, secondaryAstrologerImage, astrologerName);

  return (
    <section
      id="packages"
      className="reveal-on-scroll scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#eab12c]/[0.04] blur-[120px]" />

      <div className="relative mx-auto max-w-[1280px]">
        {/* Section Header (Matching Screenshot) */}
        <div className="mx-auto mb-14 max-w-[850px] text-center sm:mb-16">
          <h2 className="font-serif text-[38px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[48px] lg:text-[54px]">
            {heading} <span className="text-[#d4872b]">{highlightedHeading}</span>
          </h2>

          <p className="mx-auto mt-4 max-w-[650px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
            {description}
          </p>
        </div>

        {/* 3-Column Consultation Cards (Matching Screenshot Layout) */}
        <div className="grid items-stretch gap-8 lg:grid-cols-3">
          {consultationPackages.map((pkg) => {
            const currentMode = packageModes[pkg.id] || "normal";
            const displayPrice =
              currentMode === "urgent" ? pkg.urgentPrice : pkg.normalPrice;

            return (
              <div
                key={pkg.id}
                className={`group relative flex flex-col justify-between rounded-[22px] border-2 transition-all duration-300 ${
                  pkg.isPopular
                    ? "border-[#d4872b] bg-gradient-to-b from-[#fffaf0] via-[#fffbf3] to-[#fbf4e6] shadow-[0_16px_45px_rgba(212,135,43,0.18)] ring-2 ring-[#eab12c]/40"
                    : "border-[#d4872b]/60 bg-gradient-to-b from-[#fffdfa] via-[#fffbf2] to-[#fbf4e6] shadow-[0_10px_30px_rgba(80,60,30,0.08)] hover:border-[#d4872b] hover:shadow-[0_16px_40px_rgba(212,135,43,0.14)]"
                }`}
              >
                {/* Top Most Popular Ribbon Banner */}
                {pkg.isPopular && (
                  <div className="rounded-t-[18px] bg-gradient-to-r from-[#eab12c] via-[#f5ce6f] to-[#eab12c] py-2 text-center text-[13px] font-bold tracking-wide text-[#1c1308] shadow-sm">
                    Most Popular
                  </div>
                )}

                {/* Card Main Content */}
                <div
                  className={`flex flex-1 flex-col p-6 sm:p-7 ${
                    pkg.isPopular ? "pt-5" : "pt-7"
                  }`}
                >
                  {/* Top Astrologer Portrait (Matching Screenshot) */}
                  <div className="flex justify-center">
                    <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full border-2 border-[#eab12c] bg-[#fffaf0] shadow-[0_6px_20px_rgba(43,36,29,0.12)]">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mt-5 text-center">
                    <h3 className="font-serif text-[23px] font-bold text-[#2b241d]">
                      {pkg.title}
                    </h3>
                    <p className="mx-auto mt-2 max-w-[300px] text-[12.5px] font-medium leading-relaxed text-[#685c4f]">
                      {pkg.subtitle}
                    </p>
                  </div>

                  {/* Diamond Divider 1 */}
                  <div className="my-5 flex items-center justify-center gap-2 text-[#d4872b]">
                    <span className="h-px w-10 bg-[#d4872b]/40" />
                    <span className="text-[11px]">✦</span>
                    <span className="h-px w-10 bg-[#d4872b]/40" />
                  </div>

                  {/* KNOWN FOR: Section */}
                  <div>
                    <p className="font-serif text-[14.5px] font-bold tracking-[0.08em] text-[#b36c1e]">
                      KNOWN FOR:
                    </p>
                    <ul className="mt-2.5 space-y-2">
                      {pkg.knownFor.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-[13px] leading-snug text-[#4a3d31]"
                        >
                          <span className="font-bold text-[#2b241d]">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CONSULTATION DETAILS: Section */}
                  <div className="mt-6">
                    <p className="font-serif text-[14.5px] font-bold tracking-[0.08em] text-[#b36c1e]">
                      CONSULTATION DETAILS:
                    </p>
                    <ul className="mt-2.5 space-y-2">
                      {pkg.consultationDetails.map((detail, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-[13px] leading-snug text-[#4a3d31]"
                        >
                          <span className="text-[#d4872b]">🎯</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Diamond Divider 2 */}
                  <div className="my-5 flex items-center justify-center gap-2 text-[#d4872b]">
                    <span className="h-px w-10 bg-[#d4872b]/40" />
                    <span className="text-[11px]">✦</span>
                    <span className="h-px w-10 bg-[#d4872b]/40" />
                  </div>

                  {/* MODE: Toggle (Normal vs Urgent) */}
                  <div className="mt-auto flex items-center justify-between border-t border-[#f0e2cd]/70 pt-4">
                    <span className="font-serif text-[14.5px] font-bold tracking-wide text-[#2b241d]">
                      MODE:
                    </span>
                    <div className="flex items-center gap-1 rounded-full border border-[#d6b8a0] bg-[#f8edd8] p-1">
                      <button
                        type="button"
                        onClick={() => togglePackageMode(pkg.id, "normal")}
                        className={`rounded-full px-3.5 py-1 text-[12px] font-bold transition-all ${
                          currentMode === "normal"
                            ? "bg-[#3d2c1d] text-[#fffaf0] shadow-sm"
                            : "text-[#685c4f] hover:text-[#2b241d]"
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePackageMode(pkg.id, "urgent")}
                        className={`rounded-full px-3.5 py-1 text-[12px] font-bold transition-all ${
                          currentMode === "urgent"
                            ? "bg-[#d4872b] text-[#1c1308] shadow-sm"
                            : "text-[#685c4f] hover:text-[#2b241d]"
                        }`}
                      >
                        Urgent
                      </button>
                    </div>
                  </div>

                  {/* Bottom Price & Consult Now Row */}
                  <div className="mt-5 flex items-center justify-between border-t-2 border-[#ead8b8] pt-4">
                    <div>
                      <p className="text-[11.5px] font-semibold text-[#75695c]">
                        Price : (Incl GST)
                      </p>
                      <p className="font-serif text-[25px] font-bold tracking-tight text-[#2b241d]">
                        {displayPrice}/-
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onBookConsultation}
                      className="rounded-xl bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dfa420] px-6 py-3 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.3)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_6px_22px_rgba(234,177,44,0.4)]"
                    >
                      Consult Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Micro-Trust Bar */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-[#ead8b8] bg-[#f8edd8]/60 px-6 py-4 text-center">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#d4872b]" />
            <span className="text-[12px] font-semibold text-[#5a4d40]">
              100% Confidential Consultation
            </span>
          </div>
          <span className="hidden text-[#d4872b]/50 sm:inline">✦</span>
          <div className="flex items-center gap-2">
            <UserRound size={16} className="text-[#d4872b]" />
            <span className="text-[12px] font-semibold text-[#5a4d40]">
              {directAstrologerText || `Direct 1-on-1 with Astrologer ${astrologerName}`}
            </span>
          </div>
          <span className="hidden text-[#d4872b]/50 sm:inline">✦</span>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#d4872b]" />
            <span className="text-[12px] font-semibold text-[#5a4d40]">
              Flexible Slot Scheduling & Rescheduling
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstrologerPackages;
