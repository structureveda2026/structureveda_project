import React from "react";
import {
  Flame,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import homaBookingHeroImg from "../../../assets/images/homa/how-booking-works/homa-booking-hero.jpg";
import step1Img from "../../../assets/images/homa/how-booking-works/step-1-select-homa.jpg";
import step2Img from "../../../assets/images/homa/how-booking-works/step-2-configure-ceremony.jpg";
import step3Img from "../../../assets/images/homa/how-booking-works/step-3-choose-date-venue.jpg";
import step4Img from "../../../assets/images/homa/how-booking-works/step-4-yajman-sankalpa.jpg";
import step5Img from "../../../assets/images/homa/how-booking-works/step-5-review-dakshina.jpg";
import step6Img from "../../../assets/images/homa/how-booking-works/step-6-payment-confirmation.jpg";

const BOOKING_STEPS = [
  {
    step: "01",
    title: "Select Homa",
    desc: "Browse Shastric categories and choose the sacred fire ritual suited to your spiritual intention.",
    image: step1Img,
    alt: "Vedic scripture manuscript with sacred rudraksha and marigold petals",
  },
  {
    step: "02",
    title: "Configure Ceremony",
    desc: "Select supported Havan counts (1, 3, 5, 7, 11) and the available duration.",
    image: step2Img,
    alt: "Sacred stepped copper Havan Kund with pure rising sacred flames",
  },
  {
    step: "03",
    title: "Choose Date & Venue",
    desc: "Select the commencement date, Vedic Muhurta and arrangement mode (Kashi or Remote).",
    image: step3Img,
    alt: "Traditional Vedic Panchang calendar scroll with brass Kalash and flowers",
  },
  {
    step: "04",
    title: "Enter Yajman & Sankalpa",
    desc: "Provide devotee details, family Gotra, Janma Nakshatra and prayer intention.",
    image: step4Img,
    alt: "Handwritten Sanskrit Sankalpa parchment scroll with sacred thread and vessel",
  },
  {
    step: "05",
    title: "Review Dakshina",
    desc: "Review the transparent Dakshina breakdown, including the configured Samagri and Acharyas.",
    image: step5Img,
    alt: "Brass Puja thali with consecrated silk dakshina pouch, betel leaves and coins",
  },
  {
    step: "06",
    title: "Payment & Confirmation",
    desc: "Complete secure payment and receive your booking reference and ritual coordination details.",
    image: step6Img,
    alt: "Consecrated copper medallion seal with sacred Om and Vedic yantra on red silk",
  },
];

export default function HomaWorkflowSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#FFFDF9] border-b border-[#EAD8B8]" id="booking-workflow">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================
            HEADER WITH DECORATIVE MOTIF
        ========================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10.5px] uppercase tracking-[0.24em] text-[#B7791F] font-bold block mb-2">
            TRANSPARENT CEREMONY ARRANGEMENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#29231B] leading-tight">
            How Homa Booking Works
          </h2>

          {/* Decorative Vedic Motif */}
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B7791F]/50" />
            <Sparkles className="w-4 h-4 text-[#B7791F]" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B7791F]/50" />
          </div>

          <p className="text-sm sm:text-base text-[#766D60] leading-relaxed max-w-2xl mx-auto">
            From selecting your Homa to receiving confirmation, experience a simple, guided and transparent booking process.
          </p>
        </div>

        {/* =========================================================
            MAIN CONTENT: TWO-COLUMN ASYMMETRICAL LAYOUT
        ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* LEFT COLUMN: LARGE CEREMONY PHOTOGRAPH (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="relative h-full min-h-[380px] lg:min-h-full rounded-[24px] border border-[#EAD8B8] overflow-hidden bg-[#1E130B] shadow-md group">
              <img
                src={homaBookingHeroImg}
                alt="Sacred Vedic Homa ceremony with stepped copper Kund, sacred fire and offerings"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140C06]/90 via-[#140C06]/30 to-transparent pointer-events-none" />

              {/* Bottom Inset Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#B7791F] text-[10.5px] font-bold uppercase tracking-wider backdrop-blur-xs mb-2">
                  <Flame size={12} />
                  <span>Vedic Agni Rituals</span>
                </span>
                <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-white leading-snug drop-shadow-xs">
                  Authentic Kashi Agnihotra
                </h3>
                <p className="mt-1.5 text-[12.5px] text-amber-100/90 leading-relaxed">
                  Every ritual follows authentic Shastric Vidhi with initiated Acharyas, dedicated Sankalpa recitation, and consecrated offerings.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 6 BOOKING STEPS (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {BOOKING_STEPS.map((item, idx) => (
                <div
                  key={item.step}
                  className="relative group flex flex-col justify-between rounded-2xl border border-[#EAD8B8] bg-[#FFFAF0] p-4.5 sm:p-5 shadow-2xs transition-all duration-300 hover:border-[#B7791F] hover:bg-white hover:shadow-xs hover:-translate-y-0.5"
                >
                  <div>
                    {/* Top Step Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-[#EAD8B8] font-mono text-[11px] font-bold text-[#B7791F] shadow-2xs group-hover:bg-[#B7791F] group-hover:text-white transition-colors">
                          {item.step}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B7791F]">
                          STEP {item.step}
                        </span>
                      </div>
                    </div>

                    {/* Step Visual Image */}
                    <div className="h-28 sm:h-32 w-full overflow-hidden rounded-xl border border-[#EAD8B8]/70 bg-white mb-3.5">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Text Details */}
                    <h4 className="font-serif text-[16px] font-bold text-[#29231B] mb-1.5 group-hover:text-[#8C4A00] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[12px] sm:text-[12.5px] text-[#766D60] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Desktop Sequential Arrow Indicator between columns */}
                  {(idx === 0 || idx === 1 || idx === 3 || idx === 4) && (
                    <div className="hidden xl:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 items-center justify-center rounded-full bg-white border border-[#EAD8B8] text-[#B7791F] shadow-2xs pointer-events-none group-hover:border-[#B7791F]">
                      <ArrowRight size={11} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM ASSURANCE TRUST BAR
        ========================================================== */}
        <div className="mt-12 sm:mt-14 max-w-[1020px] mx-auto rounded-2xl border border-[#EAD8B8] bg-[#FFFAF0] p-4 sm:p-5 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-[#EAD8B8]/80">
            {/* Point 1 */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 sm:pt-0 sm:px-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#EAD8B8] flex items-center justify-center text-[#2E7D32] shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <span className="font-serif font-bold text-[13.5px] sm:text-[14px] text-[#29231B] block">
                  Guided &amp; Transparent Process
                </span>
                <span className="text-[11.5px] text-[#766D60]">
                  Clear steps, verified Dakshina, and updates
                </span>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-3 sm:pt-0 sm:px-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#EAD8B8] flex items-center justify-center text-[#B7791F] shrink-0">
                <Flame size={16} />
              </div>
              <div>
                <span className="font-serif font-bold text-[13.5px] sm:text-[14px] text-[#29231B] block">
                  As Per Vedic Tradition
                </span>
                <span className="text-[11.5px] text-[#766D60]">
                  Scripturally authorized counts &amp; Vidhi
                </span>
              </div>
            </div>

            {/* Point 3 */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-3 sm:pt-0 sm:px-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#EAD8B8] flex items-center justify-center text-[#1D5E9E] shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <span className="font-serif font-bold text-[13.5px] sm:text-[14px] text-[#29231B] block">
                  Dedicated Ritual Support
                </span>
                <span className="text-[11.5px] text-[#766D60]">
                  Direct coordination with Kashi Acharyas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
