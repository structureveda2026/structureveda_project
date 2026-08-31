import { Sparkles, Flame, ShieldCheck, UserCheck, CheckCircle2, Video } from "lucide-react";
import defaultAboutImage from "../../../assets/images/puja_about.png";

const YagyaAbout = ({ yagya }) => {
  if (!yagya) return null;

  const aboutImage =
    (Array.isArray(yagya.images) && yagya.images.length > 2 ? yagya.images[2] : null) ||
    defaultAboutImage;

  return (
    <section className="border-b border-[#ead8b8] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          
          {/* LEFT: CONTENT */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            {/* Eyebrow */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              <Sparkles size={13} className="text-[#c77722]" />
              <span>SACRED OVERVIEW</span>
            </div>

            {/* Heading */}
            <h2 className="mt-3 font-serif text-[28px] font-bold leading-tight text-[#2b241d] sm:text-[34px] lg:text-[40px]">
              About the {yagya.name}
            </h2>

            {/* Decorative Accent */}
            <div className="mt-4 flex items-center gap-2">
              <span className="h-[2px] w-12 rounded-full bg-[#d4872b]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
            </div>

            {/* Detailed Description */}
            <div className="mt-6 space-y-3.5 text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#5e5143]">
              <p>{yagya.fullDescription || yagya.description}</p>
              <p>
                In the Vedic paradigm, Agni (the sacred fire) acts as the direct cosmic portal (Havyavahana) carrying consecrated oblations directly to divine realms. Every Sanskrit mantra chanted with specific swaras during this Yagya purifies the devotee&apos;s auric field, releases stagnant karmic stress, and awakens holistic prosperity.
              </p>
            </div>

            {/* Key Deliverables Grid */}
            <div className="mt-8">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                Key Ritual Deliverables
              </span>

              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                <div className="flex items-center gap-2.5 rounded-xl border border-[#ead8b8] bg-[#fffaf0] px-3.5 py-2.5 text-[13px] font-medium text-[#3d3226] shadow-2xs">
                  <ShieldCheck size={16} className="shrink-0 text-[#d4872b]" />
                  <span>100% Authentic Vedic Vidhi</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-[#ead8b8] bg-[#fffaf0] px-3.5 py-2.5 text-[13px] font-medium text-[#3d3226] shadow-2xs">
                  <UserCheck size={16} className="shrink-0 text-[#d4872b]" />
                  <span>Senior Certified Kashi Purohits</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-[#ead8b8] bg-[#fffaf0] px-3.5 py-2.5 text-[13px] font-medium text-[#3d3226] shadow-2xs">
                  <CheckCircle2 size={16} className="shrink-0 text-[#d4872b]" />
                  <span>Personalized Name & Gotra Sankalp</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-[#ead8b8] bg-[#fffaf0] px-3.5 py-2.5 text-[13px] font-medium text-[#3d3226] shadow-2xs">
                  <Video size={16} className="shrink-0 text-[#d4872b]" />
                  <span>HD Video Proof & Holy Bhasma</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SACRED IMAGE */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <div className="group relative">
              <div className="relative rounded-[28px] border-2 border-[#e6caa0] bg-[#fffdfa] p-2 shadow-[0_18px_55px_rgba(80,60,30,0.08)] transition-all duration-500 group-hover:border-[#d9b47b] group-hover:shadow-[0_22px_65px_rgba(139,91,36,0.12)] sm:p-2.5">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[21px] bg-[#241a12] sm:aspect-[5/4] lg:aspect-[4/3]">
                  <img
                    src={aboutImage}
                    alt={`About ${yagya.name}`}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b120a]/65 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-2 text-[11px] font-medium text-[#f5e8d2] shadow-lg backdrop-blur-md sm:text-[12px]">
                      <Flame size={14} className="shrink-0 text-[#eab12c]" />
                      <span className="truncate">{yagya.deity || "Vedic Homa"} • {yagya.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default YagyaAbout;
