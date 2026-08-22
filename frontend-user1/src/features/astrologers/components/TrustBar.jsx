import { Sparkles, UserRound, ShieldCheck, MapPin } from "lucide-react";

const TrustBar = () => {
  return (
    <section className="relative overflow-hidden border-y border-[#ead8b8]/70 bg-gradient-to-b from-white to-[#fffaf2]">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eab12c]/[0.03] blur-[100px]" />

      <div className="relative overflow-hidden py-7 sm:py-9">
        <div className="flex w-max animate-[veda-marquee_32s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
          {/* Duplicated 2 Sets for Seamless Seamless Loop */}
          {[0, 1].map((setIndex) => (
            <div
              key={`trust-set-${setIndex}`}
              className="flex items-center"
              aria-hidden={setIndex === 1 ? "true" : undefined}
            >
              {[
                {
                  label: "Vedic Astrology",
                  description: "Ancient Sanatan Jyotish principles",
                  Icon: Sparkles,
                },
                {
                  label: "Personalized Guidance",
                  description: "Accurate Kundali & Dasha analysis",
                  Icon: UserRound,
                },
                {
                  label: "100% Confidential",
                  description: "Private & secure consultation",
                  Icon: ShieldCheck,
                },
                {
                  label: "Kashi / Varanasi",
                  description: "Rooted in authentic holy traditions",
                  Icon: MapPin,
                },
              ].map(({ label, description, Icon }, index) => (
                <div
                  key={`${label}-${setIndex}-${index}`}
                  className="flex items-center"
                >
                  {/* Trust Card */}
                  <div className="group mx-3.5 flex min-w-[240px] items-center gap-3.5 rounded-[22px] border border-[#e6caa0] bg-[#fff6e0]/85 px-5 py-4 shadow-[0_6px_20px_rgba(180,125,30,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#eab12c] hover:bg-[#ffedc6] hover:shadow-[0_12px_28px_rgba(180,125,30,0.14)] sm:mx-4 sm:min-w-[260px]">
                    {/* Icon Circle */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e6caa0] bg-[#fffaf0] text-[#d4872b] shadow-[0_3px_10px_rgba(180,125,30,0.08)] transition-all duration-300 group-hover:scale-110 group-hover:border-[#eab12c] group-hover:bg-[#eab12c] group-hover:text-[#2b241d]">
                      <Icon size={18} strokeWidth={1.8} />
                    </div>

                    {/* Text Details */}
                    <div>
                      <p className="text-[13.5px] font-bold text-[#2b241d] transition-colors duration-300 group-hover:text-[#a86616]">
                        {label}
                      </p>
                      <p className="text-[11.5px] leading-tight text-[#75695c]">
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* Star Separator */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center text-[#d4872b]/60">
                    <span className="text-[10px]">✦</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Keyframes */}
      <style>{`
        @keyframes veda-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default TrustBar;
