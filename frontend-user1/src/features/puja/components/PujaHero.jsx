import { Calendar, MapPin, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import pujaBgImage from "../../../assets/images/puja_bg_image.jpg";

const PujaHero = ({ puja, onBookClick }) => {
  if (!puja) return null;

  return (
    <section className="relative overflow-hidden border-b border-[#ead8b8] bg-[#1a1109] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      {/* Background Image Ambient Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={pujaBgImage}
          alt=""
          className="h-full w-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#170e06]/95 via-[#1c1208]/85 to-[#170e06]/95" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120a04]/80 via-transparent to-[#fffaf0]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px]">
        {/* Desktop: 2 Columns (Image Left, Content Right) | Mobile: Image Top, Content Below */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* LEFT: Large Puja Image */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[28px] border-2 border-[#d6b8a0] bg-[#e8c99e] p-1.5 shadow-[0_20px_50px_rgba(43,36,29,0.12)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-[#1d140d]">
                <img
                  src={puja.image}
                  alt={puja.name}
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b120a]/75 via-transparent to-transparent" />

                {/* Floating Badge */}
                {puja.badge && (
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#1c130b]/85 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md shadow-md">
                      <Sparkles size={12} className="text-[#eab12c]" />
                      {puja.badge}
                    </span>
                  </div>
                )}

                {/* Temple / Kshetra Tag */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="flex items-center gap-1 text-[12px] font-medium text-[#f0e3ce]">
                    <MapPin size={13} className="text-[#eab12c]" />
                    {puja.temple}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Puja Details & Primary Booking CTA */}
          <div className="space-y-6 lg:col-span-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f5cf73]/40 bg-[#2b1b0e]/85 px-4 py-1.5 backdrop-blur-sm shadow-sm">
              <Sparkles size={13} className="text-[#f7c844]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#fce59f]">
                {puja.eyebrow}
              </span>
            </div>

            {/* Puja Title */}
            <h1 className="font-serif text-[36px] font-bold leading-[1.12] tracking-[-0.025em] text-[#fffdf8] drop-shadow-sm sm:text-[46px] lg:text-[52px]">
              {puja.name}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="font-serif text-[18px] italic leading-snug text-[#f7d692] sm:text-[20px]">
              "{puja.tagline}"
            </p>

            {/* Short Description */}
            <p className="text-[15px] leading-relaxed text-[#faebdc] sm:text-[16px]">
              {puja.description}
            </p>

            {/* Key Meta Badges (Date, Location, Deity) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 rounded-xl border border-[#e6cca0]/30 bg-[#24170d]/80 px-3.5 py-2 text-[13px] font-semibold text-[#fdf6ec]">
                <Calendar size={15} className="text-[#f7c844]" />
                <span>{puja.formattedDate}</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[#e6cca0]/30 bg-[#24170d]/80 px-3.5 py-2 text-[13px] font-semibold text-[#fdf6ec]">
                <MapPin size={15} className="text-[#f7c844]" />
                <span>{puja.location}</span>
              </div>
            </div>

            {/* Starting Price & Book CTA Row */}
            <div className="flex flex-col gap-4 border-t border-[#ead8b8]/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#edd5be]">
                  Participation Starts At
                </span>
                <p className="font-serif text-[32px] font-bold text-[#fffdf8]">
                  {puja.formattedPrice}
                  <span className="ml-1.5 text-[12px] font-medium text-[#edd5be]/80">
                    (Incl. Samagri & Sankalp)
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={onBookClick}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-8 py-4 text-[14px] font-bold tracking-wide text-[#2b241d] shadow-[0_10px_28px_rgba(234,177,44,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(234,177,44,0.4)]"
              >
                <span>Book This Puja</span>
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* Trust Micro-Badge */}
            <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#faebd8]">
              <ShieldCheck size={16} className="text-[#f7c844]" />
              <span>100% Authentic Vedic Vidhi with Video Proof & Sacred Prasadam Dispatch</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default PujaHero;
