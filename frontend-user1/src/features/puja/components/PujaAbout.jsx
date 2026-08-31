import {
  Sparkles,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Video,
} from "lucide-react";

import defaultPujaAboutImage from "../../../assets/images/puja_about.png";

const PujaAbout = ({ puja }) => {
  if (!puja) return null;

  // Prefer dynamic puja image first, then fallback image
  const aboutImage =
    defaultPujaAboutImage;

  const highlights = [
    {
      icon: ShieldCheck,
      title: "Authentic Vedic Vidhi",
      description: "Performed according to traditional Vedic rituals.",
    },
    {
      icon: UserCheck,
      title: "Experienced Acharyas",
      description: "Guided by experienced Vedic priests and Acharyas.",
    },
    {
      icon: CheckCircle2,
      title: "Personalized Sankalp",
      description: "Your name, Gotra and intentions are included.",
    },
    {
      icon: Video,
      title: "Video & Prasad",
      description: "Receive ritual updates and sacred Prasad.",
    },
  ];

  return (
    <section
      id="about-puja"
      className="border-b border-[#ead8b8] bg-[#fffdfa] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1320px]">

        {/* =========================================================
            MAIN CONTENT
        ========================================================== */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">

          {/* =========================================================
              LEFT: ABOUT CONTENT
              Desktop -> Left
              Mobile  -> Below Image
          ========================================================== */}
          <div className="order-2 lg:order-1 lg:col-span-7">

            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-2">
              <Sparkles
                size={14}
                strokeWidth={1.8}
                className="text-[#c77722]"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#b36c1e] sm:text-[11px]">
                Sacred Overview
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-serif text-[32px] font-medium leading-[1.12] text-[#2b241d] sm:text-[38px] lg:text-[44px] xl:text-[48px]">
              About the Puja
            </h2>

            {/* Small Decorative Line */}
            <div className="mt-5 flex items-center gap-2">
              <span className="h-[2px] w-12 rounded-full bg-[#d4872b]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
            </div>

            {/* Description */}
            <div className="mt-7 max-w-[760px] space-y-4 text-[15px] leading-[1.8] text-[#5e5143] sm:text-[16px]">
              <p>
                {puja.fullDescription || puja.description}
              </p>

              <p>
                In our ancient Vedic scriptures, participating in a
                consecrated Yagya or Abhishek invokes divine alignment
                between the microcosm of the devotee&apos;s life and the
                cosmic order (Rta). Every sacred mantra chanted during
                this ritual resonates with specific sonic frequencies
                that disperse stagnated energies and bestow auspicious
                clarity.
              </p>
            </div>

            {/* =====================================================
                KEY RITUAL DELIVERABLES
            ====================================================== */}
            <div className="mt-9">

              {/* Section Label */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7c6b] sm:text-[11px]">
                  Key Ritual Deliverables
                </span>

                <span className="hidden h-px flex-1 bg-[#ead8b8] sm:ml-5 sm:block" />
              </div>

              {/* Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {highlights.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className={[
                        "group relative overflow-hidden rounded-2xl border px-4 py-4",
                        "transition-all duration-300",
                        "hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(139,91,36,0.08)]",
                        index % 2 === 0
                          ? "border-[#ead8b8] bg-[#fff8ec]"
                          : "border-[#e8d6bd] bg-[#fdf4e7]",
                      ].join(" ")}
                    >
                      {/* Subtle decorative glow */}
                      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#eab12c]/[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="relative flex items-start gap-3">

                        {/* Icon */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e8c995] bg-[#fffdfa]">
                          <Icon
                            size={17}
                            strokeWidth={1.8}
                            className="text-[#c77722]"
                          />
                        </div>

                        {/* Text */}
                        <div className="min-w-0">
                          <h3 className="text-[13px] font-semibold text-[#3d3226] sm:text-[14px]">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-[11.5px] leading-relaxed text-[#7a6a58] sm:text-[12px]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* =========================================================
              RIGHT: SACRED IMAGE
              Desktop -> Right
              Mobile  -> Top
          ========================================================== */}
          <div className="order-1 lg:order-2 lg:col-span-5">

            <div className="group relative">

              {/* Outer Decorative Frame */}
              <div className="relative rounded-[28px] border-2 border-[#e6caa0] bg-[#fffdfa] p-2 shadow-[0_18px_55px_rgba(80,60,30,0.08)] transition-all duration-500 group-hover:border-[#d9b47b] group-hover:shadow-[0_22px_65px_rgba(139,91,36,0.12)] sm:p-2.5">

                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[21px] bg-[#241a12] sm:aspect-[5/4] lg:aspect-[4/3]">

                  <img
                    src={aboutImage}
                    alt={`About ${puja.name}`}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    loading="lazy"
                  />

                  {/* Bottom Gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b120a]/65 via-transparent to-transparent" />

                  {/* Top Decorative Glow */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#000]/20 to-transparent" />

                  {/* Location / Kshetra Badge */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3.5 py-2 text-[11px] font-medium text-[#f5e8d2] shadow-lg backdrop-blur-md sm:text-[12px]">
                      <Sparkles
                        size={13}
                        strokeWidth={1.8}
                        className="shrink-0 text-[#eab12c]"
                      />

                      <span className="truncate">
                        {puja.temple ||
                          puja.location ||
                          "Vedic Kshetra"}
                      </span>
                    </div>
                  </div>

                  {/* Small Image Accent */}
                  <div className="pointer-events-none absolute right-4 top-4 h-8 w-8 rounded-full border border-[#f1c86c]/40 bg-black/20 backdrop-blur-sm" />
                </div>
              </div>

              {/* Soft Background Decoration */}
              <div className="pointer-events-none absolute -bottom-5 -right-5 -z-10 h-28 w-28 rounded-full bg-[#eab12c]/10 blur-3xl" />
              <div className="pointer-events-none absolute -left-5 -top-5 -z-10 h-24 w-24 rounded-full bg-[#d4872b]/10 blur-3xl" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default PujaAbout;